import Link from 'next/link';
import ListingCard from './ListingCard';

async function getTrendingListings() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/listings/public?limit=8&page=1`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch listings');
  }

  const data = await res.json();
  return data.listings || [];
}

const TrendingListings = async () => {
  const listings = await getTrendingListings();

  return (
    <section className="w-full py-8 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#1F1F1F] dark:text-[#ededed]">
              Trending Listings
            </h2>
            <p className="text-sm mt-1 text-zinc-600 dark:text-zinc-400">
              Handpicked traditions for you
            </p>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {listings.map((item) => (
            <ListingCard key={item._id} item={item} />
          ))}
        </div>

        {/* See All Button Section */}
        <div className="mt-4 md:mt-8 flex justify-center">
          <Link
            href="/discover"
            className="group flex items-center gap-2 px-8 py-3 border-2 border-orange-500 text-orange-500 font-bold text-sm rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-orange-200"
          >
            Explore All Listings
            <span className="transform group-hover:translate-x-1 transition-transform duration-200">
              →
            </span>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default TrendingListings;