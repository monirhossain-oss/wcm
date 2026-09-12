// Stage 4: shared metadata resolver for the 15 indexable base pages.
// Reads only the current language's SEO record; a missing French record falls back to the
// French catalog, never to the English record. Titles are emitted as absolute strings with
// exactly one brand suffix so the root title template cannot duplicate it.
import { PUBLIC_SEO_PAGES } from './publicPageRegistry';
import { NOINDEX } from './indexing';
import { SITE_URL, DEFAULT_SOCIAL_IMAGE } from './siteConfig';
import { getSeoByPage } from '@/lib/api';
import { translate } from '@/lib/i18n';
import { absoluteSiteUrl, buildLocalizedMetadata, localizedPath } from '@/lib/localizedMetadata';
import { getPublishedLanguageCodes } from './publishedLanguages';
import { withBrand } from './brandTitle';

// The brand rule lives in its own dependency-free module so the Admin form can measure a title
// exactly as this file renders it. Re-exported here because existing callers import it from here.
export { BRAND_NAME, withBrand } from './brandTitle';

const resolveImageUrl = (value) => {
  if (!value) return DEFAULT_SOCIAL_IMAGE;
  return value.startsWith('/') ? `${SITE_URL}${value}` : value;
};

const getPage = (pageId) => {
  const page = PUBLIC_SEO_PAGES.find(({ id }) => id === pageId);
  if (!page?.seoKey) throw new Error(`Unknown managed SEO page: ${pageId}`);
  return page;
};

// Text/image resolution for one page and language. `fallback` sits between the stored record
// and the catalog (e.g. About header text for English); it must already be in the requested language.
export const resolvePageSeo = async ({ pageId, locale = 'en', fallback = {} }) => {
  const page = getPage(pageId);
  const record = await getSeoByPage(page.seoKey, locale);
  const catalog = (field) => translate(locale, `seo.${pageId}.${field}`);
  return {
    page,
    record,
    title: record?.title || fallback.title || catalog('title'),
    description: record?.description || fallback.description || catalog('description'),
    keywords: record?.keywords?.length ? record.keywords : fallback.keywords || catalog('keywords'),
    image: resolveImageUrl(record?.ogImage),
    imageAlt: record?.imageAlt || translate(locale, 'seo.defaultImageAlt'),
  };
};

// `path` overrides the registry path for both languages (Explore filters); explicit title/description/keywords
// override the resolved text (Explore filter composition). `resolved` reuses an earlier resolvePageSeo result.
// `indexable: false` marks the URL noindex and drops the language alternates: advertising alternates for a
// URL we are asking search engines to drop would be a contradictory signal.
export const buildPageMetadata = async ({ pageId, locale = 'en', path, fallback, resolved, title, description, keywords, indexable = true }) => {
  const seo = resolved || await resolvePageSeo({ pageId, locale, fallback });
  const absoluteTitle = withBrand(title || seo.title);
  const finalDescription = description || seo.description;
  // A page must always advertise itself. The published list can degrade to English alone when the
  // language lookup fails, and a French URL that lists only an English alternate is a hreflang
  // conflict — search engines read it as a cluster whose members disagree. We are rendering this
  // URL in this language, so its own alternate is known without asking anyone.
  const languages = indexable ? [...new Set([locale, ...await getPublishedLanguageCodes()])] : [];
  const pathFor = (code) => (path ? localizedPath(path, code) : seo.page.paths[code]);
  const languageUrls = Object.fromEntries(languages.filter((code) => pathFor(code)).map((code) => [code, absoluteSiteUrl(pathFor(code))]));
  const canonical = absoluteSiteUrl(pathFor(locale));
  const metadata = {
    ...buildLocalizedMetadata({
      locale,
      path: path || seo.page.paths.en,
      title: absoluteTitle,
      description: finalDescription,
      image: seo.image,
      imageAlt: seo.imageAlt,
      languageUrls,
      canonicalUrl: canonical,
    }),
    title: { absolute: absoluteTitle },
    keywords: keywords || seo.keywords,
  };
  if (indexable) return metadata;
  return { ...metadata, alternates: { canonical }, robots: NOINDEX };
};
