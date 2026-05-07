'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { Eye, EyeOff, ArrowLeft, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
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

  return {
    isValid: errors.length === 0,
    errors,
    checks,
  };
};

export default function LoginForm({ onClose, onSwitchToRegister }) {
  const router = useRouter();
  const { loginUser } = useAuth();
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [toast, setToast] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
    watch,
  } = useForm();

  const passwordValue = watch('password', '');

  const showToast = (message, type = 'success') => { setToast({ message, type }); };
  const hideToast = () => { setToast(null); };

  // ============================================
  // ১. লগইন সাবমিট
  // ============================================
  const onSubmit = async (data) => {
    setServerError('');

    // 🔒 পাসওয়ার্ড ভ্যালিডেশন চেক
    const passwordCheck = validatePassword(data.password);
    if (!passwordCheck.isValid) {
      setServerError(`Password must contain ${passwordCheck.errors.join(', ')}`);
      return;
    }

    try {
      const result = await loginUser(data);
      if (result.success) {
        showToast('Login Successful! Welcome back to World Culture Marketplace', 'success');
        setTimeout(() => {
          onClose();
          window.location.href = '/';
        }, 1500);
      } else {
        setServerError(result.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setServerError('An unexpected error occurred.');
    }
  };

  // ============================================
  // ২. ফরগট পাসওয়ার্ড
  // ============================================
  const handleForgotPassword = async () => {
    const email = getValues('email');
    if (!email || !/^\S+@\S+$/i.test(email)) {
      return setServerError('Please enter a valid email first.');
    }
    setServerError('');
    setIsSendingLink(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/forgot-password`, { email });
      showToast('A reset link has been sent to your inbox. Please check your email!', 'success');
      setIsForgotMode(false);
    } catch (error) {
      setServerError(error.response?.data?.message || 'Failed to send reset link.');
    } finally {
      setIsSendingLink(false);
    }
  };

  // 🔒 রিয়েল-টাইম পাসওয়ার্ড চেক
  const passwordCheck = validatePassword(passwordValue);

  return (
    <div className="p-6 sm:p-10 flex flex-col clear-both relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} duration={3000} />}

      {/* Logo */}
      <div className="mb-6 flex justify-center">
        <Image src="/wc,-web-logo.png" alt="Logo" width={120} height={50} className="h-auto cursor-pointer dark:hidden" onClick={() => { router.push('/'); onClose(); }} />
        <Image src="/wc,-web-white.png" alt="Logo Dark" width={120} height={50} className="hidden dark:block h-auto cursor-pointer" onClick={() => { router.push('/'); onClose(); }} />
      </div>

      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 font-serif uppercase tracking-tight">
          {isForgotMode ? 'Reset Password' : 'Connecting Cultures'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
          {isForgotMode ? 'Enter your email to receive a password reset link' : 'Enter your credentials to access your account'}
        </p>
      </div>

      {serverError && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-xl text-[11px] font-bold text-center uppercase tracking-wider">
          {serverError}
        </div>
      )}

      {!isForgotMode ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
          {/* Email */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 ml-1 uppercase tracking-wider">Email address</label>
            <input
              placeholder="Enter your email..."
              type="email"
              {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' } })}
              className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#F57C00]/50 focus:border-[#F57C00] transition-all text-sm text-gray-800 dark:text-gray-200"
            />
            {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.email.message}</p>}
          </div>

          {/* Password with Real-time Validation */}
          <div className="space-y-1">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Password</label>
              <button type="button" onClick={() => setIsForgotMode(true)} className="text-[11px] text-[#F57C00] font-bold hover:underline">Forgot?</button>
            </div>
            <div className="relative">
              <input
                placeholder="Enter your password..."
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: 'Password is required' })}
                className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#F57C00]/50 focus:border-[#F57C00] transition-all text-sm text-gray-800 dark:text-gray-200"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.password.message}</p>}

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

          <button type="submit" disabled={isSubmitting} className="w-full py-3 sm:py-3.5 rounded-full bg-[#1a1a1a] dark:bg-[#F57C00] text-white font-bold text-sm shadow-md hover:opacity-90 transition transform active:scale-[0.98] disabled:opacity-50">
            {isSubmitting ? 'Verifying...' : 'Sign In'}
          </button>
        </form>
      ) : (
        <div className="space-y-5">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 ml-1 uppercase tracking-wider">Registered Email</label>
            <input placeholder="Enter your email..." type="email" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email format' } })} className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#F57C00]/50 focus:border-[#F57C00] transition-all text-sm text-gray-800 dark:text-gray-200" />
          </div>
          <button onClick={handleForgotPassword} disabled={isSendingLink} className="w-full py-3 sm:py-3.5 rounded-full bg-[#F57C00] text-white font-bold text-sm shadow-md hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50">
            {isSendingLink ? <Loader2 size={18} className="animate-spin" /> : 'Send Reset Link'}
          </button>
          <button onClick={() => setIsForgotMode(false)} className="w-full flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors uppercase tracking-widest">
            <ArrowLeft size={14} /> Back to Login
          </button>
        </div>
      )}

      {/* Divider */}
      <div className="relative my-6 sm:my-8">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200 dark:border-gray-800"></span></div>
        <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white dark:bg-[#0a0a0a] px-2 text-gray-400 font-bold">OR</span></div>
      </div>

      {/* Footer */}
      <div className="text-center space-y-4 pb-2">
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
          New here? <button type="button" onClick={onSwitchToRegister} className="text-[#F57C00] font-bold hover:underline ml-1">Create an account</button>
        </p>
        <p className="text-[12px] sm:text-[13px] leading-relaxed text-gray-500 dark:text-gray-400 px-2 sm:px-4">
          By clicking Sign In, you agree to World Culture Marketplace <Link href="/terms-&-conditions" className="underline hover:text-[#F57C00]">Terms of Condition</Link> and <Link href="/privacy-policy" className="underline hover:text-[#F57C00]">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}