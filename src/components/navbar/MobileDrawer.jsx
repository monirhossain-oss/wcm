'use client';

// src/components/navbar/MobileDrawer.jsx
// Owns: hamburger icon, slide-in drawer, mobile category accordion,
// mobile auth fallback buttons, dashboard/logout links for logged-in users.
// State here is fully isolated — opening/closing this drawer never
// re-renders CategoryDropdown, ProfileMenu, or AuthButtons.

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FiMenu, FiX, FiChevronDown, FiGrid, FiHeart, FiLogOut } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import { createSlug } from './utils';
import MobileAuthFallback from './MobileAuthFallback';

const MobileDrawer = ({ categories, menuItems }) => {
    const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
    const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);

    const { user, logoutUser } = useAuth();
    const pathname = usePathname();

    const getDashboardLink = () => {
        if (user?.role === 'admin') return '/admin';
        if (user?.role === 'creator') return '/creator';
        return '/profile';
    };

    const closeAll = () => {
        setIsMobileDrawerOpen(false);
        setIsMobileCategoryOpen(false);
    };

    return (
        <>
            {/* Hamburger — visible on mobile, hidden on md+ */}
            <div
                className="md:hidden h-9 w-9 p-2 cursor-pointer text-gray-700 dark:text-gray-200 flex-shrink-0 z-[400]"
                onClick={() => setIsMobileDrawerOpen((prev) => !prev)}
            >
                {isMobileDrawerOpen ? (
                    <FiX className="h-full w-full animate-in spin-in-90 duration-200" />
                ) : (
                    <FiMenu className="h-full w-full animate-in fade-in duration-200" />
                )}
            </div>

            {/* ── Mobile Drawer — slides in from the LEFT ── */}
            <div
                className={`fixed top-18 left-0 h-full w-[75%] max-w-xs bg-white dark:bg-[#0a0a0a] shadow-2xl transform transition-transform duration-300 md:hidden z-[300] flex flex-col
          ${isMobileDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-0.5">

                    {menuItems.map((item) => {
                        if (item.name === 'Categories') {
                            return (
                                <div key={item.name}>
                                    <button
                                        type="button"
                                        onClick={() => setIsMobileCategoryOpen((prev) => !prev)}
                                        className={`w-full flex items-center justify-between px-3 py-3.5 text-[15px] font-semibold rounded-xl transition-colors
                      ${isMobileCategoryOpen ? 'text-[#F57C00] bg-orange-50 dark:bg-orange-500/10' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                    >
                                        <span className="flex items-center gap-2.5">
                                            <FiGrid className={`w-4 h-4 ${isMobileCategoryOpen ? 'text-[#F57C00]' : 'text-gray-400'}`} />
                                            Categories
                                        </span>
                                        <FiChevronDown className={`w-4 h-4 transition-transform duration-300 ${isMobileCategoryOpen ? 'rotate-180 text-[#F57C00]' : 'text-gray-400'}`} />
                                    </button>

                                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isMobileCategoryOpen ? 'max-h-[400px]' : 'max-h-0'}`}>
                                        <div
                                            className="mx-1 mb-2 mt-1 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-white/[0.02] overflow-y-auto"
                                            style={{ maxHeight: '360px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(156,163,175,0.4) transparent' }}
                                        >
                                            <Link
                                                href="/explore"
                                                onClick={closeAll}
                                                className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800"
                                            >
                                                <span className="text-xs font-bold text-[#F57C00]">Browse All Categories</span>
                                                <svg className="w-3.5 h-3.5 text-[#F57C00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>

                                            <div className="p-2 flex flex-col gap-0.5">
                                                {categories.map((cat) => (
                                                    <Link
                                                        key={cat._id || cat.id}
                                                        href={`/explore/${createSlug(cat.title || cat.name)}`}
                                                        onClick={closeAll}
                                                        className="group flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-[#F57C00]/40 hover:bg-orange-50 dark:hover:bg-orange-500/5 transition-all duration-150 cursor-pointer"
                                                    >
                                                        <span className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700 group-hover:bg-[#F57C00] flex-shrink-0 transition-colors duration-150" />
                                                        <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 group-hover:text-[#F57C00] truncate transition-colors duration-150 leading-tight">
                                                            {cat.title || cat.name}
                                                        </span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileDrawerOpen(false)}
                                className={`flex items-center px-3 py-3.5 text-[15px] font-semibold rounded-xl transition-colors
                  ${pathname === item.href ? 'text-[#F57C00] bg-orange-50 dark:bg-orange-500/10' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}

                    {user && (
                        <Link
                            href="/favorites"
                            onClick={() => setIsMobileDrawerOpen(false)}
                            className={`flex items-center gap-2.5 px-3 py-3.5 text-[15px] font-semibold rounded-xl transition-colors
                ${pathname === '/favorites' ? 'text-red-500 bg-red-50 dark:bg-red-500/10' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                        >
                            <FiHeart className="w-4 h-4" />
                            Wishlist
                        </Link>
                    )}

                    <div className="border-t border-gray-100 dark:border-gray-800 my-2" />

                    {user ? (
                        <>
                            <Link
                                href={getDashboardLink()}
                                onClick={() => setIsMobileDrawerOpen(false)}
                                className="flex items-center px-3 py-3.5 text-[15px] font-semibold text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5"
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={() => { logoutUser(); setIsMobileDrawerOpen(false); }}
                                className="flex items-center gap-2 px-3 py-3.5 text-[15px] font-bold text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-left w-full"
                            >
                                <FiLogOut className="w-4 h-4" /> Logout
                            </button>
                        </>
                    ) : (
                        <MobileAuthFallback onClose={() => setIsMobileDrawerOpen(false)} />
                    )}
                </div>
            </div>

            {/* Backdrop for the mobile drawer */}
            {isMobileDrawerOpen && (
                <div
                    className="fixed inset-0 z-[40] bg-black/10"
                    onClick={() => setIsMobileDrawerOpen(false)}
                />
            )}
        </>
    );
};

export default MobileDrawer;