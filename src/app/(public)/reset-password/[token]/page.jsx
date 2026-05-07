'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, Loader2, ShieldCheck, ArrowLeft, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

// ============================================
// 🔔 CUSTOM TOAST COMPONENT
// ============================================
function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => { onClose(); }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle size={20} className="text-green-500" />,
    error: <XCircle size={20} className="text-red-500" />,
    info: <AlertCircle size={20} className="text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-slide-in">
      <div className={`flex items-center gap-3 px-5 py-3 rounded-xl border shadow-lg min-w-[300px] ${bgColors[type]}`}>
        {icons[type]}
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600">✕</button>
      </div>
    </div>
  );
}

// ============================================
// 🔒 PASSWORD VALIDATION HELPER
// ============================================
const validatePassword = (password) => {
  const checks = {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const errors = [];
  if (!checks.minLength) errors.push('at least 8 characters');
  if (!checks.uppercase) errors.push('one uppercase letter');
  if (!checks.lowercase) errors.push('one lowercase letter');
  if (!checks.number) errors.push('one number');
  if (!checks.symbol) errors.push('one special symbol');

  return { isValid: errors.length === 0, errors, checks };
};

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [toast, setToast] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const newPassword = watch('password');
  const passwordValue = watch('password', '');

  const showToast = (message, type = 'success') => { setToast({ message, type }); };
  const hideToast = () => { setToast(null); };

  // 🔒 রিয়েল-টাইম পাসওয়ার্ড চেক
  const passwordCheck = validatePassword(passwordValue);

  const onSubmit = async (data) => {
    setServerError('');

    // 🔒 পাসওয়ার্ড ভ্যালিডেশন চেক
    const passwordValidation = validatePassword(data.password);
    if (!passwordValidation.isValid) {
      setServerError(`Password must contain ${passwordValidation.errors.join(', ')}`);
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/reset-password/${token}`,
        { password: data.password }
      );

      if (response.data.success) {
        // ✅ SweetAlert2-র বদলে Custom Toast
        showToast('Your password has been reset successfully!', 'success');

        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      }
    } catch (error) {
      setServerError(
        error.response?.data?.message || 'Something went wrong. Link might be expired.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-white dark:bg-[#0a0a0a] flex flex-col items-center justify-center p-4 overflow-y-auto relative">
      {/* 🔔 TOAST NOTIFICATION */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} duration={3000} />}

      {/* Back Button */}
      <button
        onClick={() => router.push('/')}
        className="fixed top-8 left-8 flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#F57C00] transition-colors uppercase tracking-widest group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </button>

      <div className="w-full max-w-[450px] bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 rounded-[40px] shadow-2xl shadow-orange-500/10 overflow-hidden my-auto">
        <div className="p-8 sm:p-12">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Image src="/wc,-web-logo.png" alt="Logo" width={130} height={60} className="h-auto dark:hidden" priority />
            <Image src="/wc,-web-white.png" alt="Logo Dark" width={130} height={60} className="hidden dark:block h-auto" priority />
          </div>

          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 mb-4">
              <ShieldCheck size={28} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 font-serif uppercase tracking-tight">
              Set New Password
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
              Secure your account with a new strong password
            </p>
          </div>

          {serverError && (
            <div className="mb-6 p-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-xl text-[11px] font-bold text-center uppercase tracking-wider">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* New Password with Real-time Validation */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 ml-1 uppercase tracking-wider">
                New Password
              </label>
              <div className="relative">
                <input
                  placeholder="••••••••"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#F57C00]/50 focus:border-[#F57C00] transition-all text-sm text-gray-800 dark:text-gray-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">
                  {errors.password.message}
                </p>
              )}

              {/* 🔒 REAL-TIME PASSWORD REQUIREMENTS */}
              {passwordValue.length > 0 && (
                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-1.5">
                  <p className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">Password Requirements:</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${passwordCheck.checks.minLength ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500'}`}>
                      {passwordCheck.checks.minLength ? '✓' : '•'}
                    </div>
                    <span className={`text-[11px] ${passwordCheck.checks.minLength ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>At least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${passwordCheck.checks.uppercase ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500'}`}>
                      {passwordCheck.checks.uppercase ? '✓' : '•'}
                    </div>
                    <span className={`text-[11px] ${passwordCheck.checks.uppercase ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>One uppercase letter (A-Z)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${passwordCheck.checks.lowercase ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500'}`}>
                      {passwordCheck.checks.lowercase ? '✓' : '•'}
                    </div>
                    <span className={`text-[11px] ${passwordCheck.checks.lowercase ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>One lowercase letter (a-z)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${passwordCheck.checks.number ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500'}`}>
                      {passwordCheck.checks.number ? '✓' : '•'}
                    </div>
                    <span className={`text-[11px] ${passwordCheck.checks.number ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>One number (0-9)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${passwordCheck.checks.symbol ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500'}`}>
                      {passwordCheck.checks.symbol ? '✓' : '•'}
                    </div>
                    <span className={`text-[11px] ${passwordCheck.checks.symbol ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>One special symbol (!@#$%^&*)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 ml-1 uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                placeholder="••••••••"
                type="password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === newPassword || 'Passwords do not match',
                })}
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[#F57C00]/50 focus:border-[#F57C00] transition-all text-sm text-gray-800 dark:text-gray-200"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 mt-4 rounded-full bg-[#1a1a1a] dark:bg-[#F57C00] text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:opacity-90 transition transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : 'Update Password'}
            </button>
          </form>

          <div className="text-center mt-10">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Safe & Secure Environment
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}