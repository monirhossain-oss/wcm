// Stage 6: JSON-LD for the shared site identity and for one public base page.
// One Organization node describes the site owner and is emitted once, from the root layout, so no
// page can produce a second, conflicting identity. WebSite and WebPage are language-scoped: a
// French page advertises its own French URL, never the English one, and every `@id` is derived
// from a stable URL so repeat crawls see the same node.
import { findPublicRoute } from './publicPageRegistry';
import { SITE_URL } from './siteConfig';
import { resolvePageSeo, BRAND_NAME } from './pageMetadata';
import { translate } from '@/lib/i18n';

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const ORGANIZATION_LOGO = `${SITE_URL}/wc,-web-logo.png`;

const localeHome = (locale) => `${SITE_URL}${locale === 'en' ? '' : `/${locale}`}`;
export const websiteId = (locale) => `${localeHome(locale)}/#website`;
export const webPageId = (url) => `${url}#webpage`;

// Identity only: name, canonical origin and logo, exactly as the site has always published them.
export const buildOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: BRAND_NAME,
  url: SITE_URL,
  logo: ORGANIZATION_LOGO,
});

// One node per published language. The site description is the home page description in that
// language, so the node never states something the visitor cannot read on the site.
export const buildWebSiteSchema = (locale = 'en') => {
  const url = localeHome(locale);
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId(locale),
    name: BRAND_NAME,
    url,
    description: translate(locale, 'seo.home.description'),
    inLanguage: locale,
    publisher: { '@id': ORGANIZATION_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${url}/explore/search/{search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
};

export const buildWebPageSchema = ({ locale = 'en', url, name, description }) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': webPageId(url),
  url,
  name,
  description,
  inLanguage: locale,
  isPartOf: { '@id': websiteId(locale) },
  publisher: { '@id': ORGANIZATION_ID },
});

// Resolves the WebPage node for a request path, or null when the path is not a base page we ask
// search engines to index. Detail routes (listings/blogs/creator profiles) keep their own JSON-LD,
// noindex routes and filtered/search Explore URLs get none, and aliases are redirected before they
// render — so structured data can never contradict the canonical, hreflang or indexing decisions.
export const resolvePageStructuredData = async (path) => {
  if (!path) return null;
  const match = findPublicRoute(path);
  if (!match || match.isAlias) return null;
  const { page, locale } = match;
  if (!page.seoKey || page.indexing === 'noindex') return null;
  // Same resolver the page's own metadata uses, so name/description are the current language's
  // stored SEO record when one exists and that language's catalog text otherwise.
  const seo = await resolvePageSeo({ pageId: page.id, locale });
  return buildWebPageSchema({
    locale,
    url: `${SITE_URL}${page.paths[locale] === '/' ? '' : page.paths[locale]}`,
    name: seo.title,
    description: seo.description,
  });
};
