'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import {
  FiUser,
  FiMapPin,
  FiGlobe,
  FiLink,
  FiInstagram,
  FiLayers,
  FiInfo,
  FiActivity,
} from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageHelper';
import { Globe, Languages } from 'lucide-react';

// Axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

export default function PublicProfilePage() {
  const { id } = useParams();
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
      <div className="min-h-screen flex items-center justify-center animate-pulse font-black tracking-[0.3em] uppercase text-orange-500 bg-[#050505]">
        Loading Identity...
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 uppercase font-black bg-[#050505]">
        User Not Found
      </div>
    );
  }

  const { user } = profileData;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] pt-24 pb-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* 🔹 Left Side: Identity Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden flex flex-col items-center">
              {/* Cover Image */}
              <div className="h-32 w-full bg-gray-100 dark:bg-white/5 relative">
                <img
                  src={
                    getImageUrl(user.profile?.coverImage) ||
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000'
                  }
                  className="w-full h-full object-cover"
                  alt="cover"
                />
              </div>

              {/* Avatar & Basic Info */}
              <div className="p-8 -mt-16 flex flex-col items-center text-center w-full relative z-10">
                <div className="h-32 w-32 rounded-full border-[6px] border-white dark:border-[#050505] bg-white overflow-hidden shadow-2xl">
                  <img
                    src={getImageUrl(user.profile?.profileImage, 'avatar')}
                    className="w-full h-full object-cover"
                    alt="avatar"
                  />
                </div>

                <h2 className="mt-5 text-xl font-black dark:text-white uppercase tracking-tighter">
                  {user.profile?.displayName || `${user.firstName} ${user.lastName}`}
                </h2>
                <p className="text-orange-500 text-[10px] font-black tracking-[0.2em] uppercase mt-1">
                  @{user.username}
                </p>

                {/* Status Badges */}
                <div className="mt-8 w-full grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl text-[9px] font-black uppercase border border-gray-100 dark:border-white/10">
                    <p className="text-gray-400 mb-1 font-normal lowercase italic">Account Type</p>
                    <span className="dark:text-white">{user.role}</span>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl text-[9px] font-black uppercase border border-gray-100 dark:border-white/10">
                    <p className="text-gray-400 mb-1 font-normal lowercase italic">Identity</p>
                    <span className="text-green-500 tracking-widest italic">{user.status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats or Achievements Section */}
            <div className="p-6 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">
              <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-4 flex items-center gap-2">
                <FiActivity className="text-orange-500" /> Platform Activity
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold dark:text-gray-400 uppercase">
                    Total Listings
                  </span>
                  <span className="text-sm font-black dark:text-white">
                    {profileData.listingsCount || 0}
                  </span>
                </div>
                <div className="w-full h-0.5 bg-gray-100 dark:bg-white/10"></div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold dark:text-gray-400 uppercase">
                    Member Since
                  </span>
                  <span className="text-[11px] font-black dark:text-white uppercase">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 🔹 Right Side: Professional Details */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm overflow-hidden">
              <div className="px-10 py-8 border-b border-gray-100 dark:border-white/10 bg-white/50 dark:bg-white/5">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] dark:text-white">
                  Creator Dossier
                </h3>
              </div>

              <div className="p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 animate-in fade-in duration-700">
                  <InfoRow label="Location" value={user.profile?.country} icon={FiMapPin} />
                  <InfoRow label="Region / City" value={user.profile?.city} icon={FiMapPin} />
                  <InfoRow label="Primary Language" value={user.profile?.language} icon={Languages} />
                  <InfoRow
                    label="Website Link"
                    value={user.profile?.websiteLink}
                    icon={Globe}
                    isLink
                  />
                  <InfoRow
                    label="Social Network"
                    value={user.profile?.socialLink}
                    icon={FiLink}
                    isLink
                  />
                  <InfoRow
                    label="Total Listings"
                    value={`${profileData.listingsCount || 0} ITEMS`}
                    icon={FiLayers}
                  />

                  {/* Bio Section */}
                  <div className="md:col-span-2 mt-8 p-8 bg-gray-50 dark:bg-white/5 rounded-2xl border border-dashed border-gray-200 dark:border-white/10 relative">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <FiInfo className="text-orange-500" /> Biography / Mission
                    </p>
                    <p className="text-xs font-medium leading-relaxed italic dark:text-gray-300">
                      {user.profile?.bio || 'This creator has not provided a biography yet...'}
                    </p>
                  </div>
                </div>

                {/* Visual Accent */}
                <div className="mt-10 h-1 w-20 bg-orange-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🔹 Reusable Info Row Component
const InfoRow = ({ label, value, icon: Icon, isLink }) => (
  <div className="flex items-center justify-between py-5 border-b border-gray-100 dark:border-white/10 last:border-0 group transition-all hover:bg-gray-50/50 dark:hover:bg-white/2 px-2 rounded-lg">
    <div className="flex items-center gap-4">
      <div className="p-2.5 bg-gray-50 dark:bg-white/5 rounded-xl text-gray-400 group-hover:text-orange-500 transition-colors">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
          {label}
        </p>
        {isLink && value ? (
          <a
            href={value.startsWith('http') ? value : `https://${value}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-black text-orange-500 hover:underline"
          >
            Visit Link
          </a>
        ) : (
          <p className="text-sm font-semibold text-[#1f1f1f] dark:text-gray-200">
            {value || 'Not Disclosed'}
          </p>
        )}
      </div>
    </div>
  </div>
);
