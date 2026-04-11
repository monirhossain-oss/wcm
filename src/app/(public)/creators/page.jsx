"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, Search, MapPin, Globe, X, ChevronDown, Star, LayoutGrid, Check } from 'lucide-react';
import { getImageUrl } from '@/lib/imageHelper';

// ── Reusable Custom Dropdown ──
function CustomDropdown({ icon: Icon, placeholder, value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label || placeholder;
  const isActive = value !== '';

  return (
    <div ref={ref} className="relative md:w-52">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`
          w-full flex items-center gap-2.5 pl-4 pr-3 py-3.5
          border rounded-2xl text-sm transition-all outline-none
          ${isActive
            ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-400/50 dark:border-orange-500/40 text-orange-600 dark:text-orange-400'
            : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400'}
          ${open ? 'ring-2 ring-orange-500/30 border-orange-500/50' : ''}
        `}
      >
        {Icon && (
          <Icon
            size={14}
            className={isActive ? 'text-orange-500' : 'text-zinc-400'}
          />
        )}
        <span className={`flex-1 text-left truncate text-[13px] font-semibold ${isActive ? 'text-orange-600 dark:text-orange-400' : 'text-zinc-600 dark:text-zinc-300'}`}>
          {selectedLabel}
        </span>
        <ChevronDown
          size={14}
          className={`flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180 text-orange-500' : 'text-zinc-400'}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="
          absolute top-[calc(100%+8px)] left-0 z-50 w-full min-w-[200px]
          bg-white dark:bg-[#1a1a1a]
          border border-zinc-200 dark:border-white/10
          rounded-2xl shadow-xl overflow-hidden
          animate-in fade-in zoom-in-95 duration-150
        ">
          {/* All / reset option */}
          <button
            type="button"
            onClick={() => { onChange(''); setOpen(false); }}
            className={`
              w-full flex items-center justify-between px-4 py-3 text-[12px] font-bold uppercase tracking-wide transition-colors
              ${value === ''
                ? 'bg-orange-500 text-white'
                : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5'}
            `}
          >
            {placeholder}
            {value === '' && <Check size={12} className="text-white" />}
          </button>

          <div className="h-px bg-zinc-100 dark:bg-white/8" />

          {/* Options list */}
          <div className="max-h-56 overflow-y-auto">
            {options.filter(o => o.value !== '').map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`
                  w-full flex items-center justify-between px-4 py-2.5 text-[12px] font-semibold transition-colors
                  ${value === opt.value
                    ? 'bg-orange-500 text-white'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5'}
                `}
              >
                <span className="truncate">{opt.label}</span>
                {value === opt.value && <Check size={12} className="text-white flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
  console.log(allCreators)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const creatorRes = await api.get(`/api/users/top-creators-dropdown?t=${new Date().getTime()}`);
        const metaRes = await api.get('/api/listings/meta-data');

        if (creatorRes.data.success) {
          setAllCreators(creatorRes.data.data.top30 || []);
          // console.log(creatorRes.data.top30)
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

      const matchesSearch =
        fullName.includes(searchTerm) ||
        country.includes(searchTerm) ||
        bio.includes(searchTerm);

      const matchesCulture =
        selectedCulture === "" || creator.profile?.country === selectedCulture;

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

          {/* Culture + Category filters */}
          <div className="flex items-center justify-between gap-3">

            {/* Culture dropdown */}
            <CustomDropdown
              icon={Globe}
              placeholder="All Countries"
              value={selectedCulture}
              onChange={setSelectedCulture}
              options={[
                { value: '', label: 'All Countries' },
                ...cultures.map((c) => ({ value: c, label: c })),
              ]}
            />

            {/* Category dropdown */}
            <CustomDropdown
              icon={LayoutGrid}
              placeholder="All Categories"
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={[
                { value: '', label: 'All Categories' },
                ...categories.map((cat) => ({ value: cat._id, label: cat.name })),
              ]}
            />

          </div>

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


// ── Creator Card Component ──

function CreatorCard({ creator, index }) {
  const isFeatured = creator.campaign?.role === 'premium';

  const categoryName =
    typeof creator.profile?.category === 'object'
      ? creator.profile?.category?.name
      : null;

  const displayName =
    creator.profile?.displayName ||
    `${creator.firstName || ''} ${creator.lastName || ''}`.trim();

  const location = creator.profile?.city
    ? `${creator.profile.city}, ${creator.profile.country || ''}`
    : creator.profile?.country || 'World';

  return (
    <div
      className={`
        group relative flex flex-col rounded-[24px] overflow-hidden
        border transition-all duration-300 cursor-pointer
        hover:-translate-y-1 hover:shadow-2xl
        bg-white dark:bg-[#141414]
        ${isFeatured
          ? 'border-orange-500/30 dark:border-orange-500/20 shadow-md shadow-orange-500/5'
          : 'border-black/7 dark:border-white/6 shadow-sm'}
      `}
      style={{ animationDelay: `${index * 40}ms` }}
    >

      {/* ── Banner ── */}
      <div
        className={`relative h-20 overflow-hidden ${isFeatured
          ? 'bg-gradient-to-br from-[#7c2d12] to-[#c2410c]'
          : 'bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] dark:from-[#0a0a0a] dark:to-[#1a1a1a]'
          }`}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
            backgroundSize: '12px 12px',
          }}
        />

        {isFeatured && (
          <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-28 h-10 bg-orange-500/25 rounded-full blur-2xl" />
        )}

        {isFeatured && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-[8px] font-black uppercase tracking-[0.1em] px-2.5 py-1.5 rounded-full">
            <Star size={8} fill="#fbbf24" className="text-amber-400" />
            Featured
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div className="px-5 pb-5 flex flex-col items-center flex-1">

        {/* Avatar */}
        <div className="relative -mt-7 z-10">
          <div
            className={`w-16 h-16 rounded-[18px] overflow-hidden bg-zinc-100 dark:bg-zinc-800
              border-[3px] shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:rounded-2xl
              ${isFeatured
                ? 'border-orange-500/30 dark:border-orange-500/30 shadow-orange-500/15'
                : 'border-white dark:border-[#141414]'}
            `}
          >
            <Image
              src={getImageUrl(creator.profile?.profileImage, 'avatar') || '/default-avatar.png'}
              alt={displayName}
              width={64}
              height={64}
              className="object-cover w-full h-full"
            />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-[2.5px] border-white dark:border-[#141414]" />
        </div>

        {/* Name */}
        <h3 className="mt-3.5 font-black text-[15px] tracking-tight leading-tight text-center text-zinc-900 dark:text-white line-clamp-1">
          {displayName}
        </h3>

        {/* Username */}
        <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.12em] mt-0.5">
          @{creator.username || creator.firstName?.toLowerCase()}
        </p>

        {/* Location */}
        <p className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.08em] mt-1.5">
          <MapPin size={9} fill="currentColor" className="text-orange-500 flex-shrink-0" />
          {location}
        </p>

        {/* Bio */}
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 text-center leading-relaxed mt-3 line-clamp-2">
          {creator.profile?.bio ||
            'Crafting stories through traditional artistry and heritage techniques.'}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-3.5">
          {categoryName && (
            <span className="text-[9px] font-bold uppercase tracking-[0.06em] text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-black/6 dark:border-white/8">
              {categoryName}
            </span>
          )}
          <span className="text-[9px] font-bold uppercase tracking-[0.06em] text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-black/6 dark:border-white/8">
            Handcrafted
          </span>
          {creator.profile?.country && (
            <span className="text-[9px] font-bold uppercase tracking-[0.06em] text-orange-600/70 dark:text-orange-400/70 bg-orange-500/5 dark:bg-orange-500/8 px-2.5 py-1 rounded-lg border border-orange-500/15">
              {creator.profile.country}
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-black/6 dark:bg-white/6 my-4" />

        {/* Listing count */}
        {creator.listingCount !== undefined && (
          <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.08em] mb-3">
            {creator.listingCount} {creator.listingCount === 1 ? 'Listing' : 'Listings'}
          </p>
        )}

        {/* CTA Buttons */}
        <div className="w-full flex flex-col gap-2">
          <Link
            href={`/profile/${creator._id}`}
            className={`
              w-full text-[10px] font-black uppercase tracking-[0.12em] py-3.5 rounded-[14px] text-center
              transition-all duration-200 shadow-sm
              ${isFeatured
                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20 hover:shadow-orange-500/30'
                : 'bg-zinc-900 dark:bg-white hover:bg-orange-500 dark:hover:bg-orange-500 text-white dark:text-zinc-900 dark:hover:text-white shadow-black/10'}
            `}
          >
            View Creator
          </Link>

          {creator.profile?.website && (
            <a
              href={
                creator.profile.website.startsWith('http')
                  ? creator.profile.website
                  : `https://${creator.profile.website}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 bg-transparent text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-[0.1em] py-3 rounded-[14px] border border-black/8 dark:border-white/8 hover:bg-zinc-50 dark:hover:bg-white/5 hover:text-zinc-700 dark:hover:text-zinc-300 hover:border-black/15 dark:hover:border-white/15 transition-all duration-200"
            >
              <Globe size={11} /> Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
