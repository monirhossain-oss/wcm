// The one place the brand suffix rule lives. `pageMetadata.js` renders public titles with it and
// re-exports it; the Admin SEO form imports it directly so its character counter measures the
// title a visitor will actually see. Keeping it in a dependency-free module is what makes that
// possible — pulling `pageMetadata.js` into a client page would drag the SEO API and the published
// language lookup into the browser bundle.
export const BRAND_NAME = 'World Culture Marketplace';

const brandPattern = /world\s+culture\s+marketplace/i;

// A title that already names the brand keeps its own wording; everything else gets one suffix.
export const withBrand = (title) => {
  const trimmed = String(title || '').trim();
  if (!trimmed) return BRAND_NAME;
  return brandPattern.test(trimmed) ? trimmed : `${trimmed} | ${BRAND_NAME}`;
};

// What the suffix costs when it is added: " | World Culture Marketplace".
export const BRAND_SUFFIX = ` | ${BRAND_NAME}`;
