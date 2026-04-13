'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useExploreQuery } from '@/hooks/useExploreQuery';
import { Loader2, AlertCircle } from 'lucide-react';
import FilterBar from '@/components/explore/FilterBar';
import SkeletonLoader from '@/components/explore/SkeletonLoader';
import ListingGrid from '@/components/ListingGrid';

export default function ExploreClient({ serverCategory, serverContinent, serverSearch }) {
    // হুক থেকে ডাটা নিচ্ছি (যা এখন ইউআরএল পাথ থেকে আসবে)
    const { category, continent, search } = useExploreQuery();

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [total, setTotal] = useState(0);

    const observerTarget = useRef(null);
    const currentOffsetRef = useRef(0);

    const fetchListings = useCallback(async (isInitial = true) => {
        // লোডিং থাকলে বা ডাটা শেষ হয়ে গেলে রিকোয়েস্ট আটকানো
        if (loading || (!isInitial && fetchingMore)) return;

        if (isInitial) {
            setLoading(true);
            setHasMore(true);
            currentOffsetRef.current = 0;
            // স্ক্রোল পজিশন উপরে নিয়ে যাওয়া (এসইও ফ্রেন্ডলি পেজ ট্রানজিশন)
            if (typeof window !== 'undefined') window.scrollTo(0, 0);
        } else {
            setFetchingMore(true);
        }

        try {
            const params = {
                limit: 12,
                offset: currentOffsetRef.current,
                // 'All' হলে এপিআই-তে পাঠানোর দরকার নেই যদি আপনার ব্যাকএন্ড সেভাবে হ্যান্ডেল করে
                ...(category !== 'All' && { category }),
                ...(continent !== 'All Regions' && { continent }),
                // পাথ থেকে পাওয়া সার্চ ভ্যালু
                ...(search && { search })
            };

            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/listings/public`, { params });

            if (res.data.success) {
                const newListings = res.data.listings || [];

                setListings(prev => isInitial ? newListings : [...prev, ...newListings]);
                setTotal(res.data.total || 0);
                setHasMore(res.data.hasMore);

                // অফসেট আপডেট
                currentOffsetRef.current += newListings.length;
            }
        } catch (err) {
            console.error('Fetch Error:', err);
            if (isInitial) setListings([]);
        } finally {
            setLoading(false);
            setFetchingMore(false);
        }
    }, [category, continent, search]);

    // ফিল্টার বা সার্চ চেঞ্জ হলে নতুন করে ডাটা ফেচ হবে
    useEffect(() => {
        fetchListings(true);
    }, [category, continent, search, fetchListings]);

    // ইনফিনিটি স্ক্রোল লজিক
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

                        {/* ইনফিনিটি স্ক্রোল লোডার */}
                        <div ref={observerTarget} className="h-24 flex items-center justify-center mt-10">
                            {fetchingMore && (
                                <div className="flex items-center gap-2 text-orange-500 font-medium">
                                    <Loader2 className="animate-spin" size={20} />
                                    Loading more...
                                </div>
                            )}
                            {!hasMore && total > 0 && (
                                <p className="text-zinc-400 text-sm italic">End of results.</p>
                            )}
                        </div>
                    </>
                ) : (
                    /* ডাটা না পাওয়া গেলে */
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <div className="w-20 h-20 bg-zinc-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                            <AlertCircle size={32} className="text-zinc-300" />
                        </div>
                        <h3 className="text-xl font-bold dark:text-white">No listings found</h3>
                        <p className="text-zinc-500 text-sm max-w-xs mx-auto mt-2">
                            We couldn't find anything matching your current filters or search.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}