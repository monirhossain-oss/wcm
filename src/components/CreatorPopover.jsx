'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { FaExternalLinkAlt, FaLayerGroup } from 'react-icons/fa';
import Image from 'next/image';
import { HiOutlineLocationMarker } from 'react-icons/hi';

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

const CreatorPopover = ({ creator, item, API_BASE_URL, creatorLocation }) => {
  const [listingCount, setListingCount] = useState(0);
  const [fullCreatorData, setFullCreatorData] = useState(null);
  const creatorName = creator?.username || 'Anonymous';

  useEffect(() => {
    const fetchCreatorData = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/users/profile/${creator?._id}`
        );
        setListingCount(res.data.listingsCount || 0);
        setFullCreatorData(res.data.user);
      } catch (err) {
        console.error('Popover fetch error:', err);
        setListingCount(0);
      }
    };
    if (creator?._id) fetchCreatorData();
  }, [creator?._id, API_BASE_URL]);

  const avatarSrc =
    getImageUrl(fullCreatorData?.profile?.profileImage || creator?.profile?.profileImage) ||
    'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  const coverSrc =
    getImageUrl(fullCreatorData?.profile?.coverImage || creator?.profile?.coverImage) ||
    'https://placehold.co/600x200/27272a/white?text=No+Cover';

  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-5 w-72 sm:w-64 xs:w-56 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-xl z-[999] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">

      {/* Cover */}
      <div className="relative h-24 w-full">
        <Image
          src={coverSrc}
          alt="Cover"
          fill
          sizes="288px"
          className="object-cover"
        />

        {/* Avatar */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border-4 border-white dark:border-zinc-900 overflow-hidden bg-white">
          <Image
            src={avatarSrc}
            alt={creatorName}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="pt-10 pb-5 px-5 flex flex-col items-center justify-center gap-3 text-center">

        {/* Name & Location */}
        <div className="flex flex-col items-center justify-center gap-1">
          <h4 className="text-sm sm:text-base font-black dark:text-white uppercase tracking-tight">
            {creatorName}
          </h4>
          <div className="flex items-center justify-center gap-1 text-black dark:text-gray-400 font-bold uppercase tracking-wide text-[9px] sm:text-[10px]">
            <HiOutlineLocationMarker className="text-[10px] sm:text-[12px]" />
            <span>{creatorLocation || fullCreatorData?.profile?.location || 'Global'}</span>
          </div>
        </div>

        {/* Listings */}
        <div className="flex items-center justify-center gap-2 text-[11px] sm:text-[12px] font-bold text-gray-600 dark:text-gray-300">
          <FaLayerGroup size={12} className="text-orange-500" />
          <span>{listingCount} Listings</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-2 w-full mt-2">
          <Link
            href={`/profile/${creator?._id}`}
            className="w-full py-1.5 bg-orange-500 hover:bg-orange-600 text-gray-900 dark:text-white text-[9px] sm:text-[10px] font-black uppercase rounded-full text-center flex items-center justify-center gap-2"
          >
            Profile
          </Link>

          {item?.websiteLink && (
            <a
              href={item.websiteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-1.5 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white text-[9px] sm:text-[10px] font-black uppercase rounded-full text-center flex items-center justify-center gap-2"
            >
              Website <FaExternalLinkAlt size={10} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorPopover;