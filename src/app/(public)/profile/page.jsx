'use client';

import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  FiUser,
  FiEdit3,
  FiX,
  FiCheck,
  FiCamera,
  FiGlobe,
  FiMapPin,
  FiType,
  FiInfo,
  FiLink,
  FiAlertCircle,
  FiShield,
  FiArrowLeft,
  FiCheckCircle,
  FiExternalLink,
} from 'react-icons/fi';
import { Globe, Languages, Box, Info } from 'lucide-react';
import { getImageUrl } from '@/lib/imageHelper';
import ListingCard from '@/components/ListingCard';

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
  const [listings, setListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  // Fetch listings if user is a creator
  useEffect(() => {
    const fetchListings = async () => {
      if (!user?._id || user?.role !== 'creator') return;
      try {
        setListingsLoading(true);
        const res = await api.get(`/api/listings/public?creatorId=${user._id}`);
        setListings(res.data.listings || res.data || []);
      } catch (err) {
        console.error('Listings fetch error:', err);
      } finally {
        setListingsLoading(false);
      }
    };
    fetchListings();
  }, [user]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        displayName: user?.profile?.displayName || '',
        bio: user?.profile?.bio || '',
        country: user?.profile?.country || '',
        city: user?.profile?.city || '',
        language: user?.profile?.language || '',
        websiteLink: user?.profile?.websiteLink || '',
        socialLink: user?.profile?.socialLink || '',
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
      setMessage({ type: 'success', text: 'SYSTEM IDENTITY UPDATED' });
      setIsEditing(false);
      setPreviews({ profile: null, cover: null });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Update failed' });
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0f0f0f]">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f] text-[#222] dark:text-gray-200 font-sans selection:bg-orange-100 pb-20">

      {/* ── Cover Image ── */}
      <div className="relative h-[250px] md:h-[300px] w-full overflow-hidden">
        <Image
          src={
            previews.cover ||
            getImageUrl(user?.profile?.coverImage) ||
            'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000'
          }
          alt="cover"
          fill
          priority
          className="object-cover grayscale-[20%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/30" />

        {/* Back button */}
        <div className="absolute top-8 left-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-5 py-2.5 bg-black/20 backdrop-blur-xl border border-white/10 rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all"
          >
            <FiArrowLeft size={14} /> Return
          </button>
        </div>

        {/* Edit cover button (only in editing mode) */}
        {isEditing && (
          <label className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/40 backdrop-blur-sm transition-all hover:bg-black/50">
            <div className="flex flex-col items-center gap-2 text-white">
              <FiCamera size={28} />
              <span className="text-[10px] font-black uppercase tracking-widest">Change Cover</span>
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

      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* ── Identity Header ── */}
        <div className="relative -mt-24 flex flex-col md:flex-row items-start md:items-end gap-8 pb-12 border-b border-gray-100 dark:border-white/5">

          {/* Avatar */}
          <div className="relative group">
            <div className="h-44 w-44 relative rounded-[2.5rem] border-[8px] border-white dark:border-[#0f0f0f] bg-gray-100 overflow-hidden shadow-2xl transition-all duration-500 group-hover:rounded-3xl">
              <Image
                src={previews.profile || getImageUrl(user?.profile?.profileImage, 'avatar')}
                alt="avatar"
                fill
                sizes="176px"
                className="object-cover"
                priority
              />
            </div>
            {user?.role === 'creator' && (
              <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white p-2.5 rounded-2xl shadow-xl border-4 border-white dark:border-[#0f0f0f]">
                <FiCheckCircle size={18} />
              </div>
            )}
            {isEditing && (
              <label className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all rounded-[2.5rem]">
                <FiCamera className="text-white" size={22} />
                <span className="text-white text-[9px] font-black uppercase tracking-widest mt-1">Change</span>
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

          {/* Name & Meta */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase dark:text-white leading-none">
                {user?.profile?.displayName || `${user?.firstName} ${user?.lastName}`}
              </h1>
              <div className="px-3 py-1 bg-orange-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">
                {user?.role}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest">
              <span className="flex items-center gap-2">
                <FiMapPin className="text-orange-500" />
                {user?.profile?.city || 'Unknown'}, {user?.profile?.country || 'Earth'}
              </span>
              <span className="flex items-center gap-2">
                <Languages className="text-orange-500" size={14} />
                {user?.profile?.language || 'Global'}
              </span>
              <span className="text-orange-500 italic lowercase">@{user?.username}</span>
            </div>
          </div>

          {/* Edit / Cancel button */}
          <button
            onClick={() => {
              setIsEditing(!isEditing);
              if (isEditing) reset();
              setPreviews({ profile: null, cover: null });
            }}
            className={`px-6 py-3 rounded-xl font-black text-[10px] tracking-widest transition-all flex items-center gap-2 ${isEditing
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-black text-white dark:bg-white dark:text-black hover:bg-orange-500 dark:hover:bg-orange-500 shadow-lg shadow-black/5'
              }`}
          >
            {isEditing ? <><FiX /> CANCEL</> : <><FiEdit3 /> Edit Profile</>}
          </button>
        </div>

        {/* ── Success / Error Message ── */}
        {message.text && (
          <div
            className={`mt-8 p-4 rounded-xl text-[10px] font-black uppercase flex items-center gap-3 animate-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}
          >
            <FiCheck /> {message.text}
          </div>
        )}

        {/* ── Rejection Notice ── */}
        {user?.creatorRequest?.status === 'rejected' && (
          <div className="mt-8 p-5 bg-red-500/5 border border-red-500/20 rounded-2xl">
            <p className="text-[9px] font-black text-red-500 uppercase flex items-center gap-2 tracking-widest mb-3">
              <FiAlertCircle /> REJECTION NOTICE
            </p>
            <p className="text-[10px] text-gray-400 italic font-medium leading-relaxed">
              "{user.creatorRequest.rejectionReason}"
            </p>
            <p className="text-[10px] mt-2 text-gray-400 italic font-medium leading-relaxed">
              <span className="font-bold">Additional Details:</span> "{user.creatorRequest.additionalReason}"
            </p>
          </div>
        )}

        {/* ── About & Links ── */}
        <div className="py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-gray-100 dark:border-white/5">

          {/* Links */}
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-2">
                <FiLink className="text-orange-500" /> Links
              </h3>
              <div className="grid gap-3">
                {user?.profile?.websiteLink && (
                  <SocialLink icon={Globe} label="Official Website" url={user.profile.websiteLink} />
                )}
                {user?.profile?.socialLink && (
                  <SocialLink icon={FiExternalLink} label="Portfolio / Social" url={user.profile.socialLink} />
                )}
                {!user?.profile?.websiteLink && !user?.profile?.socialLink && (
                  <p className="text-[10px] text-gray-400 italic font-bold">No links added yet.</p>
                )}
              </div>
            </div>

            {/* Role & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 p-4 rounded-2xl">
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Auth Role</p>
                <p className="text-[10px] font-black text-black dark:text-white uppercase">{user?.role}</p>
              </div>
              <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 p-4 rounded-2xl">
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Network</p>
                <p className="text-[10px] font-black text-green-500 uppercase">Verified</p>
              </div>
            </div>
          </div>

          {/* Bio / Edit Form */}
          <div className="lg:col-span-8">
            {!isEditing ? (
              <div className="space-y-4 animate-in fade-in duration-500">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-2">
                  <Info className="text-orange-500" size={14} /> Biography
                </h3>
                <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5">
                  <p className="text-sm md:text-base leading-relaxed font-medium text-gray-600 dark:text-gray-400 italic whitespace-pre-wrap">
                    {user?.profile?.bio || "This profile's biography has not been initialized."}
                  </p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mt-6">
                  <InfoRow label="Full Name" value={`${user?.firstName} ${user?.lastName}`} icon={FiUser} />
                  <InfoRow label="Display Name" value={user?.profile?.displayName} icon={FiType} />
                  <InfoRow label="Country" value={user?.profile?.country} icon={FiMapPin} />
                  <InfoRow label="City" value={user?.profile?.city} icon={FiMapPin} />
                  <InfoRow label="Language" value={user?.profile?.language} icon={FiGlobe} />
                  <InfoRow label="Social Link" value={user?.profile?.socialLink} icon={FiLink} />
                </div>

                {/* Danger Zone */}
                <div className="pt-8 border-t border-gray-100 dark:border-white/5 mt-8">
                  <h3 className="text-[9px] font-black text-red-500/50 uppercase tracking-[0.3em] mb-4">
                    Critical Actions
                  </h3>
                  <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Account Termination Protocol</p>
                    <button
                      onClick={handleDelete}
                      className="text-[9px] font-black text-red-500 uppercase hover:underline"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 animate-in fade-in duration-300"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="First Name" name="firstName" register={register} placeholder="Required" />
                  <InputField label="Last Name" name="lastName" register={register} placeholder="Required" />
                </div>

                <InputField label="Public Display Name" name="displayName" register={register} placeholder="Visible to public" />

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">
                    Biography
                  </label>
                  <textarea
                    {...register('bio')}
                    rows={4}
                    className="w-full rounded-xl px-4 py-3 border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-[11px] font-bold focus:border-orange-500 outline-none resize-none transition-all focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField label="Language" name="language" register={register} placeholder="Primary Language" />
                  <InputField label="Social Link" name="socialLink" register={register} placeholder="https://..." />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full cursor-pointer px-12 py-4 bg-orange-500 text-white font-black text-[10px] tracking-[0.3em] hover:bg-orange-600 transition-all disabled:bg-gray-700 uppercase shadow-lg shadow-orange-500/20 rounded-xl"
                  >
                    {isSubmitting ? 'Updating...' : 'Update Profile'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* ── Creator Listings ── */}
        {user?.role === 'creator' && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-100 dark:border-white/5">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">
                My Listings / {listings.length} Units
              </h3>
              <span className="px-4 py-1.5 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Active Listings
              </span>
            </div>

            {listingsLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {listings.length > 0 ? (
                  listings.map((item) => (
                    <ListingCard key={item._id} item={item} />
                  ))
                ) : (
                  <div className="col-span-full py-24 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[3rem] flex flex-col items-center justify-center text-gray-400">
                    <Box size={48} strokeWidth={1} className="opacity-20 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">No active listings found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────

const InfoRow = ({ label, value, icon: Icon }) => (
  <div className="group border-b border-gray-100 dark:border-white/5 pb-4 last:border-0">
    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-center gap-3">
      <Icon size={12} className="text-orange-500" />
      <p className="text-[11px] font-black text-black dark:text-gray-200 uppercase truncate">
        {value || 'UNSET'}
      </p>
    </div>
  </div>
);

const InputField = ({ label, name, register, placeholder }) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest ml-1">
      {label}
    </label>
    <input
      {...register(name)}
      placeholder={placeholder}
      className="w-full rounded-xl px-4 py-3 border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-[11px] font-bold focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600"
    />
  </div>
);

const SocialLink = ({ icon: Icon, label, url }) => (
  <a
    href={url.startsWith('http') ? url : `https://${url}`}
    target="_blank"
    rel="noreferrer"
    className="flex items-center gap-4 p-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl hover:border-orange-500 transition-all group"
  >
    <div className="p-2.5 bg-gray-50 dark:bg-black/20 rounded-xl text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
      <Icon size={16} />
    </div>
    <div className="overflow-hidden">
      <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-0.5">{label}</p>
      <p className="text-[11px] font-bold truncate dark:text-gray-200 group-hover:text-orange-500 transition-colors italic">{url}</p>
    </div>
  </a>
);