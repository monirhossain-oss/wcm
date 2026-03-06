'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiZap,
  FiCheckCircle,
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
} from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageHelper';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import toast, { Toaster } from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

const FX_RATE = 0.92;

export default function PromotionsPage() {
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [currency, setCurrency] = useState('eur');
  const [promoType, setPromoType] = useState('boost');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Boost States (Updated: Manual input)
  const [boostDays, setBoostDays] = useState(7);
  const [boostBudget, setBoostBudget] = useState(20);

  // PPC States
  const [ppcAmount, setPpcAmount] = useState(10);
  const [targetClicks, setTargetClicks] = useState(50);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Calculations
  const displayCost = promoType === 'boost' ? boostBudget : ppcAmount;
  const estimatedCPC = (ppcAmount / targetClicks).toFixed(2);
  const dailyBoostIntensity = (boostBudget / boostDays).toFixed(2);

  useEffect(() => {
    initData();
    if (searchParams.get('success') === 'true') {
      triggerConfetti();
      toast.success('Promotion Protocol Activated!', {
        style: { background: '#111', color: '#fff', border: '1px solid #222' },
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
    const finalAmountEUR = Number(displayCost);

    // Validation
    if (promoType === 'boost' && (boostBudget < 5 || boostDays < 1)) {
      return toast.error('Minimum investment €5 for 1 day');
    }
    if (promoType === 'ppc' && (ppcAmount < 5 || targetClicks < 1)) {
      return toast.error('Minimum investment €5 for PPC');
    }

    setPaymentLoading(true);
    const toastId = toast.loading('Initializing Transaction...');

    const payload = {
      listingId: selectedListing._id,
      packageType: promoType,
      amount: currency === 'eur' ? finalAmountEUR : (finalAmountEUR / FX_RATE).toFixed(2),
      currency,
      days: promoType === 'boost' ? boostDays : 0,
      totalClicks: promoType === 'ppc' ? targetClicks : 0,
      currentPath: pathname,
    };

    try {
      // Wallet check
      if (currency === 'eur' && stats?.walletBalance >= finalAmountEUR) {
        const res = await api.post('/api/payments/pay-with-wallet', payload);
        if (res.data.success) {
          triggerConfetti();
          toast.success('Transaction Verified. Growth Active.', { id: toastId });
          setSelectedListing(null);
          initData();
        }
      } else {
        const res = await api.post('/api/payments/create-checkout-session', payload);
        if (res.data.url) {
          toast.dismiss(toastId);
          window.location.href = res.data.url;
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authorization Refused', { id: toastId });
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

  const currentItems = listings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(listings.length / itemsPerPage);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 font-sans">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-orange-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em]">
              Visibility Engine
            </span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white">
            Growth <span className="text-orange-600/80 italic">Accelerator</span>
          </h1>
        </div>

        <div className="flex gap-4">
          <QuickStat label="Vault" value={`€${stats?.walletBalance || '0'}`} icon={FiShield} />
          <QuickStat label="Active" value={stats?.activePromotions || '0'} icon={FiTrendingUp} />
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-[#0c0c0c] border border-white/5 rounded-lg shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-widest">
            Validated Assets
          </h2>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 bg-green-500 rounded-full" />
            <span className="text-[9px] font-bold text-gray-500 uppercase">Live Network</span>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full">
            <thead>
              <tr className="bg-white/2 text-left">
                <th className="px-6 py-4 text-[9px] font-black uppercase text-gray-500 tracking-widest">
                  Node Identification
                </th>
                <th className="px-6 py-4 text-[9px] font-black uppercase text-gray-500 tracking-widest">
                  Campaign Logic
                </th>
                <th className="px-6 py-4 text-[9px] font-black uppercase text-gray-500 tracking-widest">
                  Status
                </th>
                <th className="px-6 py-4 text-[9px] font-black uppercase text-gray-500 tracking-widest text-right">
                  Operation
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {currentItems.map((item) => (
                <tr key={item._id} className="hover:bg-white/3 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-lg overflow-hidden border border-white/10 group-hover:border-orange-500/30 transition-all">
                        <img
                          src={getImageUrl(item.image)}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase text-white tracking-tight">
                          {item.title}
                        </p>
                        <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">
                          Level: {item.promotion?.level || 0}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-2">
                      {item.promotion?.boost?.isActive && (
                        <div className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-purple-500">
                          <p className="text-[8px] font-black uppercase">Viral Boost</p>
                        </div>
                      )}
                      {item.promotion?.ppc?.isActive && (
                        <div className="px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded text-orange-500">
                          <p className="text-[8px] font-black uppercase">PPC Protocol</p>
                        </div>
                      )}
                      {!item.isPromoted && (
                        <span className="text-[9px] font-bold text-gray-600 uppercase italic">
                          Standby
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {item.isPromoted ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[8px] font-black uppercase">
                        <div className="h-1 w-1 bg-green-500 rounded-full animate-pulse" /> Active
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-gray-700 uppercase tracking-widest">
                        Idle
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => router.push(`/creator/promotions/${item._id}`)}
                        className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-all border border-white/5"
                      >
                        <FiBarChart2 size={16} />
                      </button>
                      <button
                        onClick={() => setSelectedListing(item)}
                        className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(234,88,12,0.3)] active:scale-95"
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
        <div className="px-6 py-4 bg-white/1 border-t border-white/5 flex items-center justify-between">
          <span className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em]">
            Sequence {currentPage} / {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-2 border border-white/10 rounded-md hover:bg-white/5 disabled:opacity-20 transition-all"
            >
              <FiChevronLeft className="text-gray-400" />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-2 border border-white/10 rounded-md hover:bg-white/5 disabled:opacity-20 transition-all"
            >
              <FiChevronRight className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Promotion Config Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedListing(null)}
          />

          <div className="relative bg-[#0c0c0c] w-full max-w-xl rounded-lg border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden animate-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/2">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">
                  Protocol Setup
                </h3>
                <p className="text-[9px] text-gray-500 font-bold uppercase mt-1 italic tracking-widest">
                  {selectedListing.title}
                </p>
              </div>
              <button
                onClick={() => setSelectedListing(null)}
                className="p-2 hover:bg-white/10 rounded-full text-gray-400 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-4">
                <ModalTab
                  active={promoType === 'boost'}
                  onClick={() => setPromoType('boost')}
                  icon={FiZap}
                  label="Fixed Boost"
                  color="purple"
                />
                <ModalTab
                  active={promoType === 'ppc'}
                  onClick={() => setPromoType('ppc')}
                  icon={FiActivity}
                  label="Pay Per Click"
                  color="orange"
                />
              </div>

              {/* Dynamic Form */}
              <div className="space-y-6">
                {promoType === 'boost' ? (
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Duration (Days)" icon={FiClock}>
                      <input
                        type="number"
                        min="1"
                        value={boostDays}
                        onChange={(e) => setBoostDays(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white font-black text-sm focus:border-purple-500 focus:outline-none"
                      />
                    </InputGroup>
                    <InputGroup label="Total Budget (€)" icon={FiDollarSign}>
                      <input
                        type="number"
                        min="5"
                        value={boostBudget}
                        onChange={(e) => setBoostBudget(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white font-black text-sm focus:border-purple-500 focus:outline-none"
                      />
                    </InputGroup>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Budget Amount (€)" icon={FiDollarSign}>
                      <input
                        type="number"
                        min="5"
                        value={ppcAmount}
                        onChange={(e) => setPpcAmount(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white font-black text-sm focus:border-orange-500 focus:outline-none"
                      />
                    </InputGroup>
                    <InputGroup label="Target Clicks" icon={FiMousePointer}>
                      <input
                        type="number"
                        min="10"
                        value={targetClicks}
                        onChange={(e) => setTargetClicks(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white font-black text-sm focus:border-orange-500 focus:outline-none"
                      />
                    </InputGroup>
                  </div>
                )}

                {/* Info Display */}
                <div
                  className={`p-4 rounded-lg border flex justify-between items-center ${promoType === 'boost' ? 'bg-purple-500/5 border-purple-500/20' : 'bg-orange-500/5 border-orange-500/20'}`}
                >
                  <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center gap-2">
                    {promoType === 'boost' ? (
                      <>
                        <FiTrendingUp className="text-purple-500" /> Daily Intensity
                      </>
                    ) : (
                      <>
                        <FiMousePointer className="text-orange-500" /> Bid Intensity
                      </>
                    )}
                  </span>
                  <span className="text-lg font-black text-white italic">
                    €{promoType === 'boost' ? dailyBoostIntensity : estimatedCPC}{' '}
                    <span className="text-[8px] text-gray-500 uppercase">
                      / {promoType === 'boost' ? 'Day' : 'Click'}
                    </span>
                  </span>
                </div>
              </div>

              {/* Currency Selector */}
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/5">
                <div className="flex gap-2">
                  {['eur', 'usd'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`px-4 py-1.5 rounded text-[10px] font-black uppercase transition-all ${currency === c ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                    Est. Investment
                  </p>
                  <p className="text-2xl font-black text-white tracking-tighter">
                    {currency === 'eur' ? '€' : '$'}
                    {currency === 'eur' ? displayCost : (displayCost / FX_RATE).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                disabled={paymentLoading}
                onClick={handlePromotion}
                className="w-full py-5 bg-orange-600 hover:bg-orange-500 disabled:opacity-20 text-white rounded-lg font-black uppercase text-[11px] tracking-[0.3em] transition-all hover:shadow-[0_0_30px_rgba(234,88,12,0.2)]"
              >
                {paymentLoading ? 'Authenticating...' : 'Engage Protocol'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
const QuickStat = ({ label, value, icon: Icon }) => (
  <div className="px-5 py-3 bg-white/5 border border-white/5 rounded-lg flex items-center gap-4">
    <div className="p-2 bg-white/5 rounded-lg">
      <Icon className="text-orange-500" size={16} />
    </div>
    <div>
      <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em]">{label}</p>
      <p className="text-lg font-black text-white tracking-tighter">{value}</p>
    </div>
  </div>
);

const ModalTab = ({ active, onClick, icon: Icon, label, color }) => (
  <button
    onClick={onClick}
    className={`p-4 rounded-lg border transition-all text-left flex flex-col gap-3 ${active ? (color === 'purple' ? 'border-purple-500/50 bg-purple-500/10' : 'border-orange-500/50 bg-orange-500/10') : 'border-white/5 bg-white/2 hover:bg-white/5'}`}
  >
    <Icon
      className={
        active ? (color === 'purple' ? 'text-purple-500' : 'text-orange-500') : 'text-gray-600'
      }
      size={20}
    />
    <span
      className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-white' : 'text-gray-500'}`}
    >
      {label}
    </span>
  </button>
);

const InputGroup = ({ label, icon: Icon, children }) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
      <Icon size={12} /> {label}
    </label>
    {children}
  </div>
);
