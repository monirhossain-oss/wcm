import axios from 'axios';
import ListingDetailsClient from '../ListingDetailsClient';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

// ১. ডাইনামিক মেটাডাটা (SEO)
export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const res = await axios.get(`${API_BASE_URL}/api/listings/${id}`);
    const product = res.data;

    return {
      title: `${product.title} | World Culture Marketplace`,
      description: product.description,
      openGraph: {
        images: [product.image.startsWith('http') ? product.image : `${API_BASE_URL}/${product.image}`],
      },
    };
  } catch (error) {
    return { title: 'Listing Details' };
  }
}

export default async function Page({ params }) {
  const { id } = await params;
  let initialProduct = null;
  let initialRelated = [];

  try {
    // সার্ভারে মেইন ডাটা ফেচ
    const res = await axios.get(`${API_BASE_URL}/api/listings/${id}`);
    initialProduct = res.data;

    // রিলেটেড লিস্টিং ফেচ
    if (initialProduct?.creatorId?._id) {
      const relatedRes = await axios.get(
        `${API_BASE_URL}/api/listings/public?creatorId=${initialProduct.creatorId._id}&limit=5`
      );
      initialRelated = (relatedRes.data.listings || [])
        .filter((item) => item._id !== id)
        .slice(0, 4);
    }
  } catch (error) {
    console.error("Server Fetch Error:", error);
  }

  if (!initialProduct) return <div className="p-20 text-center">Asset not found.</div>;

  return (
    <ListingDetailsClient
      initialProduct={initialProduct}
      initialRelated={initialRelated}
    />
  );
}