'use client';
import React from 'react';
import Link from 'next/link';
import { FaExternalLinkAlt, FaLayerGroup } from 'react-icons/fa';
import Image from 'next/image';
import { HiOutlineLocationMarker } from 'react-icons/hi';

const CreatorPopover = ({ creator, item, creatorLocation }) => {
  const creatorName = creator?.profile.displayName || 'Anonymous';
  const listingCount = item?.creatorStats.totalApprovedListings || 0;

  const avatarSrc = creator?.profile?.profileImage || '/default-avatar.png';
  const coverSrc = creator?.profile?.coverImage || 'https://placehold.co/600x200/27272a/white?text=No+Cover';

  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-5 w-72 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-xl z-[999] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">

      {/* Cover & Avatar */}
      <div className="relative h-20 w-full bg-zinc-800">
        <Image src={coverSrc} alt="Cover" fill className="object-cover opacity-70" />
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border-4 border-white dark:border-zinc-900 overflow-hidden bg-white">
          <Image src={avatarSrc} alt={creatorName} fill className="object-cover" />
        </div>
      </div>

      <div className="pt-8 pb-5 px-5 flex flex-col items-center gap-2">
        {/* Name & Location */}
        <h4 className="text-sm font-black dark:text-white uppercase tracking-tight">{creatorName}</h4>
        <div className="flex items-center gap-1 text-gray-500 text-[10px] uppercase font-bold">
          <HiOutlineLocationMarker />
          <span>{creatorLocation || creator?.profile?.city || 'Global'}</span>
        </div>

        {/* Listing Count */}
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 dark:text-zinc-300 py-1">
          <FaLayerGroup className="text-orange-500" />
          <span>{listingCount} Listings</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-2 w-full mt-2">
          <Link
            href={`/profile/${creator?.username || creator?.id}`}
            className="w-full py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-black uppercase rounded-full text-center transition-colors"
          >
            Profile
          </Link>

          {item?.websiteLink && (
            <a href={item.websiteLink} target="_blank" rel="noopener noreferrer" className="w-full py-1.5 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white text-[10px] font-black uppercase rounded-full text-center flex items-center justify-center gap-2">
              Website <FaExternalLinkAlt size={10} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorPopover;