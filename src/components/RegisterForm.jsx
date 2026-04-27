'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterForm({ onClose, onSwitchToLogin }) {
  const router = useRouter();
  const { registerUser } = useAuth();
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError('');

    if (data.password !== data.password_confirmation) {
      setServerError('Passwords do not match');
      return;
    }

    const payload = {
      firstName: data.first_name,
      lastName: data.last_name,
      username: data.username,
      email: data.email,
      password: data.password,
    };

    try {
      const result = await registerUser(payload);
      if (result.success) {
        onClose();
        alert('Registration successful! Please check your email to verify your account.');
      } else {
        setServerError(result.message || 'Registration failed.');
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
          width={110}
          height={45}
          className="h-auto cursor-pointer dark:hidden"
          onClick={() => { router.push('/'); onClose(); }}
        />
        <Image
          src="/wc,-web-white.png"
          alt="Logo Dark"
          width={110}
          height={45}
          className="hidden dark:block h-auto cursor-pointer"
          onClick={() => { router.push('/'); onClose(); }}
        />
      </div>

      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 font-serif">Create Account</h1>
        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Join the global culture marketplace</p>
      </div>

      {serverError && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-xl text-[11px] font-bold text-center uppercase tracking-wider">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 ml-1 uppercase tracking-wider">First Name</label>
            <input
              placeholder="First Name"
              {...register('first_name', { required: 'Required' })}
              className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#F57C00]/50 focus:border-[#F57C00] transition-all text-sm"
            />
            {errors.first_name && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.first_name.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 ml-1 uppercase tracking-wider">Last Name</label>
            <input
              placeholder="Last Name"
              {...register('last_name', { required: 'Required' })}
              className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#F57C00]/50 focus:border-[#F57C00] transition-all text-sm"
            />
            {errors.last_name && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.last_name.message}</p>}
          </div>
        </div>

        {/* Username */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 ml-1 uppercase tracking-wider">Username</label>
          <input
            placeholder="Choose a username..."
            {...register('username', { required: 'Username required' })}
            className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#F57C00]/50 focus:border-[#F57C00] transition-all text-sm"
          />
          {errors.username && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.username.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 ml-1 uppercase tracking-wider">Email address</label>
          <input
            type="email"
            placeholder="Enter email address..."
            {...register('email', { required: 'Email required' })}
            className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#F57C00]/50 focus:border-[#F57C00] transition-all text-sm"
          />
          {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.email.message}</p>}
        </div>

        {/* Password Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 ml-1 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                {...register('password', {
                  required: 'Required',
                  minLength: { value: 6, message: 'Min 6 chars' }
                })}
                className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#F57C00]/50 focus:border-[#F57C00] transition-all text-sm"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.password.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 ml-1 uppercase tracking-wider">Confirm</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm"
                {...register('password_confirmation', { required: 'Required' })}
                className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#F57C00]/50 focus:border-[#F57C00] transition-all text-sm"
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password_confirmation && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.password_confirmation.message}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 mt-2 rounded-full bg-[#1a1a1a] dark:bg-[#F57C00] text-white font-bold text-sm shadow-lg hover:opacity-90 transition transform active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      {/* Footer Section */}
      <div className="text-center mt-6 space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-[#F57C00] font-bold hover:underline ml-1"
          >
            Log In
          </button>
        </p>

        <p className="text-[12px] leading-relaxed text-gray-500 dark:text-gray-400 px-4">
          By joining, you agree to World Culture Marketplace{' '}
          <Link href="/terms-&-conditions" className="underline hover:text-[#F57C00]">Terms of Conditions</Link> and{' '}
          <Link href="/privacy-policy" className="underline hover:text-[#F57C00]">Privacy Policy</Link>.
          We use cookies to improve your experience.{' '}
          <Link href="/cookie-policy" className="underline hover:text-[#F57C00]">Cookie Policy</Link>.
        </p>
      </div>
    </div>
  );
}