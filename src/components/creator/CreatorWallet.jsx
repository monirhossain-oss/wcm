'use client';
import { useState } from 'react';
import axios from 'axios';
import { FiPlus, FiCreditCard, FiInfo, FiX, FiGlobe, FiBriefcase } from 'react-icons/fi';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

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

export default function CreatorWallet({ walletBalance, pathname }) {
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(10);
  const [topUpCurrency, setTopUpCurrency] = useState('EUR');
  const [billingCountry, setBillingCountry] = useState('FR');
  const [isBusiness, setIsBusiness] = useState(false);
  const [vatNumber, setVatNumber] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const handleTopUpSubmit = async () => {
    if (topUpAmount < 5) return toast.error('Minimum top-up is 5 units');
    if (isBusiness && !vatNumber && billingCountry !== 'US') {
      toast.error('VAT number recommended for EU businesses');
    }

    setActionLoading(true);
    try {
      const res = await api.post('/api/payments/create-checkout-session', {
        amount: Number(topUpAmount),
        currency: topUpCurrency,
        country: billingCountry,
        isBusiness: isBusiness,
        vatNumber: vatNumber,
        currentPath: pathname,
      });
      if (res.data.url) window.location.href = res.data.url;
    } catch (err) {
      toast.error('Top-up request failed');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <div className="md:col-span-2 bg-zinc-900 rounded-lg p-6 text-white flex justify-between md:items-center border border-white/20 shadow-2xl relative max-md:flex-col gap-4 overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 group cursor-help">
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black">
              Available Balance
            </p>
            <div className="relative">
              <FiInfo
                size={12}
                className="text-zinc-500 group-hover:text-orange-500 transition-colors"
              />
              <div className="absolute top-full left-0 mt-2 w-56 p-3 bg-zinc-800 text-[10px] text-zinc-300 rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-2xl border border-white/5 leading-relaxed z-[100]">
                This amount is <span className="text-white">Available</span> in your wallet but{' '}
                <span className="text-white">Not Yet Spent</span>.
              </div>
            </div>
          </div>
          <h2 className="text-4xl font-black tracking-tighter italic">
            €{(walletBalance || 0).toFixed(2)}
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

      {showTopUpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
          <div className="bg-white dark:bg-zinc-950 w-full max-w-lg rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden text-left">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
              <h3 className="font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-3 dark:text-white">
                <FiCreditCard className="text-orange-500" size={18} /> Financial Secure Top-up
              </h3>
              <button
                onClick={() => setShowTopUpModal(false)}
                className="text-zinc-400 hover:text-red-500 transition-colors"
              >
                <FiX size={22} />
              </button>
            </div>
            <div className="p-8 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">
                    Currency
                  </label>
                  <select
                    value={topUpCurrency}
                    onChange={(e) => setTopUpCurrency(e.target.value)}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border-none px-4 py-3.5 rounded-xl text-xs font-black outline-none dark:text-white"
                  >
                    <option value="EUR">EUR (€)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="w-full bg-zinc-100 dark:bg-zinc-800 border-none px-4 py-3.5 rounded-xl text-xs font-black outline-none dark:text-white"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2 mb-2">
                  <FiGlobe className="text-orange-500" size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Billing Information
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">
                      Tax Country
                    </label>
                    <select
                      value={billingCountry}
                      onChange={(e) => setBillingCountry(e.target.value)}
                      className="w-full bg-zinc-100 dark:bg-zinc-800 border-none px-4 py-3.5 rounded-xl text-xs font-black outline-none dark:text-white"
                    >
                      {EU_COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
                    <input
                      type="checkbox"
                      id="isBusiness"
                      checked={isBusiness}
                      onChange={(e) => setIsBusiness(e.target.checked)}
                      className="w-4 h-4 accent-orange-500"
                    />
                    <label
                      htmlFor="isBusiness"
                      className="text-[10px] font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 cursor-pointer flex items-center gap-2"
                    >
                      <FiBriefcase /> I am a registered Business
                    </label>
                  </div>
                  {isBusiness && (
                    <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                      <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">
                        VAT / Tax Number
                      </label>
                      <input
                        placeholder="e.g. FR123456789"
                        value={vatNumber}
                        onChange={(e) => setVatNumber(e.target.value)}
                        className="w-full bg-zinc-100 dark:bg-zinc-800 border-none px-4 py-3.5 rounded-xl text-xs font-black outline-none dark:text-white placeholder:text-zinc-500"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4 bg-zinc-900 text-zinc-400 rounded-xl text-[9px] font-bold leading-relaxed">
                VAT is calculated based on EU regulations. France: 20%. Businesses: 0% if valid VAT.
              </div>
              <button
                onClick={handleTopUpSubmit}
                disabled={actionLoading}
                className="w-full py-4.5 bg-orange-600 text-white rounded-xl font-black text-[11px] uppercase tracking-[0.3em] shadow-xl hover:bg-orange-700 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {actionLoading ? 'Encrypting Request...' : 'Proceed to Checkout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
