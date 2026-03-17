'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiZap,
  FiX,
  FiActivity,
  FiPlus,
  FiCreditCard,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiDollarSign,
} from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageHelper';
import { usePathname } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function PromotionsPage() {
  const [listings, setListings] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Modals & Promo States
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(10);
  const [topUpCurrency, setTopUpCurrency] = useState('EUR');
  const [promoType, setPromoType] = useState('boost');
  const [boostDays, setBoostDays] = useState(7);
  const [boostBudget, setBoostBudget] = useState(20);
  const [ppcAmount, setPpcAmount] = useState(10);
  const [targetClicks, setTargetClicks] = useState(50);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const pathname = usePathname();
  const currentCost = promoType === 'boost' ? Number(boostBudget) : Number(ppcAmount);

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    try {
      const [listRes, userRes] = await Promise.all([
        api.get('/api/listings/my-listings'),
        api.get('/api/users/me'),
      ]);
      setListings(listRes.data.filter((l) => l.status === 'approved'));
      setWalletBalance(userRes.data.walletBalance || 0);
    } catch (err) {
      toast.error('Synchronization failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTopUpSubmit = async () => {
    if (topUpAmount < 1) return toast.error('Minimum amount is 1');
    setActionLoading(true);
    try {
      const res = await api.post('/api/payments/create-checkout-session', {
        amount: Number(topUpAmount),
        currency: topUpCurrency,
        currentPath: pathname,
      });
      if (res.data.url) window.location.href = res.data.url;
    } catch (err) {
      toast.error('Top-up request failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (walletBalance < currentCost) return toast.error('Insufficient credits.');
    setActionLoading(true);
    const toastId = toast.loading('Executing Protocol...');
    try {
      const payload = {
        listingId: selectedListing._id,
        packageType: promoType,
        amountInEUR: currentCost,
        days: promoType === 'boost' ? Number(boostDays) : 0,
        totalClicks: promoType === 'ppc' ? Number(targetClicks) : 0,
      };
      const res = await api.post('/api/payments/purchase-promotion', payload);
      setWalletBalance(res.data.newBalance);
      toast.success('Campaign Launched!', { id: toastId });
      setSelectedListing(null);
      initData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transaction failed', { id: toastId });
    } finally {
      setActionLoading(false);
    }
  };

  const isBoostActive = (l) =>
    l.promotion?.boost?.isActive && new Date(l.promotion.boost.expiresAt) > new Date();
  const isPpcActive = (l) => l.promotion?.ppc?.isActive && l.promotion.ppc.ppcBalance > 0;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = listings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(listings.length / itemsPerPage);

  if (loading) return <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] animate-pulse" />;

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-20 md:px-0">
      <Toaster position="top-center" />

      {/* Wallet Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-zinc-900 rounded-lg p-6 text-white flex justify-between md:items-center border border-white/5 shadow-2xl relative overflow-hidden max-md:flex-col gap-4">
          <div className="relative z-10">
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black mb-2 whitespace-nowrap">
              Available Balance
            </p>
            <h2 className="text-4xl font-black tracking-tighter italic">
              €{walletBalance?.toFixed(2)}
            </h2>
          </div>
          <button
            onClick={() => setShowTopUpModal(true)}
            className="relative z-10 bg-orange-500 hover:bg-orange-600 px-6 py-3.5 rounded-lg flex items-center gap-3 transition-all font-black text-[10px] uppercase tracking-widest active:scale-95 whitespace-nowrap justify-center cursor-pointer"
          >
            <FiPlus size={18} /> Add Money
          </button>
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <FiCreditCard size={200} />
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black">
            Managed Assets
          </p>
          <p className="text-4xl font-black dark:text-white mt-1 tracking-tighter">
            {listings.length}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
          <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3">
            <FiActivity className="text-orange-500" size={16} /> Asset Deployment
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[9px] uppercase tracking-widest text-zinc-400 font-black border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/20">
                <th className="px-8 py-5">Item Details</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Promotions</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {currentItems.map((item) => {
                const boost = isBoostActive(item);
                const ppc = isPpcActive(item);
                const isFullyPromoted = boost && ppc;

                return (
                  <tr
                    key={item._id}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-all group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-5">
                        <img
                          src={getImageUrl(item.image)}
                          className="w-14 h-14 rounded-lg object-cover border border-zinc-200 dark:border-zinc-800"
                          alt=""
                        />
                        <div>
                          <p className="font-black text-zinc-900 dark:text-zinc-100 text-sm tracking-tight mb-1">
                            {item.title}
                          </p>
                          {/* fix: ensuring string render */}
                          <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest italic">
                            {typeof item.category === 'object'
                              ? item.category.title
                              : item.category || 'Standard'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {item.isPromoted ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase bg-green-500/10 text-green-500 border border-green-500/20">
                          <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" /> Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
                          Organic
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex gap-2">
                        {boost && (
                          <span className="px-2 py-1 bg-orange-500/10 text-orange-500 rounded text-[8px] font-black border border-orange-500/10">
                            BOOST
                          </span>
                        )}
                        {ppc && (
                          <span className="px-2 py-1 bg-blue-500/10 text-blue-500 rounded text-[8px] font-black border border-blue-500/10">
                            PPC
                          </span>
                        )}
                        {!boost && !ppc && (
                          <span className="text-[10px] text-zinc-400 italic opacity-40">
                            --
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-end items-center gap-3">
                        <Link
                          href={`/creator/promotions/${item._id}`}
                          className="flex items-center gap-2 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                        >
                          <FiEye size={14} />
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            Insights
                          </span>
                        </Link>

                        <button
                          disabled={isFullyPromoted}
                          onClick={() => setSelectedListing(item)}
                          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                            isFullyPromoted
                              ? 'bg-zinc-50 dark:bg-zinc-900 text-zinc-300 dark:text-zinc-600 border border-zinc-100 dark:border-zinc-800 cursor-not-allowed opacity-50'
                              : 'bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-orange-600 dark:hover:bg-orange-600 dark:hover:text-white shadow-md'
                          }`}
                        >
                          <FiZap size={14} />
                          {isFullyPromoted ? 'Active' : 'Promote'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
            <p className="text-[10px] text-zinc-500 font-black uppercase">
              Page {currentPage} / {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-30"
              >
                <FiChevronLeft size={16} />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-30"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- Top-up Modal --- */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-lg shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="font-black text-[10px] uppercase tracking-widest flex items-center gap-3 dark:text-white">
                <FiCreditCard className="text-orange-500" size={18} /> Deposit Funds
              </h3>
              <button
                onClick={() => setShowTopUpModal(false)}
                className="text-zinc-400 hover:text-red-500"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">
                  Credits Amount
                </label>
                <div className="relative">
                  <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 pl-10 pr-4 py-4 rounded-lg text-sm font-black outline-none focus:ring-2 ring-orange-500/20 dark:text-white"
                  />
                </div>
              </div>
              <button
                onClick={handleTopUpSubmit}
                disabled={actionLoading}
                className="w-full py-4 bg-orange-600 text-white rounded-lg font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-orange-700 transition-all"
              >
                {actionLoading ? 'Initializing...' : 'Checkout Securely'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promotion Config Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-lg overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="font-black text-[10px] uppercase tracking-widest flex items-center gap-3 dark:text-white">
                <FiZap className="text-orange-500" size={18} /> Configure Strategy
              </h3>
              <button
                onClick={() => setSelectedListing(null)}
                className="text-zinc-400 hover:text-red-500"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-8 space-y-8">
              <div className="flex p-1.5 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg">
                <button
                  onClick={() => setPromoType('boost')}
                  className={`flex-1 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${promoType === 'boost' ? 'bg-white dark:bg-zinc-700 shadow-sm text-orange-600' : 'text-zinc-500'}`}
                >
                  Viral Boost
                </button>
                <button
                  onClick={() => setPromoType('ppc')}
                  className={`flex-1 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${promoType === 'ppc' ? 'bg-white dark:bg-zinc-700 shadow-sm text-orange-600' : 'text-zinc-500'}`}
                >
                  PPC Flow
                </button>
              </div>

              {promoType === 'boost' ? (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                      Duration (Days)
                    </label>
                    <input
                      type="number"
                      value={boostDays}
                      onChange={(e) => setBoostDays(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 rounded-lg text-sm font-black outline-none focus:ring-2 ring-orange-500/20 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                      Budget (€)
                    </label>
                    <input
                      type="number"
                      value={boostBudget}
                      onChange={(e) => setBoostBudget(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 rounded-lg text-sm font-black outline-none focus:ring-2 ring-orange-500/20 dark:text-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                      Budget (€)
                    </label>
                    <input
                      type="number"
                      value={ppcAmount}
                      onChange={(e) => setPpcAmount(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 rounded-lg text-sm font-black outline-none focus:ring-2 ring-orange-500/20 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                      Est. Clicks
                    </label>
                    <input
                      type="number"
                      value={targetClicks}
                      onChange={(e) => setTargetClicks(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 rounded-lg text-sm font-black outline-none focus:ring-2 ring-orange-500/20 dark:text-white"
                    />
                  </div>
                </div>
              )}

              <div className="p-5 bg-orange-500/5 rounded-lg border border-orange-500/10 flex justify-between items-center">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  Total Investment
                </span>
                <span className="text-2xl font-black text-orange-600 italic tracking-tighter">
                  €{currentCost.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handlePurchase}
                disabled={actionLoading || walletBalance < currentCost}
                className="w-full py-5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg font-black uppercase text-[10px] tracking-[0.3em] transition-all hover:bg-orange-600 active:scale-[0.98] shadow-xl disabled:opacity-20"
              >
                {actionLoading ? 'Activating...' : 'Execute Promotion'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
