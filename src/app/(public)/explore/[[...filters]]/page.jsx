import ExploreClient from '../ExploreClient';
import { continentMapping } from '@/constants/continentData';

// ১. ডাইনামিক মেটাডাটা জেনারেটর
export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const filters = resolvedParams?.filters || [];

    const formatText = (slug) => {
        if (!slug) return '';
        let text = decodeURIComponent(slug).replace(/-/g, ' ');
        return text.replace(/\band\b/g, '&');
    };

    let category = 'All';
    let continent = 'All Regions';

    const searchIndex = filters.indexOf('search');
    const baseFilters = searchIndex !== -1 ? filters.slice(0, searchIndex) : filters;

    // কনটিনেন্ট লিস্টকে ছোট হাতের অক্ষরে নিয়ে আসা (তুলনার জন্য)
    const continentsList = Object.keys(continentMapping).map(c => c.toLowerCase().trim());

    if (baseFilters.length === 1) {
        const val = formatText(baseFilters[0]);
        const normalizedVal = val.toLowerCase().trim();

        if (continentsList.includes(normalizedVal)) {
            const originalKey = Object.keys(continentMapping).find(
                key => key.toLowerCase().trim() === normalizedVal
            );
            continent = originalKey || val;
            category = 'All';
        } else {
            category = val;
            continent = 'All Regions';
        }
    } else if (baseFilters.length >= 2) {
        category = formatText(baseFilters[0]);
        continent = formatText(baseFilters[1]);
    }

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/seo/explore`, {
            next: { revalidate: 3600 }
        });
        const adminSeo = await res.json();

        let finalTitle = adminSeo?.title || 'Explore World Culture';
        let finalDescription = adminSeo?.description || 'Discover unique global heritage.';
        let finalKeywords = adminSeo?.keywords || ['Culture', 'WCM'];

        const isFiltered = category !== 'All' || continent !== 'All Regions';

        if (isFiltered) {
            if (category !== 'All' && continent !== 'All Regions') {
                finalTitle = `${category} from ${continent} | ${adminSeo?.title || 'WCM'}`;
            } else if (category !== 'All') {
                finalTitle = `${category} Collections | ${adminSeo?.title || 'WCM'}`;
            } else if (continent !== 'All Regions') {
                finalTitle = `Cultural Heritage of ${continent} | ${adminSeo?.title || 'WCM'}`;
            }

            finalDescription = `Explore the best ${category} from ${continent}. ${finalDescription}`;
            finalKeywords = [category, continent, ...finalKeywords];
        }

        return {
            title: finalTitle,
            description: finalDescription,
            keywords: finalKeywords,
            openGraph: {
                title: finalTitle,
                description: finalDescription,
            }
        };
    } catch (error) {
        return {
            title: 'Explore | World Culture Marketplace',
            description: 'Discover unique handmade products and cultural traditions.',
        };
    }
}

// ২. মেইন পেজ কম্পোনেন্ট
export default async function ExplorePage({ params }) {
    const resolvedParams = await params;
    const filters = resolvedParams?.filters || [];

    const continentsList = Object.keys(continentMapping).map(c => c.toLowerCase().trim());

    const slugToText = (slug) => {
        if (!slug) return '';
        let text = decodeURIComponent(slug).replace(/-/g, ' ');
        return text.replace(/\band\b/g, '&');
    };

    let category = 'All';
    let continent = 'All Regions';
    let search = '';

    const searchIndex = filters.indexOf('search');
    if (searchIndex !== -1 && filters[searchIndex + 1]) {
        search = slugToText(filters[searchIndex + 1]);
    }

    const baseFilters = searchIndex !== -1 ? filters.slice(0, searchIndex) : filters;

    if (baseFilters.length === 1) {
        const textValue = slugToText(baseFilters[0]);
        const normalizedVal = textValue.toLowerCase().trim();

        // মেইন ফিক্স: Latin America বা Middle East-এর মতো স্পেসওয়ালা নাম চেক করা
        if (continentsList.includes(normalizedVal)) {
            const originalKey = Object.keys(continentMapping).find(
                key => key.toLowerCase().trim() === normalizedVal
            );
            continent = originalKey || textValue;
            category = 'All';
        } else {
            category = textValue;
            continent = 'All Regions';
        }
    } else if (baseFilters.length >= 2) {
        category = slugToText(baseFilters[0]);
        continent = slugToText(baseFilters[1]);
    }

    return (
        <ExploreClient
            serverCategory={category}
            serverContinent={continent}
            serverSearch={search}
        />
    );
}