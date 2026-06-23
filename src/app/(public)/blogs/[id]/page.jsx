import { notFound } from 'next/navigation';
import BlogDetailsClient from './BlogDetailsClient';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Server-side e blog data fetch kora — generateMetadata o page component duitai eta use kore
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

// এসইও মেটাডাটা জেনারেটর — actual blog er title/content theke banano hocche, generic blog title na
export async function generateMetadata({ params }) {
  const { id } = await params;
  const blog = await fetchBlog(id);

  if (!blog) {
    return {
      title: 'Story Not Found | World Culture Marketplace',
    };
  }

  // content array theke prothom paragraph ke description hisheve use kora (jodi alada description field na thake)
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
  };
}

// মেইন পেজ কম্পোনেন্ট — server e data fetch kore, client component ke pass kore
export default async function BlogDetailsPage({ params }) {
  const { id } = await params;
  const blog = await fetchBlog(id);

  if (!blog) {
    notFound();
  }

  return <BlogDetailsClient initialBlog={blog} />;
}