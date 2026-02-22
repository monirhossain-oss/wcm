'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { FiUpload, FiImage, FiCheck } from 'react-icons/fi';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

export default function UserProfileForm() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [serverError, setServerError] = useState('');
  const [mounted, setMounted] = useState(false);

  const [fileStatus, setFileStatus] = useState({ profile: false, cover: false });

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const profileImg = watch('profileImage');
  const coverImg = watch('coverImage');

  useEffect(() => {
    if (profileImg?.[0]) setFileStatus((prev) => ({ ...prev, profile: true }));
    if (coverImg?.[0]) setFileStatus((prev) => ({ ...prev, cover: true }));
  }, [profileImg, coverImg]);

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

  if (!mounted) return null;

  const inputStyle =
    'w-full border border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all';

  const fileBoxStyle =
    'relative flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-lg p-4 transition-all hover:border-orange-500 bg-gray-50 dark:bg-white/5 cursor-pointer group';

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
        <h1 className="text-4xl font-black uppercase tracking-tighter dark:text-white">
          Become a <span className="text-orange-500">Creator</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm font-medium">
          Showcase your story to a global audience.
        </p>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-12 max-w-7xl mx-auto">
        <div
          className="relative lg:col-span-5 hidden lg:flex items-center justify-center bg-cover bg-center rounded-l-[3rem] overflow-hidden"
          style={{ backgroundImage: "url('/register.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/55"></div>
          <div className="relative z-10 text-white px-10">
            <h2 className="text-3xl font-bold mb-3">Tell Your Story</h2>
            <p className="text-lg opacity-90">Your profile helps people discover who you are.</p>
          </div>
        </div>

        <div className="lg:col-span-7 flex justify-center px-6 pb-16">
          <div className="w-full max-w-3xl">
            {serverError && (
              <p className="bg-red-500/10 text-red-500 p-4 rounded-xl mb-6 text-center text-xs font-black uppercase tracking-widest border border-red-500/20">
                {serverError}
              </p>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 bg-black/10 dark:bg-white/5 max-md:rounded-2xl md:rounded-r-3xl p-5 lg:p-10 shadow-xl border border-gray-100 dark:border-white/10 backdrop-blur-2xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                    Display Name
                  </label>
                  <input
                    {...register('display_name', { required: 'Required' })}
                    placeholder="Public brand name"
                    className={inputStyle}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                    Username
                  </label>
                  <input
                    {...register('username', { required: 'Required' })}
                    placeholder="Unique username"
                    className={inputStyle}
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

              {/* 🔹 Improved File Upload Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                    Profile Image
                  </label>
                  <label className={fileBoxStyle}>
                    <div className="flex flex-col items-center gap-1">
                      {fileStatus.profile ? (
                        <FiCheck className="text-green-500" size={20} />
                      ) : (
                        <FiImage
                          className="group-hover:text-orange-500 transition-colors"
                          size={20}
                        />
                      )}
                      <span className="text-[9px] font-bold uppercase tracking-wider">
                        {fileStatus.profile ? 'Selected' : 'Choose Profile'}
                      </span>
                    </div>
                    <input
                      type="file"
                      {...register('profileImage')}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                    Cover Image
                  </label>
                  <label className={fileBoxStyle}>
                    <div className="flex flex-col items-center gap-1">
                      {fileStatus.cover ? (
                        <FiCheck className="text-green-500" size={20} />
                      ) : (
                        <FiUpload
                          className="group-hover:text-orange-500 transition-colors"
                          size={20}
                        />
                      )}
                      <span className="text-[9px] font-bold uppercase tracking-wider">
                        {fileStatus.cover ? 'Selected' : 'Choose Cover'}
                      </span>
                    </div>
                    <input
                      type="file"
                      {...register('coverImage')}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                    Country
                  </label>
                  <input
                    {...register('country', { required: true })}
                    placeholder="Bangladesh"
                    className={inputStyle}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                    City
                  </label>
                  <input
                    {...register('city', { required: true })}
                    placeholder="Dhaka"
                    className={inputStyle}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                    Language
                  </label>
                  <input
                    {...register('language', { required: true })}
                    placeholder="english"
                    className={inputStyle}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
                    Website Link
                  </label>
                  <input
                    {...register('website_link')}
                    placeholder="https://"
                    className={inputStyle}
                  />
                </div>
              </div>

              <div className="space-y-1 text-center pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-12 bg-orange-500 text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-orange-500/20 hover:bg-orange-600 active:scale-95 transition-all disabled:bg-gray-400"
                >
                  {isSubmitting ? 'Uploading Node...' : 'Submit for Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
