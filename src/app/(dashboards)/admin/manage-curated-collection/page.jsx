'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    FiLayers,
    FiRefreshCw,
    FiClock,
    FiChevronLeft,
    FiChevronRight,
    FiPin,
    FiTrash2,
    FiFilter,
    FiPhoneIncoming,
} from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';

// আপনার দেওয়া Axios Instance
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true,
});

const CURATED_CACHE_KEY = 'wcm_admin_curated_cache';
const CACHE_EXPIRY = 1 * 60 * 1000; // ১ মিনিট ক্যাশ

export default function ManageCuratedCollection() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [lastSynced, setLastSynced] = useState(null);

    // ক্যাটাগরি ফেচ করা
    const fetchCategories = useCallback(async () => {
        try {
            const res = await api.get('/api/admin/categories');
            setCategories(res.data);
            if (res.data.length > 0 && !selectedCategory) {
                setSelectedCategory(res.data[0]._id);
            }
        } catch (err) {
            toast.error('Failed to load categories');
        }
    }, [selectedCategory]);

    // লিস্টিং ফেচ করা (Cache এবং Force Refresh সহ)
    const fetchListings = useCallback(async (isForce = false) => {
        if (!selectedCategory) return;

        try {
            if (isForce) setRefreshing(true);
            else setLoading(true);

            const res = await api.get(`/api/admin/listings?category=${selectedCategory}`);

            // ডাটা সেট করার সময় চেক করুন সেটি অ্যারে কি না
            // আপনার প্রোভাইড করা ডাটা অনুযায়ী সরাসরি res.data ব্যবহার করুন
            const fetchedData = Array.isArray(res.data) ? res.data : (res.data.listings || []);

            setListings(fetchedData);

            const timestamp = Date.now();
            setLastSynced(timestamp);
            localStorage.setItem(
                `${CURATED_CACHE_KEY}_${selectedCategory}`,
                JSON.stringify({ data: fetchedData, timestamp })
            );

        } catch (err) {
            console.error("Listing Fetch Error:", err);
            toast.error('Failed to sync listings');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [selectedCategory]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchListings();
    }, [fetchListings]);

    // পিন করার লজিক
    const handlePin = async (listingId, position) => {
        setActionLoading(true);
        try {
            await api.patch(`/api/admin/listings/${listingId}/pin`, {
                categoryId: selectedCategory,
                position: Number(position),
            });
            toast.success(`Pinned to Slot ${position}`);
            fetchListings(true); // লিস্ট রিফ্রেশ করা
        } catch (err) {
            toast.error(err.response?.data?.message || 'Action failed');
        } finally {
            setActionLoading(false);
        }
    };

    // আনপিন করার লজিক
    const handleUnpin = async (listingId) => {
        setActionLoading(true);
        try {
            await api.patch(`/api/admin/listings/${listingId}/unpin`);
            toast.success('Listing Unpinned');
            fetchListings(true);
        } catch (err) {
            toast.error('Action failed');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading && !refreshing)
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20 font-sans">
            <Toaster position="top-right" />

            {/* Header & Filter */}
            <div className="bg-white dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
                <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-black uppercase italic dark:text-white">
                            Curated <span className="text-orange-500">Collection</span>
                        </h2>
                        <button
                            onClick={() => fetchListings(true)}
                            disabled={refreshing}
                            className={`p-2 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-500 transition-all ${refreshing ? 'animate-spin' : 'hover:bg-orange-500 hover:text-white'
                                }`}
                        >
                            <FiRefreshCw size={14} />
                        </button>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-100 dark:bg-white/5 p-2 rounded-lg border dark:border-white/10">
                        <FiFilter className="text-orange-500 ml-2" size={14} />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-transparent outline-none text-[10px] font-black uppercase dark:text-white cursor-pointer pr-4"
                        >
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id} className="dark:bg-[#0a0a0a]">
                                    {cat.title}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {listings.map((item) => (
                    <div
                        key={item._id}
                        className={`group relative bg-white dark:bg-white/5 rounded-xl border transition-all duration-500 overflow-hidden ${item.promotion?.pinnedPosition
                            ? 'border-orange-500 shadow-lg shadow-orange-500/10'
                            : 'border-gray-100 dark:border-white/10 hover:border-orange-500/30'
                            }`}
                    >
                        {/* Image Preview */}
                        <div className="relative h-40 bg-gray-900">
                            <img
                                src={item.image}
                                className={`w-full h-full object-cover transition-all duration-500 ${item.promotion?.pinnedPosition ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'
                                    }`}
                                alt=""
                            />
                            {item.promotion?.pinnedPosition && (
                                <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest shadow-xl flex items-center gap-1">
                                    <FiPhoneIncoming size={10} /> Slot {item.promotion.pinnedPosition}
                                </div>
                            )}
                        </div>

                        <div className="p-5">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                {item.categoryName}
                            </p>
                            <h4 className="text-[13px] font-black dark:text-white uppercase truncate mb-4">
                                {item.title}
                            </h4>

                            {/* Action Buttons */}
                            <div className="space-y-2">
                                {item.promotion?.pinnedPosition ? (
                                    <button
                                        onClick={() => handleUnpin(item._id)}
                                        disabled={actionLoading}
                                        className="w-full h-10 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                    >
                                        <FiTrash2 size={14} /> Remove from Curated
                                    </button>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2">
                                        {[1, 2, 3, 4].map((pos) => (
                                            <button
                                                key={pos}
                                                onClick={() => handlePin(item._id, pos)}
                                                disabled={actionLoading}
                                                className="h-9 bg-gray-100 dark:bg-white/10 hover:bg-orange-500 text-gray-500 dark:text-gray-400 hover:text-white rounded-lg text-[8px] font-black uppercase transition-all"
                                            >
                                                Pin Slot {pos}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {listings.length === 0 && !loading && (
                <div className="p-20 text-center border border-dashed border-gray-200 dark:border-white/10 rounded-2xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic opacity-50">
                        No active listings found in this category
                    </p>
                </div>
            )}

            {/* Sync Footer */}
            <div className="flex items-center justify-start px-2">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic flex items-center gap-2">
                    <FiClock className="text-orange-500" />
                    Sync: {lastSynced ? new Date(lastSynced).toLocaleTimeString() : 'Establishing...'}
                </p>
            </div>
        </div>
    );
}