'use client';

import { useState } from 'react';
import HeroSection from './HeroSection';

export default function HomeClientWrapper() {
    const [filters, setFilters] = useState({
        category: '',
        region: '',
        tradition: '',
    });

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <>
            <HeroSection onFilterChange={handleFilterChange} filters={filters} />
        </>
    );
}