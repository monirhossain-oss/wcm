// Stage 6: base pages come from the registry (see lib/seo/sitemapEntries.js); the listing, blog,
// creator-profile and localized feeds keep their existing sources, moderation filters and
// publication rules. Timestamps are only ever a stored record date — never "now".
import { PUBLIC_SEO_PAGES, findPublicRoute } from '@/lib/seo/publicPageRegistry';
import { buildBaseSitemapEntries, sitemapEntry, toValidDate } from '@/lib/seo/sitemapEntries';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

const fetchJson = async (url) => {
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    return response.ok ? response.json() : null;
  } catch { return null; }
};

const rememberLatest = (timestamps, path, value) => {
  const date = toValidDate(value);
  if (!path || !date) return;
  const current = timestamps.get(path);
  if (!current || date > current) timestamps.set(path, date);
};

const seoPageByKey = (pageName) => PUBLIC_SEO_PAGES.find(({ seoKey }) => seoKey && seoKey === pageName);

export default async function sitemap() {
  const [listingData, creatorData, blogData, translationData, languageData, englishSeo, frenchSeo] = await Promise.all([
    fetchJson(`${API_BASE_URL}/api/listings/public?limit=500&offset=0`),
    fetchJson(`${API_BASE_URL}/api/users/famous-creators?limit=500&offset=0`),
    fetchJson(`${API_BASE_URL}/api/blogs?limit=500&offset=0`),
    fetchJson(`${API_BASE_URL}/api/translations/sitemap`),
    fetchJson(`${API_BASE_URL}/api/translations/languages`),
    fetchJson(`${API_BASE_URL}/api/seo/all?languageCode=en`),
    fetchJson(`${API_BASE_URL}/api/seo/all?languageCode=fr`),
  ]);

  // A language appears only while it is published — the same gate hreflang uses, so the sitemap
  // can never advertise a URL the page itself refuses to list as an alternate.
  const published = (languageData?.data || []).map(({ code }) => code).filter(Boolean);
  const locales = ['en', ...published.filter((code) => code && code !== 'en')];

  // The two honest change signals for a base page: when its stored SEO text was last edited, and
  // when the localized CMS record behind it was last published.
  const timestamps = new Map();
  for (const [locale, payload] of [['en', englishSeo], ['fr', frenchSeo]]) {
    for (const record of Array.isArray(payload) ? payload : payload?.data || []) {
      rememberLatest(timestamps, seoPageByKey(record?.pageName)?.paths[locale], record?.updatedAt);
    }
  }
  const localizedFeed = translationData?.data || [];
  for (const localized of localizedFeed) {
    const match = localized?.path ? findPublicRoute(localized.path) : null;
    if (match) rememberLatest(timestamps, match.page.paths[match.locale], localized.lastModified);
  }

  const urls = buildBaseSitemapEntries({ locales, lastModifiedByPath: timestamps });

  for (const item of listingData?.listings || listingData?.data || []) if (item?.slug || item?._id) {
    urls.push(sitemapEntry({ path: `/listings/${item.slug || item._id}`, lastModified: item.updatedAt || item.createdAt, priority: 0.7 }));
  }
  for (const user of creatorData?.data || []) if (user?.slug || user?.username) {
    urls.push(sitemapEntry({ path: `/profile/${user.slug || user.username}`, lastModified: user.updatedAt || user.createdAt, priority: 0.6 }));
  }
  for (const blog of blogData?.blogs || []) if (blog?.slug || blog?._id) {
    urls.push(sitemapEntry({ path: `/blogs/${blog.slug || blog._id}`, lastModified: blog.updatedAt || blog.createdAt, priority: 0.7 }));
  }
  // Localized detail URLs only: a base page the feed also reports is already listed above with the
  // feed's timestamp, and listing it again would fight the registry over priority and canonical form.
  for (const localized of localizedFeed) if (localized?.path && !findPublicRoute(localized.path)) {
    urls.push(sitemapEntry({ path: localized.path, lastModified: localized.lastModified, priority: 0.7 }));
  }

  return [...new Map(urls.map((item) => [item.url, item])).values()];
}
