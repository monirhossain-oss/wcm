import ListingCard from '@/components/ListingCard';
import Link from 'next/link';
import { translate } from '@/lib/i18n';

async function getCuratedData(locale = 'en') {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/api/listings/curated${locale === 'en' ? '' : `?language=${locale}`}`,
            {
                next: { revalidate: 60 }
            }
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

export default async function CuratedCollections({ locale = 'en' }) {
    const collections = await getCuratedData(locale);

    if (!collections.length) return null;

    return (
        <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="mb-4">
                <h2 className="text-2xl md:text-2xl font-black text-zinc-900 dark:text-white uppercase tracking-tight">
                    {translate(locale, 'homeCurated.heading')}
                </h2>
                <p className="text-sm md:text-base text-zinc-500 mt-2">
                    {translate(locale, 'homeCurated.description')}
                </p>
            </div>

            <div className="space-y-8">
                {collections.map((collection) => (
                    <div key={collection.categoryId}>
                        <div className="flex justify-between items-center pb-3">
                            <h2 className="text-lg md:text-xl font-bold text-zinc-800 dark:text-zinc-100 uppercase italic tracking-tight">
                                {collection.categoryTitle}
                            </h2>

                            <Link
                                href={`${locale === 'en' ? '' : `/${locale}`}/explore/${collection.categorySlug}`}
                                className="text-xs md:text-sm font-semibold text-orange-600 hover:text-orange-700 transition"
                            >
                                {translate(locale, 'homeCurated.viewAll')} <span aria-hidden="true">→</span>
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
