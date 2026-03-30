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
  FiShieldOff,
  FiX,
} from 'react-icons/fi';
import { toast, Toaster } from 'react-hot-toast';

// Frontend Dropdown-এর জন্য রিজন কোডসমূহ
const REASON_CODES = [
  'ILLEGAL_CONTENT',
  'HATE_OR_EXTREMISM',
  'CULTURAL_MISREPRESENTATION',
  'COPYRIGHT_ISSUE',
  'COUNTERFEIT_OR_FRAUD',
  'QUALITY_ISSUE',
  'MISLEADING_LINK',
  'SPAM',
  'ADMIN_DECISION',
  'NOT_RELEVANT_TO_OUR_BUSINESS_MODEL',
];

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const PROMOTED_CACHE_KEY = 'wcm_promoted_cache';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes for testing, change to 24 * 60 * 60 * 1000 for production

export default function ListingPromotedPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastSynced, setLastSynced] = useState(null);

  // Restriction Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [reasonCode, setReasonCode] = useState('');
  const [notes, setNotes] = useState('');

  const fetchPromotedListings = useCallback(
    async (isForce = false) => {
      try {
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
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [fetchPromotedListings]);

  const openBlockModal = (asset) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  const handleConfirmBlock = async () => {
    if (!reasonCode) return toast.error('Please select a mandatory Reason Code');

    const loadingToast = toast.loading('Executing Restriction Protocol...');
    try {
      await axios.put(
        `${API_BASE}/api/admin/update-status/${selectedAsset._id}`,
        {
          status: 'blocked',
          reasonCode: reasonCode, // maps to rejectionReason in backend
          additionalReason: notes, // maps to additionalReason in backend
        },
        { withCredentials: true }
      );
      toast.success('Asset Restricted Successfully', { id: loadingToast });
      setIsModalOpen(false);
      setReasonCode('');
      setNotes('');
      fetchPromotedListings(true); // লিস্ট রিফ্রেশ করা
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed', { id: loadingToast });
    }
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
      link.setAttribute('download', `WCM_INV_${invoiceNo || 'DOC'}.pdf`);
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

      {/* --- Restriction Modal (Blocked/Rejected Logic) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white dark:bg-[#121212] w-full max-w-md rounded-3xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-orange-500">
                Restriction Protocol
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-2 tracking-widest">
                  Selected Asset
                </label>
                <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-xl border dark:border-white/5 text-[11px] font-bold text-gray-500 italic">
                  {selectedAsset?.title}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-2 tracking-widest">
                  Reason Code (Mandatory)
                </label>
                <select
                  value={reasonCode}
                  onChange={(e) => setReasonCode(e.target.value)}
                  className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 p-3.5 rounded-xl text-[11px] font-bold focus:ring-1 focus:ring-orange-500 outline-none text-gray-800 dark:text-white transition-all uppercase"
                >
                  <option value="" className="bg-[#121212]">
                    -- SELECT REASON --
                  </option>
                  {REASON_CODES.map((code) => (
                    <option key={code} value={code} className="bg-[#121212]">
                      {code.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 block mb-2 tracking-widest">
                  Additional Reason (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Provide internal details about this block..."
                  className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 p-3.5 rounded-xl text-[11px] font-bold focus:ring-1 focus:ring-orange-500 outline-none text-gray-800 dark:text-white transition-all min-h-20 resize-none"
                />
              </div>

              <button
                onClick={handleConfirmBlock}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase text-[10px] tracking-[0.3em] py-4 rounded-xl shadow-lg shadow-red-600/20 transition-all"
              >
                Confirm Permanent Block
              </button>
            </div>
          </div>
        </div>
      )}

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
          <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl border border-gray-200 dark:border-white/10 overflow-x-auto no-scrollbar">
            {['all', 'boost', 'ppc', 'blocked'].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setType(f);
                  setPage(1);
                }}
                className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
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
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          fetchPromotedListings(true);
        }}
        className="relative mb-6"
      >
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
        <div className="overflow-x-auto min-h-100">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/2 border-b border-gray-200 dark:border-white/10">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Asset Identity
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Campaign Status
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Priority Level
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-right text-gray-400">
                  Action
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
                          {item.title}
                        </span>
                        <span className="text-[9px] text-gray-500 mt-1 font-bold lowercase italic">
                          {item.creatorEmail}
                        </span>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex flex-col gap-2">
                        {item.status === 'blocked' ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-[8px] font-black text-red-500 uppercase bg-red-500/10 px-2 py-0.5 rounded w-fit border border-red-500/20">
                              REASON:{' '}
                              {item.rejectionReason?.replace(/_/g, ' ') || 'POLICY VIOLATION'}
                            </span>
                            {item.additionalReason && (
                              <span className="text-[7px] text-gray-400 italic">
                                Note: {item.additionalReason}
                              </span>
                            )}
                          </div>
                        ) : (
                          <>
                            {item.boostStatus !== 'Inactive' && (
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-tighter text-orange-600 dark:text-orange-400">
                                  BOOST: {item.boostStatus}
                                </span>
                              </div>
                            )}
                            {parseFloat(item.ppcBalance?.replace('€', '') || 0) > 0 && (
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                <span className="text-[9px] font-black uppercase tracking-tighter text-blue-600 dark:text-blue-400">
                                  PPC Reserve: {item.ppcBalance}
                                </span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 w-fit px-3 py-1.5 rounded-lg border dark:border-white/10">
                        <FiActivity
                          className={
                            item.status === 'blocked' ? 'text-gray-600' : 'text-orange-500'
                          }
                          size={12}
                        />
                        <span
                          className={`text-[10px] font-black ${item.status === 'blocked' ? 'text-gray-600' : 'dark:text-gray-300'}`}
                        >
                          RANK LVL {item.status === 'blocked' ? '0' : item.promotionLevel}
                        </span>
                      </div>
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {item.invoiceId && (
                          <button
                            onClick={() => downloadInvoice(item.invoiceId, item.invoiceNo)}
                            className="p-2.5 bg-gray-100 dark:bg-white/5 hover:bg-orange-600 hover:text-white border border-gray-200 dark:border-white/10 rounded-xl transition-all shadow-sm"
                          >
                            <FiDownload size={14} />
                          </button>
                        )}

                        {item.status === 'blocked' ? (
                          <div className="px-3 py-1.5 bg-red-600 text-white text-[8px] font-black uppercase rounded-lg shadow-lg shadow-red-600/20 flex items-center gap-1.5">
                            <FiShieldOff size={10} /> Permanent Block
                          </div>
                        ) : (
                          <button
                            onClick={() => openBlockModal(item)}
                            className="p-2.5 bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 rounded-xl transition-all shadow-sm"
                            title="Restrict Asset"
                          >
                            <FiShieldOff size={14} />
                          </button>
                        )}
                      </div>
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
            Displaying Page {page} of {totalPages} — WCM Promotion Network
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
                return (
                  <button
                    key={i}
                    onClick={() => setPage(pageNum)}
                    className={`w-9 h-9 text-[10px] font-black rounded-xl transition-all border ${
                      page === pageNum
                        ? 'bg-orange-500 border-orange-500 text-white shadow-lg'
                        : 'bg-transparent border-gray-200 dark:border-white/10 text-gray-500'
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
