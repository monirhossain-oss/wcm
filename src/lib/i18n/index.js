import en from './catalogs/en';
import fr from './catalogs/fr';
import { localizedRoutePath } from '@/lib/seo/publicPageRegistry';

export const SOURCE_LOCALE = 'en';
export const catalogs = Object.freeze({ en, fr });

export const getCatalogValue = (catalog, key) => key.split('.').reduce((value, part) => value?.[part], catalog);
export const translate = (locale, key, fallback) =>
  getCatalogValue(catalogs[locale], key) ?? getCatalogValue(catalogs.en, key) ?? fallback ?? key;

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
