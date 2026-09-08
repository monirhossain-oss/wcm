import PopularCreators from '@/components/PopularCreators';
import TrendingListings from '@/components/TrendingListings';
import FeaturesSection from '@/components/FeaturesSection';
import CuratedCollections from '@/components/CuratedCollections';
import WhyWorldCulture from '@/components/WhyWorldCulture';
import HeroSection from '@/components/HeroSection';
import { buildPageMetadata } from '@/lib/seo/pageMetadata';

// SEO Metadata — current language er SEO record (/api/seo/home?languageCode=…), na thakle oi language er catalog fallback
export async function generateMetadata({ locale = 'en' } = {}) {
  return buildPageMetadata({ pageId: 'home', locale });
}

export default function HomePage({ locale = 'en' }) {
  return (
    <main className="min-h-screen overflow-hidden bg-white dark:bg-zinc-950">
      <HeroSection locale={locale} />
      <FeaturesSection locale={locale} />
      <PopularCreators locale={locale} />
      <CuratedCollections locale={locale} />
      <TrendingListings locale={locale} />
      <WhyWorldCulture locale={locale} />
    </main>
  );
}
