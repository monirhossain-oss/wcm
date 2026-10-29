"use client";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

// Swiper CSS ইমপোর্ট নিশ্চিত করুন
import "swiper/css";

const CreatorSlider = ({ creators }) => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    return (
        <div className="relative">
            <Swiper
                modules={[Navigation]}
                spaceBetween={12}
                slidesPerView={1.4}
                navigation={{
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
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
                    <SwiperSlide key={creator._id} className="h-auto">
                        <div className="bg-gray-100 dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 p-4 md:p-6 text-center hover:shadow-lg transition-all duration-300 group h-full flex flex-col items-center">

                            {/* Profile Image */}
                            <div className="relative w-20 h-20 md:w-24 md:h-24 mb-3 md:mb-4">
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
                                {creator.profile?.city || "Unknown"}, {creator.profile?.country || "World"}
                            </p>

                            {/* Listings Badge */}
                            <div className="text-[9px] md:text-[10px] font-bold text-orange-600 bg-orange-50 dark:bg-orange-900/20 py-1 px-3 rounded-full mb-4 uppercase">
                                {creator.totalListings || 0} Listings
                            </div>
                            <Link
                                href={`/profile/${creator.username || creator._id}`}
                                className="w-full py-2 md:py-2.5 text-[10px] md:text-xs font-bold text-white bg-orange-500 rounded-full hover:bg-orange-600 transition-all uppercase mt-auto shadow-sm active:scale-95 text-center"
                            >
                                View Profile
                            </Link>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default CreatorSlider;