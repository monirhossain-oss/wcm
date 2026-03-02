'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiZap, FiCheckCircle, FiDollarSign, FiX, FiActivity } from 'react-icons/fi';
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
      showStatus('success', 'Success! Your promotion is now active.');
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
          showStatus('success', `Promotion activated!`);
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
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f97316', '#8b5cf6'],
    });
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Toast Notification (No Bounce) */}
      {statusMsg && (
        <div
          className={`fixed top-10 left-1/2 -translate-x-1/2 z-100 px-6 py-3 rounded-md border backdrop-blur-md shadow-2xl transition-all duration-300 animate-in fade-in zoom-in ${
            statusMsg.type === 'success'
              ? 'bg-green-500/10 border-green-500/50 text-green-500'
              : 'bg-red-500/10 border-red-500/50 text-red-500'
          }`}
        >
          <span className="text-sm font-bold tracking-tight">{statusMsg.text}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900 p-6 rounded-lg border border-white/10">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">
            Wallet Balance
          </p>
          <h2 className="text-3xl font-bold text-white tracking-tighter">
            €{stats?.walletBalance || '0.00'}
          </h2>
        </div>
        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1">
            Active Credits
          </p>
          <h2 className="text-3xl font-bold text-white tracking-tighter">
            €{stats?.totalPpcBalance || '0.00'}
          </h2>
        </div>
        <div className="bg-white/5 p-6 rounded-lg border border-white/10">
          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">
            Live Promos
          </p>
          <h2 className="text-3xl font-bold text-white tracking-tighter">
            {stats?.activePromotions || 0}
          </h2>
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-white/10 rounded-lg overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-[10px] font-bold uppercase text-zinc-400 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 tracking-widest">Asset</th>
                <th className="px-6 py-4 tracking-widest">Status</th>
                <th className="px-6 py-4 tracking-widest">Active Promotions</th>
                <th className="px-6 py-4 text-right tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {listings.map((item) => (
                <tr key={item._id} className="hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={getImageUrl(item.image)}
                        className="w-10 h-10 rounded-md object-cover border border-white/10"
                        alt=""
                      />
                      <div>
                        <span className="font-bold text-white block truncate max-w-37.5">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-medium">
                          RANK LVL: {item.promotion?.level || 0}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {item.isPromoted ? (
                      <span className="flex items-center gap-1.5 text-green-500 text-[10px] font-black uppercase">
                        <FiCheckCircle size={12} /> Active
                      </span>
                    ) : (
                      <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-tighter">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      {/* Boost Info */}
                      {item.promotion?.boost?.isActive && (
                        <div className="bg-purple-500/5 border border-purple-500/20 px-2 py-1 rounded w-fit">
                          <p className="text-purple-400 text-[10px] font-black uppercase flex items-center gap-1">
                            <FiZap size={10} /> Boost Active
                          </p>
                          <p className="text-zinc-500 text-[9px] font-bold">
                            EXP: {new Date(item.promotion.boost.expiresAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}

                      {/* PPC Info */}
                      {item.promotion?.ppc?.isActive && item.promotion?.ppc?.ppcBalance > 0 && (
                        <div className="bg-orange-500/5 border border-orange-500/20 px-2 py-1 rounded w-fit">
                          <p className="text-orange-400 text-[10px] font-black uppercase flex items-center gap-1">
                            <FiActivity size={10} /> PPC Running
                          </p>
                          <p className="text-zinc-500 text-[9px] font-bold uppercase">
                            Credits: €{item.promotion.ppc.ppcBalance}
                          </p>
                        </div>
                      )}

                      {!item.promotion?.boost?.isActive &&
                        (!item.promotion?.ppc?.isActive ||
                          item.promotion?.ppc?.ppcBalance <= 0) && (
                          <span className="text-zinc-600 text-[10px] italic">
                            No active schemes
                          </span>
                        )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedListing(item)}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md text-[10px] font-black uppercase transition-all shadow-lg active:scale-95"
                    >
                      Promote
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Promotion Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-950 w-full max-w-xl rounded-lg border border-white/10 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
              <div>
                <h3 className="text-lg font-black text-white uppercase tracking-tight">
                  Setup Promotion
                </h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">
                  Item: {selectedListing.title}
                </p>
              </div>
              <button
                onClick={() => setSelectedListing(null)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPromoType('boost')}
                  className={`p-4 rounded-lg border transition-all text-left ${promoType === 'boost' ? 'border-purple-500 bg-purple-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                >
                  <FiZap
                    className={promoType === 'boost' ? 'text-purple-500' : 'text-zinc-500'}
                    size={18}
                  />
                  <p className="text-xs font-black text-white uppercase mt-2">Duration Boost</p>
                  <p className="text-[9px] text-zinc-500 font-medium leading-tight mt-1">
                    Increased visibility for a fixed duration.
                  </p>
                </button>
                <button
                  onClick={() => setPromoType('ppc')}
                  className={`p-4 rounded-lg border transition-all text-left ${promoType === 'ppc' ? 'border-orange-500 bg-orange-500/10' : 'border-white/10 bg-white/5 hover:bg-white/10'}`}
                >
                  <FiActivity
                    className={promoType === 'ppc' ? 'text-orange-500' : 'text-zinc-500'}
                    size={18}
                  />
                  <p className="text-xs font-black text-white uppercase mt-2">Pay Per Click</p>
                  <p className="text-[9px] text-zinc-500 font-medium leading-tight mt-1">
                    Only pay when a user clicks your listing.
                  </p>
                </button>
              </div>

              {promoType === 'boost' ? (
                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase">
                    <span>Campaign: {boostDays} DAYS</span>
                    <span className="text-purple-500">Cost: €{currentBoostCost}</span>
                  </div>
                  <input
                    type="range"
                    min="7"
                    max="90"
                    value={boostDays}
                    onChange={(e) => setBoostDays(e.target.value)}
                    className="w-full accent-purple-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                    Credit Deposit
                  </p>
                  <div className="relative">
                    <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500" />
                    <input
                      type="number"
                      value={ppcAmount}
                      onChange={(e) => setPpcAmount(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-md py-3 pl-10 pr-4 text-white font-bold text-lg focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder="Min 5.00"
                    />
                  </div>
                </div>
              )}

              <div className="bg-white/5 p-4 rounded-lg flex justify-between items-center border border-white/10 shadow-inner">
                <div className="flex gap-1">
                  {['eur', 'usd'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`px-3 py-1 rounded text-[9px] font-black uppercase transition-all ${currency === c ? 'bg-white text-black' : 'text-zinc-500 border border-white/5'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-zinc-500 font-black uppercase">Total Charge</p>
                  <p className="text-xl font-black text-white italic tracking-tighter">
                    {currency === 'eur' ? '€' : '$'}
                    {currency === 'eur' ? displayCost : (displayCost / FX_RATE).toFixed(2)}
                  </p>
                </div>
              </div>

              <button
                disabled={paymentLoading || (promoType === 'ppc' && ppcAmount < 5)}
                onClick={handlePromotion}
                className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white rounded-md font-black uppercase text-xs transition-all shadow-xl shadow-orange-900/10 active:scale-[0.98]"
              >
                {paymentLoading ? 'Processing...' : 'Confirm Activation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
