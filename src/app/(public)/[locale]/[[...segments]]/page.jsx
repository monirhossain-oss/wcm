import { notFound } from 'next/navigation';
import AboutPage, { generateMetadata as generateAboutMetadata } from '../../about-us/page';
import BlogsPage, { generateMetadata as generateBlogsMetadata } from '../../blogs/page';
import BlogDetailsPage, { generateMetadata as generateBlogMetadata } from '../../blogs/[id]/page';
import CreatorsPage, { generateMetadata as generateCreatorsMetadata } from '../../creators/page';
import ExplorePage, { generateMetadata as generateExploreMetadata } from '../../explore/[[...filters]]/page';
import FaqPage, { generateMetadata as generateFaqMetadata } from '../../faqUs/page';
import HowItWorksPage, { generateMetadata as generateHowItWorksMetadata } from '../../how-it-works/page';
import ListingPage, { generateMetadata as generateListingMetadata } from '../../listings/[id]/page';
import ProfilePage, { generateMetadata as generateProfileMetadata } from '../../profile/[id]/page';
import PrivacyPage, { generateMetadata as generatePrivacyMetadata } from '../../privacy-policy/page';
import TermsPage, { generateMetadata as generateTermsMetadata } from '../../terms-and-conditions/page';
import CookiePage, { generateMetadata as generateCookieMetadata } from '../../cookie-policy/page';
import HomePage, { generateMetadata as generateHomeMetadata } from '../../page';
import ContactPage, { generateMetadata as generateContactMetadata } from '../../contact/page';
import AdvertisingPolicyPage, { generateMetadata as generateAdvertisingPolicyMetadata } from '../../advertising-policy/page';
import BoostTermsPage, { generateMetadata as generateBoostTermsMetadata } from '../../boost-terms-and-ppc/page';
import CreatorTermsPage, { generateMetadata as generateCreatorTermsMetadata } from '../../creator-terms-and-conditions/page';
import BecomeCreatorPage, { generateMetadata as generateBecomeCreatorMetadata } from '../../become-creator/page';
import OwnProfilePage from '../../profile/page';
import FavoritesPage from '../../favorites/page';
import VerifyEmailPage from '../../verify-email/page';
import ResetPasswordPage from '../../reset-password/[token]/page';
import { buildLocalizedMetadata, getPublishedLanguageCodes } from '@/lib/localizedMetadata';
import { NOINDEX, NOINDEX_NOFOLLOW } from '@/lib/seo/indexing';
import { translate } from '@/lib/i18n';

// Stage 4: base-page metadata generators keyed by French route section. `faqUs` is intentionally
// absent (legacy alias keeps the generic default until the Stage 5 redirect); `explore` needs filters.
const basePageMetadata = {
  'about-us': generateAboutMetadata,
  blogs: generateBlogsMetadata,
  creators: generateCreatorsMetadata,
  contact: generateContactMetadata,
  'how-it-works': generateHowItWorksMetadata,
  faq: generateFaqMetadata,
  'become-creator': generateBecomeCreatorMetadata,
  'advertising-policy': generateAdvertisingPolicyMetadata,
  'boost-terms-and-ppc': generateBoostTermsMetadata,
  'creator-terms-and-conditions': generateCreatorTermsMetadata,
  'privacy-policy': generatePrivacyMetadata,
  'terms-and-conditions': generateTermsMetadata,
  'cookie-policy': generateCookieMetadata,
};

// Stage 5: localized private/account routes carry the same noindex rules as their English pages.
// `/fr/faqUs` is absent from both maps: the proxy redirects that alias to `/fr/faq` before it renders.
const privateSections = {
  profile: { title: 'account.profileTitle', description: 'account.profileDescription' },
  favorites: { title: 'favorites.metaTitle', description: 'favorites.metaDescription' },
  'verify-email': { title: 'account.verifyEmailTitle', description: 'account.verifyEmailDescription' },
};

const staticPages = {
  'about-us': AboutPage,
  blogs: BlogsPage,
  creators: CreatorsPage,
  explore: ExplorePage,
  faq: FaqPage,
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
  if (section === 'profile' && id) return generateProfileMetadata({ params: childParams, locale: resolved.locale });
  const baseMetadata = section ? basePageMetadata[section] : generateHomeMetadata;
  if (baseMetadata && !id) return baseMetadata({ locale: resolved.locale });
  if (section === 'explore') {
    return generateExploreMetadata({
      params: Promise.resolve({ filters: [id, ...resolved.segments.slice(2)].filter(Boolean) }),
      locale: resolved.locale,
    });
  }
  // Stage 5: the localized private/account routes mirror their English noindex rules. A recovery
  // token must never reach a canonical or alternate URL, so that route advertises no URL at all.
  if (section === 'reset-password') {
    return { title: { absolute: translate(resolved.locale, 'accountRecovery.title') }, robots: NOINDEX_NOFOLLOW };
  }
  if (privateSections[section] && !id) {
    const localized = buildLocalizedMetadata({
      locale: resolved.locale, path: `/${section}`,
      title: translate(resolved.locale, privateSections[section].title),
      description: translate(resolved.locale, privateSections[section].description),
    });
    return { ...localized, alternates: { canonical: localized.alternates.canonical }, robots: NOINDEX };
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
  if (section === 'verify-email') {
    if (id || extra.length) notFound();
    return <VerifyEmailPage />;
  }
  if (section === 'reset-password') {
    if (!id || extra.length) notFound();
    return <ResetPasswordPage token={id} />;
  }
  if (section === 'explore') {
    return <ExplorePage params={Promise.resolve({ filters: [id, ...extra].filter(Boolean) })} searchParams={searchParams} locale={resolved.locale} />;
  }
  // Detail routes take exactly one identifier; every other section is a fixed route, so any extra
  // segment is rejected instead of serving the same page under a second URL.
  const DetailPage = { listings: ListingPage, blogs: BlogDetailsPage, profile: ProfilePage }[section];
  if (DetailPage && id) {
    if (extra.length) notFound();
    return <DetailPage params={Promise.resolve({ id })} searchParams={searchParams} locale={resolved.locale} />;
  }
  const Page = staticPages[section];
  if (!Page || id || extra.length) notFound();
  return <Page params={Promise.resolve({})} searchParams={searchParams} locale={resolved.locale} />;
}
