import axios from 'axios';
import ListingDetailsClient from '../ListingDetailsClient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

const MIN_DESCRIPTION_LENGTH = 40; 
const MAX_META_LENGTH = 155; 
function generateMetaDescription(product) {
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
  if (product?.country) detailBits.push(`from ${product.country}`);
  if (detailBits.length) parts.push(detailBits.join(' '));

  if (Array.isArray(product?.culturalTags) && product.culturalTags.length) {
    parts.push(`Explore ${product.culturalTags.join(', ')} on World Culture Marketplace.`);
  } else {
    parts.push('Discover authentic cultural craftsmanship on World Culture Marketplace.');
  }

  const generated = parts.join(' — ');
  return generated.length <= MAX_META_LENGTH
    ? generated
    : generated.slice(0, MAX_META_LENGTH).slice(0, generated.lastIndexOf(' ')) + '…';
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const res = await axios.get(`${API_BASE_URL}/api/listings/${id}`);
    const product = res.data;

    const image = product.image?.startsWith('http')
      ? product.image
      : `${API_BASE_URL}/${product.image}`;

    const canonicalUrl = `${siteUrl}/listing/${id}`;
    const frUrl = `${siteUrl}/fr/listing/${id}`;

    const metaDescription = generateMetaDescription(product);

    return {
      title: `${product.title} | World Culture Marketplace`,
      description: metaDescription,
      alternates: {
        canonical: canonicalUrl,
        languages: {
          'en': canonicalUrl,
          'fr': frUrl,
          'x-default': canonicalUrl,
        },
      },
      openGraph: {
        images: [image],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.title} | World Culture Marketplace`,
        description: metaDescription,
        images: [image],
      },
    };
  } catch (error) {
    return { title: 'Listing Details' };
  }
}

export default async function Page({ params }) {
  const { id } = await params;
  let initialProduct = null;
  let initialRelated = [];

  try {
    const res = await axios.get(`${API_BASE_URL}/api/listings/${id}`);
    initialProduct = res.data;

    if (initialProduct?.creatorId?._id) {
      const relatedRes = await axios.get(
        `${API_BASE_URL}/api/listings/public?creatorId=${initialProduct.creatorId._id}&limit=5`
      );
      initialRelated = (relatedRes.data.listings || [])
        .filter((item) => item._id !== id)
        .slice(0, 4);
    }
  } catch (error) {
    console.error("Server Fetch Error:", error);
  }

  if (!initialProduct) return <div className="p-20 text-center">Asset not found.</div>;

  // ✅ CreativeWork Schema
  const creativeWorkSchema = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: initialProduct.title,
    description: generateMetaDescription(initialProduct),
    image: initialProduct.image,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/listing/${initialProduct.slug}`,
    creator: {
      '@type': 'Person',
      name: `${initialProduct.creatorId?.firstName} ${initialProduct.creatorId?.lastName}`,
      url: initialProduct.creatorId?.username
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/creator/${initialProduct.creatorId.username}`
        : undefined,
    },
    countryOfOrigin: initialProduct.country || undefined,
    genre: initialProduct.tradition || undefined,
    keywords: initialProduct.culturalTags?.join(', ') || undefined,
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
      <h1 className="sr-only">
        {initialProduct.title} — {initialProduct.tradition} from {initialProduct.country} | World Culture Marketplace
      </h1>

      <ListingDetailsClient
        initialProduct={initialProduct}
        initialRelated={initialRelated}
      />
    </>
  );
}