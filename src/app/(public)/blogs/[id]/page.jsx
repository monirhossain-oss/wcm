import { notFound } from 'next/navigation';
import BlogDetailsClient from './BlogDetailsClient';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function fetchBlog(id) {
  try {
    const res = await fetch(`${BASE_URL}/api/blogs/${id}`, {
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

export async function generateMetadata({ params }) {
  const { id } = await params;
  const blog = await fetchBlog(id);

  if (!blog) {
    return { title: 'Story Not Found | World Culture Marketplace' };
  }

  const firstParagraph = blog.content?.find((c) => c.type === 'paragraph')?.text || '';
  const description = blog.excerpt || firstParagraph.slice(0, 160) || 'Read this cultural story on World Culture Marketplace.';

  return {
    title: `${blog.title} | World Culture Marketplace`,
    description,
    keywords: blog.tags?.length ? blog.tags : [blog.category, 'Culture', 'WCM'].filter(Boolean),
    openGraph: {
      title: blog.title,
      description,
      images: blog.image ? [{ url: blog.image }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description,
      images: blog.image ? [blog.image] : [`${process.env.NEXT_PUBLIC_SITE_URL}/og-image.jpg`],
    },
  };
}

export default async function BlogDetailsPage({ params }) {
  const { id } = await params;
  const blog = await fetchBlog(id);

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
    image: blog.image || undefined,
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
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/blogs/${blog.slug}`,
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