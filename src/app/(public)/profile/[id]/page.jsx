import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import PublicProfile from './PublicProfile';

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile/${id}`,
      { cache: 'no-store' }
    );

    if (!res.ok) return { title: 'Profile Not Found | WCM' };

    const data = await res.json();
    const user = data.user;
    const name = user?.profile?.displayName || `${user?.firstName} ${user?.lastName}`;

    return {
      title: `${name} | WCM Creator Profile`,
      description: user?.profile?.bio || `${name} — Cultural Creator on WCM`,
      keywords: [user?.profile?.country, user?.profile?.tradition, 'WCM', 'creator', 'marketplace'],
      openGraph: {
        title: `${name} — World Culture Marketplace`,
        description: user?.profile?.bio,
        images: [user?.profile?.profileImage || `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.jpg`],
        type: 'profile',
      },
      twitter: {
        card: 'summary_large_image',
        title: name,
        description: user?.profile?.bio,
        images: [user?.profile?.profileImage || `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.jpg`],
      },
      alternates: {
        canonical: `/profile/${id}`,
      },
    };
  } catch {
    return { title: 'Creator Profile | WCM' };
  }
}

export default async function Page({ params }) {
  const { id } = await params;

  let profileData = null;
  let listings = [];

  try {
    const profileRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile/${id}`,
      { cache: 'no-store' }
    );

    if (!profileRes.ok) notFound();

    profileData = await profileRes.json();

    const creatorId = profileData?.user?._id;

    if (creatorId) {
      const listingsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/listings/public?creatorId=${creatorId}`,
        { cache: 'no-store' }
      );
      if (listingsRes.ok) {
        const data = await listingsRes.json();
        listings = data.listings || [];
      }
    }
  } catch (error) {
    console.error('Server fetch error:', error);
    notFound();
  }

  if (!profileData || !profileData.user) notFound();

  const user = profileData.user;
  const name = user?.profile?.displayName || `${user?.firstName} ${user?.lastName}`;

  // ✅ Person Schema
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: user?.profile?.displayName || `${user?.firstName} ${user?.lastName}`,
    description: user?.profile?.bio || undefined,
    image: user?.profile?.profileImage || undefined,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/creator/${user?.slug}`,
    jobTitle: 'Cultural Creator',
    worksFor: {
      '@type': 'Organization',
      name: user?.profile?.businessName || undefined,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: user?.profile?.city || undefined,
      addressCountry: user?.profile?.countryCode || undefined,
    },
    sameAs: [
      user?.profile?.socialLink || undefined,
      user?.profile?.websiteLink || undefined,
    ].filter(Boolean),
  };

  return (
    <>
      {/* ✅ JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <h1 className="sr-only">
        {name} — Cultural Creator Profile on World Culture Marketplace
      </h1>

      <Suspense fallback={<LoadingFallback />}>
        <PublicProfile
          initialData={profileData}
          initialListings={listings}
        />
      </Suspense>
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0f0f0f]">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}