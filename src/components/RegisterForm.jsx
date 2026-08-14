'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { Eye, EyeOff, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';

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

export default function RegisterForm({ onClose, onSwitchToLogin }) {
  const router = useRouter();
  const { registerUser } = useAuth();
  const { t, localize, locale } = useLocale();
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  const passwordValue = watch('password', '');

  const showToast = (message, type = 'success') => { setToast({ message, type }); };
  const hideToast = () => { setToast(null); };

  // ============================================
  // রেজিস্ট্রেশন সাবমিট
  // ============================================
  const onSubmit = async (data) => {
    setServerError('');

    // 🔒 পাসওয়ার্ড ভ্যালিডেশন চেক
    const passwordCheck = validatePassword(data.password);
    if (!passwordCheck.isValid) {
      setServerError(`${t('auth.passwordMust')} ${passwordCheck.errors.join(', ')}`);
      return;
    }

    if (data.password !== data.password_confirmation) {
      setServerError(t('auth.mismatch'));
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
        showToast(t('auth.registrationSuccess'), 'success');
        setTimeout(() => {
          onClose();
          onSwitchToLogin();
        }, 2000);
      } else {
        setServerError(locale === 'fr' ? t('auth.registrationFailed') : (result.message || t('auth.registrationFailed')));
      }
    } catch (error) {
      setServerError(t('auth.unexpected'));
    }
  };

  // 🔒 রিয়েল-টাইম পাসওয়ার্ড চেক
  const passwordCheck = validatePassword(passwordValue);

  return (
    <div className="p-6 sm:p-10 flex flex-col clear-both relative">
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} duration={3000} />}

      {/* Logo */}
      <div className="mb-6 flex justify-center">
        <Image src="/wc,-web-logo.png" alt="Logo" width={110} height={45} className="h-auto cursor-pointer dark:hidden" onClick={() => { router.push(localize('/')); onClose(); }} />
        <Image src="/wc,-web-white.png" alt="Logo Dark" width={110} height={45} className="hidden dark:block h-auto cursor-pointer" onClick={() => { router.push('/'); onClose(); }} />
      </div>

      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 font-serif">{t('auth.registerTitle')}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">{t('auth.registerIntro')}</p>
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
            <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 ml-1 uppercase tracking-wider">{t('auth.firstName')}</label>
            <input placeholder={t('auth.firstName')} {...register('first_name', { required: t('auth.required') })} className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#F57C00]/50 focus:border-[#F57C00] transition-all text-sm" />
            {errors.first_name && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.first_name.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 ml-1 uppercase tracking-wider">{t('auth.lastName')}</label>
            <input placeholder={t('auth.lastName')} {...register('last_name', { required: t('auth.required') })} className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#F57C00]/50 focus:border-[#F57C00] transition-all text-sm" />
            {errors.last_name && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.last_name.message}</p>}
          </div>
        </div>

        {/* Username */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 ml-1 uppercase tracking-wider">{t('auth.username')}</label>
          <input placeholder={t('auth.usernamePlaceholder')} {...register('username', { required: t('auth.usernameRequired') })} className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#F57C00]/50 focus:border-[#F57C00] transition-all text-sm" />
          {errors.username && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.username.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 ml-1 uppercase tracking-wider">{t('auth.email')}</label>
          <input type="email" placeholder={t('auth.registerEmailPlaceholder')} {...register('email', { required: t('auth.registerEmailRequired'), pattern: { value: /^\S+@\S+$/i, message: t('auth.emailInvalid') } })} className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#F57C00]/50 focus:border-[#F57C00] transition-all text-sm" />
          {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.email.message}</p>}
        </div>

        {/* Password with Real-time Validation */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 ml-1 uppercase tracking-wider">{t('auth.password')}</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={t('auth.password')}
              {...register('password', { required: t('auth.passwordRequired') })}
              className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#F57C00]/50 focus:border-[#F57C00] transition-all text-sm"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.password.message}</p>}

          {/* 🔒 REAL-TIME PASSWORD REQUIREMENTS */}
          {passwordValue.length > 0 && (
            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-1.5">
              <p className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">{t('auth.requirements')}</p>
              <div className="flex items-center gap-2">
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${passwordCheck.checks.minLength ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500'}`}>
                  {passwordCheck.checks.minLength ? '✓' : '•'}
                </div>
                <span className={`text-[11px] ${passwordCheck.checks.minLength ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>{t('auth.minLength')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${passwordCheck.checks.uppercase ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500'}`}>
                  {passwordCheck.checks.uppercase ? '✓' : '•'}
                </div>
                <span className={`text-[11px] ${passwordCheck.checks.uppercase ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>{t('auth.uppercase')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${passwordCheck.checks.lowercase ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500'}`}>
                  {passwordCheck.checks.lowercase ? '✓' : '•'}
                </div>
                <span className={`text-[11px] ${passwordCheck.checks.lowercase ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>{t('auth.lowercase')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${passwordCheck.checks.number ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500'}`}>
                  {passwordCheck.checks.number ? '✓' : '•'}
                </div>
                <span className={`text-[11px] ${passwordCheck.checks.number ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>{t('auth.number')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${passwordCheck.checks.symbol ? 'bg-green-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-500'}`}>
                  {passwordCheck.checks.symbol ? '✓' : '•'}
                </div>
                <span className={`text-[11px] ${passwordCheck.checks.symbol ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>{t('auth.symbol')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 ml-1 uppercase tracking-wider">{t('auth.confirm')}</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder={t('auth.confirm')}
              {...register('password_confirmation', { required: t('auth.required') })}
              className="w-full bg-white dark:bg-white/5 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#F57C00]/50 focus:border-[#F57C00] transition-all text-sm"
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password_confirmation && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase">{errors.password_confirmation.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full py-3.5 mt-2 rounded-full bg-[#1a1a1a] dark:bg-[#F57C00] text-white font-bold text-sm shadow-lg hover:opacity-90 transition transform active:scale-95 disabled:opacity-50">
          {isSubmitting ? t('auth.creating') : t('auth.register')}
        </button>
      </form>

      {/* Footer */}
      <div className="text-center mt-6 space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {t('auth.already')} <button type="button" onClick={onSwitchToLogin} className="text-[#F57C00] font-bold hover:underline ml-1">{t('auth.logIn')}</button>
        </p>
        <p className="text-[12px] leading-relaxed text-gray-500 dark:text-gray-400 px-4">
          {t('auth.joiningLead')} <Link href={localize('/terms-and-conditions')} className="underline hover:text-[#F57C00]">{t('auth.terms')}</Link> {t('auth.and')} <Link href={localize('/privacy-policy')} className="underline hover:text-[#F57C00]">{t('auth.privacy')}</Link>. {t('auth.cookieText')} <Link href={localize('/cookie-policy')} className="underline hover:text-[#F57C00]">{t('auth.cookie')}</Link>.
        </p>
      </div>
    </div>
  );
}
