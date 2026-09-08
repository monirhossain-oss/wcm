// Shared origin/image defaults; keep the existing local-development fallback.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
export const DEFAULT_SOCIAL_IMAGE_PATH = '/og-image.jpg';
export const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}${DEFAULT_SOCIAL_IMAGE_PATH}`;

export const REQUEST_LOCALE_HEADER = 'x-wcm-locale';
// Stage 6: the proxy also forwards the requested path so the root layout can emit page-level
// structured data for a registry route without guessing the URL from anything caller-controlled.
export const REQUEST_PATH_HEADER = 'x-wcm-path';
export const getPathLocale = (pathname = '/') => /^\/fr(?:\/|$)/.test(pathname) ? 'fr' : 'en';
export const getDocumentLanguage = (locale) => ({ lang: locale === 'fr' ? 'fr' : 'en', dir: 'ltr' });
