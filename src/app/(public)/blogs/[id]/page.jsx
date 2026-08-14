import { notFound } from 'next/navigation';
import BlogDetailsClient from './BlogDetailsClient';
import { absoluteSiteUrl, buildLocalizedMetadata, getDynamicSeoContext, localizedPath } from '@/lib/localizedMetadata';
import { translate } from '@/lib/i18n';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function fetchBlog(id, locale = 'en') {
  try {
    const res = await fetch(`${BASE_URL}/api/blogs/${id}${locale === 'en' ? '' : `?language=${locale}`}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.blog || null;
  } catch (error) {
    console.error('Error fetching blog for metadata/page:', error);
    return null;
  }
}

export async function generateMetadata({ params, locale = 'en' }) {
  const { id } = await params;
  const blog = await fetchBlog(id, locale);

  if (!blog) {
    return { title: translate(locale, 'blog.details.notFoundTitle') };
  }

  const firstParagraph = blog.content?.find((c) => c.type === 'paragraph')?.text || '';
  const description = blog.excerpt || firstParagraph.slice(0, 160) || translate(locale, 'blog.details.metaDescription');

  const seoContext = await getDynamicSeoContext({ objectType: 'blog', slug: id, locale });
  const localized = buildLocalizedMetadata({ locale, path: `/blogs/${blog.slug || id}`,
    title: blog._localizedSeo?.title || `${blog.title} | World Culture Marketplace`,
    description: blog._localizedSeo?.description || description, image: blog.image,
    imageAlt: blog._localizedSeo?.imageAlt || blog.title, type: 'article',
    languageUrls: seoContext?.metadata?.languages, canonicalUrl: seoContext?.metadata?.canonical });
  return {
    ...localized,
    keywords: blog.tags?.length ? blog.tags : [blog.category, 'Culture', 'WCM'].filter(Boolean),
  };
}

export default async function BlogDetailsPage({ params, locale = 'en' }) {
  const { id } = await params;
  const blog = await fetchBlog(id, locale);

  if (!blog) notFound();

  const firstParagraph = blog.content?.find((c) => c.type === 'paragraph')?.text || '';
  const description = blog.excerpt || firstParagraph.slice(0, 160) || '';
  // console.log('Blog data:', JSON.stringify(blog, null, 2));

  // ✅ Article Schema
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: blog.description,
    image: blog.image ? {
      '@type': 'ImageObject', contentUrl: blog.image,
      name: blog._localizedSeo?.imageAlt || blog.title,
    } : undefined,
    author: {
      '@type': 'Person',
      name: blog.author?.name,
      image: blog.author?.image || undefined,
      jobTitle: blog.author?.role || undefined,
    },
    publisher: {
      '@type': 'Organization',
      name: 'World Culture Marketplace',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/wc,-web-logo.png`,
      },
    },
    datePublished: blog.createdAt,
    dateModified: blog.updatedAt,
    url: absoluteSiteUrl(localizedPath(`/blogs/${blog.slug || id}`, locale)),
    keywords: blog.tags?.join(', ') || blog.category || undefined,
    articleSection: blog.category || undefined,
  };

  return (
    <>
      {/* ✅ JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BlogDetailsClient initialBlog={blog} />
    </>
  );
}
