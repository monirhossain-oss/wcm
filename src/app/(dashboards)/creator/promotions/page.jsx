'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiZap,
  FiX,
  FiActivity,
  FiShield,
  FiTrendingUp,
  FiMousePointer,
  FiChevronLeft,
  FiChevronRight,
  FiBarChart2,
  FiDollarSign,
  FiClock,
  FiInfo,
  FiExternalLink,
} from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageHelper';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import toast, { Toaster } from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function PromotionsPage() {
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [currency, setCurrency] = useState('eur');
  const [promoType, setPromoType] = useState('boost');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [boostDays, setBoostDays] = useState(7);
  const [boostBudget, setBoostBudget] = useState(20);
  const [ppcAmount, setPpcAmount] = useState(10);
  const [targetClicks, setTargetClicks] = useState(50);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const displayCost = promoType === 'boost' ? Number(boostBudget) : Number(ppcAmount);
  const estimatedCPC = targetClicks > 0 ? (ppcAmount / targetClicks).toFixed(2) : 0;
  const dailyBoostIntensity = boostDays > 0 ? (boostBudget / boostDays).toFixed(2) : 0;

  useEffect(() => {
    initData();
    if (searchParams.get('success') === 'true') {
      triggerConfetti();
      toast.success('Promotion Protocol Activated!', {
        style: { background: '#111', color: '#fff' },
      });
      router.replace(pathname);
    }
  }, [searchParams]);

  const initData = async () => {
    try {
      const [listRes, statsRes] = await Promise.all([
        api.get('/api/listings/my-listings'),
        api.get('/api/creator/stats'),
      ]);
      setListings(listRes.data.filter((l) => l.status === 'approved'));
      setStats(statsRes.data);
    } catch (err) {
      toast.error('Network synchronization failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePromotion = async () => {
    if (promoType === 'boost' && (boostBudget < 5 || boostDays < 1)) {
      return toast.error('Minimum investment €5 for at least 1 day');
    }
    if (promoType === 'ppc' && (ppcAmount < 5 || targetClicks < 1)) {
      return toast.error('Minimum investment €5 for PPC Protocol');
    }

    setPaymentLoading(true);
    const toastId = toast.loading('Syncing with Payment Gateway...');

    const payload = {
      listingId: selectedListing._id,
      packageType: promoType,
      amount: displayCost,
      currency: currency.toLowerCase(),
      days: promoType === 'boost' ? Number(boostDays) : 0,
      totalClicks: promoType === 'ppc' ? Number(targetClicks) : 0,
      currentPath: pathname,
    };

    try {
      const res = await api.post('/api/payments/create-checkout-session', payload);
      if (res.data.url) {
        toast.dismiss(toastId);
        window.location.href = res.data.url;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transaction Declined', { id: toastId });
    } finally {
      setPaymentLoading(false);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f97316', '#8b5cf6'],
    });
  };

  const isBoostActive = (l) =>
    l.promotion?.boost?.isActive && new Date(l.promotion.boost.expiresAt) > new Date();
  const isPpcActive = (l) => l.promotion?.ppc?.isActive && l.promotion.ppc.ppcBalance > 0;

  const currentItems = listings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(listings.length / itemsPerPage);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#050505]">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 font-sans transition-colors duration-300">
      <Toaster position="top-center" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em]">
              Accelerator Hub
            </span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">
            Boost <span className="text-orange-600 italic">Visibility</span>
          </h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
            Manage your listing ranking and reach protocols.
          </p>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/5 rounded-xl shadow-sm overflow-hidden transition-all">
        <div className="p-6 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/20">
          <h2 className="text-[11px] font-black text-gray-700 dark:text-white uppercase tracking-widest">
            Listing Inventory
          </h2>
          <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase">
            Status: Optimal
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100/50 dark:bg-white/5 text-left">
                <th className="px-6 py-4 text-[9px] font-black uppercase text-gray-500 tracking-widest">
                  Item Info
                </th>
                <th className="px-6 py-4 text-[9px] font-black uppercase text-gray-500 tracking-widest">
                  Growth Engine
                </th>
                <th className="px-6 py-4 text-[9px] font-black uppercase text-gray-500 tracking-widest">
                  Impact
                </th>
                <th className="px-6 py-4 text-[9px] font-black uppercase text-gray-500 tracking-widest text-right">
                  Operations
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {currentItems.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-black/5 dark:border-white/10 group-hover:border-orange-500/30 transition-all shadow-sm">
                        <img
                          src={getImageUrl(item.image)}
                          className="w-full h-full object-cover"
                          alt={item.title}
                        />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase text-gray-900 dark:text-white tracking-tight">
                          {item.title.split(' ').slice(0, 3).join(' ')}
                          {item.title.split(' ').length > 3 && '...'}
                        </p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase mt-1">
                          {item.region}, {item.country}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-2">
                      {isBoostActive(item) && <Badge label="Viral Boost" color="purple" />}
                      {isPpcActive(item) && <Badge label="PPC Active" color="orange" />}
                      {!isBoostActive(item) && !isPpcActive(item) && (
                        <span className="text-[9px] font-bold text-gray-400 uppercase italic tracking-widest">
                          Organic Mode
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-gray-700 dark:text-white italic">
                        LVL {item.promotion?.level || 0}
                      </span>
                      <div className="flex-1 h-1 w-16 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500"
                          style={{ width: `${Math.min((item.promotion?.level || 0) / 10, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        title="View Detailed Analytics"
                        onClick={() => router.push(`/creator/promotions/${item._id}`)}
                        className="p-2.5 bg-gray-100 dark:bg-white/5 hover:bg-orange-500 hover:text-white rounded-lg transition-all border border-black/5 dark:border-white/5"
                      >
                        <FiExternalLink size={16} />
                      </button>
                      <button
                        onClick={() => setSelectedListing(item)}
                        disabled={isBoostActive(item) && isPpcActive(item)}
                        className={`px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${isBoostActive(item) && isPpcActive(item)
                            ? 'bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                            : 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg active:scale-95'
                          }`}
                      >
                        {isBoostActive(item) && isPpcActive(item) ? 'Optimized' : 'Promote'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-white/20 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            Sequence {currentPage} / {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 border border-black/10 dark:border-white/10 rounded-md hover:bg-gray-200 dark:hover:bg-white/5 disabled:opacity-20 transition-all"
            >
              <FiChevronLeft />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2 border border-black/10 dark:border-white/10 rounded-md hover:bg-gray-200 dark:hover:bg-white/5 disabled:opacity-20 transition-all"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {/* Promotion Config Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 dark:bg-black/95 backdrop-blur-sm"
            onClick={() => setSelectedListing(null)}
          />
          {/* max-w-lg করে সাইজ ছোট করা হয়েছে */}
          <div className="relative bg-white dark:bg-[#0c0c0c] w-full max-w-lg rounded-2xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            {/* Header: প্যাডিং কিছুটা কমানো হয়েছে */}
            <div className="p-5 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-white/20">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-orange-500 rounded-lg">
                  <FiZap className="text-white" size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">
                    Protocol Settings
                  </h3>
                  <p className="text-[8px] text-orange-500 font-bold uppercase tracking-widest line-clamp-1">
                    {selectedListing.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedListing(null)}
                className="p-1.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full text-gray-400 transition-colors"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Body Section: p-8 থেকে কমিয়ে p-6 করা হয়েছে */}
            <div className="p-6 space-y-6">
              {/* Type Switcher: ছোট গ্যাপ */}
              <div className="grid grid-cols-2 gap-3">
                <ModalTab
                  active={promoType === 'boost'}
                  disabled={isBoostActive(selectedListing)}
                  onClick={() => setPromoType('boost')}
                  icon={FiZap}
                  label="Viral Boost"
                  subLabel={isBoostActive(selectedListing) ? 'Active' : 'Timeline'}
                  color="purple"
                />
                <ModalTab
                  active={promoType === 'ppc'}
                  disabled={isPpcActive(selectedListing)}
                  onClick={() => setPromoType('ppc')}
                  icon={FiActivity}
                  label="PPC Protocol"
                  subLabel={isPpcActive(selectedListing) ? 'Active' : 'Performance'}
                  color="orange"
                />
              </div>

              {/* Warning Section */}
              {((promoType === 'boost' && isBoostActive(selectedListing)) ||
                (promoType === 'ppc' && isPpcActive(selectedListing))) && (
                  <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-xl flex items-start gap-2">
                    <FiInfo className="text-red-500 mt-0.5" size={14} />
                    <p className="text-[9px] text-red-600 dark:text-red-200 font-bold uppercase tracking-tighter">
                      Protocol active. Please wait for completion.
                    </p>
                  </div>
                )}

              {/* Input & Info Section */}
              <div
                className={`space-y-4 transition-opacity ${(promoType === 'boost' && isBoostActive(selectedListing)) || (promoType === 'ppc' && isPpcActive(selectedListing)) ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}
              >
                <div className="grid grid-cols-2 gap-4">
                  {promoType === 'boost' ? (
                    <>
                      <InputGroup label="Duration (Days)" icon={FiClock}>
                        <input
                          type="number"
                          min="1"
                          value={boostDays}
                          onChange={(e) => setBoostDays(e.target.value)}
                          className="w-full pl-4 py-3 text-xs font-black tracking-tight rounded-xl outline-0 transition-all 
                     bg-gray-50 dark:bg-[#ffffff10] 
                     text-gray-900 dark:text-[#bbb] 
                     border border-black/10 dark:border-white/5 
                     focus:border-orange-500/50 dark:focus:border-orange-500/50 
                     focus:bg-white dark:focus:bg-[#ffffff15]"
                          placeholder="0"
                        />
                      </InputGroup>
                      <InputGroup label="Budget (€)" icon={FiDollarSign}>
                        <input
                          type="number"
                          min="5"
                          value={boostBudget}
                          onChange={(e) => setBoostBudget(e.target.value)}
                          className="w-full pl-4 py-3 text-xs font-black tracking-tight rounded-xl outline-0 transition-all 
                     bg-gray-50 dark:bg-[#ffffff10] 
                     text-gray-900 dark:text-[#bbb] 
                     border border-black/10 dark:border-white/5 
                     focus:border-orange-500/50 dark:focus:border-orange-500/50 
                     focus:bg-white dark:focus:bg-[#ffffff15]"
                          placeholder="5.00"
                        />
                      </InputGroup>
                    </>
                  ) : (
                    <>
                      <InputGroup label="Budget (€)" icon={FiDollarSign}>
                        <input
                          type="number"
                          min="5"
                          value={ppcAmount}
                          onChange={(e) => setPpcAmount(e.target.value)}
                          className="w-full pl-4 py-3 text-xs font-black tracking-tight rounded-xl outline-0 transition-all 
                     bg-gray-50 dark:bg-[#ffffff10] 
                     text-gray-900 dark:text-[#bbb] 
                     border border-black/10 dark:border-white/5 
                     focus:border-orange-500/50 dark:focus:border-orange-500/50 
                     focus:bg-white dark:focus:bg-[#ffffff15]"
                          placeholder="5.00"
                        />
                      </InputGroup>
                      <InputGroup label="Clicks" icon={FiMousePointer}>
                        <input
                          type="number"
                          min="10"
                          value={targetClicks}
                          onChange={(e) => setTargetClicks(e.target.value)}
                          className="w-full pl-4 py-3 text-xs font-black tracking-tight rounded-xl outline-0 transition-all 
                     bg-gray-50 dark:bg-[#ffffff10] 
                     text-gray-900 dark:text-[#bbb] 
                     border border-black/10 dark:border-white/5 
                     focus:border-orange-500/50 dark:focus:border-orange-500/50 
                     focus:bg-white dark:focus:bg-[#ffffff15]"
                          placeholder="10"
                        />
                      </InputGroup>
                    </>
                  )}
                </div>

                {/* Intensity/Bid Display: আরও কম্প্যাক্ট */}
                <div
                  className={`p-3.5 rounded-xl border flex justify-between items-center ${promoType === 'boost' ? 'bg-purple-50 dark:bg-purple-500/5 border-purple-200 dark:border-purple-500/20' : 'bg-orange-50 dark:bg-orange-500/5 border-orange-200 dark:border-orange-500/20'}`}
                >
                  <span className="text-[9px] font-black uppercase text-gray-500 dark:text-gray-400">
                    {promoType === 'boost' ? 'Daily Impact' : 'Bid Strength'}
                  </span>
                  <span className="text-base font-black text-gray-900 dark:text-white italic">
                    €{promoType === 'boost' ? dailyBoostIntensity : estimatedCPC}{' '}
                    <span className="text-[8px] text-gray-400 not-italic uppercase ml-1">
                      / {promoType === 'boost' ? 'Day' : 'Click'}
                    </span>
                  </span>
                </div>
              </div>

              {/* Footer Actions: ছোট সাইজ */}
              <div className="flex flex-col gap-3 pt-2">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                  <div className="flex gap-1">
                    {['eur', 'usd'].map((c) => (
                      <button
                        key={c}
                        onClick={() => setCurrency(c)}
                        className={`px-3 py-1 rounded-md text-[9px] font-black uppercase transition-all ${currency === c ? 'bg-gray-900 dark:bg-white text-white dark:text-black shadow-sm' : 'text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                      Total
                    </p>
                    <p className="text-xl font-black text-orange-600 dark:text-orange-500 tracking-tighter">
                      {currency === 'eur' ? '€' : '$'}
                      {displayCost}
                    </p>
                  </div>
                </div>

                <button
                  disabled={
                    paymentLoading ||
                    (promoType === 'boost' && isBoostActive(selectedListing)) ||
                    (promoType === 'ppc' && isPpcActive(selectedListing))
                  }
                  onClick={handlePromotion}
                  className="w-full py-4 bg-gray-900 dark:bg-orange-600 hover:bg-black dark:hover:bg-orange-500 disabled:opacity-30 text-white rounded-xl font-black uppercase text-[10px] tracking-[0.3em] transition-all shadow-lg active:scale-95"
                >
                  {paymentLoading ? 'Processing Payment...' : 'Boost My Listing'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const Badge = ({ label, color }) => (
  <div
    className={`px-2 py-1 rounded text-[8px] font-black uppercase border shadow-sm ${color === 'purple'
        ? 'bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400'
        : 'bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400'
      }`}
  >
    {label}
  </div>
);

const QuickStat = ({ label, value, icon: Icon }) => (
  <div className="px-6 py-4 bg-white dark:bg-white/20 border border-black/5 dark:border-white/5 rounded-2xl flex items-center gap-5 shadow-sm">
    <Icon className="text-orange-500" size={20} />
    <div>
      <p className="text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
        {label}
      </p>
      <p className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">{value}</p>
    </div>
  </div>
);

const ModalTab = ({ active, disabled, onClick, icon: Icon, label, subLabel, color }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={`p-5 rounded-2xl border transition-all text-left flex flex-col gap-4 ${active
        ? color === 'purple'
          ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/10'
          : 'border-orange-500 bg-orange-50 dark:bg-orange-500/10'
        : disabled
          ? 'opacity-30 grayscale cursor-not-allowed border-black/5 dark:border-white/5'
          : 'border-black/10 dark:border-white/5 bg-gray-50 dark:bg-white/2'
      }`}
  >
    <Icon
      className={
        active ? (color === 'purple' ? 'text-purple-500' : 'text-orange-500') : 'text-gray-400'
      }
      size={24}
    />
    <div>
      <span
        className={`block text-[11px] font-black uppercase tracking-widest ${active ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}
      >
        {label}
      </span>
      <span className="block text-[8px] font-bold text-gray-500 uppercase mt-1 italic">
        {subLabel}
      </span>
    </div>
  </button>
);

const InputGroup = ({ label, icon: Icon, children }) => (
  <div className="space-y-2.5">
    {' '}
    <label className="text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
      <Icon size={12} className="text-orange-500/80 dark:text-orange-400" /> {label}
    </label>
    {children}
  </div>
);