'use client';
import { useState } from 'react';
import FeaturesSection from '@/components/FeaturesSection';
import HeroSection from '@/components/HeroSection';
import ListingsSection from '@/components/TrendingListings';
import NewsletterSection from '@/components/Footer';
import PopularCreators from '@/components/PopularCreators';
import SpecialBanner from '@/components/SpecialBanner';

export default function HomePage() {
  const [filters, setFilters] = useState({
    category: '',
    region: '',
    tradition: '',
  });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <main className="min-h-screen overflow-hidden bg-white dark:bg-zinc-950">
      <HeroSection onFilterChange={handleFilterChange} filters={filters} />

      <FeaturesSection filters={filters} onFilterChange={handleFilterChange} />

      <ListingsSection activeFilters={filters} />

      <SpecialBanner />
      <PopularCreators />
      <NewsletterSection />
    </main>
  );
}
