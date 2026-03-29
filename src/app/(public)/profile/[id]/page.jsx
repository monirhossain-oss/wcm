'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import {
  FiUser,
  FiMapPin,
  FiGlobe,
  FiLink,
  FiLayers,
  FiInfo,
  FiActivity,
  FiArrowLeft,
  FiShield,
} from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageHelper';
import { Globe, Languages } from 'lucide-react';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',
  withCredentials: true,
});

export default function PublicProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/api/users/profile/${id}`);
        setProfileData(res.data);
      } catch (err) {
        console.error('Profile Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#050505]">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#050505] gap-4">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">
          Node Not Found
        </p>
        <button
          onClick={() => router.back()}
          className="text-[10px] font-black text-orange-500 uppercase underline"
        >
          Return
        </button>
      </div>
    );
  }

  const { user } = profileData;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#080808] pt-12 pb-20 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* 🔹 Navigation & Header */}
        <div className="mb-8 flex flex-col gap-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-orange-500 transition-colors w-fit"
          >
            <FiArrowLeft size={16} /> Exit to Discovery
          </button>

          {/* <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 dark:border-white/5 pb-8">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter dark:text-white flex items-center gap-3">
                <FiShield className="text-orange-500" /> verified artists and craftsmen
              </h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-1">
                
              </p>
            </div>
            <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-md">
              <span className="text-[9px] font-black text-green-500 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div> Status:{' '}
                {user.status}
              </span>
            </div>
          </div> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 🔹 Left: Identity Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden rounded-lg">
              {/* Cover Image */}
              <div className="h-32 w-full bg-gray-100 dark:bg-white/5 relative border-b border-gray-100 dark:border-white/5">
                <img
                  src={
                    getImageUrl(user.profile?.coverImage) ||
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000'
                  }
                  className="w-full h-full object-cover grayscale-[0.3]"
                  alt="cover"
                />
              </div>

              {/* Avatar & Basic Info */}
              <div className="px-6 pb-8 -mt-12 flex flex-col items-center text-center relative z-10">
                <div className="h-28 w-28 rounded-full border-4 border-white dark:border-[#0c0c0c] bg-white dark:bg-[#1a1a1a] overflow-hidden shadow-xl">
                  <img
                    src={getImageUrl(user.profile?.profileImage, 'avatar')}
                    className="w-full h-full object-cover"
                    alt="avatar"
                  />
                </div>

                <div className="mt-4">
                  <h2 className="text-sm font-black dark:text-white uppercase tracking-tight">
                    {user.profile?.displayName || `${user.firstName} ${user.lastName}`}
                  </h2>
                  <p className="text-orange-500 text-[9px] font-black tracking-widest uppercase mt-1 italic">
                    @{user.username}
                  </p>
                </div>

                {/* Tactical Stats Badges */}
                <div className="mt-8 w-full grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-md border border-gray-100 dark:border-white/10 text-left">
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Access Role
                    </p>
                    <span className="text-[10px] font-black dark:text-white uppercase">
                      {user.role}
                    </span>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-md border border-gray-100 dark:border-white/10 text-left">
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Network
                    </p>
                    <span className="text-[10px] font-black text-green-500 uppercase">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="p-6 bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/5 rounded-lg shadow-sm">
              <h4 className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em] mb-6 flex items-center gap-2">
                <FiActivity className="text-orange-500" /> Platform Metrics
              </h4>
              <div className="space-y-5">
                <div className="flex justify-between items-center group">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-orange-500 transition-colors">
                    Total Inventory
                  </span>
                  <span className="text-xs font-black dark:text-white uppercase tracking-widest">
                    {profileData.listingsCount || 0} Nodes
                  </span>
                </div>
                <div className="h-[1px] w-full bg-gray-100 dark:bg-white/5"></div>
                <div className="flex justify-between items-center group">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-orange-500 transition-colors">
                    Activation Date
                  </span>
                  <span className="text-[10px] font-black dark:text-white uppercase">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 🔹 Right: Professional Dossier */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-[#0c0c0c] border border-gray-100 dark:border-white/5 shadow-sm rounded-lg overflow-hidden">
              <div className="p-8 md:p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 animate-in fade-in duration-700">
                  <InfoRow label="Station Location" value={user.profile?.country} icon={FiMapPin} />
                  <InfoRow label="Regional Sector" value={user.profile?.city} icon={FiMapPin} />
                  <InfoRow
                    label="Primary Protocol"
                    value={user.profile?.language}
                    icon={Languages}
                  />
                  <InfoRow
                    label="Inventory Volume"
                    value={`${profileData.listingsCount || 0} ACTIVE UNITS`}
                    icon={FiLayers}
                  />

                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    <InfoRow
                      label="Global Link"
                      value={user.profile?.websiteLink}
                      icon={Globe}
                      isLink
                    />
                    <InfoRow
                      label="Network Node"
                      value={user.profile?.socialLink}
                      icon={FiLink}
                      isLink
                    />
                  </div>

                  {/* Bio Section */}
                  <div className="md:col-span-2 mt-4 p-6 bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 rounded-md">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                      <FiInfo className="text-orange-500" /> Biography & Mission Brief
                    </p>
                    <p className="text-[11px] font-bold leading-relaxed dark:text-gray-400 italic">
                      {user.profile?.bio ||
                        'System intelligence has not provided a biography for this node yet...'}
                    </p>
                  </div>
                </div>

                <div className="mt-12 flex items-center gap-4">
                  <div className="h-1 w-12 bg-orange-500 rounded-full"></div>
                  <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em]">
                    End of Dossier
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const InfoRow = ({ label, value, icon: Icon, isLink }) => (
  <div className="group border-b border-gray-100 dark:border-white/5 pb-4 last:border-0">
    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
    <div className="flex items-center gap-3">
      <Icon size={12} className="text-orange-500" />
      {isLink && value ? (
        <a
          href={value.startsWith('http') ? value : `https://${value}`}
          target="_blank"
          rel="noreferrer"
          className="text-[11px] font-black text-black dark:text-gray-200 uppercase hover:text-orange-500 transition-colors underline decoration-orange-500/30"
        >
          {value || "link"}
        </a>
      ) : (
        <p className="text-[11px] font-black text-black dark:text-gray-200 uppercase truncate">
          {value || 'UNSET'}
        </p>
      )}
    </div>
  </div>
);
