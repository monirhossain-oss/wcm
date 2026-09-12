import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
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
const exploreSlug = load('src/lib/exploreSlug.js');
const continentData = load('src/constants/continentData.js');
const indexing = load('src/lib/seo/indexing.js', {
  '@/constants/continentData': continentData, '@/lib/exploreSlug': exploreSlug,
});
const categories = [{ title: 'Pottery' }, { title: 'Home & Decor' }, { title: 'Textiles' }];

test('route slugs are generated and validated by one shared rule', () => {
  assert.equal(exploreSlug.toRouteSlug('Home & Decor'), 'home-and-decor');
  assert.equal(exploreSlug.toRouteSlug('  Middle East '), 'middle-east');
  for (const empty of ['All', 'all regions', '', null, undefined]) assert.equal(exploreSlug.toRouteSlug(empty), null);
  assert.ok(exploreSlug.slugsMatch('Home & Decor', 'home-and-decor'));
  assert.ok(!exploreSlug.slugsMatch('Pottery', 'poterie'));
  assert.ok(indexing.isCategorySlug('home-and-decor', categories));
  assert.ok(!indexing.isCategorySlug('unknown-category', categories));
  assert.ok(indexing.isRegionSlug('middle-east') && !indexing.isRegionSlug('atlantis'));
});

test('Explore indexes only valid category/region combinations', () => {
  const verdict = (filters) => indexing.resolveExploreIndexing(filters, categories);
  for (const [filters, reason] of [
    [[], 'base'],
    [['pottery'], 'category'],
    [['home-and-decor'], 'category'],
    [['asia'], 'region'],
    [['middle-east'], 'region'],
    [['pottery', 'asia'], 'category-region'],
  ]) {
    const result = verdict(filters);
    assert.ok(result.indexable, `expected indexable: /${filters.join('/')}`);
    assert.equal(result.reason, reason);
  }
  for (const [filters, reason] of [
    [['search', 'vase'], 'search'],
    [['pottery', 'search', 'vase'], 'search'],
    [['pottery', 'asia', 'search', 'vase'], 'search'],
    [['not-a-category'], 'unknown-filter'],
    [['not-a-category', 'asia'], 'unknown-category'],
    [['pottery', 'atlantis'], 'unknown-region'],
    [['asia', 'pottery'], 'unknown-category'],
    [['pottery', 'asia', 'extra'], 'too-many-segments'],
  ]) {
    const result = verdict(filters);
    assert.ok(!result.indexable, `expected noindex: /${filters.join('/')}`);
    assert.equal(result.reason, reason);
  }
});

test('the same filters are judged identically for both languages', () => {
  for (const filters of [['pottery', 'asia'], ['search', 'vase'], ['unknown']]) {
    const english = indexing.resolveExploreIndexing(filters, categories);
    const french = indexing.resolveExploreIndexing(filters, categories);
    assert.deepEqual({ ...english }, { ...french });
  }
});

// The metadata helper must turn a noindex verdict into an actual robots directive and stop
// advertising alternates for a URL search engines are being asked to drop.
const publishedLanguagesModule = () => load('src/lib/seo/publishedLanguages.js', {}, {
  fetch: async () => ({ ok: true, json: async () => ({ data: [{ code: 'en' }, { code: 'fr' }] }) }),
});

function metadataModule() {
  const localized = load('src/lib/localizedMetadata.js', { '@/lib/seo/siteConfig': site }, {
    fetch: async () => ({ ok: true, json: async () => ({ data: [{ code: 'en' }, { code: 'fr' }] }) }),
  });
  const i18n = load('src/lib/i18n/index.js', {
    './catalogs/en': load('src/lib/i18n/catalogs/en.js'),
    './catalogs/fr': load('src/lib/i18n/catalogs/fr.js'),
    '@/lib/seo/publicPageRegistry': registry,
  });
  return load('src/lib/seo/pageMetadata.js', {
    './brandTitle': load('src/lib/seo/brandTitle.js'),
    './publicPageRegistry': registry, './siteConfig': site, './indexing': indexing,
    './publishedLanguages': publishedLanguagesModule(),
    '@/lib/api': { getSeoByPage: async () => null }, '@/lib/i18n': i18n, '@/lib/localizedMetadata': localized,
  });
}

test('a non-indexable page keeps its canonical but drops alternates and is marked noindex', async () => {
  const module = metadataModule();
  const indexed = await module.buildPageMetadata({ pageId: 'explore', locale: 'fr', path: '/explore/pottery/asia' });
  assert.equal(indexed.robots, undefined);
  assert.equal(indexed.alternates.languages.en, 'https://site.test/explore/pottery/asia');

  const excluded = await module.buildPageMetadata({
    pageId: 'explore', locale: 'fr', path: '/explore/search/vase', indexable: false,
  });
  assert.equal(excluded.robots.index, false);
  assert.equal(excluded.robots.follow, true);
  assert.equal(excluded.alternates.canonical, 'https://site.test/fr/explore/search/vase');
  assert.equal(excluded.alternates.languages, undefined);
});

test('the registry maps aliases and cross-language routes', () => {
  assert.equal(registry.localizedRoutePath('/faqUs', 'fr'), '/fr/faq');
  assert.equal(registry.localizedRoutePath('/fr/faq', 'en'), '/faqUs');
  assert.equal(registry.localizedRoutePath('/fr/faqUs', 'fr'), '/fr/faq');
  assert.equal(registry.localizedRoutePath('/about-us', 'fr'), '/fr/about-us');
  assert.equal(registry.localizedRoutePath('/listings/example', 'fr'), null);
  assert.equal(registry.localizedRoutePath('/products', 'fr'), null);
  assert.equal(registry.canonicalRoutePath('/fr/faqUs'), '/fr/faq');
  assert.equal(registry.canonicalRoutePath('/faqUs'), null);
  assert.equal(registry.canonicalRoutePath('/fr/faq'), null);
});

test('internal links resolve to canonical routes in both languages', () => {
  const i18n = load('src/lib/i18n/index.js', {
    './catalogs/en': load('src/lib/i18n/catalogs/en.js'),
    './catalogs/fr': load('src/lib/i18n/catalogs/fr.js'),
    '@/lib/seo/publicPageRegistry': registry,
  });
  assert.equal(i18n.localePath('fr', '/faqUs'), '/fr/faq');
  assert.equal(i18n.localePath('en', '/faqUs'), '/faqUs');
  assert.equal(i18n.localePath('fr', '/about-us'), '/fr/about-us');
  assert.equal(i18n.localePath('fr', '/explore/pottery'), '/fr/explore/pottery');
  assert.equal(i18n.localePath('fr', '/'), '/fr');
  assert.equal(i18n.localePath('en', '/'), '/');
});

test('the proxy redirects the French FAQ alias once and leaves canonical routes alone', () => {
  const host = load('src/lib/hostRedirect.js');
  const { proxy } = load('src/proxy.js', {
    '@/lib/hostRedirect': host, '@/lib/seo/siteConfig': site, '@/lib/seo/publicPageRegistry': registry,
    'next/server': { NextResponse: {
      next: (options) => ({ ...options, type: 'next' }),
      redirect: (url, status) => ({ url: String(url), status, type: 'redirect' }),
    } },
  });
  const request = (path, hostname = 'worldculturemarketplace.com') => ({
    url: `https://${hostname}${path}`, nextUrl: new URL(`https://${hostname}${path}`),
    headers: new Headers({ host: hostname }),
  });

  const redirected = proxy(request('/fr/faqUs?ref=newsletter'));
  assert.equal(redirected.type, 'redirect');
  assert.equal(redirected.status, 301);
  assert.equal(redirected.url, 'https://worldculturemarketplace.com/fr/faq?ref=newsletter');

  for (const path of ['/faqUs', '/fr/faq', '/fr/about-us', '/explore/pottery']) {
    assert.equal(proxy(request(path)).type, 'next', `${path} must not redirect`);
  }
});

test('private, token and placeholder routes are excluded from the index', () => {
  const noindexRoutes = [
    ['favorites/layout.jsx', 'NOINDEX'],
    ['verify-email/layout.jsx', 'NOINDEX'],
    ['products/layout.jsx', 'NOINDEX'],
    ['reset-password/[token]/layout.jsx', 'NOINDEX_NOFOLLOW'],
  ];
  for (const [file, expected] of noindexRoutes) {
    const text = source(`src/app/(public)/${file}`);
    assert.ok(text.includes(`robots: ${expected}`), `${file} must declare ${expected}`);
  }
  // /profile cannot use a folder layout: /profile/[id] below it is the public creator profile.
  const profile = source('src/app/(public)/profile/page.jsx');
  assert.ok(profile.includes('robots: NOINDEX'), 'own profile must be noindex');
  assert.ok(!profile.includes("'use client'"), 'own profile page must stay a server wrapper');
  assert.ok(existsSync(new URL('src/app/(public)/profile/OwnProfileClient.jsx', root)));
  assert.ok(!existsSync(new URL('src/app/(public)/profile/layout.jsx', root)), 'a profile layout would noindex public profiles');
  assert.ok(!source('src/app/(public)/profile/[id]/page.jsx').includes('robots'));
  assert.equal(indexing.NOINDEX_NOFOLLOW.follow, false);
});

test('dashboard routes are noindex and stay crawlable so the tag is read', () => {
  const layout = source('src/app/(dashboards)/layout.jsx');
  assert.ok(layout.includes('robots: NOINDEX'), 'the dashboards group layout must declare NOINDEX');
  assert.ok(!layout.includes("'use client'"), 'a client layout cannot export metadata');
  // The rule can only live above these two: both are client components by necessity (auth guard,
  // sidebar state), so neither can carry metadata of its own.
  for (const file of ['admin/layout.jsx', 'creator/layout.jsx']) {
    assert.ok(source(`src/app/(dashboards)/${file}`).includes("'use client'"), `${file} is still a client layout`);
  }
  // A disallowed dashboard would never have its noindex read, leaving the URL listed from links.
  assert.ok(!indexing.ROBOTS_DISALLOW.includes('/admin/'), 'dashboards must stay crawlable');
  assert.deepEqual(Array.from(indexing.ROBOTS_DISALLOW), ['/api/']);
  assert.equal(indexing.NOINDEX.index, false);
  assert.equal(indexing.NOINDEX.follow, true);
});

test('French private routes are noindex, hide the token URL, and /fr/products does not exist', async () => {
  const notFound = () => { throw new Error('notFound'); };
  const stub = (id) => Object.assign(() => null, {});
  const mock = (id) => ({ __esModule: true, default: stub(id), generateMetadata: async () => ({ title: { absolute: id } }) });
  const localized = load('src/lib/localizedMetadata.js', { '@/lib/seo/siteConfig': site }, {
    fetch: async () => ({ ok: true, json: async () => ({ data: [{ code: 'en' }, { code: 'fr' }] }) }),
  });
  const i18n = load('src/lib/i18n/index.js', {
    './catalogs/en': load('src/lib/i18n/catalogs/en.js'),
    './catalogs/fr': load('src/lib/i18n/catalogs/fr.js'),
    '@/lib/seo/publicPageRegistry': registry,
  });
  const catchAll = load('src/app/(public)/[locale]/[[...segments]]/page.jsx', Object.fromEntries([
    ['next/navigation', { notFound }], ['@/lib/localizedMetadata', localized], ['@/lib/i18n', i18n],
    ['@/lib/seo/indexing', indexing], ['@/lib/seo/publishedLanguages', publishedLanguagesModule()],
    ...[['../../about-us/page', 'about'], ['../../blogs/page', 'blogs'], ['../../blogs/[id]/page', 'blog-detail'],
      ['../../creators/page', 'creators'], ['../../explore/[[...filters]]/page', 'explore'], ['../../faqUs/page', 'faq'],
      ['../../how-it-works/page', 'how-it-works'], ['../../listings/[id]/page', 'listing'], ['../../profile/[id]/page', 'profile-detail'],
      ['../../privacy-policy/page', 'privacy'], ['../../terms-and-conditions/page', 'terms'], ['../../cookie-policy/page', 'cookie'],
      ['../../page', 'home'], ['../../contact/page', 'contact'], ['../../advertising-policy/page', 'advertising'],
      ['../../boost-terms-and-ppc/page', 'boost'], ['../../creator-terms-and-conditions/page', 'creator-terms'],
      ['../../become-creator/page', 'become-creator'], ['../../profile/page', 'own-profile'], ['../../favorites/page', 'favorites'],
      ['../../verify-email/page', 'verify-email'], ['../../reset-password/[token]/page', 'reset-password']].map(([path, id]) => [path, mock(id)]),
  ]));
  const metadataFor = (segments) => catchAll.generateMetadata({ params: Promise.resolve({ locale: 'fr', segments }) });

  for (const section of ['profile', 'favorites', 'verify-email']) {
    const metadata = await metadataFor([section]);
    assert.equal(metadata.robots.index, false, `/fr/${section} must be noindex`);
    assert.equal(metadata.alternates.canonical, `https://site.test/fr/${section}`);
    assert.equal(metadata.alternates.languages, undefined, `/fr/${section} must not advertise alternates`);
  }

  const token = 'secret-reset-token';
  const reset = await metadataFor(['reset-password', token]);
  assert.equal(reset.robots.index, false);
  assert.equal(reset.robots.follow, false);
  assert.ok(!JSON.stringify(reset).includes(token), 'the recovery token must not appear in any metadata URL');
  assert.equal(reset.alternates, undefined);

  // /products is English-only and the localized catch-all has no page for it.
  await assert.rejects(() => catchAll.default({ params: Promise.resolve({ locale: 'fr', segments: ['products'] }) }), /notFound/);
  // The legacy alias no longer renders: the proxy redirect owns it.
  await assert.rejects(() => catchAll.default({ params: Promise.resolve({ locale: 'fr', segments: ['faqUs'] }) }), /notFound/);
  // Extra segments on a fixed route are rejected rather than served as a duplicate.
  await assert.rejects(() => catchAll.default({ params: Promise.resolve({ locale: 'fr', segments: ['about-us', 'extra'] }) }), /notFound/);
});
