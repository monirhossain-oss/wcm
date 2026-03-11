import React from 'react';
import Image from 'next/image';

const BlogCard = () => {
  const blogs = [
    {
      id: 1,
      category: "Jewelry Design",
      title: "10 Football-inspired pendants for the modern fan",
      description: "From engraved stadium coordinates to minimalist ball designs, explore jewelry that tells a story.",
      image: "https://i.postimg.cc/NjtMSMjz/inv-425x340-6847874436-2y3xevnt.webp",
      accent: "border-t-4 border-[#D4AF37]"
    },
    {
      id: 2,
      category: "Marketplace Inspiration",
      title: "Handcrafted accessories that define game-day elegance",
      description: "Get to know the artistry behind our limited edition WCM jewelry collection and their creative process.",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600",
      accent: "border-t-4 border-[#FF5722]"
    },
    {
      id: 3,
      category: "Gift Ideas",
      title: "Thoughtful jewelry gift ideas for football lovers",
      description: "Find the perfect token of appreciation for that special someone who lives and breathes the beautiful game.",
      image: "https://i.postimg.cc/vBC8z8jD/il-794x-N-7803156945-szxb.webp",
      accent: "border-t-4 border-[#1A1A1A] dark:border-gray-500"
    },
    {
      id: 4,
      category: "Heritage",
      title: "The evolution of football-themed silver adornments",
      description: "A deep dive into how fan culture has influenced jewelry design from the 70s to the modern era.",
      image: "https://i.postimg.cc/KvZwWh2b/image-(12).jpg",
      accent: "border-t-4 border-gray-300 dark:border-slate-600"
    },
    {
      id: 5,
      category: "Artisan Spotlight",
      title: "Behind the silver: Crafting the WCM heritage ring",
      description: "Step inside the workshop of our master silversmiths as they create the iconic heritage collection.",
      image: "https://i.postimg.cc/8zTpw0yJ/inv-425x340-7014557861-35pb1bqy.webp",
      accent: "border-t-4 border-[#D4AF37]"
    },
    {
      id: 6,
      category: "Style Guide",
      title: "How to style high-fashion jewelry with vintage kits",
      description: "Master the art of 'Pitch-to-Pavement' style by pairing gold accessories with your favorite classic jerseys.",
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=600",
      accent: "border-t-4 border-purple-400"
    }
  ];

  return (
    // bg-white (Light) | dark:bg-slate-950 (Dark)
    <section className="max-w-7xl mx-auto px-6 py-16 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {blogs.map((blog) => (
          <div key={blog.id} className="group flex flex-col cursor-pointer">
            
            {/* Image Container with Next.js Image */}
            <div className={`relative h-64 overflow-hidden rounded-xl shadow-sm ${blog.accent}`}>
              <Image 
                src={blog.image} 
                alt={blog.title} 
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Overlay for dark mode to make images blend better */}
              <div className="absolute inset-0 bg-black/0 dark:bg-black/10 group-hover:bg-transparent transition-colors"></div>
            </div>

            {/* Card Body */}
            <div className="pt-5 space-y-2">
              {/* Category: dark:text-gray-500 */}
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest transition-colors">
                {blog.category}
              </p>
              
              {/* Title: dark:text-gray-100 */}
              <h3 className="text-xl font-serif text-[#222222] dark:text-gray-100 leading-snug group-hover:underline decoration-1 underline-offset-4 transition-colors">
                {blog.title}
              </h3>
              
              {/* Description: dark:text-gray-400 */}
              <p className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 transition-colors">
                {blog.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BlogCard;