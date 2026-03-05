'use client';
import React, { useState } from 'react';
import ListingCard from '@/components/ListingCard';
import { Search, Filter, ChevronDown, Check, Plus } from 'lucide-react';

const DiscoverPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState('Recommended');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const categoryContent = {
    All: { 
      title: "Discover Culture", 
      desc: "Immerse yourself in a global gallery of heritage. From the intricate threads of ancient weaving to the bold strokes of contemporary tribal art, explore handpicked treasures that define the lived experiences of humanity." 
    },
    Crafts: { 
      title: "Master Crafts", 
      desc: "Celebrate the soul of craftsmanship. Our collection features master artisans who preserve age-old techniques, creating unique pottery, wood carvings, and hand-woven artifacts that stand as a testament to cultural resilience." 
    },
    Clothing: { 
      title: "Heritage Wear", 
      desc: "Wear the story of a nation. Discover traditional silhouettes and ethnic textiles that blend historical patterns with modern elegance, ensuring that the art of indigenous fashion continues to inspire future generations." 
    },
    Art: { 
      title: "Cultural Art", 
      desc: "Beyond aesthetics, these are the visual voices of our ancestors. Explore a curated selection of ritual masks, oil paintings, and sculptures that capture the spiritual and social essence of diverse communities worldwide." 
    },
    'Home Decor': { 
      title: "Artisan Living", 
      desc: "Transform your space into a sanctuary of stories. From hand-painted ceramic vases to ethically sourced tapestries, each piece brings the warmth and authenticity of global heritage directly into your modern home." 
    },
    Accessories: { 
      title: "Ethnic Accents", 
      desc: "Discover small treasures with big histories. Our jewelry and accessory collection highlights the intricate beadwork and metal-smithing traditions that have been passed down through centuries of artisan families." 
    }
  };

  const categories = Object.keys(categoryContent);
  const sortOptions = ['Recommended', 'Curated', 'Most Appreciated', 'Most Recent'];

  const dummyListings = [
    { _id: '1', title: 'Handmade Pottery', price: 45, category: 'Crafts', images: ['https://i.postimg.cc/3x9yPRpV/Pottery-craft-ceramics.jpg'] },
    { _id: '2', title: 'Traditional Scarf', price: 25, category: 'Clothing', images: ['https://i.postimg.cc/sD41hXnH/Chris-Fallon.jpg'] },
    { _id: '3', title: 'Wooden Totem', price: 120, category: 'Art', images: ['https://i.postimg.cc/Y0wq4KYF/essay-scruton-fakery-42-22804006.webp'] },
    { _id: '4', title: 'Ceramic Vase', price: 60, category: 'Home Decor', images: ['https://i.postimg.cc/QxhdhDXX/138016039-15563697440551n.jpg'] },
    { _id: '5', title: 'Oil Painting', price: 250, category: 'Art', images: ['https://i.postimg.cc/2ymrkdNw/kch-280226-ce-bagatan-p1.jpg'] },
    { _id: '6', title: 'Beaded Jewelry', price: 35, category: 'Accessories', images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908'] },
    { _id: '7', title: 'Cultural Mask', price: 85, category: 'Art', images: ['https://images.unsplash.com/photo-1503177119275-0aa32b3a9368'] },
    { _id: '8', title: 'Woven Basket', price: 30, category: 'Crafts', images: ['https://images.unsplash.com/photo-1596436889106-be35e843f974'] },
  ];

  const filteredListings = dummyListings.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors">
      
      {/* Sticky Search & Sort Bar */}
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
          <div className="relative">
            <button onClick={() => setIsSortOpen(!isSortOpen)} className="flex items-center gap-2 text-sm font-bold">
              <span className="text-gray-400 font-normal">Sort:</span> {activeSort}
              <ChevronDown size={14} />
            </button>
            {isSortOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border rounded-xl shadow-xl z-50 py-2">
                {sortOptions.map((opt) => (
                  <button key={opt} onClick={() => { setActiveSort(opt); setIsSortOpen(false); }} className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm flex justify-between">
                    {opt} {activeSort === opt && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        
        <div className="flex items-center gap-2 mb-12 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${
                activeCategory === cat ? 'bg-[#F57C00] text-white shadow-lg' : 'bg-gray-100 dark:bg-zinc-900 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

     
        <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-2xl md:text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">
            {categoryContent[activeCategory].title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            {categoryContent[activeCategory].desc}
          </p>
        
        </div>

       
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredListings.map((item) => (
            <ListingCard key={item._id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscoverPage;