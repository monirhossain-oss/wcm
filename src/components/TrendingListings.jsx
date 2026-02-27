'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import ListingCard from './ListingCard';

// Swiper Components and Styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

const TrendingListings = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchListings();
  }, [filter, user]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/listings/public?filter=${filter}&limit=20`, {
        withCredentials: true,
      });
      setListings(res.data);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full overflow-hidden bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6 py-12 relative group">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <h2 className="text-2xl font-bold text-[#1F1F1F] dark:text-[#ededed]">
            Featured cultures
          </h2>

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

        <button className="swiper-prev-btn absolute left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-full items-center justify-center border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-orange-500 hover:text-white -ml-2 md:flex hidden">
          <FaChevronLeft size={14} />
        </button>
        <button className="swiper-next-btn absolute right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-full items-center justify-center border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-orange-500 hover:text-white -mr-2 md:flex hidden">
          <FaChevronRight size={14} />
        </button>

        {loading ? (
          <div className="flex gap-5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex-1 min-w-[250px] h-72 bg-gray-200 dark:bg-white/5 animate-pulse rounded-sm"
              />
            ))}
          </div>
        ) : (
          <Swiper
            slidesPerView={1.4}
            spaceBetween={20}
            freeMode={true}
            loop={listings.length > 5}
            watchSlidesProgress={true}
            navigation={{
              nextEl: '.swiper-next-btn',
              prevEl: '.swiper-prev-btn',
            }}
            breakpoints={{
              640: { slidesPerView: 3.2, spaceBetween: 16 },
              1024: { slidesPerView: 5, spaceBetween: 20 },
            }}
            modules={[FreeMode, Navigation]}
            className="mySwiper !overflow-visible"
          >
            {listings.map((item) => (
              <SwiperSlide
                key={item._id}
                className="!z-auto hover:!z-[110] active:!z-[110] focus-within:!z-[110]"
              >
                <ListingCard item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default TrendingListings;
