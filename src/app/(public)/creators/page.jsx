import axios from 'axios';
import CreatorsClient from './CreatorsClient';
import { getSeoByPage } from '@/lib/api';

// ১. ডাইনামিক মেটাডাটা ফাংশন — Admin panel (/api/seo/creators) theke title/description/keywords
export async function generateMetadata() {
  const seoData = await getSeoByPage('creators');

  const title = seoData?.title || 'Discover Global Creators | WCM';
  const description = seoData?.description || 'Explore talented creators from around the world showcased on World Culture Marketplace.';

  return {
    title,
    description,
    keywords: seoData?.keywords?.length ? seoData.keywords : ['creators', 'culture', 'global artists', 'WCM'],
    openGraph: {
      title,
      description,
      images: [seoData?.ogImage || '/og-creators.jpg'], // ডাটাবেজে ইমেজ থাকলে সেটা নিবে
    },
  };
}

// ২. ডাটা ফেচিং ফাংশন (Creators এবং Categories এর জন্য)
async function getCreatorsData() {
  try {
    const [creatorRes, metaRes] = await Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/famous-creators?limit=1000&offset=0`),
      axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/listings/meta-data`),
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
export default async function CreatorsPage() {
  const { creators, categories } = await getCreatorsData();

  return (
    <main className="bg-white dark:bg-[#0a0a0a]">
      <CreatorsClient
        initialCreators={creators}
        categories={categories}
      />
    </main>
  );
}