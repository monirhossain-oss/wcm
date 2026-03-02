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
            Explore by Tradition
          </h2>
          <p className="text-sm text-[#555555] dark:text-[#cccccc]">
            Discover curated cultural works <br /> organized by traditional craftsmanship, <br /> rituals, and heritage practices.
          </p>
        </div>
        <a href="/explore" className="text-[#F57C00] hover:underline font-semibold text-sm">
          View all &rarr;
        </a>
      </div>

      {/* Navigation Buttons */}
      <button className="tag-prev-btn absolute left-0 top-[60%] -translate-y-1/2 z-30 w-10 h-10 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-full flex items-center justify-center text-gray-800 dark:text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#F57C00] hover:text-white -ml-2 hidden md:flex">
        <FaChevronLeft size={14} />
      </button>
      <button className="tag-next-btn absolute right-0 top-[60%] -translate-y-1/2 z-30 w-10 h-10 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-full flex items-center justify-center text-gray-800 dark:text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#F57C00] hover:text-white -mr-2 hidden md:flex">
        <FaChevronRight size={14} />
      </button>

      {loading && page === 1 ? (
        <div className="flex gap-6 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="min-w-[200px] flex-1 h-64 bg-gray-200 dark:bg-white/5 animate-pulse rounded-xl"
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
                className="relative h-64 w-full rounded-sm overflow-hidden cursor-pointer group/card shadow-sm hover:shadow-xl transition-all duration-500"
              >
                {/* Background Image */}
                <Image
                  src={tag.image.startsWith('http') ? tag.image : `${API_BASE_URL}/${tag.image}`}
                  alt={tag.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                  sizes="(max-width: 768px) 100vw, 300px"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300 group-hover/card:from-black/100" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 p-5 w-full transform transition-transform duration-300 group-hover/card:-translate-y-1">
                  <h3 className="text-lg font-bold text-white leading-tight drop-shadow-lg">
                    {tag.title}
                  </h3>
                  <p className="text-xs text-gray-300 mt-1 font-medium tracking-wide">
                    {tag.listingCount || 0} LISTINGS
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {hasMore && (
            <SwiperSlide>
              <div className="flex items-center justify-center h-64 w-full bg-gray-100 dark:bg-white/5 rounded-xl">
                <div className="w-8 h-8 border-3 border-[#F57C00] border-t-transparent rounded-full animate-spin"></div>
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      )}
    </section>
  );
}