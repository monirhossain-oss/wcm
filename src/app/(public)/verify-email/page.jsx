'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import LoginModal from '@/components/LoginModal';
import RegisterModal from '@/components/RegistationModal';
import { useLocale } from '@/context/LocaleContext';
import { createEmailVerifier, recoveryError } from '@/lib/accountRecovery';

const verifyEmail = createEmailVerifier();

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const { t, localize } = useLocale();

  const [result, setResult] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Navbar-এর মতো একই switch pattern
  const openLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };
  const openRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  useEffect(() => {
    if (!token) return;
    let active = true;
    verifyEmail(token, process.env.NEXT_PUBLIC_API_BASE_URL)
      .then((response) => {
        if (!active) return;
        setResult({ token, response });
        if (response.ok) setIsLoginOpen(true);
      })
      .catch(() => { if (active) setResult({ token, networkError: true }); });
    return () => { active = false; };
  }, [token]);

  const current = result?.token === token ? result : null;
  const status = !token ? 'error' : !current ? 'loading' : current.response?.ok ? 'success' : 'error';
  const message = !token ? t('accountRecovery.missingToken')
    : status === 'success' ? t('accountRecovery.verificationSuccess')
    : recoveryError(current?.response, t, current?.networkError ? 'networkError' : 'verificationError');

  return (
    <>
      {/* Navbar-এর মতো একই props দেওয়া */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={openRegister}
      />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={openLogin}
      />

      <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <Loader2 size={48} className="mx-auto text-[#F57C00] animate-spin mb-4" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              {t('accountRecovery.verifying')}
            </h2>
            <p className="text-gray-500 text-sm mt-2">{t('accountRecovery.wait')}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('accountRecovery.verified')}</h2>
            <p className="text-gray-500 text-sm mt-2">{message}</p>
            <button
              onClick={openLogin}
              className="mt-6 px-6 py-3 bg-[#F57C00] text-white rounded-full font-bold text-sm hover:opacity-90 transition"
            >
              {t('accountRecovery.login')}
            </button>
            <button
              onClick={() => router.push(localize('/'))}
              className="mt-3 block w-full text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            >
              {t('accountRecovery.home')}
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t('accountRecovery.verificationFailed')}</h2>
            <p className="text-gray-500 text-sm mt-2">{message}</p>
            <button
              onClick={() => router.push(localize('/'))}
              className="mt-6 px-6 py-3 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white rounded-full font-bold text-sm hover:opacity-90 transition"
            >
              {t('accountRecovery.home')}
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default function VerifyEmailPage() {
  const { t } = useLocale();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] px-4">
      <Suspense
        fallback={
          <div className="text-center">
            <Loader2 size={48} className="mx-auto text-[#F57C00] animate-spin mb-4" />
            <p className="dark:text-white">{t('accountRecovery.loading')}</p>
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
