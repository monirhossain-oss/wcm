'use client';

// src/components/navbar/ProfileMenu.jsx
// Owns: avatar/profile dropdown, dashboard link, logout, "Become a Creator" CTA.
// Renders nothing if no user is logged in — AuthButtons handles that case.

import { useState } from 'react';
import Link from 'next/link';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

const ProfileMenu = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user, logoutUser } = useAuth();

    if (!user) return null;

    const getDashboardLink = () => {
        if (user?.role === 'admin') return '/admin';
        if (user?.role === 'creator') return '/creator';
        return '/profile';
    };

    return (
        <div className="relative flex items-center space-x-2 md:space-x-3">
            {/* "Become a Creator" — desktop only */}
            {user.role === 'user' && (
                <Link
                    href="/become-creator"
                    className="hidden md:block px-4 py-2 rounded-lg bg-[#F57C00] text-white text-xs font-bold shadow-md hover:bg-[#e67600] transition-all"
                >
                    Become a Creator
                </Link>
            )}

            <div className="relative">
                <div
                    className="flex items-center space-x-2 cursor-pointer p-1 pr-3 rounded-full border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                >
                    <div className="bg-[#F57C00] p-1.5 rounded-full text-white">
                        <FiUser className="h-4 w-4" />
                    </div>
                    <span className="hidden lg:block text-xs font-semibold capitalize">{user.username}</span>
                </div>

                {isProfileOpen && (
                    <>
                        <div className="absolute top-12 right-0 w-48 bg-white dark:bg-[#1a1a1a] shadow-xl border border-gray-100 dark:border-gray-800 rounded-xl py-2 z-[60] animate-in slide-in-from-top-2 duration-200">
                            <Link
                                href={getDashboardLink()}
                                className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                onClick={() => setIsProfileOpen(false)}
                            >
                                {user?.role === 'admin' ? 'Admin Dashboard' : user?.role === 'creator' ? 'Creator Dashboard' : 'Profile'}
                            </Link>
                            <button
                                onClick={() => { logoutUser(); setIsProfileOpen(false); }}
                                className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <FiLogOut /><span>Logout</span>
                            </button>
                        </div>

                        {/* Backdrop just for this menu — only mounted while open */}
                        <div
                            className="fixed inset-0 z-[40] bg-transparent"
                            onClick={() => setIsProfileOpen(false)}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfileMenu;