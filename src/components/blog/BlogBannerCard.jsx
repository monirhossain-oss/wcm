import React from 'react';
import Image from 'next/image';

const BlogBannerCard = () => {
  // ডাইনামিক ডেটা অবজেক্ট
  const blogData = {
    banner: {
      title: "15 Adorable Heritage Gifts for Global Fans",
      description: "Discover creative, personalised, and joyous cultural gifts to celebrate your football passion!",
      image: "https://i.postimg.cc/xCfMXHsb/image-(25).jpg", 
      category: "Marketplace Picks"
    },
    cards: [
      {
        id: 1,
        category: "Shopping Guides",
        title: "12 Heritage picks for a memorable match day",
        desc: "From classic kits to personalised stadium signs – get ready for a truly special year.",
        img: "https://i.postimg.cc/W4jJygc7/image-(24).jpg"
      },
      {
        id: 2,
        category: "Inspiration",
        title: "11 Crafts that make WCM shopping special",
        desc: "Get to know the artistry behind captivating handmade creations, from woodwork to ceramics.",
        
      },
      {
        id: 3,
        category: "Gift Ideas",
        title: "Thoughtful thank you gift ideas for mentors",
        desc: "From personalised to practical, these gifts from local WCM shops score an A+.",
        img: "https://i.postimg.cc/G2gYJXHN/photo-gift.webp"
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-16 transition-colors duration-300">
      
      {/* ১. বড় ব্যানার সেকশন */}
      <section className="flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-800 p-4 transition-all">
        {/* Image Container */}
        <div className="relative w-full md:w-1/2 h-80 rounded-xl overflow-hidden">
          <Image 
            src={blogData.banner.image} 
            alt="Main Banner" 
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
        <div className="w-full md:w-1/2 space-y-4 px-4">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-800 dark:text-white leading-tight">
            {blogData.banner.title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-light">
            {blogData.banner.description}
          </p>
          <button className="flex items-center gap-2 font-semibold text-gray-900 dark:text-gray-200 border-b-2 border-transparent hover:border-black dark:hover:border-white transition-all pt-2">
            Read and shop <span className="text-xl">→</span>
          </button>
        </div>
      </section>

      {/* ২. ছোট ব্লগ কার্ড গ্রিড */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {blogData.cards.map((card) => (
          <div key={card.id} className="group cursor-pointer space-y-4">
            {/* Image Container */}
            <div className="relative h-64 rounded-xl overflow-hidden border-t-8 border-orange-500 shadow-md dark:shadow-slate-950">
              <Image 
                src={card.img} 
                alt={card.title} 
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                {card.category}
              </p>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:underline decoration-orange-500 underline-offset-4 transition-colors">
                {card.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed transition-colors">
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </section>

    </div>
  );
};

export default BlogBannerCard;