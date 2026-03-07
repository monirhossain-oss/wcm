'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiDownload, FiActivity, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export default function ListingPromotedPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPromotedListings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE}/api/admin/promoted-listings`, {
        params: { search, type, page, limit: 10 },
        withCredentials: true,
      });

      if (data.success) {
        setListings(data.listings);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load promoted listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotedListings();
  }, [page, type]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchPromotedListings();
  };

  // CORS ঝামেলা ছাড়া ফাইল ডাউনলোড করার ফাংশন
  const downloadInvoice = async (id, invoiceNo) => {
    if (!id) return toast.error('Invoice ID not found');

    const loadingToast = toast.loading('Preparing invoice...');
    try {
      const response = await axios({
        url: `${API_BASE}/api/payments/creator/invoice/${id}`,
        method: 'GET',
        responseType: 'blob', // গুরুত্বপূর্ণ: PDF ডাটা হিসেবে পাওয়ার জন্য
        withCredentials: true,
      });

      // ব্রাউজারে ডাউনলোড লিংক তৈরি করা
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${invoiceNo || 'document'}.pdf`);
      document.body.appendChild(link);
      link.click();

      // ক্লিনআপ
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Download started', { id: loadingToast });
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download invoice', { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen font-sans transition-colors duration-300">
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-orange-500">
            Promoted <span className="text-gray-900 dark:text-white">Assets</span>
          </h1>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] mt-1 font-bold">
            Revenue Integrity & Promotion Management
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {['all', 'boost', 'ppc'].map((f) => (
            <button
              key={f}
              onClick={() => {
                setType(f);
                setPage(1);
              }}
              className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                type === f
                  ? 'bg-orange-500 text-white shadow-[0_5px_15px_rgba(249,115,22,0.3)]'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200 dark:hover:bg-white/10 border border-transparent dark:border-white/5'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* --- Search Bar --- */}
      <form onSubmit={handleSearch} className="relative mb-6">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by Title or Creator Email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/10 py-4 pl-12 pr-4 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all text-gray-800 dark:text-gray-200 placeholder:text-gray-400"
        />
      </form>

      {/* --- Table Section --- */}
      <div className="bg-white dark:bg-[#0c0c0c] border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/10">
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Asset Details
                </th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Campaign Info
                </th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Rank Level
                </th>
                <th className="p-5 text-[10px] font-black uppercase tracking-widest text-right text-gray-400">
                  Audit/Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-16 text-center text-gray-400 animate-pulse uppercase text-[10px] tracking-widest"
                  >
                    Synchronizing Data...
                  </td>
                </tr>
              ) : listings.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-16 text-center text-gray-400 uppercase text-[10px] tracking-widest font-bold"
                  >
                    No active promotions found
                  </td>
                </tr>
              ) : (
                listings.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-colors group"
                  >
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-orange-500 transition-colors">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-gray-400 mt-1 font-medium">
                          {item.creatorEmail}
                        </span>
                      </div>
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col gap-2">
                        {item.boostStatus !== 'Inactive' && (
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                            <span className="text-[9px] font-black text-orange-600 dark:text-orange-400 uppercase">
                              {item.boostStatus}
                            </span>
                          </div>
                        )}
                        {parseFloat(item.ppcBalance.replace('€', '')) > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase">
                              PPC: {item.ppcBalance}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-5 font-mono text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 w-fit px-2 py-1 rounded">
                        <FiActivity className="text-orange-500" size={12} />
                        LVL {item.promotionLevel}
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      {item.invoiceId ? (
                        <button
                          onClick={() => downloadInvoice(item.invoiceId, item.invoiceNo)}
                          className="inline-flex items-center gap-2 bg-gray-100 dark:bg-white/5 hover:bg-orange-500 hover:text-white border border-gray-200 dark:border-white/10 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all text-gray-600 dark:text-gray-300"
                        >
                          <FiDownload /> INV {item.invoiceNo?.split('-')[1] || 'DOC'}
                        </button>
                      ) : (
                        <span className="text-[9px] text-gray-300 dark:text-gray-700 italic font-black uppercase tracking-tighter">
                          Internal
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Pagination --- */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 bg-white dark:bg-[#0c0c0c] p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-2 text-gray-500 hover:text-orange-500 disabled:opacity-20 transition-colors"
          >
            <FiChevronLeft size={20} />
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              // শুধু বর্তমান পেজের আসেপাশের ৩টি পেজ দেখানোর জন্য (ঐচ্ছিক)
              if (totalPages > 5 && Math.abs(page - pageNum) > 2) return null;
              return (
                <button
                  key={i}
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 text-[11px] font-black rounded-xl transition-all ${
                    page === pageNum
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-transparent text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="p-2 text-gray-500 hover:text-orange-500 disabled:opacity-20 transition-colors"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
