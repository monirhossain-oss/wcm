'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Loader2 } from 'lucide-react';
import { FiAlertCircle } from 'react-icons/fi';
import emailjs from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

// API instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

const BlogCard = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Offset-based states
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const limit = 6; // একবারে ৬টি করে ব্লগ আসবে

  // ১. ব্যাকএন্ড থেকে ডাটা ফেচ করার ফাংশন
  const fetchBlogs = async (currentOffset = 0, isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadMoreLoading(true);
      else setLoading(true);

      const res = await api.get(`/api/blogs?offset=${currentOffset}&limit=${limit}`);

      const newBlogs = res.data.blogs;

      if (isLoadMore) {
        setBlogs((prev) => [...prev, ...newBlogs]);
      } else {
        setBlogs(newBlogs);
      }

      // ব্যাকএন্ড থেকে পাঠানো hasMore চেক করা
      setHasMore(res.data.pagination.hasMore);
    } catch (error) {
      console.error('Fetch Error:', error);
      toast.error('Failed to load stories.');
    } finally {
      setLoading(false);
      setLoadMoreLoading(false);
    }
  };

  // মাউন্ট হওয়ার সময় প্রথমবার ডাটা লোড
  useEffect(() => {
    fetchBlogs(0, false);
  }, []);

  // ২. Load More হ্যান্ডলার (Offset আপডেট)
  const handleLoadMore = () => {
    const nextOffset = offset + limit;
    setOffset(nextOffset);
    fetchBlogs(nextOffset, true);
  };

  // ৩. ইমেইল সাবস্ক্রিপশন লজিক
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email!');

    setSubmitting(true);
    try {
      const templateParams = {
        user_email: email,
        message: 'New Newsletter Subscription Request',
      };
      await emailjs.send(
        'service_sfwca8g',
        'template_80e3zpj',
        templateParams,
        'qDIfmsvflZvMxTk9S'
      );
      toast.success('Thank you for subscribing!');
      setEmail('');
    } catch (error) {
      toast.error('Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      <Toaster position="top-center" />
      {/* ব্লগ গ্রিড - লোডিং স্টেট সহ */}
      {loading ? (
        <div className="flex flex-col items-center py-20">
          <Loader2 className="animate-spin text-orange-500 mb-4" size={40} />
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
            Loading blogss...
          </p>
        </div>
      ) : blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16 mb-20">
          {blogs.map((blog) => (
            <div key={blog._id} className="group flex flex-col cursor-pointer">
              <Link
                href={`/blogs/${blog.slug}`}
                className="relative aspect-4/3 overflow-hidden rounded-2xl mb-6 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800"
              >
                <Image
                  src={blog.image || '/placeholder-image.jpg'}
                  alt={blog.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/95 dark:bg-orange-600 px-3 py-1 rounded-full shadow-sm z-10">
                  <span className="text-[9px] font-black text-orange-600 dark:text-white uppercase tracking-wider">
                    {blog.category}
                  </span>
                </div>
              </Link>

              <div className="space-y-3 px-1">
                <Link href={`/blogs/${blog.slug}`}>
                  <h3 className="text-2xl font-bold font-serif text-zinc-900 dark:text-white leading-tight transition-colors group-hover:text-orange-500 line-clamp-2">
                    {blog.title}
                  </h3>
                </Link>
                <p className="text-[14px] text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 font-sans font-medium">
                  {blog.description}
                </p>
                <div className="pt-2">
                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="inline-flex items-center gap-1 text-orange-500 font-black text-[10px] uppercase tracking-widest group/link"
                  >
                    Read More
                    <ChevronRight
                      size={14}
                      className="transition-transform group-hover/link:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-zinc-100 dark:border-zinc-900 rounded-3xl mb-20">
          <FiAlertCircle className="mx-auto text-zinc-300 mb-4" size={40} />
          <p className="text-sm font-bold text-zinc-400 uppercase tracking-tighter">
            No stories found in the archives.
          </p>
        </div>
      )}

      {/* ৪. Load More Button */}
      {hasMore && (
        <div className="flex justify-center mb-24">
          <button
            onClick={handleLoadMore}
            disabled={loadMoreLoading}
            className="px-10 py-4 border-2 border-zinc-900 dark:border-white text-zinc-900 dark:text-white text-[11px] font-black uppercase tracking-widest rounded-full hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loadMoreLoading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              'Load More Insights'
            )}
          </button>
        </div>
      )}

      {/* ৫. নিউজলেটার সেকশন */}
      <div className="max-w-3xl mx-auto py-20 border-t border-zinc-100 dark:border-zinc-900">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-zinc-900 dark:text-white mb-4">
            Stay Informed
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base leading-relaxed font-medium">
            Receive our curated weekly blogs featuring the world's{' '}
            <br className="hidden md:block" />
            most captivating cultural narratives.
          </p>
        </div>

        <form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 px-6 py-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm font-medium"
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-4 bg-[#f27b13] hover:bg-[#d96a0d] disabled:bg-zinc-400 text-white font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-orange-500/20 active:scale-95 text-[11px] flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 className="animate-spin" size={18} /> : 'Subscribe'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default BlogCard;
