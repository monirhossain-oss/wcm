'use client';
import React, { useState, useEffect } from 'react';
import { FaHeart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';

const TrendingListings = () => {
  const [listings, setListings] = useState([]);
  const [filter, setFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 4;

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchListings();
  }, [filter]);

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
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/listings/favorite/${listingId}`,
        {},
        { withCredentials: true }
      );

      setListings((prev) =>
        prev.map((item) => {
          if (item._id === listingId) {
            const isNowFavorited = res.data.isFavorited;
            return {
              ...item,
              favorites: isNowFavorited
                ? [...item.favorites, 'temp_id']
                : item.favorites.slice(0, -1),
            };
          }
          return item;
        })
      );
    } catch (err) {
      if (err.response?.status === 401) {
        alert('Please login to favorite listings');
      }
    }
  };

  // Skeleton Loader Component
  const SkeletonCard = () => (
    <div className="bg-gray-200 dark:bg-gray-800 rounded-lg h-72 animate-pulse">
      <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-t-lg" />
      <div className="p-4 space-y-3">
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  );

  const totalPages = Math.ceil(listings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = listings.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Trending listings
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Discover what's popular right now
          </p>
        </div>

        {/* Filters */}
        <div className="flex space-x-2">
          {['All', 'Today', 'This week'].map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 text-sm font-medium rounded ${
                filter === f
                  ? 'bg-[#F57C00] text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Container */}
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {loading ? (
            [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
          ) : currentItems.length > 0 ? (
            currentItems.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[#0a0a0a] shadow rounded-lg overflow-hidden relative"
              >
                {item.status === 'promoted' && (
                  <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                    Promoted
                  </span>
                )}
                <img
                  src={`${API_BASE_URL}${item.image}`}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.tradition}</p>
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                    <span>{item.creatorId?.username || 'Unknown'}</span>
                    <button
                      onClick={() => handleToggleFavorite(item._id)}
                      className="flex items-center space-x-1 hover:opacity-70 transition"
                    >
                      <FaHeart
                        className={item.favorites?.length > 0 ? 'text-red-500' : 'text-gray-300'}
                      />
                      <span>{item.favorites?.length || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-gray-500">No listings found.</div>
          )}
        </div>

        {/* Side Buttons - Horizontally Centered on Grid */}
        {!loading && totalPages > 1 && (
          <>
            <div className="absolute inset-y-0 -left-4 flex items-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full shadow-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition z-10"
              >
                <FaChevronLeft />
              </button>
            </div>
            <div className="absolute inset-y-0 -right-4 flex items-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full shadow-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition z-10"
              >
                <FaChevronRight />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TrendingListings;
