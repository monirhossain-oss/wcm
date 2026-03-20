"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, Users, Sparkles, Globe, ChevronDown, ChevronRight } from 'lucide-react';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000",
  withCredentials: true,
});

const CreatorsPage = () => {
  const [top30, setTop30] = useState([]);
  const [allCreators, setAllCreators] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/users/top-creators-dropdown');
        if (res.data.success) {
          const t30 = res.data.data.top30 || [];
          const dList = res.data.data.dropdownList || [];
          setTop30(t30);
          setAllCreators([...t30, ...dList]);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCreators();
  }, []);

  const handleSelectCreator = (e) => {
    const userId = e.target.value;
    if (userId) {
      window.location.href = `/profile/${userId}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-orange-500" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Loading Network...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors pb-20">
      
      {/* --- Sticky Header --- */}
      <div className="sticky top-20 z-[100] bg-white/90 dark:bg-[#0a0a0a]/90 border-b border-zinc-100 dark:border-white/5 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80 group">
              <Users size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 z-10 pointer-events-none" />
              <select
                onChange={handleSelectCreator}
                className="w-full pl-12 pr-10 py-3 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-xl text-[11px] font-bold uppercase outline-none cursor-pointer text-zinc-700 dark:text-zinc-200 appearance-none transition-all"
                defaultValue=""
              >
                <option value="" disabled>Search Artisan Node...</option>
                {allCreators.map((c) => (
                  <option key={c._id} value={c._id} className="dark:bg-[#0a0a0a]">
                    {c.fullName || `${c.firstName} ${c.lastName}`}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12 space-y-2">
          <div className="flex items-center gap-2 text-orange-500">
            <Sparkles size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Premium Node</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Our Top 30 Creators</h1>
        </div>

        {/* --- Creators Grid (Updated Card Design) --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {top30.map((creator) => (
            <div key={creator._id} className="bg-white dark:bg-[#111] border border-zinc-100 dark:border-white/5 rounded-3xl p-6 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow">
              
              {/* Profile Image - Circle inside Box */}
              <div className="relative w-28 h-28 mb-6">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-zinc-50 dark:border-white/5">
                   <Image
                    src={creator.profile?.profileImage || "/default-avatar.png"}
                    alt={creator.username}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
              </div>

              {/* Creator Info */}
              <div className="text-center space-y-1 mb-6">
                <h3 className="font-bold text-xl text-zinc-900 dark:text-white">
                  {creator.firstName} {creator.lastName}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {creator.profile?.city || "Unknown City"}, {creator.profile?.country || "Global"}
                </p>
                <p className="text-zinc-400 text-sm font-medium">
                  {creator.approvedListingsCount || 0} Listings
                </p>
              </div>

              {/* View Profile Button */}
              <Link 
                href={`/profile/${creator._id}`}
                className="w-full bg-[#FF8A00] hover:bg-[#e67c00] text-white font-bold py-3 px-6 rounded-2xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatorsPage;