'use client';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaUtensils, FaChevronDown, FaGlobe, FaTheaterMasks } from 'react-icons/fa';

export default function HeroSection() {
  const images = [
    'https://i.ibb.co.com/6RXQcNcM/15-4-11zon-min-2048x1365-1-1170x550.webp',
    'https://i.ibb.co.com/ycFMBh0N/photo-1589463349208-95817c91f971.avif',
    'https://i.ibb.co.com/JRMkRJqG/abstract-silhouettes-front-view-geometric-260nw-2496928155.webp',
  ];

  const [currentImage, setCurrentImage] = useState(0);
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();
  
  // Role checking based on your context logic
  const isCreator = user?.role === 'creator';
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [mounted, images.length]);

  if (!mounted) return null;

  return (
    <section className="relative overflow-hidden min-h-[750px] flex items-center transition-colors duration-500">
      {/* Background Slider */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out -z-10 ${
            index === currentImage ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/30 to-black/80 dark:from-transparent dark:via-black/50 dark:to-black/95 transition-all duration-500" />
        </div>
      ))}

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-12 flex flex-col items-center text-center w-full">
        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-2xl leading-tight">
          Discover <br /> culture <span className="text-[#F57C00]">worldwide</span>
        </h1>

        {/* Subheading */}
        <p className="mt-6 max-w-2xl text-lg md:text-xl text-gray-100 font-medium drop-shadow-md">
          Explore authentic products, stories, and experiences from creators around the world —
          crafted with culture, passion, and purpose.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/products">
            <button className="px-8 py-3 cursor-pointer rounded-lg bg-[#F57C00] text-white font-bold hover:scale-105 transition-all shadow-xl active:scale-95">
              Explore Products
            </button>
          </Link>

          {isCreator || isAdmin ? (
            <button
              disabled
              className="px-8 py-3 rounded-lg bg-gray-400/50 text-white cursor-not-allowed backdrop-blur-sm"
            >
              {isAdmin ? 'Admin Access Active' : 'Creator Mode Active'}
            </button>
          ) : (
            <Link href={user ? `/become-creator` : `/auth/login`}>
              <button className="px-8 py-3 border border-white/30 text-white bg-white/10 backdrop-blur-md rounded-lg cursor-pointer hover:bg-white/20 transition-all">
                Become a Creator
              </button>
            </Link>
          )}
        </div>

        {/* Filters - Updated with bg-white/20 per your instruction */}
        <div className="max-w-4xl w-full mx-auto mt-20 py-4 flex flex-col md:flex-row gap-4">
          {[
            { icon: <FaUtensils />, label: 'Category', options: ['Food', 'Art', 'Music'] },
            { icon: <FaGlobe />, label: 'Region', options: ['Asia', 'Europe', 'Africa'] },
            { icon: <FaTheaterMasks />, label: 'Cultural', options: ['Traditional', 'Modern', 'Fusion'] },
          ].map((filter, i) => (
            <div key={i} className="relative w-full md:w-1/3">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 z-10">
                {filter.icon}
              </span>
              <select className="w-full bg-white/20 backdrop-blur-xl px-12 py-4 rounded-full text-white appearance-none border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#F57C00] transition-all cursor-pointer font-medium">
                <option value="" className="bg-gray-900">{filter.label}</option>
                {filter.options.map(opt => (
                  <option key={opt} value={opt.toLowerCase()} className="bg-gray-900">{opt}</option>
                ))}
              </select>
              <FaChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 z-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}