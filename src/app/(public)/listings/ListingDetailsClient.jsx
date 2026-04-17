'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    FiArrowLeft, FiExternalLink, FiMapPin,
    FiLayers, FiShield, FiTag, FiLink
} from 'react-icons/fi';
import {
    FaHeart, FaRegHeart, FaEye, FaSpinner,
    FaFacebook, FaInstagram, FaYoutube,
    FaTwitter, FaLinkedin
} from 'react-icons/fa';
import Image from 'next/image';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import ListingCard from '@/components/ListingCard';

export default function ListingDetailsClient({ initialProduct, initialRelated }) {
    // console.log("Creator Data:", initialProduct?.creatorId);
    const { user } = useAuth();
    const router = useRouter();

    // সার্ভার থেকে আসা ডাটা দিয়ে স্টেট ম্যানেজমেন্ট
    const [product, setProduct] = useState(initialProduct);
    const [isFavorited, setIsFavorited] = useState(false);
    const [favCount, setFavCount] = useState(initialProduct.favorites?.length || 0);
    const [clickLoading, setClickLoading] = useState(false);
    const [externalClickLoading, setExternalClickLoading] = useState(null);

    const isProcessing = useRef(false);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

    // ক্লায়েন্ট সাইড লজিক: ডিভাইস আইডি এবং ফেভারিট স্ট্যাটাস চেক
    useEffect(() => {
        const initClientSession = async () => {
            try {
                const FingerprintJS = (await import('@fingerprintjs/fingerprintjs')).default;
                const fp = await FingerprintJS.load();
                const result = await fp.get();
                const deviceId = result.visitorId;

                // ভিউ কাউন্ট আপডেট করার জন্য এপিআই কল (সাইলেন্টলি)
                const res = await axios.get(`${API_BASE_URL}/api/listings/${initialProduct._id}?deviceId=${deviceId}`, {
                    withCredentials: true,
                });

                if (res.data.views) {
                    setProduct(prev => ({ ...prev, views: res.data.views }));
                }

                // ইউজার লগইন থাকলে ফেভারিট চেক
                if (user && initialProduct.favorites) {
                    setIsFavorited(
                        initialProduct.favorites.some(
                            (fav) => (typeof fav === 'string' ? fav : fav._id) === user._id
                        )
                    );
                }
            } catch (err) {
                console.error('Client Init Error:', err);
            }
        };

        initClientSession();
    }, [user, initialProduct, API_BASE_URL]);

    const handleToggleFavorite = async () => {
        if (!user) return alert('Please login!');
        if (isProcessing.current) return;
        try {
            isProcessing.current = true;
            const res = await axios.post(
                `${API_BASE_URL}/api/listings/favorite/${product._id}`,
                {},
                { withCredentials: true }
            );
            setIsFavorited(res.data.isFavorited);
            setFavCount(res.data.favoritesCount);
        } finally {
            isProcessing.current = false;
        }
    };

    const handleVisitSite = async (url, isExternal = false, index = null) => {
        if (!url || isProcessing.current) return;
        isProcessing.current = true;

        if (isExternal) setExternalClickLoading(index);
        else setClickLoading(true);

        try {
            const FingerprintJS = (await import('@fingerprintjs/fingerprintjs')).default;
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            const deviceId = result.visitorId;

            await axios.post(
                `${API_BASE_URL}/api/listings/${product._id}/click`,
                { deviceId },
                { withCredentials: true }
            );

            window.open(url, '_blank', 'noopener,noreferrer');
        } catch (err) {
            window.open(url, '_blank', 'noopener,noreferrer');
        } finally {
            setClickLoading(false);
            setExternalClickLoading(null);
            setTimeout(() => { isProcessing.current = false; }, 500);
        }
    };

    const getSocialIcon = (url) => {
        if (url.includes('facebook')) return <FaFacebook className="text-[#1877F2]" />;
        if (url.includes('instagram')) return <FaInstagram className="text-[#E4405F]" />;
        if (url.includes('youtube')) return <FaYoutube className="text-[#FF0000]" />;
        if (url.includes('twitter') || url.includes('x.com')) return <FaTwitter className="text-[#1DA1F2]" />;
        if (url.includes('linkedin')) return <FaLinkedin className="text-[#0A66C2]" />;
        return <FiLink className="text-[#F57C00]" />;
    };

    const imageUrl = product.image?.startsWith('http')
        ? product.image
        : `${API_BASE_URL}/${product.image}`;

    return (
        <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#050505]">

            {/* ── TOP NAV BAR ── */}
            <div className="sticky top-20 z-40 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-4 md:px-8 h-12 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-400 hover:text-[#F57C00] transition-colors group"
                    >
                        <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em]">Back</span>
                    </button>

                    <div className="hidden md:flex items-center gap-2 text-[11px] text-gray-400">
                        <span className="hover:text-[#F57C00] cursor-pointer transition-colors">Explore</span>
                        <span className="opacity-30">/</span>
                        <span className="text-[#F57C00] font-semibold truncate max-w-[200px]">{product.title}</span>
                    </div>

                    <button
                        onClick={handleToggleFavorite}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all
              ${isFavorited
                                ? 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-500'
                                : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-500 hover:border-[#F57C00] hover:text-[#F57C00]'
                            }`}
                    >
                        {isFavorited ? <FaHeart className="w-3 h-3" /> : <FaRegHeart className="w-3 h-3" />}
                        {isFavorited ? 'Saved' : 'Save'}
                        {favCount > 0 && <span className="opacity-60">· {favCount}</span>}
                    </button>
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14 items-start">

                    {/* ── LEFT: IMAGE ── */}
                    <div className="lg:col-span-5 xl:col-span-5">
                        <div className="sticky top-36">
                            <div className="relative w-full overflow-hidden bg-gray-100 dark:bg-white/5 shadow-xl border border-gray-100 dark:border-white/5 group"
                                style={{ aspectRatio: '4 / 5' }}
                            >
                                <Image
                                    src={imageUrl}
                                    alt={product.title}
                                    fill
                                    unoptimized
                                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                />
                                {product.isPromoted && (
                                    <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#F57C00] px-3 py-1.5 rounded-full text-[9px] font-black text-white uppercase tracking-widest shadow-lg">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                        Top Ranked
                                    </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                                    <div className="flex items-center gap-4 text-white">
                                        <div className="flex items-center gap-1.5 text-[11px] font-bold">
                                            <FaEye className="w-3 h-3 opacity-80" />
                                            <span>{product.views || 0} views</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-3">
                                <div className="flex items-center gap-3 bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/8 rounded-xl px-4 py-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#F57C00]/10 flex items-center justify-center">
                                        <FiShield className="w-4 h-4 text-[#F57C00]" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Tradition</p>
                                        <p className="text-[12px] font-bold text-gray-800 dark:text-white truncate">{product.tradition || '—'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/8 rounded-xl px-4 py-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#F57C00]/10 flex items-center justify-center">
                                        <FiMapPin className="w-4 h-4 text-[#F57C00]" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Country</p>
                                        <p className="text-[12px] font-bold text-gray-800 dark:text-white truncate">{product.country || '—'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: DETAILS ── */}
                    <div className="lg:col-span-7 xl:col-span-7 space-y-7">
                        <div className="flex flex-wrap items-center gap-2">
                            {product.country && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F57C00]/10 text-[#F57C00] text-[10px] font-black uppercase tracking-wider rounded-full">
                                    <FiMapPin className="w-3 h-3" /> {product.country}
                                </span>
                            )}
                            {product.category?.title && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-wider rounded-full">
                                    <FiLayers className="w-3 h-3" /> {product.category.title}
                                </span>
                            )}
                        </div>

                        <div>
                            <h1 className="text-[36px] md:text-[44px] font-black text-gray-900 dark:text-white leading-[1.05] tracking-tight mb-3">
                                {product.title}
                            </h1>
                            {product.creatorId?.username && (
                                <Link
                                    href={`/profile/${product.creatorId.username}`} // ID-র বদলে username ব্যবহার করা হলো
                                    className="inline-flex items-center gap-2 group"
                                >
                                    <div className="w-5 h-5 rounded-full bg-[#F57C00] flex items-center justify-center text-white text-[8px] font-black">
                                        {product.creatorId.username[0].toUpperCase()}
                                    </div>
                                    <span className="text-[12px] font-semibold text-gray-400 group-hover:text-[#F57C00] transition-colors">
                                        by @{product.creatorId.username}
                                    </span>
                                </Link>
                            )}{product.creatorId?.username && (
                                <Link href={`/profile/${product.creatorId._id}`} className="inline-flex items-center gap-2 group">
                                    <div className="w-5 h-5 rounded-full bg-[#F57C00] flex items-center justify-center text-white text-[8px] font-black">
                                        {product.creatorId.username[0].toUpperCase()}
                                    </div>
                                    <span className="text-[12px] font-semibold text-gray-400 group-hover:text-[#F57C00] transition-colors">
                                        by @{product.creatorId.username}
                                    </span>
                                </Link>
                            )}
                        </div>

                        <div className="border-t border-dashed border-gray-200 dark:border-white/8" />

                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-3">About</p>
                            <p className="text-[15px] leading-[1.8] text-gray-600 dark:text-gray-400">{product.description}</p>
                        </div>

                        {product.culturalTags?.length > 0 && (
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-3">Key Features</p>
                                <div className="flex flex-wrap gap-2">
                                    {product.culturalTags.map((tag, idx) => (
                                        <span key={tag._id || idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/8 rounded-lg text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400 transition-all">
                                            <FiTag className="w-3 h-3 text-[#F57C00]" /> {tag.title || tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.externalUrls?.length > 0 && (
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-3">Follow on Social</p>
                                <div className="flex items-center gap-2">
                                    {product.externalUrls.map((url, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleVisitSite(url, true, idx)}
                                            disabled={externalClickLoading !== null}
                                            className="w-10 h-10 rounded-xl bg-white dark:bg-white/[0.04] border border-gray-100 dark:border-white/8 flex items-center justify-center text-lg hover:scale-110 transition-all disabled:opacity-40"
                                        >
                                            {externalClickLoading === idx ? <FaSpinner className="animate-spin text-sm" /> : getSocialIcon(url)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="border-t border-dashed border-gray-200 dark:border-white/8" />

                        <div className="space-y-3">
                            <button
                                onClick={() => handleVisitSite(product.websiteLink)}
                                disabled={clickLoading || !product.websiteLink}
                                className="group w-full py-4 rounded-xl font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 transition-all bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-[#F57C00] dark:hover:bg-[#F57C00] dark:hover:text-white disabled:opacity-30"
                            >
                                {clickLoading ? <FaSpinner className="animate-spin" /> : <>Visit Creator Website <FiExternalLink className="w-4 h-4" /></>}
                            </button>

                            <button
                                onClick={handleToggleFavorite}
                                className={`w-full py-3.5 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 transition-all border
                  ${isFavorited ? 'bg-red-50 text-red-500 border-red-200' : 'bg-white text-gray-500 border-gray-200 hover:border-[#F57C00] hover:text-[#F57C00]'}`}
                            >
                                {isFavorited ? <FaHeart className="w-3.5 h-3.5" /> : <FaRegHeart className="w-3.5 h-3.5" />}
                                {isFavorited ? 'Saved to Favorites' : 'Save to Favorites'}
                                {favCount > 0 && <span className="opacity-50 font-normal">· {favCount}</span>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── RELATED LISTINGS ── */}
                {initialRelated.length > 0 && (
                    <div className="mt-20 pt-12 border-t border-gray-100 dark:border-white/5">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F57C00] mb-2">You might also like</p>
                                <h2 className="text-[28px] md:text-[34px] font-black text-gray-900 dark:text-white">More from <span className="text-[#F57C00]">@{product.creatorId?.username}</span></h2>
                            </div>
                            <Link href={`/profile/${product.creatorId?.username}`} className="hidden md:inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#F57C00]">
                                View all <FiExternalLink className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {initialRelated.map((item) => <ListingCard key={item._id} item={item} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}