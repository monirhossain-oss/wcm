import ExploreClient from '../ExploreClient';
import { continentMapping } from '@/constants/continentData';
import { getCategories, getLocalizedCategoryTitles } from '@/lib/api';
import { buildPageMetadata, resolvePageSeo } from '@/lib/seo/pageMetadata';
import { resolveExploreIndexing } from '@/lib/seo/indexing';
import { slugsMatch } from '@/lib/exploreSlug';
import { translate } from '@/lib/i18n';

// ── Shared helper: slug ke readable text e convert kora ──
function formatText(slug) {
    if (!slug) return '';
    let text = decodeURIComponent(slug).replace(/-/g, ' ');
    return text.replace(/\band\b/g, '&');
}

// ── Shared helper: description ekta bakko, tai prothom okkhor boro hoy ──
// A category name built from the URL slug arrives lowercase ("textiles"). A published translation
// already arrives capitalised, and upper-casing one character is a no-op there.
function sentenceCase(text) {
    const value = String(text || '');
    return value ? value.charAt(0).toUpperCase() + value.slice(1) : value;
}

// ── Shared helper: URL filters theke category/continent/search bujhe ana ──
// generateMetadata() ar ExplorePage() dutoy eta call kore, tai logic ekbar e lekha + duplicate bug hoy na
function resolveExploreFilters(filters = []) {

    let category = 'All';
    let continent = 'All Regions';
    let search = '';

    const searchIndex = filters.indexOf('search');
    if (searchIndex !== -1 && filters[searchIndex + 1]) {
        search = formatText(filters[searchIndex + 1]);
    }

    const baseFilters = searchIndex !== -1 ? filters.slice(0, searchIndex) : filters;

    if (baseFilters.length === 1) {
        // Region slug "middle-east" style, kintu formatText dash ke space kore dey — tai milano hoy
        // indexing policy ar client hook-er same slug rule (exploreSlug) diye.
        const regionKey = Object.keys(continentMapping).find((key) => slugsMatch(key, baseFilters[0]));

        if (regionKey) {
            continent = regionKey;
            category = 'All';
        } else {
            category = formatText(baseFilters[0]);
            continent = 'All Regions';
        }
    } else if (baseFilters.length >= 2) {
        category = formatText(baseFilters[0]);
        continent = formatText(baseFilters[1]);
    }

    return { category, continent, search };
}

// ── Filter name gulo current language e dekhano ──
// URL slug bodlay na; shudhu visible text (title/H1) er jonno localized name neya hoy.
async function resolveFilterNames({ category, continent, locale, categories }) {
    // Two-filter URL e continent ta "north america" hoye ashe, tai catalog key (master slug) khuje ber kora hoy.
    const regionKey = Object.keys(continentMapping).find((key) => slugsMatch(key, continent));
    const localizedContinent = continent === 'All Regions'
        ? translate(locale, 'homeDiscovery.allRegions')
        : translate(locale, `homeDiscovery.regions.${regionKey || continent}`, continent);
    // Ready-made phrase: "textiles from Asia" / "textiles d’Asie" ar "Cultural Heritage of Asia" /
    // "Patrimoine culturel d’Asie". Unknown region hole shudhu nam-e fallback kore.
    const fromRegion = translate(locale, `homeDiscovery.regionsOf.${regionKey || continent}`,
        `${translate(locale, 'explore.from')} ${localizedContinent}`);
    const ofRegion = translate(locale, `homeDiscovery.regionsHeritage.${regionKey || continent}`, localizedContinent);
    const names = { category, continent: localizedContinent, fromRegion, ofRegion };
    if (!locale || locale === 'en' || category === 'All') return names;

    const master = (categories || await getCategories()).find((item) => slugsMatch(item?.title, category));
    if (!master) return names;
    // Translation na thakle backend master title-i ferot dey; sekhetre URL theke banano nam-i rakha hoy,
    // jate French page e hoothat kore raw master title na dekhay.
    const localizedTitle = (await getLocalizedCategoryTitles(locale)).get(String(master._id));
    return { ...names, category: localizedTitle && localizedTitle !== master.title ? localizedTitle : category };
}

// ১. ডাইনামিক মেটাডাটা জেনারেটর
export async function generateMetadata({ params, locale = 'en' }) {
    const resolvedParams = await params;
    const filters = resolvedParams?.filters || [];

    const { category, continent } = resolveExploreFilters(filters);

    // Language-specific SEO record (/api/seo/explore?languageCode=…) with catalog fallback
    const base = await resolvePageSeo({ pageId: 'explore', locale });

    // Stage 5: only a valid category/region combination is indexable. Explore URLs carry master
    // category slugs in both languages, so one master list validates English and French alike.
    const categories = await getCategories();
    const { indexable } = resolveExploreIndexing(filters, categories);

    let finalTitle = base.title;
    let finalDescription = base.description;
    let finalKeywords = base.keywords;

    const isFiltered = category !== 'All' || continent !== 'All Regions';
    const localized = await resolveFilterNames({ category, continent, locale, categories });

    // A filtered title is the filter phrase plus the one brand suffix buildPageMetadata adds. The
    // stored Explore title used to sit between them, which pushed a two-filter URL past 120
    // characters — roughly twice what a search result shows. The stored title still owns /explore.
    // Title and description take the same three branches so a filtered URL never describes itself
    // as something the heading contradicts. The description is composed rather than prefixed onto
    // the stored record: one stored sentence in front of every category/region combination is a
    // duplicate description by construction, which is exactly what the audit found. Each branch
    // ends differently, so two filtered URLs never share a sentence, and every result stays inside
    // the ~160 characters a search result shows. The stored record still owns unfiltered /explore.
    // Each phrase leads with the filter name and no article, so French gender and number never
    // have to agree with a category title; region elision (d'Asie, du Moyen-Orient) already comes
    // ready-made from homeDiscovery.regionsOf / regionsHeritage.
    if (isFiltered) {
        if (category !== 'All' && continent !== 'All Regions') {
            finalTitle = `${sentenceCase(localized.category)} ${localized.fromRegion}`;
            finalDescription = `${sentenceCase(localized.category)} ${localized.fromRegion} ${translate(locale, 'explore.descriptionCategoryRegion')}`;
        } else if (category !== 'All') {
            finalTitle = `${translate(locale, 'explore.categoryCollections')} : ${sentenceCase(localized.category)}`;
            finalDescription = `${sentenceCase(localized.category)} ${translate(locale, 'explore.descriptionCategory')}`;
        } else if (continent !== 'All Regions') {
            finalTitle = `${translate(locale, 'explore.culturalHeritage')} ${localized.ofRegion}`;
            finalDescription = `${translate(locale, 'explore.culturalHeritage')} ${localized.ofRegion} ${translate(locale, 'explore.descriptionRegion')}`;
        }

        finalKeywords = [localized.category, localized.continent, ...finalKeywords];
    }

    return buildPageMetadata({
        pageId: 'explore',
        locale,
        resolved: base,
        path: filters.length ? `/explore/${filters.join('/')}` : '/explore',
        title: finalTitle,
        description: finalDescription,
        keywords: finalKeywords,
        indexable,
    });
}

// ২. মেইন পেজ কম্পোনেন্ট
export default async function ExplorePage({ params, locale = 'en' }) {
    const resolvedParams = await params;
    const filters = resolvedParams?.filters || [];

    const { category, continent, search } = resolveExploreFilters(filters);

    // h1-এর জন্য ডাইনামিক টেক্সট বানানো — metadata-র মতো একই localized filter name ব্যবহার করে
    const localized = await resolveFilterNames({ category, continent, locale });
    let pageHeading = translate(locale, 'explore.heading');
    if (category !== 'All' && continent !== 'All Regions') {
        pageHeading = `${localized.category} ${localized.fromRegion}`;
    } else if (category !== 'All') {
        pageHeading = `${translate(locale, 'explore.categoryCollections')} : ${localized.category}`;
    } else if (continent !== 'All Regions') {
        pageHeading = `${translate(locale, 'explore.culturalHeritage')} ${localized.ofRegion}`;
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
