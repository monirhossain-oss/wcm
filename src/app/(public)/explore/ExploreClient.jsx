'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useExploreQuery } from '@/hooks/useExploreQuery';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import FilterBar from '@/components/explore/FilterBar';
import SkeletonLoader from '@/components/explore/SkeletonLoader';
import ListingGrid from '@/components/ListingGrid';

export default function ExploreClient() {
    const { category, continent, search } = useExploreQuery();

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [total, setTotal] = useState(0);

    const observerTarget = useRef(null);
    // রিকোয়েস্ট লুপ বন্ধ করতে বর্তমান অফসেট ট্র্যাক করার জন্য রিফ
    const currentOffsetRef = useRef(0);

    const fetchListings = useCallback(async (isInitial = true) => {
        if (loading || (!isInitial && fetchingMore)) return;

        if (isInitial) {
            setLoading(true);
            setHasMore(true);
            currentOffsetRef.current = 0;
        } else {
            setFetchingMore(true);
        }

        try {
            const params = {
                limit: 12,
                offset: currentOffsetRef.current,
                ...(category !== 'All' && { category }),
                ...(continent !== 'All Regions' && { continent }),
                ...(search && { search })
            };

            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/listings/public`, { params });

            if (res.data.success) {
                const newListings = res.data.listings || [];

                setListings(prev => isInitial ? newListings : [...prev, ...newListings]);
                setTotal(res.data.total || 0);
                setHasMore(res.data.hasMore);
                // পরবর্তী অফসেট আপডেট করা
                currentOffsetRef.current += newListings.length;
            }
        } catch (err) {
            console.error('Fetch Error:', err);
        } finally {
            setLoading(false);
            setFetchingMore(false);
        }
    }, [category, continent, search]); // listings.length এখান থেকে সরানো হয়েছে (লুপ বন্ধ করতে)

    useEffect(() => {
        fetchListings(true);
    }, [category, continent, search, fetchListings]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !fetchingMore && !loading) {
                    fetchListings(false);
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) observer.observe(observerTarget.current);
        return () => observer.disconnect();
    }, [fetchListings, hasMore, fetchingMore, loading]);

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pb-20">
            <FilterBar />
            <div className="max-w-7xl mx-auto px-6 py-8">
                {loading ? (
                    <SkeletonLoader />
                ) : listings.length > 0 ? (
                    <>
                        <ListingGrid listings={listings} />
                        <div ref={observerTarget} className="h-24 flex items-center justify-center mt-10">
                            {fetchingMore && (
                                <div className="flex items-center gap-2 text-orange-500 font-medium">
                                    <Loader2 className="animate-spin" size={20} />
                                    Loading more...
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <AlertCircle size={48} className="text-zinc-200 mb-4" />
                        <h3 className="text-lg font-bold dark:text-white">No listings found</h3>
                        <p className="text-zinc-500 text-sm">Try searching for something else.</p>
                    </div>
                )}
            </div>
        </div>
    );
}