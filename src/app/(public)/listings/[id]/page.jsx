'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FiArrowLeft, FiExternalLink, FiUser } from 'react-icons/fi';
import { dummyProducts } from '@/data'; // আপনার ডাটা ফাইল থেকে ইম্পোর্ট করা
import Image from 'next/image';

const ListingDetails = () => {
  const params = useParams();
  const { id } = params;

  // URL-এর আইডি অনুযায়ী ডাটা খুঁজে বের করা হচ্ছে
  const product = dummyProducts.find((p) => p._id === id);

  // যদি ডাটা খুঁজে না পাওয়া যায়
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center dark:text-white">
        <h2 className="text-2xl font-bold mb-4">Product Not Found! (ID: {id})</h2>
        <Link href="/categories" className="px-6 py-2 bg-[#F57C00] text-white rounded-lg font-bold">
          Back to Categories
        </Link>
      </div>
    );
  }

  // Cultural Insights এর জন্য ডামি ডাটা
  const insights = [
    {
      category: "Traditions",
      region: "East Asia",
      title: "The Art of Japanese Kintsugi: Beauty in Imperfection",
      desc: "Discover how the ancient practice of repairing broken pottery with gold reflects a profound philosophy about embracing flaws and finding beauty in imperfection.",
      date: "Feb 15, 2026"
    },
    {
      category: "Textiles",
      region: "West Africa",
      title: "Weaving Stories: Kente Cloth and Ashanti Heritage",
      desc: "Each pattern in Kente cloth carries deep meaning — from proverbs to historical events. Explore the symbolic language woven into every thread.",
      date: "Feb 8, 2026"
    },
    {
      category: "Ceramics",
      region: "Latin America",
      title: "From Earth to Art: Oaxacan Black Clay Pottery",
      desc: "The Zapotec tradition of Barro Negro pottery dates back over 2,000 years. Learn about the artisans keeping this extraordinary craft alive.",
      date: "Jan 28, 2026"
    },
    {
      category: "Textiles",
      region: "South Asia",
      title: "Natural Dyes: India's Block Printing Renaissance",
      desc: "As sustainability gains momentum, Rajasthani block printing with natural dyes is experiencing a global revival. Meet the artisans leading the charge.",
      date: "Jan 15, 2026"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-24 pb-12 px-4 md:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Link */}
        <Link href="/categories" className="flex items-center gap-2 text-gray-400 hover:text-[#F57C00] mb-8 transition-all group">
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to discovery</span>
        </Link>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-24">
          
    
          {/* Left: Image Section */}
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#111] relative aspect-square">
            <Image
              src={product?.imageUrl} 
              alt={product.title}
              fill 
              unoptimized 
              priority 
              className="object-cover "
            />
          </div>

          {/* Right: Info Section */}
          <div className="flex flex-col">
            
            {/* Primary Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags?.map((tag, index) => (
                <span 
                  key={index} 
                  className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase ${
                    tag === 'Featured' 
                    ? 'bg-orange-100 text-orange-600' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {product.title}
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-10">
              {product.description}
            </p>

            {/* Creator Card */}
            <div className="bg-gray-50 dark:bg-[#0d0d0d] border border-gray-100 dark:border-gray-800 rounded-2xl p-6 mb-8 flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center text-[#F57C00]">
                <FiUser size={24} />
              </div>
              <div>
                <p className="text-[8px] text-gray-400 uppercase font-bold mb-0.5">Creator</p>
                <h4 className="font-bold text-gray-900 dark:text-white">{product.creatorName}</h4>
              </div>
            </div>

            {/* Secondary Tags */}
            <div className="flex flex-wrap gap-3 mb-10">
              {product.secondaryTags?.map((tag, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1.5 border border-gray-200 dark:border-gray-800 rounded-full text-sm text-gray-600 dark:text-gray-400 font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Button */}
            <button className="w-full py-3 bg-[#F57C00] hover:bg-[#E65100] text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20 active:scale-95">
              Visit Creator Site <FiExternalLink />
            </button>
          </div>
        </div>

        {/* --- Section End --- */}

      </div>
    </div>
  );
};

export default ListingDetails;