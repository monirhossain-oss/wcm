'use client';
import React, { useState } from 'react';
import {
  FaHeart,
  FaEye,
  FaRegHeart,
} from 'react-icons/fa';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import Link from 'next/link';
import axios from 'axios';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import CreatorPopover from './CreatorPopover';

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

const ListingCard = ({ item: initialItem }) => {
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

  const { user } = useAuth();
  const [item, setItem] = useState(initialItem);
  const [showCreator, setShowCreator] = useState(false);

  if (!item) return null;

  const isLiked = item.isFavorited || false;
  const creator = item.creatorId;
  const creatorName = creator?.username || 'Anonymous';
  const tradition = item.tradition || 'Heritage';
  const region = item.region || 'Global';

  const postImageSrc =
    getImageUrl(item.image) ||
    'https://placehold.co/600x600/27272a/white?text=No+Image';

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

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
    <div className="group relative flex flex-col w-full transition-all duration-300">

      {/* IMAGE SECTION */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 dark:bg-zinc-900">

        <Link
          href={`/listings/${item._id}`}
          className="block w-full h-full relative"
        >
          <Image
            src={postImageSrc}
            alt={item.title || 'Listing Image'}
            fill
            sizes="(max-width:768px) 50vw, (max-width:1200px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300" />

          {/* TITLE ON IMAGE (Hover Show) */}
          <div className="absolute bottom-0 left-0 w-full p-4 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <h3 className="text-white font-semibold text-sm sm:text-base md:text-lg leading-snug line-clamp-2">
              {item.title}
            </h3>
          </div>
        </Link>

        {/* HEART BUTTON */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 z-20 p-2 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 active:scale-95"
        >
          {isLiked ? (
            <FaHeart className="text-red-500 text-base sm:text-lg" />
          ) : (
            <FaRegHeart className="text-gray-900 dark:text-white text-base sm:text-lg" />
          )}
        </button>

        {/* FEATURED BADGE */}
        {item.isPromoted && (
          <div className="absolute top-3 left-3 z-20">
            <span className="bg-orange-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-md shadow-md">
              FEATURED
            </span>
          </div>
        )}
      </div>

      {/* INFO SECTION */}
      <div className="mt-3 flex flex-col gap-2 px-1">

        {/* CREATOR & VIEWS */}
        <div className="flex justify-between items-center">

          <div
            className="relative"
            onMouseEnter={() => setShowCreator(true)}
            onMouseLeave={() => setShowCreator(false)}
          >
            <button className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors">
              {creatorName}
            </button>

            {showCreator && (
              <div className="absolute z-[100] bottom-full mb-3 left-0">
                <CreatorPopover
                  creator={creator}
                  item={item}
                  API_BASE_URL={API_BASE_URL}
                  creatorLocation={region}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs font-semibold">
            <FaEye className="text-blue-500" />
            <span>{item.views || 0}</span>
          </div>
        </div>

        {/* TAG & REGION */}
        <div className="pt-2 border-t border-gray-100 dark:border-white/5">
          <div className="flex items-center justify-between">

            <div className="text-[10px] sm:text-[11px] font-bold text-orange-600 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded">
              {tradition}
            </div>

            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-500 font-medium">
              <HiOutlineLocationMarker className="text-sm" />
              {region}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ListingCard;