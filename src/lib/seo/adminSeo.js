import { PUBLIC_SEO_PAGES } from './publicPageRegistry';

const labels = {
  home: 'Home', about: 'About Us', contact: 'Contact', 'how-it-works': 'How It Works',
  blog: 'Blogs', creators: 'Creators', explore: 'Explore', faq: 'FAQ', 'become-creator': 'Become a Creator',
  'advertising-policy': 'Advertising Policy', 'boost-terms-and-ppc': 'Boost Terms and PPC',
  'creator-terms-and-conditions': 'Creator Terms and Conditions', privacy: 'Privacy Policy',
  terms: 'Terms and Conditions', cookie: 'Cookie Policy',
};
export const SEO_PAGE_OPTIONS = PUBLIC_SEO_PAGES.filter(({ seoKey }) => seoKey).map((page) => ({
  value: page.seoKey, label: labels[page.seoKey], paths: page.paths,
}));
// The route a stored SEO record applies to, as a site-relative path. Admin previews deliberately
// show no origin: the deployed host is not knowable here, and printing the development fallback
// would tell an editor their pages live on localhost.
export const seoPagePath = (pageName, languageCode) =>
  SEO_PAGE_OPTIONS.find(({ value }) => value === pageName)?.paths[languageCode] || '';
export const seoDraft = (pageName = 'home', record) => ({
  pageName, title: record?.title || '', description: record?.description || '',
  keywords: record?.keywords?.join(', ') || '', ogImage: record?.ogImage || '', imageAlt: record?.imageAlt || '',
});
export const seoPayload = (form, languageCode) => {
  if (!['en', 'fr'].includes(languageCode) || !SEO_PAGE_OPTIONS.some(({ value }) => value === form.pageName)) throw new Error('Select a valid page and language.');
  const title = form.title.trim();
  const description = form.description.trim();
  if (!title || !description) throw new Error('Title and description are required.');
  const ogImage = form.ogImage.trim();
  if (ogImage) {
    const relative = ogImage.startsWith('/') && !ogImage.startsWith('//') && !ogImage.includes('\\');
    let absolute = false;
    try { absolute = ['http:', 'https:'].includes(new URL(ogImage).protocol); } catch { /* relative paths are checked separately */ }
    if (!relative && !absolute) throw new Error('Social image must be an HTTP(S) URL or a site-relative path.');
  }
  return { pageName: form.pageName, languageCode, title, description,
    keywords: form.keywords.split(',').map((word) => word.trim()).filter(Boolean),
    ogImage, imageAlt: form.imageAlt.trim() };
};
