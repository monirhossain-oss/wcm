'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import ListingCard from '@/components/ListingCard';
import { ChevronLeft, ChevronRight, MapPin, Zap, Search } from 'lucide-react';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

const CategoriesPage = () => {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [regions, setRegions] = useState(['All Regions']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [sortBy, setSortBy] = useState('Popularity');

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);

  const limit = 12;
  const observer = useRef();
  const scrollRef = useRef(null);

  // মেটা ডাটা ফেচিং
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await api.get('/api/listings/meta-data');
        const catTitles = res.data.categories.map((c) => c.title);
        setCategories(['All', ...catTitles]);
        if (res.data.regions) {
          setRegions(['All Regions', ...res.data.regions]);
        }
      } catch (err) {
        console.error('Meta fetch error:', err);
      }
    };
    fetchMeta();
  }, []);

  const fetchListings = useCallback(
    async (isInitial = false) => {
      if (isInitial) setLoading(true);
      else setLoadingMore(true);

      try {
        let url = `/api/listings/public?limit=${limit}&offset=${isInitial ? 0 : offset}`;
        if (activeCategory !== 'All') url += `&category=${encodeURIComponent(activeCategory)}`;
        if (selectedRegion !== 'All Regions')
          url += `&region=${encodeURIComponent(selectedRegion)}`;
        if (sortBy === 'Newest') url += `&filter=Today`;

        const res = await api.get(url);
        const { listings: newListings, hasMore: more } = res.data;

        setListings((prev) => (isInitial ? newListings : [...prev, ...newListings]));
        setHasMore(more);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [activeCategory, selectedRegion, sortBy, offset]
  );

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    fetchListings(true);
  }, [activeCategory, selectedRegion, sortBy]);

  useEffect(() => {
    if (offset > 0) fetchListings(false);
  }, [offset]);

  const lastElementRef = useCallback(
    (node) => {
      if (loading || loadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setOffset((prev) => prev + limit);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, loadingMore, hasMore]
  );

  const slide = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 200 : scrollLeft + 200;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const SkeletonCard = () => (
    <div className="space-y-4 animate-pulse">
      <div className="aspect-5/4 bg-zinc-100 dark:bg-white/5" />
      <div className="h-4 bg-zinc-100 dark:bg-white/5 w-3/4 rounded-full" />
      <div className="h-3 bg-zinc-100 dark:bg-white/5 w-1/2 rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors pb-20">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Sticky Header Section */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md border-b border-zinc-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
                Explore <span className="text-[#F57C00]">Collections</span>
              </h1>
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
                Sector: Cultural Node Discovery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Sort */}
            <div className="flex items-center gap-2 bg-zinc-100 dark:bg-white/5 px-3 py-2 rounded-xl border border-transparent hover:border-orange-500/30 transition-all shrink-0">
              <Zap size={14} className="text-orange-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer dark:text-zinc-300"
              >
                <option value="Popularity" className="dark:bg-[#1a1a1a]">
                  Popularity
                </option>
                <option value="Newest" className="dark:bg-[#1a1a1a]">
                  Newest
                </option>
              </select>
            </div>

            {/* Slider */}
            <div className="relative flex-1 flex items-center overflow-hidden">
              <button
                onClick={() => slide('left')}
                className="p-1 hover:text-orange-500 transition-colors shrink-0"
              >
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
                    className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                      activeCategory === cat
                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                        : 'text-zinc-500 hover:text-orange-500 bg-zinc-50 dark:bg-white/2'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                onClick={() => slide('right')}
                className="p-1 hover:text-orange-500 transition-colors shrink-0"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Region */}
            <div className="flex items-center gap-2 bg-zinc-100 dark:bg-white/5 px-3 py-2 rounded-xl border border-transparent hover:border-orange-500/30 transition-all shrink-0">
              <MapPin size={14} className="text-blue-500" />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer dark:text-zinc-300"
              >
                {regions.map((r) => (
                  <option key={r} value={r} className="dark:bg-[#1a1a1a]">
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading && listings.length === 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {listings.map((item, index) => (
              <div key={item._id} ref={index === listings.length - 1 ? lastElementRef : null}>
                <ListingCard item={item} />
              </div>
            ))}
            {loadingMore && [...Array(4)].map((_, i) => <SkeletonCard key={`more-${i}`} />)}
          </div>
        )}

        {!hasMore && listings.length > 0 && (
          <div className="mt-24 text-center border-t border-zinc-100 dark:border-white/5 pt-10">
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em]">
              All items loaded
            </p>
          </div>
        )}

        {!loading && listings.length === 0 && (
          <div className="text-center py-40 bg-zinc-50 dark:bg-white/2 rounded-[40px] border border-dashed border-zinc-200 dark:border-white/10">
            <p className="text-zinc-400 font-black uppercase tracking-widest text-xs">
              No matching nodes in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
