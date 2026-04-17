const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:5000';

export default async function sitemap() {
  try {
    // ১. লিস্টিং এবং ক্রিয়েটর ডাটা প্যারালাল ফেচ করা
    const [listingRes, creatorRes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/listings/public?limit=500`, { next: { revalidate: 3600 } }),
      fetch(`${API_BASE_URL}/api/users/creators`, { next: { revalidate: 3600 } }).catch(() => null)
    ]);

    // লিস্টিং ডাটা প্রসেসিং
    let listings = [];
    if (listingRes?.ok) {
      const data = await listingRes.json();
      listings = data.listings || data.data || [];
    }

    // ক্রিয়েটর ডাটা প্রসেসিং
    let creators = [];
    if (creatorRes?.ok) {
      const creatorData = await creatorRes.json();
      creators = creatorData.creators || creatorData.users || [];
    }

    // ২. লিস্টিং URL জেনারেট
    const listingUrls = listings
      .filter((item) => item && (item.slug || item._id))
      .map((item) => ({
        url: `${SITE_URL}/listing/${item.slug || item._id}`,
        lastModified: new Date(item.updatedAt || item.createdAt || Date.now()),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));

    // ৩. ক্রিয়েটর প্রোফাইল URL জেনারেট
    const creatorUrls = creators
      .filter(user => user.username)
      .map((user) => ({
        url: `${SITE_URL}/profile/${user.username}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      }));

    // ৪. সব স্ট্যাটিক পেজ যোগ করা
    const staticPages = [
      { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
      { url: `${SITE_URL}/explore`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
      { url: `${SITE_URL}/blogs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
      { url: `${SITE_URL}/about-us`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
      { url: `${SITE_URL}/faqUs`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
      { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
      { url: `${SITE_URL}/how-it-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
      { url: `${SITE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
      // ফিক্স: '&' এর বদলে 'and' ব্যবহার করা হয়েছে XML এরর এড়াতে
      { url: `${SITE_URL}/terms-and-conditions`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    ];

    return [...staticPages, ...listingUrls, ...creatorUrls];

  } catch (error) {
    console.error('Sitemap error:', error);
    // এরর হলেও যাতে মেইন পেজগুলো রিটার্ন করে
    return [
      { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
      { url: `${SITE_URL}/explore`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
      { url: `${SITE_URL}/blogs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ];
  }
}