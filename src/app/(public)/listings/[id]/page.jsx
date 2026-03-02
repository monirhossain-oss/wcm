'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  FiArrowLeft,
  FiExternalLink,
  FiUser,
  FiMapPin,
  FiGlobe,
  FiLink,
  FiTag,
  FiLayers,
} from 'react-icons/fi';
import {
  FaSpinner,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaLinkedin,
  FaGithub,
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

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedListings, setRelatedListings] = useState([]);
  const [clickLoading, setClickLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favCount, setFavCount] = useState(0);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

  const getSocialIcon = (url) => {
    if (url.includes('facebook.com')) return <FaFacebook className="text-[#1877F2]" />;
    if (url.includes('instagram.com')) return <FaInstagram className="text-[#E4405F]" />;
    if (url.includes('youtube.com')) return <FaYoutube className="text-[#FF0000]" />;
    if (url.includes('twitter.com') || url.includes('x.com'))
      return <FaTwitter className="text-[#1DA1F2]" />;
    if (url.includes('linkedin.com')) return <FaLinkedin className="text-[#0A66C2]" />;
    return <FiLink className="text-orange-500" />;
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/listings/${id}`, {
          withCredentials: true,
        });
        const currentProduct = res.data;
        setProduct(currentProduct);

        if (user && currentProduct.favorites) {
          setIsFavorited(currentProduct.favorites.includes(user._id));
        }

        if (currentProduct.creatorId?._id) {
          try {
            const relatedRes = await axios.get(
              `${API_BASE_URL}/api/listings/public?creatorId=${currentProduct.creatorId._id}&limit=10`,
              { withCredentials: true }
            );

            const allListingsFromCreator = relatedRes.data.listings || [];
            const filtered = allListingsFromCreator.filter((item) => item._id !== id).slice(0, 4);
            setRelatedListings(filtered);
          } catch (relatedErr) {
            console.error('Related Listings Error:', relatedErr);
            setRelatedListings([]);
          }
        }
      } catch (err) {
        console.error('Main Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchListing();
  }, [id, API_BASE_URL, user]);

  const handleToggleFavorite = async () => {
    if (!user) return alert('Please login to add to favorites!');
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/listings/favorite/${id}`,
        {},
        { withCredentials: true }
      );
      setIsFavorited(res.data.isFavorited);
      setFavCount(res.data.favoritesCount);
    } catch (err) {
      console.error('Favorite Toggle Error:', err);
    }
  };

  const handleVisitSite = async () => {
    if (!product?.websiteLink) return;
    setClickLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/listings/${id}/click`);
      window.open(product.websiteLink, '_blank', 'noopener,noreferrer');
    } catch (err) {
      window.open(product.websiteLink, '_blank', 'noopener,noreferrer');
    } finally {
      setClickLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a0a]">
        <FaSpinner className="animate-spin text-[#F57C00] text-4xl" />
      </div>
    );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] pt-5 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/categories"
            className="flex items-center gap-2 text-zinc-400 hover:text-orange-500 transition-all group w-fit"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">Back to discovery</span>
          </Link>

          <button
            onClick={handleToggleFavorite}
            className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all font-black uppercase tracking-widest text-[10px] shadow-sm border ${
              isFavorited
                ? 'bg-red-50 border-red-100 text-red-500'
                : 'bg-zinc-50 dark:bg-white/5 border-zinc-100 dark:border-white/10 text-zinc-400'
            }`}
          >
            {isFavorited ? <FaHeart className="text-sm" /> : <FaRegHeart className="text-sm" />}
            {isFavorited ? 'Saved' : 'Save Treasure'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: Image Container (Sticky removed, Rounded reduced) */}
          <div className="rounded-2xl overflow-hidden shadow-xl border border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-zinc-900 aspect-square relative">
            <Image
              src={
                product.image.startsWith('http')
                  ? product.image
                  : `${API_BASE_URL}/${product.image}`
              }
              alt={product.title}
              fill
              unoptimized
              className="object-cover"
            />
            {product.isPromoted && (
              <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full shadow-lg">
                <span className="text-[9px] font-black text-[#F57C00] uppercase tracking-widest">
                  Featured
                </span>
              </div>
            )}
          </div>

          {/* Right: Content Section */}
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                <FiMapPin /> {product.country}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                <FiGlobe /> {product.tradition}
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-white/5 text-zinc-500 dark:text-zinc-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                <FiLayers /> {product.category?.title}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mb-6 uppercase tracking-tighter leading-tight">
              {product.title}
            </h1>

            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8 font-medium">
              {product.description}
            </p>

            {/* Cultural Tags */}
            {product.culturalTags?.length > 0 && (
              <div className="mb-8">
                <p className="text-[10px] text-zinc-400 uppercase font-black tracking-[0.2em] mb-4">
                  Cultural Insights
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.culturalTags.map((tag) => (
                    <span
                      key={tag._id}
                      className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 rounded-full text-[11px] font-bold text-zinc-700 dark:text-zinc-300"
                    >
                      <FiTag className="text-orange-500" /> {tag.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Links Box */}
            {product.externalUrls?.length > 0 && (
              <div className="mb-8 p-5 bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 rounded-xl">
                <p className="text-[10px] text-zinc-400 uppercase font-black tracking-[0.2em] mb-4">
                  External Links
                </p>
                <div className="flex flex-wrap gap-4">
                  {product.externalUrls.map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-2xl transition-all hover:-translate-y-1"
                    >
                      {getSocialIcon(url)}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Stats & Creator Card (Rounded-xl) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <div className="md:col-span-2 bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 p-5 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center text-white text-xl font-black">
                  {product.creatorId?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-[9px] text-zinc-400 uppercase font-black tracking-widest">
                    Curated By
                  </p>
                  <Link
                    href={`/profile/${product.creatorId?._id}`}
                    className="font-bold text-zinc-900 dark:text-white hover:text-orange-500 truncate block uppercase tracking-tighter"
                  >
                    @{product.creatorId?.username}
                  </Link>
                </div>
              </div>

              <div className="bg-zinc-50 dark:bg-white/5 border border-zinc-100 dark:border-white/10 p-5 rounded-xl flex flex-col justify-center items-center">
                <div className="flex items-center gap-2">
                  <FaEye className="text-blue-500" />
                  <span className="text-lg font-black text-zinc-900 dark:text-white">
                    {product.views || 0}
                  </span>
                </div>
                <p className="text-[9px] text-zinc-400 uppercase font-black tracking-widest mt-1">
                  Total Views
                </p>
              </div>
            </div>

            {/* CTA Button (Sharped Rounded) */}
            <button
              onClick={handleVisitSite}
              disabled={clickLoading}
              className="w-full py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-full font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white active:scale-[0.99] disabled:opacity-70"
            >
              {clickLoading ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <>
                  Visit Experience <FiExternalLink />
                </>
              )}
            </button>
          </div>
        </div>

        {/* 🔥 "More from this creator" Section */}
        {relatedListings.length > 0 && (
          <div className="pt-16 border-t border-zinc-100 dark:border-white/5">
            <div className="flex justify-between items-end mb-8">
              <div>
                <p className="text-[#F57C00] text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                  Heritage Collection
                </p>
                <h2 className="text-2xl md:text-3xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">
                  More from @{product.creatorId?.username}
                </h2>
              </div>
              <Link
                href={`/profile/${product.creatorId?._id}`}
                className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-orange-500 transition-colors border-b border-transparent hover:border-orange-500 pb-1"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedListings.map((item) => (
                <ListingCard item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingDetails;
