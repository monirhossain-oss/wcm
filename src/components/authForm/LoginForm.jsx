'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function LoginForm() {
  const router = useRouter();
  const { loginUser } = useAuth();
  const [serverError, setServerError] = useState('');

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
              src="/Background.jpeg"
              alt="Register Background"
              fill
              priority
              className="object-cover scale-110 blur-md"
            />
            <div className="absolute inset-0 bg-black/40"></div>

      <div className="absolute top-4 left-4 cursor-pointer z-20" onClick={() => router.push('/')}>
        <Image
              src="/wc,-web-logo.png" 
              alt="Logo Light"
              width={100}
              height={100}
              className="dark:hidden brightness-125 h-auto w-auto"
            />
            {/* Dark Mode Logo */}
            <Image
                         src="/wc,-web-white.png" 
                         alt="Logo Dark"
                         width={100}
                         height={100}
                         className="hidden dark:block brightness-125 h-auto w-auto"
                       />
            </div>

      <div className="relative z-10 min-h-screen mt-20 md:mt-0 flex items-center justify-center px-4">
        <div className="w-full max-w-md backdrop-blur-xl bg-white/90 dark:bg-black/60 rounded-2xl shadow-2xl p-8">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-extrabold mb-2 text-foreground">Welcome Back</h1>
            <p className="text-sm text-text">
              Don't have an account?{' '}
              <a href="/auth/register" className="underline text-primary">
                Register
              </a>
            </p>
          </div>

          {serverError && (
            <div className="alert-error text-center mb-4 py-2 rounded text-sm bg-red-100 text-red-600 border border-red-200">
              {serverError}
            </div>
          )}

          <form 
  onSubmit={handleSubmit(onSubmit)} 
  className="space-y-4 backdrop-blur-md bg-white/10 dark:bg-black/20 p-6 rounded-xl border border-white/20 shadow-xl"
>
 
  
  <div>
    <label className="block font-medium mb-1 text-foreground">Email</label>
    <input
      type="email"
      placeholder="Enter your email"
      {...register('email', { required: 'Email required' })}
      className="w-full border border-ui rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none bg-background/50 text-foreground backdrop-blur-sm"
    />
    {errors.email && <p className="text-error text-sm mt-1">{errors.email.message}</p>}
  </div>

  <div>
    <label className="block font-medium mb-1 text-foreground">Password</label>
    <input
      type="password"
      placeholder="Enter your password"
      {...register('password', { required: 'Password required' })}
      className="w-full border border-ui rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none bg-background/50 text-foreground backdrop-blur-sm"
    />
    {errors.password && (
      <p className="text-error text-sm mt-1">{errors.password.message}</p>
    )}
  </div>

  <button
    type="submit"
    disabled={isSubmitting}
    className={`w-full py-2 rounded-lg btn-primary text-white transition font-bold ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}`}
  >
    {isSubmitting ? 'Logging in...' : 'Login'}
  </button>
</form>

          <p className="text-xs text-center text-text mt-4">
            By joining, you agree to the{' '}
            <a href="/terms" className="underline">
              Terms
            </a>{' '}
            and{' '}
            <a href="/privacy" className="underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
