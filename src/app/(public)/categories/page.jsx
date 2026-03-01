'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { dummyProducts } from '@/data'; // ডাটা ইম্পোর্ট করুন

const CategoriesPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Textiles', 'Ceramics', 'Accessories', 'Home Decor', 'Art & Sculpture', 'Jewelry'];

  const filteredProducts = activeCategory === 'All' 
    ? dummyProducts 
    : dummyProducts.filter(p => p.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 mt-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {filteredProducts.map((item) => (
          <Link href={`/listings/${item._id}`} key={item._id} className="group cursor-pointer">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h3 className="font-bold group-hover:text-[#F57C00]">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.creatorName}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default CategoriesPage;