'use client';
import { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';

export default function FavoriteButton({ listingId, initialIsFavorited, API_BASE_URL }) {
    const { user } = useAuth();
    const [isFavorited, setIsFavorited] = useState(initialIsFavorited);

    const handleToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) return alert('Please login');

        try {
            const res = await axios.post(`${API_BASE_URL}/api/listings/favorite/${listingId}`, {}, { withCredentials: true });
            if (res.status === 200) setIsFavorited(res.data.isFavorited);
        } catch (err) { console.error(err); }
    };

    return (
        <button onClick={handleToggle} className="absolute top-3 right-3 z-20 p-2 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-full shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            {isFavorited ? <FaHeart className="text-red-500 text-lg" /> : <FaRegHeart className="text-gray-900 dark:text-white text-lg" />}
        </button>
    );
}