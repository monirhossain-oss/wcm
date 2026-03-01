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

      <div className="relative mt-24 z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md backdrop-blur-xl bg-white/90 dark:bg-black/60 rounded-2xl shadow-2xl p-8">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-extrabold mb-2 text-foreground">Create Account</h1>
            <p className="text-sm text-text">
              Already have an account?{' '}
              <a href="/auth/login" className="underline text-amber-500 font-medium hover:opacity-80 transition-opacity">Login</a>
            </p>
          </div>

          {serverError && (
            <div className="alert-error text-center mb-4 py-2 rounded text-sm bg-red-100 text-red-600 border border-red-200">{serverError}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 backdrop-blur-md bg-white/10 dark:bg-black/30 p-6 rounded-2xl border border-white/20 shadow-2xl">
            
            {/* Name Section */}
            <div className="flex gap-3">
              <div className="flex-1 space-y-1">
                <label className="text-xs font-semibold text-foreground/90 ml-1">First Name</label>
                <input
                  placeholder="John"
                  {...register('first_name', { required: 'Required' })}
                  className="w-full border border-ui rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none bg-background/50 text-foreground"
                />
                {errors.first_name && <p className="text-error text-[10px] mt-1 ml-1">{errors.first_name.message}</p>}
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-xs font-semibold text-foreground/90 ml-1">Last Name</label>
                <input
                  placeholder="Doe"
                  {...register('last_name', { required: 'Required' })}
                  className="w-full border border-ui rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none bg-background/50 text-foreground"
                />
                {errors.last_name && <p className="text-error text-[10px] mt-1 ml-1">{errors.last_name.message}</p>}
              </div>
            </div>

            {/* Username Section */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground/90 ml-1">Username</label>
              <input
                placeholder="johndoe123"
                {...register('username', { required: 'Username required' })}
                className="w-full border border-ui rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none bg-background/50 text-foreground"
              />
              {errors.username && <p className="text-error text-[10px] mt-1 ml-1">{errors.username.message}</p>}
            </div>

            {/* Email Section */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground/90 ml-1">Email Address</label>
              <input
                type="email"
                placeholder="email@example.com"
                {...register('email', { required: 'Email required' })}
                className="w-full border border-ui rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none bg-background/50 text-foreground"
              />
              {errors.email && <p className="text-error text-[10px] mt-1 ml-1">{errors.email.message}</p>}
            </div>

            {/* Password Section */}
            <div className="flex gap-3">
              <div className="flex-1 space-y-1">
                <label className="text-xs font-semibold text-foreground/90 ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••"
                    {...register('password', {
                      required: 'Required',
                      minLength: { value: 6, message: 'Min 6 chars' },
                    })}
                    className="w-full border border-ui rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none bg-background/50 text-foreground pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-1">
                <label className="text-xs font-semibold text-foreground/90 ml-1">Confirm</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••"
                    {...register('password_confirmation', { required: 'Required' })}
                    className="w-full border border-ui rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none bg-background/50 text-foreground pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2.5 mt-2 rounded-lg btn-primary transition font-bold shadow-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 active:scale-[0.98]'}`}
            >
              {isSubmitting ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <p className="text-[10px] text-center text-text/70 mt-4">
            By joining, you agree to the <a href="/terms" className="underline hover:text-primary">Terms</a> and <a href="/privacy" className="underline hover:text-primary">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}