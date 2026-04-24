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

    const websiteUrl = creator.profile?.website
        ? (creator.profile.website.startsWith('http') ? creator.profile.website : `https://${creator.profile.website}`)
        : null;

    return (
        <div
            className={`
                group relative flex flex-col rounded-[24px] overflow-hidden
                border transition-all duration-300 cursor-pointer
                hover:-translate-y-1 hover:shadow-2xl h-full
                bg-white dark:bg-[#141414]
                ${isFeatured
                    ? 'border-orange-500/30 dark:border-orange-500/20 shadow-md shadow-orange-500/5'
                    : 'border-black/7 dark:border-white/6 shadow-sm'}
            `}
            style={{ animationDelay: `${index * 40}ms` }}
        >
            {/* 1. Banner (Diagonal Pattern) */}
            <div className={`relative h-24 overflow-hidden flex-shrink-0 ${isFeatured
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
                    <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-[8px] font-black uppercase tracking-[0.1em] px-2.5 py-1.5 rounded-full">
                        <Star size={8} fill="#fbbf24" className="text-amber-400" />
                        Featured
                    </div>
                )}
            </div>

            {/* Body Container */}
            <div className="px-5 pb-5 flex flex-col items-center flex-1">

                {/* 2. Avatar with Status Dot */}
                <div className="relative -mt-8 z-10 flex-shrink-0">
                    <div className={`w-20 h-20 rounded-[20px] overflow-hidden bg-zinc-100 dark:bg-zinc-800
                        border-[4px] shadow-xl transition-transform duration-300 group-hover:scale-105
                        ${isFeatured ? 'border-orange-500/30' : 'border-white dark:border-[#141414]'}`}
                    >
                        <Image
                            src={getImageUrl(creator.profile?.profileImage, 'avatar') || '/default-avatar.png'}
                            alt={displayName}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-green-500 border-[3px] border-white dark:border-[#141414] shadow-sm" />
                </div>

                {/* 3. Display Name */}
                <h3 className="mt-4 font-black text-lg tracking-tight leading-tight text-center text-zinc-900 dark:text-white line-clamp-1">
                    {displayName}
                </h3>

                {/* 4. Username/Handle */}
                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.15em] mt-1">
                    @{creator.username || creator.firstName?.toLowerCase()}
                </p>

                {/* 5. Location (Managed height for alignment) */}
                <div className="mt-3 min-h-[34px] flex items-start justify-center px-2">
                    <p className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.1em] text-center line-clamp-2 leading-tight">
                        <MapPin size={10} fill="currentColor" className="text-orange-500 flex-shrink-0" />
                        {location}
                    </p>
                </div>

                {/* 6. Bio/Description */}
                <p className="text-[12px] text-zinc-500 dark:text-zinc-400 text-center leading-relaxed mt-4 line-clamp-2 min-h-[36px]">
                    {creator.profile?.bio || 'Crafting stories through traditional artistry and heritage techniques.'}
                </p>

                {/* 7. Tags (Categories/Country) */}
                <div className="flex flex-wrap justify-center gap-2 mt-5">
                    <span className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-zinc-500 dark:text-zinc-300 bg-zinc-100 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-black/5 dark:border-white/10">
                        Handcrafted
                    </span>
                    {creator.profile?.country && (
                        <span className="text-[9px] font-extrabold uppercase tracking-[0.1em] text-orange-600 dark:text-orange-400 bg-orange-500/10 dark:bg-orange-500/10 px-3 py-1.5 rounded-lg border border-orange-500/20">
                            {creator.profile.country}
                        </span>
                    )}
                </div>

                {/* Divider Line */}
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent my-6 flex-shrink-0" />

                {/* 8. Action Buttons (Pushed to bottom) */}
                <div className="mt-auto w-full flex flex-col gap-3">
                    <Link
                        href={`/profile/${creator.username || creator.id}`}
                        className={`w-full text-[11px] font-black uppercase tracking-[0.2em] py-4 rounded-[16px] text-center
                            transition-all duration-300 shadow-sm
                            ${isFeatured
                                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/25'
                                : 'bg-zinc-900 dark:bg-white hover:bg-orange-500 dark:hover:bg-orange-500 text-white dark:text-zinc-900 dark:hover:text-white shadow-lg'}`}
                    >
                        View Creator
                    </Link>

                    {websiteUrl && (
                        <a
                            href={websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 bg-transparent text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-[0.15em] py-3 rounded-[16px] border border-black/10 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5 transition-all"
                        >
                            <Globe size={12} /> Website
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}