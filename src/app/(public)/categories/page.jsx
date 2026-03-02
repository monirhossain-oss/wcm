'use client';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight, FaSpinner } from 'react-icons/fa';
import ListingCard from '@/components/ListingCard';

const CategoriesPage = () => {
  const [listings, setListings] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  // Pagination States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/listings/meta-data`);
        const catTitles = res.data.categories.map((c) => c.title);
        setCategories(['All', ...catTitles]);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchMeta();
  }, [API_BASE_URL]);

  const fetchListings = useCallback(
    async (pageNum, categoryName) => {
      setLoading(true);
      try {
        let url = `${API_BASE_URL}/api/listings/public?page=${pageNum}&limit=${limit}`;
        if (categoryName !== 'All') {
          url += `&category=${categoryName}`;
        }

        const res = await axios.get(url, { withCredentials: true });
        const { listings: newListings, total } = res.data;

        setListings(newListings);
        setTotalPages(Math.ceil(total / limit));

        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error('Error fetching listings:', err);
      } finally {
        setLoading(false);
      }
    },
    [API_BASE_URL]
  );

  useEffect(() => {
    fetchListings(page, activeCategory);
  }, [page, activeCategory, fetchListings]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white mb-2 uppercase tracking-tighter">
            Explore <span className="text-[#F57C00]">Collections</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">
            Discover authentic cultural treasures and traditions from across the globe.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 border ${
                activeCategory === cat
                  ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'bg-transparent border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:border-orange-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-zinc-100 dark:bg-white/5 rounded-xl mb-4" />
                <div className="h-4 bg-zinc-100 dark:bg-white/5 w-3/4 rounded mb-2" />
                <div className="h-3 bg-zinc-100 dark:bg-white/5 w-1/2 rounded" />
              </div>
            ))}
          </div>
        ) : listings.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
              {listings.map((item) => (
                <div key={item._id}>
                  <ListingCard item={item} />
                </div>
              ))}
            </div>

            {/* Classic Pagination Section */}
            <div className="mt-20 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-orange-500 hover:text-white transition-all disabled:opacity-30"
                >
                  <FaChevronLeft size={12} />
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (
                      totalPages > 5 &&
                      Math.abs(page - pageNum) > 2 &&
                      pageNum !== 1 &&
                      pageNum !== totalPages
                    ) {
                      if (Math.abs(page - pageNum) === 3)
                        return (
                          <span key={pageNum} className="text-zinc-400">
                            ...
                          </span>
                        );
                      return null;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-full text-[12px] font-black transition-all ${
                          page === pageNum
                            ? 'bg-orange-500 text-white shadow-lg'
                            : 'bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-orange-500 hover:text-white transition-all disabled:opacity-30"
                >
                  <FaChevronRight size={12} />
                </button>
              </div>

              <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">
                Page {page} of {totalPages}
              </p>
            </div>
          </>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-zinc-100 dark:border-white/5 rounded-3xl">
            <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">
              No cultural treasures found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
