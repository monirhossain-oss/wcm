"use client";

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Globe, Star } from 'lucide-react';
import { getImageUrl } from '@/lib/imageHelper';

export default function CreatorCard({ creator, index }) {
    const isFeatured = creator.campaign?.role === 'premium';

    const categoryName =
        typeof creator.profile?.category === 'object'
            ? creator.profile?.category?.name
            : null;

    const displayName =
        creator.profile?.displayName ||
        `${creator.firstName || ''} ${creator.lastName || ''}`.trim();

    const location = creator.profile?.city
        ? `${creator.profile.city}, ${creator.profile.country || ''}`
        : creator.profile?.country || 'World';

    // ওয়েবসাইট ইউআরএল ভ্যালিডেশন
    const websiteUrl = creator.profile?.website
        ? (creator.profile.website.startsWith('http') ? creator.profile.website : `https://${creator.profile.website}`)
        : null;

    return (
        <div
            className={`
        group relative flex flex-col rounded-[24px] overflow-hidden
        border transition-all duration-300 cursor-pointer
        hover:-translate-y-1 hover:shadow-2xl
        bg-white dark:bg-[#141414]
        ${isFeatured
                    ? 'border-orange-500/30 dark:border-orange-500/20 shadow-md shadow-orange-500/5'
                    : 'border-black/7 dark:border-white/6 shadow-sm'}
      `}
            style={{ animationDelay: `${index * 40}ms` }}
        >
            {/* Banner */}
            <div className={`relative h-20 overflow-hidden ${isFeatured
                ? 'bg-gradient-to-br from-[#7c2d12] to-[#c2410c]'
                : 'bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] dark:from-[#0a0a0a] dark:to-[#1a1a1a]'}`}
            >
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
                        backgroundSize: '12px 12px',
                    }}
                />
                {isFeatured && (
                    <>
                        <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-28 h-10 bg-orange-500/25 rounded-full blur-2xl" />
                        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-[8px] font-black uppercase tracking-[0.1em] px-2.5 py-1.5 rounded-full">
                            <Star size={8} fill="#fbbf24" className="text-amber-400" />
                            Featured
                        </div>
                    </>
                )}
            </div>

            {/* Body */}
            <div className="px-5 pb-5 flex flex-col items-center flex-1">
                {/* Avatar */}
                <div className="relative -mt-7 z-10">
                    <div className={`w-16 h-16 rounded-[18px] overflow-hidden bg-zinc-100 dark:bg-zinc-800
            border-[3px] shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:rounded-2xl
            ${isFeatured
                            ? 'border-orange-500/30 dark:border-orange-500/30 shadow-orange-500/15'
                            : 'border-white dark:border-[#141414]'}`}
                    >
                        <Image
                            src={getImageUrl(creator.profile?.profileImage, 'avatar') || '/default-avatar.png'}
                            alt={displayName}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-[2.5px] border-white dark:border-[#141414]" />
                </div>

                <h3 className="mt-3.5 font-black text-[15px] tracking-tight leading-tight text-center text-zinc-900 dark:text-white line-clamp-1">
                    {displayName}
                </h3>
                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.12em] mt-0.5">
                    @{creator.username || creator.firstName?.toLowerCase()}
                </p>
                <p className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.08em] mt-1.5">
                    <MapPin size={9} fill="currentColor" className="text-orange-500 flex-shrink-0" />
                    {location}
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 text-center leading-relaxed mt-3 line-clamp-2">
                    {creator.profile?.bio || 'Crafting stories through traditional artistry and heritage techniques.'}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap justify-center gap-1.5 mt-3.5">
                    {categoryName && (
                        <span className="text-[9px] font-bold uppercase tracking-[0.06em] text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-black/6 dark:border-white/8">
                            {categoryName}
                        </span>
                    )}
                    <span className="text-[9px] font-bold uppercase tracking-[0.06em] text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-white/5 px-2.5 py-1 rounded-lg border border-black/6 dark:border-white/8">
                        Handcrafted
                    </span>
                    {creator.profile?.country && (
                        <span className="text-[9px] font-bold uppercase tracking-[0.06em] text-orange-600/70 dark:text-orange-400/70 bg-orange-500/5 dark:bg-orange-500/8 px-2.5 py-1 rounded-lg border border-orange-500/15">
                            {creator.profile.country}
                        </span>
                    )}
                </div>

                <div className="w-full h-px bg-black/6 dark:bg-white/6 my-4" />

                {creator.listingCount !== undefined && (
                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.08em] mb-3">
                        {creator.listingCount} {creator.listingCount === 1 ? 'Listing' : 'Listings'}
                    </p>
                )}

                <div className="w-full flex flex-col gap-2">
                    <Link
                        href={`/profile/${creator._id}`}
                        className={`w-full text-[10px] font-black uppercase tracking-[0.12em] py-3.5 rounded-[14px] text-center
              transition-all duration-200 shadow-sm
              ${isFeatured
                                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20 hover:shadow-orange-500/30'
                                : 'bg-zinc-900 dark:bg-white hover:bg-orange-500 dark:hover:bg-orange-500 text-white dark:text-zinc-900 dark:hover:text-white shadow-black/10'}`}
                    >
                        View Creator
                    </Link>

                    {websiteUrl && (
                        <a
                            href={websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-1.5 bg-transparent text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-[0.1em] py-3 rounded-[14px] border border-black/8 dark:border-white/8 hover:bg-zinc-50 dark:hover:bg-white/5 hover:text-zinc-700 dark:hover:text-zinc-300 transition-all duration-200"
                        >
                            <Globe size={11} /> Website
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}