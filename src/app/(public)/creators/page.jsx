"use client";

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, Search, MapPin } from 'lucide-react';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",
  withCredentials: true,
});

const CreatorsPage = () => {
  const [allCreators, setAllCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  // ফিল্টারিং স্টেট
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCulture, setSelectedCulture] = useState(""); // কালচার স্টেট
  const [selectedCategory, setSelectedCategory] = useState(""); // ক্যাটাগরি স্টেট

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/users/top-creators-dropdown');
        if (res.data.success) {
          setAllCreators(res.data.data.top30 || []);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCreators();
  }, []);

  // মূল ফিল্টারিং লজিক (useMemo ব্যবহার করা হয়েছে পারফরম্যান্সের জন্য)
  const filteredCreators = useMemo(() => {
    return allCreators.filter((creator) => {
      const matchesSearch = (creator.firstName + " " + creator.lastName)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      
      const matchesCulture = selectedCulture === "" || creator.profile?.country === selectedCulture;
      
      const matchesCategory = selectedCategory === "" || creator.profile?.category === selectedCategory;

      return matchesSearch && matchesCulture && matchesCategory;
    });
  }, [allCreators, searchQuery, selectedCulture, selectedCategory]);

  // ডাইনামিক ফিল্টার অপশন তৈরি (যাতে ডাটাবেসে যা আছে শুধু তাই দেখায়)
  const cultures = Array.from(new Set(allCreators.map(c => c.profile?.country).filter(Boolean)));
  const categories = Array.from(new Set(allCreators.map(c => c.profile?.category).filter(Boolean)));

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-orange-500" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Syncing Creators...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors pb-20">
      
      {/* SECTION 1 — HEADER */}
      <div className="pt-20 pb-12 text-center px-6">
        <h1 className="text-4xl md:text-6xl font-serif font-black text-zinc-900 dark:text-white mb-4 tracking-tight">
          Discover Creators
        </h1>
      </div>

      {/* SECTION 2 — SEARCH + FILTER */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex flex-col md:flex-row items-center gap-4 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-3xl border border-zinc-100 dark:border-white/5">
          
          {/* Search Bar */}
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search creators..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-800 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
            />
          </div>
          
          {/* Filters */}
          <div className="flex gap-3 w-full md:w-auto">
            {/* Culture Filter */}
            <select 
              value={selectedCulture}
              onChange={(e) => setSelectedCulture(e.target.value)}
              className="flex-1 md:w-40 px-4 py-3 bg-white dark:bg-zinc-800 rounded-2xl text-sm outline-none cursor-pointer"
            >
              <option value="">All Cultures</option>
              {cultures.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            {/* Category Filter */}
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 md:w-40 px-4 py-3 bg-white dark:bg-zinc-800 rounded-2xl text-sm outline-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 3 — CREATORS GRID */}
      <div className="max-w-7xl mx-auto px-6">
        {filteredCreators.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredCreators.map((creator, idx) => (
              <div key={creator._id} className="group relative flex flex-col bg-white dark:bg-[#111] rounded-[32px] overflow-hidden border border-zinc-100 dark:border-white/5 transition-all hover:shadow-2xl">
                {/* কার্ডের বাকি অংশ আপনার আগের কোডের মতোই থাকবে */}
                <div className="h-24 w-full bg-zinc-100 dark:bg-zinc-800 relative">
                  {idx < 4 && <span className="absolute top-4 right-4 z-10 bg-orange-500 text-white text-[8px] font-black uppercase px-2 py-1 rounded-full">Featured</span>}
                </div>
                <div className="px-6 -mt-10 relative z-10 flex flex-col items-center pb-6">
                   <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white dark:border-[#111] shadow-xl">
                      <Image 
                        src={creator.profile?.profileImage || "/default-avatar.png"} 
                        alt="profile" width={80} height={80} className="object-cover w-full h-full" 
                      />
                   </div>
                   <h3 className="font-serif font-black text-xl text-zinc-900 dark:text-white mt-4">
                     {creator.firstName} {creator.lastName}
                   </h3>
                   <p className="text-xs text-zinc-400 flex items-center gap-1 mt-1">
                     <MapPin size={12} className="text-orange-500" />
                     {creator.profile?.country || "Global"}
                   </p>
                   <Link href={`/profile/${creator._id}`} className="w-full bg-[#f27b13] text-white text-[10px] font-black uppercase py-4 rounded-2xl mt-6 text-center">
                      View Creator
                   </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-zinc-400 font-serif italic text-lg">No creators found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorsPage;