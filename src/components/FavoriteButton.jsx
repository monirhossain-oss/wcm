'use client';
import { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useLocale } from '@/context/LocaleContext';

export default function FavoriteButton({ listingId, initialIsFavorited, API_BASE_URL }) {
  const { user, isBusinessRestricted } = useAuth();
  const { t } = useLocale();
  const [isFavorited, setIsFavorited] = useState(Boolean(initialIsFavorited));

  useEffect(() => {
    setIsFavorited(Boolean(initialIsFavorited));
  }, [initialIsFavorited]);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return alert(t('favorites.login'));
    if (isBusinessRestricted) {
      return alert(t('favorites.restricted'));
    }

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/listings/favorite/${listingId}`,
        {},
        { withCredentials: true }
      );
      if (res.status === 200) setIsFavorited(res.data.isFavorited);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button
      aria-label={t('favorites.toggle')}
      onClick={handleToggle}
      disabled={isBusinessRestricted}
      title={isBusinessRestricted ? t('favorites.restrictedTitle') : undefined}
      className="absolute top-3 right-3 z-20 p-2 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 disabled:cursor-not-allowed disabled:grayscale"
    >
      {isFavorited ? (
        <FaHeart className="text-red-500 text-lg" />
      ) : (
        <FaRegHeart className="text-gray-900 dark:text-white text-lg" />
      )}
    </button>
  );
}
