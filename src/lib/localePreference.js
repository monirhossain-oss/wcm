// Dashboard locale routing.
//
// The dashboards follow the same rule as the public site: the URL owns the language. English is
// unprefixed (`/creator`) and every other language carries its prefix (`/fr/creator`). The stored
// preference below is no longer what decides a dashboard's language — it only keeps the public
// language switcher and the dashboard switcher agreeing with each other.
//
// The dashboard route tree is not duplicated per language. `proxy.js` rewrites `/fr/creator/...`
// onto the real `/creator/...` route, so the browser keeps the prefixed URL while Next renders the
// single existing tree. That is why `/fr/creator` must never be added to `publicPageRegistry.js`
// and why the public `[locale]` catch-all never sees it.
//
// Deliberately free of imports: `proxy.js` runs this on every request and must not pull the UI
// catalogs into the middleware bundle.

export const LOCALE_COOKIE = 'wcm_locale';
export const LOCALE_STORAGE_KEY = 'wcm_locale';

// Locales that have a UI catalog. Adding a language means adding `catalogs/<code>.js` and
// `catalogs/creator/<code>.js`, so this list is checked against the catalogs themselves in
// tests/catalogParity.test.mjs rather than being free to drift.
//
// This is not a publication check: whether a language is offered to readers comes from
// `LanguageConfiguration` through `GET /api/translations/languages`, and the switcher uses that.
// The list here only keeps an invented URL prefix from reaching `<html lang>` or a catalog lookup.
export const CATALOG_LOCALES = ['en', 'fr'];

export const DEFAULT_LOCALE = 'en';

// The first segment of every dashboard route.
export const DASHBOARD_ROOTS = ['creator', 'admin'];

export const resolvePreferredLocale = (value) =>
  CATALOG_LOCALES.includes(value) ? value : DEFAULT_LOCALE;

// Splits a dashboard URL into the language it is asking for and the route that actually exists.
//
//   '/creator/listings'    → { locale: 'en', path: '/creator/listings' }
//   '/fr/creator/listings' → { locale: 'fr', path: '/creator/listings' }
//   '/creators'            → null  (a public route that merely starts the same way)
//   '/en/creator'          → null  (English is unprefixed; this falls through to the public
//                                   [locale] layout, which 404s `en` exactly as it does today)
//   '/de/creator'          → null  (no catalog, so no rewrite; the public layout 404s it)
export const splitDashboardPath = (pathname = '/') => {
  const segments = String(pathname || '/')
    .split('/')
    .filter(Boolean);

  if (DASHBOARD_ROOTS.includes(segments[0])) {
    return { locale: DEFAULT_LOCALE, path: `/${segments.join('/')}` };
  }

  const [maybeLocale, ...rest] = segments;
  const isPrefixedLocale =
    CATALOG_LOCALES.includes(maybeLocale) && maybeLocale !== DEFAULT_LOCALE;

  if (isPrefixedLocale && DASHBOARD_ROOTS.includes(rest[0])) {
    return { locale: maybeLocale, path: `/${rest.join('/')}` };
  }

  return null;
};

export const isDashboardPath = (pathname) => splitDashboardPath(pathname) !== null;

// The URL a dashboard route has in a given language. English stays unprefixed, matching the public
// site's rule so that one mental model covers the whole application.
export const dashboardPath = (locale, path = '/') => {
  const target = resolvePreferredLocale(locale);
  const normalized = String(path || '/').startsWith('/') ? path : `/${path}`;
  return target === DEFAULT_LOCALE ? normalized : `/${target}${normalized}`;
};

// Reads the preference on the client. Both stores are tried because `writeStoredLocale` writes
// both and either one can be missing (cleared site data, a private window, a cookie-less embed).
export const readStoredLocale = () => {
  let stored;
  try {
    stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  } catch {
    stored = null;
  }
  if (!stored && typeof document !== 'undefined') {
    stored = document.cookie.match(/(?:^|; )wcm_locale=([^;]+)/)?.[1];
  }
  return CATALOG_LOCALES.includes(stored) ? stored : null;
};

export const writeStoredLocale = (locale) => {
  const target = resolvePreferredLocale(locale);
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, target);
  } catch {
    // A private window can refuse storage; the cookie below is the one the public site reads.
  }
  document.cookie = `${LOCALE_COOKIE}=${target}; Path=/; Max-Age=31536000; SameSite=Lax`;
  return target;
};
