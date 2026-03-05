'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { FaSpinner } from 'react-icons/fa';
import ListingCard from '@/components/ListingCard';

const CategoriesPage = () => {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // --- Infinite Scroll States ---
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const observer = useRef();

  const limit = 12;
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

  // শেষ এলিমেন্টটি ডিটেক্ট করার জন্য
  const lastElementRef = useCallback(
    (node) => {
      if (loading || loadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setOffset((prevOffset) => prevOffset + limit);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore]
  );

  // ক্যাটাগরি ফেচিং
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/listings/meta-data`);
        const catTitles = res.data.categories.map((c) => c.title);
        setCategories(['All', ...catTitles]);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchMeta();
  }, [API_BASE_URL]);

  // ডাটা ফেচিং ফাংশন
  const fetchListings = useCallback(
    async (isInitial = false) => {
      if (isInitial) setLoading(true);
      else setLoadingMore(true);

      try {
        let url = `${API_BASE_URL}/api/listings/public?limit=${limit}&offset=${isInitial ? 0 : offset}`;
        if (activeCategory !== 'All') {
          url += `&category=${activeCategory}`;
        }

        const res = await axios.get(url, { withCredentials: true });
        const { listings: newListings, hasMore: moreAvailable } = res.data;

        setListings((prev) => (isInitial ? newListings : [...prev, ...newListings]));
        setHasMore(moreAvailable);
      } catch (err) {
        console.error('Error fetching listings:', err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [API_BASE_URL, activeCategory, offset]
  );

  // যখনই ক্যাটাগরি চেঞ্জ হবে
  useEffect(() => {
    setOffset(0);
    setListings([]);
    setHasMore(true);
    fetchListings(true);
  }, [activeCategory]);

  // যখন অফসেট চেঞ্জ হবে (ইউজার নিচে নামবে)
  useEffect(() => {
    if (offset > 0) {
      fetchListings(false);
    }
  }, [offset]);

  const handleCategoryChange = (cat) => {
    if (activeCategory === cat) return;
    setActiveCategory(cat);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white mb-2 uppercase tracking-tighter">
            Explore <span className="text-[#F57C00]">Collections</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">
            Discover authentic cultural treasures from across the globe.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 border ${
                activeCategory === cat
                  ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'bg-transparent border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-orange-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        {loading && listings.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-zinc-100 dark:bg-white/5 rounded-xl mb-4" />
                <div className="h-4 bg-zinc-100 dark:bg-white/5 w-3/4 rounded mb-2" />
                <div className="h-3 bg-zinc-100 dark:bg-white/5 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
              {listings.map((item, index) => {
                if (listings.length === index + 1) {
                  return (
                    <div ref={lastElementRef} key={item._id}>
                      <ListingCard item={item} />
                    </div>
                  );
                }
                return (
                  <div key={item._id}>
                    <ListingCard item={item} />
                  </div>
                );
              })}
            </div>

            {/* Loading Indicator for More Items */}
            {loadingMore && (
              <div className="flex justify-center py-12">
                <FaSpinner className="animate-spin text-orange-500" size={24} />
              </div>
            )}

            {/* End of results message */}
            {!hasMore && listings.length > 0 && (
              <div className="mt-20 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                  --- End of Protocol ---
                </p>
              </div>
            )}
          </>
        )}

        {listings.length === 0 && !loading && (
          <div className="py-20 text-center border-2 border-dashed border-zinc-100 dark:border-white/5 rounded-3xl">
            <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">
              No cultural treasures found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
