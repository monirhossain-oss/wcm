// Single source of truth for Explore route slugs, shared by the client hook that builds URLs and the
// server indexing policy that validates them, so a generated URL is always judged by the same rules.
export const toRouteSlug = (text) => {
  if (!text) return null;
  const value = String(text).trim();
  if (!value || ['all', 'all regions'].includes(value.toLowerCase())) return null;
  return value.toLowerCase()
    .replace(/&/g, 'and')
    // Accents are folded to their base letter before the ASCII filter below, which would otherwise
    // delete them outright rather than transliterate: "céramique" became "cramique", a word that
    // matches nothing. Splitting each accented character into letter + combining mark and dropping
    // the marks keeps the letter, and the slug stays ASCII.
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^-a-z0-9]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || null;
};

export const slugsMatch = (a, b) => {
  const left = toRouteSlug(a);
  return Boolean(left) && left === toRouteSlug(b);
};
