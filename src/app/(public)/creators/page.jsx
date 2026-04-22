import axios from 'axios';
import CreatorsClient from './CreatorsClient';

// ১. ডাইনামিক মেটাডাটা ফাংশন (এপিআই থেকে ডাটা আনবে)
export async function generateMetadata() {
  try {
    // আপনার ব্যাকএন্ড এপিআই কল (pageName: creators)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/seo/creators`, {
      // next: { revalidate: 60 } // প্রতি ৬০ সেকেন্ড পর পর ডাটা চেক করবে
    });

    const data = await res.json();

    return {
      title: data?.title || 'Discover Global Creators | WCM',
      description: data?.description || 'Explore talented creators from around the world showcased on World Culture Marketplace.',
      keywords: data?.keywords || ['creators', 'culture', 'global artists', 'WCM'],
      openGraph: {
        title: data?.title || 'Discover Global Creators | WCM',
        description: data?.description || 'Explore talented creators worldwide.',
        images: [data?.ogImage || '/og-creators.jpg'], // ডাটাবেজে ইমেজ থাকলে সেটা নিবে
      },
    };
  } catch (error) {
    // এপিআই কাজ না করলে ব্যাকআপ ডিফল্ট মেটাডাটা
    return {
      title: 'Creators | World Culture Marketplace',
      description: 'Discover our mission and global cultural heritage.',
    };
  }
}

// ২. ডাটা ফেচিং ফাংশন (Creators এবং Categories এর জন্য)
async function getCreatorsData() {
  try {
    const [creatorRes, metaRes] = await Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/top-creators-dropdown`),
      axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/listings/meta-data`),
    ]);

    const creators = creatorRes.data.success ? creatorRes.data.data.top30 || [] : [];
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