'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useListings } from '@/context/ListingsContext';
import ListingCard from '@/components/ListingCard';
import { Search, ChevronLeft, ChevronRight, Loader2, MapPin, Zap } from 'lucide-react';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

const DiscoverPage = () => {
  const { cachedListings } = useListings();

  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [regions, setRegions] = useState(['All Regions']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('Popularity');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const limit = 12;
  const observer = useRef();
  const scrollRef = useRef(null);

  // মেটা ডাটা ফেচিং এবং ক্যাশিং লজিক (টাইমস্ট্যাম্পসহ)
  useEffect(() => {
    const fetchMeta = async () => {
      const CACHE_KEY = 'meta_data_cache';
      const CACHE_DURATION = 3600000; // ১ ঘণ্টা (মিলিসেকেন্ডে)

      try {
        const cachedMeta = sessionStorage.getItem(CACHE_KEY);

        // ক্যাশ চেক ও ভ্যালিডেশন
        if (cachedMeta) {
          const { data, timestamp } = JSON.parse(cachedMeta);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setCategories(['All', ...data.categories.map((c) => c.title)]);
            setRegions(['All Regions', ...(data.regions || [])]);
            return;
          }
        }

        // ক্যাশ না থাকলে বা এক্সপায়ারড হলে এপিআই কল
        const res = await api.get('/api/listings/meta-data');
        const catTitles = res.data.categories.map((c) => c.title);
        const regionData = res.data.regions || [];

        setCategories(['All', ...catTitles]);
        setRegions(['All Regions', ...regionData]);

        // নতুন ডাটা ও টাইমস্ট্যাম্প সেভ করি
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({
          data: res.data,
          timestamp: Date.now()
        }));
      } catch (err) { console.error('Meta fetch error:', err); }
    };
    fetchMeta();
  }, []);

  // ক্যাশ চেক ও প্রাথমিক লোড
  useEffect(() => {
    if (cachedListings && cachedListings.length > 0) {
      setListings(cachedListings);
      setLoading(false);
    } else {
      fetchListings(true);
    }
  }, []);

  // সার্চ ডিবাউন্স
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // মেইন ফেচ ফাংশন
  const fetchListings = useCallback(
    async (isInitial = false) => {
      if (isInitial) setLoading(true);
      else setLoadingMore(true);

      try {
        let url = `/api/listings/public?limit=${limit}&offset=${isInitial ? 0 : offset}`;
        if (activeCategory !== 'All') url += `&category=${activeCategory}`;
        if (debouncedSearch) url += `&search=${debouncedSearch}`;
        if (sortBy === 'Newest') url += `&filter=Today`;
        if (selectedRegion !== 'All Regions') url += `&region=${selectedRegion}`;

        const res = await api.get(url);
        const { listings: newListings, hasMore: more } = res.data;

        setListings((prev) => (isInitial ? newListings : [...prev, ...newListings]));
        setHasMore(more);
      } catch (err) { console.error(err); }
      finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [activeCategory, debouncedSearch, sortBy, selectedRegion, offset]
  );

  // ফিল্টার পরিবর্তন হলে রিফ্রেশ
  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    fetchListings(true);
  }, [activeCategory, debouncedSearch, sortBy, selectedRegion]);

  // ইনফিনিট স্ক্রল ট্রিগার
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
      scrollRef.current.scrollTo({ left: direction === 'left' ? scrollLeft - 200 : scrollLeft + 200, behavior: 'smooth' });
    }
  };

  const SkeletonCard = () => (
    <div className="space-y-4 animate-pulse">
      <div className="aspect-5/4 bg-zinc-100 dark:bg-white/5" />
      <div className="h-4 bg-zinc-100 dark:bg-white/5 w-3/4" />
      <div className="h-3 bg-zinc-100 dark:bg-white/5 w-1/2" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors pb-20">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Sticky Header */}
      <div className="sticky top-20 z-40 bg-white/95 dark:bg-[#0a0a0a] border-b border-zinc-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 space-y-4">

          {/* Search Bar */}
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="text"
              placeholder="Search culture, art, nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-zinc-100 dark:bg-white/5 border-none rounded-full text-sm outline-none transition-all dark:text-white"
            />
          </div>

          {/* Filters Area */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            {/* Categories */}
            <div className="relative w-full flex items-center overflow-hidden md:flex-1 md:order-2">
              <button onClick={() => slide('left')} className="p-1 hover:text-orange-500 shrink-0">
                <ChevronLeft size={18} />
              </button>

              <div
                ref={scrollRef}
                className="flex items-center gap-2 overflow-x-auto no-scrollbar px-2 scroll-smooth"
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase whitespace-nowrap ${activeCategory === cat
                      ? 'bg-orange-500 text-white'
                      : 'text-zinc-500 bg-zinc-50 dark:bg-white/5'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button onClick={() => slide('right')} className="p-1 hover:text-orange-500 shrink-0">
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Popularity + Region */}
            <div className="flex items-center justify-between gap-4 md:gap-6 md:order-1">

              {/* Popularity */}
              <div className="flex items-center gap-2 bg-zinc-100 dark:bg-white/5 px-3 py-2 rounded-xl shrink-0">
                <Zap size={14} className="text-orange-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-xs font-semibold uppercase outline-none cursor-pointer text-zinc-700 dark:text-zinc-200"
                >
                  <option className="bg-white text-zinc-700">Popularity</option>
                  <option className="bg-white text-zinc-700">Newest</option>
                </select>
              </div>


              {/* Region */}
              <div className="flex items-center gap-2 bg-zinc-100 dark:bg-white/5 px-3 py-2 rounded-xl shrink-0">
                <MapPin size={14} className="text-blue-500" />
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-transparent text-xs font-semibold uppercase outline-none cursor-pointer text-zinc-700 dark:text-zinc-200"
                >
                  {regions.map((r) => (
                    <option key={r} value={r} className="bg-white text-zinc-700">
                      {r}
                    </option>
                  ))}
                </select>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {listings.map((item, index) => (
            <div key={item._id} ref={index === listings.length - 1 ? lastElementRef : null}>
              <ListingCard item={item} />
            </div>
          ))}
          {loadingMore && [...Array(4)].map((_, i) => <SkeletonCard key={`more-${i}`} />)}
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;