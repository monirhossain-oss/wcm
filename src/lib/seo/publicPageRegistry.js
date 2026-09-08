// Stage 1 inventory. Metadata, admin options and sitemap consumers are wired in later stages.
// Only base routes are stored here; never materialize account tokens or detail slugs.
const pages = [
  { id: 'home', seoKey: 'home', en: '/', fr: '/fr' },
  { id: 'about', seoKey: 'about', en: '/about-us', fr: '/fr/about-us' },
  { id: 'contact', seoKey: 'contact', en: '/contact', fr: '/fr/contact' },
  { id: 'how-it-works', seoKey: 'how-it-works', en: '/how-it-works', fr: '/fr/how-it-works' },
  { id: 'blogs', seoKey: 'blog', en: '/blogs', fr: '/fr/blogs' },
  { id: 'creators', seoKey: 'creators', en: '/creators', fr: '/fr/creators' },
  { id: 'explore', seoKey: 'explore', en: '/explore', fr: '/fr/explore', indexing: 'filtered' },
  { id: 'faq', seoKey: 'faq', en: '/faqUs', fr: '/fr/faq', aliases: { fr: ['/fr/faqUs'] } },
  { id: 'become-creator', seoKey: 'become-creator', en: '/become-creator', fr: '/fr/become-creator' },
  { id: 'advertising-policy', seoKey: 'advertising-policy', en: '/advertising-policy', fr: '/fr/advertising-policy' },
  { id: 'boost-terms-and-ppc', seoKey: 'boost-terms-and-ppc', en: '/boost-terms-and-ppc', fr: '/fr/boost-terms-and-ppc' },
  { id: 'creator-terms-and-conditions', seoKey: 'creator-terms-and-conditions', en: '/creator-terms-and-conditions', fr: '/fr/creator-terms-and-conditions' },
  { id: 'privacy-policy', seoKey: 'privacy', en: '/privacy-policy', fr: '/fr/privacy-policy' },
  { id: 'terms-and-conditions', seoKey: 'terms', en: '/terms-and-conditions', fr: '/fr/terms-and-conditions' },
  { id: 'cookie-policy', seoKey: 'cookie', en: '/cookie-policy', fr: '/fr/cookie-policy' },
  { id: 'profile', en: '/profile', fr: '/fr/profile', indexing: 'noindex' },
  { id: 'favorites', en: '/favorites', fr: '/fr/favorites', indexing: 'noindex' },
  { id: 'verify-email', en: '/verify-email', fr: '/fr/verify-email', indexing: 'noindex' },
  { id: 'reset-password', en: '/reset-password/[token]', fr: '/fr/reset-password/[token]', indexing: 'noindex' },
  { id: 'products', en: '/products', fr: null, indexing: 'noindex' },
];

export const PUBLIC_SEO_PAGES = Object.freeze(pages.map(({ en, fr, aliases = {}, ...page }) => Object.freeze({
  indexing: 'index', seoKey: null, ...page,
  paths: Object.freeze({ en, fr }),
  aliases: Object.freeze(Object.fromEntries(Object.entries(aliases).map(([locale, paths]) => [locale, Object.freeze(paths)]))),
})));

const normalizePath = (path) => {
  const trimmed = String(path || '/').split(/[?#]/)[0].replace(/\/+$/, '');
  return trimmed || '/';
};

// Finds the registry entry a public path belongs to, including non-canonical aliases such as /fr/faqUs.
// Returns the matched locale so callers can tell a canonical path from an alias.
export const findPublicRoute = (path) => {
  const target = normalizePath(path);
  for (const page of PUBLIC_SEO_PAGES) {
    for (const locale of ['en', 'fr']) {
      if (page.paths[locale] && normalizePath(page.paths[locale]) === target) return { page, locale, isAlias: false };
      if ((page.aliases[locale] || []).some((alias) => normalizePath(alias) === target)) return { page, locale, isAlias: true };
    }
  }
  return null;
};

// Canonical path for a registry route in another language — the only correct way to move between
// /faqUs and /fr/faq. Returns null for paths the registry does not own (details, aliases with no target).
export const localizedRoutePath = (path, targetLocale) => {
  const match = findPublicRoute(path);
  return match?.page.paths[targetLocale] || null;
};

// The canonical form of a path in its own language; /fr/faqUs resolves to /fr/faq.
export const canonicalRoutePath = (path) => {
  const match = findPublicRoute(path);
  return match?.isAlias ? match.page.paths[match.locale] : null;
};
