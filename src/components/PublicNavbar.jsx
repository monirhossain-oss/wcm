'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiUser, FiLogOut, FiHeart, FiChevronDown, FiGrid } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegistationModal';
import Link from 'next/link';
import axios from 'axios';

const PublicNavbar = () => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);

  const [wishlistCount, setWishlistCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const { user, logoutUser } = useAuth();
  const pathname = usePathname();

  const categoryRef = useRef(null);

  const menuItems = [
    { name: 'Explore', href: '/explore' },
    { name: 'Categories', href: null },
    { name: 'Creators', href: '/creators' },
    { name: 'About', href: '/about-us' },
    { name: 'Blogs', href: '/blogs' },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axios.get(`${baseUrl}/api/admin/categories`);
        const fetchedData = Array.isArray(response.data) ? response.data : response.data.data;
        setCategories(fetchedData || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);
  const createSlug = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/&/g, '-and-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'creator') return '/creator';
    return '/profile';
  };

  const openLogin = () => { setIsRegisterOpen(false); setIsLoginOpen(true); };
  const openRegister = () => { setIsLoginOpen(false); setIsRegisterOpen(true); };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white dark:bg-[#0a0a0a] z-50 border-b border-gray-100 dark:border-gray-900">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6 h-20">

          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="cursor-pointer">
              <Image src="/wc,-web-logo.png" alt="Logo Light" width={100} height={100} className="dark:hidden brightness-125 h-auto w-auto" />
              <Image src="/wc,-web-white.png" alt="Logo Dark" width={100} height={100} className="hidden dark:block brightness-125 h-auto w-auto" />
            </Link>
          </div>

          {/* Center Menu - Desktop */}
          <div className="flex-1 flex justify-center">
            <div className="hidden md:flex space-x-6 items-center">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;

                if (item.name === 'Categories') {
                  return (
                    <div key={item.name} className="relative" ref={categoryRef}>
                      <button
                        type="button"
                        onClick={() => setIsCategoryDropdownOpen((prev) => !prev)}
                        className={`text-sm font-medium transition-all duration-200 pb-1 border-b-2 flex items-center gap-1 outline-none
                          ${isCategoryDropdownOpen ? 'text-[#F57C00] border-[#F57C00]' : 'border-transparent hover:text-[#F57C00]'}`}
                      >
                        Categories
                        <FiChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* ── Desktop Mega Dropdown ── */}
                      {isCategoryDropdownOpen && (
                        <div
                          className="
                            fixed left-0 right-0
                            top-[79px]
                            bg-white dark:bg-[#111111]
                            border-t border-b border-gray-100 dark:border-gray-800
                            shadow-2xl z-[200]
                            animate-in fade-in slide-in-from-top-1 duration-200
                          "
                        >
                          <div className="max-w-7xl mx-auto px-6 py-6">

                            {/* Header row */}
                            <div className="flex items-center justify-between mb-5">
                              <div className="flex items-center gap-2">
                                <FiGrid className="text-[#F57C00] w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                                  All Categories
                                </span>
                              </div>
                              <Link
                                href="/explore"
                                onClick={() => setIsCategoryDropdownOpen(false)}
                                className="text-xs font-bold text-[#F57C00] hover:underline underline-offset-2 flex items-center gap-1"
                              >
                                Browse All
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                              </Link>
                            </div>

                            {/* Scrollable grid */}
                            {isLoadingCategories ? (
                              <div className="grid grid-cols-6 gap-3">
                                {Array.from({ length: 12 }).map((_, i) => (
                                  <div key={i} className="h-10 rounded-xl bg-gray-100 dark:bg-white/5 animate-pulse" />
                                ))}
                              </div>
                            ) : (
                              <div
                                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 max-h-[340px] overflow-y-auto pr-1"
                                style={{
                                  scrollbarWidth: 'thin',
                                  scrollbarColor: 'rgba(156,163,175,0.5) transparent',
                                }}
                              >
                                {/* Desktop Grid Link - Update this part */}
                                {categories.map((cat) => (
                                  <Link
                                    key={cat._id || cat.id}
                                    // query parameter এর বদলে dynamic route ব্যবহার
                                    href={`/explore/${createSlug(cat.title || cat.name)}`}
                                    onClick={() => setIsCategoryDropdownOpen(false)}
                                    className="group flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-[#F57C00]/40 hover:bg-orange-50 dark:hover:bg-orange-500/5 transition-all duration-150 cursor-pointer"
                                  >
                                    <span className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700 group-hover:bg-[#F57C00] flex-shrink-0 transition-colors duration-150" />
                                    <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 group-hover:text-[#F57C00] truncate transition-colors duration-150 leading-tight">
                                      {cat.title || cat.name}
                                    </span>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-sm font-medium transition-all duration-200 pb-1 border-b-2
                      ${isActive ? 'text-[#F57C00] border-[#F57C00]' : 'border-transparent hover:text-[#F57C00]'}`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">

            {user && (
              <Link href="/favorites" className="relative p-2 group transition-all duration-200" title="My Wishlist">
                <FiHeart className={`h-6 w-6 transition-colors ${pathname === '/favorites' ? 'text-red-500 fill-red-500' : 'text-gray-600 dark:text-gray-300 group-hover:text-red-500'}`} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white dark:border-[#0a0a0a] animate-in zoom-in">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div className="relative flex items-center space-x-3">
                {user.role === 'user' && (
                  <Link href="/become-creator" className="hidden md:block px-4 py-2 rounded-lg bg-[#F57C00] text-white text-xs font-bold shadow-md hover:bg-[#e67600] transition-all">
                    Become a Creator
                  </Link>
                )}
                <div className="relative">
                  <div
                    className="flex items-center space-x-2 cursor-pointer p-1 pr-3 rounded-full border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <div className="bg-[#F57C00] p-1.5 rounded-full text-white">
                      <FiUser className="h-4 w-4" />
                    </div>
                    <span className="hidden lg:block text-xs font-semibold capitalize">{user.username}</span>
                  </div>
                  {isProfileOpen && (
                    <div className="absolute top-12 right-0 w-48 bg-white dark:bg-[#1a1a1a] shadow-xl border border-gray-100 dark:border-gray-800 rounded-xl py-2 z-[60] animate-in slide-in-from-top-2 duration-200">
                      <Link href={getDashboardLink()} className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" onClick={() => setIsProfileOpen(false)}>
                        {user?.role === 'admin' ? 'Admin Dashboard' : user?.role === 'creator' ? 'Creator Dashboard' : 'Profile'}
                      </Link>
                      <button onClick={() => { logoutUser(); setIsProfileOpen(false); }} className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <FiLogOut /><span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <button onClick={() => setIsLoginOpen(true)} className="px-5 py-2 border-2 border-[#F57C00] text-[#F57C00] font-bold text-sm rounded-xl hover:bg-[#F57C00] hover:text-white transition-all duration-300">
                  Sign In
                </button>
                <button onClick={() => setIsRegisterOpen(true)} className="px-5 py-2 rounded-lg bg-[#F57C00] text-white text-sm font-bold hover:bg-[#e67600] transition-all shadow-md active:scale-95">
                  Sign Up
                </button>
              </div>
            )}

            <FiMenu className="md:hidden h-9 w-9 p-2 cursor-pointer text-gray-700 dark:text-gray-200" onClick={() => setIsMobileDrawerOpen(true)} />
          </div>
        </div>

        {/* ── Dropdown Backdrop (desktop) ── */}
        {isCategoryDropdownOpen && (
          <div
            className="fixed inset-0 top-[79px] z-[190] bg-black/20 dark:bg-black/40 backdrop-blur-[1px]"
            onClick={() => setIsCategoryDropdownOpen(false)}
          />
        )}

        {/* ── Mobile Drawer ── */}
        <div className={`fixed top-0 right-0 h-full w-[75%] max-w-xs bg-white dark:bg-[#0a0a0a] shadow-2xl transform transition-transform duration-300 md:hidden z-[300] flex flex-col ${isMobileDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>

          <div className="flex justify-between items-center px-5 py-5 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
            <span className="font-bold text-[#F57C00] uppercase tracking-widest text-sm">Menu</span>
            <FiX className="text-2xl cursor-pointer text-gray-500" onClick={() => setIsMobileDrawerOpen(false)} />
          </div>

          {/* Scrollable drawer body */}
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

                    {/* Mobile category accordion */}
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isMobileCategoryOpen ? 'max-h-[400px]' : 'max-h-0'}`}>
                      <div
                        className="mx-1 mb-2 mt-1 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-white/[0.02] overflow-y-auto"
                        style={{ maxHeight: '360px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(156,163,175,0.4) transparent' }}
                      >
                        {/* Browse All link at top */}
                        <Link
                          href="/explore"
                          onClick={() => { setIsMobileCategoryOpen(false); setIsMobileDrawerOpen(false); }}
                          className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800"
                        >
                          <span className="text-xs font-bold text-[#F57C00]">Browse All Categories</span>
                          <svg className="w-3.5 h-3.5 text-[#F57C00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>

                        {isLoadingCategories ? (
                          <div className="p-3 flex flex-col gap-2">
                            {Array.from({ length: 6 }).map((_, i) => (
                              <div key={i} className="h-9 rounded-lg bg-gray-100 dark:bg-white/5 animate-pulse" />
                            ))}
                          </div>
                        ) : (
                          <div className="p-2 flex flex-col gap-0.5">
                            {/* Desktop Grid Link - Update this part */}
                            {categories.map((cat) => (
                              <Link
                                key={cat._id || cat.id}
                                // query parameter এর বদলে dynamic route ব্যবহার
                                href={`/explore/${createSlug(cat.title || cat.name)}`}
                                onClick={() => setIsCategoryDropdownOpen(false)}
                                className="group flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-[#F57C00]/40 hover:bg-orange-50 dark:hover:bg-orange-500/5 transition-all duration-150 cursor-pointer"
                              >
                                <span className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700 group-hover:bg-[#F57C00] flex-shrink-0 transition-colors duration-150" />
                                <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 group-hover:text-[#F57C00] truncate transition-colors duration-150 leading-tight">
                                  {cat.title || cat.name}
                                </span>
                              </Link>
                            ))}
                          </div>
                        )}
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
                Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </Link>
            )}

            <div className="border-t border-gray-100 dark:border-gray-800 my-2" />

            {user ? (
              <>
                <Link href={getDashboardLink()} onClick={() => setIsMobileDrawerOpen(false)} className="flex items-center px-3 py-3.5 text-[15px] font-semibold text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5">
                  Dashboard
                </Link>
                <button onClick={() => { logoutUser(); setIsMobileDrawerOpen(false); }} className="flex items-center gap-2 px-3 py-3.5 text-[15px] font-bold text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 text-left w-full">
                  <FiLogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 pt-2 px-1">
                <button onClick={() => { setIsMobileDrawerOpen(false); setIsLoginOpen(true); }} className="px-6 py-3 border-2 border-[#F57C00] text-[#F57C00] font-bold rounded-xl text-center">
                  Sign In
                </button>
                <button onClick={() => { setIsMobileDrawerOpen(false); setIsRegisterOpen(true); }} className="bg-[#F57C00] text-white px-6 py-3 rounded-xl text-center font-bold shadow-md">
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile + Profile backdrop */}
        {(isProfileOpen || isMobileDrawerOpen) && (
          <div
            className="fixed inset-0 z-[40] bg-black/10 md:bg-transparent"
            onClick={() => { setIsProfileOpen(false); setIsMobileDrawerOpen(false); }}
          />
        )}
      </nav>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onSwitchToRegister={openRegister} />
      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} onSwitchToLogin={openLogin} />
    </>
  );
};

export default PublicNavbar;