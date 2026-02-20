'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function UserProfileForm() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [serverError, setServerError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setServerError('');
      const formData = new FormData();
      formData.append('displayName', data.display_name);
      formData.append('bio', data.bio);
      formData.append('country', data.country);
      formData.append('city', data.city);
      formData.append('language', data.language);
      formData.append('websiteLink', data.website_link);
      formData.append('socialLink', data.social_link);

      if (data.profileImage?.[0]) formData.append('profileImage', data.profileImage[0]);
      if (data.coverImage?.[0]) formData.append('coverImage', data.coverImage[0]);

      const res = await api.post('/api/users/become-creator', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.status === 200) {
        setUser(res.data.user);
        alert('Request submitted successfully!');
        router.push('/profile');
      }
    } catch (error) {
      setServerError(error.response?.data?.message || 'Something went wrong');
    }
  };

  if (!mounted) return null; // ক্লায়েন্ট রেন্ডার না হওয়া পর্যন্ত কিছুই দেখাবে না

  const inputStyle =
    'w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 outline-none';

  return (
    <div className="min-h-screen mt-10 relative">
      <div
        className="absolute inset-0 lg:hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/register.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative lg:hidden text-center text-white px-6 pt-20 pb-10">
        <h1 className="text-3xl font-bold mb-3">Become a Creator</h1>
        <p className="opacity-90 max-w-md mx-auto">
          Create your creator profile to showcase your culture.
        </p>
      </div>

      <div className="relative hidden lg:block max-w-6xl mx-auto pt-16 pb-10 px-6 text-center">
        <h1 className="text-4xl font-bold mb-3">Become a Creator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Showcase your story to a global audience.</p>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-12">
        <div
          className="relative lg:col-span-5 hidden lg:flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: "url('/register.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/55"></div>
          <div className="relative z-10 text-white px-10">
            <h2 className="text-3xl font-bold mb-3 text-white">Tell Your Story</h2>
            <p className="text-lg opacity-90">Your profile helps people discover who you are.</p>
          </div>
        </div>

        <div className="lg:col-span-7 flex justify-center px-6 pb-16">
          <div className="w-full max-w-3xl">
            {serverError && (
              <p className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-center">
                {serverError}
              </p>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl p-4 lg:p-10 shadow-xl border border-gray-200 dark:border-gray-800"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Display Name</label>
                  <input
                    {...register('display_name', { required: 'Required' })}
                    placeholder="Public brand name"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Username</label>
                  <input
                    {...register('username', { required: 'Required' })}
                    placeholder="Unique username"
                    className={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  {...register('bio')}
                  rows={4}
                  placeholder="Tell people about yourself..."
                  className={inputStyle}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Profile Image</label>
                  <input
                    type="file"
                    {...register('profileImage')}
                    accept="image/*"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Cover Image</label>
                  <input
                    type="file"
                    {...register('coverImage')}
                    accept="image/*"
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <input {...register('country', { required: true })} className={inputStyle} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input {...register('city', { required: true })} className={inputStyle} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Language</label>
                  <input {...register('language', { required: true })} className={inputStyle} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Website Link</label>
                  <input {...register('website_link')} className={inputStyle} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Social Link</label>
                <input {...register('social_link')} className={inputStyle} />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition disabled:bg-gray-400"
              >
                {isSubmitting ? 'Uploading...' : 'Submit for Review'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
