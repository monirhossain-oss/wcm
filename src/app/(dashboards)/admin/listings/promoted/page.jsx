'use client';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  FiSearch,
  FiDownload,
  FiActivity,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiClock,
} from 'react-icons/fi';
import { toast, Toaster } from 'react-hot-toast';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const PROMOTED_CACHE_KEY = 'drakilo_promoted_cache';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // ২৪ ঘণ্টা

export default function ListingPromotedPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastSynced, setLastSynced] = useState(null);

  const fetchPromotedListings = useCallback(
    async (isForce = false) => {
      try {
        // ১. ক্যাশ চেক (যদি ফোর্স রিফ্রেশ না হয় এবং সার্চ খালি থাকে)
        if (!isForce && page === 1 && search === '' && type === 'all') {
          const cached = localStorage.getItem(PROMOTED_CACHE_KEY);
          if (cached) {
            const { data, pages, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_EXPIRY) {
              setListings(data);
              setTotalPages(pages);
              setLastSynced(timestamp);
              setLoading(false);
              return;
            }
          }
        }

        if (isForce) setRefreshing(true);
        else setLoading(true);

        const { data } = await axios.get(`${API_BASE}/api/admin/promoted-listings`, {
          params: { search, type, page, limit: 10 },
          withCredentials: true,
        });

        if (data.success) {
          setListings(data.listings);
          setTotalPages(data.totalPages);
          const timestamp = Date.now();
          setLastSynced(timestamp);

          // ২. লোকাল স্টোরেজ আপডেট (শুধুমাত্র ডিফল্ট ফিল্টারের জন্য)
          if (page === 1 && search === '' && type === 'all') {
            localStorage.setItem(
              PROMOTED_CACHE_KEY,
              JSON.stringify({
                data: data.listings,
                pages: data.totalPages,
                timestamp: timestamp,
              })
            );
          }
          if (isForce) toast.success('Promotion Streams Updated');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to sync promoted assets');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, type, search]
  );

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchPromotedListings();
    }, 500); // সার্চের জন্য ডিবউন্স
    return () => clearTimeout(delayDebounce);
  }, [fetchPromotedListings]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPromotedListings(true);
  };

  const downloadInvoice = async (id, invoiceNo) => {
    if (!id) return toast.error('Invoice ID not found');
    const loadingToast = toast.loading('Preparing secure invoice...');
    try {
      const response = await axios({
        url: `${API_BASE}/api/payments/creator/invoice/${id}`,
        method: 'GET',
        responseType: 'blob',
        withCredentials: true,
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Drakilo_INV_${invoiceNo || 'DOC'}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Download started', { id: loadingToast });
    } catch (error) {
      toast.error('Failed to download invoice', { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen font-sans transition-colors duration-300 pb-10">
      <Toaster />

      {/* --- Header Section --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-orange-500">
            Promoted <span className="text-gray-900 dark:text-white">Assets</span>
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <FiClock className="text-orange-500" size={10} />
            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
              Sync Status:{' '}
              {lastSynced ? new Date(lastSynced).toLocaleTimeString() : 'Awaiting Connection'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10">
            {['all', 'boost', 'ppc'].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setType(f);
                  setPage(1);
                }}
                className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  type === f
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'text-gray-500 hover:text-orange-500'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchPromotedListings(true)}
            disabled={refreshing}
            className={`p-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl transition-all ${
              refreshing ? 'animate-spin opacity-50' : 'hover:bg-orange-500 hover:text-white'
            }`}
          >
            <FiRefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* --- Search Bar --- */}
      <form onSubmit={handleSearch} className="relative mb-6">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Query by Title or Creator Identity..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 py-4 pl-12 pr-4 text-[11px] font-bold rounded-2xl focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all text-gray-800 dark:text-white placeholder:text-gray-400 uppercase"
        />
      </form>

      {/* --- Table Section --- */}
      <div className="bg-white dark:bg-[#0c0c0c] border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/2 border-b border-gray-200 dark:border-white/10">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Asset Identity
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Campaign Logic
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Priority Level
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-right text-gray-400">
                  Financial Audit
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading && !refreshing ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-24 text-center text-gray-400 animate-pulse uppercase text-[10px] font-black tracking-[0.4em]"
                  >
                    Reading Promotion Ledger...
                  </td>
                </tr>
              ) : listings.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-24 text-center text-gray-400 uppercase text-[10px] tracking-widest font-black opacity-30"
                  >
                    No active campaign signals found
                  </td>
                </tr>
              ) : (
                listings.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50/50 dark:hover:bg-white/1 transition-all group"
                  >
                    <td className="p-6">
                      <div className="flex flex-col">
                        <span className="text-[12px] font-black text-gray-800 dark:text-white uppercase italic group-hover:text-orange-500 transition-colors">
                          {item.title.split(' ').slice(0, 3).join(' ')}
                          {item.title.split(' ').length > 3 && '...'}
                        </span>
                        <span className="text-[9px] text-gray-500 mt-1 font-bold lowercase italic">
                          {item.creatorEmail}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col gap-2">
                        {item.boostStatus !== 'Inactive' && (
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                            <span className="text-[9px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-tighter">
                              BOOST: {item.boostStatus}
                            </span>
                          </div>
                        )}
                        {parseFloat(item.ppcBalance?.replace('€', '') || 0) > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter">
                              PPC Reserve: {item.ppcBalance}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 w-fit px-3 py-1.5 rounded-lg border dark:border-white/10">
                        <FiActivity className="text-orange-500" size={12} />
                        <span className="text-[10px] font-black dark:text-gray-300">
                          RANK LVL {item.promotionLevel}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      {item.invoiceId ? (
                        <button
                          onClick={() => downloadInvoice(item.invoiceId, item.invoiceNo)}
                          className="inline-flex items-center gap-2 bg-gray-100 dark:bg-white/5 hover:bg-orange-600 hover:text-white border border-gray-200 dark:border-white/10 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all text-gray-600 dark:text-gray-300 shadow-sm"
                        >
                          <FiDownload /> INV {item.invoiceNo?.split('-')[1] || 'DOC'}
                        </button>
                      ) : (
                        <span className="text-[9px] text-gray-400 dark:text-gray-600 italic font-black uppercase tracking-tighter bg-gray-50 dark:bg-white/2 px-3 py-1.5 rounded-lg">
                          Internal Ledger
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- Pagination --- */}
        <div className="p-6 border-t border-gray-100 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/30 dark:bg-white/1">
          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest italic">
            Displaying Page {page} of {totalPages} — Drakilo Promotion Network
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-2.5 border dark:border-white/10 rounded-xl disabled:opacity-10 hover:bg-orange-600 hover:text-white transition-all text-gray-500"
            >
              <FiChevronLeft size={18} />
            </button>
            <div className="flex gap-1.5">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (
                  totalPages > 5 &&
                  Math.abs(page - pageNum) > 1 &&
                  pageNum !== 1 &&
                  pageNum !== totalPages
                ) {
                  if (pageNum === 2 || pageNum === totalPages - 1)
                    return (
                      <span key={i} className="px-1 text-gray-400 text-[10px]">
                        ...
                      </span>
                    );
                  return null;
                }
                return (
                  <button
                    key={i}
                    onClick={() => setPage(pageNum)}
                    className={`w-9 h-9 text-[10px] font-black rounded-xl transition-all border ${
                      page === pageNum
                        ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20'
                        : 'bg-transparent border-gray-200 dark:border-white/10 text-gray-500 hover:border-orange-500'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="p-2.5 border dark:border-white/10 rounded-xl disabled:opacity-10 hover:bg-orange-600 hover:text-white transition-all text-gray-500"
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
