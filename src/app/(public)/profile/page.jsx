'use client';

import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  FiUser, FiEdit3, FiX, FiCheck, FiCamera, FiGlobe, FiMapPin, 
  FiType, FiInfo, FiLink, FiAlertCircle, FiShield, FiArrowLeft
} from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageHelper';

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

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

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

  const handleDelete = async () => {
    if (confirm('Are you sure you want to terminate this account? This action is irreversible.')) {
      try {
        await api.delete('/api/users/delete-account');
        setUser(null);
        router.push('/auth/signup');
      } catch (error) {
        setMessage({ type: 'error', text: error.response?.data?.message || 'Delete failed' });
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      setMessage({ type: '', text: '' });
      const formData = new FormData();
      const fields = ['firstName', 'lastName', 'displayName', 'bio', 'country', 'city', 'language', 'websiteLink', 'socialLink'];
      fields.forEach((field) => formData.append(field, data[field] || ''));

      const profileFile = document.querySelector('input[name="profileImageCustom"]')?.files[0];
      const coverFile = document.querySelector('input[name="coverImageCustom"]')?.files[0];

      if (profileFile) formData.append('profileImage', profileFile);
      if (coverFile) formData.append('coverImage', coverFile);

      const res = await api.put('/api/users/update-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUser(res.data.user);
      setMessage({ type: 'success', text: 'SYSTEM IDENTITY UPDATED' });
      setIsEditing(false);
      setPreviews({ profile: null, cover: null });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
      <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#080808] pt-12 pb-20 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* 🔹 Navigation & Header */}
        <div className="mb-8 flex flex-col gap-6">
            <button 
                onClick={() => router.back()} 
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-orange-500 transition-colors w-fit"
            >
                <FiArrowLeft size={16} /> Return to Dashboard
            </button>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 dark:border-white/5 pb-8">
                <div>
                    <h1 className="text-2xl font-black uppercase tracking-tighter dark:text-white flex items-center gap-3">
                        <FiShield className="text-orange-500" /> Identity Node
                    </h1>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">Management of core profile credentials</p>
                </div>
                <button
                    onClick={() => { setIsEditing(!isEditing); if (isEditing) reset(); setPreviews({ profile: null, cover: null }); }}
                    className={`px-6 py-3 rounded-md font-black text-[10px] tracking-widest transition-all ${isEditing ? 'bg-red-500 text-white' : 'bg-black text-white dark:bg-white dark:text-black hover:bg-orange-500 dark:hover:bg-orange-500 shadow-lg shadow-black/5'}`}
                >
                    {isEditing ? <span className="flex items-center gap-2"><FiX /> CANCEL</span> : <span className="flex items-center gap-2"><FiEdit3 /> CONFIGURE</span>}
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 🔹 Left: Visual Identity */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden rounded-lg">
              <div className="h-32 w-full bg-gray-100 dark:bg-white/5 relative border-b border-gray-100 dark:border-white/5">
                <img src={previews.cover || getImageUrl(user.profile?.coverImage) || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000'} className="w-full h-full object-cover grayscale-[0.5]" alt="cover" />
                {isEditing && (
                  <label className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer backdrop-blur-sm transition-all hover:bg-black/40">
                    <FiCamera className="text-white" size={24} />
                    <input type="file" name="coverImageCustom" className="hidden" onChange={(e) => handlePreview(e, 'cover')} accept="image/*" />
                  </label>
                )}
              </div>

              <div className="px-6 pb-8 -mt-12 flex flex-col items-center text-center relative z-10">
                <div className="relative group">
                  <div className="h-28 w-28 rounded-full border-4 border-white dark:border-[#0c0c0c] bg-white dark:bg-[#1a1a1a] overflow-hidden shadow-xl">
                    <img src={previews.profile || getImageUrl(user.profile?.profileImage, 'avatar')} className="w-full h-full object-cover" alt="avatar" />
                  </div>
                  {isEditing && (
                    <label className="absolute inset-0 bg-black/70 flex items-center justify-center cursor-pointer backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all rounded-full">
                      <FiCamera className="text-white" size={18} />
                      <input type="file" name="profileImageCustom" className="hidden" onChange={(e) => handlePreview(e, 'profile')} accept="image/*" />
                    </label>
                  )}
                </div>
                
                <div className="mt-4">
                    <h2 className="text-sm font-black dark:text-white uppercase tracking-tight">{user.profile?.displayName || `${user.firstName} ${user.lastName}`}</h2>
                    <div className="inline-flex items-center gap-2 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                        <p className="text-orange-500 text-[9px] font-black tracking-widest uppercase italic">@{user.username}</p>
                    </div>
                </div>

                <div className="mt-8 w-full border-t border-gray-100 dark:border-white/5 pt-6 grid grid-cols-2 gap-4">
                    <div className="text-left bg-gray-50 dark:bg-white/5 p-3 rounded-md">
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Auth Role</p>
                        <p className="text-[10px] font-black text-black dark:text-white uppercase mt-1">{user.role}</p>
                    </div>
                    <div className="text-left bg-gray-50 dark:bg-white/5 p-3 rounded-md">
                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Network</p>
                        <p className="text-[10px] font-black text-green-500 uppercase mt-1">Verified</p>
                    </div>
                </div>
              </div>
            </div>

            {user.creatorRequest?.status === 'rejected' && (
              <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-md">
                <p className="text-[9px] font-black text-red-500 uppercase flex items-center gap-2 tracking-widest"><FiAlertCircle /> REJECTION NOTICE</p>
                <p className="text-[10px] mt-2 text-gray-400 italic font-medium leading-relaxed">"{user.creatorRequest.rejectionReason}"</p>
              </div>
            )}
          </div>

          {/* 🔹 Right: Credentials & Configuration */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/5 shadow-sm rounded-lg overflow-hidden">
              <div className="p-8 md:p-10">
                {message.text && (
                  <div className={`mb-8 p-4 rounded-md text-[10px] font-black uppercase flex items-center gap-3 animate-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    <FiCheck /> {message.text}
                  </div>
                )}

                {!isEditing ? (
                  <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        <InfoRow label="Access Name" value={`${user.firstName} ${user.lastName}`} icon={FiUser} />
                        <InfoRow label="Network Node" value={user.profile?.displayName} icon={FiType} />
                        <InfoRow label="Geo Region" value={user.profile?.country} icon={FiMapPin} />
                        <InfoRow label="Station" value={user.profile?.city} icon={FiMapPin} />
                        <InfoRow label="Protocol" value={user.profile?.language} icon={FiGlobe} />
                        <InfoRow label="Direct Link" value={user.profile?.socialLink} icon={FiLink} />
                    </div>

                    <div className="bg-gray-50 dark:bg-black/20 p-6 border border-gray-100 dark:border-white/5 rounded-md">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><FiInfo /> Professional Brief</p>
                      <p className="text-[11px] font-bold leading-relaxed dark:text-gray-400 italic">{user.profile?.bio || 'No system brief initialized...'}</p>
                    </div>

                    <div className="pt-8 border-t border-gray-100 dark:border-white/5">
                        <h3 className="text-[9px] font-black text-red-500/50 uppercase tracking-[0.3em] mb-4">Critical Actions</h3>
                        <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/10 rounded-md">
                            <p className="text-[10px] font-bold text-gray-500 uppercase">Account Termination Protocol</p>
                            <button onClick={handleDelete} className="text-[9px] font-black text-red-500 uppercase hover:underline">Delete Account</button>
                        </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputField label="First Name" name="firstName" register={register} placeholder="Required" />
                      <InputField label="Last Name" name="lastName" register={register} placeholder="Required" />
                    </div>

                    <InputField label="Public Identity Name" name="displayName" register={register} placeholder="Visible to public" />

                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">System Brief (Bio)</label>
                      <textarea {...register('bio')} rows={4} className="w-full rounded-md px-4 py-3 border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-[11px] font-bold focus:border-orange-500 outline-none resize-none transition-all focus:ring-1 focus:ring-orange-500" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <InputField label="Country" name="country" register={register} placeholder="Node Country" />
                      <InputField label="City" name="city" register={register} placeholder="Node City" />
                      <InputField label="Language" name="language" register={register} placeholder="Primary Language" />
                    </div>
                    
                    <InputField label="External Social Link" name="socialLink" register={register} placeholder="https://..." />

                    <div className="pt-4">
                      <button type="submit" disabled={isSubmitting} className="w-full md:w-auto px-12 py-4 bg-orange-500 text-white font-black text-[10px] tracking-[0.3em] hover:bg-orange-600 transition-all disabled:bg-gray-700 uppercase shadow-lg shadow-orange-500/20 rounded-md">
                        {isSubmitting ? 'Synchronizing...' : 'PUSH UPDATES'}
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

const InfoRow = ({ label, value, icon: Icon }) => (
  <div className="group border-b border-gray-100 dark:border-white/5 pb-4 last:border-0">
    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-center gap-3">
        <Icon size={12} className="text-orange-500" />
        <p className="text-[11px] font-black text-black dark:text-gray-200 uppercase truncate">{value || 'UNSET'}</p>
    </div>
  </div>
);

const InputField = ({ label, name, register, placeholder }) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">{label}</label>
    <input {...register(name)} placeholder={placeholder} className="w-full rounded-md px-4 py-3 border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-[11px] font-bold focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600" />
  </div>
);