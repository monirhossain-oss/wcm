'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { FiUpload, FiImage, FiCheck, FiClock, FiAlertCircle, FiCamera } from 'react-icons/fi';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function UserProfileForm() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const [serverError, setServerError] = useState('');
  const [mounted, setMounted] = useState(false);

  const [previews, setPreviews] = useState({ profile: null, cover: null });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'user') {
      router.push('/profile');
    }
  }, [user, router]);

  if (!user || user.role !== 'user') {
    return (
      <div className="min-h-screen flex items-center justify-center animate-pulse font-black uppercase tracking-widest text-orange-500">
        Redirecting to Profile...
      </div>
    );
  }

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      display_name: user?.profile?.displayName || '',
      bio: user?.profile?.bio || '',
      country: user?.profile?.country || '',
      city: user?.profile?.city || '',
      language: user?.profile?.language || '',
      website_link: user?.profile?.websiteLink || '',
      social_link: user?.profile?.socialLink || '',
    },
  });

  useEffect(() => {
    if (user?.profile) {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      setPreviews({
        profile: user.profile.profileImage ? `${baseUrl}${user.profile.profileImage}` : null,
        cover: user.profile.coverImage ? `${baseUrl}${user.profile.coverImage}` : null,
      });
      reset({
        display_name: user.profile.displayName || '',
        bio: user.profile.bio || '',
        country: user.profile.country || '',
        city: user.profile.city || '',
        language: user.profile.language || '',
        website_link: user.profile.websiteLink || '',
        social_link: user.profile.socialLink || '',
      });
    }
  }, [user, reset]);

  const handleImagePreview = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setPreviews((prev) => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };

  const isPending = user?.creatorRequest?.status === 'pending' && user?.creatorRequest?.isApplied;

  const onSubmit = async (data) => {
    if (isPending) return;
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
        router.push('/profile');
      }
    } catch (error) {
      setServerError(error.response?.data?.message || 'Something went wrong');
    }
  };

  if (!mounted) return null;

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-10 rounded-[2.5rem] text-center shadow-2xl backdrop-blur-xl">
          <FiClock size={40} className="text-orange-500 animate-pulse mx-auto mb-6" />
          <h2 className="text-2xl font-black uppercase tracking-tighter dark:text-white mb-2">
            Request Pending
          </h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
            Wait for admin approval.
          </p>
          <button
            onClick={() => router.push('/profile')}
            className="mt-8 w-full py-4 bg-orange-500 text-white text-[10px] font-black uppercase rounded-2xl transition-all"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  const inputStyle =
    'w-full border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all';
  const fileBoxStyle =
    'relative flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-lg p-4 transition-all hover:border-orange-500 bg-gray-50 dark:bg-white/5 cursor-pointer group h-32 overflow-hidden';

  return (
    <div className="min-h-screen mt-10 relative pb-20">
      {/* Background & Header */}
      <div
        className="absolute inset-0 lg:hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/Backgroun_image.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      <div className="relative lg:hidden text-center text-white px-6 pt-20 pb-10">
        <h1 className="text-3xl font-bold mb-3 uppercase tracking-tighter">Become a Creator</h1>
      </div>

      <div className="relative hidden lg:block max-w-6xl mx-auto pt-16 pb-10 px-6 text-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter dark:text-white">
          Become a <span className="text-orange-500">Creator</span>
        </h1>
        {user?.creatorRequest?.status === 'needs_review' && (
          <div className="mt-4 inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full">
            <FiAlertCircle className="text-red-500" size={14} />
            <p className="text-[9px] font-black text-red-500 uppercase italic">
              Review Needed: {user.creatorRequest.rejectionReason}
            </p>
          </div>
        )}
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-12 max-w-7xl mx-auto">
        <div
          className="relative lg:col-span-5 hidden lg:flex items-center justify-center bg-cover bg-center rounded-l-[3rem] overflow-hidden"
          style={{ backgroundImage: "url('/register.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/55"></div>
          <div className="relative z-10 text-white px-10">
            <h2 className="text-3xl font-bold mb-3 uppercase tracking-tight">Tell Your Story</h2>
          </div>
        </div>

        <div className="lg:col-span-7 flex justify-center px-6">
          <div className="w-full max-w-3xl">
            {serverError && (
              <p className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-6 text-center text-[10px] font-black uppercase border border-red-500/20">
                {serverError}
              </p>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 bg-white/80 dark:bg-white/5 max-md:rounded-2xl md:rounded-r-3xl p-5 lg:p-10 shadow-xl border border-gray-100 dark:border-white/10 backdrop-blur-2xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                    Display Name
                  </label>
                  <input
                    {...register('display_name', { required: true })}
                    placeholder="Public brand name"
                    className={inputStyle}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                    Username
                  </label>
                  <input
                    value={user?.username || ''}
                    disabled
                    className={inputStyle + ' cursor-not-allowed opacity-60'}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                  Bio
                </label>
                <textarea
                  {...register('bio')}
                  rows={4}
                  placeholder="Tell people about yourself..."
                  className={`${inputStyle} resize-none`}
                />
              </div>

              {/* Image Previews Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                    Profile Image
                  </label>
                  <label className={fileBoxStyle}>
                    {previews.profile ? (
                      <img
                        src={previews.profile}
                        className="absolute inset-0 w-full h-full object-cover group-hover:opacity-40 transition-opacity"
                        alt="profile"
                      />
                    ) : (
                      <FiImage size={24} className="text-gray-300" />
                    )}
                    <div
                      className={`relative flex flex-col items-center z-10 ${previews.profile ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}
                    >
                      <span className="text-[9px] font-black uppercase text-white mt-1">
                        Change Image
                      </span>
                    </div>
                    <input
                      type="file"
                      {...register('profileImage')}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImagePreview(e, 'profile')}
                    />
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                    Cover Image
                  </label>
                  <label className={fileBoxStyle}>
                    {previews.cover ? (
                      <img
                        src={previews.cover}
                        className="absolute inset-0 w-full h-full object-cover group-hover:opacity-40 transition-opacity"
                        alt="cover"
                      />
                    ) : (
                      <FiUpload size={24} className="text-gray-300" />
                    )}
                    <div
                      className={`relative flex flex-col items-center z-10 ${previews.cover ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}
                    >
                      <span className="text-[9px] font-black uppercase text-white mt-1">
                        Update Cover
                      </span>
                    </div>
                    <input
                      type="file"
                      {...register('coverImage')}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImagePreview(e, 'cover')}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                    Country
                  </label>
                  <input
                    {...register('country', { required: true })}
                    placeholder="e.g. Bangladesh"
                    className={inputStyle}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                    City
                  </label>
                  <input
                    {...register('city', { required: true })}
                    placeholder="e.g. Dhaka"
                    className={inputStyle}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                    Language
                  </label>
                  <input
                    {...register('language', { required: true })}
                    placeholder="e.g. English, Bengali"
                    className={inputStyle}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                    Social Link
                  </label>
                  <input
                    {...register('social_link')}
                    placeholder="Instagram or Facebook URL"
                    className={inputStyle}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                    Website Link
                  </label>
                  <input
                    {...register('website_link')}
                    placeholder="https://yourwebsite.com"
                    className={inputStyle}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isPending}
                className="w-full bg-orange-500 text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-orange-600 active:scale-95 transition-all disabled:bg-gray-400"
              >
                {isSubmitting ? 'Processing Sync...' : isPending ? 'Pending' : 'Submit for Review'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
