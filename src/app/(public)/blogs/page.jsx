import BlogCard from '@/components/blog/BlogCard';
import React from 'react';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';
import { getBlogs } from '@/lib/api';
import { translate } from '@/lib/i18n';

export async function generateMetadata({ locale = 'en' } = {}) {
  return buildPageMetadata({ pageId: 'blogs', locale });
}

// The first page of posts is read here rather than in the browser. The list used to arrive through
// a client fetch, so the served HTML carried a spinner and no link to a single post.
const page = async ({ locale = 'en' }) => {
  const { blogs, hasMore } = await getBlogs({ languageCode: locale });

  return (
    <div className="container mx-auto px-4">
      {/* হেডলাইন সেকশন */}
      <div className="my-10 text-center">
        {/* নিশ্চিত করুন এখানে একটিই h1 আছে */}
        <h1 className="text-4xl md:text-6xl font-serif font-black text-zinc-900 dark:text-white mb-4 tracking-tight uppercase italic">
          {translate(locale, 'blog.heading')}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
          {translate(locale, 'blog.intro')}
        </p>
      </div>
      {/* An empty list means the read failed or there is nothing to show; either way the component
          falls back to its own fetch rather than rendering an empty grid. */}
      <BlogCard initialBlogs={blogs.length ? blogs : null} initialHasMore={hasMore} />
    </div>
  );
};

export default page;
