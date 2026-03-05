import SpecialBanner from '@/components/SpecialBanner';
import PopularCreators from '@/components/PopularCreators';
import HomeClientWrapper from '@/components/HomeClientWrapper';
import TrendingListings from '@/components/TrendingListings';
import FeaturesSection from '@/components/FeaturesSection';

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white dark:bg-zinc-950">
      <HomeClientWrapper />
      <TrendingListings />
      <FeaturesSection  />
      <SpecialBanner />
      <PopularCreators />
    </main>
  );
}