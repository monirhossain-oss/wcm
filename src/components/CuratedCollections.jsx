// CuratedCollections.jsx (NO 'use client')

import ListingCard from '@/components/ListingCard';
import Link from 'next/link';

async function getCuratedData() {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/listings/curated`,
            { cache: 'no-store' } // or revalidate: 60
        );

        const data = await res.json();

        if (data?.success) {
            return data.data.filter(
                (col) => col.listings && col.listings.length > 0
            );
        }

        return [];
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default async function CuratedCollections() {
    const collections = await getCuratedData();

    if (!collections.length) return null;

    return (
        <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="mb-4">
                <h1 className="text-2xl md:text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                    Curated Collections
                </h1>
                <p className="text-sm md:text-base text-zinc-500 mt-2">
                    Handpicked treasures from top-ranked global creators
                </p>
            </div>

            <div className="space-y-16">
                {collections.map((collection) => (
                    <div key={collection.categoryId}>
                        <div className="flex justify-between items-center pb-3">
                            <h2 className="text-lg md:text-2xl font-bold text-zinc-800 dark:text-zinc-100 uppercase italic tracking-tight">
                                {collection.categoryTitle}
                            </h2>

                            <Link
                                href={`/explore/${collection.categorySlug}`}
                                className="text-xs md:text-sm font-semibold text-orange-600 hover:text-orange-700 transition"
                            >
                                View All →
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {collection.listings.map((listing) => (
                                <ListingCard key={listing._id} listing={listing} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}