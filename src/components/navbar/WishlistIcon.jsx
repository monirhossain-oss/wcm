'use client';

// src/components/navbar/WishlistIcon.jsx
// Owns: wishlist heart icon + count badge. Renders nothing if logged out.
// NOTE: original code had wishlistCount hardcoded to 0 with no setter call —
// wire this up to your real wishlist source (context/hook/fetch) when ready.

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHeart } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

const WishlistIcon = () => {
    const { user } = useAuth();
    const pathname = usePathname();
    const wishlistCount = 0; // TODO: connect to real wishlist state/source

    if (!user) return null;

    return (
        <Link href="/favorites" className="relative p-2 group transition-all duration-200" title="My Wishlist">
            <FiHeart
                className={`h-6 w-6 transition-colors ${pathname === '/favorites' ? 'text-red-500 fill-red-500' : 'text-gray-600 dark:text-gray-300 group-hover:text-red-500'
                    }`}
            />
            {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white dark:border-[#0a0a0a] animate-in zoom-in">
                    {wishlistCount}
                </span>
            )}
        </Link>
    );
};

export default WishlistIcon;