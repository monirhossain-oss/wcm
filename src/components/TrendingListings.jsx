'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import ListingCard from './ListingCard';
import Link from 'next/link'; // লিঙ্ক ইমপোর্ট করুন

import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa'; // FaArrowRight যোগ করুন

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

const TrendingListings = ({ activeFilters }) => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  const isFetching = useRef(false);

  const fetchListings = useCallback(
    async (pageNum, isNewFilter = false) => {
      if (isFetching.current) return;
      // স্লাইডারে আমরা খুব বেশি ডেটা লোড করব না (যেমন সর্বোচ্চ ২০টি)
      if (pageNum > 2) {
        setHasMore(false);
        return;
      }

      isFetching.current = true;
      if (pageNum === 1) setLoading(true);

      try {
        const { category, region, tradition } = activeFilters;
        let url = `${API_BASE_URL}/api/listings/public?filter=${filter}&page=${pageNum}&limit=10`;

        if (category) url += `&category=${category}`;
        if (region) url += `&region=${region}`;
        if (tradition) url += `&tradition=${tradition}`;

        const res = await axios.get(url, { withCredentials: true });
        const fetchedData = res.data.listings || [];

        // যদি ১০টার কম ডেটা আসে বা ২ নম্বর পেজ শেষ হয়
        setHasMore(fetchedData.length === 10 && pageNum < 2);
        setListings((prev) => (isNewFilter ? fetchedData : [...prev, ...fetchedData]));
        setPage(pageNum);
      } catch (err) {
        console.error('Error fetching listings:', err);
      } finally {
        setLoading(false);
        isFetching.current = false;
      }
    },
    [filter, API_BASE_URL, activeFilters]
  );

  useEffect(() => {
    setHasMore(true);
    fetchListings(1, true);
  }, [filter, activeFilters]);

  const handleReachEnd = () => {
    if (hasMore && !loading && !isFetching.current) {
      fetchListings(page + 1);
    }
  };

  return (
    <div className="w-full overflow-hidden bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 relative group">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#1F1F1F] dark:text-[#ededed]">
              All Listings
            </h2>
            <p className="text-sm mt-1 text-zinc-400">
              Handpicked traditions for you
            </p>
          </div>

          <div className="flex space-x-1 bg-gray-100 dark:bg-white/10 p-1 rounded-full w-fit">
            {['All', 'Today', 'This week'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${
                  filter === f
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'text-gray-500 hover:text-orange-500'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button className="swiper-prev-btn absolute left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-full items-center justify-center border border-gray-200 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-all -ml-2 hover:bg-orange-500 hover:text-white md:flex hidden shadow-xl">
          <FaChevronLeft size={14} />
        </button>
        <button className="swiper-next-btn absolute right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-full items-center justify-center border border-gray-200 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-all -mr-2 hover:bg-orange-500 hover:text-white md:flex hidden shadow-xl">
          <FaChevronRight size={14} />
        </button>

        {loading && page === 1 ? (
          <div className="flex gap-5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex-1 min-w-60.5 h-72 bg-gray-200 dark:bg-white/5 animate-pulse rounded-md"
              />
            ))}
          </div>
        ) : listings.length > 0 ? (
          <Swiper
            slidesPerView={1.4}
            spaceBetween={30}
            freeMode={true}
            onReachEnd={handleReachEnd}
            navigation={{ nextEl: '.swiper-next-btn', prevEl: '.swiper-prev-btn' }}
            breakpoints={{ 640: { slidesPerView: 3.2 }, 1024: { slidesPerView: 4 } }}
            modules={[FreeMode, Navigation]}
            className="mySwiper !overflow-visible"
          >
            {listings.map((item) => (
              <SwiperSlide key={item._id}>
                <ListingCard item={item} />
              </SwiperSlide>
            ))}

            {!hasMore && (
              <SwiperSlide>
                <Link href="/products">
                  <div className="h-full min-h-78 md:min-h-95 bg-gray-100 dark:bg-white/5 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center group/btn cursor-pointer hover:bg-orange-50/50 dark:hover:bg-orange-500/5 transition-all">
                    <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center mb-3 group-hover/btn:scale-110 transition-transform">
                      <FaArrowRight size={20} />
                    </div>
                    <span className="font-bold text-gray-700 dark:text-gray-200">
                      See All Listings
                    </span>
                  </div>
                </Link>
              </SwiperSlide>
            )}

            {hasMore && (
              <SwiperSlide>
                <div className="flex items-center justify-center h-full min-h-78 w-full">
                  <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </SwiperSlide>
            )}
          </Swiper>
        ) : (
          <div className="py-20 text-center text-gray-400">No listings found.</div>
        )}

        {!loading && listings.length > 0 && (
          <div className="mt-12 flex justify-center">
            <Link href="/products">
              <button className="flex items-center gap-2 px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold rounded-full hover:bg-orange-600 dark:hover:bg-orange-500 dark:hover:text-white transition-all active:scale-95 shadow-lg">
                Explore Full Directory <FaArrowRight size={14} />
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingListings;
