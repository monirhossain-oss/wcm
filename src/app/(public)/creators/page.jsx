import axios from 'axios';
import CreatorsClient from './CreatorsClient';
import { getSeoByPage } from '@/lib/api';
import { translate } from '@/lib/i18n';
import { buildLocalizedMetadata, getPublishedLanguageCodes } from '@/lib/localizedMetadata';

// ১. ডাইনামিক মেটাডাটা ফাংশন — Admin panel (/api/seo/creators) theke title/description/keywords
export async function generateMetadata({ locale = 'en' } = {}) {
  const seoData = await getSeoByPage('creators');

  const title = locale === 'en' && seoData?.title ? seoData.title : translate(locale, 'creators.metaTitle');
  const description = locale === 'en' && seoData?.description ? seoData.description : translate(locale, 'creators.metaDescription');
  const image = seoData?.ogImage || '/og-creators.jpg';

  return {
    ...buildLocalizedMetadata({
      locale,
      path: '/creators',
      title,
      description,
      image,
      languages: await getPublishedLanguageCodes(),
    }),
    keywords: seoData?.keywords?.length ? seoData.keywords : ['creators', 'culture', 'global artists', 'WCM'],
  };
}

// ২. ডাটা ফেচিং ফাংশন (Creators এবং Categories এর জন্য)
async function getCreatorsData(locale = 'en') {
  try {
    const [creatorRes, metaRes] = await Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/famous-creators?limit=1000&offset=0${locale === 'en' ? '' : `&language=${locale}`}`),
      axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/listings/meta-data${locale === 'en' ? '' : `?language=${locale}`}`),
    ]);

    const creators = creatorRes.data.success ? creatorRes.data.data || [] : [];
    const categories = metaRes.data.categories || [];

    return { creators, categories };
  } catch (error) {
    console.error("Data fetching error:", error);
    return { creators: [], categories: [] };
  }
}

// ৩. মেইন পেজ কম্পোনেন্ট
export default async function CreatorsPage({ locale = 'en' }) {
  const { creators, categories } = await getCreatorsData(locale);

  return (
    <main className="bg-white dark:bg-[#0a0a0a]">
      <CreatorsClient
        initialCreators={creators}
        categories={categories}
      />
    </main>
  );
}
