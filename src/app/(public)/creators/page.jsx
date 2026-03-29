"use client";

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, Search, MapPin, X } from 'lucide-react';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",
  withCredentials: true,
});

const CreatorsPage = () => {
  const [allCreators, setAllCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  // ফিল্টারিং স্টেট
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCulture, setSelectedCulture] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setLoading(true);
        // ডাটা যাতে ক্যাশ না হয় সেজন্য টাইমস্ট্যাম্প যোগ করা হয়েছে
        const res = await api.get(`/api/users/top-creators-dropdown?t=${new Date().getTime()}`);
        if (res.data.success) {
          const creatorData = res.data.data.top30 || [];
          setAllCreators(creatorData);
          console.log("Total Creators Received:", creatorData.length);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCreators();
  }, []);

  // ক্যাটাগরি অবজেক্ট থেকে নাম বের করার ফাংশন
  const getCategoryName = (category) => {
    if (!category) return "";
    return typeof category === 'object' ? (category.name || category.title) : category;
  };

  // অ্যাডভান্সড ফিল্টারিং লজিক (নাম, দেশ এবং ক্যাটাগরি সার্চ করবে)
  const filteredCreators = useMemo(() => {
    return allCreators.filter((creator) => {
      const searchTerm = searchQuery.toLowerCase();
      
      const firstName = (creator.firstName || "").toLowerCase();
      const lastName = (creator.lastName || "").toLowerCase();
      const fullName = `${firstName} ${lastName}`;
      const country = (creator.profile?.country || "").toLowerCase();
      const category = getCategoryName(creator.profile?.category).toLowerCase();

      // ১. গ্লোবাল সার্চ (বক্সে Albania লিখলে দেশে Albania থাকলে মিলবে)
      const matchesSearch = 
        fullName.includes(searchTerm) || 
        country.includes(searchTerm) || 
        category.includes(searchTerm);
      
      // ২. ড্রপডাউন ফিল্টার
      const matchesCulture = selectedCulture === "" || creator.profile?.country === selectedCulture;
      const matchesCategory = selectedCategory === "" || getCategoryName(creator.profile?.category) === selectedCategory;

      return matchesSearch && matchesCulture && matchesCategory;
    });
  }, [allCreators, searchQuery, selectedCulture, selectedCategory]);

  // ইউনিক অপশন তৈরি
  const cultures = useMemo(() => {
    return Array.from(new Set(allCreators.map(c => c.profile?.country).filter(Boolean)));
  }, [allCreators]);

  const categories = useMemo(() => {
    return Array.from(new Set(allCreators.map(c => getCategoryName(c.profile?.category)).filter(Boolean)));
  }, [allCreators]);

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
      
      {/* HEADER */}
      <div className="pt-20 pb-12 text-center px-6">
        <h2 className="text-3xl md:text-5xl font-serif font-black text-zinc-900 dark:text-white mb-4 tracking-tight">
          Discover Creators
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">Find creators by name, country, or culture</p>
      </div>

      {/* SEARCH + FILTER SECTION */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex flex-col md:flex-row items-center gap-4 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-[32px] border border-zinc-100 dark:border-white/5 shadow-sm">
          
          {/* Search Input (এটি এখন নাম ও দেশের নাম দুইটাই সার্চ করবে) */}
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search (e.g. Albania, Textile, or Name)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-white dark:bg-zinc-800 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-orange-500"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <div className="flex gap-3 w-full md:w-auto">
            {/* Culture Select */}
            <select 
              value={selectedCulture}
              onChange={(e) => setSelectedCulture(e.target.value)}
              className="flex-1 md:w-44 px-5 py-4 bg-white dark:bg-zinc-800 rounded-2xl text-sm outline-none cursor-pointer border-none focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="">All Cultures</option>
              {cultures.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            {/* Category Select */}
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 md:w-44 px-5 py-4 bg-white dark:bg-zinc-800 rounded-2xl text-sm outline-none cursor-pointer border-none focus:ring-2 focus:ring-orange-500/20"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* CREATORS GRID */}
      <div className="max-w-7xl mx-auto px-6">
        {filteredCreators.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredCreators.map((creator, idx) => {
              const categoryName = getCategoryName(creator.profile?.category);
              
              return (
                <div key={creator._id} className="group relative flex flex-col bg-white dark:bg-[#111] rounded-[35px] overflow-hidden border border-zinc-100 dark:border-white/5 transition-all hover:shadow-2xl">
                  {/* Card Cover */}
                  <div className="h-24 w-full bg-zinc-100 dark:bg-zinc-800 relative">
                    {idx < 4 && (
                      <span className="absolute top-4 right-4 z-10 bg-orange-500 text-white text-[8px] font-black uppercase px-2 py-1 rounded-full tracking-widest">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Profile Info */}
                  <div className="px-6 -mt-10 relative z-10 flex flex-col items-center pb-8">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white dark:border-[#111] shadow-2xl bg-zinc-200">
                      <Image 
                        src={creator.profile?.profileImage || "/default-avatar.png"} 
                        alt="profile" width={80} height={80} className="object-cover w-full h-full" 
                      />
                    </div>

                    <h3 className="font-serif font-black text-xl text-zinc-900 dark:text-white mt-4 text-center line-clamp-1">
                      {creator.firstName} {creator.lastName}
                    </h3>

                    <div className="flex flex-col items-center gap-1 mt-2">
                      <p className="text-[10px] font-bold text-zinc-400 flex items-center gap-1 uppercase tracking-widest">
                        <MapPin size={10} className="text-orange-500" />
                        {creator.profile?.country || "Global"}
                      </p>
                      
                      {/* ক্যাটাগরি এবং আইডি হ্যান্ডেলিং */}
                      <span className="text-[10px] text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full mt-2">
                        {categoryName || "General"}
                      </span>
                    </div>

                    <Link href={`/profile/${creator._id}`} className="w-full bg-[#f27b13] hover:bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest py-4 rounded-2xl mt-6 text-center transition-colors shadow-lg shadow-orange-500/10">
                      View Profile
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 bg-zinc-50 dark:bg-zinc-900/20 rounded-[40px] border-2 border-dashed border-zinc-100 dark:border-zinc-800">
            <p className="text-zinc-400 font-serif italic text-lg">No results for "{searchQuery}"</p>
            <button 
              onClick={() => {setSearchQuery(""); setSelectedCulture(""); setSelectedCategory("");}}
              className="text-orange-500 text-sm font-bold uppercase mt-4 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorsPage;