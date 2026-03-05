// components/CultureDataWrapper.js
import CultureSlider from './CultureSlider';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export default async function CultureDataWrapper() {
    try {
        // এখানে সার্ভার ডেটার জন্য অপেক্ষা করবে, কিন্তু Suspense থাকায় মেইন পেজ আটকাবে না
        const res = await fetch(`${API_BASE_URL}/api/listings/meta-data?page=1&limit=12`, {
            next: { revalidate: 3600 }
        });

        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        const tags = data.tags || [];

        if (tags.length === 0) return null;

        return <CultureSlider tags={tags} API_BASE_URL={API_BASE_URL} />;
    } catch (err) {
        console.error("Fetch Error:", err);
        return <div className="text-xs text-gray-400">Failed to load traditions.</div>;
    }
}