'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // EyeOff ও ইম্পোর্ট করতে হবে

export default function LoginForm() {
  const router = useRouter();
  const { loginUser } = useAuth();
  const [serverError, setServerError] = useState('');
  
  // ১. পাসওয়ার্ড দেখানোর জন্য একটি স্টেট নিতে হবে
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setServerError('');
    const result = await loginUser(data);
    if (result.success) {
      window.location.href = '/';
    } else {
      setServerError(result.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f3eee7] flex items-center justify-center p-4 md:p-10 font-serif">
      
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-0 rounded-[40px] overflow-hidden shadow-2xl bg-white/50 backdrop-blur-md border border-white/30">
        
        {/* বাম পাশ: কালচারাল আর্ট সেকশন */}
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
             <h2 className="text-3xl font-bold mb-2 text-[#e5d5bc]">Connecting Cultures.</h2>
             <h2 className="text-3xl font-bold text-[#e5d5bc]">Empowering Creators.</h2>
          </div>

          <div className="absolute bottom-6 left-6 text-[#e5d5bc]/30 text-xl tracking-[0.5em]">◈◈◈</div>
          <div className="absolute bottom-6 right-6 text-[#e5d5bc]/30 text-xl tracking-[0.5em]">◈◈◈</div>
        </div>

        {/* ডান পাশ: লগইন ফর্ম */}
        <div className="relative p-8 md:p-16 flex flex-col justify-center bg-[#fdfaf6]/70 backdrop-blur-xl">
          
          <div className="mb-8 flex justify-center md:justify-start">
             <Image src="/wc,-web-logo.png" alt="Logo" width={100} height={40} className="h-auto" />
          </div>

          <div className="text-center md:text-left mb-10">
            <h1 className="text-4xl font-bold text-[#1a2b4b] mb-2">Welcome Back</h1>
            <p className="text-[#6b5b4b]">Sign in to explore global culture</p>
          </div>

          {serverError && (
            <div className="mb-4 p-3 bg-red-100 text-red-600 border border-red-200 rounded-xl text-sm text-center">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                {...register('email', { required: 'Email required' })}
                className="w-full bg-white border border-[#e5d5bc] rounded-full px-6 py-4 outline-none focus:ring-2 focus:ring-[#c5a367] transition shadow-sm text-gray-700"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1 ml-4">{errors.email.message}</p>}
            </div>

            {/* Password Input */}
            <div className="relative">
              <input
                // ২. টাইপটি ডাইনামিক করতে হবে (password অথবা text)
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                {...register('password', { required: 'Password required' })}
                className="w-full bg-white border border-[#e5d5bc] rounded-full px-6 py-4 outline-none focus:ring-2 focus:ring-[#c5a367] transition shadow-sm text-gray-700"
              />
              
              {/* ৩. আইকন ক্লিক করলে স্টেট টগল হবে */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-[18px] text-[#c5a367] hover:opacity-70 transition-opacity"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>

              {errors.password && <p className="text-red-400 text-xs mt-1 ml-4">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between text-sm px-2 text-[#6b5b4b]">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="mr-2 accent-[#c5a367] w-4 h-4" /> Remember me
              </label>
              <button type="button" className="text-[#F57C00] font-bold hover:underline">Forgot password?</button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-full bg-[#F57C00] text-white font-bold text-lg shadow-lg hover:brightness-110 transition transform active:scale-95 ${isSubmitting ? 'opacity-70' : ''}`}
            >
              {isSubmitting ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-[#8a7b6a]">
            Don't have an account? <a href="/auth/register" className="text-[#F57C00] font-bold hover:underline ml-1">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
}