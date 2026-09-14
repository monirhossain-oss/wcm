import en from './catalogs/en';
import fr from './catalogs/fr';
import creatorEn from './catalogs/creator/en';
import creatorFr from './catalogs/creator/fr';
import { localizedRoutePath } from '@/lib/seo/publicPageRegistry';

export const SOURCE_LOCALE = 'en';

// The Creator Dashboard carries roughly as many keys as the whole public site, so it keeps its own
// file per language. The two halves are joined here rather than inside catalogs/en.js: that file is
// loaded as a standalone module by the test suite, where a relative import cannot resolve.
export const catalogs = Object.freeze({
  en: { ...en, creator: creatorEn },
  fr: { ...fr, creator: creatorFr },
});

export const getCatalogValue = (catalog, key) => key.split('.').reduce((value, part) => value?.[part], catalog);
export const translate = (locale, key, fallback) =>
  getCatalogValue(catalogs[locale], key) ?? getCatalogValue(catalogs.en, key) ?? fallback ?? key;

export { format } from './format';

export const localePath = (locale, path = '/') => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const target = !locale ? SOURCE_LOCALE : locale;
  // Routes whose two languages are not a simple prefix apart (FAQ: /faqUs ↔ /fr/faq) come from the registry.
  const mapped = localizedRoutePath(normalized, target);
  if (mapped) return mapped;
  if (target === SOURCE_LOCALE) return normalized;
  if (normalized === '/') return `/${target}`;
  return `/${target}${normalized}`;
};

export const stripLocale = (path, publishedLocales = []) => {
  const parts = String(path || '/').split('/').filter(Boolean);
  return publishedLocales.includes(parts[0]) ? `/${parts.slice(1).join('/')}` || '/' : path;
};
