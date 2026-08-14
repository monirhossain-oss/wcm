import { notFound } from 'next/navigation';
import AboutPage from '../../about-us/page';
import BlogsPage, { generateMetadata as generateBlogsMetadata } from '../../blogs/page';
import BlogDetailsPage, { generateMetadata as generateBlogMetadata } from '../../blogs/[id]/page';
import CreatorsPage, { generateMetadata as generateCreatorsMetadata } from '../../creators/page';
import ExplorePage, { generateMetadata as generateExploreMetadata } from '../../explore/[[...filters]]/page';
import FaqPage from '../../faqUs/page';
import HowItWorksPage, { generateMetadata as generateHowItWorksMetadata } from '../../how-it-works/page';
import ListingPage, { generateMetadata as generateListingMetadata } from '../../listings/[id]/page';
import ProfilePage, { generateMetadata as generateProfileMetadata } from '../../profile/[id]/page';
import PrivacyPage from '../../privacy-policy/page';
import TermsPage from '../../terms-and-conditions/page';
import CookiePage from '../../cookie-policy/page';
import HomePage from '../../page';
import ContactPage, { generateMetadata as generateContactMetadata } from '../../contact/page';
import AdvertisingPolicyPage from '../../advertising-policy/page';
import BoostTermsPage from '../../boost-terms-and-ppc/page';
import CreatorTermsPage from '../../creator-terms-and-conditions/page';
import BecomeCreatorPage from '../../become-creator/page';
import OwnProfilePage from '../../profile/page';
import FavoritesPage from '../../favorites/page';
import { buildLocalizedMetadata, getPublishedLanguageCodes } from '@/lib/localizedMetadata';
import { translate } from '@/lib/i18n';

const staticPages = {
  'about-us': AboutPage,
  blogs: BlogsPage,
  creators: CreatorsPage,
  explore: ExplorePage,
  faq: FaqPage,
  faqUs: FaqPage,
  'how-it-works': HowItWorksPage,
  'privacy-policy': PrivacyPage,
  'terms-and-conditions': TermsPage,
  'cookie-policy': CookiePage,
  contact: ContactPage,
  'advertising-policy': AdvertisingPolicyPage,
  'boost-terms-and-ppc': BoostTermsPage,
  'creator-terms-and-conditions': CreatorTermsPage,
  'become-creator': BecomeCreatorPage,
  profile: OwnProfilePage,
  favorites: FavoritesPage,
};

export async function generateMetadata({ params }) {
  const resolved = await params;
  const [section, id] = resolved.segments || [];
  const childParams = Promise.resolve({ id });
  if (section === 'listings' && id) return generateListingMetadata({ params: childParams, locale: resolved.locale });
  if (section === 'blogs' && id) return generateBlogMetadata({ params: childParams, locale: resolved.locale });
  if (section === 'blogs' && !id) return generateBlogsMetadata({ locale: resolved.locale });
  if (section === 'profile' && id) return generateProfileMetadata({ params: childParams, locale: resolved.locale });
  if (section === 'creators' && !id) return generateCreatorsMetadata({ locale: resolved.locale });
  if (section === 'contact' && !id) return generateContactMetadata({ locale: resolved.locale });
  if (section === 'how-it-works' && !id) return generateHowItWorksMetadata({ locale: resolved.locale });
  if (section === 'explore') {
    return generateExploreMetadata({
      params: Promise.resolve({ filters: [id, ...resolved.segments.slice(2)].filter(Boolean) }),
      locale: resolved.locale,
    });
  }
  if (section === 'favorites' && !id) {
    return buildLocalizedMetadata({
      locale: resolved.locale, path: '/favorites', title: translate(resolved.locale, 'favorites.metaTitle'),
      description: translate(resolved.locale, 'favorites.metaDescription'), languages: await getPublishedLanguageCodes(),
    });
  }
  const path = section ? `/${resolved.segments.join('/')}` : '/';
  return buildLocalizedMetadata({
    locale: resolved.locale,
    path,
    title: 'World Culture Marketplace',
    description: 'Discover cultural creators, stories and traditions on World Culture Marketplace.',
    languages: await getPublishedLanguageCodes(),
  });
}

export default async function LocalizedPage({ params, searchParams }) {
  const resolved = await params;
  const [section, id, ...extra] = resolved.segments || [];
  if (!section) return <HomePage locale={resolved.locale} />;
  let Page = staticPages[section];
  let childParams = section === 'explore' ? { filters: [id, ...extra].filter(Boolean) } : {};
  if (section === 'listings' && id) { Page = ListingPage; childParams = { id }; }
  if (section === 'blogs' && id) { Page = BlogDetailsPage; childParams = { id }; }
  if (section === 'profile' && id) { Page = ProfilePage; childParams = { id }; }
  if (!Page || (extra.length && section !== 'explore')) notFound();
  return <Page params={Promise.resolve(childParams)} searchParams={searchParams} locale={resolved.locale} />;
}
