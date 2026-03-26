"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const BlogCard = () => {
  const blogs = [
    {
      id: 1,
      category: "Tradition",
      title: "Discover the Beauty of African Handmade Crafts",
      description: "Across Africa, handmade crafts represent more than artistic expression—they are living symbols of heritage and community identity.",
      image: "https://i.postimg.cc/m2McGXHy/image-(35).jpg",
    },
    {
      id: 2,
      category: "Craftsmanship",
      title: "The Cultural Meaning Behind Traditional Textiles",
      description: "Textiles have long served as a visual language within cultures. From West African Kente to Asian silk, every thread tells a story.",
      image: "https://i.postimg.cc/cJJ46XvJ/image-(29).jpg",
    },
    {
      id: 3,
      category: "Home Décor",
      title: "Handmade Decor: Bringing Global Inspiration Home",
      description: "Decorating with cultural art allows people to bring traditions into their living spaces through carved sculptures and ceramic pottery.",
      image: "https://i.postimg.cc/j2j05g0y/image-(19).jpg",
    },
    {
      id: 4,
      category: "Jewelry",
      title: "Traditional Jewelry and Its Cultural Significance",
      description: "Jewelry has always been more than decoration. It represents identity, protection, and spiritual milestones across generations.",
      image: "https://i.postimg.cc/W1KDgBgX/image-(46).jpg",
    },
    {
      id: 5,
      category: "Fashion",
      title: "Cultural Fashion: When Tradition Meets Modern Design",
      description: "Modern designers are blending ancient techniques with contemporary styles, celebrating history through wearable art.",
      image: "https://i.postimg.cc/7ZZyNbwT/image-(30).jpg",
    },
    {
      id: 6,
      category: "Heritage",
      title: "The Art of Wood Carving Around the World",
      description: "From Africa to Asia, artisans transform wood into powerful symbols of ancestry and spiritual connection through patience and skill.",
      image: "https://i.postimg.cc/fyNGSR88/image-(33).jpg",
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 bg-white dark:bg-[#0a0a0a] transition-colors duration-300">
      
      {/* স্ক্রিনশট অনুযায়ী হেডলাইন সেকশন */}
      <div className="mb-20 text-center">
        <h2 className="text-4xl md:text-6xl font-serif font-black text-zinc-900 dark:text-white mb-4 tracking-tight">
          Cultural Stories & Insights
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
          Explore traditions, craftsmanship, and cultural creativity from <br className="hidden md:block" /> around the world through an editorial lens.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
        {blogs.map((blog) => (
          <div key={blog.id} className="group flex flex-col cursor-pointer">
            
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-6 bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
              <Image 
                src={blog.image} 
                alt={blog.title} 
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-contain p-2 transition-transform duration-700 group-hover:scale-105 rounded-md"
              />
              {/* Floating Category Badge */}
              <div className="absolute top-4 left-4 bg-white/95 dark:bg-orange-600 px-3 py-1 rounded-full shadow-sm">
                <span className="text-[9px] font-bold text-orange-600 dark:text-white uppercase tracking-wider">
                  {blog.category}
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="space-y-3 px-1">
              <h3 className="text-2xl font-bold font-serif text-zinc-900 dark:text-white leading-tight transition-colors">
                {blog.title}
              </h3>
              
              <p className="text-[14px] text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 font-sans">
                {blog.description}
              </p>

              <div className="pt-2">
                 <Link 
                  href={`/blogs/${blog.id}`}
                  className="inline-flex items-center gap-1 text-orange-500 font-bold text-[10px] uppercase tracking-widest group/link"
                >
                  Read More 
                  <ChevronRight size={14} className="transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogCard;