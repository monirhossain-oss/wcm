'use client';

import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  FiUser,
  FiMail,
  FiEdit3,
  FiX,
  FiCheck,
  FiCamera,
  FiGlobe,
  FiMapPin,
  FiType,
  FiInfo,
  FiInstagram,
  FiLink,
  FiAlertCircle,
  FiArrowLeft,
} from 'react-icons/fi';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',
  withCredentials: true,
});

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [previews, setPreviews] = useState({ profile: null, cover: null });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        displayName: user.profile?.displayName || '',
        bio: user.profile?.bio || '',
        country: user.profile?.country || '',
        city: user.profile?.city || '',
        language: user.profile?.language || '',
        websiteLink: user.profile?.websiteLink || '',
        socialLink: user.profile?.socialLink || '',
      });
    }
  }, [user, reset, isEditing]);

  const handlePreview = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviews((prev) => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };

  const onSubmit = async (data) => {
    try {
      setMessage({ type: '', text: '' });
      const formData = new FormData();

      // টেক্সট ডাটা অ্যাপেন্ড
      const fields = [
        'firstName',
        'lastName',
        'displayName',
        'bio',
        'country',
        'city',
        'language',
        'websiteLink',
        'socialLink',
      ];
      fields.forEach((field) => formData.append(field, data[field] || ''));

      const profileFile = document.querySelector('input[name="profileImageCustom"]')?.files[0];
      const coverFile = document.querySelector('input[name="coverImageCustom"]')?.files[0];

      if (profileFile) formData.append('profileImage', profileFile);
      if (coverFile) formData.append('coverImage', coverFile);

      const res = await api.put('/api/users/update-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUser(res.data.user);
      setMessage({ type: 'success', text: 'PROFILE UPDATED SUCCESSFULLY' });
      setIsEditing(false);
      setPreviews({ profile: null, cover: null });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (error) {
      console.error('Update Error:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
    }
  };

  const getFullUrl = (path) => (path ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}` : null);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center animate-pulse font-black tracking-widest uppercase text-orange-500 bg-[#050505]">
        Syncing Profile...
      </div>
    );

  if (!user) {
    if (typeof window !== 'undefined') router.push('/login');
    return null;
  }

  const isPending = user.creatorRequest?.status === 'pending';

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[10px] font-black hover:text-orange-500 transition-all active:scale-90 group"
          >
            <div className="p-2 bg-white dark:bg-white/5 rounded-full border border-gray-100 dark:border-white/10 group-hover:border-orange-500 shadow-sm">
              <FiArrowLeft />
            </div>
            BACK
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 🔹 Avatar Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden flex flex-col items-center">
              <div className="h-32 w-full bg-gray-100 dark:bg-white/5 relative">
                <img
                  src={
                    previews.cover ||
                    getFullUrl(user.profile?.coverImage) ||
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000'
                  }
                  className="w-full h-full object-cover"
                  alt="cover"
                />
                {isEditing && (
                  <label className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer backdrop-blur-sm">
                    <div className="text-center text-white">
                      <FiCamera className="mx-auto mb-1" size={24} />
                      <p className="text-[9px] font-black uppercase tracking-widest">
                        Update Cover
                      </p>
                    </div>
                    <input
                      type="file"
                      name="coverImageCustom"
                      className="hidden"
                      onChange={(e) => handlePreview(e, 'cover')}
                      accept="image/*"
                    />
                  </label>
                )}
              </div>

              <div className="p-8 -mt-16 flex flex-col items-center text-center w-full relative z-10">
                <div className="relative">
                  <div className="h-32 w-32 rounded-full border-[6px] border-white dark:border-[#050505] bg-white overflow-hidden shadow-2xl">
                    <img
                      src={
                        previews.profile ||
                        getFullUrl(user.profile?.profileImage) ||
                        '/default-avatar.png'
                      }
                      className="w-full h-full object-cover"
                      alt="avatar"
                    />
                  </div>
                  {isEditing && (
                    <label className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center cursor-pointer backdrop-blur-sm">
                      <FiCamera className="text-white" size={20} />
                      <input
                        type="file"
                        name="profileImageCustom"
                        className="hidden"
                        onChange={(e) => handlePreview(e, 'profile')}
                        accept="image/*"
                      />
                    </label>
                  )}
                </div>
                <h2 className="mt-5 text-xl font-black dark:text-white uppercase truncate w-full px-2">
                  {user.profile?.displayName || `${user.firstName} ${user.lastName}`}
                </h2>
                <p className="text-orange-500 text-[10px] font-black tracking-[0.2em] uppercase">
                  @{user.username}
                </p>
                <div className="mt-8 w-full grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl text-[9px] font-black uppercase border border-gray-100 dark:border-white/10">
                    <p className="text-gray-400 mb-1 font-normal lowercase italic">Role</p>
                    {user.role}
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl text-[9px] font-black uppercase border border-gray-100 dark:border-white/10">
                    <p className="text-gray-400 mb-1 font-normal lowercase italic">Status</p>
                    <span className="text-green-500">{user.status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Creator Request Status */}
            {user.creatorRequest?.status === 'rejected' && (
              <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl animate-in fade-in">
                <p className="text-[10px] font-black text-red-500 uppercase flex items-center gap-2">
                  <FiAlertCircle /> ACTION REQUIRED
                </p>
                <p className="text-xs mt-2 text-gray-500 italic">
                  "{user.creatorRequest.rejectionReason}"
                </p>
              </div>
            )}
          </div>

          {/* 🔹 Details Section */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
              <div className="px-10 py-8 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-white/50 dark:bg-white/5">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-[0.2em] dark:text-white">
                    Profile Identity
                  </h3>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                    Secure Sync Node
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsEditing(!isEditing);
                    if (isEditing) reset();
                    setPreviews({ profile: null, cover: null });
                  }}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-[9px] tracking-widest transition-all ${isEditing ? 'bg-red-500 text-white' : 'bg-black text-white dark:bg-white dark:text-black'}`}
                >
                  {isEditing ? (
                    <>
                      <FiX /> CANCEL
                    </>
                  ) : (
                    <>
                      <FiEdit3 /> EDIT PROFILE
                    </>
                  )}
                </button>
              </div>

              <div className="p-10">
                {message.text && (
                  <div
                    className={`mb-8 p-4 rounded-xl text-[10px] font-black uppercase flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                  >
                    <FiCheck /> {message.text}
                  </div>
                )}

                {!isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 animate-in fade-in duration-500">
                    <InfoRow
                      label="Full Name"
                      value={`${user.firstName} ${user.lastName}`}
                      icon={FiUser}
                    />
                    <InfoRow label="Display Name" value={user.profile?.displayName} icon={FiType} />
                    <InfoRow label="Country" value={user.profile?.country} icon={FiMapPin} />
                    <InfoRow label="City" value={user.profile?.city} icon={FiMapPin} />
                    <InfoRow label="Language" value={user.profile?.language} icon={FiGlobe} />
                    <InfoRow label="Social Link" value={user.profile?.socialLink} icon={FiLink} />
                    <div className="md:col-span-2 mt-8 p-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <FiInfo /> Professional Bio
                      </p>
                      <p className="text-xs font-medium leading-relaxed italic dark:text-gray-300">
                        {user.profile?.bio || 'No bio provided...'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* First & Last Name */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField
                        label="First Name"
                        name="firstName"
                        register={register}
                        placeholder="e.g. John"
                      />
                      <InputField
                        label="Last Name"
                        name="lastName"
                        register={register}
                        placeholder="e.g. Doe"
                      />
                    </div>

                    {/* Display Name */}
                    <InputField
                      label="Public Display Name"
                      name="displayName"
                      register={register}
                      placeholder="How others will see your name"
                    />

                    {/* Professional Bio */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.15em] ml-1">
                        Professional Bio
                      </label>
                      <textarea
                        {...register('bio')}
                        rows={3}
                        placeholder="Tell us a bit about your professional journey..."
                        className="w-full rounded-xl px-5 py-4 border border-gray-100 dark:border-white/10 bg-white/20 dark:bg-white/5 text-xs font-bold focus:ring-2 focus:ring-orange-500 outline-none resize-none backdrop-blur-md transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                      />
                    </div>

                    {/* Location & Language */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <InputField
                        label="Country"
                        name="country"
                        register={register}
                        placeholder="Country Name"
                      />
                      <InputField
                        label="City / Region"
                        name="city"
                        register={register}
                        placeholder="Your City"
                      />
                      <InputField
                        label="Native Language"
                        name="language"
                        register={register}
                        placeholder="e.g. English, Bengali"
                      />
                    </div>
                    <InputField
                      label="Social Link"
                      name="socialLink"
                      register={register}
                      placeholder="Your social media link"
                    />

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full md:w-auto px-12 py-4 rounded-xl bg-orange-500 text-white font-black text-[10px] tracking-[0.2em] hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 active:scale-95 disabled:bg-gray-400 uppercase"
                      >
                        {isSubmitting ? 'SYNCHRONIZING...' : 'SAVE CHANGES'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🔹 হেল্পার কম্পোনেন্টস
const InfoRow = ({ label, value, icon: Icon }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-white/10 last:border-0 group transition-all">
    <div className="flex items-center gap-4">
      <div className="p-2.5 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-400 group-hover:text-orange-500 transition-colors">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
          {label}
        </p>
        <p className="text-sm font-semibold text-[#1f1f1f] dark:text-gray-200">
          {value || 'Not Provided'}
        </p>
      </div>
    </div>
  </div>
);

const InputField = ({ label, name, register, placeholder }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-gray-400 tracking-[0.15em] ml-1">
      {label}
    </label>
    <input
      {...register(name)}
      placeholder={placeholder}
      className="w-full rounded-xl px-5 py-4 border border-gray-100 dark:border-white/10 bg-white/20 dark:bg-white/5 text-xs font-bold focus:ring-2 focus:ring-orange-500 outline-none backdrop-blur-md transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
    />
  </div>
);
