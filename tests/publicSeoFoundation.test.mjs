import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import test from 'node:test';

const require = createRequire(import.meta.url);
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { transformSync } = require('next/dist/compiled/babel/core');
const root = new URL('../', import.meta.url);
const source = (path) => readFileSync(new URL(path, root), 'utf8');
function load(path, mocks = {}, env = {}) {
  const { code } = transformSync(source(path), {
    filename: path, babelrc: false, configFile: false,
    presets: [
      [require.resolve('next/dist/compiled/babel/preset-env'), { targets: { node: 'current' }, modules: 'commonjs' }],
      [require.resolve('next/dist/compiled/babel/preset-react'), { runtime: 'classic' }],
    ],
  });
  const loadedModule = { exports: {} };
  vm.runInNewContext(code, {
    module: loadedModule, exports: loadedModule.exports, React, Headers, URL, console,
    process: { env },
    require: (name) => name in mocks ? mocks[name] : require(name),
  });
  return loadedModule.exports;
}
const site = load('src/lib/seo/siteConfig.js', {}, { NEXT_PUBLIC_SITE_URL: 'https://example.test/' });

test('site configuration retains fallback and normalizes configured origin/image', () => {
  assert.equal(site.SITE_URL, 'https://example.test');
  assert.equal(site.DEFAULT_SOCIAL_IMAGE, 'https://example.test/og-image.jpg');
  assert.ok(existsSync(new URL('public/og-image.jpg', root)));
  assert.equal(load('src/lib/seo/siteConfig.js').SITE_URL, 'http://localhost:3000');
  for (const path of ['/', '/blogs', '/admin', '/france', '/fr-FR', '/profile/fr']) assert.equal(site.getPathLocale(path), 'en');
  for (const path of ['/fr', '/fr/', '/fr/about-us', '/fr/reset-password/test']) assert.equal(site.getPathLocale(path), 'fr');
});

test('registry covers actual scoped pages, preserves legacy SEO keys and canonical FAQ mapping', () => {
  const { PUBLIC_SEO_PAGES: pages } = load('src/lib/seo/publicPageRegistry.js');
  assert.equal(pages.length, 20);
  assert.equal(pages.filter(({ seoKey }) => seoKey).length, 15);
  assert.equal(new Set(pages.map(({ id }) => id)).size, pages.length);
  for (const page of pages) {
    let route = page.paths.en === '/' ? '' : page.paths.en;
    if (page.id === 'explore') route += '/[[...filters]]';
    assert.ok(existsSync(new URL(`src/app/(public)${route}/page.jsx`, root)), page.id);
    if (page.indexing === 'noindex') assert.equal(page.seoKey, null);
  }
  assert.equal(pages.find(({ id }) => id === 'products').paths.fr, null);
  assert.equal(pages.find(({ id }) => id === 'faq').paths.en, '/faqUs');
  assert.equal(pages.find(({ id }) => id === 'faq').paths.fr, '/fr/faq');
  for (const [id, key] of [['blogs', 'blog'], ['privacy-policy', 'privacy'], ['terms-and-conditions', 'terms'], ['cookie-policy', 'cookie']]) {
    assert.equal(pages.find((page) => page.id === id).seoKey, key);
  }
  assert.ok(!pages.some(({ paths }) => /\[(?:id|slug)\]/.test(paths.en)));
});

test('proxy forwards path-owned language, preserves request headers and French host redirects', () => {
  const host = load('src/lib/hostRedirect.js');
  const { proxy } = load('src/proxy.js', {
    '@/lib/hostRedirect': host, '@/lib/seo/siteConfig': site,
    '@/lib/seo/publicPageRegistry': load('src/lib/seo/publicPageRegistry.js'),
    'next/server': { NextResponse: { next: (options) => options, redirect: (url, status) => ({ url: String(url), status }) } },
  });
  const request = (path, hostname, supplied) => ({
    url: `https://${hostname}${path}`, nextUrl: new URL(`https://${hostname}${path}`),
    headers: new Headers({ host: hostname, 'x-wcm-locale': supplied, cookie: 'example=value' }),
  });
  for (const [path, expected] of [['/', 'en'], ['/fr', 'fr'], ['/fr/contact', 'fr'], ['/france', 'en']]) {
    const result = proxy(request(path, 'worldculturemarketplace.com', expected === 'en' ? 'fr' : 'en'));
    assert.equal(result.request.headers.get(site.REQUEST_LOCALE_HEADER), expected);
    assert.equal(result.request.headers.get('cookie'), 'example=value');
  }
  for (const hostname of ['worldculturemarketplace.fr', 'www.worldculturemarketplace.fr']) {
    const result = proxy(request('/fr/verify-email?token=test%2Bvalue', hostname, 'en'));
    assert.equal(result.status, 301);
    assert.equal(result.url, 'https://worldculturemarketplace.com/fr/verify-email?token=test%2Bvalue');
  }
});

test('no tracker loads until the visitor has accepted cookies', () => {
  // Compliance-critical case: before a choice is made, neither tag may be fetched, so no recording
  // can start and no identifying cookie can be set. Effects do not run under renderToStaticMarkup,
  // which is exactly the "no consent yet" state — and exactly what a crawler receives.
  const scriptStub = { __esModule: true, default: ({ id, strategy, children, src }) => React.createElement('script', { id, src, 'data-nscript': strategy }, children) };
  const consent = load('src/hooks/useAnalyticsConsent.js');
  for (const path of ['src/components/ClarityAnalytics.jsx', 'src/components/Analytics.jsx']) {
    const tracker = load(path, { 'next/script': scriptStub, '@/hooks/useAnalyticsConsent': consent });
    assert.equal(renderToStaticMarkup(React.createElement(tracker.default)), '', path);
  }

  // Both trackers defer to one rule, so the gate is asserted once, at its source. The accepted
  // branch only runs in a browser, so its wiring is checked here rather than rendered.
  const hook = source('src/hooks/useAnalyticsConsent.js');
  assert.match(hook, /=== 'accepted'/);
  assert.match(hook, /addEventListener\('cookie-consent-updated'/);
  assert.match(hook, /addEventListener\('storage'/);
  // Reading a blocked localStorage must not throw the whole page down.
  assert.match(hook, /try \{[\s\S]*localStorage\.getItem[\s\S]*\} catch/);

  for (const path of ['src/components/ClarityAnalytics.jsx', 'src/components/Analytics.jsx']) {
    const text = source(path);
    assert.match(text, /useAnalyticsConsent\(\)/, path);
    assert.match(text, /if \(!?[A-Za-z_]*\s*(\|\|\s*!accepted|accepted)\) return null/, path);
    assert.match(text, /strategy="afterInteractive"/, path);
  }
  // An unconfigured deployment must request nothing at all, so the measurement id takes no
  // fallback: the old default was a truthy placeholder and was requested on every page.
  assert.ok(!/NEXT_PUBLIC_GA_ID\s*\|\|/.test(source('src/components/Analytics.jsx')));
});

test('root server markup has initial locale and preserves verification, tracking and providers', async () => {
  const Provider = ({ children }) => React.createElement('div', { 'data-provider': 'preserved' }, children);
  // A Proxy so the stub answers for any family the layout asks for, while recording which it asked
  // for: an unused family reintroduced later shows up here instead of shipping unnoticed.
  const loadedFonts = new Set();
  const fontModule = new Proxy({}, { get: (_target, family) => { loadedFonts.add(family); return () => ({ variable: 'test-font' }); } });
  for (const [locale, expected] of [['en', 'en'], ['fr', 'fr'], ['invalid', 'en']]) {
    loadedFonts.clear();
    const layout = load('src/app/layout.jsx', {
      './globals.css': {},
      'next/font/google': fontModule,
      // Clarity now lives behind a consent gate of its own; the shell only has to mount it.
      '@/components/ClarityAnalytics': { __esModule: true, default: () => React.createElement('div', { 'data-clarity-mount': 'true' }) },
      'next/headers': { headers: async () => new Headers({ [site.REQUEST_LOCALE_HEADER]: locale }) },
      '@/context/AuthContext': { AuthProvider: Provider },
      '@/context/ListingsContext': { ListingsProvider: Provider },
      '@/lib/seo/siteConfig': site,
      // Stage 6 structured data is exercised in publicDiscovery.test.mjs; stubbed here so this test
      // keeps asserting the shell (locale, verification, tracking, providers) in isolation.
      '@/lib/seo/structuredData': {
        buildWebSiteSchema: (locale) => ({ '@type': 'WebSite', inLanguage: locale }),
        buildOrganizationSchema: () => ({ '@type': 'Organization' }),
        resolvePageStructuredData: async () => null,
      },
      '@/lib/api': { getVerifications: async () => [
        { rawHtml: '<meta name="google-site-verification" content="test-verification" />' },
        { rawHtml: '<script>window.testVerification=true;</script>' },
      ] },
    });
    const html = renderToStaticMarkup(await layout.default({ children: React.createElement('main', null, 'Page content') }));
    assert.ok(html.startsWith(`<html lang="${expected}" dir="ltr">`));
    assert.ok(html.includes('<meta name="google-site-verification" content="test-verification"/>'));
    assert.ok(html.includes('window.testVerification=true;'));
    assert.ok(html.includes('property="fb:app_id"'));
    // Analytics is mounted, not inlined: the shell must carry no tracking snippet of its own.
    assert.ok(html.includes('data-clarity-mount="true"'));
    assert.ok(!html.includes('clarity.ms'));
    assert.ok(!source('src/app/layout.jsx').includes('clarity.ms'));

    // Only the two font families globals.css actually renders are loaded.
    assert.deepEqual([...loadedFonts], ['Poppins', 'Roboto']);
    assert.equal((html.match(/type="application\/ld\+json"/g) || []).length, 2);
    assert.equal((html.match(/data-provider="preserved"/g) || []).length, 2);
    assert.ok(html.includes('<main>Page content</main>'));
    const metadata = await layout.generateMetadata();
    assert.equal(metadata.metadataBase.href, 'https://example.test/');
    assert.equal(metadata.openGraph.images[0], site.DEFAULT_SOCIAL_IMAGE);
    assert.equal(metadata.twitter.images[0], site.DEFAULT_SOCIAL_IMAGE);
  }
});

test('shared metadata origin extraction preserves deferred detail canonical and alternates', () => {
  const { buildLocalizedMetadata } = load('src/lib/localizedMetadata.js', { '@/lib/seo/siteConfig': site });
  const metadata = buildLocalizedMetadata({
    locale: 'fr', path: '/listings/example', title: 'Example', description: 'Description',
    canonicalUrl: 'https://example.test/fr/listings/exemple',
    languageUrls: { en: 'https://example.test/listings/example', fr: 'https://example.test/fr/listings/exemple' },
  });
  assert.equal(metadata.alternates.canonical, 'https://example.test/fr/listings/exemple');
  assert.equal(metadata.alternates.languages['x-default'], 'https://example.test/listings/example');
  assert.equal(metadata.openGraph.locale, 'fr_FR');
});
