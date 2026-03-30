'use client';

import { useEffect, useState, useCallback } from 'react';
import { Loader2, HeartOff, Star } from 'lucide-react';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import Link from 'next/link';
import Image from 'next/image';
import FavoriteButton from '@/components/FavoriteButton'; // আপনার প্রজেক্ট পাথ অনুযায়ী
import CreatorName from '@/components/CreatorName';     // আপনার প্রজেক্ট পাথ অনুযায়ী

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFavorites = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/api/listings/favorites`, {
                credentials: 'include',
            });
            const data = await res.json();

            if (data.success || res.ok) {
                // ডাটা সরাসরি অ্যারে হতে পারে অথবা data.listings এর ভেতরে থাকতে পারে
                const items = data.listings || data.data || (Array.isArray(data) ? data : []);
                setFavorites(items);
                // console.log(items)
            }
        } catch (err) {
            console.error('Failed to load favorites', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    // লোডিং স্টেট
    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <Loader2 className="animate-spin text-orange-500" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] px-6 py-12 pt-24">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <h1 className="text-2xl md:text-4xl font-black bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                        Favorite Listings ❤️
                    </h1>
                    <span className="text-zinc-400 text-sm font-medium">
                        {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
                    </span>
                </div>

                {/* Empty State */}
                {favorites.length === 0 ? (
                    <div className="text-center py-32 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[40px]">
                        <HeartOff size={48} className="text-zinc-300 mb-4" />
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">No favorites yet</h2>
                        <p className="text-zinc-500 text-sm mb-8">Start exploring and save the items that inspire you.</p>
                        <Link href="/discover" className="bg-[#1a1a1a] dark:bg-white text-white dark:text-black px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider hover:opacity-90 transition">
                            Explore Marketplace
                        </Link>
                    </div>
                ) : (
                    /* Grid Layout - সরাসরি কার্ডের ডিজাইন এখানে */
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {favorites.map((item) => {
                            // console.log(item)
                            // ইমেজ পাথ লজিক (আপনার লিস্টিং কার্ড থেকে নেওয়া)
                            const postImageSrc = item.image?.startsWith('http')
                                ? item.image
                                : `${API_BASE}${item.image?.startsWith('/') ? '' : '/'}${item.image}`;

                            return (
                                <div key={item._id} className="group relative flex flex-col w-full transition-all duration-300">

                                    {/* IMAGE SECTION */}
                                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-zinc-900">
                                        <Link href={`/listings/${item._id}`} className="block w-full h-full relative">
                                            <Image
                                                src={postImageSrc || 'https://placehold.co/600x400?text=No+Image'}
                                                alt={item.title}
                                                fill
                                                sizes="(max-width:768px) 50vw, 25vw"
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                            <div className="absolute bottom-0 left-0 w-full p-4 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
                                                <h3 className="text-white font-semibold text-sm line-clamp-2">{item.title}</h3>
                                            </div>
                                        </Link>

                                        {/* Favorite Button (Client Component) */}
                                        <FavoriteButton
                                            listingId={item._id}
                                            initialIsFavorited={item.isFavorited}
                                            API_BASE_URL={API_BASE}
                                        />

                                        {item.isPromoted && (
                                            <div className="absolute top-2 left-2 z-20 text-[9px] font-bold text-white bg-orange-600/60 px-2 py-0.5 rounded flex items-center gap-1">
                                                <Star size={12} /> <span>FEATURED</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* INFO SECTION */}
                                    <div className="mt-3 px-1">
                                        <div className="flex items-center justify-between gap-3">
                                            {/* Creator Hover Component */}
                                            <CreatorName
                                                creator={item.creatorId}
                                                item={item}
                                                region={item.region}
                                                API_BASE_URL={API_BASE}
                                            />

                                            <div className="flex gap-2">
                                                <div className="font-bold text-[10px] text-orange-600 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded">
                                                    {item.tradition || 'Heritage'}
                                                </div>
                                                <div className="hidden md:flex items-center text-[10px] gap-1 font-medium text-zinc-500 dark:text-zinc-400">
                                                    <HiOutlineLocationMarker size={12} /> {item.region || 'Global'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}