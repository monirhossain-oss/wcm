const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

const englishStaticPaths = ['/', '/explore', '/blogs', '/creators', '/about-us', '/faqUs', '/contact', '/how-it-works', '/privacy-policy', '/terms-and-conditions', '/cookie-policy'];
const frenchStaticPaths = ['/', '/explore', '/blogs', '/creators', '/about-us', '/faq', '/how-it-works', '/privacy-policy', '/terms-and-conditions', '/cookie-policy'];
const entry = (path, lastModified = new Date(), priority = 0.5) => ({
  url: `${SITE_URL}${path === '/' ? '' : path}`, lastModified: new Date(lastModified), changeFrequency: 'weekly', priority,
});

const fetchJson = async (url) => {
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    return response.ok ? response.json() : null;
  } catch { return null; }
};

export default async function sitemap() {
  const [listingData, creatorData, blogData, translationData, languageData] = await Promise.all([
    fetchJson(`${API_BASE_URL}/api/listings/public?limit=500&offset=0`),
    fetchJson(`${API_BASE_URL}/api/users/famous-creators?limit=500&offset=0`),
    fetchJson(`${API_BASE_URL}/api/blogs?limit=500&offset=0`),
    fetchJson(`${API_BASE_URL}/api/translations/sitemap`),
    fetchJson(`${API_BASE_URL}/api/translations/languages`),
  ]);

  const urls = englishStaticPaths.map((path) => entry(path, new Date(), path === '/' ? 1 : 0.5));
  if ((languageData?.data || []).some(({ code }) => code === 'fr')) {
    urls.push(...frenchStaticPaths.map((path) => entry(`/fr${path === '/' ? '' : path}`)));
  }
  for (const item of listingData?.listings || listingData?.data || []) if (item?.slug || item?._id) {
    urls.push(entry(`/listings/${item.slug || item._id}`, item.updatedAt || item.createdAt, 0.7));
  }
  for (const user of creatorData?.data || []) if (user?.slug || user?.username) {
    urls.push(entry(`/profile/${user.slug || user.username}`, user.updatedAt || user.createdAt, 0.6));
  }
  for (const blog of blogData?.blogs || []) if (blog?.slug || blog?._id) {
    urls.push(entry(`/blogs/${blog.slug || blog._id}`, blog.updatedAt || blog.createdAt, 0.7));
  }
  for (const localized of translationData?.data || []) if (localized?.path) {
    urls.push(entry(localized.path, localized.lastModified, 0.7));
  }

  return [...new Map(urls.map((item) => [item.url, item])).values()];
}
