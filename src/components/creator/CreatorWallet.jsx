'use client';
import { useState } from 'react';
import axios from 'axios';
import { FiPlus, FiCreditCard, FiInfo, FiX, FiLoader } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { getApiErrorMessage } from '@/lib/apiError';
import { useLocale } from '@/context/LocaleContext';
import { formatCurrency } from '@/lib/i18n/formatters';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function CreatorWallet({ walletBalance }) {
  const { isBusinessRestricted } = useAuth();
  const { locale, t, tf } = useLocale();
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState(20);
  const [topUpCurrency, setTopUpCurrency] = useState('EUR');
  const [actionLoading, setActionLoading] = useState(false);

  const handleTopUpSubmit = async () => {
    if (isBusinessRestricted) return toast.error(t('creator.restricted.action'));
    if (topUpAmount < 5) return toast.error(tf('creator.wallet.minimumTopUp', { amount: 5 }));

    setActionLoading(true);
    try {
      // শুধুমাত্র amount এবং currency পাঠাচ্ছি, বাকিটা ব্যাকএন্ড ইউজার প্রোফাইল থেকে নিবে
      const res = await api.post('/api/payments/create-checkout-session', {
        amount: Number(topUpAmount),
        currency: topUpCurrency,
      });

      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, t('creator.wallet.checkoutFailed'), t));
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      {/* Wallet Display Card */}
      <div className="md:col-span-2 bg-zinc-900 dark:bg-[#0a0a0a] rounded-md p-6 text-white flex justify-between md:items-center border border-white/10 shadow-2xl relative max-md:flex-col gap-4 overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 group cursor-help">
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-black">
              {t('creator.wallet.availableCredits')}
            </p>
            <div className="relative">
              <FiInfo
                size={12}
                className="text-zinc-500 group-hover:text-orange-500 transition-colors"
              />
              <div className="absolute top-full left-0 mt-2 w-56 p-3 bg-zinc-800 text-[10px] text-zinc-300 rounded-md opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-2xl border border-white/5 leading-relaxed z-[100]">
                {t('creator.wallet.creditsInfo')}
              </div>
            </div>
          </div>
          <h2 className="text-4xl font-black tracking-tighter italic">
            {formatCurrency(walletBalance || 0, locale)}
          </h2>
        </div>

        <button
          onClick={() => setShowTopUpModal(true)}
          disabled={isBusinessRestricted}
          className="relative z-10 bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-md flex items-center gap-3 transition-all font-black text-[10px] uppercase tracking-widest active:scale-95 whitespace-nowrap justify-center shadow-lg shadow-orange-500/20"
        >
          <FiPlus size={18} /> {t('creator.wallet.addCredits')}
        </button>

        {/* Abstract Background Icon */}
        <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
          <FiCreditCard size={200} />
        </div>
      </div>

      {/* Top-Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#0a0a0a] w-full max-w-sm rounded-md shadow-2xl border border-zinc-200 dark:border-white/10 overflow-hidden text-left animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-zinc-100 dark:border-white/5 flex justify-between items-center bg-zinc-50/50 dark:bg-white/5">
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 dark:text-white">
                <FiCreditCard className="text-orange-500" size={16} />{' '}
                {t('creator.wallet.topUpTitle')}
              </h3>
              <button
                onClick={() => setShowTopUpModal(false)}
                className="text-zinc-400 hover:text-red-500 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 gap-5">
                {/* Currency Selection */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">
                    {t('creator.wallet.selectCurrency')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['EUR', 'USD'].map((curr) => (
                      <button
                        key={curr}
                        onClick={() => setTopUpCurrency(curr)}
                        className={`py-3 rounded-md text-[10px] font-black transition-all border ${topUpCurrency === curr ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-zinc-100 dark:bg-white/5 text-zinc-500 border-transparent hover:border-zinc-300'}`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-400 uppercase tracking-widest ml-1">
                    {t('creator.wallet.enterAmount')}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      className="w-full bg-zinc-100 dark:bg-white/5 border border-transparent focus:border-orange-500/50 px-4 py-4 rounded-md text-sm font-black outline-none dark:text-white transition-all"
                      placeholder={t('creator.wallet.amountPlaceholder')}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-400 uppercase">
                      {topUpCurrency}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-orange-500/5 rounded-md border border-orange-500/10">
                <p className="text-[9px] text-zinc-500 dark:text-zinc-400 font-bold leading-relaxed text-center uppercase tracking-tighter">
                  {t('creator.wallet.vatNote')}
                </p>
              </div>

              <button
                onClick={handleTopUpSubmit}
                disabled={actionLoading || topUpAmount < 5 || isBusinessRestricted}
                className="w-full py-5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-md font-black uppercase text-[10px] tracking-[0.3em] transition-all hover:bg-orange-600 hover:text-white active:scale-[0.98] disabled:opacity-20 flex items-center justify-center gap-2"
              >
                {actionLoading ? (
                  <>
                    <FiLoader className="animate-spin" /> {t('creator.wallet.processing')}
                  </>
                ) : (
                  t('creator.wallet.checkout')
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
