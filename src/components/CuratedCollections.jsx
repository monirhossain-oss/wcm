'use client';

import Link from 'next/link';
import Image from 'next/image';

const curatedData = [
    { title: 'Cultural Textiles', key: 'textiles', image: '/Cultural-textile.png' },
    { title: 'Artisan Jewelry', key: 'jewelry', image: '/Artisan-jewelry.png' },
    { title: 'Home & Cultural Decor', key: 'decor', image: '/Home&Cultural-decor.png' },
    { title: 'Traditional Clothing', key: 'clothing', image: '/hero (2).png' },
    { title: 'Cultural Art & Sculptures', key: 'art', image: '/Cultural-art-and-sculptures.png' },
    { title: 'Handmade Crafts', key: 'crafts', image: '/Hand-made-crafts (2).png' },
    { title: 'Beauty & Personal Care', key: 'beauty', image: '/Beauty-and-personal-care.png' },
    { title: 'Festivals & Cultural Celebrations', key: 'festivals', image: '/fastivals-and-cultural-Celebration.png' },
];

export default function CuratedCollections() {

    const textToSlug = (text) => {
        return text.toString().toLowerCase().trim()
            .replace(/&/g, 'and')
            .replace(/\s+/g, '-')
            .replace(/[^-a-z0-9]/g, '')
            .replace(/-+/g, '-');
    };

    return (
        <section className="max-w-7xl mx-auto px-6 py-4">
            {/* Title */}
            <div className="mb-10">
                <h1 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white">
                    Curated Collections
                </h1>
                <p className="text-sm text-zinc-500 mt-2">
                    Handpicked categories to explore culture treasures
                </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {curatedData.map((item) => {
                    const slug = textToSlug(item.title);
                    const targetHref = `/explore/${slug}`;

                    return (
                        <Link
                            key={item.key}
                            href={targetHref}
                            className="group relative h-auto aspect-square overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 block"
                        >
                            {/* Background Image */}
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover transition-all duration-700 ease-out group-hover:scale-110"
                            />

                            {/* Overlay Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Title (Bottom Left) */}
                            <div className="absolute inset-x-0 bottom-0 p-5 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                                <h3 className="text-white text-sm md:text-base font-black uppercase tracking-wider">
                                    {item.title}
                                </h3>
                                <div className="h-0.5 w-0 bg-orange-500 group-hover:w-16 transition-all duration-500 mt-1" />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}