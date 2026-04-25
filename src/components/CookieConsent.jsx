'use client';
import { useState, useEffect } from 'react';
import { FiShield, FiInfo } from 'react-icons/fi';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    window.dispatchEvent(new Event('cookie-consent-updated'));
    setShow(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 z-999 animate-in slide-in-from-bottom-10 duration-700">
      <div className="max-w-5xl mx-auto bg-white dark:bg-[#0a0a0a]/90 backdrop-blur-2xl border border-gray-100 dark:border-white/10 p-5 md:p-8 rounded-2xl shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex items-start gap-5">
          <div className="p-4 bg-orange-500/20 rounded-xl text-orange-500 hidden md:block">
            <FiShield size={28} />
          </div>
          <div className="space-y-2">
            <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-orange-500 italic flex items-center gap-2">
              <FiInfo className="md:hidden" /> Privacy Protocol
            </h4>
            <p className="text-[10px] md:text-[12px] text-gray-500 dark:text-gray-400 font-bold leading-relaxed max-w-2xl uppercase italic">
              We use analytics cookies for a superior asset discovery experience. Review our{' '}
              <a href="/privacy-policy" className="text-orange-500 underline underline-offset-4">
                Legal Documentation
              </a>
              .
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <button
            onClick={handleReject}
            className="w-full sm:w-auto px-8 py-4 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer"
          >
            Reject
          </button>
          <button
            onClick={handleAccept}
            className="w-full sm:w-auto px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-orange-500/30 active:scale-95 whitespace-nowrap cursor-pointer"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
