'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiZap,
  FiX,
  FiActivity,
  FiPlus,
  FiCreditCard,
  FiInfo,
  FiEye,
  FiGlobe,
  FiBriefcase,
} from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageHelper';
import { usePathname } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import CreatorWallet from '@/components/creator/CreatorWallet';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

const BOOST_PACKAGES = [
  {
    id: 'starter',
    name: 'Starter Boost',
    price: 12,
    days: 7,
    desc: 'Boosted Search + Category Pages',
  },
  {
    id: 'standard',
    name: 'Standard Boost',
    price: 29,
    days: 14,
    desc: 'Search + Category + Discovery',
  },
  {
    id: 'premium',
    name: 'Premium Boost',
    price: 79,
    days: 30,
    desc: 'Homepage + Search + Featured',
  },
];

// EU Countries for VAT dropdown
const EU_COUNTRIES = [
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'AT', name: 'Austria' },
  { code: 'SE', name: 'Sweden' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'IE', name: 'Ireland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'GR', name: 'Greece' },
  { code: 'PL', name: 'Poland' },
  { code: 'US', name: 'United States (Non-EU)' },
  { code: 'GB', name: 'United Kingdom (Non-EU)' },
  { code: 'CA', name: 'Canada (Non-EU)' },
];

export default function PromotionsPage() {
  const [listings, setListings] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Promo States
  const [promoType, setPromoType] = useState('boost');
  const [boostDays, setBoostDays] = useState(7);
  const [boostBudget, setBoostBudget] = useState(20);
  const [ppcAmount, setPpcAmount] = useState(10);
  const [targetClicks, setTargetClicks] = useState(50);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const pathname = usePathname();
  const currentCost = promoType === 'boost' ? Number(boostBudget) : Number(ppcAmount);

  const PPC_COST_PER_CLICK = 0.3; 

  const hasActiveBoost = selectedListing?.promotion?.boost?.isActive;
  const hasActivePpc = selectedListing?.promotion?.ppc?.isActive;

  const estimatedClicks = Math.floor(ppcAmount / PPC_COST_PER_CLICK);

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

  useEffect(() => {
    if (promoType === 'boost') {
      setBoostBudget(BOOST_PACKAGES[0].price);
      setBoostDays(BOOST_PACKAGES[0].days);
    }
  }, [promoType]);

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
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-20">
      <Toaster position="top-center" />
      {/* Wallet Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CreatorWallet walletBalance={walletBalance} pathname={pathname} />

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black">
            Managed Assets
          </p>
          <p className="text-4xl font-black dark:text-white mt-1 tracking-tighter">
            {listings.length}
          </p>
        </div>
      </div>
      {/* Table Section */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden shadow-sm">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
          <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3">
            <FiActivity className="text-orange-500" size={16} /> Asset List
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
                          className="w-14 h-14 rounded-lg object-cover border border-zinc-200 dark:border-zinc-800 shadow-sm"
                          alt=""
                        />
                        <div>
                          <p className="font-black text-zinc-900 dark:text-zinc-100 text-sm tracking-tight mb-1">
                            {item.title}
                          </p>
                          <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest italic">
                            {item.category?.title || 'Standard Asset'}
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
                          <span className="text-[10px] text-zinc-400 italic opacity-40">--</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
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
                              : 'bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-orange-600 dark:hover:bg-orange-600 shadow-md'
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

        {/* --- Enhanced Pagination UI --- */}
        {totalPages > 1 && (
          <div className="px-8 py-6 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col sm:flex-row items-center justify-between border-t border-zinc-100 dark:border-zinc-800 gap-4">
            {/* Info Text */}
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest order-2 sm:order-1">
              Showing <span className="text-zinc-900 dark:text-white">{indexOfFirstItem + 1}</span>{' '}
              to{' '}
              <span className="text-zinc-900 dark:text-white">
                {Math.min(indexOfLastItem, listings.length)}
              </span>{' '}
              of <span className="text-orange-500">{listings.length}</span> Assets
            </p>

            {/* Controls */}
            <div className="flex items-center gap-2 order-1 sm:order-2">
              {/* Prev Button */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="p-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-[10px] font-black uppercase disabled:opacity-20 dark:text-white hover:border-orange-500/50 transition-all active:scale-95"
              >
                Prev
              </button>

              {/* Numbered Buttons */}
              <div className="flex items-center gap-1.5 px-2">
                {[...Array(totalPages)].map((_, index) => {
                  const pageNum = index + 1;
                  // Logic to show only a few numbers if totalPages is huge (Optional)
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-lg text-[10px] font-black transition-all border ${
                        currentPage === pageNum
                          ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20'
                          : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="p-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-[10px] font-black uppercase disabled:opacity-20 dark:text-white hover:border-orange-500/50 transition-all active:scale-95"
              >
                Next
              </button>

              {/* Jump to Last */}
              {totalPages > 2 && currentPage !== totalPages && (
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className="ml-1 p-2.5 text-[10px] font-black uppercase text-zinc-400 hover:text-orange-500 transition-colors"
                  title="Go to Last Page"
                >
                  Last ({totalPages})
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {selectedListing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          <div className="bg-white dark:bg-zinc-950 w-full max-w-md rounded-md overflow-hidden shadow-2xl border border-zinc-200 dark:border-white/10">
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 dark:border-white/5 flex justify-between items-center bg-zinc-50/50 dark:bg-white/5">
              <h3 className="font-black text-[10px] uppercase tracking-widest flex items-center gap-3 dark:text-white">
                <FiZap className="text-orange-500" size={18} /> Growth Protocol
              </h3>
              <button
                onClick={() => setSelectedListing(null)}
                className="text-zinc-400 hover:text-red-500"
              >
                <FiX size={22} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Type Switcher with Disable Logic */}
              <div className="flex p-1 bg-zinc-100 dark:bg-white/5 rounded-md">
                <button
                  disabled={hasActiveBoost}
                  onClick={() => setPromoType('boost')}
                  className={`flex-1 py-3 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                    promoType === 'boost'
                      ? 'bg-white dark:bg-zinc-800 shadow-sm text-orange-600'
                      : 'text-zinc-500'
                  } ${hasActiveBoost ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
                  {hasActiveBoost ? 'Boost Active' : 'Viral Boost'}
                </button>
                <button
                  disabled={hasActivePpc}
                  onClick={() => setPromoType('ppc')}
                  className={`flex-1 py-3 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                    promoType === 'ppc'
                      ? 'bg-white dark:bg-zinc-800 shadow-sm text-orange-600'
                      : 'text-zinc-500'
                  } ${hasActivePpc ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
                  {hasActivePpc ? 'PPC Active' : 'PPC Flow'}
                </button>
              </div>

              {/* --- Viral Boost Content --- */}
              {promoType === 'boost' ? (
                <div className="space-y-3">
                  <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">
                    Select Package
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {BOOST_PACKAGES.map((pkg) => (
                      <button
                        key={pkg.id}
                        onClick={() => {
                          setBoostBudget(pkg.price);
                          setBoostDays(pkg.days);
                        }}
                        className={`p-4 rounded-md border text-left transition-all ${
                          boostBudget === pkg.price
                            ? 'border-orange-500 bg-orange-500/5 ring-1 ring-orange-500'
                            : 'border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-white/5 hover:border-zinc-400'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-black uppercase tracking-widest dark:text-white">
                            {pkg.name}
                          </span>
                          <span className="text-sm font-black text-orange-600">€{pkg.price}</span>
                        </div>
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-tighter leading-tight">
                          {pkg.days} Days • {pkg.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* --- PPC Flow Content --- */
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">
                      Enter Budget (€)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="5"
                        value={ppcAmount}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setPpcAmount(val);
                          setTargetClicks(Math.floor(val / PPC_COST_PER_CLICK)); // ব্যাকএন্ডে পাঠানোর জন্য সেট
                        }}
                        className="w-full bg-zinc-100 dark:bg-white/5 border border-transparent focus:border-orange-500 p-4 rounded-md text-sm font-black outline-none dark:text-white transition-all"
                        placeholder="Min €5"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-400">
                        EUR
                      </span>
                    </div>
                  </div>

                  {/* Estimated Clicks Display */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-50 dark:bg-white/5 rounded-md border border-zinc-100 dark:border-white/5">
                      <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">
                        Cost Per Click
                      </p>
                      <p className="text-sm font-black dark:text-white">€{PPC_COST_PER_CLICK}</p>
                    </div>
                    <div className="p-4 bg-zinc-50 dark:bg-white/5 rounded-md border border-zinc-100 dark:border-white/5">
                      <p className="text-[8px] font-black text-zinc-400 uppercase tracking-widest mb-1">
                        Est. Clicks
                      </p>
                      <p className="text-sm font-black text-blue-500">~ {estimatedClicks}</p>
                    </div>
                  </div>

                  <p className="text-[9px] text-zinc-500 font-medium italic">
                    * Clicks are estimated based on a fixed rate of €0.30 per click.
                  </p>
                </div>
              )}

              {/* Investment Summary */}
              <div className="p-6 bg-orange-500/5 rounded-md border border-orange-500/10 flex justify-between items-center">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  Total Investment
                </span>
                <div className="text-right">
                  <span className="text-3xl font-black text-orange-600 italic tracking-tighter">
                    €{currentCost.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePurchase}
                disabled={actionLoading || walletBalance < currentCost || currentCost < 5}
                className="w-full py-5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-md font-black uppercase text-[10px] tracking-[0.4em] transition-all hover:bg-orange-600 hover:text-white active:scale-[0.98] shadow-2xl disabled:opacity-20 disabled:hover:bg-zinc-900"
              >
                {actionLoading
                  ? 'Initializing...'
                  : walletBalance < currentCost
                    ? 'Insufficient Credits'
                    : 'Launch Campaign'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
