import ListingCard from './ListingCard';
import ListingsProviderWrapper from './ListingsProviderWrapper';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export default async function TrendingDataWrapper() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/listings/trending?limit=8&page=1`, {
      next: { revalidate: 60 }, // 60 seconds revalidation
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    // API response structure check
    if (!data.success) {
      throw new Error(data.message || 'API returned unsuccessful response');
    }

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
        <ListingsProviderWrapper initialData={listings} />
      </>
    );
  } catch (error) {
    console.error('TrendingDataWrapper error:', error);

    // User-friendly error message
    return (
      <div className="text-sm text-red-400 text-center py-8">
        Failed to load trending listings.
        <button
          onClick={() => window.location.reload()}
          className="ml-2 underline hover:text-red-300"
        >
          Retry
        </button>
      </div>
    );
  }
}