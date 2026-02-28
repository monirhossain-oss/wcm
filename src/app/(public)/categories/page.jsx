'use client';

import React, { useState } from 'react';

const CategoriesPage = () => {
  // ডামি ডেটা
  const dummyProducts = [
    {
      _id: '1',
      title: 'Handwoven Kente Cloth',
      creatorName: 'Kwame Asante',
      category: 'Textiles',
      region: 'West Africa',
      culture: 'Ashanti',
      imageUrl: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?q=80&w=1000&auto=format&fit=crop',
      isFeatured: true,
    },
    {
      _id: '2',
      title: 'Wabi-Sabi Tea Bowl',
      creatorName: 'Yuki Tanaka',
      category: 'Ceramics',
      region: 'East Asia',
      culture: 'Japanese',
      imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=1000&auto=format&fit=crop',
      isPromoted: true,
    },
    {
      _id: '3',
      title: 'Oaxacan Barro Negro Vase',
      creatorName: 'María López',
      category: 'Ceramics',
      region: 'Latin America',
      culture: 'Zapotec',
      imageUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=1000&auto=format&fit=crop',
      isPromoted: true,
    },
    {
      _id: '4',
      title: 'Embossed Leather Satchel',
      creatorName: 'Hassan El Fassi',
      category: 'Accessories',
      region: 'North Africa',
      culture: 'Moroccan',
      imageUrl: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=1000&auto=format&fit=crop',
    },
    // আরও ৪টি ডামি ডেটা যোগ করা হলো যাতে ২ সারি পূর্ণ হয়
    { _id: '5', title: 'Tribal Mask', creatorName: 'Amara Oke', category: 'Art & Sculpture', region: 'Central Africa', culture: 'Zulu', imageUrl: 'https://i.postimg.cc/DyjCv5Fn/pngtree-ornate-african-tribal-mask-with-geometric-patterns-isolated-on-white-png-image-21224545.png' },
    { _id: '6', title: 'Silk Saree', creatorName: 'Priya Das', category: 'Textiles', region: 'South Asia', culture: 'Bengali', imageUrl: 'https://i.postimg.cc/BbDqStPq/Mysore-Silk-sarees.jpg' },
    { _id: '7', title: 'Copper Pitcher', creatorName: 'Ali Khan', category: 'Home Decor', region: 'Middle East', culture: 'Persian', imageUrl: 'https://i.postimg.cc/LsnF4hr5/il-570x-N-2324261866-opy3.webp' },
    { _id: '8', title: 'Jade Pendant', creatorName: 'Li Wei', category: 'Jewelry', region: 'East Asia', culture: 'Han', imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop' },
  ];

  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Textiles', 'Ceramics', 'Accessories', 'Home Decor', 'Art & Sculpture', 'Jewelry', 'Fashion'];

  const filteredProducts = activeCategory === 'All' 
    ? dummyProducts 
    : dummyProducts.filter(p => p.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 mt-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">Categories</h1>
        <p className="text-gray-500 dark:text-gray-400">Browse cultural creations by category and region.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                activeCategory === cat 
                ? 'bg-[#F57C00] text-white shadow-lg' 
                : 'bg-gray-100 dark:bg-[#1a1a1a] text-gray-600 dark:text-gray-400 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <select className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1f1f1f] rounded-lg px-3 py-2 text-sm outline-none">
          <option>All Regions</option>
          <option>West Africa</option>
          <option>East Asia</option>
        </select>
      </div>

      {/* Grid: মোবাইল এ ২ কলাম (grid-cols-2), বড় স্ক্রিনে ৪ কলাম (lg:grid-cols-4) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
        {filteredProducts.map((item) => (
          <div key={item._id} className="group flex flex-col">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-[#1a1a1a] mb-3">
              {item.isFeatured && (
                <span className="absolute top-2 left-2 md:top-4 md:left-4 z-10 bg-[#F57C00] text-white text-[8px] md:text-[10px] font-bold uppercase px-2 py-1 rounded">
                  Featured
                </span>
              )}
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            <h3 className="text-sm md:text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
              {item.title}
            </h3>
            <p className="text-xs md:text-sm text-gray-500 mb-2">
              {item.creatorName}
            </p>

            <div className="flex gap-1 md:gap-2">
              <span className="bg-gray-100 dark:bg-[#1f1f1f] text-gray-600 dark:text-gray-400 text-[8px] md:text-[10px] px-2 py-1 rounded font-bold uppercase">
                {item.culture}
              </span>
              <span className="bg-gray-100 dark:bg-[#1f1f1f] text-gray-600 dark:text-gray-400 text-[8px] md:text-[10px] px-2 py-1 rounded font-bold uppercase">
                {item.region}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;