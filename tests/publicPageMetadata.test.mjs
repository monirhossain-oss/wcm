import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import test from 'node:test';

const require = createRequire(import.meta.url);
const React = require('react');
const { transformSync } = require('next/dist/compiled/babel/core');
const root = new URL('../', import.meta.url);
const source = (path) => readFileSync(new URL(path, root), 'utf8');
const env = { NEXT_PUBLIC_SITE_URL: 'https://site.test', NEXT_PUBLIC_API_BASE_URL: 'https://api.test' };

function load(path, mocks = {}, globals = {}) {
  const { code } = transformSync(source(path), {
    filename: path, babelrc: false, configFile: false,
    presets: [
      [require.resolve('next/dist/compiled/babel/preset-env'), { targets: { node: 'current' }, modules: 'commonjs' }],
      [require.resolve('next/dist/compiled/babel/preset-react'), { runtime: 'classic' }],
    ],
  });
  const loaded = { exports: {} };
  vm.runInNewContext(code, {
    module: loaded, exports: loaded.exports, React, URL, Headers, console, setTimeout, clearTimeout,
    process: { env }, ...globals,
    require: (name) => (name in mocks ? mocks[name] : require(name)),
  });
  return loaded.exports;
}

const site = load('src/lib/seo/siteConfig.js');
const registry = load('src/lib/seo/publicPageRegistry.js');
const i18n = load('src/lib/i18n/index.js', {
  './catalogs/en': load('src/lib/i18n/catalogs/en.js'),
  './catalogs/fr': load('src/lib/i18n/catalogs/fr.js'),
  '@/lib/seo/publicPageRegistry': registry,
});
const catalogs = { en: i18n.catalogs.en, fr: i18n.catalogs.fr };
const brandTitle = load('src/lib/seo/brandTitle.js');
const indexing = load('src/lib/seo/indexing.js', {
  '@/constants/continentData': load('src/constants/continentData.js'),
  '@/lib/exploreSlug': load('src/lib/exploreSlug.js'),
});

// Builds the metadata module with stubbed SEO records and published languages.
// `records` is keyed `<seoKey>:<languageCode>`; anything absent behaves like the API's 404.
function metadataModule({ records = {}, languages = ['en', 'fr'] } = {}) {
  const requested = [];
  const localized = load('src/lib/localizedMetadata.js', { '@/lib/seo/siteConfig': site }, {
    fetch: async () => ({ ok: true, json: async () => ({ data: languages.map((code) => ({ code })) }) }),
  });
  const api = {
    getSeoByPage: async (pageName, languageCode = 'en') => {
      requested.push(`${pageName}:${languageCode}`);
      return records[`${pageName}:${languageCode}`] || null;
    },
  };
  const publishedLanguages = load('src/lib/seo/publishedLanguages.js', {}, {
    fetch: async () => ({ ok: true, json: async () => ({ data: languages.map((code) => ({ code })) }) }),
  });
  const pageMetadata = load('src/lib/seo/pageMetadata.js', {
    './brandTitle': load('src/lib/seo/brandTitle.js'),
    './publicPageRegistry': registry, './siteConfig': site, './indexing': indexing,
    './publishedLanguages': publishedLanguages,
    '@/lib/api': api, '@/lib/i18n': i18n, '@/lib/localizedMetadata': localized,
  });
  return { ...pageMetadata, requested, api, i18n, localized };
}

const englishRecord = {
  title: 'English Admin Title', description: 'English admin description.',
  keywords: ['english', 'admin'], ogImage: '/english.jpg', imageAlt: 'English alt',
};
const frenchRecord = {
  title: 'Titre administrateur', description: 'Description administrateur.',
  keywords: ['français', 'admin'], ogImage: 'https://cdn.test/french.jpg', imageAlt: 'Texte alternatif français',
};

test('each language uses only its own SEO record for text, image and alt', async () => {
  const module = metadataModule({ records: { 'about:en': englishRecord, 'about:fr': frenchRecord } });

  const english = await module.buildPageMetadata({ pageId: 'about', locale: 'en' });
  assert.equal(english.title.absolute, 'English Admin Title | World Culture Marketplace');
  assert.equal(english.description, 'English admin description.');
  assert.deepEqual(english.keywords, ['english', 'admin']);
  assert.equal(english.openGraph.images[0].url, 'https://site.test/english.jpg');
  assert.equal(english.openGraph.images[0].alt, 'English alt');
  assert.equal(english.twitter.images[0].url, 'https://site.test/english.jpg');

  const french = await module.buildPageMetadata({ pageId: 'about', locale: 'fr' });
  assert.equal(french.title.absolute, 'Titre administrateur | World Culture Marketplace');
  assert.equal(french.description, 'Description administrateur.');
  assert.deepEqual(french.keywords, ['français', 'admin']);
  assert.equal(french.openGraph.images[0].url, 'https://cdn.test/french.jpg');
  assert.equal(french.openGraph.images[0].alt, 'Texte alternatif français');

  assert.deepEqual(module.requested, ['about:en', 'about:fr']);
});

test('a missing French record falls back to French catalog text, never to the English record', async () => {
  const module = metadataModule({ records: { 'about:en': englishRecord } });
  const french = await module.buildPageMetadata({ pageId: 'about', locale: 'fr' });
  const serialized = JSON.stringify(french);

  assert.equal(french.title.absolute, `${catalogs.fr.seo.about.title} | World Culture Marketplace`);
  assert.equal(french.description, catalogs.fr.seo.about.description);
  assert.deepEqual(french.keywords, catalogs.fr.seo.about.keywords);
  assert.equal(french.openGraph.images[0].url, 'https://site.test/og-image.jpg');
  assert.equal(french.openGraph.images[0].alt, catalogs.fr.seo.defaultImageAlt);
  for (const englishText of [englishRecord.title, englishRecord.description, 'English alt', '/english.jpg', catalogs.en.seo.about.description]) {
    assert.ok(!serialized.includes(englishText), `French metadata leaked English text: ${englishText}`);
  }
  assert.deepEqual(module.requested, ['about:fr']);
});

test('every managed page has French catalog text distinct from the English catalog', () => {
  const managed = registry.PUBLIC_SEO_PAGES.filter(({ seoKey }) => seoKey);
  assert.equal(managed.length, 15);
  for (const { id } of managed) {
    const en = catalogs.en.seo[id];
    const fr = catalogs.fr.seo[id];
    assert.ok(en?.title && en?.description && en?.keywords?.length, `English catalog missing for ${id}`);
    assert.ok(fr?.title && fr?.description && fr?.keywords?.length, `French catalog missing for ${id}`);
    if (id !== 'home') assert.notEqual(fr.description, en.description, `French description not translated for ${id}`);
  }
});

test('canonical stays in the current language and hreflang alternates are reciprocal', async () => {
  const module = metadataModule();
  const english = await module.buildPageMetadata({ pageId: 'contact', locale: 'en' });
  const french = await module.buildPageMetadata({ pageId: 'contact', locale: 'fr' });

  assert.equal(english.alternates.canonical, 'https://site.test/contact');
  assert.equal(french.alternates.canonical, 'https://site.test/fr/contact');
  for (const metadata of [english, french]) {
    assert.deepEqual({ ...metadata.alternates.languages }, {
      en: 'https://site.test/contact',
      fr: 'https://site.test/fr/contact',
      'x-default': 'https://site.test/contact',
    });
  }
  assert.equal(english.openGraph.url, 'https://site.test/contact');
  assert.equal(french.openGraph.url, 'https://site.test/fr/contact');
  assert.equal(english.openGraph.locale, 'en_US');
  assert.equal(french.openGraph.locale, 'fr_FR');
  assert.equal(french.openGraph.siteName, 'World Culture Marketplace');
});

test('home and FAQ use their real mapped routes on both sides', async () => {
  const module = metadataModule();
  const home = await module.buildPageMetadata({ pageId: 'home', locale: 'fr' });
  assert.equal(home.alternates.canonical, 'https://site.test/fr');
  // absoluteSiteUrl (Stage 1) emits the bare origin for the English home route.
  assert.equal(home.alternates.languages.en, 'https://site.test');
  assert.equal(home.alternates.languages['x-default'], 'https://site.test');

  for (const locale of ['en', 'fr']) {
    const faq = await module.buildPageMetadata({ pageId: 'faq', locale });
    assert.equal(faq.alternates.languages.en, 'https://site.test/faqUs');
    assert.equal(faq.alternates.languages.fr, 'https://site.test/fr/faq');
    assert.equal(faq.alternates.languages['x-default'], 'https://site.test/faqUs');
    assert.equal(faq.alternates.canonical, locale === 'en' ? 'https://site.test/faqUs' : 'https://site.test/fr/faq');
  }
});

test('an unpublished language drops its alternate but keeps x-default English', async () => {
  const module = metadataModule({ languages: ['en'] });
  const english = await module.buildPageMetadata({ pageId: 'blogs', locale: 'en' });
  assert.deepEqual(Object.keys(english.alternates.languages).sort(), ['en', 'x-default']);
  assert.equal(english.alternates.languages['x-default'], 'https://site.test/blogs');
});

// ── Self-referencing hreflang (issue 2) ────────────────────────────────────────────────────────

test('a page always advertises its own language, even when the language lookup fails', async () => {
  // The failure mode this guards: the lookup degrades to English alone, the French page keeps a
  // French canonical, and its alternates list only English — a cluster that disagrees with itself.
  const offline = load('src/lib/seo/publishedLanguages.js', {}, { fetch: async () => { throw new Error('offline'); } });
  const localized = load('src/lib/localizedMetadata.js', { '@/lib/seo/siteConfig': site });
  const pageMetadata = load('src/lib/seo/pageMetadata.js', {
    './brandTitle': load('src/lib/seo/brandTitle.js'),
    './publicPageRegistry': registry, './siteConfig': site, './indexing': indexing,
    './publishedLanguages': offline,
    '@/lib/api': { getSeoByPage: async () => null }, '@/lib/i18n': i18n, '@/lib/localizedMetadata': localized,
  });

  const french = await pageMetadata.buildPageMetadata({ pageId: 'about', locale: 'fr' });
  assert.equal(french.alternates.canonical, 'https://site.test/fr/about-us');
  assert.equal(french.alternates.languages.fr, french.alternates.canonical);
  assert.equal(french.alternates.languages['x-default'], 'https://site.test/about-us');

  const english = await pageMetadata.buildPageMetadata({ pageId: 'about', locale: 'en' });
  assert.equal(english.alternates.languages.en, english.alternates.canonical);
});

// Every indexable public page, in both languages, must ship the complete set. This walks the whole
// registry rather than sampling, so a page added later cannot quietly go out with half its metadata.
test('every managed page carries complete metadata in both languages', async () => {
  const metadataApi = metadataModule();
  const pages = registry.PUBLIC_SEO_PAGES.filter(({ seoKey, indexing }) => seoKey && indexing !== 'noindex');
  assert.ok(pages.length >= 15, `expected the managed pages, found ${pages.length}`);

  for (const page of pages) {
    for (const locale of ['en', 'fr']) {
      const where = `${page.id}:${locale}`;
      const metadata = await metadataApi.buildPageMetadata({ pageId: page.id, locale });
      const canonical = `https://site.test${page.paths[locale] === '/' ? '' : page.paths[locale]}`;

      // Title and description: present, and the brand suffix appears exactly once.
      const title = metadata.title.absolute;
      assert.ok(title && title.trim(), `${where}: title`);
      assert.equal((title.match(/World Culture Marketplace/g) || []).length, 1, `${where}: one brand suffix`);
      assert.ok(metadata.description && metadata.description.trim(), `${where}: description`);
      assert.ok(metadata.keywords?.length, `${where}: keywords`);

      // Canonical points at this page in this language, never at the other one.
      assert.equal(metadata.alternates.canonical, canonical, `${where}: canonical`);

      // hreflang: both languages plus x-default, and the page advertises itself.
      const languages = metadata.alternates.languages;
      assert.equal(languages[locale], canonical, `${where}: self-referencing hreflang`);
      assert.deepEqual(Object.keys(languages).sort(), ['en', 'fr', 'x-default'], `${where}: hreflang set`);
      assert.equal(languages['x-default'], languages.en, `${where}: x-default is the English URL`);

      // Social cards carry the same URL, the right locale and an image with alt text.
      assert.equal(metadata.openGraph.url, canonical, `${where}: og:url`);
      assert.equal(metadata.openGraph.locale, locale === 'fr' ? 'fr_FR' : 'en_US', `${where}: og:locale`);
      assert.equal(metadata.openGraph.title, title, `${where}: og:title`);
      assert.ok(metadata.openGraph.images?.[0]?.url, `${where}: og:image`);
      assert.ok(metadata.openGraph.images[0].alt, `${where}: og:image alt`);
      assert.equal(metadata.twitter.card, 'summary_large_image', `${where}: twitter card`);
      assert.ok(metadata.twitter.images?.[0]?.url, `${where}: twitter image`);

      // Indexable pages must not carry a robots override that would contradict the alternates.
      assert.equal(metadata.robots, undefined, `${where}: no noindex on an indexable page`);
    }
  }
});

test('a language list that omits English keeps the languages it does report', async () => {
  // The old gate discarded the whole payload unless English was in it, so a response listing only
  // French produced an English-only site.
  const lookup = load('src/lib/seo/publishedLanguages.js', {}, {
    fetch: async () => ({ ok: true, json: async () => ({ data: [{ code: 'fr' }] }) }),
  });
  const { locales, ok } = await lookup.getPublishedLanguages();
  assert.deepEqual([...locales].sort(), ['en', 'fr']);
  assert.equal(ok, true);
});

test('a failed lookup is reported as failed, not as an English-only site', async () => {
  const lookup = load('src/lib/seo/publishedLanguages.js', {}, { fetch: async () => ({ ok: false }) });
  const result = await lookup.getPublishedLanguages();
  assert.deepEqual([...result.locales], ['en']);
  assert.equal(result.ok, false);
  assert.equal(result.stale, false);
});

test('the brand suffix is applied exactly once', async () => {
  const module = metadataModule({
    records: {
      'privacy:en': { title: 'Privacy Policy | World Culture Marketplace', description: 'Stored description.' },
      'terms:en': { title: 'Terms & Conditions', description: 'Stored description.' },
    },
  });
  const brands = (value) => value.match(/World Culture Marketplace/g)?.length || 0;

  const withSuffix = await module.buildPageMetadata({ pageId: 'privacy-policy', locale: 'en' });
  assert.equal(withSuffix.title.absolute, 'Privacy Policy | World Culture Marketplace');
  assert.equal(brands(withSuffix.title.absolute), 1);
  assert.equal(withSuffix.openGraph.title, withSuffix.title.absolute);
  assert.equal(withSuffix.twitter.title, withSuffix.title.absolute);

  const withoutSuffix = await module.buildPageMetadata({ pageId: 'terms-and-conditions', locale: 'en' });
  assert.equal(withoutSuffix.title.absolute, 'Terms & Conditions | World Culture Marketplace');
  assert.equal(brands(withoutSuffix.title.absolute), 1);

  assert.equal(module.withBrand('Already World Culture Marketplace edition'), 'Already World Culture Marketplace edition');
  assert.equal(module.withBrand('  '), 'World Culture Marketplace');
});

test('explore keeps localized filter URLs and reuses the resolved record', async () => {
  const module = metadataModule({ records: { 'explore:fr': frenchRecord } });
  const resolved = await module.resolvePageSeo({ pageId: 'explore', locale: 'fr' });
  const metadata = await module.buildPageMetadata({
    pageId: 'explore', locale: 'fr', resolved,
    path: '/explore/pottery/asia', title: 'Poterie de Asie | Titre administrateur',
  });

  assert.equal(metadata.alternates.canonical, 'https://site.test/fr/explore/pottery/asia');
  assert.equal(metadata.alternates.languages.en, 'https://site.test/explore/pottery/asia');
  assert.equal(metadata.alternates.languages['x-default'], 'https://site.test/explore/pottery/asia');
  assert.equal(metadata.title.absolute, 'Poterie de Asie | Titre administrateur | World Culture Marketplace');
  assert.deepEqual(module.requested, ['explore:fr']);
});

// Loads the Explore page's own generateMetadata against stubbed categories, so the composition
// under test is the page's, not the shared helper's.
function exploreModule({ locale = 'en', records = {} } = {}) {
  const metadata = metadataModule({ records });
  const api = {
    ...metadata.api,
    getCategories: async () => [{ _id: 'c1', title: 'Textiles' }, { _id: 'c2', title: 'Pottery' }],
    // No published category translation: the page must then keep the name built from the URL.
    getLocalizedCategoryTitles: async () => new Map(),
  };
  return load('src/app/(public)/explore/[[...filters]]/page.jsx', {
    '../ExploreClient': { __esModule: true, default: () => null },
    '@/constants/continentData': load('src/constants/continentData.js'),
    '@/lib/api': api,
    '@/lib/seo/pageMetadata': metadata,
    '@/lib/seo/indexing': indexing,
    '@/lib/exploreSlug': load('src/lib/exploreSlug.js'),
    '@/lib/i18n': i18n,
  });
}

test('every filtered Explore URL describes its own filters, never one shared sentence', async () => {
  const storedExplore = { title: 'Stored explore title', description: 'Stored explore description used by the unfiltered page.' };
  for (const locale of ['en', 'fr']) {
    const page = exploreModule({ records: { 'explore:en': storedExplore, 'explore:fr': storedExplore } });
    const describe = async (filters) => (await page.generateMetadata({ params: Promise.resolve({ filters }), locale })).description;

    const categoryRegion = await describe(['textiles', 'asia']);
    const categoryOnly = await describe(['textiles']);
    const regionOnly = await describe(['asia']);
    const unfiltered = await describe([]);

    const filtered = [categoryRegion, categoryOnly, regionOnly];
    assert.equal(new Set(filtered).size, 3, locale + ': the three filter shapes must not share a description');
    for (const description of filtered) {
      assert.ok(description.length <= 160, locale + ': description is ' + description.length + ' chars: ' + description);
      assert.ok(description.length >= 60, locale + ': description is too thin: ' + description);
      assert.notEqual(description, storedExplore.description, locale + ': a filtered URL must not reuse the stored record');
      assert.ok(!description.includes('undefined'), locale + ': ' + description);
    }
    // The stored record still owns the unfiltered page — this change narrows where it applies, not whether.
    assert.equal(unfiltered, storedExplore.description, locale + ': /explore keeps its stored description');
    // Each description opens with the same filter name its title and H1 use.
    assert.ok(categoryRegion.startsWith('Textiles '), locale + ': ' + categoryRegion);
    assert.ok(categoryOnly.startsWith('Textiles '), locale + ': ' + categoryOnly);
    assert.ok(regionOnly.startsWith(i18n.translate(locale, 'explore.culturalHeritage')), locale + ': ' + regionOnly);
  }
});

test('French filter descriptions use the ready-made elided region phrases', async () => {
  const page = exploreModule();
  const describe = async (filters) => (await page.generateMetadata({ params: Promise.resolve({ filters }), locale: 'fr' })).description;
  // "de Asie" and "de Moyen-Orient" are the wrong forms these catalog phrases exist to avoid.
  assert.match(await describe(['textiles', 'asia']), /d\u2019Asie/);
  assert.match(await describe(['asia']), /d\u2019Asie/);
  assert.match(await describe(['middle-east']), /du Moyen-Orient/);
  for (const filters of [['textiles', 'asia'], ['asia'], ['middle-east']]) {
    assert.ok(!(await describe(filters)).includes('de Asie'), 'no unelided region name');
  }
});

test('no catalog title renders past the 60 characters a search result shows', () => {
  // The brand suffix costs 28 characters, so a catalog title that looks short can still render long.
  for (const locale of ['en', 'fr']) {
    for (const { id, seoKey } of registry.PUBLIC_SEO_PAGES) {
      if (!seoKey) continue;
      const rendered = brandTitle.withBrand(i18n.translate(locale, 'seo.' + id + '.title'));
      assert.ok(rendered.length <= 60, locale + ' ' + id + ': ' + rendered.length + ' chars - ' + rendered);
    }
  }
});

test('a filtered Explore title carries the filter and the brand, not the stored page title', async () => {
  const storedExplore = {
    title: 'Explore Global Cultural Collections - Handmade Crafts & Artisan Art | WCM',
    description: 'Stored explore description.',
  };
  for (const locale of ['en', 'fr']) {
    const page = exploreModule({ records: { 'explore:en': storedExplore, 'explore:fr': storedExplore } });
    const titleFor = async (filters) => (await page.generateMetadata({ params: Promise.resolve({ filters }), locale })).title.absolute;

    for (const filters of [['textiles', 'asia'], ['textiles'], ['asia']]) {
      const title = await titleFor(filters);
      assert.ok(!title.includes(storedExplore.title), locale + ': the stored page title must not stack into a filtered title');
      assert.ok(title.endsWith(' | World Culture Marketplace'), locale + ': ' + title);
      // A long category and a long region can still push past 60; what the template must not do is
      // add a second title of its own, which is what took these URLs past 120 characters.
      assert.ok(title.length <= 70, locale + ': ' + title.length + ' chars - ' + title);
    }
    // The unfiltered page still renders the stored title exactly as the admin wrote it.
    assert.equal(await titleFor([]), storedExplore.title + ' | World Culture Marketplace');
  }
});

test('an unmanaged page id is rejected instead of emitting broken metadata', async () => {
  const module = metadataModule();
  await assert.rejects(() => module.buildPageMetadata({ pageId: 'profile', locale: 'en' }), /Unknown managed SEO page/);
});

test('all managed page sources are wired to the shared helper', () => {
  const files = {
    home: 'page.jsx', about: 'about-us/page.jsx', contact: 'contact/page.jsx',
    'how-it-works': 'how-it-works/page.jsx', blogs: 'blogs/page.jsx', creators: 'creators/page.jsx',
    explore: 'explore/[[...filters]]/page.jsx', faq: 'faqUs/page.jsx', 'become-creator': 'become-creator/page.jsx',
    'advertising-policy': 'advertising-policy/page.jsx', 'boost-terms-and-ppc': 'boost-terms-and-ppc/page.jsx',
    'creator-terms-and-conditions': 'creator-terms-and-conditions/page.jsx', 'privacy-policy': 'privacy-policy/page.jsx',
    'terms-and-conditions': 'terms-and-conditions/page.jsx', 'cookie-policy': 'cookie-policy/page.jsx',
  };
  assert.equal(Object.keys(files).length, 15);
  for (const [id, file] of Object.entries(files)) {
    const text = source(`src/app/(public)/${file}`);
    assert.ok(text.includes('buildPageMetadata'), `${file} does not use the shared helper`);
    assert.ok(/export async function generateMetadata/.test(text), `${file} has no generateMetadata`);
    assert.ok(!text.includes('getSeoByPage'), `${file} still reads SEO records directly`);
    assert.ok(text.includes(`pageId: '${id}'`), `${file} is not wired to page id ${id}`);
  }
  for (const [file, id] of [['fr/faq/page.jsx', 'faq'], ['fr/privacy-policy/page.jsx', 'privacy-policy'],
    ['fr/terms-and-conditions/page.jsx', 'terms-and-conditions'], ['fr/cookie-policy/page.jsx', 'cookie-policy']]) {
    const text = source(`src/app/(public)/${file}`);
    assert.ok(text.includes(`pageId: '${id}', locale: 'fr'`), `${file} is not pinned to French`);
    assert.ok(!text.includes('export const metadata'), `${file} still hardcodes metadata`);
  }
  const client = source('src/app/(public)/become-creator/page.jsx');
  assert.ok(!client.includes("'use client'"), 'become-creator server wrapper must not be a client component');
  assert.ok(source('src/app/(public)/become-creator/BecomeCreatorClient.jsx').startsWith("'use client'"));
});

test('the French catch-all dispatches base pages and leaves the legacy FAQ alias generic', async () => {
  const generated = [];
  const stub = (id) => async ({ locale }) => { generated.push(`${id}:${locale}`); return { title: { absolute: id } }; };
  const pageStub = (id) => Object.assign(() => null, { generateMetadata: stub(id) });
  const mock = (id) => ({ __esModule: true, default: pageStub(id), generateMetadata: stub(id) });
  const localized = load('src/lib/localizedMetadata.js', { '@/lib/seo/siteConfig': site }, {
    fetch: async () => ({ ok: true, json: async () => ({ data: [{ code: 'en' }, { code: 'fr' }] }) }),
  });
  const catchAll = load('src/app/(public)/[locale]/[[...segments]]/page.jsx', Object.fromEntries([
    ['next/navigation', { notFound() { throw new Error('notFound'); } }],
    ['@/lib/localizedMetadata', localized], ['@/lib/i18n', i18n], ['@/lib/seo/indexing', indexing],
    ['@/lib/seo/publishedLanguages', load('src/lib/seo/publishedLanguages.js', {}, {
      fetch: async () => ({ ok: true, json: async () => ({ data: [{ code: 'en' }, { code: 'fr' }] }) }),
    })],
    ...[['../../about-us/page', 'about'], ['../../blogs/page', 'blogs'], ['../../blogs/[id]/page', 'blog-detail'],
      ['../../creators/page', 'creators'], ['../../explore/[[...filters]]/page', 'explore'], ['../../faqUs/page', 'faq'],
      ['../../how-it-works/page', 'how-it-works'], ['../../listings/[id]/page', 'listing'], ['../../profile/[id]/page', 'profile-detail'],
      ['../../privacy-policy/page', 'privacy-policy'], ['../../terms-and-conditions/page', 'terms-and-conditions'],
      ['../../cookie-policy/page', 'cookie-policy'], ['../../page', 'home'], ['../../contact/page', 'contact'],
      ['../../advertising-policy/page', 'advertising-policy'], ['../../boost-terms-and-ppc/page', 'boost-terms-and-ppc'],
      ['../../creator-terms-and-conditions/page', 'creator-terms-and-conditions'], ['../../become-creator/page', 'become-creator'],
      ['../../profile/page', 'own-profile'], ['../../favorites/page', 'favorites'], ['../../verify-email/page', 'verify-email'],
      ['../../reset-password/[token]/page', 'reset-password']].map(([path, id]) => [path, mock(id)]),
  ]));

  const metadataFor = (segments) => catchAll.generateMetadata({ params: Promise.resolve({ locale: 'fr', segments }) });
  await metadataFor(undefined);
  await metadataFor(['about-us']);
  await metadataFor(['cookie-policy']);
  await metadataFor(['become-creator']);
  assert.deepEqual(generated, ['home:fr', 'about:fr', 'cookie-policy:fr', 'become-creator:fr']);

  // The legacy /fr/faqUs alias keeps the generic default; its redirect belongs to a later stage.
  const legacy = await metadataFor(['faqUs']);
  assert.equal(generated.length, 4);
  assert.equal(legacy.alternates.canonical, 'https://site.test/fr/faqUs');
  assert.ok(!source('src/app/(public)/[locale]/[[...segments]]/page.jsx').includes('faqUs: generate'));
});
