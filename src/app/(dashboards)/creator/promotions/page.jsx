'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiZap,
  FiX,
  FiActivity,
  FiRotateCcw,
  FiPlus,
  FiCreditCard,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiDollarSign,
} from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageHelper';
import { usePathname, useRouter } from 'next/navigation';
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

  // Top-up Modal States
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(10);
  const [topUpCurrency, setTopUpCurrency] = useState('EUR');

  // Promo States
  const [promoType, setPromoType] = useState('boost');
  const [boostDays, setBoostDays] = useState(7);
  const [boostBudget, setBoostBudget] = useState(20);
  const [ppcAmount, setPpcAmount] = useState(10);
  const [targetClicks, setTargetClicks] = useState(50);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const pathname = usePathname();
  const router = useRouter();

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

  // --- Enhanced Wallet Top-up Logic ---
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
    if (walletBalance < currentCost) {
      return toast.error('Insufficient credits. Please top up your wallet.');
    }
    setActionLoading(true);
    const toastId = toast.loading('Authorizing payment...');

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
      toast.success('Promotion Protocol Activated!', { id: toastId });
      setSelectedListing(null);
      initData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transaction failed', { id: toastId });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async (listingId, type) => {
    if (!confirm('Cancel this promotion? Unused budget will be refunded.')) return;
    setActionLoading(true);
    try {
      const res = await api.post('/api/payments/cancel-promotion', {
        listingId,
        packageType: type,
      });
      setWalletBalance(res.data.newBalance);
      toast.success(`Refunded €${res.data.refundAmount.toFixed(2)}`);
      initData();
    } catch (err) {
      toast.error('Cancellation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const isBoostActive = (l) =>
    l.promotion?.boost?.isActive && new Date(l.promotion.boost.expiresAt) > new Date();
  const isPpcActive = (l) => l.promotion?.ppc?.isActive && l.promotion.ppc.ppcBalance > 0;

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = listings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(listings.length / itemsPerPage);

  if (loading) return <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] animate-pulse" />;

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans text-sm">
      <Toaster position="top-center" />

      {/* Wallet Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-zinc-900 rounded-xl p-6 text-white flex justify-between items-center border border-white/5 shadow-lg">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mb-1">
              Available Credits
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-white italic">
              €{walletBalance.toFixed(2)}
            </h2>
          </div>
          <button
            onClick={() => setShowTopUpModal(true)}
            className="bg-orange-600 hover:bg-orange-700 px-5 py-3 rounded-lg flex items-center gap-2 transition-all font-bold text-xs uppercase tracking-wider shadow-xl active:scale-95"
          >
            <FiPlus /> Add Funds
          </button>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
            Total Assets
          </p>
          <p className="text-3xl font-bold dark:text-white mt-1 tracking-tighter">
            {listings.length}
          </p>
        </div>
      </div>

      {/* Table UI */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/30">
          <h3 className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2 text-[11px] uppercase tracking-wider">
            <FiActivity className="text-orange-500" /> Active Inventory
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900/50 text-[10px] uppercase tracking-widest text-zinc-500 font-bold border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-6 py-4">Product Info</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Active Promotions</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {currentItems.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={getImageUrl(item.image)}
                        className="w-12 h-12 rounded-lg object-cover border border-zinc-200 dark:border-zinc-800"
                        alt=""
                      />
                      <div>
                        <Link
                          href={`/creator/promotions/${item._id}`}
                          className="font-bold text-zinc-900 dark:text-zinc-100 hover:text-orange-600 transition-colors"
                        >
                          {item.title}
                        </Link>
                        <p className="text-[10px] text-zinc-500 uppercase font-medium mt-0.5 tracking-tight">
                          {item.country}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {item.isPromoted ? (
                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-green-500/10 text-green-600 border border-green-500/20">
                          Active
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-zinc-400"></span>
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-500 border border-zinc-200 dark:border-zinc-700">
                          Inactive
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {isBoostActive(item) && (
                        <div
                          onClick={() => handleCancel(item._id, 'boost')}
                          className="cursor-pointer flex items-center gap-2 px-2.5 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-md text-[9px] font-bold border border-purple-500/20 hover:bg-purple-600 hover:text-white transition-all"
                        >
                          BOOST <FiRotateCcw className="text-[10px]" />
                        </div>
                      )}
                      {isPpcActive(item) && (
                        <div
                          onClick={() => handleCancel(item._id, 'ppc')}
                          className="cursor-pointer flex items-center gap-2 px-2.5 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md text-[9px] font-bold border border-blue-500/20 hover:bg-blue-600 hover:text-white transition-all"
                        >
                          PPC <FiRotateCcw className="text-[10px]" />
                        </div>
                      )}
                      {!isBoostActive(item) && !isPpcActive(item) && (
                        <span className="text-zinc-400 text-[11px] italic">Organic Mode</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-2 transition-opacity">
                      <Link
                        href={`/creator/promotions/${item._id}`}
                        className="p-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
                      >
                        <FiEye size={16} />
                      </Link>
                      <button
                        onClick={() => setSelectedListing(item)}
                        className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-orange-600 dark:hover:bg-orange-600 dark:hover:text-white transition-all"
                      >
                        Promote
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 flex justify-between items-center">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-20 hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-sm"
              >
                <FiChevronLeft size={14} />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 disabled:opacity-20 hover:bg-white dark:hover:bg-zinc-800 transition-all shadow-sm"
              >
                <FiChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- Top-up Modal --- */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/30">
              <h3 className="font-bold text-xs uppercase tracking-widest flex items-center gap-2 dark:text-white">
                <FiCreditCard className="text-orange-500" /> Deposit Funds
              </h3>
              <button
                onClick={() => setShowTopUpModal(false)}
                className="text-zinc-400 hover:text-red-500 transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                  Amount
                </label>
                <div className="relative">
                  <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 pl-9 pr-4 py-3 rounded-lg text-sm font-bold outline-none focus:ring-1 ring-orange-500 dark:text-white"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                  Currency
                </label>
                <select
                  value={topUpCurrency}
                  onChange={(e) => setTopUpCurrency(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-3 rounded-lg text-sm font-bold outline-none focus:ring-1 ring-orange-500 dark:text-white appearance-none cursor-pointer"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
              <button
                onClick={handleTopUpSubmit}
                disabled={actionLoading}
                className="w-full py-4 bg-orange-600 text-white rounded-lg font-bold text-[11px] uppercase tracking-[0.2em] shadow-lg hover:bg-orange-700 transition-all active:scale-[0.98]"
              >
                {actionLoading ? 'Initializing...' : 'Continue to Checkout'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promotion Config Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2 dark:text-white uppercase text-xs">
                <FiZap className="text-orange-500" /> Protocol Setup
              </h3>
              <button
                onClick={() => setSelectedListing(null)}
                className="text-zinc-400 hover:text-red-500 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                <button
                  onClick={() => setPromoType('boost')}
                  className={`flex-1 py-2.5 rounded-md text-[10px] font-bold uppercase transition-all ${promoType === 'boost' ? 'bg-white dark:bg-zinc-700 shadow-sm text-orange-600' : 'text-zinc-500'}`}
                >
                  Viral Boost
                </button>
                <button
                  onClick={() => setPromoType('ppc')}
                  className={`flex-1 py-2.5 rounded-md text-[10px] font-bold uppercase transition-all ${promoType === 'ppc' ? 'bg-white dark:bg-zinc-700 shadow-sm text-orange-600' : 'text-zinc-500'}`}
                >
                  PPC Flow
                </button>
              </div>

              {promoType === 'boost' ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      Duration (Days)
                    </label>
                    <input
                      type="number"
                      value={boostDays}
                      onChange={(e) => setBoostDays(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-3 rounded-lg text-sm font-bold outline-none focus:ring-1 ring-orange-500 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      Budget (€)
                    </label>
                    <input
                      type="number"
                      value={boostBudget}
                      onChange={(e) => setBoostBudget(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-3 rounded-lg text-sm font-bold outline-none focus:ring-1 ring-orange-500 dark:text-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      Budget (€)
                    </label>
                    <input
                      type="number"
                      value={ppcAmount}
                      onChange={(e) => setPpcAmount(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-3 rounded-lg text-sm font-bold outline-none focus:ring-1 ring-orange-500 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      Est. Clicks
                    </label>
                    <input
                      type="number"
                      value={targetClicks}
                      onChange={(e) => setTargetClicks(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-3 rounded-lg text-sm font-bold outline-none focus:ring-1 ring-orange-500 dark:text-white"
                    />
                  </div>
                </div>
              )}

              <div className="p-4 bg-orange-50 dark:bg-orange-500/5 rounded-lg border border-orange-100 dark:border-orange-500/20 flex justify-between items-center">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">Cost Summary</span>
                <span className="text-xl font-bold text-orange-600 italic">
                  €{currentCost.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handlePurchase}
                disabled={actionLoading || walletBalance < currentCost}
                className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg font-bold uppercase text-[10px] tracking-[0.2em] transition-all hover:bg-orange-600 dark:hover:bg-orange-600 dark:hover:text-white disabled:opacity-30 active:scale-[0.98]"
              >
                {actionLoading ? 'Activating...' : 'Confirm Promotion'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
