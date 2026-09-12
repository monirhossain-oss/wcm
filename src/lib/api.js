const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ==================== FAQ API ====================

// Server-side FAQ read. The public FAQ page used to fetch this in the browser, which left the
// served HTML with category buttons and a spinner: 1,147 words of question and answer text that no
// crawler ever saw. A missing or failed response returns an empty list, and the page still renders.
export async function getFaqs(languageCode) {
  if (!BASE_URL) return [];

  try {
    const query = languageCode && languageCode !== 'en' ? `?language=${encodeURIComponent(languageCode)}` : '';
    // Editors change FAQ text through Admin, not by the minute; a five-minute window keeps the page
    // off the API on every request without making an edit wait long to appear.
    const res = await fetch(`${BASE_URL}/api/faqs${query}`, { next: { revalidate: 300 } });
    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
}

// ==================== BLOG API ====================

// First page of the blog list, read on the server. The list used to arrive through a browser fetch,
// which left the served HTML with a spinner: no titles, no descriptions and, more to the point, no
// links a crawler could follow to the posts themselves. Load More still runs in the browser.
export async function getBlogs({ offset = 0, limit = 6, languageCode } = {}) {
  if (!BASE_URL) return { blogs: [], hasMore: false };

  try {
    const language = languageCode && languageCode !== 'en' ? `&language=${encodeURIComponent(languageCode)}` : '';
    const res = await fetch(`${BASE_URL}/api/blogs?offset=${offset}&limit=${limit}${language}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return { blogs: [], hasMore: false };

    const data = await res.json();
    return { blogs: data?.blogs || [], hasMore: Boolean(data?.pagination?.hasMore) };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return { blogs: [], hasMore: false };
  }
}

// ==================== CATEGORIES API ====================

// ✅ Cache categories for 1 hour
export async function getCategories() {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/categories`, {
      next: { revalidate: 30 },
      cache: 'force-cache',
    });

    if (!res.ok) throw new Error('Failed to fetch categories');

    const data = await res.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

// Localized category titles keyed by master category id. Explore URLs carry master slugs in every
// language, so the English list stays the source of truth for matching and this only supplies the
// display name — the same id-based pairing the public navbar uses.
export async function getLocalizedCategoryTitles(languageCode) {
  if (!BASE_URL || !languageCode || languageCode === 'en') return new Map();

  try {
    const res = await fetch(`${BASE_URL}/api/admin/categories?language=${encodeURIComponent(languageCode)}`, {
      next: { revalidate: 30 },
    });

    if (!res.ok) return new Map();

    const data = await res.json();
    const categories = Array.isArray(data) ? data : data.data || [];
    return new Map(categories.filter(({ _id, title }) => _id && title).map(({ _id, title }) => [String(_id), title]));
  } catch (error) {
    console.error(`Error fetching ${languageCode} category titles:`, error);
    return new Map();
  }
}

// ==================== FOOTER API ====================

// ✅ Cache footer data for 1 hour
export async function getFooterData() {
  try {
    const res = await fetch(`${BASE_URL}/api/footer`, {
      next: { revalidate: 30 },
      cache: 'force-cache',
    });

    if (!res.ok) throw new Error('Failed to fetch footer data');
    return res.json();
  } catch (error) {
    console.error('Error fetching footer:', error);
    return null;
  }
}

// ==================== SEO API ====================

// ✅ ISR — 5 minutes por por refresh। pageName diye specific page er SEO data fetch kore.
// generateMetadata() er moddhe use korar jonno banano.
export async function getSeoByPage(pageName, languageCode = 'en') {
  if (!BASE_URL) return null;

  try {
    // Stored SEO text changes when an admin edits it, not every few seconds. A 10-second window
    // meant every page re-read its record constantly; with all server rendering coming from one IP,
    // that alone could exhaust the API's rate limit and leave pages on catalog fallback text.
    const res = await fetch(`${BASE_URL}/api/seo/${encodeURIComponent(pageName)}?languageCode=${encodeURIComponent(languageCode)}`, {
      next: { revalidate: 300 },
    });

    // 404 mane shei page er jonno kono custom SEO set kora nai - eta error na
    if (res.status === 404) return null;

    // A rate-limited read is not a missing record: the page falls back to catalog text, which is a
    // real SEO regression, so it is reported as itself rather than as a generic failure.
    if (res.status === 429) throw new Error(`Rate limited by the API (retry after ${res.headers.get('Retry-After') || '?'}s)`);

    if (!res.ok) throw new Error(`Failed to fetch SEO data (HTTP ${res.status})`);

    return res.json();
  } catch (error) {
    console.error(`Error fetching SEO data for page "${pageName}":`, error.message);
    return null;
  }
}

// Get all SEO settings (admin table er jonno)
export async function getAllSeo(languageCode = 'en') {
  if (!BASE_URL) return [];

  try {
    const res = await fetch(`${BASE_URL}/api/seo/all?languageCode=${encodeURIComponent(languageCode)}`, {
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch all SEO settings');

    const data = await res.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error('Error fetching all SEO settings:', error);
    return [];
  }
}

// ==================== VERIFICATION API ====================

// ✅ ISR — 30 seconds পর পর refresh
export async function getVerifications() {
  if (!BASE_URL) return [];

  try {
    const res = await fetch(`${BASE_URL}/api/verifications`, {
      next: { revalidate: 30 }, // ← ISR: 30 seconds
    });

    if (!res.ok) throw new Error('Failed to fetch verifications');

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching verifications:', error);
    return [];
  }
}

// Create verification
export async function createVerification(data) {
  if (!BASE_URL) throw new Error('API base URL is not configured');

  try {
    const res = await fetch(`${BASE_URL}/api/verifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      // Backend error message ke actual reason hisheve use kora
      throw new Error(result.error || 'Failed to create verification');
    }

    return result;
  } catch (error) {
    console.error('Error creating verification:', error);
    throw error;
  }
}

// Update verification
export async function updateVerification(id, data) {
  if (!BASE_URL) throw new Error('API base URL is not configured');

  try {
    const res = await fetch(`${BASE_URL}/api/verifications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || 'Failed to update verification');
    }

    return result;
  } catch (error) {
    console.error('Error updating verification:', error);
    throw error;
  }
}

// Delete verification
export async function deleteVerification(id) {
  if (!BASE_URL) throw new Error('API base URL is not configured');

  try {
    const res = await fetch(`${BASE_URL}/api/verifications/${id}`, {
      method: 'DELETE',
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || 'Failed to delete verification');
    }

    return result;
  } catch (error) {
    console.error('Error deleting verification:', error);
    throw error;
  }
}
