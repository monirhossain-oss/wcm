'use client';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  FiArrowLeft,
  FiExternalLink,
  FiMapPin,
  FiGlobe,
  FiTag,
  FiLayers,
  FiShield,
  FiLink, 
} from 'react-icons/fi';
import {
  FaSpinner,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaLinkedin,
  FaHeart,
  FaRegHeart,
  FaEye,
} from 'react-icons/fa';
import Image from 'next/image';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import ListingCard from '@/components/ListingCard';

const ListingDetails = () => {
  const params = useParams();
  const { id } = params;
  const { user } = useAuth();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedListings, setRelatedListings] = useState([]);
  const [clickLoading, setClickLoading] = useState(false);
  const [externalClickLoading, setExternalClickLoading] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favCount, setFavCount] = useState(0);

  const isProcessing = useRef(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/listings/${id}`, {
          withCredentials: true,
        });
        const currentProduct = res.data;
        console.log(res.data);
        setProduct(currentProduct);
        setFavCount(currentProduct.favorites?.length || 0);

        if (user && currentProduct.favorites) {
          setIsFavorited(
            currentProduct.favorites.some(
              (favId) => (typeof favId === 'string' ? favId : favId._id) === user._id
            )
          );
        }

        if (currentProduct.creatorId?._id) {
          const relatedRes = await axios.get(
            `${API_BASE_URL}/api/listings/public?creatorId=${currentProduct.creatorId._id}&limit=5`,
            { withCredentials: true }
          );
          setRelatedListings(
            (relatedRes.data.listings || []).filter((item) => item._id !== id).slice(0, 4)
          );
        }
      } catch (err) {
        console.error('Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchListing();
  }, [id, API_BASE_URL, user]);

  const handleToggleFavorite = async () => {
    if (!user) return alert('Please login!');
    if (isProcessing.current) return;
    try {
      isProcessing.current = true;
      const res = await axios.post(
        `${API_BASE_URL}/api/listings/favorite/${id}`,
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
      await axios.post(`${API_BASE_URL}/api/listings/${id}/click`, {}, { withCredentials: true });
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } finally {
      setClickLoading(false);
      setExternalClickLoading(null);
      setTimeout(() => {
        isProcessing.current = false;
      }, 500);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-[#050505]">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!product)
    return (
      <div className="text-center py-20 uppercase font-black tracking-widest opacity-30">
        Asset not found.
      </div>
    );

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] pt-5 pb-10 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-5">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-3 text-zinc-500 hover:text-orange-500 transition-all group outline-none"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Back to Previous
            </span>
          </button>

          <button
            onClick={handleToggleFavorite}
            className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${isFavorited ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-white dark:bg-white/5 border-zinc-100 dark:border-white/10 text-zinc-400'}`}
          >
            {isFavorited ? <FaHeart /> : <FaRegHeart />}{' '}
            {isFavorited ? 'Saved' : 'Save to Favorites'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Visual Section (Left) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-square bg-zinc-100 dark:bg-white/5 rounded-lg overflow-hidden border border-zinc-200 dark:border-white/10 group shadow-2xl">
              <Image
                src={
                  product.image?.startsWith('http')
                    ? product.image
                    : `${API_BASE_URL}/${product.image}`
                }
                alt={product.title}
                fill
                unoptimized
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {product.isPromoted && (
                <div className="absolute top-4 left-4 bg-orange-600 px-3 py-1 rounded text-[8px] font-black text-white uppercase tracking-widest shadow-lg">
                  Top Ranked
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <StatBox icon={FiShield} label="Tradition" value={product.tradition} />
              <StatBox icon={FaEye} label="Total Views" value={product.views || 0} />
            </div>
          </div>

          {/* Info Section (Right) */}
          <div className="lg:col-span-7">
            <div className="flex flex-wrap gap-2 mb-6">
              <Tag label={product.country} icon={FiMapPin} color="orange" />
              <Tag label={product.category?.title} icon={FiLayers} color="zinc" />
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-zinc-900 dark:text-white mb-6 uppercase tracking-tighter leading-[0.9]">
              {product.title}
            </h1>

            <p className="text-zinc-600 dark:text-gray-400 leading-relaxed text-base md:text-lg font-medium mb-10 max-w-2xl">
              {product.description}
            </p>

            {/* Cultural Tags */}
            {product.culturalTags?.length > 0 && (
              <div className="mb-10">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-4">
                  Key Features
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.culturalTags.map((tag, idx) => (
                    <span
                      key={tag._id || `tag-${idx}`}
                      className="px-3 py-1.5 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-md text-[10px] font-black uppercase text-zinc-500 dark:text-zinc-400 flex items-center gap-2"
                    >
                      <FiTag className="text-orange-500" /> {tag.title || tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* External Matrix */}
            {product.externalUrls?.length > 0 && (
              <div className="mb-10 p-6 bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 rounded-lg">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-5">
                  Social Links
                </p>
                <div className="flex gap-6">
                  {product.externalUrls.map((url, idx) => (
                    <button
                      key={`ext-${idx}`}
                      onClick={() => handleVisitSite(url, true, idx)}
                      disabled={externalClickLoading !== null}
                      className="text-2xl opacity-60 hover:opacity-100 hover:-translate-y-1 transition-all"
                    >
                      {externalClickLoading === idx ? (
                        <FaSpinner className="animate-spin text-sm" />
                      ) : (
                        getSocialIcon(url)
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Main Action */}
            <button
              onClick={() => handleVisitSite(product.websiteLink)}
              disabled={clickLoading || !product.websiteLink}
              className="group w-full py-5 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg font-black uppercase tracking-[0.4em] text-[11px] flex items-center justify-center gap-3 transition-all hover:bg-orange-600 dark:hover:bg-orange-600 dark:hover:text-white active:scale-95 disabled:opacity-30"
            >
              {clickLoading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <>
                  Access Experience{' '}
                  <FiExternalLink className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Related Assets */}
        {relatedListings.length > 0 && (
          <div className="mt-10 pt-10 border-t border-white/5">
            <div className="flex justify-between items-end mb-10">
              <div>
                <p className="text-orange-500 text-[10px] font-black uppercase tracking-[0.4em] mb-2">
                  You might also like
                </p>
                <h2 className="text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
                  More from @{product.creatorId?.username}
                </h2>
              </div>
              <Link
                href={`/profile/${product.creatorId?._id}`}
                className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors border-b border-white/10 pb-1"
              >
                More from this creator
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedListings.map((item) => (
                <ListingCard key={item._id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Sub-components
const Tag = ({ label, icon: Icon, color }) => (
  <span
    className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${color === 'orange' ? 'bg-orange-500/10 text-orange-500' : 'bg-zinc-100 dark:bg-white/5 text-zinc-500'}`}
  >
    <Icon size={12} /> {label}
  </span>
);

const StatBox = ({ icon: Icon, label, value }) => (
  <div className="bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 p-4 rounded-lg">
    <p className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-1">{label}</p>
    <div className="flex items-center gap-2 font-black dark:text-white uppercase tracking-tighter text-sm">
      <Icon className="text-orange-500" size={14} /> {value}
    </div>
  </div>
);

// Icon Helper
const getSocialIcon = (url) => {
  if (url.includes('facebook')) return <FaFacebook className="text-[#1877F2]" />;
  if (url.includes('instagram')) return <FaInstagram className="text-[#E4405F]" />;
  if (url.includes('youtube')) return <FaYoutube className="text-[#FF0000]" />;
  if (url.includes('twitter') || url.includes('x.com'))
    return <FaTwitter className="text-[#1DA1F2]" />;
  if (url.includes('linkedin')) return <FaLinkedin className="text-[#0A66C2]" />;
  return <FiLink className="text-orange-500" />; // ✅ এখন কাজ করবে!
};

export default ListingDetails;
