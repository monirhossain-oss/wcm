"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft, Share2, Bookmark, ChevronRight } from 'lucide-react';
import { blogs } from '@/data/blogData';

const BlogDetails = () => {
  const params = useParams();
  const id = params?.id;

  const blog = blogs.find((b) => String(b.id) === String(id));
  const relatedStories = blogs.filter(b => String(b.id) !== String(id)).slice(0, 3);

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] font-serif">
        <h2 className="text-2xl font-bold italic text-zinc-800">Story not found...</h2>
        <Link href="/blogs" className="text-orange-500 underline mt-6">Back to Stories</Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white dark:bg-[#0a0a0a] pb-20 selection:bg-orange-100">
      
      {/* ১. হেডার সেকশন */}
      <div className="max-w-4xl mx-auto px-6 pt-10">
        <Link href="/blogs" className="inline-flex items-center gap-2 text-zinc-500 hover:text-orange-500 transition-colors mb-8 text-sm font-medium group">
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Stories
        </Link>
        
        <h1 className="text-2xl md:text-4xl font-serif font-black text-zinc-900 dark:text-white leading-[1.1] mb-8 tracking-tight">
          {blog.title}
        </h1>

        <div className="flex items-center justify-between py-6 border-b border-zinc-100 dark:border-zinc-800 mb-10">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-100 shadow-sm">
              <Image src={blog.author.image} alt={blog.author.name} fill className="object-cover" />
            </div>
            <div>
              <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{blog.author.name}</p>
              <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium">{blog.author.role}</p>
            </div>
          </div>
          <div className="flex gap-5 text-zinc-400">
            <Share2 size={20} className="hover:text-orange-500 cursor-pointer transition-colors" />
            <Bookmark size={20} className="hover:text-orange-500 cursor-pointer transition-colors" />
          </div>
        </div>
      </div>

      {/* ২. মেইন ব্যানার ইমেজ */}
      <div className="max-w-6xl mx-auto px-6 mb-16">
        <div className="relative w-full overflow-hidden rounded-3xl shadow-xl bg-zinc-50 dark:bg-zinc-900">
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
            <Image 
              src={blog.image} 
              alt={blog.title} 
              fill 
              priority 
              className="object-contain p-4 md:p-8" 
            />
          </div>
        </div>
      </div>

      {/* ৩. কন্টেন্ট বডি */}
      <div className="max-w-3xl mx-auto px-6 mb-24">
        
        {/* প্রথমে সব টেক্সট রেন্ডার হবে (Paragraph, Heading, Quote) */}
        {blog.content?.filter(item => item.type !== "image_grid").map((item, idx) => (
          <div key={`text-${idx}`} className="mb-8 text-lg md:text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed font-light">
            
            {item.type === "paragraph" && <p className="mb-4">{item.text}</p>}
            
            {item.type === "quote" && (
              <div className="pl-6 my-10 border-l-2 border-orange-500 text-2xl font-serif dark:text-zinc-100 leading-snug italic">
                "{item.text}"
              </div>
            )}
            
            {item.type === "heading" && (
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-zinc-900 dark:text-white mt-12 mb-6">
                {item.text}
              </h2>
            )}
          </div>
        ))}

      {/* সব টেক্সট শেষ হওয়ার পর সবশেষে ২/২ ইমেজ গ্রিড আসবে */}
{blog.content?.filter(item => item.type === "image_grid").map((item, idx) => (
  <div key={`grid-${idx}`} className="mt-16 mb-12">
    <div className="grid grid-cols-2 gap-4">
      {item.images.slice(0, 4).map((img, i) => (
        <div 
          key={i} 
          className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-900 shadow-md border border-zinc-100 dark:border-zinc-800"
        >
          <Image 
            src={img} 
            alt={`Detail ${i}`} 
            fill 
            className="object-contain p-2 transition-transform duration-500 group-hover:scale-105" 
          />
        </div>
      ))}
    </div>
    <p className="text-center text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold mt-6">
      Visual perspectives of the craftsmanship process
    </p>
  </div>
))}
      </div>

    </article>
  );
};

export default BlogDetails;