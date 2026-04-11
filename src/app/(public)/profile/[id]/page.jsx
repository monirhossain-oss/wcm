'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { FiMapPin, FiLink, FiArrowLeft, FiCheckCircle, FiExternalLink } from 'react-icons/fi';
import { getImageUrl } from '@/lib/imageHelper';
import { Globe, Languages, Box, MessageCircle, Info } from 'lucide-react';
import ListingCard from '@/components/ListingCard';
import Image from 'next/image';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000',
  withCredentials: true,
});

export default function PublicProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [profileData, setProfileData] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profileRes = await api.get(`/api/users/profile/${id}`);
        setProfileData(profileRes.data);
        const listingRes = await api.get(
          `/api/listings/public?creatorId=${profileRes.data?.user._id}`
        );
        setListings(listingRes.data.listings || listingRes.data || []);
      } catch (err) {
        console.error('Data Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);
  // console.log(listings)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0f0f0f]">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white dark:bg-[#0f0f0f]">
        <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Node Not Found</p>
        <button onClick={() => router.back()} className="text-orange-500 underline font-bold">
          Return
        </button>
      </div>
    );
  }

  const { user } = profileData;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f] text-[#222] dark:text-gray-200 font-sans selection:bg-orange-100 pb-20">
      {/* 🔹 Header Section */}
      <div className="relative h-[250px] md:h-[300px] w-full overflow-hidden">
        <Image
          src={
            getImageUrl(user.profile?.coverImage) ||
            'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000'
          }
          alt="cover"
          fill
          priority
          className="object-cover grayscale-[20%]"
          sizes="100vw"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Back Button */}
        <div className="absolute top-8 left-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-5 py-2.5 bg-black/20 backdrop-blur-xl border border-white/10 rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all"
          >
            <FiArrowLeft size={14} /> Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* 🔹 Identity Section */}
        <div className="relative -mt-24 flex flex-col md:flex-row items-start md:items-end gap-8 pb-12 border-b border-gray-100 dark:border-white/5">
          <div className="relative group">
            <div className="h-44 w-44 relative rounded-[2.5rem] border-[8px] border-white dark:border-[#0f0f0f] bg-gray-100 overflow-hidden shadow-2xl transition-all duration-500 group-hover:rounded-3xl">
              <Image
                src={getImageUrl(user.profile?.profileImage, 'avatar')}
                alt={user.profile?.displayName || 'avatar'}
                fill
                sizes="(max-width: 176px) 100vw, 176px"
                className="object-cover"
                priority
              />
            </div>
            {user.role === 'creator' && (
              <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white p-2.5 rounded-2xl shadow-xl border-4 border-white dark:border-[#0f0f0f]">
                <FiCheckCircle size={18} />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase dark:text-white leading-none">
                {user.profile?.displayName || `${user.firstName} ${user.lastName}`}
              </h1>
              <div className="px-3 py-1 bg-orange-500 text-white rounded-lg text-[9px] font-black uppercase tracking-widest">
                {user.role}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest">
              <span className="flex items-center gap-2">
                <FiMapPin className="text-orange-500" /> {user.profile?.city || 'Unknown'},{' '}
                {user.profile?.country || 'Earth'}
              </span>
              <span className="flex items-center gap-2">
                <Languages className="text-orange-500" size={14} />{' '}
                {user.profile?.language || 'Global'}
              </span>
              <span className="text-orange-500 italic lowercase">@{user.username}</span>
            </div>
          </div>
        </div>

        {/* 🔹 About & Links Section */}
        <div className="py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-gray-100 dark:border-white/5">
          <div className="lg:col-span-4 space-y-8">
            <div className="space-y-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-2">
                <FiLink className="text-orange-500" /> Creator Links
              </h3>
              <div className="grid gap-3">
                {user.profile?.websiteLink && (
                  <SocialLink
                    icon={Globe}
                    label="Official Website"
                    url={user.profile.websiteLink}
                  />
                )}
                {user.profile?.socialLink && (
                  <SocialLink
                    icon={FiExternalLink}
                    label="Portfolio/Social"
                    url={user.profile.socialLink}
                  />
                )}
                {!user.profile?.websiteLink && !user.profile?.socialLink && (
                  <p className="text-[10px] text-gray-400 italic font-bold">
                    No links shared by creator
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-2">
              <Info className="text-orange-500" size={14} /> Creator Biography
            </h3>
            <div className="p-8 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-gray-100 dark:border-white/5">
              <p className="text-sm md:text-base leading-relaxed font-medium text-gray-600 dark:text-gray-400 italic whitespace-pre-wrap">
                {user.profile?.bio ||
                  "This node's biography is currently encrypted or has not been initialized."}
              </p>
            </div>
          </div>
        </div>

        {/* 🔹 Work Showcase (4-Column Grid) */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-10 pb-6">
            <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">
              Work Showcase / {listings.length} Units
            </h3>
            <div className="flex items-center gap-3">
              <span className="px-4 py-1.5 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Active Listings
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings && listings.length > 0 ? (
              listings.map((item) => <ListingCard key={item._id} item={item} />)
            ) : (
              <div className="col-span-full py-24 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-[3rem] flex flex-col items-center justify-center text-gray-400">
                <Box size={48} strokeWidth={1} className="opacity-20 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                  No active listings found
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

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
      <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest mb-0.5">
        {label}
      </p>
      <p className="text-[11px] font-bold truncate dark:text-gray-200 group-hover:text-orange-500 transition-colors italic">
        {url}
      </p>
    </div>
  </a>
);
