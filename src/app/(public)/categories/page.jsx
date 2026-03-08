'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useListings } from '@/context/ListingsContext';
import ListingCard from '@/components/ListingCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

const CategoriesPage = () => {
  const { cachedListings } = useListings();

  // States
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const limit = 12;
  const observer = useRef();
  const scrollRef = useRef(null);

  // ১. মেটা-ডাটা ক্যাশিং (পাগলা স্পিড দেবে ক্যাটাগরি লোডে)
  useEffect(() => {
    const fetchMeta = async () => {
      const CACHE_KEY = 'meta_data_cache';
      try {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data } = JSON.parse(cached);
          setCategories(['All', ...data.categories.map((c) => c.title)]);
          return;
        }
        const res = await api.get('/api/listings/meta-data');
        const catTitles = res.data.categories.map((c) => c.title);
        setCategories(['All', ...catTitles]);
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: res.data, timestamp: Date.now() }));
      } catch (err) { console.error('Meta error:', err); }
    };
    fetchMeta();
  }, []);

  // ২. কোর ফেচ ফাংশন (Memoized with useCallback)
  const fetchListings = useCallback(
    async (isInitial = false, skipLoading = false) => {
      if (isInitial && !skipLoading) setLoading(true);
      else if (!isInitial) setLoadingMore(true);

      try {
        let url = `/api/listings/public?limit=${limit}&offset=${isInitial ? 0 : offset}`;
        if (activeCategory !== 'All') url += `&category=${encodeURIComponent(activeCategory)}`;

        const res = await api.get(url);
        const { listings: newListings, hasMore: more } = res.data;

        setListings((prev) => (isInitial ? newListings : [...prev, ...newListings]));
        setHasMore(more);
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [activeCategory, offset]
  );

  // ৩. ক্যাটাগরি সুইচিং লজিক (স্কেলিটন লোডার ট্রিগার)
  useEffect(() => {
    setOffset(0);
    setHasMore(true);

    // ক্যাটাগরি চেঞ্জ হলে ডাটা ক্লিয়ার (স্মুথ ট্রানজিশন)
    setListings([]);

    if (activeCategory === 'All' && cachedListings?.length > 0) {
      // হোমে যদি ডাটা থাকে, সেটা ফাস্ট দেখাবে
      setListings(cachedListings.slice(0, 12));
      setLoading(false);
      fetchListings(true, true); // ব্যাকগ্রাউন্ড সিঙ্ক
    } else {
      // অন্য ক্যাটাগরিতে ক্লিক করলে স্কেলিটন দেখাবে
      fetchListings(true, false);
    }
  }, [activeCategory]);

  // ৪. ইনফিনিট স্ক্রল হ্যান্ডলার
  useEffect(() => {
    if (offset > 0) fetchListings(false);
  }, [offset]);

  const lastElementRef = useCallback((node) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) setOffset((prev) => prev + limit);
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore]);

  const slide = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - 250 : scrollLeft + 250,
        behavior: 'smooth'
      });
    }
  };

  const SkeletonCard = () => (
    <div className="space-y-4">
      <div className="aspect-[5/4] bg-zinc-100 dark:bg-white/5 rounded-2xl animate-pulse" />
      <div className="h-4 bg-zinc-100 dark:bg-white/5 w-3/4 rounded-full animate-pulse" />
      <div className="h-3 bg-zinc-100 dark:bg-white/5 w-1/2 rounded-full animate-pulse" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors pb-20">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Discover Style Sticky Header */}
      <div className="sticky top-20 z-40 bg-white/95 dark:bg-[#0a0a0a] border-b border-zinc-100 dark:border-white/5">

        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2">

          {/* Title */}
          <div className="text-center mb-3">
            <h1 className="text-lg sm:text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight leading-tight">
              Explore <span className="text-[#F57C00]">Collections</span>
            </h1>
          </div>

          {/* Categories */}
          <div className="flex items-center">

            <button
              onClick={() => slide('left')}
              className="p-1 text-zinc-500 hover:text-orange-500 transition-colors shrink-0"
            >
              <ChevronLeft size={16} />
            </button>

            <div
              ref={scrollRef}
              className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar px-1 scroll-smooth mx-auto"
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${activeCategory === cat
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                      : 'text-zinc-500 hover:text-orange-500 bg-zinc-50 dark:bg-white/5'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => slide('right')}
              className="p-1 text-zinc-500 hover:text-orange-500 transition-colors shrink-0"
            >
              <ChevronRight size={16} />
            </button>

          </div>

        </div>
      </div>

      {/* Grid Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading && listings.length === 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="space-y-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 animate-in fade-in duration-500">
              {listings.map((item, index) => (
                <div key={item._id} ref={index === listings.length - 1 ? lastElementRef : null}>
                  <ListingCard item={item} />
                </div>
              ))}
            </div>

            {loadingMore && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                {[...Array(4)].map((_, i) => <SkeletonCard key={`more-${i}`} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;