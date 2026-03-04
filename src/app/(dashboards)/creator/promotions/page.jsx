'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiZap, FiCheckCircle, FiDollarSign, FiX, FiActivity, FiShield, FiTrendingUp } from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageHelper';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';

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
  const [statusMsg, setStatusMsg] = useState(null);
  const [currency, setCurrency] = useState('eur');
  const [promoType, setPromoType] = useState('boost');
  const [boostDays, setBoostDays] = useState(30);
  const [ppcAmount, setPpcAmount] = useState(10);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const BOOST_PER_DAY = 1.63;
  const currentBoostCost = (boostDays * BOOST_PER_DAY).toFixed(2);
  const displayCost = promoType === 'boost' ? currentBoostCost : ppcAmount;

  useEffect(() => {
    initData();
    if (searchParams.get('success') === 'true') {
      triggerConfetti();
      showStatus('success', 'Promotion activated successfully.');
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showStatus = (type, text) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 5000);
  };

  const handlePromotion = async () => {
    const finalAmountEUR = Number(displayCost);
    setPaymentLoading(true);
    try {
      if (currency === 'eur' && stats?.walletBalance >= finalAmountEUR) {
        const res = await api.post('/api/payments/pay-with-wallet', {
          listingId: selectedListing._id,
          packageType: promoType,
          amount: finalAmountEUR,
          days: promoType === 'boost' ? boostDays : 0,
        });
        if (res.data.success) {
          triggerConfetti();
          showStatus('success', `Promotion active!`);
          setSelectedListing(null);
          initData();
        }
      } else {
        const res = await api.post('/api/payments/create-checkout-session', {
          listingId: selectedListing._id,
          packageType: promoType,
          amount: currency === 'eur' ? finalAmountEUR : (finalAmountEUR / FX_RATE).toFixed(2),
          currency,
          days: promoType === 'boost' ? boostDays : 0,
          currentPath: pathname,
        });
        if (res.data.url) window.location.href = res.data.url;
      }
    } catch (err) {
      showStatus('error', err.response?.data?.message || 'Transaction Failed');
    } finally {
      setPaymentLoading(false);
    }
  };

  const triggerConfetti = () => {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#f97316', '#8b5cf6'] });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center dark:bg-[#050505]">
      <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 px-4 font-sans animate-in fade-in duration-700">
      
      {/* 🔹 Status Notification */}
      {statusMsg && (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-md border backdrop-blur-md shadow-2xl animate-in zoom-in ${
          statusMsg.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-red-500/10 border-red-500/30 text-red-500'
        }`}>
          <span className="text-[10px] font-black uppercase tracking-widest">{statusMsg.text}</span>
        </div>
      )}

      {/* 🔹 Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 dark:border-white/5 pb-8">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter dark:text-white flex items-center gap-3">
            <FiTrendingUp className="text-orange-500" /> Growth <span className="text-orange-500">Accelerator</span>
          </h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">Scale your node visibility across the network</p>
        </div>
      </div>

      {/* 🔹 Stats Intelligence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard label="Vault Balance" value={`€${stats?.walletBalance || '0.00'}`} color="text-black dark:text-white" />
        <StatsCard label="Campaign Credits" value={`€${stats?.totalPpcBalance || '0.00'}`} color="text-purple-500" />
        <StatsCard label="Active Nodes" value={stats?.activePromotions || 0} color="text-blue-500" />
      </div>

      {/* 🔹 Tactical Inventory Table */}
      <div className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/5 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/20 border-b border-gray-100 dark:border-white/5">
                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400">Asset</th>
                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400">Campaign Logic</th>
                <th className="px-6 py-5 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-white/5 text-sm">
              {listings.map((item) => (
  <tr key={item._id} className="hover:bg-gray-50/50 dark:hover:bg-white/20 transition-all group">
    <td className="px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-md overflow-hidden border border-gray-100 dark:border-white/10 shrink-0">
          <img src={getImageUrl(item.image)} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all" alt="" />
        </div>
        <div>
          <span className="text-xs font-black uppercase dark:text-white block truncate max-w-[150px]">{item.title}</span>
          <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Rank: {item.promotion?.level || 0}</span>
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      {item.isPromoted ? (
        <span className="flex items-center gap-1.5 text-green-500 text-[9px] font-black uppercase italic tracking-widest">
          <FiCheckCircle size={10} /> Operational
        </span>
      ) : (
        <span className="text-gray-400 text-[9px] font-black uppercase tracking-widest opacity-40 italic">Standby</span>
      )}
    </td>
    <td className="px-6 py-4">
      <div className="flex flex-wrap gap-2">
        {/* 🔹 Boost Expiry Info */}
        {item.promotion?.boost?.isActive && (
          <div className="bg-purple-500/10 border border-purple-500/20 px-2.5 py-1.5 rounded-sm">
            <p className="text-purple-500 text-[8px] font-black uppercase flex items-center gap-1">
              <FiZap size={10} /> Boost Active
            </p>
            <p className="text-[7px] text-gray-500 dark:text-gray-400 font-bold uppercase mt-0.5">
              EXP: {new Date(item.promotion.boost.expiresAt).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* 🔹 PPC Credits Info */}
        {item.promotion?.ppc?.isActive && item.promotion?.ppc?.ppcBalance > 0 && (
          <div className="bg-orange-500/10 border border-orange-500/20 px-2.5 py-1.5 rounded-sm">
            <p className="text-orange-500 text-[8px] font-black uppercase flex items-center gap-1">
              <FiActivity size={10} /> PPC Logic
            </p>
            <p className="text-[7px] text-gray-500 dark:text-gray-400 font-bold uppercase mt-0.5">
              CREDITS: €{item.promotion.ppc.ppcBalance}
            </p>
          </div>
        )}

        {/* 🔹 No Active Scheme State */}
        {(!item.promotion?.boost?.isActive && (!item.promotion?.ppc?.isActive || item.promotion?.ppc?.ppcBalance <= 0)) && (
          <span className="text-[8px] text-gray-400 font-bold uppercase italic opacity-60">
            No Active Schemes
          </span>
        )}
      </div>
    </td>
    <td className="px-6 py-4 text-right">
      <button onClick={() => setSelectedListing(item)} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-md shadow-orange-500/10">
        Promote
      </button>
    </td>
  </tr>
))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔹 Promotion Configuration Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md bg-black/80 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0c0c0c] w-full max-w-xl rounded-lg border border-gray-100 dark:border-white/5 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/20">
              <div>
                <h3 className="text-sm font-black dark:text-white uppercase tracking-widest flex items-center gap-2"><FiShield className="text-orange-500" /> Protocol Setup</h3>
                <p className="text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-widest italic">{selectedListing.title}</p>
              </div>
              <button onClick={() => setSelectedListing(null)} className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-md transition-colors text-gray-400"><FiX size={18} /></button>
            </div>

            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <OptionButton active={promoType === 'boost'} onClick={() => setPromoType('boost')} icon={FiZap} label="Fixed Boost" desc="Duration based visibility." color="purple" />
                <OptionButton active={promoType === 'ppc'} onClick={() => setPromoType('ppc')} icon={FiActivity} label="PPC Credits" desc="Pay per active engagement." color="orange" />
              </div>

              {promoType === 'boost' ? (
                <div className="space-y-4">
                  <div className="flex justify-between text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    <span>Campaign: {boostDays} Days</span>
                    <span className="text-purple-500">Cost: €{currentBoostCost}</span>
                  </div>
                  <input type="range" min="7" max="90" value={boostDays} onChange={(e) => setBoostDays(e.target.value)} className="w-full accent-purple-500 h-1 bg-gray-100 dark:bg-white/10 rounded-lg appearance-none cursor-pointer" />
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Credit Deposit Amount</p>
                  <div className="relative">
                    <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500" />
                    <input type="number" value={ppcAmount} onChange={(e) => setPpcAmount(e.target.value)} className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-md py-4 pl-12 pr-4 dark:text-white font-black text-lg focus:outline-none focus:border-orange-500 transition-all" placeholder="Min 5.00" />
                  </div>
                </div>
              )}

              <div className="p-5 bg-gray-50 dark:bg-white/5 rounded-md flex justify-between items-center border border-gray-100 dark:border-white/5">
                <div className="flex gap-2">
                  {['eur', 'usd'].map((c) => (
                    <button key={c} onClick={() => setCurrency(c)} className={`px-4 py-1.5 rounded-sm text-[9px] font-black uppercase transition-all ${currency === c ? 'bg-black dark:bg-white text-white dark:text-black' : 'text-gray-400 border border-gray-200 dark:border-white/5'}`}>{c}</button>
                  ))}
                </div>
                <div className="text-right">
                  <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">Total Investment</p>
                  <p className="text-2xl font-black dark:text-white italic tracking-tighter">
                    {currency === 'eur' ? '€' : '$'}{currency === 'eur' ? displayCost : (displayCost / FX_RATE).toFixed(2)}
                  </p>
                </div>
              </div>

              <button disabled={paymentLoading || (promoType === 'ppc' && ppcAmount < 5)} onClick={handlePromotion} className="w-full py-5 bg-orange-500 hover:bg-orange-600 disabled:opacity-30 text-white rounded-md font-black uppercase text-[10px] tracking-[0.4em] transition-all shadow-lg shadow-orange-500/10 active:scale-95">
                {paymentLoading ? 'Processing Request...' : 'Initiate Activation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 🔹 Reusable Components
const StatsCard = ({ label, value, color }) => (
  <div className="bg-white dark:bg-[#0c0c0c] p-6 rounded-lg border border-gray-100 dark:border-white/5 shadow-sm">
    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{label}</p>
    <h2 className={`text-3xl font-black tracking-tighter ${color}`}>{value}</h2>
  </div>
);

const OptionButton = ({ active, onClick, icon: Icon, label, desc, color }) => (
  <button onClick={onClick} className={`p-5 rounded-md border transition-all text-left group ${active ? (color === 'purple' ? 'border-purple-500 bg-purple-500/5' : 'border-orange-500 bg-orange-500/5') : 'border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/2 hover:border-gray-300 dark:hover:border-white/20'}`}>
    <Icon className={`mb-3 ${active ? (color === 'purple' ? 'text-purple-500' : 'text-orange-500') : 'text-gray-400 group-hover:text-gray-200'}`} size={20} />
    <p className={`text-[10px] font-black uppercase tracking-widest ${active ? 'dark:text-white' : 'text-gray-400'}`}>{label}</p>
    <p className="text-[9px] text-gray-400 font-bold mt-1 leading-relaxed italic">{desc}</p>
  </button>
);