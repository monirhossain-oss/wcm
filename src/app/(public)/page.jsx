import PopularCreators from '@/components/PopularCreators';
import HomeClientWrapper from '@/components/HomeClientWrapper';
import TrendingListings from '@/components/TrendingListings';
import FeaturesSection from '@/components/FeaturesSection';
import CuratedCollections from '@/components/CuratedCollections';
import WhyWorldCulture from '@/components/WhyWorldCulture';

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white dark:bg-zinc-950">
      <HomeClientWrapper />
      <FeaturesSection  />
      <PopularCreators />
      <CuratedCollections />
      <TrendingListings />
      <WhyWorldCulture />
    </main>
  );
}