import { useRouter, useParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { continentMapping } from '@/constants/continentData';

export const useExploreQuery = () => {
    const router = useRouter();
    const params = useParams();
    const filters = params?.filters || [];

    // এখন কিগুলো সরাসরি ড্যাশসহ আছে: ["asia", "middle-east", "north-america"...]
    const continentsKeys = useMemo(() => Object.keys(continentMapping), []);

    // স্লাগ থেকে নরমাল টেক্সট (ক্যাটাগরির জন্য)
    const slugToText = (slug) => {
        if (!slug) return '';
        return decodeURIComponent(slug).replace(/-/g, ' ').trim();
    };

    // টেক্সট থেকে ইউআরএল স্লাগ
    const textToSlug = (text) => {
        if (!text || text.toLowerCase() === 'all' || text.toLowerCase() === 'all regions') return null;
        return text.toString().toLowerCase().trim()
            .replace(/&/g, 'and')
            .replace(/\s+/g, '-')
            .replace(/[^-a-z0-9]/g, '')
            .replace(/-+/g, '-');
    };

    let category = 'All';
    let continent = 'All Regions';
    let search = '';

    const searchIndex = filters.indexOf('search');
    if (searchIndex !== -1 && filters[searchIndex + 1]) {
        search = slugToText(filters[searchIndex + 1]);
    }

    const baseFilters = searchIndex !== -1 ? filters.slice(0, searchIndex) : filters;

    // ১. ইউআরএল থেকে রিড করার লজিক
    if (baseFilters.length === 1) {
        const val = baseFilters[0].toLowerCase(); // সরাসরি স্লাগ নিচ্ছি (যেমন: middle-east)

        if (continentsKeys.includes(val)) {
            continent = val;   // মহাদেশ হিসেবে সেট হবে
            category = 'All';
        } else {
            category = slugToText(val); // মহাদেশ না হলে ক্যাটাগরি
        }
    } else if (baseFilters.length >= 2) {
        category = slugToText(baseFilters[0]);
        continent = baseFilters[1].toLowerCase();
    }

    const updateQuery = useCallback((updates) => {
        let finalCategory = updates.category !== undefined ? updates.category : category;
        let finalContinent = updates.continent !== undefined ? updates.continent : continent;
        let finalSearch = updates.search !== undefined ? updates.search : search;

        // ২. যদি ক্যাটাগরি স্লটে ভুল করে মহাদেশ চলে আসে (স্লাইডার ফিক্স)
        const catAsSlug = textToSlug(finalCategory);
        if (catAsSlug && continentsKeys.includes(catAsSlug)) {
            finalContinent = catAsSlug;
            finalCategory = 'All';
        }

        // ৩. ইউআরএল তৈরি
        let pathParts = ['explore'];
        const catSlug = textToSlug(finalCategory);
        const contSlug = textToSlug(finalContinent); // continent ও এখন ড্যাশসহ হবে

        if (catSlug) pathParts.push(catSlug);
        if (contSlug) pathParts.push(contSlug);

        if (finalSearch && finalSearch.trim() !== '') {
            pathParts.push('search', textToSlug(finalSearch));
        }

        router.push(`/${pathParts.join('/')}`, { scroll: false });
    }, [router, category, continent, search, continentsKeys]);

    return { updateQuery, category, continent, search };
};