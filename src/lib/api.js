const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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