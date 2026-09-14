import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import test from 'node:test';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const { transformSync } = require('next/dist/compiled/babel/core');
const root = new URL('../', import.meta.url);

function load(path, mocks = {}) {
  const { code } = transformSync(readFileSync(new URL(path, root), 'utf8'), {
    filename: path,
    babelrc: false,
    configFile: false,
    presets: [
      [
        require.resolve('next/dist/compiled/babel/preset-env'),
        { targets: { node: 'current' }, modules: 'commonjs' },
      ],
    ],
  });
  const loaded = { exports: {} };
  vm.runInNewContext(code, {
    module: loaded,
    exports: loaded.exports,
    console,
    URL,
    Headers,
    String,
    Object,
    Array,
    process: { env: { NEXT_PUBLIC_SITE_URL: 'https://worldculturemarketplace.com' } },
    require: (name) => (name in mocks ? mocks[name] : require(name)),
  });
  return loaded.exports;
}

const preference = load('src/lib/localePreference.js');
const site = load('src/lib/seo/siteConfig.js');
const { splitDashboardPath, dashboardPath, isDashboardPath } = preference;

// The module runs in a vm realm, so its object literals carry that realm's prototype and
// deepStrictEqual would reject them on identity alone. Re-spreading brings them back into ours.
const split = (pathname) => {
  const result = splitDashboardPath(pathname);
  return result && { ...result };
};

// ── URL shape ────────────────────────────────────────────────────────────────

test('a dashboard URL is split into its language and the route that exists', () => {
  assert.deepEqual(split('/creator'), { locale: 'en', path: '/creator' });
  assert.deepEqual(split('/creator/listings'), {
    locale: 'en',
    path: '/creator/listings',
  });
  assert.deepEqual(split('/fr/creator'), { locale: 'fr', path: '/creator' });
  assert.deepEqual(split('/fr/creator/promotions/abc123'), {
    locale: 'fr',
    path: '/creator/promotions/abc123',
  });
  assert.deepEqual(split('/fr/admin/translations'), {
    locale: 'fr',
    path: '/admin/translations',
  });
});

// A public route that merely starts with the same letters must not be captured, or the proxy would
// rewrite it onto a dashboard route that does not exist.
test('public routes are never treated as dashboard routes', () => {
  for (const path of [
    '/',
    '/creators',
    '/fr/creators',
    '/administration',
    '/blogs/creator',
    '/fr/blogs/creator',
    '/profile',
  ]) {
    assert.equal(splitDashboardPath(path), null, path);
    assert.equal(isDashboardPath(path), false, path);
  }
});

// English is unprefixed, so `/en/creator` is not a second spelling of `/creator`. Leaving it
// unmatched lets it fall through to the public [locale] layout, which already 404s `en`.
test('an English prefix and an unknown language are not dashboard routes', () => {
  assert.equal(splitDashboardPath('/en/creator'), null);
  assert.equal(splitDashboardPath('/de/creator'), null);
  assert.equal(splitDashboardPath('/es/creator/listings'), null);
});

test('a dashboard route is rebuilt in either language', () => {
  assert.equal(dashboardPath('en', '/creator/listings'), '/creator/listings');
  assert.equal(dashboardPath('fr', '/creator/listings'), '/fr/creator/listings');
  assert.equal(dashboardPath('de', '/creator'), '/creator', 'unknown language falls back to English');
});

test('splitting and rebuilding a URL is lossless in both languages', () => {
  for (const url of ['/creator', '/creator/translations/listing/abc', '/fr/creator/transactions']) {
    const parts = splitDashboardPath(url);
    assert.equal(dashboardPath(parts.locale, parts.path), url, url);
  }
});

// ── Proxy ────────────────────────────────────────────────────────────────────

const loadProxy = () =>
  load('src/proxy.js', {
    '@/lib/hostRedirect': load('src/lib/hostRedirect.js'),
    '@/lib/seo/siteConfig': site,
    '@/lib/seo/publicPageRegistry': load('src/lib/seo/publicPageRegistry.js'),
    '@/lib/localePreference': preference,
    'next/server': {
      NextResponse: {
        next: (options) => ({ ...options, type: 'next' }),
        rewrite: (url, options) => ({ ...options, url: String(url), type: 'rewrite' }),
        redirect: (url, status) => ({ url: String(url), status, type: 'redirect' }),
      },
    },
  });

const request = (path, hostname = 'worldculturemarketplace.com') => ({
  url: `https://${hostname}${path}`,
  nextUrl: new URL(`https://${hostname}${path}`),
  headers: new Headers({ host: hostname, cookie: 'example=value' }),
  cookies: { get: () => undefined },
});

test('a French dashboard URL is rewritten onto the single existing route tree', () => {
  const { proxy } = loadProxy();
  const result = proxy(request('/fr/creator/listings?page=2'));

  assert.equal(result.type, 'rewrite');
  assert.equal(result.url, 'https://worldculturemarketplace.com/creator/listings?page=2');
  assert.equal(result.request.headers.get(site.REQUEST_LOCALE_HEADER), 'fr');
  // The header keeps the URL the reader actually asked for, not the rewritten target.
  assert.equal(result.request.headers.get(site.REQUEST_PATH_HEADER), '/fr/creator/listings');
  assert.equal(result.request.headers.get('cookie'), 'example=value');
});

test('an English dashboard URL passes through untouched', () => {
  const { proxy } = loadProxy();
  const result = proxy(request('/creator/listings'));

  assert.equal(result.type, 'next');
  assert.equal(result.request.headers.get(site.REQUEST_LOCALE_HEADER), 'en');
  assert.equal(result.request.headers.get(site.REQUEST_PATH_HEADER), '/creator/listings');
});

// The cookie used to decide the dashboard's language. Now the URL does, and a stale cookie must not
// be able to override the address the reader is looking at.
test('the stored preference cannot override the language in the URL', () => {
  const { proxy } = loadProxy();
  const withCookie = (path, value) => ({
    ...request(path),
    cookies: { get: () => ({ value }) },
  });

  assert.equal(
    proxy(withCookie('/creator', 'fr')).request.headers.get(site.REQUEST_LOCALE_HEADER),
    'en'
  );
  assert.equal(
    proxy(withCookie('/fr/creator', 'en')).request.headers.get(site.REQUEST_LOCALE_HEADER),
    'fr'
  );
});

test('public routing is unchanged by the dashboard branch', () => {
  const { proxy } = loadProxy();

  for (const [path, expected] of [
    ['/', 'en'],
    ['/fr', 'fr'],
    ['/fr/contact', 'fr'],
    ['/creators', 'en'],
    ['/fr/creators', 'fr'],
  ]) {
    const result = proxy(request(path));
    assert.equal(result.type, 'next', path);
    assert.equal(result.request.headers.get(site.REQUEST_LOCALE_HEADER), expected, path);
  }

  // The registry alias still redirects, and a dashboard path never reaches that check.
  const alias = proxy(request('/fr/faqUs'));
  assert.equal(alias.type, 'redirect');
  assert.equal(alias.status, 301);
  assert.equal(alias.url, 'https://worldculturemarketplace.com/fr/faq');
});

test('the .fr host redirect still wins over dashboard handling', () => {
  const { proxy } = loadProxy();
  const result = proxy(request('/fr/creator', 'worldculturemarketplace.fr'));
  assert.equal(result.type, 'redirect');
  assert.equal(result.status, 301);
  assert.equal(result.url, 'https://worldculturemarketplace.com/fr/creator');
});
