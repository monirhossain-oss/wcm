'use client';
import React, { useState, useRef } from 'react';
import {
  FaHeart,
  FaEye,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaGlobe,
  FaLink,
  FaTwitter,
} from 'react-icons/fa';
import { GiGlobe } from 'react-icons/gi';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import CreatorPopover from './CreatorPopover';

// ইউআরএল দেখে আইকন রিটার্ন করার ফাংশন
const getSocialIcon = (url) => {
  if (url.includes('facebook.com')) return <FaFacebook className="hover:text-[#1877F2]" />;
  if (url.includes('instagram.com')) return <FaInstagram className="hover:text-[#E4405F]" />;
  if (url.includes('youtube.com')) return <FaYoutube className="hover:text-[#FF0000]" />;
  if (url.includes('twitter.com') || url.includes('x.com'))
    return <FaTwitter className="hover:text-[#1DA1F2]" />;
  return <FaLink className="hover:text-orange-500" />; // অন্য সব লিঙ্কের জন্য
};

const getImageUrl = (path, type = 'post') => {
  if (!path) return type === 'avatar' ? '/default-avatar.png' : '/fallback-image.png';
  if (path.startsWith('http')) return path;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

const ListingCard = ({ item: initialItem }) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  const { user } = useAuth();
  const [item, setItem] = useState(initialItem);
  const [showCreator, setShowCreator] = useState(false);
  const timeoutRef = useRef(null);

  if (!item) return null;

  const isLiked = item.isFavorited || false;
  const creator = item.creatorId;
  const creatorName = creator?.username || 'Anonymous';
  const creatorLocation = item.country || creator?.profile?.country || 'Global';
  const tradition = item.tradition || 'Heritage';

  // --- আগের হ্যান্ডেলার ফাংশনগুলো এখানে থাকবে ---
  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login');
      return;
    }
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/listings/favorite/${item._id}`,
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        setItem((prev) => ({
          ...prev,
          isFavorited: res.data.isFavorited,
          favoritesCount: res.data.favoritesCount,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={`group relative flex flex-col bg-transparent rounded-xl transition-all duration-300 ${showCreator ? 'z-110' : 'z-auto'} hover:z-110`}
    >
      {/* Image Container (Design Same) */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-white/5 rounded-xl">
        <Link
          href={`/listings/${item._id}`}
          className="w-full h-full flex items-center justify-center"
        >
          <img
            src={getImageUrl(item.image, 'post')}
            alt={item.title}
            className="w-full h-full object-contain transition-transform duration-700"
          />
        </Link>
        {item.isPromoted && (
          <div className="absolute top-1.5 left-1.5 z-10">
            <div className="bg-orange-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-tighter">
              Featured
            </div>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="pt-4">
        <div className="flex flex-col gap-1">
          {/* Title Row */}
          <div className="flex justify-between items-start gap-3">
            <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate hover:text-orange-500 leading-tight flex-1">
              <Link href={`/listings/${item._id}`}>{item.title}</Link>
            </h3>
            <div className="flex items-center gap-2 shrink-0 pt-0.5">
              <button
                onClick={handleToggleFavorite}
                className={`flex items-center gap-0.5 text-[10px] sm:text-[12px] ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
              >
                <FaHeart size={10} />
                <span>{item.favoritesCount || 0}</span>
              </button>
              <div className="flex items-center gap-0.5 text-gray-400 text-[10px] sm:text-[12px]">
                <FaEye size={10} className="text-blue-400" />
                <span>{item.views || 0}</span>
              </div>
            </div>
          </div>

          {/* Creator Name & External Links Section */}
          <div className="flex items-center justify-between mt-1">
            <div
              className="relative"
              onMouseEnter={() => setShowCreator(true)}
              onMouseLeave={() => setShowCreator(false)}
            >
              <button className="text-sm md:text-base font-bold text-gray-700 dark:text-gray-300 hover:text-orange-500">
                @{creatorName}
              </button>
              {showCreator && (
                <div className="z-120 absolute">
                  <CreatorPopover
                    creator={creator}
                    item={item}
                    API_BASE_URL={API_BASE_URL}
                    creatorLocation={creatorLocation}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Location & Tradition Row */}
          <div className="flex items-center justify-between gap-1 mt-1  text-gray-500 dark:text-gray-400 font-medium pt-1.5">
            <span className="flex items-center gap-1 italic text-[10px] sm:text-[12px]">
              <GiGlobe size={9} className="text-blue-500" />
              {tradition}
            </span>
            <div className="flex items-center gap-2 text-gray-400 dark:text-zinc-500 text-[13px] md:text-lg">
              {item.externalUrls &&
                item.externalUrls.slice(0, 3).map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-200"
                  >
                    {getSocialIcon(url)}
                  </a>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
