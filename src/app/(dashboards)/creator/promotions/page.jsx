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
  FiSearch,
  FiFilter,
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

  // --- Search & Filter State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
  const itemsPerPage = 10;

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

  // --- Filtering Logic ---
  const filteredListings = listings.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.country?.toLowerCase().includes(searchTerm.toLowerCase());

    const isPromoted = !!item.isPromoted;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && isPromoted) ||
      (statusFilter === 'inactive' && !isPromoted);

    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredListings.slice(indexOfFirstItem, indexOfLastItem);

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

  if (loading) return <div className="min-h-screen bg-zinc-50 dark:bg-[#050505] animate-pulse" />;

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans text-sm pb-10">
      <Toaster position="top-center" />

      {/* Wallet Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex justify-between items-center transition-all">
          <div>
            <p className="text-[10px] uppercase tracking-widest font-black text-zinc-400 mb-1">
              Available Credits
            </p>
            <h2 className="text-4xl font-black tracking-tighter dark:text-white italic">
              €{walletBalance.toFixed(2)}
            </h2>
          </div>
          <button
            onClick={() => setShowTopUpModal(true)}
            className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3.5 rounded-xl flex items-center gap-2 transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-600/20 active:scale-95"
          >
            <FiPlus /> Deposit Funds
          </button>
        </div>
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-black">
            Managed Assets
          </p>
          <p className="text-3xl font-black dark:text-white mt-1 tracking-tighter italic">
            {listings.length}
          </p>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-zinc-900/50 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="relative w-full md:w-96 group">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-orange-500 transition-colors" />
          <input
            type="text"
            placeholder="SEARCH BY ASSET NAME OR COUNTRY..."
            className="w-full pl-11 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-[10px] font-black uppercase tracking-wider outline-none focus:border-orange-500/50 transition-all dark:text-white"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-1 w-full md:w-auto">
            <FiFilter className="text-zinc-400" size={14} />
            <select
              className="bg-transparent py-2.5 pl-2 pr-4 text-[10px] font-black uppercase outline-none dark:bg-[#151515] dark:text-white cursor-pointer"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">ALL NODES</option>
              <option value="active">PROMOTED</option>
              <option value="inactive">ORGANIC</option>
            </select>
          </div>
          <button
            onClick={initData}
            className="p-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-400 hover:text-orange-500 transition-all"
          >
            <FiRotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Table UI */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/30">
          <h3 className="font-black text-zinc-800 dark:text-zinc-200 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em]">
            <FiActivity className="text-orange-500" /> Promotion Inventory
          </h3>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900/50 text-[9px] uppercase tracking-widest text-zinc-500 font-black border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-8 py-5">Product Info</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Active Protocols</th>
                <th className="px-8 py-5 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm relative">
                          <img
                            src={getImageUrl(item.image)}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            alt=""
                          />
                        </div>
                        <div>
                          <Link
                            href={`/creator/promotions/${item._id}`}
                            className="font-black text-zinc-900 dark:text-zinc-100 hover:text-orange-500 transition-colors uppercase tracking-tight text-[12px]"
                          >
                            {item.title}
                          </Link>
                          <p className="text-[9px] text-zinc-400 uppercase font-bold mt-1 tracking-widest">
                            {item.country}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {item.isPromoted ? (
                        <div className="flex items-center gap-2">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase bg-emerald-500/5 text-emerald-500 border border-emerald-500/10">
                            Active
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                          <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                            Organic
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-wrap gap-2">
                        {isBoostActive(item) && (
                          <div
                            onClick={() => handleCancel(item._id, 'boost')}
                            className="cursor-pointer flex items-center gap-2 px-3 py-1 bg-orange-500/5 text-orange-500 rounded-lg text-[9px] font-black border border-orange-500/10 hover:bg-orange-500 hover:text-white transition-all"
                          >
                            BOOST <FiRotateCcw className="text-[10px]" />
                          </div>
                        )}
                        {isPpcActive(item) && (
                          <div
                            onClick={() => handleCancel(item._id, 'ppc')}
                            className="cursor-pointer flex items-center gap-2 px-3 py-1 bg-blue-500/5 text-blue-500 rounded-lg text-[9px] font-black border border-blue-500/10 hover:bg-blue-600 hover:text-white transition-all"
                          >
                            PPC <FiRotateCcw className="text-[10px]" />
                          </div>
                        )}
                        {!isBoostActive(item) && !isPpcActive(item) && (
                          <span className="text-zinc-400 text-[9px] font-black uppercase tracking-widest opacity-40">
                            System Idle
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end items-center gap-3">
                        <Link
                          href={`/creator/promotions/${item._id}`}
                          className="p-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 rounded-xl hover:bg-zinc-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                        >
                          <FiEye size={16} />
                        </Link>
                        <button
                          onClick={() => setSelectedListing(item)}
                          className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-orange-600 dark:hover:bg-orange-600 dark:hover:text-white transition-all shadow-sm"
                        >
                          Launch
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-8 py-20 text-center text-[10px] font-black uppercase tracking-widest text-zinc-400 italic opacity-50"
                  >
                    No matching assets found in index.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 flex justify-between items-center">
            <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest italic">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex gap-2.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 disabled:opacity-20 hover:border-orange-500 transition-all shadow-sm"
              >
                <FiChevronLeft size={16} className="dark:text-white" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 disabled:opacity-20 hover:border-orange-500 transition-all shadow-sm"
              >
                <FiChevronRight size={16} className="dark:text-white" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- Top-up Modal (Keeping all your existing logic) --- */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/30">
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 dark:text-white italic">
                <FiCreditCard className="text-orange-500" /> Wallet Injection
              </h3>
              <button
                onClick={() => setShowTopUpModal(false)}
                className="text-zinc-400 hover:text-red-500 transition-colors p-2 bg-zinc-100 dark:bg-white/5 rounded-lg"
              >
                <FiX size={18} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">
                  Amount to deposit
                </label>
                <div className="relative">
                  <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" />
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 pl-10 pr-4 py-4 rounded-xl text-sm font-black outline-none focus:border-orange-500 dark:text-white transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">
                  Protocol Currency
                </label>
                <select
                  value={topUpCurrency}
                  onChange={(e) => setTopUpCurrency(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 rounded-xl text-sm font-black outline-none focus:border-orange-500 dark:text-white appearance-none cursor-pointer"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
              <button
                onClick={handleTopUpSubmit}
                disabled={actionLoading}
                className="w-full py-5 bg-orange-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-orange-600/20 hover:bg-orange-500 transition-all active:scale-[0.98]"
              >
                {actionLoading ? 'Initializing...' : 'Proceed to Gateway'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promotion Config Modal (Keeping all your existing logic) */}
      {selectedListing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in zoom-in-95 duration-300">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/30">
              <h3 className="font-black flex items-center gap-2 dark:text-white uppercase text-[10px] tracking-widest italic">
                <FiZap className="text-orange-500" /> Promotion Protocol
              </h3>
              <button
                onClick={() => setSelectedListing(null)}
                className="text-zinc-400 hover:text-red-500 p-2 bg-zinc-100 dark:bg-white/5 rounded-lg"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-8 space-y-7">
              <div className="flex p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                <button
                  onClick={() => setPromoType('boost')}
                  className={`flex-1 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${promoType === 'boost' ? 'bg-white dark:bg-zinc-700 shadow-sm text-orange-600' : 'text-zinc-400'}`}
                >
                  Viral Boost
                </button>
                <button
                  onClick={() => setPromoType('ppc')}
                  className={`flex-1 py-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${promoType === 'ppc' ? 'bg-white dark:bg-zinc-700 shadow-sm text-orange-600' : 'text-zinc-400'}`}
                >
                  PPC Flow
                </button>
              </div>

              {promoType === 'boost' ? (
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                      Duration (Days)
                    </label>
                    <input
                      type="number"
                      value={boostDays}
                      onChange={(e) => setBoostDays(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 rounded-xl text-sm font-black outline-none focus:border-orange-500 dark:text-white transition-all"
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
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 rounded-xl text-sm font-black outline-none focus:border-orange-500 dark:text-white transition-all"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                      Budget (€)
                    </label>
                    <input
                      type="number"
                      value={ppcAmount}
                      onChange={(e) => setPpcAmount(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 rounded-xl text-sm font-black outline-none focus:border-orange-500 dark:text-white transition-all"
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
                      className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 rounded-xl text-sm font-black outline-none focus:border-orange-500 dark:text-white transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="p-5 bg-orange-500/5 rounded-2xl border border-orange-500/10 flex justify-between items-center">
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                  Calculated Cost
                </span>
                <span className="text-2xl font-black text-orange-600 italic">
                  €{currentCost.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handlePurchase}
                disabled={actionLoading || walletBalance < currentCost}
                className="w-full py-5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl font-black uppercase text-[10px] tracking-[0.3em] transition-all hover:bg-orange-600 dark:hover:bg-orange-600 dark:hover:text-white disabled:opacity-30 active:scale-[0.98] shadow-xl"
              >
                {actionLoading ? 'Authorizing...' : 'Authorize Transaction'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
