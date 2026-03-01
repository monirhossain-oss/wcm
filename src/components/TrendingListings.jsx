'use client';
import React, { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

const TrendingListings = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchListings();
  }, [filter, user]);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/listings/public?filter=${filter}`, {
        withCredentials: true,
      });
      setListings(res.data);
    } catch (err) {
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (listingId) => {
    if (!user) {
      alert('Please login to favorite listings');
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/listings/favorite/${listingId}`,
        {},
        { withCredentials: true }
      );

      const { isFavorited, favoritesCount } = res.data;

      setListings((prev) =>
        prev.map((item) => {
          if (item._id === listingId) {
            return {
              ...item,
              isFavorited: isFavorited,
              favoritesCount: favoritesCount,
            };
          }
          return item;
        })
      );
    } catch (err) {
      console.error('Favorite toggle failed', err);
    }
  };

  const SkeletonCard = () => (
    <div className="bg-gray-200 dark:bg-gray-800 rounded-lg h-72 animate-pulse">
      <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-t-lg" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">
            Trending listings
          </h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Discover what's popular right now
          </p>
        </div>

        <div className="flex space-x-2">
          {['All', 'Today', 'This week'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full transition-all ${
                filter === f
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {loading ? (
            [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
          ) : listings.length > 0 ? (
            listings.map((item) => {
              const isLiked = item.isFavorited;

              return (
                <div
                  key={item._id}
                  className="bg-gray-50 dark:bg-white/5 rounded-lg overflow-hidden relative transition-all hover:shadow-sm group flex flex-col"
                >
                  {item.status === 'approved' && item.isPromoted && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full z-10 uppercase tracking-tighter shadow-xl">
                      Promoted
                    </span>
                  )}

                  <div className="relative w-full overflow-hidden bg-gray-50 dark:bg-white/5">
                    <img
                      src={`${API_BASE_URL}${item.image}`}
                      alt={item.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/600x400/0a0a0a/white?text=No+Image';
                      }}
                      className="w-full h-auto min-h-40 max-h-60 object-contain"
                    />
                  </div>

                  <div className="p-5 flex flex-col grow bg-gray-50 dark:bg-white/5">
                    <h3 className="text-lg line-clamp-2 font-black text-gray-900 dark:text-white tracking-tight truncate">
                      {item.title}
                    </h3>
                    <p className="text-[9px] text-orange-500 mt-3 font-black tracking-[0.15em] italic">
                      {item.tradition}
                    </p>

                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] font-black text-gray-400 tracking-widest">
                        @{item.creatorId?.username || 'user'}
                      </span>
                      <button
                        onClick={() => handleToggleFavorite(item._id)}
                        className="flex items-center gap-1.5 transition-all active:scale-75 group/fav"
                      >
                        <FaHeart
                          className={`text-sm transition-colors ${isLiked ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'text-gray-300 dark:text-white/10 group-hover/fav:text-red-400'}`}
                        />
                        <span
                          className={`text-[10px] font-black ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
                        >
                          {item.favoritesCount || 0}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center text-gray-500 text-xs font-black uppercase tracking-[0.3em]">
              No listings found for "{filter}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendingListings;
