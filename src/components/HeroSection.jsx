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
  const isCreator = user?.role === 'creator';
  const isAdmin = user?.role === 'admin';
  console.log(user?.role);

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
    <section className="relative overflow-hidden min-h-187.5 flex items-center transition-colors duration-500">
      {/* Background Slider */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out -z-10 ${index === currentImage ? 'opacity-100' : 'opacity-0'}`}
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Gradient Overlay - Fixed for Hydration Error */}
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-black/70 dark:from-transparent dark:via-black/40 dark:to-black/90 transition-all duration-500" />
        </div>
      ))}

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-12 flex flex-col items-center text-center w-full">
        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg leading-tight">
          Discover <br /> culture <span className="text-[#F57C00]">worldwide</span>
        </h1>

        {/* Subheading */}
        <p className="mt-6 max-w-2xl text-lg md:text-xl text-gray-100 font-medium drop-shadow-md">
          Explore authentic products, stories, and experiences from creators around the world —
          crafted with culture, passion, and purpose.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex py-4 sm:flex-row gap-4">
          <Link href="/products">
            <button className="px-8 py-3 cursor-pointer rounded-lg bg-[#F57C00] text-white font-bold hover:scale-105 transition-all shadow-xl">
              Explore Products
            </button>
          </Link>

          {isCreator || isAdmin ? (
            <button
              disabled
              className="px-8 py-3 rounded-lg bg-gray-300 text-gray-500 cursor-not-allowed"
            >
              {isAdmin ? 'Admin Access Active' : 'Creator Mode Active'}
            </button>
          ) : (
            <Link href={user ? `/become-creator` : `/auth/login`}>
              <button className="px-8 py-3 border border-[#7A1E1E] text-[#7A1E1E] bg-white rounded-lg cursor-pointer">
                Become a Creator
              </button>
            </Link>
          )}
        </div>

        {/* Filters / Selects */}
        <div className="max-w-4xl w-full mx-auto mt-20 py-4 flex flex-col md:flex-row gap-4">
          {/* Category */}
          <div className="relative w-full md:w-1/3">
            <FaUtensils className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 z-10" />
            <select className="w-full bg-black/40 dark:bg-black/60 backdrop-blur-xl px-12 py-4 rounded-full text-white appearance-none border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#F57C00] transition-all cursor-pointer shadow-2xl font-medium">
              <option value="" className="bg-gray-900">
                Category
              </option>
              <option value="food" className="bg-gray-900">
                Food
              </option>
              <option value="art" className="bg-gray-900">
                Art
              </option>
              <option value="music" className="bg-gray-900">
                Music
              </option>
            </select>
            <FaChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 z-10" />
          </div>

          {/* Region */}
          <div className="relative w-full md:w-1/3">
            <FaGlobe className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 z-10" />
            <select className="w-full bg-black/40 dark:bg-black/60 backdrop-blur-xl px-12 py-4 rounded-full text-white appearance-none border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#F57C00] transition-all cursor-pointer shadow-2xl font-medium">
              <option value="" className="bg-gray-900">
                Region
              </option>
              <option value="asia" className="bg-gray-900">
                Asia
              </option>
              <option value="europe" className="bg-gray-900">
                Europe
              </option>
              <option value="africa" className="bg-gray-900">
                Africa
              </option>
            </select>
            <FaChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 z-10" />
          </div>

          {/* Cultural */}
          <div className="relative w-full md:w-1/3">
            <FaTheaterMasks className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 z-10" />
            <select className="w-full bg-black/40 dark:bg-black/60 backdrop-blur-xl px-12 py-4 rounded-full text-white appearance-none border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#F57C00] transition-all cursor-pointer shadow-2xl font-medium">
              <option value="" className="bg-gray-900">
                Cultural
              </option>
              <option value="traditional" className="bg-gray-900">
                Traditional
              </option>
              <option value="modern" className="bg-gray-900">
                Modern
              </option>
              <option value="fusion" className="bg-gray-900">
                Fusion
              </option>
            </select>
            <FaChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300 z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
