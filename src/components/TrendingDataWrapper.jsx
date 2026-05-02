import ListingCard from './ListingCard';
import ListingsProviderWrapper from './ListingsProviderWrapper';
 
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
 
export default async function TrendingDataWrapper() {
  try {
    // FIX: `api/` → `/api/` — আগে slash না থাকায় URL ভুল হচ্ছিল
    const res = await fetch(`${API_BASE_URL}/api/listings/trending?limit=8&page=1`, {
      next: { revalidate: 30 },
    });
 
    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();
    const listings = data.listings || [];
 
    if (listings.length === 0) {
      return (
        <div className="text-sm text-zinc-400 text-center py-8">
          No trending listings found.
        </div>
      );
    }
 
    return (
      <>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {listings.map((item) => (
            <ListingCard key={item._id} item={item} />
          ))}
        </div>
        <ListingsProviderWrapper data={listings} />
      </>
    );
  } catch (error) {
    console.error('TrendingDataWrapper error:', error);
    return <div className="text-xs text-gray-400">Failed to load listings.</div>;
  }
}