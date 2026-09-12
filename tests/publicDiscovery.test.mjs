// Stage 6: sitemap, robots and structured data. Every request is mocked — no live SEO record,
// language configuration or translation record is read or written by this suite.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import test from 'node:test';

const require = createRequire(import.meta.url);
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
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
    module: loaded, exports: loaded.exports, React, URL, Headers, console, setTimeout, clearTimeout, process: { env }, ...globals,
    require: (name) => (name in mocks ? mocks[name] : require(name)),
  });
  return loaded.exports;
}

const site = load('src/lib/seo/siteConfig.js');
const registry = load('src/lib/seo/publicPageRegistry.js');
const continentData = load('src/constants/continentData.js');
const exploreSlug = load('src/lib/exploreSlug.js');
const indexing = load('src/lib/seo/indexing.js', { '@/constants/continentData': continentData, '@/lib/exploreSlug': exploreSlug });
const sitemapEntries = load('src/lib/seo/sitemapEntries.js', { './publicPageRegistry': registry, './siteConfig': site });

const catalogs = { en: load('src/lib/i18n/catalogs/en.js').default, fr: load('src/lib/i18n/catalogs/fr.js').default };
const read = (catalog, key) => key.split('.').reduce((value, part) => value?.[part], catalog);
const i18n = { translate: (locale, key, fallback) => read(catalogs[locale] || catalogs.en, key) ?? read(catalogs.en, key) ?? fallback ?? key };

// Stored SEO records the mocked API serves. English "about" is configured; French is not, so the
// French page must fall back to the French catalog rather than to the English record.
const seoRecords = {
  'about:en': { pageName: 'about', languageCode: 'en', title: 'About WCM', description: 'English stored description.', updatedAt: '2026-02-01T10:00:00.000Z' },
  'home:en': { pageName: 'home', languageCode: 'en', title: 'Home', description: 'English home.', updatedAt: '2026-01-05T08:00:00.000Z' },
};
const seoApi = { getSeoByPage: async (pageName, languageCode) => seoRecords[`${pageName}:${languageCode}`] || null };

const localizedMetadata = load('src/lib/localizedMetadata.js', { '@/lib/seo/siteConfig': site });
const publishedLanguages = load('src/lib/seo/publishedLanguages.js', {}, {
  fetch: async () => ({ ok: true, json: async () => ({ data: [{ code: 'en' }, { code: 'fr' }] }) }),
});
const pageMetadata = load('src/lib/seo/pageMetadata.js', {
  './brandTitle': load('src/lib/seo/brandTitle.js'),
  './publicPageRegistry': registry, './indexing': indexing, './siteConfig': site,
  './publishedLanguages': publishedLanguages,
  '@/lib/api': seoApi, '@/lib/i18n': i18n, '@/lib/localizedMetadata': localizedMetadata,
});
const structuredData = load('src/lib/seo/structuredData.js', {
  './publicPageRegistry': registry, './siteConfig': site, './pageMetadata': pageMetadata, '@/lib/i18n': i18n,
});

const url = (path) => `https://site.test${path === '/' ? '' : path}`;
const NEVER_LISTED = ['/profile', '/favorites', '/verify-email', '/products', '/fr/products', '/fr/faqUs'];

// ── Sitemap ────────────────────────────────────────────────────────────────────────────────────

test('base sitemap entries are registry-driven and exclude every non-indexable route', () => {
  const both = sitemapEntries.buildBaseSitemapEntries({ locales: ['en', 'fr'] });
  assert.equal(sitemapEntries.SITEMAP_BASE_PAGES.length, 15);
  assert.equal(both.length, 30);

  const urls = Array.from(both, (entry) => entry.url);
  for (const page of registry.PUBLIC_SEO_PAGES.filter(({ seoKey, indexing: rule }) => seoKey && rule !== 'noindex')) {
    assert.ok(urls.includes(url(page.paths.en)), page.id);
    assert.ok(urls.includes(url(page.paths.fr)), `fr:${page.id}`);
  }
  for (const path of NEVER_LISTED) assert.ok(!urls.includes(url(path)), path);
  assert.ok(!urls.some((value) => /reset-password|\/search\/|token=/.test(value)));
  // Explore contributes exactly its unfiltered URL in each language: no category/region explosion.
  assert.deepEqual(urls.filter((value) => value.includes('/explore')), [url('/explore'), url('/fr/explore')]);
  assert.equal(urls.filter((value) => value.includes('faq')).length, 2);
  assert.ok(urls.includes(url('/faqUs')) && urls.includes(url('/fr/faq')));
  assert.equal(both.find((entry) => entry.url === url('/')).priority, 1);

  // A language the registry has no path for adds nothing, and English alone stays English alone.
  assert.equal(sitemapEntries.buildBaseSitemapEntries({ locales: ['en'] }).length, 15);
  assert.equal(sitemapEntries.buildBaseSitemapEntries({ locales: ['en', 'de'] }).length, 15);
});

test('a base entry claims lastModified only when a real timestamp exists', () => {
  const entries = sitemapEntries.buildBaseSitemapEntries({
    locales: ['en', 'fr'],
    lastModifiedByPath: new Map([['/about-us', '2026-02-01T10:00:00.000Z'], ['/contact', 'not-a-date']]),
  });
  const at = (path) => entries.find((entry) => entry.url === url(path));
  assert.equal(at('/about-us').lastModified.toISOString(), '2026-02-01T10:00:00.000Z');
  assert.ok(!('lastModified' in at('/contact')));
  assert.ok(!('lastModified' in at('/fr/about-us')));
  assert.equal(entries.filter((entry) => 'lastModified' in entry).length, 1);
});

test('every base entry carries the whole language cluster, matching what the pages emit', () => {
  const entries = sitemapEntries.buildBaseSitemapEntries({ locales: ['en', 'fr'] });
  const at = (path) => entries.find((entry) => entry.url === url(path));
  for (const [english, french] of [['/about-us', '/fr/about-us'], ['/faqUs', '/fr/faq'], ['/', '/fr']]) {
    for (const path of [english, french]) {
      const languages = at(path).alternates.languages;
      assert.equal(languages.en, url(english), path);
      assert.equal(languages.fr, url(french), path);
      // x-default is the unprefixed English URL, exactly as in the page metadata.
      assert.equal(languages['x-default'], url(english), path);
    }
  }

  // One published language is not a cluster, so nothing is annotated at all.
  const englishOnly = sitemapEntries.buildBaseSitemapEntries({ locales: ['en'] });
  assert.ok(englishOnly.every((entry) => !('alternates' in entry)));
});

const sitemapResponses = (published) => ({
  '/api/translations/languages': { data: published },
  '/api/seo/all?languageCode=en': Object.values(seoRecords),
  '/api/seo/all?languageCode=fr': [],
  '/api/listings/public': { listings: [{ slug: 'blue-vase', updatedAt: '2026-03-02T00:00:00.000Z' }, { _id: 'id-only' }] },
  '/api/users/famous-creators': { data: [
    { slug: 'amina', updatedAt: '2026-03-03T00:00:00.000Z' },
    // The feed carries both; the canonical slug must win over the username.
    { slug: 'canonical-slug', username: 'ignored name' },
    // Legacy shape: no slug, and a username that is not URL-safe.
    { username: 'creator wcm' },
  ] },
  '/api/blogs': { blogs: [{ slug: 'weaving', createdAt: '2026-03-04T00:00:00.000Z' }] },
  '/api/translations/sitemap': { data: [
    { path: '/fr/about-us', lastModified: '2026-04-01T00:00:00.000Z' },
    { path: '/fr/listings/vase-bleu', lastModified: '2026-04-02T00:00:00.000Z' },
    { path: '/fr/profile/amina', lastModified: '2026-04-03T00:00:00.000Z' },
  ] },
});

const loadSitemap = (fetchMock) => load('src/app/sitemap.js', {
  '@/lib/seo/publicPageRegistry': registry, '@/lib/seo/sitemapEntries': sitemapEntries,
  '@/lib/seo/publishedLanguages': load('src/lib/seo/publishedLanguages.js', {}, { fetch: fetchMock }),
}, { fetch: fetchMock });

const runSitemap = async (published) => {
  const responses = sitemapResponses(published);
  const fetchMock = async (target) => {
    const key = Object.keys(responses).find((route) => target.includes(route));
    return key ? { ok: true, json: async () => responses[key] } : { ok: false, json: async () => null };
  };
  return loadSitemap(fetchMock).default();
};

test('sitemap lists French only while French is published and keeps the detail feeds', async () => {
  const entries = await runSitemap([{ code: 'en' }, { code: 'fr' }]);
  const urls = entries.map((entry) => entry.url);
  assert.equal(new Set(urls).size, urls.length);
  assert.equal(urls.filter((value) => value.startsWith(url('/fr'))).length, 15 + 2);
  for (const path of NEVER_LISTED) assert.ok(!urls.includes(url(path)), path);

  // Detail feeds unchanged: English listings/creators/blogs plus the localized detail URLs.
  for (const path of ['/listings/blue-vase', '/listings/id-only', '/profile/amina', '/blogs/weaving', '/fr/listings/vase-bleu', '/fr/profile/amina']) {
    assert.ok(urls.includes(url(path)), path);
  }
  const entryAt = (path) => entries.find((entry) => entry.url === url(path));
  assert.equal(entryAt('/listings/blue-vase').lastModified.toISOString(), '2026-03-02T00:00:00.000Z');
  assert.ok(!('lastModified' in entryAt('/listings/id-only')));
  assert.equal(entryAt('/profile/amina').priority, 0.6);

  // A public profile URL must be the canonical slug, and any identifier must be percent-encoded so
  // the sitemap only ever contains valid URIs.
  assert.ok(urls.includes(url('/profile/canonical-slug')));
  assert.ok(!urls.includes(url('/profile/ignored name')) && !urls.includes(url('/profile/ignored%20name')));
  assert.ok(urls.includes(url('/profile/creator%20wcm')));
  assert.ok(!urls.some((value) => /[ <>"{}|\^`]/.test(value)));

  // Base-page timestamps come from stored SEO edits and from the localized CMS feed, and the feed
  // never adds a second entry for a base page the registry already owns.
  assert.equal(entryAt('/about-us').lastModified.toISOString(), '2026-02-01T10:00:00.000Z');
  assert.equal(entryAt('/fr/about-us').lastModified.toISOString(), '2026-04-01T00:00:00.000Z');
  assert.equal(entryAt('/fr/about-us').priority, 0.5);
  assert.ok(!('lastModified' in entryAt('/contact')));
  assert.ok(entries.every((entry) => !('lastModified' in entry) || !Number.isNaN(entry.lastModified.getTime())));
});

test('sitemap drops every French URL when French is not published', async () => {
  const entries = await runSitemap([{ code: 'en' }]);
  const urls = entries.map((entry) => entry.url);
  assert.equal(urls.filter((value) => value.startsWith(url('/fr'))).length, 2);
  assert.ok(!urls.includes(url('/fr/about-us')) && !urls.includes(url('/fr/faq')));
  assert.ok(urls.includes(url('/about-us')));
});

test('an unreadable language list aborts the sitemap instead of publishing an English-only one', async () => {
  // Dropping every French URL from a 200 response is acted on as the truth; a thrown error becomes
  // a 5xx that search engines retry, leaving the last good sitemap in place.
  const route = loadSitemap(async () => { throw new Error('offline'); });
  await assert.rejects(route.default(), /published-language list/);
});

test('a language list read once survives a later outage, and other feeds still fail harmlessly', async () => {
  const responses = sitemapResponses([{ code: 'en' }, { code: 'fr' }]);
  let languageLookups = 0;
  const fetchMock = async (target) => {
    if (target.includes('/api/translations/languages')) {
      languageLookups += 1;
      if (languageLookups > 1) throw new Error('offline');
      return { ok: true, json: async () => responses['/api/translations/languages'] };
    }
    // Every other upstream is down: the sitemap still publishes, just without their URLs or dates.
    throw new Error('offline');
  };
  const route = loadSitemap(fetchMock);
  const first = await route.default();
  assert.equal(first.length, 30);
  assert.ok(first.every((entry) => !('lastModified' in entry)));

  const second = await route.default();
  assert.deepEqual(second.map((entry) => entry.url), first.map((entry) => entry.url));
  assert.ok(second.some((entry) => entry.url.startsWith(url('/fr'))));
});

// Structured data must be as complete as the metadata: every indexable page, in both languages,
// resolves a WebPage node that agrees with that page's canonical URL and language. The root layout
// emits it from the request path, so this is what a crawler receives on every one of those URLs.
test('every indexable page resolves a WebPage node in both languages', async () => {
  const pages = registry.PUBLIC_SEO_PAGES.filter(({ seoKey, indexing }) => seoKey && indexing !== 'noindex');
  for (const page of pages) {
    for (const locale of ['en', 'fr']) {
      const where = `${page.id}:${locale}`;
      const schema = await structuredData.resolvePageStructuredData(page.paths[locale]);
      assert.ok(schema, `${where}: no WebPage node`);
      assert.equal(schema['@type'], 'WebPage', where);
      assert.equal(schema.url, url(page.paths[locale]), `${where}: url`);
      assert.equal(schema.inLanguage, locale, `${where}: inLanguage`);
      assert.ok(schema.name && schema.description, `${where}: name and description`);
      // Each node hangs off that language's WebSite and the one shared Organization identity.
      assert.equal(schema.isPartOf['@id'], structuredData.websiteId(locale), `${where}: isPartOf`);
      assert.equal(schema.publisher['@id'], structuredData.ORGANIZATION_ID, `${where}: publisher`);
    }
  }
});

// ── Robots ─────────────────────────────────────────────────────────────────────────────────────

test('robots blocks only non-public surfaces so every noindex URL stays crawlable', () => {
  const rules = load('src/app/robots.js', { '@/lib/seo/indexing': indexing, '@/lib/seo/siteConfig': site }).default();
  assert.equal(rules.sitemap, 'https://site.test/sitemap.xml');
  assert.deepEqual(Array.from(rules.rules[0].disallow), ['/api/']);
  assert.equal(rules.rules[0].allow, '/');
  assert.equal(rules.rules[0].userAgent, '*');

  const blocked = (path) => rules.rules[0].disallow.some((rule) =>
    new RegExp(`^${rule.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}`).test(path));
  assert.ok(blocked('/api/anything'));
  // Dashboards carry `noindex` from their group layout, so blocking them would leave it unread.
  assert.ok(!blocked('/admin/seo-settings') && !blocked('/creator/listings'));
  // A page Google must fetch to read its noindex tag may never be disallowed.
  for (const page of registry.PUBLIC_SEO_PAGES) {
    for (const locale of ['en', 'fr']) if (page.paths[locale]) assert.ok(!blocked(page.paths[locale]), page.paths[locale]);
  }
  for (const path of ['/explore/search/vase', '/fr/explore/search/vase', '/explore/unknown-filter', '/reset-password/token']) {
    assert.ok(!blocked(path), path);
  }
});

// ── Structured data ────────────────────────────────────────────────────────────────────────────

test('site identity is one stable Organization node, and WebSite is language-scoped', () => {
  const organization = structuredData.buildOrganizationSchema();
  assert.equal(organization['@id'], 'https://site.test/#organization');
  assert.equal(organization.name, 'World Culture Marketplace');
  assert.equal(organization.url, 'https://site.test');
  assert.equal(organization.logo, 'https://site.test/wc,-web-logo.png');
  assert.deepEqual(organization, structuredData.buildOrganizationSchema());

  const english = structuredData.buildWebSiteSchema('en');
  const french = structuredData.buildWebSiteSchema('fr');
  assert.equal(english.url, 'https://site.test');
  assert.equal(french.url, 'https://site.test/fr');
  assert.equal(english['@id'], 'https://site.test/#website');
  assert.equal(french['@id'], 'https://site.test/fr/#website');
  assert.equal(english.inLanguage, 'en');
  assert.equal(french.inLanguage, 'fr');
  assert.equal(english.description, catalogs.en.seo.home.description);
  assert.equal(french.description, catalogs.fr.seo.home.description);
  assert.notEqual(french.description, english.description);
  assert.equal(french.potentialAction.target, 'https://site.test/fr/explore/search/{search_term_string}');
  for (const node of [english, french]) assert.equal(node.publisher['@id'], organization['@id']);
});

test('WebPage uses the page own localized URL, language and current-language text', async () => {
  const english = await structuredData.resolvePageStructuredData('/about-us');
  assert.equal(english.url, 'https://site.test/about-us');
  assert.equal(english['@id'], 'https://site.test/about-us#webpage');
  assert.equal(english.inLanguage, 'en');
  assert.equal(english.name, 'About WCM');
  assert.equal(english.description, 'English stored description.');
  assert.equal(english.isPartOf['@id'], 'https://site.test/#website');

  const french = await structuredData.resolvePageStructuredData('/fr/about-us');
  assert.equal(french.url, 'https://site.test/fr/about-us');
  assert.equal(french['@id'], 'https://site.test/fr/about-us#webpage');
  assert.equal(french.inLanguage, 'fr');
  assert.equal(french.isPartOf['@id'], 'https://site.test/fr/#website');
  // No stored French record: French catalog text, never the English record.
  assert.equal(french.name, catalogs.fr.seo.about.title);
  assert.equal(french.description, catalogs.fr.seo.about.description);
  assert.notEqual(french.name, english.name);

  assert.equal((await structuredData.resolvePageStructuredData('/')).url, 'https://site.test');
  assert.equal((await structuredData.resolvePageStructuredData('/fr')).url, 'https://site.test/fr');
  assert.equal((await structuredData.resolvePageStructuredData('/fr/faq')).url, 'https://site.test/fr/faq');
  // `@id` is derived from the URL alone, so it is identical across crawls.
  assert.equal((await structuredData.resolvePageStructuredData('/about-us'))['@id'], english['@id']);
});

test('structured data is withheld wherever it would contradict the indexing policy', async () => {
  for (const path of [
    ...NEVER_LISTED, '/reset-password/secret-token', '/fr/reset-password/secret-token',
    '/explore/pottery/asia', '/explore/search/vase', '/fr/explore/search/vase',
    '/listings/blue-vase', '/blogs/weaving', '/profile/amina', '/admin/seo-settings', '', null, undefined,
  ]) {
    assert.equal(await structuredData.resolvePageStructuredData(path), null, String(path));
  }
});

// ── Rendered markup ────────────────────────────────────────────────────────────────────────────

const renderLayout = async (path, locale) => {
  const Provider = ({ children }) => React.createElement('div', null, children);
  const font = () => ({ variable: 'test-font' });
  const requestHeaders = path === null ? {} : { [site.REQUEST_LOCALE_HEADER]: locale, [site.REQUEST_PATH_HEADER]: path };
  const layout = load('src/app/layout.jsx', {
    './globals.css': {},
    'next/font/google': { Poppins: font, Roboto: font },
    '@/components/ClarityAnalytics': { __esModule: true, default: () => null },
    'next/headers': { headers: async () => new Headers(requestHeaders) },
    '@/context/AuthContext': { AuthProvider: Provider },
    '@/context/ListingsContext': { ListingsProvider: Provider },
    '@/lib/seo/siteConfig': site,
    '@/lib/seo/structuredData': structuredData,
    '@/lib/api': { getVerifications: async () => [{ rawHtml: '<meta name="google-site-verification" content="kept" />' }] },
  });
  const html = renderToStaticMarkup(await layout.default({ children: React.createElement('main', null, 'Page') }));
  const nodes = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .map(([, json]) => JSON.parse(json.replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&amp;/g, '&')));
  return { html, nodes };
};

test('rendered French markup carries French JSON-LD URLs and one Organization identity', async () => {
  const { html, nodes } = await renderLayout('/fr/about-us', 'fr');
  assert.ok(html.startsWith('<html lang="fr" dir="ltr">'));
  assert.ok(html.includes('<meta name="google-site-verification" content="kept"/>'));
  // Clarity is consent-gated in its own component and contributes nothing to the server shell.
  assert.ok(html.includes('property="fb:app_id"') && !html.includes('clarity.ms'));

  assert.deepEqual(nodes.map((node) => node['@type']), ['WebSite', 'Organization', 'WebPage']);
  const organizations = nodes.filter((node) => node['@type'] === 'Organization');
  assert.equal(organizations.length, 1);
  assert.equal(organizations[0]['@id'], 'https://site.test/#organization');
  const webPage = nodes.find((node) => node['@type'] === 'WebPage');
  assert.equal(webPage.url, 'https://site.test/fr/about-us');
  assert.equal(webPage.inLanguage, 'fr');
  assert.equal(webPage.name, catalogs.fr.seo.about.title);
  assert.ok(!JSON.stringify(nodes).includes('"https://site.test/about-us"'));
});

test('rendered English markup pairs with the French page and skips noindex routes', async () => {
  const english = await renderLayout('/about-us', 'en');
  const webPage = english.nodes.find((node) => node['@type'] === 'WebPage');
  assert.ok(english.html.startsWith('<html lang="en" dir="ltr">'));
  assert.equal(webPage.url, 'https://site.test/about-us');
  assert.equal(webPage.inLanguage, 'en');
  assert.equal(english.nodes.find((node) => node['@type'] === 'WebSite').url, 'https://site.test');

  for (const [path, locale] of [['/favorites', 'en'], ['/fr/profile', 'fr'], ['/reset-password/secret', 'en'], ['/admin/seo-settings', 'en'], [null, 'en']]) {
    const { html, nodes } = await renderLayout(path, locale);
    assert.deepEqual(nodes.map((node) => node['@type']), ['WebSite', 'Organization'], String(path));
    assert.ok(!html.includes('secret'));
  }
});
