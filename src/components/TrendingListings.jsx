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
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Trending listings
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Discover what's popular right now
          </p>
        </div>

        <div className="flex space-x-2">
          {['All', 'Today', 'This week'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                filter === f
                  ? 'bg-[#F57C00] text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {loading ? (
            [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
          ) : listings.length > 0 ? (
            listings.map((item) => {
              const isLiked = item.isFavorited;

              return (
                <div
                  key={item._id}
                  className="bg-white dark:bg-[#0a0a0a] shadow rounded-lg overflow-hidden relative border dark:border-white/5"
                >
                  {item.status === 'approved' && item.isPromoted && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded z-10 uppercase">
                      Promoted
                    </span>
                  )}
                  <img
                    src={`${API_BASE_URL}${item.image}`}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase font-bold tracking-tighter italic">
                      {item.tradition}
                    </p>
                    <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                      <span className="font-medium">@{item.creatorId?.username || 'user'}</span>
                      <button
                        onClick={() => handleToggleFavorite(item._id)}
                        className="flex items-center space-x-1.5 hover:scale-110 transition-transform active:scale-90"
                      >
                        {/* icon logic */}
                        <FaHeart className={isLiked ? 'text-red-500' : 'text-gray-300'} />
                        <span className={isLiked ? 'text-red-500 font-bold' : ''}>
                          {item.favoritesCount || 0}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center text-gray-500 font-bold uppercase tracking-widest">
              No listings found for "{filter}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendingListings;
