import BlogCard from '@/components/blog/BlogCard';
import React from 'react';

// এসইও মেটাডাটা জেনারেটর
export async function generateMetadata() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/seo/blog`, {
      next: { revalidate: 3600 }, // ১ ঘণ্টা ক্যাশে থাকবে
    });
    const data = await res.json();
    console.log(data)

    return {
      title: data?.title || 'blog Stories | World Culture Marketplace',
      description: data?.description || 'Explore traditions, craftsmanship, and cultural creativity from around the world.',
      keywords: data?.keywords || ['Culture', 'Blog', 'Stories'],
    };
  } catch (error) {
    return {
      title: 'Blog | World Culture Marketplace',
      description: 'Explore cultural stories from around the world.',
    };
  }
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