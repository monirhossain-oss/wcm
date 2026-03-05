'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const RegionPage = () => {
  const regions = [
    { id: 'japan', name: 'Japan', count: '120 Creators', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop' },
    { id: 'usa', name: 'USA', count: '85 Creators', image: 'https://i.postimg.cc/wvsvsVbR/istockphoto-1314505420-612x612.jpg' },
    { id: 'china', name: 'China', count: '110 Creators', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop' },
    { id: 'brazil', name: 'Brazil', count: '65 Creators', image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop' },
    { id: 'italy', name: 'Italy', count: '95 Creators', image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop' },
    { id: 'morocco', name: 'Morocco', count: '45 Creators', image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop' },
    { id: 'egypt', name: 'Egypt', count: '30 Creators', image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop' },
    { id: 'france', name: 'France', count: '80 Creators', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop' },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-black text-zinc-900 dark:text-white italic uppercase tracking-tighter mb-4">
          Explore By Region
        </h1>
        <p className="text-gray-500">Select a land to discover its heritage masterminds.</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {regions.map((region) => (
          <Link key={region.id} href={`/regions/${region.id}`}>
            <div className="relative h-[400px] rounded-3xl overflow-hidden cursor-pointer group bg-zinc-900 shadow-xl border border-zinc-100 dark:border-zinc-800">
              <Image
                src={region.image}
                alt={region.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
              <div className="absolute bottom-8 left-8 text-left">
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">{region.name}</h3>
                <p className="text-orange-500 text-xs font-bold uppercase tracking-widest">{region.count}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RegionPage;