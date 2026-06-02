'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import LoginModal from '@/components/LoginModal';
import RegisterModal from '@/components/RegistationModal';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
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
    if (!token) {
      setStatus('error');
      setMessage('No verification token found.');
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/verify-email?token=${token}`
        );
        const data = await res.json();

        if (res.ok) {
          setStatus('success');
          setMessage(data.message || 'Email verified successfully!');
          setIsLoginOpen(true);
        } else {
          setStatus('error');
          setMessage(data.message || 'Verification failed.');
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.message || 'Something went wrong. Please try again.');
      }
    };

    verify();
  }, [token]);

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
              Verifying your email...
            </h2>
            <p className="text-gray-500 text-sm mt-2">Please wait a moment.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Email Verified!</h2>
            <p className="text-gray-500 text-sm mt-2">{message}</p>
            <button
              onClick={openLogin}
              className="mt-6 px-6 py-3 bg-[#F57C00] text-white rounded-full font-bold text-sm hover:opacity-90 transition"
            >
              Login Now
            </button>
            <button
              onClick={() => router.push('/')}
              className="mt-3 block w-full text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            >
              Go to Homepage
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Verification Failed</h2>
            <p className="text-gray-500 text-sm mt-2">{message}</p>
            <button
              onClick={() => router.push('/')}
              className="mt-6 px-6 py-3 bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-white rounded-full font-bold text-sm hover:opacity-90 transition"
            >
              Go to Homepage
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a] px-4">
      <Suspense
        fallback={
          <div className="text-center">
            <Loader2 size={48} className="mx-auto text-[#F57C00] animate-spin mb-4" />
            <p className="dark:text-white">Loading...</p>
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
