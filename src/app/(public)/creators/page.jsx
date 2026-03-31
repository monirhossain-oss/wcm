"use client";

import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, Search, MapPin, Globe, X } from 'lucide-react';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",
  withCredentials: true,
});

const CreatorsPage = () => {
  const [allCreators, setAllCreators] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCulture, setSelectedCulture] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const creatorRes = await api.get(`/api/users/top-creators-dropdown?t=${new Date().getTime()}`);
        const metaRes = await api.get('/api/listings/meta-data');

        if (creatorRes.data.success) {
          setAllCreators(creatorRes.data.data.top30 || []);
        }
        if (metaRes.data.categories) {
          setCategories(metaRes.data.categories);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCreators = useMemo(() => {
    return allCreators.filter((creator) => {
      const searchTerm = searchQuery.toLowerCase();
      const fullName = `${creator.firstName || ""} ${creator.lastName || ""}`.toLowerCase();
      const country = (creator.profile?.country || "").toLowerCase();
      const bio = (creator.profile?.bio || "").toLowerCase();

      const matchesSearch = fullName.includes(searchTerm) || country.includes(searchTerm) || bio.includes(searchTerm);
      const matchesCulture = selectedCulture === "" || creator.profile?.country === selectedCulture;
      
      const creatorCatId = creator.profile?.category?._id || creator.profile?.category;
      const matchesCategory = selectedCategory === "" || String(creatorCatId) === String(selectedCategory);

      return matchesSearch && matchesCulture && matchesCategory;
    });
  }, [allCreators, searchQuery, selectedCulture, selectedCategory]);

  const cultures = useMemo(() => {
    return Array.from(new Set(allCreators.map(c => c.profile?.country).filter(Boolean)));
  }, [allCreators]);

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-orange-500" size={40} />
      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Loading Creators...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] pb-20 pt-24 transition-colors duration-300">
      
      {/* HEADER */}
      <div className="text-center px-6 mb-12">
        <h2 className="text-3xl md:text-5xl font-serif font-black text-zinc-900 dark:text-white mb-4 tracking-tight">
          Discover Creators Around the World
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base max-w-2xl mx-auto font-medium">
          Explore creators inspired by cultures and traditions worldwide
        </p>
      </div>

      {/* SEARCH + FILTER */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex flex-col md:flex-row items-center gap-4 bg-zinc-50 dark:bg-zinc-900/40 p-4 rounded-[32px] border border-zinc-100 dark:border-white/5 shadow-sm">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search by name, country or bio..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-orange-500/20 text-zinc-900 dark:text-white transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-orange-500">
                <X size={16} />
              </button>
            )}
          </div>
   <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
  
  {/* Culture Dropdown */}
  <div className="relative flex-1 md:w-44">
    <select 
      value={selectedCulture} 
      onChange={(e) => setSelectedCulture(e.target.value)} 
      className="w-full px-5 py-4 bg-white dark:bg-black text-black dark:text-white border border-black/10 dark:border-white/20 rounded-2xl text-sm outline-none cursor-pointer focus:ring-2 focus:ring-orange-500/20 transition-all appearance-none shadow-sm"
    >
      <option value="" className="bg-white dark:bg-black text-black dark:text-white">
        All Cultures
      </option>
      {cultures.map((c) => (
        <option 
          key={c} 
          value={c} 
          className="bg-white dark:bg-black text-black dark:text-white"
        >
          {c}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black/40 dark:text-white/40">
      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
      </svg>
    </div>
  </div>

  {/* Category Dropdown */}
  <div className="relative flex-1 md:w-44">
    <select 
      value={selectedCategory} 
      onChange={(e) => setSelectedCategory(e.target.value)} 
      className="w-full px-5 py-4 bg-white dark:bg-black text-black dark:text-white border border-black/10 dark:border-white/20 rounded-2xl text-sm outline-none cursor-pointer focus:ring-2 focus:ring-orange-500/20 transition-all appearance-none shadow-sm"
    >
      <option value="" className="bg-white dark:bg-black text-black dark:text-white">
        All Categories
      </option>
      {categories.map((cat) => (
        <option 
          key={cat._id} 
          value={cat._id} 
          className="bg-white dark:bg-black text-black dark:text-white"
        >
          {cat.name}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black/40 dark:text-white/40">
      <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
      </svg>
    </div>
  </div>

</div>
        </div>
      </div>

      {/* CREATORS GRID */}
      <div className="max-w-7xl mx-auto px-6">
        {filteredCreators.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredCreators.map((creator) => (
              <div key={creator._id} className="group relative flex flex-col bg-white dark:bg-[#111] rounded-[35px] overflow-hidden border border-zinc-100 dark:border-white/5 transition-all hover:shadow-2xl hover:-translate-y-1 shadow-sm">
                
                {/* Banner Area */}
                <div className="h-24 w-full bg-zinc-100 dark:bg-zinc-900/50 relative">
                  {creator.role === 'premium' && ( 
                    <div className="absolute top-4 right-4 z-10 bg-orange-600 text-white text-[8px] font-black uppercase px-2.5 py-1.5 rounded-full shadow-lg">
                      ★ Featured
                    </div>
                  )}
                </div>

                {/* Profile Body */}
                <div className="px-6 -mt-10 relative z-10 flex flex-col items-center pb-8">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-4 border-white dark:border-[#111] shadow-xl bg-white transition-transform group-hover:scale-105">
                    <Image 
                      src={creator.profile?.profileImage || "/default-avatar.png"} 
                      alt="profile" width={80} height={80} className="object-cover w-full h-full" 
                    />
                  </div>

                  <h3 className="font-bold text-lg text-zinc-900 dark:text-white mt-4 text-center line-clamp-1">
                    {creator.firstName} {creator.lastName}
                  </h3>
                  
                  <p className="text-[10px] font-bold text-orange-500 flex items-center gap-1 mt-1 uppercase tracking-widest">
                    <MapPin size={10} fill="currentColor" /> 
                    {creator.profile?.country || "World"}
                  </p>

                  {/* Bio Text - এখানে dark:text-zinc-400  */}
                  <p className="text-zinc-600 dark:text-zinc-400 text-xs text-center mt-3 line-clamp-2 leading-relaxed h-8">
                    {creator.profile?.bio || "Crafting stories through traditional artistry and heritage techniques."}
                  </p>

                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    <span className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-zinc-200/50 dark:border-white/5">
                      {typeof creator.profile?.category === 'object' ? creator.profile?.category.name : 'Handmade'}
                    </span>
                    <span className="text-[9px] font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/50 px-3 py-1.5 rounded-lg border border-zinc-200/50 dark:border-white/5">
                      Handcrafted
                    </span>
                  </div>

                  <div className="grid grid-cols-1 w-full gap-2 mt-6">
                    <Link 
                      href={`/profile/${creator._id}`} 
                      className="w-full bg-[#F57C00] dark:bg-white text-white dark:text-black text-[10px] font-bold uppercase py-4 rounded-2xl text-center transition-all hover:bg-orange-600 dark:hover:bg-orange-500 dark:hover:text-white shadow-md"
                    >
                      View Creator
                    </Link>
                    
                    {creator.profile?.website && (
                      <a 
                        href={creator.profile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full bg-transparent text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase py-3 rounded-2xl text-center border border-zinc-200 dark:border-white/10 flex items-center justify-center gap-2 hover:bg-zinc-100 dark:hover:bg-white/5 transition-all"
                      >
                        <Globe size={12} /> Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/20 rounded-[40px] border-2 border-dashed border-zinc-100 dark:border-zinc-800">
              <p className="text-zinc-400 dark:text-zinc-500 text-sm font-medium">No creators found matching your search.</p>
              <button onClick={() => {setSearchQuery(""); setSelectedCulture(""); setSelectedCategory("");}} className="mt-4 text-orange-500 text-xs font-bold uppercase hover:underline">Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorsPage;