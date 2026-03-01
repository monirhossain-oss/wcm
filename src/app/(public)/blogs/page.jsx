'use client';

import React, { useState } from 'react';
import { FiArrowUpRight } from 'react-icons/fi';

const BlogsPage = () => {
  const blogs = [
    {
      id: 1,
      title: 'The Art of Japanese Kintsugi: Beauty in Imperfection',
      excerpt: 'Discover how the ancient practice of repairing broken pottery with gold reflects a profound philosophy about embracing flaws.',
      category: 'Traditions',
      date: 'Feb 30, 2026',
      number: '01'
    },
    {
      id: 2,
      title: 'Weaving Stories: Kente Cloth and Ashanti Heritage',
      excerpt: 'Each pattern in Kente cloth carries deep meaning — from proverbs to historical events. Explore the symbolic language.',
      category: 'Textiles',
      date: 'Feb 27, 2026',
      number: '02'
    },
    {
      id: 3,
      title: 'From Earth to Art: Oaxacan Black Clay Pottery',
      excerpt: 'The Zapotec tradition of Barro Negro pottery dates back over 2,000 years. Learn about the artisans keeping it alive.',
      category: 'Ceramics',
      date: 'Jan 30, 2026',
      number: '03'
    },
    {
      id: 4,
      title: "Natural Dyes: India's Block Printing Renaissance",
      excerpt: 'As sustainability gains momentum, Rajasthani block printing with natural dyes is experiencing a global revival.',
      category: 'Textiles',
      date: 'Jan 20, 2026',
      number: '04'
    }
  ];

  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 mt-16 bg-white dark:bg-[#0a0a0a]">
      {/* Header - Minimal & Bold */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-8">
        <div className="max-w-2xl">
          <span className="text-[#F57C00] font-black tracking-[0.3em] uppercase text-xs mb-4 block">Our Journal</span>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-[0.9] tracking-tighter">
            Cultural Insights.
          </h1>
        </div>
        
      </div>

      {/* Blog List - List Style with Hover Reveal Effect */}
      <div className="flex flex-col">
        {blogs
          .filter(b => b.title.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((blog) => (
            <div 
              key={blog.id} 
              className="group relative border-t border-gray-200 dark:border-gray-800 py-12 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-gray-50 dark:hover:bg-[#111] transition-all duration-500 px-4"
            >
              <div className="flex items-start gap-8 md:gap-16 flex-1">
                {/* Numbering */}
                <span className="text-gray-300 dark:text-gray-700 font-bold text-xl md:text-xl mt-1">
                  {blog.number}
                </span>

                <div className="max-w-2xl">
                  {/* Category */}
                  <span className="text-[#F57C00] text-[8px] font-bold uppercase tracking-widest mb-3 block">
                    {blog.category}
                  </span>
                  {/* Title */}
                  <h2 className="text-2xl md:text-xl font-bold text-gray-900 dark:text-white group-hover:pl-4 transition-all duration-500 leading-tight">
                    {blog.title}
                  </h2>
                  {/* Excerpt - Hidden on mobile, visible on hover/desktop */}
                  <p className="text-gray-500 mt-4  md:opacity-0 group-hover:opacity-100 transition-opacity duration-500 max-w-lg">
                    {blog.excerpt}
                  </p>
                </div>
              </div>

              {/* Date & Icon */}
              <div className="flex items-center gap-6 mt-6 md:mt-0 ml-16 md:ml-0">
                <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">
                  {blog.date}
                </span>
                <div className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center group-hover:bg-[#F57C00] group-hover:border-[#F57C00] transition-all duration-500">
                  <FiArrowUpRight className="text-xl group-hover:text-white transition-colors" />
                </div>
              </div>
            </div>
          ))}
        <div className="border-t border-gray-200 dark:border-gray-800"></div>
      </div>
    </div>
  );
};

export default BlogsPage;