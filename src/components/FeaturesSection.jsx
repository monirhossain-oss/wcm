'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

export default function FeaturedCultures() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  const isFetching = useRef(false); 

  useEffect(() => {
    fetchTags(1);
  }, []);

  const fetchTags = async (pageNum) => {
    if (isFetching.current || (!hasMore && pageNum !== 1)) return;

    isFetching.current = true;
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/listings/meta-data?page=${pageNum}&limit=10`
      );

      const newTags = res.data.tags || [];

      if (newTags.length < 10) {
        setHasMore(false);
      }

      setTags((prev) => (pageNum === 1 ? newTags : [...prev, ...newTags]));
      setPage(pageNum);
    } catch (err) {
      console.error('Error fetching tags:', err);
    } finally {
      setLoading(false);
      isFetching.current = false;
    }
  };

  const handleReachEnd = () => {
    if (hasMore && !isFetching.current) {
      fetchTags(page + 1);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 relative group">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#1F1F1F] dark:text-[#ededed]">
            Featured cultures
          </h2>
          <p className="text-sm text-[#555555] dark:text-[#cccccc]">
            Browse popular cultural categories
          </p>
        </div>
        <a href="/explore" className="text-[#F57C00] hover:underline font-semibold text-sm">
          View all &rarr;
        </a>
      </div>

      {/* Navigation Buttons */}
      <button className="tag-prev-btn absolute left-0 top-[60%] -translate-y-1/2 z-30 w-10 h-10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-full items-center justify-center border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-orange-500 hover:text-white -ml-2 md:flex hidden">
        <FaChevronLeft size={14} />
      </button>
      <button className="tag-next-btn absolute right-0 top-[60%] -translate-y-1/2 z-30 w-10 h-10 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-full items-center justify-center border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-orange-500 hover:text-white -mr-2 md:flex hidden">
        <FaChevronRight size={14} />
      </button>

      {loading && page === 1 ? (
        <div className="flex gap-6 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="min-w-[200px] flex-1 h-64 bg-gray-200 dark:bg-white/5 animate-pulse rounded-lg"
            />
          ))}
        </div>
      ) : (
        <Swiper
          slidesPerView={1.4}
          spaceBetween={20}
          freeMode={true}
          onReachEnd={handleReachEnd} 
          navigation={{
            nextEl: '.tag-next-btn',
            prevEl: '.tag-prev-btn',
          }}
          breakpoints={{
            640: { slidesPerView: 2.5, spaceBetween: 20 },
            1024: { slidesPerView: 5, spaceBetween: 24 },
          }}
          modules={[FreeMode, Navigation]}
          className="mySwiper !overflow-visible"
        >
          {tags.map((tag) => (
            <SwiperSlide key={tag._id}>
              <div
                onClick={() => (window.location.href = `/listings?tag=${tag._id}`)}
                className="bg-[#F2F2F2] dark:bg-[#1F1F1F] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group/card"
              >
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={tag.image.startsWith('http') ? tag.image : `${API_BASE_URL}/${tag.image}`}
                    alt={tag.title}
                    fill
                    className="object-cover transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 200px"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-[#1F1F1F] dark:text-[#ededed] truncate">
                    {tag.title}
                  </h3>
                  <p className="text-sm text-[#555555] dark:text-[#cccccc] mt-1">
                    {tag.listingCount || 0} listings
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {hasMore && (
            <SwiperSlide>
              <div className="flex items-center justify-center h-48 w-full bg-gray-50 dark:bg-white/5 rounded-lg">
                <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      )}
    </section>
  );
}
