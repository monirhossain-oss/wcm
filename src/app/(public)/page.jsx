import PopularCreators from '@/components/PopularCreators';
import TrendingListings from '@/components/TrendingListings';
import FeaturesSection from '@/components/FeaturesSection';
import CuratedCollections from '@/components/CuratedCollections';
import WhyWorldCulture from '@/components/WhyWorldCulture';
import HeroSection from '@/components/HeroSection';

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white dark:bg-zinc-950">
      <HeroSection />
      <FeaturesSection  />
      <PopularCreators />
      <CuratedCollections />
      <TrendingListings />
      <WhyWorldCulture />
    </main>
  );
}