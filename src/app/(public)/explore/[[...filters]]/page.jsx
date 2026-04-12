import React from 'react'
import ExploreClient from '../ExploreClient';

export default function page({ params }) {
    // filters হবে একটি অ্যারে। উদাহরণ: ["artisan-jewelry", "europe"]
    const filters = params?.filters || [];

    // স্লাগ থেকে নরমাল টেক্সটে রূপান্তর (artisan-jewelry -> artisan jewelry)
    const categorySlug = filters[0] || 'All';
    const continentSlug = filters[1] || 'All Regions';

    // ড্যাশবোর্ড বা ব্যাকএন্ডে পাঠানোর জন্য টেক্সট ফরম্যাট করা
    const category = categorySlug.replace(/-/g, ' ');
    const continent = continentSlug.replace(/-/g, ' ');

    return (
        <ExploreClient
            initialCategory={category}
            initialContinent={continent}
        />
    );
}
