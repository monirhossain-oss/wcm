"use client";
import { Heart } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const  AboutVisibility = () => {
    return (
        <section className="bg-white dark:bg-[#0a0a0a] py-20 px-6 flex flex-col items-center text-center transition-colors duration-500">

            {/*Symbolizing Passion for Culture */}
            <div className="mb-10 animate-pulse">
                <Heart className="w-14 h-14 text-[#F57C00] stroke-[1.5px]" />
            </div>

            {/*Inspired by Founder's Vision */}
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white leading-[1.1] mb-8 tracking-tight">
                Culture deserves <br />
                <span className="text-[#F57C00]">visibility.</span>
            </h2>

            {/* মেইন প্যারাগ্রাফ - Covering the 'Why' of WCM */}
            <div className="max-w-3xl space-y-6 mb-12">
                <p className="text-gray-600 dark:text-gray-300 text-lg md:text-xl font-medium leading-relaxed">
                    World Culture Marketplace was founded by <span className="text-gray-900 dark:text-white font-bold">Annette Cousin</span> with a simple idea:
                    culture deserves to be seen, understood, and respected in the digital world.
                </p>

                <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg leading-relaxed">
                    We bridge the gap between extraordinary artisans and global audiences, creating a space
                    where cultural heritage is not just a commodity, but a <span className="italic">living legacy</span>
                    shared with respect and authenticity.
                </p>
            </div>

            {/*Location and Global Mission */}
            <div className="mb-12 flex flex-col md:flex-row items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                <span>Based in Paris, France</span>
                <span className="hidden md:block text-[#F57C00]">•</span>
                <span>Washington, USA</span>
                <span className="hidden md:block text-[#F57C00]">•</span>
                <span>Serving Global Artisans</span>
            </div>

            {/* এক্সপ্লোর বাটন */}
            <Link href="/explore">
                <button className="px-10 py-4 cursor-pointer rounded-2xl bg-[#F57C00] text-white font-black hover:bg-[#e67600] transition-all shadow-2xl shadow-orange-500/20 hover:scale-105 active:scale-95 uppercase tracking-wider">
                    Explore Our Creators
                </button>
            </Link>

            {/* ট্রাস্ট ব্যাজ বা ছোট মেসেজ */}
            <p className="mt-8 text-gray-400 dark:text-gray-600 text-sm font-medium italic">
                Supporting a more inclusive and respectful global cultural economy.
            </p>

        </section>
    );
};

export default AboutVisibility;