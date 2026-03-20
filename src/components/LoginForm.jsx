'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginForm({ onClose, onSwitchToRegister }) {
  const router = useRouter();
  const { loginUser } = useAuth(); // আপনার AuthContext অনুযায়ী ফাংশন নাম চেক করে নিবেন
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const result = await loginUser(data);
      if (result.success) {
        onClose();
        router.push('/');
      } else {
        setServerError(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setServerError('An unexpected error occurred.');
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
          onClick={() => { router.push('/'); onClose(); }}
        />
        <Image
          src="/wc,-web-white.png"
          alt="Logo Dark"
          width={120}
          height={50}
          className="hidden dark:block h-auto cursor-pointer"
          onClick={() => { router.push('/'); onClose(); }}
        />
      </div>

      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 font-serif">Sign In</h1>
        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Welcome back to World Culture</p>
      </div>

      {/* Error Message */}
      {serverError && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-xl text-[11px] font-bold text-center uppercase tracking-wider">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
        {/* Email Field */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 ml-1 uppercase tracking-wider">Email address</label>
          <input
            placeholder='Enter your email...'
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' }
            })}
            className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#F57C00]/50 focus:border-[#F57C00] transition-all text-sm text-gray-800 dark:text-gray-200"
          />
          {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.email.message}</p>}
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <div className="flex justify-between items-center ml-1">
            <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Password</label>
            <button type="button" className="text-[11px] text-[#F57C00] font-bold hover:underline">Forgot?</button>
          </div>
          <div className="relative">
            <input
              placeholder='Enter your password...'
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
          {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.password.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 sm:py-3.5 rounded-full bg-[#1a1a1a] dark:bg-[#F57C00] text-white font-bold text-sm shadow-md hover:opacity-90 transition transform active:scale-[0.98] disabled:opacity-50"
        >
          {isSubmitting ? 'Verifying...' : 'Sign In'}
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-6 sm:my-8">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200 dark:border-gray-800"></span></div>
        <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white dark:bg-[#0a0a0a] px-2 text-gray-400 font-bold">OR</span></div>
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
          <Link href="/terms-&-conditions" className="underline hover:text-[#F57C00]">Terms of Condition</Link> and{' '}
          <Link href="/privacy-policy" className="underline hover:text-[#F57C00]">Privacy Policy</Link>.
          We use cookies for some of our services.{' '}
          <Link href="/cookie-policy" className="underline hover:text-[#F57C00]">Cookie Policy</Link>.
        </p>
      </div>
    </div>
  );
}