import { notFound } from 'next/navigation';
import AboutPage from '../../about-us/page';
import BlogsPage from '../../blogs/page';
import BlogDetailsPage, { generateMetadata as generateBlogMetadata } from '../../blogs/[id]/page';
import CreatorsPage from '../../creators/page';
import ExplorePage from '../../explore/[[...filters]]/page';
import FaqPage from '../../faqUs/page';
import HowItWorksPage from '../../how-it-works/page';
import ListingPage, { generateMetadata as generateListingMetadata } from '../../listings/[id]/page';
import ProfilePage, { generateMetadata as generateProfileMetadata } from '../../profile/[id]/page';
import PrivacyPage from '../../privacy-policy/page';
import TermsPage from '../../terms-and-conditions/page';
import CookiePage from '../../cookie-policy/page';
import HomePage from '../../page';
import ContactPage from '../../contact/page';
import AdvertisingPolicyPage from '../../advertising-policy/page';
import BoostTermsPage from '../../boost-terms-and-ppc/page';
import CreatorTermsPage from '../../creator-terms-and-conditions/page';
import { buildLocalizedMetadata, getPublishedLanguageCodes } from '@/lib/localizedMetadata';

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
};

export async function generateMetadata({ params }) {
  const resolved = await params;
  const [section, id] = resolved.segments || [];
  const childParams = Promise.resolve({ id });
  if (section === 'listings' && id) return generateListingMetadata({ params: childParams, locale: resolved.locale });
  if (section === 'blogs' && id) return generateBlogMetadata({ params: childParams, locale: resolved.locale });
  if (section === 'profile' && id) return generateProfileMetadata({ params: childParams, locale: resolved.locale });
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
