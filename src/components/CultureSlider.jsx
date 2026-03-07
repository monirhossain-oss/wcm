// components/CultureSlider.js
'use client';
import React, { useRef } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';

export default function CultureSlider({ tags, API_BASE_URL }) {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    return (
        <div className="relative group">
            {/* Buttons */}
            <button ref={prevRef} className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-full items-center justify-center text-gray-800 dark:text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#F57C00] hover:text-white -ml-2 hidden md:flex">
                <FaChevronLeft size={14} />
            </button>
            <button ref={nextRef} className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-full items-center justify-center text-gray-800 dark:text-white shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#F57C00] hover:text-white -mr-2 hidden md:flex">
                <FaChevronRight size={14} />
            </button>

            <Swiper
                slidesPerView={1.4}
                spaceBetween={16}
                freeMode={true}
                navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
                onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                }}
                breakpoints={{
                    640: { slidesPerView: 2.5, spaceBetween: 20 },
                    1024: { slidesPerView: 4, spaceBetween: 24 },
                }}
                modules={[FreeMode, Navigation]}
                className="!overflow-visible"
            >
                {tags.map((tag) => (
                    <SwiperSlide key={tag._id}>
                        <div
                            onClick={() => (window.location.href = `/listings?tag=${tag._id}`)}
                            className="relative h-48 md:h-56 w-full overflow-hidden cursor-pointer group/card shadow-sm hover:shadow-xl transition-all duration-500"
                        >
                            <Image
                                src={tag.image.startsWith('http') ? tag.image : `${API_BASE_URL}/${tag.image}`}
                                alt={tag.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                                sizes="(max-width: 768px) 100vw, 300px"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent group-hover/card:from-black/100 transition-opacity" />
                            <div className="absolute bottom-0 left-0 p-5 w-full transform transition-transform duration-300 group-hover/card:-translate-y-1">
                                <h3 className="text-base md:text-lg font-bold text-white uppercase leading-tight">{tag.title}</h3>
                                <p className="text-[10px] text-gray-300 mt-1 font-medium tracking-widest uppercase">{tag.listingCount || 0} Listings</p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}