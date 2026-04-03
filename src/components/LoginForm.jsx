'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function LoginForm({ onClose, onSwitchToRegister }) {
  const router = useRouter();
  const { loginUser } = useAuth();
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password States
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [isSendingLink, setIsSendingLink] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm();

  // ১. লগইন সাবমিট
  const onSubmit = async (data) => {
    setServerError('');
    try {
      const result = await loginUser(data);
      if (result.success) {
        Swal.fire({
          title: 'Login Successful!',
          text: 'Welcome back to World Culture Marketplace',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          position: 'center',
          iconColor: '#F57C00',
          background: '#fff',
        }).then(() => {
          onClose();
          window.location.href = '/';
        });
      } else {
        setServerError(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setServerError('An unexpected error occurred.');
    }
  };

  // ২. ফরগট পাসওয়ার্ড লিঙ্ক পাঠানো
  const handleForgotPassword = async () => {
    const email = getValues('email');
    if (!email || !/^\S+@\S+$/i.test(email)) {
      return setServerError('Please enter a valid email first.');
    }

    setServerError('');
    setIsSendingLink(true);
    try {
      // আপনার API এন্ডপয়েন্ট অনুযায়ী পরিবর্তন করে নিন
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/forgot-password`, {
        email,
      });

      Swal.fire({
        title: 'Check your email!',
        text: 'A reset link has been sent to your inbox.',
        icon: 'success',
        confirmButtonColor: '#F57C00',
      });
      setIsForgotMode(false);
    } catch (error) {
      setServerError(error.response?.data?.message || 'Failed to send reset link.');
    } finally {
      setIsSendingLink(false);
    }
  };

  return (
    <div className="p-6 sm:p-10 flex flex-col clear-both">
      {/* Logo Section */}
      <div className="mb-6 flex justify-center">
        <Image
          src="/wc,-web-logo.png"
          alt="Logo"
          width={120}
          height={50}
          className="h-auto cursor-pointer dark:hidden"
          onClick={() => {
            router.push('/');
            onClose();
          }}
        />
        <Image
          src="/wc,-web-white.png"
          alt="Logo Dark"
          width={120}
          height={50}
          className="hidden dark:block h-auto cursor-pointer"
          onClick={() => {
            router.push('/');
            onClose();
          }}
        />
      </div>

      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 font-serif uppercase tracking-tight">
          {isForgotMode ? 'Reset Password' : 'Connecting Cultures'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
          {isForgotMode
            ? 'Enter your email to receive a password reset link'
            : 'Enter your credentials to access your account'}
        </p>
      </div>

      {/* Error Message */}
      {serverError && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-xl text-[11px] font-bold text-center uppercase tracking-wider">
          {serverError}
        </div>
      )}

      {/* --- FORM SECTION --- */}
      {!isForgotMode ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 ml-1 uppercase tracking-wider">
              Email address
            </label>
            <input
              placeholder="Enter your email..."
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' },
              })}
              className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#F57C00]/50 focus:border-[#F57C00] transition-all text-sm text-gray-800 dark:text-gray-200"
            />
            {errors.email && (
              <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => setIsForgotMode(true)}
                className="text-[11px] text-[#F57C00] font-bold hover:underline"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <input
                placeholder="Enter your password..."
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: 'Password is required' })}
                className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#F57C00]/50 focus:border-[#F57C00] transition-all text-sm text-gray-800 dark:text-gray-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 sm:py-3.5 rounded-full bg-[#1a1a1a] dark:bg-[#F57C00] text-white font-bold text-sm shadow-md hover:opacity-90 transition transform active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? 'Verifying...' : 'Sign In'}
          </button>
        </form>
      ) : (
        /* --- FORGOT PASSWORD VIEW --- */
        <div className="space-y-5">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 ml-1 uppercase tracking-wider">
              Registered Email
            </label>
            <input
              placeholder="Enter your email..."
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' },
              })}
              className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#F57C00]/50 focus:border-[#F57C00] transition-all text-sm text-gray-800 dark:text-gray-200"
            />
          </div>
          <button
            onClick={handleForgotPassword}
            disabled={isSendingLink}
            className="w-full py-3 sm:py-3.5 rounded-full bg-[#F57C00] text-white font-bold text-sm shadow-md hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSendingLink ? <Loader2 size={18} className="animate-spin" /> : 'Send Reset Link'}
          </button>
          <button
            onClick={() => setIsForgotMode(false)}
            className="w-full flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeft size={14} /> Back to Login
          </button>
        </div>
      )}

      {/* Divider */}
      <div className="relative my-6 sm:my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200 dark:border-gray-800"></span>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase">
          <span className="bg-white dark:bg-[#0a0a0a] px-2 text-gray-400 font-bold">OR</span>
        </div>
      </div>

      {/* Footer Section */}
      <div className="text-center space-y-4 pb-2">
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
          New here?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-[#F57C00] font-bold hover:underline ml-1"
          >
            Create an account
          </button>
        </p>

        {/* Legal Links */}
        <p className="text-[12px] sm:text-[13px] leading-relaxed text-gray-500 dark:text-gray-400 px-2 sm:px-4">
          By clicking Sign In, you agree to World Culture Marketplace{' '}
          <Link href="/terms-&-conditions" className="underline hover:text-[#F57C00]">
            Terms of Condition
          </Link>{' '}
          and{' '}
          <Link href="/privacy-policy" className="underline hover:text-[#F57C00]">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
