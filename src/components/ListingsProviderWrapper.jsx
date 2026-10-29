'use client';
import { useEffect } from 'react';
import { useListings } from '@/context/ListingsContext';

export default function ListingsProviderWrapper({ data }) {
    const { setCachedListings } = useListings();

    useEffect(() => {
        if (data && data.length > 0) {
            setCachedListings(data);
        }
    }, [data, setCachedListings]);

    return null;
}