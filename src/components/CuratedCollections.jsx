'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

const curatedData = [
    {
        title: 'Cultural Textiles',
        key: 'textiles',
        image: '/IndianJewelry.png',
    },
    {
        title: 'Artisan Jewelry',
        key: 'jewelry',
        image: '/MexicanFolkArt.png',
    },
    {
        title: 'Home & Cultural Decor',
        key: 'decor',
        image: '/NordicDesign.png',
    },
    {
        title: 'Traditional Clothing',
        key: 'clothing',
        image: '/Africa.jpg',
    },
    {
        title: 'Art & Sculptures',
        key: 'art',
        image: '/europe.jpg',
    },
    {
        title: 'Handmade Crafts',
        key: 'crafts',
        image: '/cultural1.jpg',
    },
    {
        title: 'Beauty & Personal Care',
        key: 'beauty',
        image: '/huipil.jpg',
    },
];

export default function CuratedCollections() {
    const router = useRouter();

    // ক্যাটাগরি অনুযায়ী ডিসকভার পেজে রিডাইরেক্ট করার ফাংশন
    const handleClick = (categoryTitle) => {
        // ডিসকভার পেজে যাওয়ার সময় ক্যাটাগরি প্যারামিটার পাঠিয়ে দিচ্ছি
        // encodeURIComponent ব্যবহার করা হয়েছে যাতে স্পেস বা স্পেশাল ক্যারেক্টার ইউআরএল-এ সমস্যা না করে
        router.push(`/discover?category=${encodeURIComponent(categoryTitle)}`);
    };

    return (
        <section className="max-w-7xl mx-auto px-6 py-16">
            {/* Title */}
            <div className="mb-10">
                <h2 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white">
                    Curated Collections
                </h2>
                <p className="text-sm text-zinc-500 mt-2">
                    Handpicked categories to explore cultural treasures
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {curatedData.map((item) => (
                    <div
                        key={item.key}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleClick(item.title)}
                        onKeyDown={(e) => e.key === 'Enter' && handleClick(item.title)}
                        // কার্ড ডিজাইনে একটু আধুনিক টাচ (Rounded corners & Shadow)
                        className="group relative h-44 md:h-56 overflow-hidden cursor-pointer focus:outline-none shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                        {/* Background Image */}
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover transition-all duration-700 ease-out group-hover:scale-110"
                        />

                        {/* Overlay: সব সময় হালকা একটা গ্রেডিয়েন্ট থাকলে টেক্সট পড়তে সুবিধা হয় */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Title (Bottom Left) */}
                        <div className="absolute inset-x-0 bottom-0 p-4 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="text-white text-xs md:text-sm font-black uppercase tracking-wider">
                                {item.title}
                            </h3>
                            {/* একটা ছোট 'Explore' বাটন যা হোভারে দেখা যাবে */}
                            <div className="h-0.5 w-0 bg-orange-500 group-hover:w-12 transition-all duration-500 mt-1" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}