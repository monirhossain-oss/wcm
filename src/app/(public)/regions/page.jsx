'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const RegionPage = () => {
  
  const initialRegions = [
    { id: 1, name: 'Japan', artifacts: '120 Creators', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop' },
    { id: 2, name: 'USA', artifacts: '85 Creators', image: 'https://i.postimg.cc/wvsvsVbR/istockphoto-1314505420-612x612.jpg' },
    { id: 8, name: 'China', artifacts: '110 Creators', image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop' },
    { id: 7, name: 'Brazil', artifacts: '65 Creators', image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop' },
  ];

  
  // const scrollRegions = [
  //   { id: 4, name: 'Morocco', artifacts: '52 Creators', image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop' },
  //   { id: 5, name: 'Italy', artifacts: '75 Creators', image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop' },
  //   { id: 6, name: 'Egypt', artifacts: '40 Creators', image: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop' },
  //   { id: 7, name: 'Brazil', artifacts: '65 Creators', image: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop' },
    
  // ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto text-center">
        
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 dark:text-white mb-4">
            Explore by Region
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Trace the origins of culture across the globe.
          </p>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {initialRegions.map((region) => (
            <RegionCard key={region.id} region={region} />
          ))}
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* {scrollRegions.map((region, index) => (
            <motion.div
              key={region.id}
              initial={{ opacity: 0, y: 50 }} /
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: (index % 4) * 0.1 }} 
            >
              <RegionCard region={region} />
            </motion.div>
          ))} */}
        </div>

        <div className="mt-20">
          <Link href="/regions/all">
            <button className="px-8 py-3 border border-gray-200 dark:border-gray-800 rounded-full text-gray-600 dark:text-gray-400 hover:bg-[#F57C00] hover:text-white transition-all duration-300">
              View All Regions
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};


const RegionCard = ({ region }) => (
  <Link 
    href={`/regions/${region.name.toLowerCase()}`} 
    className="group relative h-[380px] rounded-2xl overflow-hidden cursor-pointer shadow-lg block"
  >
    <Image
      src={region.image}
      alt={region.name}
      fill
      className="object-cover transition-transform duration-700 group-hover:scale-110"
      unoptimized
    />
    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all duration-500" />
    <div className="absolute bottom-8 left-6 text-left transition-transform duration-500 group-hover:-translate-y-2">
      <h3 className="text-2xl font-bold text-white mb-1">{region.name}</h3>
      <p className="text-gray-200 text-xs opacity-90">{region.artifacts}</p>
    </div>
  </Link>
);

export default RegionPage;