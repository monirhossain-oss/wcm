"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const BlogBanner = () => {
    return (
        // bg-[#FCFBF9] (Light) | dark:bg-slate-950 (Dark)
        <section className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-14 bg-[#FCFBF9] dark:bg-slate-950 transition-colors duration-300">
            
            {/* Left Side: Cultural Heritage Content */}
            <div className="flex-1 space-y-7 text-left">
                <div className="flex items-center gap-3 text-xs font-bold text-[#F57C00] uppercase tracking-[0.2em]">
                    <span>WCM Heritage</span>
                    <span className="h-[1px] w-12 bg-[#D4AF37]"></span>
                    <span>Echoes of Tradition</span>
                </div>
                
                <h1 className="text-3xl md:text-5xl font-serif text-[#1A1A1A] dark:text-white leading-[1.1] tracking-tight transition-colors">
                    Preserving Stories Through <br /> 
                    <span className="italic font-light text-[#F57C00] dark:text-[#F57C00]">Masterful Craftsmanship</span>
                </h1>
                
                <div className="space-y-4">
                    <p className="text-lg md:text-xl text-[#4A4A4A] dark:text-gray-300 font-light leading-relaxed max-w-lg transition-colors">
                        From the intricate beadwork of Africa to the timeless silk of Asia, we bridge the gap between ancient artistry and modern living. Discover objects that are more than decor—they are living symbols of identity.
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 font-medium tracking-wide italic transition-colors">
                        "Every piece tells a story. Every story connects a generation."
                    </p>
                </div>
                
                <div className="flex flex-wrap gap-4">
                    <Link href="/blogs/details">
                        <button className="bg-[#F57C00] text-white px-12 py-4 rounded-full font-semibold text-sm hover:bg-gray-800 dark:hover:bg-orange-600 transition-all shadow-md active:scale-95">
                            Explore Collections
                        </button>
                    </Link>
                </div>
            </div>

            {/* Right Side: Visual Collage */}
            <div className="flex-1 grid grid-cols-2 gap-5 w-full">
                {/* 1. Image: African Crafts/Jewelry */}
                <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5 dark:ring-white/10">
                    <Image 
                        src="https://i.postimg.cc/Pr9sXQ61/image-(21).jpg" 
                        alt="Handcrafted Cultural Art" 
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-110"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/5 dark:bg-black/20 hover:bg-transparent transition-colors z-10"></div>
                </div>
                
                {/* 2. Image: Textiles/Weaving */}
                <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5 dark:ring-white/10 mt-10">
                    <Image 
                        src="https://i.postimg.cc/TwVYmH4S/image-(20).jpg" 
                        alt="Traditional Textiles" 
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/5 dark:bg-black/20 hover:bg-transparent transition-colors z-10"></div>
                </div>
                
                {/* 3. Image: Global Artisans/Decor */}
                <div className="col-span-2 relative h-60 rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5 dark:ring-white/10">
                    <Image 
                        src="https://i.postimg.cc/j2j05g0y/image-(19).jpg" 
                        alt="Cultural Home Decor" 
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/5 dark:bg-black/20 hover:bg-transparent transition-colors z-10"></div>
                </div>
            </div>
        </section>
    );
};

export default BlogBanner;