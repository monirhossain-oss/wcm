import React, { Suspense } from 'react';
import CultureSkeleton from './CultureSkeleton';
import CultureDataWrapper from './CultureDataWrapper';

export default function FeaturedCultures() {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-4 relative mt-10">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1F1F1F] dark:text-[#ededed] tracking-tight">
            Explore Cultures
          </h2>
          <p className="text-sm text-[#555555] dark:text-[#cccccc] opacity-80">
            Craftsmanship & heritage rituals.
          </p>
        </div>
        <a href="/explore" className="text-[#F57C00] hover:underline font-semibold text-sm">
          View all &rarr;
        </a>
      </div>

      <Suspense fallback={<CultureSkeleton />}>
        <CultureDataWrapper />
      </Suspense>
    </section>
  );
}