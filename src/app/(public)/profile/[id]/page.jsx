import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import PublicProfile from './PublicProfile';
import { absoluteSiteUrl, buildLocalizedMetadata, getDynamicSeoContext, localizedPath } from '@/lib/localizedMetadata';
import { translate } from '@/lib/i18n';

export async function generateMetadata({ params, locale = 'en' }) {
  const { id } = await params;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile/${id}${locale === 'en' ? '' : `?language=${locale}`}`, { cache: 'no-store' });
    if (!res.ok) return { title: translate(locale, 'publicProfile.metaNotFound') };
    const { user } = await res.json();
    const name = user?.profile?.displayName || `${user?.firstName} ${user?.lastName}`;
    const seoContext = await getDynamicSeoContext({ objectType: 'creatorProfile', slug: id, locale });
    const title = user._localizedSeo?.title || `${name} | ${translate(locale, 'publicProfile.metaTitleSuffix')}`;
    const description = user._localizedSeo?.description || user?.profile?.bio || `${name} — ${translate(locale, 'publicProfile.metaDescriptionSuffix')}`;
    return {
      ...buildLocalizedMetadata({
        locale, path: `/profile/${user.slug || id}`, title, description,
        image: user?.profile?.profileImage || `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.jpg`,
        imageAlt: user._localizedSeo?.imageAlt || name, type: 'profile',
        languageUrls: seoContext?.metadata?.languages, canonicalUrl: seoContext?.metadata?.canonical,
      }),
      keywords: [user?.profile?.country, user?.profile?.tradition, ...translate(locale, 'publicProfile.metaKeywords')].filter(Boolean),
    };
  } catch {
    return { title: translate(locale, 'publicProfile.metaFallback') };
  }
}

export default async function Page({ params, locale = 'en' }) {
  const { id } = await params;
  let profileData = null;
  let listings = [];
  try {
    const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile/${id}${locale === 'en' ? '' : `?language=${locale}`}`, { cache: 'no-store' });
    if (!profileRes.ok) notFound();
    profileData = await profileRes.json();
    const creatorId = profileData?.user?._id;
    if (creatorId) {
      const listingsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/listings/public?creatorId=${creatorId}${locale === 'en' ? '' : `&language=${locale}`}`, { cache: 'no-store' });
      if (listingsRes.ok) listings = (await listingsRes.json()).listings || [];
    }
  } catch (error) {
    console.error('Server fetch error:', error);
    notFound();
  }
  if (!profileData?.user) notFound();
  const user = profileData.user;
  const name = user?.profile?.displayName || `${user?.firstName} ${user?.lastName}`;
  const personSchema = {
    '@context': 'https://schema.org', '@type': 'Person', name,
    description: user?.profile?.bio || undefined,
    image: user?.profile?.profileImage ? { '@type': 'ImageObject', contentUrl: user.profile.profileImage, name: user._localizedSeo?.imageAlt || name } : undefined,
    url: absoluteSiteUrl(localizedPath(`/profile/${user?.slug || id}`, locale)),
    jobTitle: translate(locale, 'publicProfile.jobTitle'),
    worksFor: { '@type': 'Organization', name: user?.profile?.businessName || undefined },
    address: { '@type': 'PostalAddress', addressLocality: user?.profile?.city || undefined, addressCountry: user?.profile?.countryCode || undefined },
    sameAs: [user?.profile?.socialLink, user?.profile?.websiteLink].filter(Boolean),
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
    <h1 className="sr-only">{name} — {translate(locale, 'publicProfile.screenReaderSuffix')}</h1>
    <Suspense fallback={<LoadingFallback />}><PublicProfile initialData={profileData} initialListings={listings} /></Suspense>
  </>;
}

function LoadingFallback() {
  return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0f0f0f]"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;
}
