const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getPublishedLanguages = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/translations/languages`, { next: { revalidate: 300 } });
    if (!response.ok) return [];
    const payload = await response.json();
    return Array.isArray(payload.data) ? payload.data : [];
  } catch {
    return [];
  }
};

export const getPublishedLocale = async (code) =>
  (await getPublishedLanguages()).find((language) => language.code === code) || null;
