import React, { Suspense } from 'react';
import CultureSkeleton from './CultureSkeleton';
import CultureDataWrapper from './CultureDataWrapper';
import Link from 'next/link';
import { localePath, translate } from '@/lib/i18n';

export default function FeaturedCultures({ locale = 'en' }) {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-4 relative mt-10">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#1F1F1F] dark:text-[#ededed] tracking-tight">
            {translate(locale, 'homeDiscovery.cultures.heading')}
          </h2>
          <p className="text-sm text-[#555555] dark:text-[#cccccc] opacity-80">
            {translate(locale, 'homeDiscovery.cultures.description')}
          </p>
        </div>
        <Link href={localePath(locale, '/explore')} className="text-[#F57C00] hover:underline font-semibold text-sm">
          {translate(locale, 'homeDiscovery.viewAll')} →
        </Link>
      </div>

      <Suspense fallback={<CultureSkeleton />}>
        <CultureDataWrapper locale={locale} />
      </Suspense>
    </section>
  );
}
