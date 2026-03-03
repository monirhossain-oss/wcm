'use client';
import React, { useState } from 'react';
import ListingCard from '@/components/ListingCard';

const ListingPage = () => {

  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Crafts', 'Clothing', 'Art', 'Home Decor', 'Accessories'];

 
  const dummyListings = [
    { _id: '1', title: 'Handmade Pottery', price: 45, category: 'Crafts', images: ['https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261'] },
    { _id: '2', title: 'Traditional Scarf', price: 25, category: 'Clothing', images: ['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9'] },
    { _id: '3', title: 'Wooden Totem', price: 120, category: 'Art', images: ['https://i.postimg.cc/mD978m8S/Ancient-Cedar-Totem.jpg'] },
    { _id: '4', title: 'Ceramic Vase', price: 60, category: 'Home Decor', images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61'] },
    { _id: '5', title: 'Oil Painting', price: 250, category: 'Art', images: ['https://i.postimg.cc/k4nM8YqR/Acrylic-Painting-Techniques-768x512.jpg'] },
    { _id: '6', title: 'Beaded Jewelry', price: 35, category: 'Accessories', images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908'] },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Header Section */}
        <div className="mb-10 text-left">
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white mb-2 uppercase tracking-tighter">
            Featured <span className="text-[#F57C00]">Listings</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">
            Explore our handpicked cultural treasures from master creators.
          </p>
        </div>

        {/* ৩. Category Filter (Active Button) */}
        <div className="flex items-center gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 border ${
                activeCategory === cat
                  ? 'bg-[#F57C00] border-[#F57C00] text-white shadow-lg shadow-orange-500/20'
                  : 'bg-transparent border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-[#F57C00]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid*/}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-8 gap-y-12">
          {dummyListings.map((item) => (
            <div key={item._id}>
              <ListingCard item={item} />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ListingPage;