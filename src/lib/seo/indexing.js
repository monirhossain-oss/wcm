// Stage 5: which public URLs may be indexed. Private/account/placeholder routes are always excluded,
// and Explore is indexable only for a valid category/region combination — never for a search or an
// unknown filter, which would otherwise create unbounded near-duplicate URLs.
import { continentMapping } from '@/constants/continentData';
import { slugsMatch, toRouteSlug } from '@/lib/exploreSlug';

// Private and placeholder pages stay crawlable for link discovery but out of the index.
export const NOINDEX = Object.freeze({ index: false, follow: true, googleBot: { index: false, follow: true } });
// Token-bearing recovery URLs: never indexed and never followed, so the token is not crawled onward.
export const NOINDEX_NOFOLLOW = Object.freeze({ index: false, follow: false, googleBot: { index: false, follow: false } });

// Stage 6: robots.txt must never block a URL whose exclusion depends on a meta robots tag — a
// disallowed URL is not fetched, so its `noindex` is never read and the URL can still be listed
// from links alone. Only non-public surfaces are blocked here; every noindex route in the registry
// and every non-indexable Explore URL stays crawlable so the tag is what removes it. The former
// `*/search/*` rule is gone for exactly that reason: search results now carry `noindex`.
export const ROBOTS_DISALLOW = Object.freeze(['/admin/', '/api/']);

export const REGION_SLUGS = Object.freeze(Object.keys(continentMapping));
export const isRegionSlug = (slug) => REGION_SLUGS.includes(toRouteSlug(slug));

// `categories` are the master (English) category documents; Explore URLs use master slugs in both
// languages, so the same list validates English and French URLs identically.
export const isCategorySlug = (slug, categories = []) =>
  categories.some((category) => slugsMatch(category?.title, slug));

// Decides whether one Explore URL may be indexed. `reason` is for tests and debugging only.
export const resolveExploreIndexing = (filters = [], categories = []) => {
  const segments = (filters || []).filter(Boolean);
  if (segments.includes('search')) return { indexable: false, reason: 'search' };
  if (segments.length === 0) return { indexable: true, reason: 'base' };
  if (segments.length > 2) return { indexable: false, reason: 'too-many-segments' };

  const [first, second] = segments;
  if (segments.length === 1) {
    if (isRegionSlug(first)) return { indexable: true, reason: 'region' };
    if (isCategorySlug(first, categories)) return { indexable: true, reason: 'category' };
    return { indexable: false, reason: 'unknown-filter' };
  }
  if (!isCategorySlug(first, categories)) return { indexable: false, reason: 'unknown-category' };
  if (!isRegionSlug(second)) return { indexable: false, reason: 'unknown-region' };
  return { indexable: true, reason: 'category-region' };
};
