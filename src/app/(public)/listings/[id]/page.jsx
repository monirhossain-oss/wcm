import axios from 'axios';
import ListingDetailsClient from '../ListingDetailsClient';
import { absoluteSiteUrl, buildLocalizedMetadata, getDynamicSeoContext, localizedPath } from '@/lib/localizedMetadata';
import { format, translate } from '@/lib/i18n';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const MIN_DESCRIPTION_LENGTH = 40;
const MAX_META_LENGTH = 155;

const tr = (locale, key, values) => (values ? format(translate(locale, key), values) : translate(locale, key));

// The listing text itself arrives in the reader's language; only the sentences built around it when
// the description is too short are phrased here, from the catalog. The country stays as stored.
function generateMetaDescription(product, locale = 'en') {
  const rawDescription = (product?.description || '').trim();

  // URL/junk check —
  const isJunkOrUrl = /^https?:\/\//i.test(rawDescription) || rawDescription.length < MIN_DESCRIPTION_LENGTH;

  if (rawDescription && !isJunkOrUrl) {
    if (rawDescription.length <= MAX_META_LENGTH) return rawDescription;
    const truncated = rawDescription.slice(0, MAX_META_LENGTH);
    return truncated.slice(0, truncated.lastIndexOf(' ')) + '…';
  }

  const parts = [];

  if (product?.title) parts.push(product.title);

  const detailBits = [];
  if (product?.tradition) detailBits.push(product.tradition);
  if (product?.country) detailBits.push(tr(locale, 'listingDetail.metaFrom', { country: product.country }));
  if (detailBits.length) parts.push(detailBits.join(' '));

  if (Array.isArray(product?.culturalTags) && product.culturalTags.length) {
    const tags = product.culturalTags.map((tag) => tag?.title || tag).join(', ');
    parts.push(tr(locale, 'listingDetail.metaExploreTags', { tags }));
  } else {
    parts.push(tr(locale, 'listingDetail.metaDiscover'));
  }

  const generated = parts.join(' — ');
  return generated.length <= MAX_META_LENGTH
    ? generated
    : generated.slice(0, MAX_META_LENGTH).slice(0, generated.lastIndexOf(' ')) + '…';
}

// The visually hidden page heading, phrased for the reader's language.
function buildSeoHeading(product, locale) {
  if (product.tradition && product.country) {
    return tr(locale, 'listingDetail.seoHeading', {
      title: product.title,
      tradition: product.tradition,
      country: product.country,
    });
  }
  return tr(locale, 'listingDetail.seoHeadingShort', { title: product.title });
}

export async function generateMetadata({ params, locale = 'en' }) {
  const { id } = await params;
  try {
    const res = await axios.get(`${API_BASE_URL}/api/listings/${id}`, { params: locale === 'en' ? undefined : { language: locale } });
    const product = res.data;

    const image = product.image?.startsWith('http')
      ? product.image
      : `${API_BASE_URL}/${product.image}`;

    const metaDescription = generateMetaDescription(product, locale);
    const seoContext = await getDynamicSeoContext({ objectType: 'listing', slug: id, locale });
    return buildLocalizedMetadata({ locale, path: `/listings/${product.slug || id}`,
      title: product._localizedSeo?.title || `${product.title} | World Culture Marketplace`,
      description: product._localizedSeo?.description || metaDescription, image,
      imageAlt: product._localizedSeo?.imageAlt || product.title,
      languageUrls: seoContext?.metadata?.languages, canonicalUrl: seoContext?.metadata?.canonical });
  } catch (error) {
    return { title: translate(locale, 'listingDetail.metaFallbackTitle') };
  }
}

export default async function Page({ params, locale = 'en' }) {
  const { id } = await params;
  let initialProduct = null;
  let initialRelated = [];

  try {
    const res = await axios.get(`${API_BASE_URL}/api/listings/${id}`, { params: locale === 'en' ? undefined : { language: locale } });
    initialProduct = res.data;

    if (initialProduct?.creatorId?._id) {
      const relatedRes = await axios.get(
        `${API_BASE_URL}/api/listings/public?creatorId=${initialProduct.creatorId._id}&limit=5${locale === 'en' ? '' : `&language=${locale}`}`
      );
      initialRelated = (relatedRes.data.listings || [])
        .filter((item) => item._id !== initialProduct._id && item._id !== id)
        .slice(0, 4);
    }
  } catch (error) {
    console.error("Server Fetch Error:", error);
  }

  if (!initialProduct) return <div className="p-20 text-center">{translate(locale, 'listingDetail.notFound')}</div>;

  // ✅ CreativeWork Schema
  const creativeWorkSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: initialProduct.title,
    description: generateMetaDescription(initialProduct, locale),
    inLanguage: locale,
    image: initialProduct.image ? {
      '@type': 'ImageObject', contentUrl: initialProduct.image,
      name: initialProduct._localizedSeo?.imageAlt || initialProduct.title,
    } : undefined,
    url: absoluteSiteUrl(localizedPath(`/listings/${initialProduct.slug || id}`, locale)),
    creator: {
      '@type': 'Person',
      name: `${initialProduct.creatorId?.firstName} ${initialProduct.creatorId?.lastName}`,
      url: initialProduct.creatorId?.username
        ? absoluteSiteUrl(localizedPath(`/profile/${initialProduct.creatorId.slug || initialProduct.creatorId.username}`, locale))
        : undefined,
    },
    countryOfOrigin: initialProduct.country || undefined,
    genre: initialProduct.tradition || undefined,
    keywords: initialProduct.culturalTags?.map((tag) => tag?.title || tag).join(', ') || undefined,
    dateCreated: initialProduct.createdAt,
    dateModified: initialProduct.updatedAt,
  };

  return (
    <>
      {/* ✅ JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkSchema) }}
      />

      {/* SEO h1 */}
      <h1 className="sr-only">{buildSeoHeading(initialProduct, locale)}</h1>

      <ListingDetailsClient
        initialProduct={initialProduct}
        initialRelated={initialRelated}
      />
    </>
  );
}
