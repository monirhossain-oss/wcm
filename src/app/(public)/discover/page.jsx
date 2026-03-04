'use client';
import React, { useState } from 'react';
import ListingCard from '@/components/ListingCard';
import { Search, Filter, X, ChevronDown, Check } from 'lucide-react';

const DiscoverPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState('Recommended');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const categories = ['All', 'Crafts', 'Clothing', 'Art', 'Home Decor', 'Accessories'];
  const sortOptions = ['Recommended', 'Curated', 'Most Appreciated', 'Most Viewed', 'Most Discussed', 'Most Recent'];

  // ১. ৮টি কার্ডের জন্য ডামি ডাটা (বাস্তব প্রোজেক্টে এটি API থেকে আসবে)
  const dummyListings = [
    { _id: '1', title: 'Handmade Pottery', price: 45, category: 'Crafts', images: ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261'] },
    { _id: '2', title: 'Traditional Scarf', price: 25, category: 'Clothing', images: ['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9'] },
    { _id: '3', title: 'Wooden Totem', price: 120, category: 'Art', images: ['https://i.postimg.cc/mD978m8S/Ancient-Cedar-Totem.jpg'] },
    { _id: '4', title: 'Ceramic Vase', price: 60, category: 'Home Decor', images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61'] },
    { _id: '5', title: 'Oil Painting', price: 250, category: 'Art', images: ['https://i.postimg.cc/k4nM8YqR/Acrylic-Painting-Techniques-768x512.jpg'] },
    { _id: '6', title: 'Beaded Jewelry', price: 35, category: 'Accessories', images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908'] },
    { _id: '7', title: 'Cultural Mask', price: 85, category: 'Art', images: ['https://images.unsplash.com/photo-1503177119275-0aa32b3a9368'] },
    { _id: '8', title: 'Woven Basket', price: 30, category: 'Crafts', images: ['https://images.unsplash.com/photo-1596436889106-be35e843f974'] },
  ];

  // ২. ফিল্টারিং লজিক (Active Button ক্লিকে কাজ করবে)
  const filteredListings = dummyListings.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors">
      
      {/* Search & Sort Bar */}
      <div className="sticky top-0 z-30 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-2.5 bg-gray-100 dark:bg-zinc-900 border-none rounded-full text-sm outline-none"
            />
          </div>

          <div className="relative">
            <button onClick={() => setIsSortOpen(!isSortOpen)} className="flex items-center gap-2 text-sm font-bold">
              <span className="text-gray-400 font-normal">Sort by:</span> {activeSort}
              <ChevronDown size={16} />
            </button>
            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 border rounded-xl shadow-xl z-50">
                {sortOptions.map((opt) => (
                  <button key={opt} onClick={() => { setActiveSort(opt); setIsSortOpen(false); }} className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-zinc-800 text-sm">
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* ৩. Category Filter (Active Buttons) */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-lg text-[11px] font-bold uppercase transition-all ${
                activeCategory === cat
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md'
                  : 'bg-gray-50 dark:bg-zinc-900 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ৪. Listings Grid (এখন ৮টি কার্ড সাপোর্ট করবে) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredListings.length > 0 ? (
            filteredListings.map((item) => (
              <ListingCard key={item._id} item={item} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-400 italic font-serif">
              No results found in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;