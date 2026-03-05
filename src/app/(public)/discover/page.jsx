'use client';
import React, { useState } from 'react';
import ListingCard from '@/components/ListingCard';
import { Search } from 'lucide-react';

const DiscoverPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Popularity'); // Default Sort

  const categoryContent = {
    All: { title: "Discover Culture", desc: "Immerse yourself in a global gallery of heritage." },
    Crafts: { title: "Master Crafts", desc: "Celebrate the soul of craftsmanship." },
    Clothing: { title: "Heritage Wear", desc: "Wear the story of a nation." },
    Art: { title: "Cultural Art", desc: "Beyond aesthetics, these are visual voices." },
    'Home Decor': { title: "Artisan Living", desc: "Transform your space into a sanctuary." },
    Accessories: { title: "Ethnic Accents", desc: "Small treasures with big histories." }
  };

  const categories = Object.keys(categoryContent);

  const dummyListings = [
    { _id: '1', title: 'Handmade Pottery', price: 45, category: 'Crafts', images: ['https://i.postimg.cc/3x9yPRpV/Pottery-craft-ceramics.jpg'], date: '2024-01-01' },
    { _id: '2', title: 'Traditional Scarf', price: 25, category: 'Clothing', images: ['https://i.postimg.cc/sD41hXnH/Chris-Fallon.jpg'], date: '2024-02-15' },
    { _id: '3', title: 'Wooden Totem', price: 120, category: 'Art', images: ['https://i.postimg.cc/Y0wq4KYF/essay-scruton-fakery-42-22804006.webp'], date: '2024-03-10' },
    { _id: '4', title: 'Ceramic Vase', price: 60, category: 'Home Decor', images: ['https://i.postimg.cc/QxhdhDXX/138016039-15563697440551n.jpg'], date: '2024-03-05' },
    { _id: '5', title: 'Oil Painting', price: 250, category: 'Art', images: ['https://i.postimg.cc/2ymrkdNw/kch-280226-ce-bagatan-p1.jpg'], date: '2024-03-20' },
    { _id: '6', title: 'Beaded Jewelry', price: 35, category: 'Accessories', images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908'], date: '2024-01-10' },
  ];

  // ফিল্টারিং এবং সর্টিং লজিক
  const processedListings = dummyListings
    .filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'Popularity') {
        return b.price - a.price; // Popularity হিসেবে দামিগুলো আগে দেখাচ্ছি
      } else {
        return b._id.localeCompare(a._id); // Newest হিসেবে লেটেস্ট আইডি আগে দেখাচ্ছি
      }
    });

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors">
      
      {/* Search Bar */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-gray-100 dark:bg-zinc-900 border-none rounded-full text-sm outline-none"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Categories & Sort Buttons Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeCategory === cat ? 'bg-[#1C2B4A] text-white shadow-md' : 'bg-gray-100 dark:bg-zinc-900 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Buttons (Popularity & Newest) */}
          <div className="flex items-center bg-gray-100 dark:bg-zinc-900 p-1 rounded-full w-fit">
            <button
              onClick={() => setSortBy('Popularity')}
              className={`px-6 py-2 rounded-full text-[11px] font-bold transition-all ${
                sortBy === 'Popularity' ? 'bg-white dark:bg-zinc-800 text-[#F57C00] shadow-sm' : 'text-gray-500'
              }`}
            >
              Popularity
            </button>
            <button
              onClick={() => setSortBy('Newest')}
              className={`px-6 py-2 rounded-full text-[11px] font-bold transition-all ${
                sortBy === 'Newest' ? 'bg-white dark:bg-zinc-800 text-[#F57C00] shadow-sm' : 'text-gray-500'
              }`}
            >
              Newest
            </button>
          </div>
        </div>

        {/* Hero Text */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-2xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">
            {categoryContent[activeCategory].title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            {categoryContent[activeCategory].desc}
          </p>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {processedListings.map((item) => (
            <ListingCard key={item._id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;