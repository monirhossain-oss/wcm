'use client';

import Image from 'next/image';
import React from 'react'; // useState আর দরকার নেই
import { FiArrowUpRight } from 'react-icons/fi'; // FiSearch রিমুভ করা হয়েছে

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

  // সার্চ স্টেট (searchQuery) এখান থেকে ডিলিট করে দিয়েছি

  return (
    <div className="min-h-screen transition-colors duration-300">
      
      {/* --- ১. Editorial Banner Section --- */}
      <div className="relative w-full h-[60vh] md:h-[70vh] flex items-center overflow-hidden ">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://i.postimg.cc/vmx3X4w0/mexican-culture-with-colorful-birds-23-2149672965.avif" 
            alt="Banner" 
            fill 
            className="object-cover hover:grayscale-0 transition-all duration-1000"
            priority 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="max-w-3xl">
            <span className="text-[#F57C00] font-black tracking-[0.4em] uppercase text-[10px] mb-6 block animate-pulse">
              Featured Story
            </span>
            <h1 className="text-3xl md:text-6xl font-bold text-white leading-[0.85] tracking-tighter mb-8 italic">
              Voices of <br /> <span className="text-[#F57C00] not-italic">Heritage.</span>
            </h1>
            <p className="text-zinc-300 text-lg md:text-xl max-w-xl font-medium leading-relaxed mb-8">
              Deep dives into the craftsmanship, rituals, and stories that shape our global cultural identity.
            </p>
            
            {/* সার্চ বার এখান থেকে রিমুভ করা হয়েছে */}
          </div>
        </div>
      </div>

      {/* --- ২. Blog List Section --- */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-[#F57C00] mb-2">Archive</h2>
            <p className="text-2xl font-bold dark:text-white tracking-tighter">All Journal Entries</p>
          </div>
          <div className="text-zinc-400 text-xs font-medium uppercase tracking-widest hidden md:block">
            {blogs.length} Stories Total
          </div>
        </div>

        <div className="flex flex-col">
          {/* filter() ফাংশন বাদ দিয়ে সরাসরি map() করা হয়েছে */}
          {blogs.map((blog) => (
            <div 
              key={blog.id} 
              className="group relative border-t border-gray-200 dark:border-zinc-800 py-12 flex flex-col md:flex-row items-start md:items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-all duration-500 px-4"
            >
              <div className="flex items-start gap-8 md:gap-16 flex-1">
                <span className="text-gray-300 dark:text-zinc-800 font-bold text-xl md:text-2xl mt-1 group-hover:text-[#F57C00] transition-colors">
                  {blog.number}
                </span>

                <div className="max-w-2xl">
                  <span className="text-[#F57C00] text-[9px] font-black uppercase tracking-[0.2em] mb-3 block">
                    {blog.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white group-hover:translate-x-2 transition-transform duration-500 leading-tight tracking-tighter">
                    {blog.title}
                  </h2>
                  <p className="text-gray-500 dark:text-zinc-500 mt-4 md:opacity-0 group-hover:opacity-100 transition-all duration-500 max-w-lg text-sm leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8 mt-6 md:mt-0 ml-16 md:ml-0">
                <span className="text-[10px] font-bold text-gray-400 dark:text-zinc-600 uppercase tracking-[0.2em]">
                  {blog.date}
                </span>
                <div className="w-14 h-14 rounded-full border border-gray-200 dark:border-zinc-800 flex items-center justify-center group-hover:bg-[#F57C00] group-hover:border-[#F57C00] transition-all duration-500 group-hover:rotate-45">
                  <FiArrowUpRight className="text-2xl group-hover:text-white transition-colors" />
                </div>
              </div>
            </div>
          ))}
          <div className="border-t border-gray-200 dark:border-zinc-800"></div>
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;