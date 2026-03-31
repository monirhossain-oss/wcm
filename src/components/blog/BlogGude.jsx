import React from 'react';
import Image from 'next/image';

const BlogGude = () => {
  const categories = [
    { id: "9A3F1C7B2E4D8F6A1B3C5D7E9F0A2B4C6D8E1F3A5", title: "Home Decor", img: "https://i.postimg.cc/j2hpFJY9/cozy-composition-with-details-interior-decor-decorative-word-home-169016-12899.avif" },

    { id: "F1D3B7A9C8A124E6A90B72C5F1D9E3AC4A8F26F1B", title: "Kitchen & Dining", img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=300" },

    { id: "8DE93C4728D6AF5A7E19B3F1C7B2E4D8F6A1B3C5D", title: "Furniture", img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=300" },

    { id: "7E9F0A2B4C6D8E1F3A59A3F1C7B2E4D8F6A1B3C5D", title: "Vintage Rugs", img: "https://i.postimg.cc/43tF0hzc/Antique-Rugs1-600x600.jpg" },

    { id: "C4A8F26F1B8DE93C4728D6AF5A7E19B3F1C7B2E4D", title: "Lighting", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=300" },

    { id: "1B3C5D7E9F0A2B4C6D8E1F3A59A3F1C7B2E4D8F6A", title: "Bedding", img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=300" },

    { id: "6F1B8DE93C4728D6AF5A7E19B3F1C7B2E4D8F6A1B", title: "Wall Decor & Mirrors", img: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=300" },

    { id: "A5C4A8F26F1B8DE93C4728D6AF5A7E19B3F1C7B2E", title: "Original Paintings", img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=300" },

    { id: "2E4D8F6A1B3C5D7E9F0A2B4C6D8E1F3A59A3F1C7B", title: "Home Improvement", img: "https://i.postimg.cc/xCngFpjC/cardboard-house-surrounded-by-repair-tools-23-2148393089.avif" },

    { id: "D8E1F3A59A3F1C7B2E4D8F6A1B3C5D7E9F0A2B4C6", title: "Curtains & Window", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=300" },

    { id: "5A7E19B3F1C7B2E4D8F6A1B3C5D7E9F0A2B4C6D8E", title: "Storage & Organisation", img: "https://i.postimg.cc/R0QLf11M/grey-trofast-storage-shelves-with-storage-baskets-in-childs-c9ec92840f2280d640b73113be6ac6f5.avif" },

    { id: "B2E4D8F6A1B3C5D7E9F0A2B4C6D8E1F3A59A3F1C7", title: "Bathroom", img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300" },
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-950 transition-colors duration-300">
      {/* হেডার সেকশন - নেভি ব্লু ব্যাকগ্রাউন্ড */}
      <section className="bg-[#1a2b49] dark:bg-slate-900 text-white py-16 px-4 text-center">
        <h1 className="text-3xl md:text-5xl font-serif mb-4 tracking-tight">WCM's Guide to Home</h1>
        <p className="text-lg font-light opacity-90 max-w-2xl mx-auto">
          Discover original wall art, comfy bedding, unique lighting, and more from small shops.
        </p>
      </section>

      {/* ক্যাটাগরি গ্রিড সেকশন */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-6 gap-y-12">
          {categories.map((item) => (
            <div key={item.id} className="group flex flex-col items-center text-center cursor-pointer">

              {/* সার্কুলার ইমেজ (Next.js Image) */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-100 dark:bg-slate-800 mb-5 transition-all duration-300 group-hover:scale-105 shadow-sm ring-1 ring-gray-100 dark:ring-slate-800">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 150px, 200px"
                  className="object-cover"
                />
              </div>

              {/* টাইটেল: dark:text-gray-200 */}
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1 group-hover:underline decoration-orange-500 underline-offset-4 transition-colors">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogGude;