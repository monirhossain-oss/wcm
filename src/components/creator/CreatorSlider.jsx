"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { localePath } from '@/lib/i18n';

import "swiper/css";

// The arrows show only while the Featured Creators section (`group/creators` in PopularCreators.jsx)
// is hovered, or when a keyboard user tabs onto one. Hidden arrows ignore the pointer so they never
// swallow a tap on a touch screen, which has no hover. Swiper sets `disabled` on the button at
// either end, and adds `swiper-button-lock` when every creator already fits on screen.
const arrowClass = "absolute top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-full items-center justify-center text-gray-800 dark:text-white shadow-xl transition-all duration-300 hover:bg-[#F57C00] hover:text-white opacity-0 pointer-events-none group-hover/creators:opacity-100 group-hover/creators:pointer-events-auto focus-visible:opacity-100 focus-visible:pointer-events-auto group-hover/creators:disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-800 dark:disabled:hover:bg-zinc-900 dark:disabled:hover:text-white hidden md:flex [&.swiper-button-lock]:hidden";

const CreatorSlider = ({ creators, locale = 'en', labels = {} }) => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    return (
        <div className="relative">
            <button type="button" ref={prevRef} aria-label={labels.previous || "Previous creators"} className={`${arrowClass} left-0 -ml-2`}>
                <FaChevronLeft size={14} />
            </button>
            <button type="button" ref={nextRef} aria-label={labels.next || "Next creators"} className={`${arrowClass} right-0 -mr-2`}>
                <FaChevronRight size={14} />
            </button>

            <Swiper
                modules={[Navigation]}
                spaceBetween={12}
                slidesPerView={1.4}
                navigation={{
                    prevEl: null,
                    nextEl: null,
                }}
                onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                }}
                breakpoints={{
                    640: { slidesPerView: 2.5, spaceBetween: 16 },
                    1024: { slidesPerView: 4, spaceBetween: 24 },
                }}
                className="pb-4 !overflow-visible"
            >
                {creators.map((creator) => (
                    <SwiperSlide key={creator._id} className="!h-auto">
                        <div className="bg-gray-100 dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 p-4 md:p-6 text-center hover:shadow-lg transition-all duration-300 group h-full flex flex-col items-center">

                            {/* Profile Image */}
                            <div className="relative w-20 h-20 md:w-24 md:h-24 mb-3 md:mb-4 shrink-0">
                                <Image
                                    src={creator.profile?.profileImage || "/default-avatar.png"}
                                    alt={creator.username || "creator"}
                                    fill
                                    sizes="96px"
                                    className="rounded-full object-cover ring-2 ring-gray-100 dark:ring-zinc-800 group-hover:ring-orange-500 transition-all"
                                />
                            </div>

                            {/* Name */}
                            <h3 className="font-bold text-sm md:text-base text-gray-900 dark:text-white truncate w-full px-2">
                                {creator.firstName} {creator.lastName}
                            </h3>

                            {/* Location */}
                            <p className="text-[10px] md:text-xs text-gray-500 mb-2 md:mb-3 italic">
                                {creator.profile?.city || labels.unknown || "Unknown"}, {creator.profile?.country || labels.world || "World"}
                            </p>

                            {/* Listings Badge */}
                            <div className="text-[9px] md:text-[10px] font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/20 py-1 px-3 rounded-full mb-4 uppercase">
                                {creator.totalListings || 0} {labels.listings || "Listings"}
                            </div>

                            {/* এই লিংকটা mt-auto দিয়ে নিচে চলে আসবে */}
                            <Link
                                href={localePath(locale, `/profile/${creator.slug || creator.username || creator._id}`)}
                                className="w-full py-2 md:py-2.5 text-[10px] md:text-xs font-bold text-white bg-orange-500 rounded-full hover:bg-orange-600 transition-all uppercase mt-auto shadow-sm active:scale-95 text-center"
                            >
                                {labels.viewProfile || "View Profile"}
                            </Link>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default CreatorSlider;
