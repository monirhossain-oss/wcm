'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const { loginUser } = useAuth();
  const [serverError, setServerError] = useState('');
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
    <div className="relative min-h-screen w-full overflow-hidden">
      <Image
        src="/Backgroun_image.jpg"
        alt="Register Background"
        fill
        priority
        className="object-cover scale-110 "
      />
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="absolute top-4 left-4 cursor-pointer z-20" onClick={() => router.push('/')}>
        <Image src="/wc,-web-logo.png" alt="Logo Light" width={100} height={100} className="dark:hidden brightness-125 h-auto w-auto" />
        <Image src="/wc,-web-logo.png" alt="Logo Dark" width={100} height={100} className="hidden dark:block brightness-125 h-auto w-auto" />
      </div>

      <div className="relative z-10 min-h-screen mt-20 md:mt-0 flex items-center justify-center px-4">
        <div className="w-full max-w-md backdrop-blur-xl bg-white/90 dark:bg-black/60 rounded-2xl shadow-2xl p-8">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-extrabold mb-2 text-foreground">Welcome Back</h1>
            <p className="text-sm text-text">
              Don't have an account?{' '}
              <a href="/auth/register" className="underline text-amber-500 font-medium hover:text-primary/80 transition-colors">
                Register
              </a>
            </p>
          </div>

          {serverError && (
            <div className="alert-error text-center mb-4 py-2 rounded text-sm bg-red-100 text-red-600 border border-red-200">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 backdrop-blur-md bg-white/10 dark:bg-black/20 p-6 rounded-xl border border-white/20 shadow-xl">
            {/* Email Label & Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground/90 ml-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                {...register('email', { required: 'Email required' })}
                className="w-full border border-ui rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary outline-none bg-background/50 text-foreground backdrop-blur-sm transition-all placeholder:text-muted-foreground/50"
              />
              {errors.email && <p className="text-error text-xs mt-1 ml-1">{errors.email.message}</p>}
            </div>

            {/* Password Label & Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-semibold text-foreground/90">
                  Password
                </label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot?</a>
              </div>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="••••••••"
                  {...register('password', { required: 'Password required' })}
                  className="w-full border border-ui rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary outline-none bg-background/50 text-foreground backdrop-blur-sm pr-10 transition-all placeholder:text-muted-foreground/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-error text-xs mt-1 ml-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2.5 rounded-lg btn-primary text-white transition font-bold shadow-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 active:scale-[0.98]'}`}
            >
              {isSubmitting ? 'Verifying...' : 'Login to Account'}
            </button>
          </form>

          <p className="text-[11px] text-center text-text/70 mt-5">
            By joining, you agree to the <a href="/terms" className="underline hover:text-primary">Terms</a> and <a href="/privacy" className="underline hover:text-primary">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}