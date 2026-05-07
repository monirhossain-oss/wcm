const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ✅ Cache categories for 1 hour
export async function getCategories() {
  try {
    const res = await fetch(`${BASE_URL}/api/admin/categories`, {
      next: { revalidate: 3600 }, // ISR — 1 hour cache
      cache: 'force-cache',
    });
    
    if (!res.ok) throw new Error('Failed to fetch categories');
    
    const data = await res.json();
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return []; // Return empty array on error
  }
}

// ✅ Cache footer data for 1 hour
export async function getFooterData() {
  try {
    const res = await fetch(`${BASE_URL}/api/footer`, {
      next: { revalidate: 3600 },
      cache: 'force-cache',
    });
    
    if (!res.ok) throw new Error('Failed to fetch footer data');
    return res.json();
  } catch (error) {
    console.error('Error fetching footer:', error);
    return null;
  }
}