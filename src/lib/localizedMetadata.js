import { SITE_URL } from '@/lib/seo/siteConfig';
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

export const absoluteSiteUrl = (path = '/') => `${SITE_URL}${path === '/' ? '' : path}`;
export const localizedPath = (path, locale = 'en') => {
  const normalized = path === '/' ? '' : `/${String(path).replace(/^\/+|\/+$/g, '')}`;
  return locale === 'en' ? normalized || '/' : `/${locale}${normalized}`;
};

export const buildLocalizedMetadata = ({
  locale = 'en',
  path,
  title,
  description,
  image,
  imageAlt,
  languages = ['en'],
  languageUrls,
  canonicalUrl,
  type = 'website',
}) => {
  const resolvedLanguageUrls = languageUrls || Object.fromEntries(languages.map((code) => [code, absoluteSiteUrl(localizedPath(path, code))]));
  const englishUrl = absoluteSiteUrl(localizedPath(path, 'en'));
  const canonical = canonicalUrl || absoluteSiteUrl(localizedPath(path, locale));
  return {
    title,
    description,
    alternates: { canonical, languages: { ...resolvedLanguageUrls, 'x-default': resolvedLanguageUrls.en || englishUrl } },
    openGraph: {
      title, description, url: canonical, siteName: 'World Culture Marketplace', locale: locale === 'fr' ? 'fr_FR' : 'en_US', type,
      images: image ? [{ url: image, alt: imageAlt || title }] : [],
    },
    twitter: { card: 'summary_large_image', title, description, images: image ? [{ url: image, alt: imageAlt || title }] : [] },
  };
};

export const getPublishedLanguageCodes = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/translations/languages`, { next: { revalidate: 300 } });
    if (!response.ok) return ['en'];
    const payload = await response.json();
    const codes = (payload.data || []).map(({ code }) => code);
    return codes.includes('en') ? codes : ['en'];
  } catch { return ['en']; }
};

export const getDynamicSeoContext = async ({ objectType, slug, locale = 'en' }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/translations/url/${locale}/${objectType}/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    return (await response.json()).data || null;
  } catch { return null; }
};
