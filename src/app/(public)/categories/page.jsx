'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; 
import { dummyProducts } from '@/data'; 

const CategoriesPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Textiles', 'Ceramics', 'Accessories', 'Home Decor', 'Art & Sculpture', 'Jewelry', 'Fashion'];

  const filteredProducts = activeCategory === 'All' 
    ? dummyProducts 
    : dummyProducts.filter(p => p.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 mt-16">
      
      {/* Category Buttons Section */}
      <div className="flex flex-wrap gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeCategory === cat
                ? 'bg-[#F57C00] text-white shadow-md shadow-orange-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {filteredProducts.map((item) => (
          <Link href={`/listings/${item._id}`} key={item._id} className="group cursor-pointer">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-3">
              <Image 
                src={item.imageUrl} 
                alt={item.title} 
                fill 
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500" 
                unoptimized 
              />
            </div>
            <h3 className="font-bold group-hover:text-[#F57C00] transition-colors dark:text-white">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {item.creatorName}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;