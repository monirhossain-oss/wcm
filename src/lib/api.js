const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ==================== CATEGORIES API ====================

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

// ==================== FOOTER API ====================

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

// ==================== VERIFICATION API ====================

// Get all verifications (no cache — always fresh)
export async function getVerifications() {
  try {
    const res = await fetch(`${BASE_URL}/api/verifications`, {
      cache: 'no-store',
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
  try {
    const res = await fetch(`${BASE_URL}/api/verifications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Failed to create verification');
    return res.json();
  } catch (error) {
    console.error('Error creating verification:', error);
    throw error;
  }
}

// Update verification
export async function updateVerification(id, data) {
  try {
    const res = await fetch(`${BASE_URL}/api/verifications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Failed to update verification');
    return res.json();
  } catch (error) {
    console.error('Error updating verification:', error);
    throw error;
  }
}

// Delete verification
export async function deleteVerification(id) {
  try {
    const res = await fetch(`${BASE_URL}/api/verifications/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error('Failed to delete verification');
    return res.json();
  } catch (error) {
    console.error('Error deleting verification:', error);
    throw error;
  }
}