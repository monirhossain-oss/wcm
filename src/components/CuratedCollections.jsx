'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

const curatedData = [
    {
        title: 'Cultural Textiles',
        key: 'textiles',
        image: '/cultural textile.jpeg',
    },
    {
        title: 'Artisan Jewelry',
        key: 'jewelry',
        image: '/artisan jewelry.jpeg',
    },
    {
        title: 'Home & Cultural Decor',
        key: 'decor',
        image: '/home and decor.jpeg',
    },
    {
        title: 'Traditional Clothing',
        key: 'clothing',
        image: '/traditional clothing.jpeg',
    },
    {
        title: 'Cultural Art & Sculptures',
        key: 'art',
        image: '/Art & Sculptures.jpeg',
    },
    {
        title: 'Handmade Crafts',
        key: 'crafts',
        image: '/Handmade Crafts.jpeg',
    },
    {
        title: 'Beauty & Personal Care',
        key: 'beauty',
        image: '/Beauty & Personal Care.jpeg',
    },
    {
        title: 'Festivals & Cultural Celebrations',
        key: 'festivals',
        image: '/Festivals & Cultural Celebration.jpeg',
    },
];
export default function CuratedCollections() {
    const router = useRouter();
    const handleClick = (categoryTitle) => {
        router.push(`/discover?category=${encodeURIComponent(categoryTitle)}`);
    };

    return (
        <section className="max-w-7xl mx-auto px-6 py-4">
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
                        className="group relative h-44 md:h-56 overflow-hidden cursor-pointer focus:outline-none shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                        {/* Background Image */}
                        <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover transition-all duration-700 ease-out group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Title (Bottom Left) */}
                        <div className="absolute inset-x-0 bottom-0 p-4 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                            <h3 className="text-white text-xs md:text-sm font-black uppercase tracking-wider">
                                {item.title}
                            </h3>
                            <div className="h-0.5 w-0 bg-orange-500 group-hover:w-12 transition-all duration-500 mt-1" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}