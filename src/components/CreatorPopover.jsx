'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { FaExternalLinkAlt, FaLayerGroup } from 'react-icons/fa';

const getImageUrl = (path, type = 'post') => {
  if (!path) {
    return type === 'avatar'
      ? 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
      : 'https://placehold.co/600x200/27272a/white?text=No+Cover';
  }
  if (path.startsWith('http')) return path;

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

const CreatorPopover = ({ creator, item, API_BASE_URL, creatorLocation }) => {
  const [listingCount, setListingCount] = useState(0);
  const [fullCreatorData, setFullCreatorData] = useState(null); 

  const creatorName = creator?.username || 'Anonymous';
  const avatarImage = fullCreatorData?.profile?.profileImage || creator?.profile?.profileImage;
  const coverImage = fullCreatorData?.profile?.coverImage || creator?.profile?.coverImage;

  useEffect(() => {
    const fetchCreatorData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/users/profile/${creator._id}`);
        setListingCount(res.data.listingsCount || 0);
        setFullCreatorData(res.data.user);
      } catch (err) {
        console.error('Popover fetch error:', err);
        setListingCount(0);
      }
    };
    if (creator?._id) fetchCreatorData();
  }, [creator?._id, API_BASE_URL]);

  return (
    <div className="absolute bottom-full left-0 md:left-3 mb-5 w-50 md:w-72 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] z-999 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-auto">
      <div className="h-20 w-full bg-zinc-200 dark:bg-zinc-800 relative">
        <img
          src={getImageUrl(coverImage, 'cover')}
          className="w-full h-full object-cover"
          alt=""
          onError={(e) => {
            e.target.src = 'https://placehold.co/600x200/27272a/white?text=No+Cover';
          }}
        />
        <div className="absolute -bottom-6 left-5">
          <div className="w-14 h-14 rounded-full border-4 border-white dark:border-zinc-900 overflow-hidden bg-white">
            <img
              src={getImageUrl(avatarImage, 'avatar')}
              className="w-full h-full object-cover"
              alt={creatorName}
              onError={(e) => {
                e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
              }}
            />
          </div>
        </div>
      </div>

      <div className="pt-8 pb-4 px-5 flex flex-col items-start text-left gap-3">
        <div>
          <h4 className="text-[14px] font-black dark:text-white uppercase tracking-tighter">
            @{creatorName}
          </h4>
          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
            {creatorLocation || fullCreatorData?.profile?.location || 'Global'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300">
            <FaLayerGroup size={12} className="text-orange-500" />
            <span>{listingCount} Listings</span>
          </div>
        </div>

        <div className="flex flex-col w-full gap-2 mt-1">
          <Link
            href={`/profile/${creator?._id}`}
            className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-black uppercase rounded-full transition-all text-center tracking-widest"
          >
            View Profile
          </Link>
          {item.websiteLink && (
            <a
              href={item.websiteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-1.5 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white text-[9px] font-black uppercase rounded-full text-center flex items-center justify-center gap-2"
            >
              Website <FaExternalLinkAlt size={8} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorPopover;
