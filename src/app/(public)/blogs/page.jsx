import BlogCard from '@/components/blog/BlogCard';
import React from 'react';
import { getSeoByPage } from '@/lib/api';

export async function generateMetadata() {
  const seoData = await getSeoByPage('blog');
  // console.log(seoData)

  return {
    title: seoData?.title || 'Blog Stories | World Culture Marketplace',
    description:
      seoData?.description ||
      'Explore traditions, craftsmanship, and cultural creativity from around the world.',
    keywords: seoData?.keywords?.length ? seoData.keywords : ['Culture', 'Blog', 'Stories'],
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