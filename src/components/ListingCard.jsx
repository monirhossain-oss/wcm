'use client';
import React, { useState, useRef } from 'react';
import { FaHeart, FaEye, FaMapMarkerAlt } from 'react-icons/fa';
import { GiGlobe } from 'react-icons/gi';
import Link from 'next/link';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import CreatorPopover from './CreatorPopover';

const getImageUrl = (path, type = 'post') => {
  if (!path) {
    return type === 'avatar' ? '/default-avatar.png' : '/fallback-image.png';
  }
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

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to favorite listings');
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
      console.error('Favorite Toggle Error:', err);
    }
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowCreator(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowCreator(false);
    }, 200);
  };

  return (
    <div
      className={`group relative flex flex-col bg-transparent dark:bg-transparent rounded-xl transition-all duration-300 ${showCreator ? 'z-110' : 'z-auto'} hover:z-110`}
    >
      {/* Image Container */}
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
            <div className="bg-orange-500 text-white text-[7px] sm:text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase tracking-tighter shadow-lg">
              Featured
            </div>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="pt-4">
        <div className="flex flex-col gap-1">
          {/* Title and Stats Row */}
          <div className="flex justify-between items-start gap-3">
            <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate hover:text-orange-500 transition-colors leading-tight flex-1">
              <Link href={`/listings/${item._id}`}>{item.title}</Link>
            </h3>

            <div className="flex items-center gap-2 shrink-0 pt-0.5">
              <button
                onClick={handleToggleFavorite}
                className={`flex items-center gap-0.5 text-[10px] sm:text-[12px] transition-all duration-200 hover:scale-110 cursor-pointer ${
                  isLiked ? 'text-red-500 font-bold' : 'text-gray-400 hover:text-red-400'
                }`}
              >
                <FaHeart size={10} className={isLiked ? 'fill-current animate-bounce-short' : ''} />
                <span>{item.favoritesCount || 0}</span>
              </button>

              <div className="flex items-center gap-0.5 text-gray-400 text-[10px] sm:text-[12px]">
                <FaEye size={10} className="text-blue-400" />
                <span>{item.views || 0}</span>
              </div>
            </div>
          </div>

          {/* Creator Name */}
          <div
            className="relative inline-block w-fit"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => {
              if (window.innerWidth < 768) {
                setShowCreator(!showCreator);
              }
            }}
          >
            <button className="text-[12px] sm:text-[12px] font-bold text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-all">
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

          {/* Location & Tradition Row */}
          <div className="flex items-center justify-between gap-1 mt-0.5 text-[10px] sm:text-[12px] text-gray-500 dark:text-gray-400 font-medium border-t border-gray-50 dark:border-white/2 pt-1.5">
            <span className="flex items-center gap-1 truncate">
              <FaMapMarkerAlt size={8} className="text-orange-500 shrink-0" />
              <span className="truncate">{creatorLocation}</span>
            </span>
            <span className="flex items-center gap-1 italic shrink-0">
              <GiGlobe size={9} className="text-blue-500" />
              {tradition}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
