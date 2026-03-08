import ListingCard from './ListingCard';
import ListingsProviderWrapper from './ListingsProviderWrapper';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export default async function TrendingDataWrapper() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/listings/public?limit=8&page=1`, {
            next: { revalidate: 3600 }
        });

        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        const listings = data.listings || [];

        return (
            <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {listings.map((item) => (
                        <ListingCard key={item._id} item={item} />
                    ))}
                </div>

                {/* ক্যাশ করার জন্য এই ব্রিজের মাধ্যমে ডাটা পাঠিয়ে দিলাম */}
                <ListingsProviderWrapper data={listings} />
            </>
        );
    } catch (error) {
        return <div className="text-xs text-gray-400">Failed to load listings.</div>;
    }
}