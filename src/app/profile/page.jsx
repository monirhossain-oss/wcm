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
  FiCalendar,
  FiArrowLeft,
  FiExternalLink,
  FiCamera,
  FiGlobe,
  FiMapPin,
  FiType,
  FiInfo,
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
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.profile?.displayName || '',
        bio: user.profile?.bio || '',
        country: user.profile?.country || '',
        language: user.profile?.language || '',
      });
    }
  }, [user, reset]);

  const handlePreview = (e, type) => {
    const file = e.target.files[0];
    if (file) setPreviews((prev) => ({ ...prev, [type]: URL.createObjectURL(file) }));
  };

  const onSubmit = async (data) => {
    try {
      setMessage({ type: '', text: '' });
      const formData = new FormData();

      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('displayName', data.displayName);
      formData.append('bio', data.bio);
      formData.append('country', data.country);
      formData.append('language', data.language);

      const profileFile = document.querySelector('input[name="profileImage"]')?.files[0];
      const coverFile = document.querySelector('input[name="coverImage"]')?.files[0];

      if (profileFile) {
        formData.append('profileImage', profileFile);
      }
      if (coverFile) {
        formData.append('coverImage', coverFile);
      }

      const res = await api.put('/api/users/update-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUser(res?.data?.user);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      setPreviews({ profile: null, cover: null });
    } catch (error) {
      console.error('Update Error:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center animate-pulse font-bold tracking-widest uppercase">
        Loading Profile...
      </div>
    );
  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center font-bold">Please Login.</div>
    );

  const getFullUrl = (path) => (path ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}` : null);

  // ডিসপ্লে রো (Row) এর জন্য ছোট একটি সাব-কম্পোনেন্ট
  const InfoRow = ({ label, value, icon: Icon }) => (
    <div className="flex items-center justify-between py-4 border-b border-ui last:border-0 group transition-all">
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-ui rounded-xl text-text group-hover:text-orange-500 transition-colors">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
            {label}
          </p>
          <p className="text-sm font-semibold dark:text-gray-200">{value || 'Not Set'}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] pt-12 pb-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-black hover:text-orange-500 transition-all active:scale-90 group"
          >
            <div className="p-2 bg-white dark:bg-[#111] rounded-full border border-ui group-hover:border-orange-500 shadow-sm">
              <FiArrowLeft />
            </div>
            BACK
          </button>
          {user.role === 'creator' && (
            <div className="badge-burgundy px-4 py-1.5 rounded-full text-[10px] font-black tracking-tighter uppercase flex items-center gap-2 italic ring-4 ring-red-500/5">
              <FiExternalLink /> Creator Verified
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side: Avatar Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-[#111] rounded-[2.5rem] border border-ui shadow-sm overflow-hidden flex flex-col items-center group/card">
              <div className="h-32 w-full bg-ui relative">
                <img
                  src={
                    previews.cover ||
                    getFullUrl(user.profile?.coverImage) ||
                    'https://via.placeholder.com/800x400?text='
                  }
                  className="w-full h-full object-cover"
                  alt="cover"
                />
                {isEditing && (
                  <label className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer backdrop-blur-sm opacity-100 transition-opacity">
                    <div className="text-center text-white">
                      <FiCamera className="mx-auto mb-1" size={24} />
                      <p className="text-[10px] font-bold">CHANGE COVER</p>
                    </div>
                    <input
                      type="file"
                      name="coverImage"
                      className="hidden"
                      {...register('coverImage')}
                      onChange={(e) => handlePreview(e, 'cover')}
                    />
                  </label>
                )}
              </div>
              <div className="p-8 -mt-20 flex flex-col items-center text-center w-full relative z-10">
                <div className="relative">
                  <div className="h-32 w-32 rounded-full border-[6px] border-white dark:border-[#111] bg-white overflow-hidden shadow-2xl ring-1 ring-black/5">
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
                        name="profileImage"
                        className="hidden"
                        {...register('profileImage')}
                        onChange={(e) => handlePreview(e, 'profile')}
                      />
                    </label>
                  )}
                </div>
                <h2 className="mt-5 text-2xl font-black tracking-tight">
                  {user.profile?.displayName || `${user.firstName} ${user.lastName}`}
                </h2>
                <p className="text-orange-500 text-[11px] font-black tracking-[0.2em] uppercase">
                  @{user.username}
                </p>
                <div className="mt-8 w-full grid grid-cols-2 gap-3">
                  <div className="p-3 bg-ui rounded-2xl text-[10px] font-black uppercase tracking-tighter">
                    <p className="text-gray-400 mb-1 font-normal">Role</p>
                    {user.role}
                  </div>
                  <div className="p-3 bg-ui rounded-2xl text-[10px] font-black uppercase tracking-tighter">
                    <p className="text-gray-400 mb-1 font-normal">Status</p>
                    <span className="text-success">{user.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Information / Form */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-[#111] rounded-[2.5rem] border border-ui shadow-sm overflow-hidden min-h-125">
              <div className="px-10 py-8 border-b border-ui flex items-center justify-between bg-[#fcfcfc] dark:bg-[#151515]">
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight">Personal Details</h3>
                  <p className="text-[11px] font-bold text-gray-400 tracking-wider">
                    SECURE ACCOUNT INFORMATION
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsEditing(!isEditing);
                    if (isEditing) reset();
                    setPreviews({ profile: null, cover: null });
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-[10px] tracking-widest transition-all ${isEditing ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-black text-white dark:bg-white dark:text-black hover:scale-105'}`}
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
                    className={`mb-8 p-5 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-red-500 text-white shadow-lg shadow-red-500/20'}`}
                  >
                    <FiCheck /> {message.text}
                  </div>
                )}

                {!isEditing ? (
                  /* 🔹 Display Mode (Luxury View) */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 animate-in fade-in duration-500">
                    <div className="space-y-1">
                      <InfoRow
                        label="Full Name"
                        value={`${user.firstName} ${user.lastName}`}
                        icon={FiUser}
                      />
                      <InfoRow
                        label="Display Name"
                        value={user.profile?.displayName}
                        icon={FiType}
                      />
                      <InfoRow label="Email Address" value={user.email} icon={FiMail} />
                    </div>
                    <div className="space-y-1">
                      <InfoRow label="Location" value={user.profile?.country} icon={FiMapPin} />
                      <InfoRow label="Language" value={user.profile?.language} icon={FiGlobe} />
                      <InfoRow
                        label="Member Since"
                        value={new Date(user.createdAt).toDateString()}
                        icon={FiCalendar}
                      />
                    </div>
                    <div className="md:col-span-2 mt-6 p-6 bg-ui rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <FiInfo /> Professional Bio
                      </p>
                      <p className="text-sm font-medium leading-relaxed italic">
                        {user.profile?.bio || 'Introduce yourself to the community...'}
                      </p>
                    </div>
                  </div>
                ) : (
                  /* 🔹 Edit Mode (Form View) */
                 <form
  onSubmit={handleSubmit(onSubmit)}
  className="space-y-6 animate-in zoom-in-95 duration-300"
>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* First Name */}
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
        First Name
      </label>
      <input
        {...register('firstName')}
        
        className="w-full rounded-2xl px-6 py-4 border border-white/50 focus:border-orange-500 bg-white dark:bg-black text-black dark:text-white transition-all outline-none text-sm font-bold shadow-sm"
      />
    </div>

    {/* Last Name */}
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
        Last Name
      </label>
      <input
        {...register('lastName')}
        className="w-full rounded-2xl px-6 py-4 border border-white/50 focus:border-orange-500 bg-white dark:bg-black text-black dark:text-white transition-all outline-none text-sm font-bold shadow-sm"
      />
    </div>
  </div>

  {/* Display Name */}
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
      Display Name 
    </label>
    <input
      {...register('displayName')}
      className="w-full rounded-2xl px-6 py-4 border border-white/50 focus:border-orange-500 bg-white dark:bg-black text-black dark:text-white transition-all outline-none text-sm font-bold shadow-sm"
    />
  </div>

  {/* Bio */}
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
      Professional Bio
    </label>
    <textarea
      {...register('bio')}
      rows={4}
      className="w-full rounded-2xl px-6 py-4 border border-white/50 focus:border-orange-500 bg-white dark:bg-black text-black dark:text-white transition-all outline-none text-sm font-bold resize-none shadow-sm"
    />
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Country */}
    <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
      Country 
    </label>
    <input
      {...register('displayName')}
      className="w-full rounded-2xl px-6 py-4 border border-white/50 focus:border-orange-500 bg-white dark:bg-black text-black dark:text-white transition-all outline-none text-sm font-bold shadow-sm"
    />
  </div>

    {/* Language */}
  <div className="space-y-2">
    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">
      Language 
    </label>
    <input
      {...register('displayName')}
      className="w-full rounded-2xl px-6 py-4 border border-white/50 focus:border-orange-500 bg-white dark:bg-black text-black dark:text-white transition-all outline-none text-sm font-bold shadow-sm"
    />
  </div>
  </div>

  <div className="pt-6">
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full md:w-auto px-12 py-4 rounded-2xl bg-orange-500 text-white font-black text-xs tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 active:scale-95 uppercase"
    >
      {isSubmitting ? 'Syncing...' : 'Save Profile Changes'}
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
