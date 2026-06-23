import BlogCard from '@/components/blog/BlogCard';
import React from 'react';
import { getSeoByPage } from '@/lib/api';

export async function generateMetadata() {
  const seoData = await getSeoByPage('blog');

  const title = seoData?.title || 'Blog Stories | World Culture Marketplace';
  const description = seoData?.description || 'Explore traditions, craftsmanship, and cultural creativity from around the world.';
  const image = seoData?.ogImage || `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.jpg`;

  return {
    title,
    description,
    keywords: seoData?.keywords?.length ? seoData.keywords : ['Culture', 'Blog', 'Stories'],
    openGraph: {
      title,
      description,
      images: [image],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

const page = () => {
  return (
    <div className="container mx-auto px-4">
      {/* হেডলাইন সেকশন */}
      <div className="my-10 text-center">
        {/* নিশ্চিত করুন এখানে একটিই h1 আছে */}
        <h1 className="text-4xl md:text-6xl font-serif font-black text-zinc-900 dark:text-white mb-4 tracking-tight uppercase italic">
          Cultural <span className="text-orange-500">Stories</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
          Explore traditions, craftsmanship, and cultural creativity from{' '}
          <br className="hidden md:block" /> around the world through an editorial lens.
        </p>
      </div>
      <BlogCard />
    </div>
  );
};

export default page;