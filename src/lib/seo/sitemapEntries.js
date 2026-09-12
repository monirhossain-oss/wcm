// Stage 6: the base-page half of the sitemap, derived from the registry so it cannot drift from
// the indexing policy. Excluded by construction: every `noindex` route (own profile, favorites,
// verify-email, the token-bearing reset link and the Products placeholder), non-canonical aliases,
// and every filtered/search Explore URL — Explore contributes only its unfiltered address, so the
// sitemap stays small instead of enumerating category/region combinations.
import { PUBLIC_SEO_PAGES } from './publicPageRegistry';
import { SITE_URL } from './siteConfig';

export const SITEMAP_BASE_PAGES = Object.freeze(
  PUBLIC_SEO_PAGES.filter(({ seoKey, indexing }) => Boolean(seoKey) && indexing !== 'noindex'),
);

// A sitemap URL must be a valid URI. Registry paths are already safe, but a feed identifier can
// carry a space or another character that is not allowed raw in a path, so each segment is encoded
// individually — separators are preserved and an already-safe slug passes through unchanged.
const encodePath = (path) => String(path).split('/').map(encodeURIComponent).join('/');
export const absoluteUrl = (path) => `${SITE_URL}${path === '/' ? '' : encodePath(path)}`;

export const toValidDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

// A sitemap entry claims a change date only when something actually recorded one. Stamping the
// current time on every crawl would tell search engines the whole site changed continuously,
// which makes lastModified worthless for the pages that really did change.
export const sitemapEntry = ({ path, lastModified, priority, alternates }) => {
  const date = toValidDate(lastModified);
  const entry = { url: absoluteUrl(path), changeFrequency: 'weekly', priority };
  const dated = date ? { ...entry, lastModified: date } : entry;
  return alternates ? { ...dated, alternates } : dated;
};

// hreflang for one registry page, as every locale that has a path for it. The sitemap carries the
// same annotation the pages themselves emit, so the two can never disagree about the cluster, and
// x-default is the unprefixed English URL exactly as in the page metadata.
const languageAlternates = (page, locales) => {
  const languages = Object.fromEntries(locales
    .filter((locale) => page.paths[locale])
    .map((locale) => [locale, absoluteUrl(page.paths[locale])]));
  if (Object.keys(languages).length < 2) return undefined;
  return { languages: { ...languages, 'x-default': languages.en || absoluteUrl(page.paths.en) } };
};

// `locales` are the published language codes; a language the registry has no path for contributes
// nothing, so an enabled-but-unmapped language can never produce an invented URL.
export const buildBaseSitemapEntries = ({ locales = ['en'], lastModifiedByPath } = {}) => {
  const timestamps = lastModifiedByPath || new Map();
  return SITEMAP_BASE_PAGES.flatMap((page) => {
    const alternates = languageAlternates(page, locales);
    return locales.flatMap((locale) => {
      const path = page.paths[locale];
      if (!path) return [];
      return [sitemapEntry({ path, lastModified: timestamps.get(path), priority: page.id === 'home' ? 1 : 0.5, alternates })];
    });
  });
};
