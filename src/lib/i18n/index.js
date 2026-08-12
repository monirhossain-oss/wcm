import en from './catalogs/en';
import fr from './catalogs/fr';

export const SOURCE_LOCALE = 'en';
export const catalogs = Object.freeze({ en, fr });

export const getCatalogValue = (catalog, key) => key.split('.').reduce((value, part) => value?.[part], catalog);
export const translate = (locale, key, fallback) =>
  getCatalogValue(catalogs[locale], key) ?? getCatalogValue(catalogs.en, key) ?? fallback ?? key;

export const localePath = (locale, path = '/') => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (!locale || locale === SOURCE_LOCALE) return normalized;
  if (normalized === '/') return `/${locale}`;
  return `/${locale}${normalized}`;
};

export const stripLocale = (path, publishedLocales = []) => {
  const parts = String(path || '/').split('/').filter(Boolean);
  return publishedLocales.includes(parts[0]) ? `/${parts.slice(1).join('/')}` || '/' : path;
};
