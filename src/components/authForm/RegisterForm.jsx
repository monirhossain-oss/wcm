'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterForm() {
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

    const result = await registerUser(payload);

    if (result.success) {
      alert('Registration Successful! Please login.');
      router.push('/auth/login');
    } else {
      setServerError(result.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f3eee7] flex items-center justify-center p-4 md:p-10 font-serif">
      
      {/* মেইন কন্টেইনার - ২ কলাম লেআউট */}
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-0 rounded-[40px] overflow-hidden shadow-2xl bg-white/50 backdrop-blur-md border border-white/30">
        
        {/* বাম পাশ: কালচারাল আর্ট সেকশন (লগইন পেজের মতো) */}
        <div className="relative hidden md:flex flex-col items-center justify-between bg-[#1a2b4b] p-12 text-center text-white overflow-hidden">
          <div className="absolute top-6 left-6 text-[#e5d5bc]/30 text-xl tracking-[0.5em]">◈◈◈</div>
          <div className="absolute top-6 right-6 text-[#e5d5bc]/30 text-xl tracking-[0.5em]">◈◈◈</div>
          
          <div className="relative z-10 w-full mt-10">
             <div className="relative w-full aspect-square mb-8">
                <Image 
                  src="/cultural.jpg" 
                  alt="Cultural Art"
                  fill
                  className="object-contain"
                />
             </div>
             <h2 className="text-3xl font-bold mb-2 text-[#e5d5bc]">Join the Marketplace.</h2>
             <h2 className="text-3xl font-bold text-[#e5d5bc]">Share Your Culture.</h2>
          </div>

          <div className="absolute bottom-6 left-6 text-[#e5d5bc]/30 text-xl tracking-[0.5em]">◈◈◈</div>
          <div className="absolute bottom-6 right-6 text-[#e5d5bc]/30 text-xl tracking-[0.5em]">◈◈◈</div>
        </div>

        {/* ডান পাশ: রেজিস্ট্রেশন ফর্ম (গ্লাস মরফিজম) */}
        <div className="relative p-8 md:p-12 flex flex-col justify-center bg-[#fdfaf6]/70 backdrop-blur-xl overflow-y-auto">
          
          {/* টপ লোগো */}
          <div className="mb-6 flex justify-center md:justify-start">
             <Image src="/wc,-web-logo.png" alt="Logo" width={100} height={40} className="h-auto cursor-pointer" onClick={() => router.push('/')} />
          </div>

          <div className="text-center md:text-left mb-6">
            <h1 className="text-4xl font-bold text-[#1a2b4b] mb-2">Create Account</h1>
            <p className="text-[#6b5b4b]">Start your journey in global culture</p>
          </div>

          {serverError && (
            <div className="mb-4 p-3 bg-red-100 text-red-600 border border-red-200 rounded-xl text-sm text-center">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <input
                  placeholder="First Name"
                  {...register('first_name', { required: 'First name required' })}
                  className="w-full bg-white border border-[#e5d5bc] rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-[#c5a367] transition shadow-sm text-gray-700 text-sm"
                />
                {errors.first_name && <p className="text-red-400 text-[10px] ml-4">{errors.first_name.message}</p>}
              </div>
              <div className="space-y-1">
                <input
                  placeholder="Last Name"
                  {...register('last_name', { required: 'Last name required' })}
                  className="w-full bg-white border border-[#e5d5bc] rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-[#c5a367] transition shadow-sm text-gray-700 text-sm"
                />
                {errors.last_name && <p className="text-red-400 text-[10px] ml-4">{errors.last_name.message}</p>}
              </div>
            </div>

            {/* Username Input */}
            <div className="space-y-1">
              <input
                placeholder="Username"
                {...register('username', { required: 'Username required' })}
                className="w-full bg-white border border-[#e5d5bc] rounded-full px-6 py-3 outline-none focus:ring-2 focus:ring-[#c5a367] transition shadow-sm text-gray-700 text-sm"
              />
              {errors.username && <p className="text-red-400 text-[10px] ml-4">{errors.username.message}</p>}
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <input
                type="email"
                placeholder="Email Address"
                {...register('email', { required: 'Email required' })}
                className="w-full bg-white border border-[#e5d5bc] rounded-full px-6 py-3 outline-none focus:ring-2 focus:ring-[#c5a367] transition shadow-sm text-gray-700 text-sm"
              />
              {errors.email && <p className="text-red-400 text-[10px] ml-4">{errors.email.message}</p>}
            </div>

            {/* Password Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  {...register('password', { 
                    required: 'Required',
                    minLength: { value: 6, message: 'Min 6 chars' }
                  })}
                  className="w-full bg-white border border-[#e5d5bc] rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-[#c5a367] transition shadow-sm text-gray-700 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-[#c5a367]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && <p className="text-red-400 text-[10px] ml-4">{errors.password.message}</p>}
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm"
                  {...register('password_confirmation', { required: 'Required' })}
                  className="w-full bg-white border border-[#e5d5bc] rounded-full px-5 py-3 outline-none focus:ring-2 focus:ring-[#c5a367] transition shadow-sm text-gray-700 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-3 text-[#c5a367]"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password_confirmation && <p className="text-red-400 text-[10px] ml-4">{errors.password_confirmation.message}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 mt-2 rounded-full bg-[#F57C00] text-white font-bold text-lg shadow-lg hover:brightness-110 transition transform active:scale-95 ${isSubmitting ? 'opacity-70' : ''}`}
            >
              {isSubmitting ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-[#8a7b6a]">
            Already have an account? <a href="/auth/login" className="text-[#F57C00] font-bold hover:underline ml-1">Log In</a>
          </p>
          
          <p className="text-[10px] text-center text-[#8a7b6a] mt-6">
            By joining, you agree to the <a href="/terms-conditions" className="underline hover:text-[#F57C00]">Terms</a> and <a href="/privacy-policy" className="underline hover:text-[#F57C00]">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}