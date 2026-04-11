import { Suspense } from 'react';
import ListingSkeleton from './ListingSkeleton';
import TrendingDataWrapper from './TrendingDataWrapper';
import Link from 'next/link';

export default function TrendingListings() {
  return (
    <section className="w-full py-8 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl  font-bold text-[#1F1F1F] dark:text-[#ededed]">
              Trending Listings
            </h2>
            <p className="text-sm text-zinc-500">
              Handpicked traditions for you.
            </p>
          </div>
        </div>

        {/* Streaming Data */}
        <Suspense fallback={<ListingSkeleton />}>
          <TrendingDataWrapper />
        </Suspense>

        {/* View All Button */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/explore"
            prefetch={true}
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
}