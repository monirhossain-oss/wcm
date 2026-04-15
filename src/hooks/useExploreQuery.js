import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { continentMapping } from '@/constants/continentData';

export const useExploreQuery = () => {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const filters = params.filters || [];

    const continentsList = Object.keys(continentMapping).map(c => c.toLowerCase());

    // ইউআরএল থেকে বর্তমান ডাটা রিড করা
    let category = 'All';
    let continent = 'All Regions';

    if (filters.length === 1) {
        const slug = filters[0].replace(/-/g, ' ');
        if (continentsList.includes(slug.toLowerCase())) {
            continent = slug;
        } else {
            category = slug;
        }
    } else if (filters.length >= 2) {
        category = filters[0].replace(/-/g, ' ');
        continent = filters[1].replace(/-/g, ' ');
    }

    const search = searchParams.get('search') || '';

    const updateQuery = useCallback((updates) => {
        // নতুন মান না থাকলে বর্তমান মান ব্যবহার করা
        const finalCategory = updates.category !== undefined ? updates.category : category;
        const finalContinent = updates.continent !== undefined ? updates.continent : continent;
        const finalSearch = updates.search !== undefined ? updates.search : search;

        let newPath = '/explore';
        const catSlug = finalCategory.toLowerCase().trim().replace(/\s+/g, '-');
        const contSlug = finalContinent.toLowerCase().trim().replace(/\s+/g, '-');

        // এসইও ফ্রেন্ডলি পাথ তৈরি
        if (finalCategory !== 'All' && finalContinent === 'All Regions') {
            newPath += `/${catSlug}`;
        } else if (finalCategory === 'All' && finalContinent !== 'All Regions') {
            newPath += `/${contSlug}`;
        } else if (finalCategory !== 'All' && finalContinent !== 'All Regions') {
            newPath += `/${catSlug}/${contSlug}`;
        }

        // সার্চ প্যারামিটার যোগ করা
        const queryParams = new URLSearchParams();
        if (finalSearch) {
            queryParams.set('search', finalSearch);
        }

        const finalUrl = queryParams.toString() ? `${newPath}?${queryParams.toString()}` : newPath;

        router.push(finalUrl, { scroll: false });
    }, [router, category, continent, search]);

    return { updateQuery, category, continent, search };
};