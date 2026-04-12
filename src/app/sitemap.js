const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:5000';

export default async function sitemap() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/listings/public?limit=500`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch listings: ${res.statusText}`);
    }

    const data = await res.json();
    const listings = Array.isArray(data.listings)
      ? data.listings
      : Array.isArray(data.data)
        ? data.data
        : [];

    const listingUrls = listings
      .filter((item) => item && (item.slug || item._id))
      .map((item) => ({
        url: `${SITE_URL}/listing/${item.slug || item._id}`,
        lastModified: new Date(item.updatedAt || item.createdAt || Date.now()),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));

    const staticPages = [
      { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
      {
        url: `${SITE_URL}/explore`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${SITE_URL}/blogs`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
    ];

    return [...staticPages, ...listingUrls];
  } catch (error) {
    console.error('Sitemap error:', error);
    return [
      { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
      {
        url: `${SITE_URL}/explore`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${SITE_URL}/blogs`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
    ];
  }
}
