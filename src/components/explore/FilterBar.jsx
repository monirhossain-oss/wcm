'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useExploreQuery } from '@/hooks/useExploreQuery';
import RegionDropdown from './RegionDropdown';

export default function FilterBar() {
    const { updateQuery, category: currentCategory, continent: currentContinent, search } = useExploreQuery();

    const scrollRef = useRef(null);
    const [categories, setCategories] = useState(['All']);
    const [searchValue, setSearchValue] = useState(search);

    // ১. লোকাল স্টোরেজ থেকে ক্যাটাগরি লোড এবং ১ ঘণ্টার ক্যাশিং লজিক
    useEffect(() => {
        const fetchCategoriesWithCache = async () => {
            const CACHE_KEY = 'wcm_categories_cache';
            const TIMESTAMP_KEY = 'wcm_categories_time';
            const CACHE_DURATION = 3600000; // ১ ঘণ্টা (মিলিসেকেন্ডে)

            try {
                const cachedData = localStorage.getItem(CACHE_KEY);
                const lastFetched = localStorage.getItem(TIMESTAMP_KEY);
                const now = Date.now();

                // যদি ক্যাশ ডাটা থাকে এবং সেটি ১ ঘণ্টার কম পুরনো হয়
                if (cachedData && lastFetched && (now - lastFetched < CACHE_DURATION)) {
                    setCategories(JSON.parse(cachedData));
                    return;
                }

                // ডাটা না থাকলে বা মেয়াদ শেষ হয়ে গেলে এপিআই কল
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/listings/meta-data`);
                const data = await res.json();

                if (data.categories) {
                    const catList = ['All', ...data.categories.map(c => c.title)];
                    setCategories(catList);

                    // লোকাল স্টোরেজে সেভ করা
                    localStorage.setItem(CACHE_KEY, JSON.stringify(catList));
                    localStorage.setItem(TIMESTAMP_KEY, now.toString());
                }
            } catch (err) {
                console.error('Category Sync Error:', err);
                // ফেইল করলে যদি আগের ডাটা থাকে সেটা অন্তত দেখাও
                const oldData = localStorage.getItem(CACHE_KEY);
                if (oldData) setCategories(JSON.parse(oldData));
            }
        };

        fetchCategoriesWithCache();
    }, []);

    // ২. ইউআরএল-এর সার্চের সাথে ইনপুট বক্স সিঙ্ক রাখা
    useEffect(() => {
        setSearchValue(search);
    }, [search]);

    // ৩. সার্চ ডেবোন্স লজিক
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchValue !== search) {
                updateQuery({ search: searchValue });
            }
        }, 600);
        return () => clearTimeout(timer);
    }, [searchValue, updateQuery, search]);

    // ৪. স্লাইডার ফাংশন (Categories Scroll)
    const slide = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.7;
            scrollRef.current.scrollTo({
                left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="sticky top-20 z-40 bg-white/95 dark:bg-[#0a0a0a] border-b border-zinc-100 dark:border-white/5 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 py-4 space-y-4">

                {/* সার্চ এবং রিজিয়ন ড্রপডাউন সেকশন */}
                <div className="flex items-center w-full bg-zinc-100 dark:bg-white/5 rounded-full p-1.5 focus-within:ring-2 focus-within:ring-orange-500/50 transition-all">
                    <div className="flex items-center flex-1 pl-3">
                        <Search className="text-zinc-400 shrink-0" size={18} />
                        <input
                            type="text"
                            placeholder="Search culture, art, traditions..."
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="w-full bg-transparent border-none px-3 py-2 text-sm outline-none dark:text-white placeholder:text-zinc-500"
                        />
                    </div>

                    <div className="w-[1px] h-6 bg-zinc-300 dark:bg-zinc-700 mx-2" />

                    <RegionDropdown
                        selected={currentContinent}
                        onSelect={(val) => updateQuery({ continent: val })}
                    />
                </div>

                {/* ক্যাটাগরি স্লাইডার সেকশন */}
                <div className="flex items-center group/slider relative">
                    <button
                        onClick={() => slide('left')}
                        className="p-1 text-zinc-400 hover:text-orange-500 transition-colors shrink-0 bg-white dark:bg-[#0a0a0a] z-10"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div
                        ref={scrollRef}
                        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth px-2 flex-1"
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => updateQuery({ category: cat })}
                                className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all uppercase tracking-wider ${currentCategory.toLowerCase() === cat.toLowerCase()
                                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                        : 'bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-white/10'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => slide('right')}
                        className="p-1 text-zinc-400 hover:text-orange-500 transition-colors shrink-0 bg-white dark:bg-[#0a0a0a] z-10"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}