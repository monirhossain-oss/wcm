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

// ── No hand-written dashboard URLs ───────────────────────────────────────────
//
// Every internal link inside the dashboard has to go through `localize()`. A literal `/creator/...`
// works perfectly in English and silently drops the reader back to English from `/fr/creator`,
// which is exactly the kind of bug that only shows up when somebody clicks it. This walks the
// source instead of the rendered page so a new link cannot reintroduce it.
import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const sourceFiles = (directory) =>
  readdirSync(directory).flatMap((entry) => {
    const target = path.join(directory, entry);
    return statSync(target).isDirectory()
      ? sourceFiles(target)
      : /\.(js|jsx)$/.test(entry)
        ? [target]
        : [];
  });

const DASHBOARD_SOURCES = [
  fileURLToPath(new URL('../src/app/(dashboards)/creator/', import.meta.url)),
  fileURLToPath(new URL('../src/components/creator/', import.meta.url)),
];

// A route the reader can be sent to: an href, or a router navigation.
const NAVIGATION = /(?:href=\{?|router\.(?:push|replace)\()\s*[`'"]\/(creator|listings|profile|blogs|explore|favorites)\b/g;

test('no dashboard navigation hardcodes a path instead of localizing it', () => {
  const offenders = [];
  for (const directory of DASHBOARD_SOURCES) {
    for (const file of sourceFiles(directory)) {
      const source = readFileSync(file, 'utf8');
      source.split(/\r?\n/).forEach((line, index) => {
        NAVIGATION.lastIndex = 0;
        if (NAVIGATION.test(line)) {
          offenders.push(`${path.basename(path.dirname(file))}/${path.basename(file)}:${index + 1}`);
        }
      });
    }
  }
  assert.deepEqual(
    offenders,
    [],
    `these navigations need localize(): ${offenders.join(', ')}`
  );
});

// ── localize() as the pages actually call it ─────────────────────────────────
//
// The source scan above proves every link goes through `localize()`; this proves `localize()` sends
// them somewhere right. The provider is rendered with its hooks stubbed and the resulting context
// value is read directly, so these are the very strings the pages put in an href.
const React = require('react');

function loadComponent(path, mocks = {}, globals = {}) {
  const { code } = transformSync(readFileSync(new URL(path, root), 'utf8'), {
    filename: path,
    babelrc: false,
    configFile: false,
    presets: [
      [
        require.resolve('next/dist/compiled/babel/preset-env'),
        { targets: { node: 'current' }, modules: 'commonjs' },
      ],
      [require.resolve('next/dist/compiled/babel/preset-react'), { runtime: 'classic' }],
    ],
  });
  const loaded = { exports: {} };
  vm.runInNewContext(code, {
    module: loaded,
    exports: loaded.exports,
    React,
    console,
    URL,
    process: { env: { NEXT_PUBLIC_API_BASE_URL: 'https://api.test' } },
    ...globals,
    require: (name) => (name in mocks ? mocks[name] : require(name)),
  });
  return loaded.exports;
}

const i18n = load('src/lib/i18n/index.js', {
  './catalogs/en': load('src/lib/i18n/catalogs/en.js'),
  './catalogs/fr': load('src/lib/i18n/catalogs/fr.js'),
  './format': load('src/lib/i18n/format.js'),
  './catalogs/creator/en': load('src/lib/i18n/catalogs/creator/en.js'),
  './catalogs/creator/fr': load('src/lib/i18n/catalogs/creator/fr.js'),
  '@/lib/seo/publicPageRegistry': load('src/lib/seo/publicPageRegistry.js'),
});

const dashboardContext = (pathname) => {
  const Provider = loadComponent(
    'src/context/DashboardLocaleProvider.jsx',
    {
      react: {
        ...React,
        useEffect: () => {},
        useState: (initial) => [typeof initial === 'function' ? initial() : initial, () => {}],
        useCallback: (fn) => fn,
        useMemo: (fn) => fn(),
      },
      'next/navigation': { usePathname: () => pathname },
      '@/lib/i18n': i18n,
      '@/lib/i18n/format': load('src/lib/i18n/format.js'),
      '@/lib/localePreference': preference,
      './LocaleContext': { LocaleContext: { Provider: 'ctx' } },
    },
    { document: { documentElement: {} }, fetch: () => ({ then: () => ({ then: () => ({ catch: () => {} }) }) }) }
  ).default;
  return Provider({ initialLocale: 'en', children: null }).props.value;
};

test('a French reader keeps the prefix on every link the dashboard renders', () => {
  const { locale, localize } = dashboardContext('/fr/creator');
  assert.equal(locale, 'fr');

  for (const [from, expected] of [
    // Dashboard routes — the ones that were dropping back to English.
    ['/creator/transactions', '/fr/creator/transactions'],
    ['/creator/promotions', '/fr/creator/promotions'],
    ['/creator/add', '/fr/creator/add'],
    ['/creator/promotions/abc123', '/fr/creator/promotions/abc123'],
    ['/creator/translations', '/fr/creator/translations'],
    ['/creator/translations/listing/abc123', '/fr/creator/translations/listing/abc123'],
    ['/creator/listings', '/fr/creator/listings'],
    // Links out to the public site.
    ['/listings/abc123', '/fr/listings/abc123'],
    ['/profile', '/fr/profile'],
    ['/boost-terms-and-ppc', '/fr/boost-terms-and-ppc'],
    ['/', '/fr'],
  ]) {
    assert.equal(localize(from), expected, from);
  }

  // Query and hash survive.
  assert.equal(localize('/creator/listings?page=2#top'), '/fr/creator/listings?page=2#top');
  // External links are left alone.
  assert.equal(localize('https://stripe.com/x'), 'https://stripe.com/x');
  assert.equal(localize('mailto:a@b.c'), 'mailto:a@b.c');
});

test('an English reader gets unprefixed links', () => {
  const { locale, localize } = dashboardContext('/creator');
  assert.equal(locale, 'en');
  for (const path of ['/creator/transactions', '/listings/abc123', '/profile', '/']) {
    assert.equal(localize(path), path, path);
  }
});
