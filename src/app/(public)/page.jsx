import PopularCreators from '@/components/PopularCreators';
import TrendingListings from '@/components/TrendingListings';
import FeaturesSection from '@/components/FeaturesSection';
import CuratedCollections from '@/components/CuratedCollections';
import WhyWorldCulture from '@/components/WhyWorldCulture';
import HeroSection from '@/components/HeroSection';
import { getSeoByPage } from '@/lib/api';
import { buildLocalizedMetadata, getPublishedLanguageCodes } from '@/lib/localizedMetadata';

// SEO Metadata — Admin panel (/api/seo/home) theke title/description/keywords ana hocche
export async function generateMetadata() {
  const seoData = await getSeoByPage('home');
  const localized = buildLocalizedMetadata({ path: '/',
    title: seoData?.title || 'World Culture Marketplace',
    description: seoData?.description || 'Discover and explore global cultural products, craftsmanship, and heritage rituals.',
    languages: await getPublishedLanguageCodes() });
  // console.log('🔍 [Home Page] SEO data from panel:', seoData.title);

  if (seoData?.title) {
    return {
      ...localized,
      title: seoData.title,
      description: seoData.description || 'Discover and explore global cultural products, craftsmanship, and heritage rituals.',
      keywords: seoData.keywords?.length ? seoData.keywords : undefined,
    };
  }

  // SEO panel e 'home' er jonno kichu set kora na thakle, root layout.jsx er default metadata e fall back korbe
  return localized;
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
