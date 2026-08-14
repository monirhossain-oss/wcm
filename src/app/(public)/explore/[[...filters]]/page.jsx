import ExploreClient from '../ExploreClient';
import { continentMapping } from '@/constants/continentData';
import { getSeoByPage } from '@/lib/api';
import { translate } from '@/lib/i18n';

// ── Shared helper: slug ke readable text e convert kora ──
function formatText(slug) {
    if (!slug) return '';
    let text = decodeURIComponent(slug).replace(/-/g, ' ');
    return text.replace(/\band\b/g, '&');
}

// ── Shared helper: URL filters theke category/continent/search bujhe ana ──
// generateMetadata() ar ExplorePage() dutoy eta call kore, tai logic ekbar e lekha + duplicate bug hoy na
function resolveExploreFilters(filters = []) {
    const continentsList = Object.keys(continentMapping).map((c) => c.toLowerCase().trim());

    let category = 'All';
    let continent = 'All Regions';
    let search = '';

    const searchIndex = filters.indexOf('search');
    if (searchIndex !== -1 && filters[searchIndex + 1]) {
        search = formatText(filters[searchIndex + 1]);
    }

    const baseFilters = searchIndex !== -1 ? filters.slice(0, searchIndex) : filters;

    if (baseFilters.length === 1) {
        const val = formatText(baseFilters[0]);
        const normalizedVal = val.toLowerCase().trim();

        if (continentsList.includes(normalizedVal)) {
            // মেইন ফিক্স: Latin America বা Middle East-এর মতো স্পেসওয়ালা নাম চেক করা
            const originalKey = Object.keys(continentMapping).find(
                (key) => key.toLowerCase().trim() === normalizedVal
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

    return { category, continent, search };
}

// ১. ডাইনামিক মেটাডাটা জেনারেটর
export async function generateMetadata({ params, locale = 'en' }) {
    const resolvedParams = await params;
    const filters = resolvedParams?.filters || [];

    const { category, continent } = resolveExploreFilters(filters);

    // Admin panel (/api/seo/explore) theke base SEO data ana — getSeoByPage 404 nijei handle kore
    const adminSeo = await getSeoByPage('explore');
    // console.log('🔍 [Explore Page] Base SEO from panel:', adminSeo); // 👈 terminal e dekhabe

    let finalTitle = locale === 'en' && adminSeo?.title ? adminSeo.title : translate(locale, 'explore.metaTitle');
    let finalDescription = locale === 'en' && adminSeo?.description ? adminSeo.description : translate(locale, 'explore.metaDescription');
    let finalKeywords = adminSeo?.keywords?.length ? adminSeo.keywords : ['Culture', 'WCM'];

    const isFiltered = category !== 'All' || continent !== 'All Regions';
    const localizedContinent = continent === 'All Regions'
        ? translate(locale, 'homeDiscovery.allRegions')
        : translate(locale, `homeDiscovery.regions.${continent}`, continent);
    const baseTitle = locale === 'en' && adminSeo?.title ? adminSeo.title : translate(locale, 'explore.metaTitle');

    if (isFiltered) {
        if (category !== 'All' && continent !== 'All Regions') {
            finalTitle = `${category} ${translate(locale, 'explore.from')} ${localizedContinent} | ${baseTitle}`;
        } else if (category !== 'All') {
            finalTitle = `${translate(locale, 'explore.categoryCollections')} : ${category} | ${baseTitle}`;
        } else if (continent !== 'All Regions') {
            finalTitle = `${translate(locale, 'explore.culturalHeritage')} ${localizedContinent} | ${baseTitle}`;
        }

        finalDescription = `${translate(locale, 'explore.filteredDescription')} ${finalDescription}`;
        finalKeywords = [category, continent, ...finalKeywords];
    }

    // console.log('✅ [Explore Page] Final metadata:', { finalTitle, finalDescription, isFiltered }); // 👈 terminal e dekhabe

    return {
        title: finalTitle,
        description: finalDescription,
        keywords: finalKeywords,
        openGraph: {
            title: finalTitle,
            description: finalDescription,
            images: [adminSeo?.ogImage || `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.jpg`],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: finalTitle,
            description: finalDescription,
            images: [adminSeo?.ogImage || `${process.env.NEXT_PUBLIC_SITE_URL}/og-image.jpg`],
        },
    };
}

// ২. মেইন পেজ কম্পোনেন্ট
export default async function ExplorePage({ params, locale = 'en' }) {
    const resolvedParams = await params;
    const filters = resolvedParams?.filters || [];

    const { category, continent, search } = resolveExploreFilters(filters);

    // h1-এর জন্য ডাইনামিক টেক্সট বানানো
    let pageHeading = translate(locale, 'explore.heading');
    if (category !== 'All' && continent !== 'All Regions') {
        pageHeading = `${category} ${translate(locale, 'explore.from')} ${continent}`;
    } else if (category !== 'All') {
        pageHeading = `${translate(locale, 'explore.categoryCollections')} : ${category}`;
    } else if (continent !== 'All Regions') {
        pageHeading = `${translate(locale, 'explore.culturalHeritage')} ${translate(locale, `homeDiscovery.regions.${continent}`, continent)}`;
    }

    return (
        <>
            <h1 className="sr-only">{pageHeading}</h1>
            <ExploreClient
                serverCategory={category}
                serverContinent={continent}
                serverSearch={search}
            />
        </>
    );
}
