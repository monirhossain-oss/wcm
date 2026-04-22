'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiArrowLeft, FiExternalLink, FiMapPin, FiLayers, FiShield, FiTag, FiLink } from 'react-icons/fi';
import { FaHeart, FaRegHeart, FaEye, FaSpinner, FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaLinkedin } from 'react-icons/fa';
import Image from 'next/image';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import ListingCard from '@/components/ListingCard';

// ── Module-level constants & helpers (component বাইরে — re-render এ নতুন তৈরি হয় না) ──

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const getDeviceId = async () => {
    const FingerprintJS = (await import('@fingerprintjs/fingerprintjs')).default;
    const fp = await FingerprintJS.load();
    const { visitorId } = await fp.get();
    return visitorId;
};

const resolveImageUrl = (image) =>
    image?.startsWith('http') ? image : `${API_BASE_URL}/${image}`;

const getSocialIcon = (url) => {
    if (url.includes('facebook')) return <FaFacebook className="text-[#1877F2]" />;
    if (url.includes('instagram')) return <FaInstagram className="text-[#E4405F]" />;
    if (url.includes('youtube')) return <FaYoutube className="text-[#FF0000]" />;
    if (url.includes('twitter') || url.includes('x.com')) return <FaTwitter className="text-[#1DA1F2]" />;
    if (url.includes('linkedin')) return <FaLinkedin className="text-[#0A66C2]" />;
    return <FiLink className="text-[#F57C00]" />;
};

// ── Shared sub-components ──────────────────────────────────────────────────────

const Divider = () => (
    <div className="border-t border-dashed border-gray-200 dark:border-white/8" />
);

const StatBadge = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-3 bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-white/8 rounded-xl px-4 py-3">
        <div className="w-8 h-8 rounded-lg bg-[#F57C00]/10 flex items-center justify-center">
            <Icon className="w-4 h-4 text-[#F57C00]" />
        </div>
        <div className="min-w-0">
            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
            <p className="text-[12px] font-bold text-gray-800 dark:text-white truncate">{value || '—'}</p>
        </div>
    </div>
);

// compact=true  →  nav bar pill button
// compact=false →  full-width CTA button
const FavoriteButton = ({ isFavorited, favCount, onClick, compact = false }) => {
    if (compact) {
        return (
            <button
                onClick={onClick}
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
        );
    }

    return (
        <button
            onClick={onClick}
            className={`w-full py-3.5 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 transition-all border
                ${isFavorited
                    ? 'bg-red-50 text-red-500 border-red-200'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-[#F57C00] hover:text-[#F57C00]'
                }`}
        >
            {isFavorited ? <FaHeart className="w-3.5 h-3.5" /> : <FaRegHeart className="w-3.5 h-3.5" />}
            {isFavorited ? 'Saved to Favorites' : 'Save to Favorites'}
            {favCount > 0 && <span className="opacity-50 font-normal">· {favCount}</span>}
        </button>
    );
};

// ── Main Component ─────────────────────────────────────────────────────────────

export default function ListingDetailsClient({ initialProduct, initialRelated }) {
    const { user } = useAuth();
    const router = useRouter();

    const [product, setProduct] = useState(initialProduct);
    const [isFavorited, setIsFavorited] = useState(false);
    const [favCount, setFavCount] = useState(initialProduct.favorites?.length || 0);
    const [clickLoading, setClickLoading] = useState(false);
    const [externalClickLoading, setExternalClickLoading] = useState(null);

    const isProcessing = useRef(false);

    // ── Client-side init: view count + favorite status ────────────────────────
    useEffect(() => {
        let cancelled = false;

        const init = async () => {
            try {
                const deviceId = await getDeviceId();

                const { data } = await axios.get(
                    `${API_BASE_URL}/api/listings/${initialProduct._id}?deviceId=${deviceId}`,
                    { withCredentials: true }
                );

                if (!cancelled && data.views !== undefined) {
                    setProduct((prev) => ({ ...prev, views: data.views }));
                }
            } catch (err) {
                console.error('Client Init Error:', err);
            }
        };

        // Favorite status — pure sync, no need to block on init
        if (user && initialProduct.favorites) {
            setIsFavorited(
                initialProduct.favorites.some(
                    (fav) => (typeof fav === 'string' ? fav : fav._id) === user._id
                )
            );
        }

        init();
        return () => { cancelled = true; };
    }, [user, initialProduct]);

    // ── Handlers ──────────────────────────────────────────────────────────────

    const handleToggleFavorite = useCallback(async () => {
        if (!user) return alert('Please login!');
        if (isProcessing.current) return;

        isProcessing.current = true;
        try {
            const { data } = await axios.post(
                `${API_BASE_URL}/api/listings/favorite/${product._id}`,
                {},
                { withCredentials: true }
            );
            setIsFavorited(data.isFavorited);
            setFavCount(data.favoritesCount);
        } finally {
            isProcessing.current = false;
        }
    }, [user, product._id]);

    const handleVisitSite = useCallback(async (url, isExternal = false, index = null) => {
        if (!url || isProcessing.current) return;

        isProcessing.current = true;
        if (isExternal) setExternalClickLoading(index);
        else setClickLoading(true);

        try {
            const deviceId = await getDeviceId();
            await axios.post(
                `${API_BASE_URL}/api/listings/${product._id}/click`,
                { deviceId },
                { withCredentials: true }
            );
        } catch {
            // silent — URL নিচে finally-তে সবসময় খুলবে
        } finally {
            window.open(url, '_blank', 'noopener,noreferrer');
            setClickLoading(false);
            setExternalClickLoading(null);
            setTimeout(() => { isProcessing.current = false; }, 500);
        }
    }, [product._id]);

    // ── Derived values ────────────────────────────────────────────────────────

    const imageUrl = resolveImageUrl(product.image);
    const creatorUsername = product.creatorId?.username;

    // ── Render ────────────────────────────────────────────────────────────────

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

                    <FavoriteButton
                        isFavorited={isFavorited}
                        favCount={favCount}
                        onClick={handleToggleFavorite}
                        compact
                    />
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14 items-start">

                    {/* ── LEFT: IMAGE ── */}
                    <div className="lg:col-span-5">
                        <div className="sticky top-36">

                            {/* Hero Image */}
                            <div
                                className="relative w-full overflow-hidden bg-gray-100 dark:bg-white/5 shadow-xl border border-gray-100 dark:border-white/5 group"
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
                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                                        <FaEye className="w-3 h-3 opacity-80" />
                                        <span>{product.views || 0} views</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stat Badges */}
                            <div className="grid grid-cols-2 gap-3 mt-3">
                                <StatBadge icon={FiShield} label="Tradition" value={product.tradition} />
                                <StatBadge icon={FiMapPin} label="Culture" value={product.country} />
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: DETAILS ── */}
                    <div className="lg:col-span-7 space-y-7">

                        {/* Country + Category Badges */}
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

                        {/* Title + Creator */}
                        <div>
                            <h1 className="text-[36px] md:text-[44px] font-black text-gray-900 dark:text-white leading-[1.05] tracking-tight mb-3">
                                {product.title}
                            </h1>
                            {creatorUsername && (
                                <Link href={`/profile/${creatorUsername}`} className="inline-flex items-center gap-2 group">
                                    <div className="w-5 h-5 rounded-full bg-[#F57C00] flex items-center justify-center text-white text-[8px] font-black">
                                        {creatorUsername[0].toUpperCase()}
                                    </div>
                                    <span className="text-[12px] font-semibold text-gray-400 group-hover:text-[#F57C00] transition-colors">
                                        by @{creatorUsername}
                                    </span>
                                </Link>
                            )}
                        </div>

                        <Divider />

                        {/* Description */}
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-3">About</p>
                            <p className="text-[15px] leading-[1.8] text-gray-600 dark:text-gray-400">{product.description}</p>
                        </div>

                        {/* Cultural Tags */}
                        {product.culturalTags?.length > 0 && (
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-3">Key Features</p>
                                <div className="flex flex-wrap gap-2">
                                    {product.culturalTags.map((tag, idx) => (
                                        <span
                                            key={tag._id || idx}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-white/[0.04] border border-gray-200 dark:border-white/8 rounded-lg text-[10px] font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400"
                                        >
                                            <FiTag className="w-3 h-3 text-[#F57C00]" />
                                            {tag.title || tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Social Links */}
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
                                            {externalClickLoading === idx
                                                ? <FaSpinner className="animate-spin text-sm" />
                                                : getSocialIcon(url)
                                            }
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Divider />

                        {/* CTA Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={() => handleVisitSite(product.websiteLink)}
                                disabled={clickLoading || !product.websiteLink}
                                className="group w-full py-4 rounded-xl font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 transition-all bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-[#F57C00] dark:hover:bg-[#F57C00] dark:hover:text-white disabled:opacity-30"
                            >
                                {clickLoading
                                    ? <FaSpinner className="animate-spin" />
                                    : <>Visit Creator Website <FiExternalLink className="w-4 h-4" /></>
                                }
                            </button>

                            <FavoriteButton
                                isFavorited={isFavorited}
                                favCount={favCount}
                                onClick={handleToggleFavorite}
                            />
                        </div>
                    </div>
                </div>

                {/* ── RELATED LISTINGS ── */}
                {initialRelated.length > 0 && (
                    <div className="mt-20 pt-12 border-t border-gray-100 dark:border-white/5">
                        <div className="flex justify-between items-end mb-8">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F57C00] mb-2">You might also like</p>
                                <h2 className="text-[28px] md:text-[34px] font-black text-gray-900 dark:text-white">
                                    More from <span className="text-[#F57C00]">@{creatorUsername}</span>
                                </h2>
                            </div>
                            {creatorUsername && (
                                <Link
                                    href={`/profile/${creatorUsername}`}
                                    className="hidden md:inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#F57C00]"
                                >
                                    View all <FiExternalLink className="w-3 h-3" />
                                </Link>
                            )}
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {initialRelated.map((item) => (
                                <ListingCard key={item._id} item={item} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}