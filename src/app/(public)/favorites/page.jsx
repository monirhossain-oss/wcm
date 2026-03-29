'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import ListingCard from '@/components/ListingCard';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function FavoritesPage() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFavorites = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/listings/favorites`, {
                credentials: 'include',
            });

            const data = await res.json();
            setFavorites(data.listings || []);
        } catch (err) {
            console.error('Failed to load favorites', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    // 🔄 Loading State
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-zinc-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a] px-6 py-12">
            <div className="max-w-7xl mx-auto">
                <h1 className="
                    text-2xl md:text-3xl font-black mb-8
                    bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500
                     dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400
                    bg-clip-text text-transparent
                    ">
                    Favorite Listings ❤️
                </h1>

                {/* Empty State */}
                {favorites.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-zinc-500 text-lg">
                            No favorite listings yet 😔
                        </p>
                    </div>
                ) : (
                    /* Grid */
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {favorites.map((item) => (
                            <ListingCard key={item._id} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}