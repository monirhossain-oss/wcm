import React from 'react';

const BlogBannerCard = () => {
  // ডাইনামিক ডেটা অবজেক্ট
  const blogData = {
    banner: {
      title: "15 Adorable Heritage Gifts for Global Fans",
      description: "Discover creative, personalised, and joyous cultural gifts to celebrate your football passion!",
      image: "https://i.postimg.cc/nVTqnc23/il-794x-N-7578412135-4lf2.webp", 
      category: "Marketplace Picks"
    },
    cards: [
      {
        id: 1,
        category: "Shopping Guides",
        title: "12 Heritage picks for a memorable match day",
        desc: "From classic kits to personalised stadium signs – get ready for a truly special year.",
        img: "https://images.unsplash.com/photo-1519311965067-36d3e5f33d39?auto=format&fit=crop&q=80&w=600"
      },
      {
        id: 2,
        category: "Inspiration",
        title: "11 Crafts that make WCM shopping special",
        desc: "Get to know the artistry behind captivating handmade creations, from woodwork to ceramics.",
        img: "https://i.postimg.cc/4dbY3BTL/inspiration-quote-ins-002-design-template-660ac822e7f4cf56bd76cff1c031c1b9-screen.jpg"
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
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-16">
      
      {/* ১. বড় ব্যানার সেকশন (ইমেজ ২ অনুসরণ করে) */}
      <section className="flex flex-col md:flex-row items-center gap-8 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-4">
        <div className="w-full md:w-1/2 h-80 rounded-xl overflow-hidden">
          <img 
            src={blogData.banner.image} 
            alt="Main Banner" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 space-y-4 px-4">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-800 leading-tight">
            {blogData.banner.title}
          </h2>
          <p className="text-lg text-gray-600 font-light">
            {blogData.banner.description}
          </p>
          <button className="flex items-center gap-2 font-semibold text-gray-900 border-b-2 border-transparent hover:border-black transition-all pt-2">
            Read and shop <span className="text-xl">→</span>
          </button>
        </div>
      </section>

      {/* ২. ছোট ব্লগ কার্ড গ্রিড (ইমেজ ১ অনুসরণ করে) */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {blogData.cards.map((card) => (
          <div key={card.id} className="group cursor-pointer space-y-4">
            <div className="relative h-64 rounded-xl overflow-hidden border-t-8 border-orange-500 shadow-md">
              <img 
                src={card.img} 
                alt={card.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase">{card.category}</p>
              <h3 className="text-xl font-bold text-gray-800 group-hover:underline decoration-orange-500 underline-offset-4">
                {card.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
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