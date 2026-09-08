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
    module: loaded, exports: loaded.exports, React, URL, Headers, console,
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
  const pageMetadata = load('src/lib/seo/pageMetadata.js', {
    './publicPageRegistry': registry, './siteConfig': site, './indexing': indexing,
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
