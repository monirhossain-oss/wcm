'use client';
import React, { useState, useRef } from 'react';
import ListingCard from '@/components/ListingCard';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

const DiscoverPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Popularity');
  const scrollRef = useRef(null);

  const categoryContent = {
    All: { title: "Discover Culture", desc: "Immerse yourself in a global gallery of heritage treasures." },
    Crafts: { title: "Master Crafts", desc: "Celebrate the soul of age-old craftsmanship." },
    Clothing: { title: "Heritage Wear", desc: "Wear the story of traditional silhouettes." },
    Art: { title: "Cultural Art", desc: "Explore visual voices of ancient ancestors." },
    'Home Decor': { title: "Artisan Living", desc: "Transform your space with global heritage." },
    Accessories: { title: "Ethnic Accents", desc: "Small treasures with big cultural histories." },
    Textiles: { title: "Woven Stories", desc: "Hand-loomed fabrics with intricate patterns." },
    Pottery: { title: "Clay Traditions", desc: "Hand-thrown ceramics from local artisans." },
    Jewelry: { title: "Ancient Shimmer", desc: "Traditional ornaments with modern soul." },
    Furniture: { title: "Ancestral Seats", desc: "Hand-carved furniture for timeless homes." }
  };

  const categories = Object.keys(categoryContent);

  const dummyListings = [
    { _id: '1', title: 'Handmade Pottery', price: 45, category: 'Crafts', images: ['https://i.postimg.cc/3x9yPRpV/Pottery-craft-ceramics.jpg'] },
    { _id: '2', title: 'Traditional Scarf', price: 25, category: 'Clothing', images: ['https://i.postimg.cc/sD41hXnH/Chris-Fallon.jpg'] },
    { _id: '3', title: 'Wooden Totem', price: 120, category: 'Art', images: ['https://i.postimg.cc/Y0wq4KYF/essay-scruton-fakery-42-22804006.webp'] },
    { _id: '4', title: 'Ceramic Vase', price: 60, category: 'Home Decor', images: ['https://i.postimg.cc/QxhdhDXX/138016039-15563697440551n.jpg'] },
    { _id: '5', title: 'Oil Painting', price: 250, category: 'Art', images: ['https://i.postimg.cc/2ymrkdNw/kch-280226-ce-bagatan-p1.jpg'] },
    { _id: '6', title: 'Beaded Jewelry', price: 35, category: 'Accessories', images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908'] },
  ];

  // বাটন ক্লিক করলে স্ক্রল হওয়ার ফাংশন
  const handleCategoryClick = (e, cat) => {
    setActiveCategory(cat);
    // এই লাইনটি ক্লিক করা বাটনকে স্ক্রল করে মাঝখানে আনবে
    e.target.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollAmount = 300;
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const processedListings = dummyListings
    .filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'Popularity') return b.price - a.price;
      return b._id.localeCompare(a._id);
    });

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] transition-colors">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md border-b border-gray-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search items..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-100 dark:bg-zinc-900 border-none rounded-full text-sm outline-none"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* SLIDER WITH AUTO-SCROLL ON CLICK */}
        <div className="relative flex items-center mb-10">
          <button 
            onClick={() => scroll('left')}
            className="absolute -left-4 z-10 p-2 bg-white dark:bg-zinc-900 shadow-md rounded-full border border-gray-200 dark:border-zinc-800 hover:scale-110 transition-transform"
          >
            <ChevronLeft size={18} />
          </button>

          <div 
            ref={scrollRef}
            className="flex items-center gap-3 overflow-x-auto no-scrollbar px-2 py-4 scroll-smooth"
            style={{ scrollSnapType: 'x proximity' }}
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={(e) => handleCategoryClick(e, cat)}
                className={`px-7 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border ${
                  activeCategory === cat 
                  ? 'bg-[#F57C00] text-white border-[#F57C00] shadow-lg shadow-orange-500/20' 
                  : 'bg-white dark:bg-zinc-900 text-gray-500 border-gray-200 dark:border-zinc-800 hover:border-orange-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button 
            onClick={() => scroll('right')}
            className="absolute -right-4 z-10 p-2 bg-white dark:bg-zinc-900 shadow-md rounded-full border border-gray-200 dark:border-zinc-800 hover:scale-110 transition-transform"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* SORTING BUTTONS */}
        <div className="flex justify-center mb-12">
          <div className="flex bg-gray-100 dark:bg-zinc-900 p-1 rounded-full border border-gray-200 dark:border-zinc-800">
            {['Popularity', 'Newest'].map((opt) => (
              <button
                key={opt}
                onClick={() => setSortBy(opt)}
                className={`px-8 py-2 rounded-full text-[11px] font-bold transition-all ${
                  sortBy === opt 
                  ? 'bg-white dark:bg-zinc-800 text-[#F57C00] shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* HERO CONTENT */}
        <div className="text-center mb-16 animate-in fade-in duration-1000">
          <h1 className="text-3xl md:text-5xl font-black text-zinc-900 dark:text-white tracking-tighter mb-4 italic uppercase">
            {categoryContent[activeCategory].title}
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            {categoryContent[activeCategory].desc}
          </p>
        </div>

        {/* GRID */}
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