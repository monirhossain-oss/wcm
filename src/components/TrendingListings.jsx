import Link from 'next/link';
import ListingCard from './ListingCard';

async function getTrendingListings() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/listings/public?limit=8&page=1`,
    {
      cache: 'no-store', // চাইলে next: { revalidate: 60 } ব্যবহার করতে পারো
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
    <section className="w-full mt-10 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#1F1F1F] dark:text-[#ededed]">
              Trending Listings
            </h2>
            <p className="text-sm mt-1 text-zinc-600 dark:text-zinc-400">
              Handpicked traditions for you
            </p>
          </div>

          <Link
            href="/discover"
            className="text-sm font-semibold text-orange-500 hover:underline"
          >
            See All →
          </Link>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {listings.map((item) => (
            <ListingCard key={item._id} item={item} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default TrendingListings;