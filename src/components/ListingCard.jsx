import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { Star } from 'lucide-react';
import FavoriteButton from './FavoriteButton';
import CreatorName from './CreatorName';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export default function ListingCard({ item }) {
  if (!item) return null;
  // console.log(item);

  const postImageSrc = item.image?.startsWith('http') ? item.image : `${API_BASE_URL}${item.image?.startsWith('/') ? '' : '/'}${item.image}`;

  return (
    <div className="group relative flex flex-col w-full transition-all duration-300">
      {/* IMAGE SECTION */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-gray-100 dark:bg-zinc-900">
        <Link href={`/listings/${item.slug}`} className="block w-full h-full relative">
          <Image
            src={postImageSrc || 'https://placehold.co/600x400?text=No+Image'}
            alt={item.title}
            fill
            sizes="(max-width:768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300" />
          <div className="absolute bottom-0 left-0 w-full p-4 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10">
            <h3 className="text-white font-semibold text-sm line-clamp-2">{item.title}</h3>
          </div>
        </Link>

        {/* Client Side Button */}
        <FavoriteButton listingId={item._id} initialIsFavorited={item.isFavorited} API_BASE_URL={API_BASE_URL} />

        {item.isPromoted && (
          <div className="absolute top-2 left-2 z-20 text-[9px] font-bold text-white bg-orange-600/60 px-2 py-0.5 rounded flex items-center gap-1">
            <Star size={12} /> <span>FEATURED</span>
          </div>
        )}
      </div>

      {/* INFO SECTION */}
      <div className="mt-3 px-1">
        <div className="flex items-center justify-between gap-3">
          {/* Client Side Creator Hover */}
          <CreatorName creator={item.creatorId} item={item} region={item.region} API_BASE_URL={API_BASE_URL} />

          <div className="flex gap-2">
            <div className="hidden md:flex font-bold text-[10px] text-orange-600 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded">
              {item.tradition || 'Heritage'}
            </div>
            <div className="flex items-center text-[10px] gap-1 font-medium text-zinc-500 dark:text-zinc-400">
              <HiOutlineLocationMarker size={12} /> {item.region || 'Global'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}