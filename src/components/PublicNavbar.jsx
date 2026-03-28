'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiUser, FiLogOut, FiHeart } from 'react-icons/fi'; // FiHeart যোগ করা হয়েছে
import { useAuth } from '@/context/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegistationModal';
import Link from 'next/link';
import axios from 'axios';

const PublicNavbar = () => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // উইশলিস্ট কাউন্ট স্টেট (এটি পরে আপনার Context থেকে আসবে)
  const [wishlistCount, setWishlistCount] = useState(0);

  // ক্যাটাগরি স্টেট
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Modal States
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const { user, logoutUser } = useAuth();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Explore', href: '/discover' },
    { name: 'Categories', href: '/categories' },
    { name: 'Creators', href: '/creators' },
    { name: 'About Us', href: '/aboutUs' },
    { name: 'Blogs', href: '/blogs' },
  ];

  // API থেকে ক্যাটাগরি ফেচ করা
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await axios.get(`${baseUrl}/api/admin/categories`);
        const fetchedData = Array.isArray(response.data) ? response.data : response.data.data;
        setCategories(fetchedData || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'creator') return '/creator';
    return '/profile';
  };

  const openLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const openRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white dark:bg-[#0a0a0a] z-50 border-b border-gray-100 dark:border-gray-900">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6 h-20">

          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="cursor-pointer">
              <Image
                src="/wc,-web-logo.png"
                alt="Logo Light"
                width={100}
                height={100}
                className="dark:hidden brightness-125 h-auto w-auto"
              />
              <Image
                src="/wc,-web-white.png"
                alt="Logo Dark"
                width={100}
                height={100}
                className="hidden dark:block brightness-125 h-auto w-auto"
              />
            </Link>
          </div>

          {/* Center Menu */}
          <div className="flex-1 flex justify-center">
            <div className="hidden md:flex space-x-6">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;

                if (item.name === 'Categories') {
                  return (
                    <div
                      key={item.name}
                      className="relative"
                      onMouseEnter={() => setIsCategoryDropdownOpen(true)}
                      onMouseLeave={() => setIsCategoryDropdownOpen(false)}
                    >
                      <button
                        type="button"
                        className={`text-sm font-medium transition-all duration-200 pb-1 border-b-2 flex items-center gap-1 cursor-default outline-none
                        ${isActive ? 'text-[#F57C00] border-[#F57C00]' : 'border-transparent hover:text-[#F57C00]'}`}
                      >
                        {item.name}
                        <svg className={`w-3 h-3 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </button>

                      {isCategoryDropdownOpen && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-52 bg-white dark:bg-[#121212] shadow-2xl border border-gray-100 dark:border-gray-800 rounded-xl py-2 z-[100] mt-0 animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="absolute -top-2 left-0 w-full h-2 bg-transparent"></div>

                          {isLoadingCategories ? (
                            <div className="px-4 py-2 text-xs text-gray-500 italic">Loading...</div>
                          ) : categories.length > 0 ? (
                            categories.slice(0, 15).map((cat) => (
                              <Link
                                key={cat._id || cat.id}
                                href={`/discover?category=${encodeURIComponent(cat.title || cat.name)}`}
                                className="block px-4 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-[#F57C00] transition-colors"
                                onClick={() => setIsCategoryDropdownOpen(false)}
                              >
                                {cat.title || cat.name}
                              </Link>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-xs text-gray-500">No categories found</div>
                          )}

                          <div className="border-t border-gray-100 dark:border-gray-800 my-1"></div>
                          <Link
                            href="/categories"
                            className="block px-4 py-2 text-xs font-bold text-[#F57C00] hover:bg-gray-50 dark:hover:bg-white/5 text-center"
                            onClick={() => setIsCategoryDropdownOpen(false)}
                          >
                            Browse All
                          </Link>
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

          {/* Right Side - Heart Icon, Auth & Profile */}
          <div className="flex items-center space-x-4">

            {/* 1. Heart (Wishlist) Icon - Only for Logged in Users */}
            {user && (
              <Link
                href="/favorites"
                className="relative p-2 group transition-all duration-200"
                title="My Wishlist"
              >
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
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <div className="bg-[#F57C00] p-1.5 rounded-full text-white">
                      <FiUser className="h-4 w-4" />
                    </div>
                    <span className="hidden lg:block text-xs font-semibold capitalize">
                      {user.username}
                    </span>
                  </div>

                  {isProfileOpen && (
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
                        <FiLogOut />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="px-5 py-2 border-2 border-[#F57C00] text-[#F57C00] font-bold text-sm rounded-xl hover:bg-[#F57C00] hover:text-white transition-all duration-300"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsRegisterOpen(true)}
                  className="px-5 py-2 rounded-lg bg-[#F57C00] text-white text-sm font-bold hover:bg-[#e67600] transition-all shadow-md active:scale-95"
                >
                  Sign Up
                </button>
              </div>
            )}

            <FiMenu
              className="md:hidden h-9 w-9 p-2 cursor-pointer text-gray-700 dark:text-gray-200"
              onClick={() => setIsMobileDrawerOpen(true)}
            />
          </div>
        </div>

        {/* Mobile Drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-2/3 bg-white dark:bg-[#0a0a0a] shadow-2xl transform transition-transform duration-300 md:hidden z-[100] ${isMobileDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
            <span className="font-bold text-[#F57C00] uppercase tracking-widest text-sm">Menu</span>
            <FiX
              className="text-2xl cursor-pointer text-gray-500"
              onClick={() => setIsMobileDrawerOpen(false)}
            />
          </div>

          <div className="flex flex-col space-y-4 p-6">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileDrawerOpen(false)}
                className={`text-lg font-medium ${pathname === item.href ? 'text-[#F57C00]' : 'text-gray-700 dark:text-gray-300'}`}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Wishlist Link */}
            {user && (
              <Link
                href="/wishlist"
                onClick={() => setIsMobileDrawerOpen(false)}
                className={`flex items-center gap-2 text-lg font-medium ${pathname === '/wishlist' ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}
              >
                <FiHeart /> Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </Link>
            )}

            <hr className="border-gray-100 dark:border-gray-800" />

            {user ? (
              <div className="flex flex-col space-y-4">
                <Link
                  href={getDashboardLink()}
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="text-lg font-medium text-gray-700 dark:text-gray-300"
                >
                  Dashboard
                </Link>
                <button onClick={() => { logoutUser(); setIsMobileDrawerOpen(false); }} className="text-left text-red-500 font-bold">Logout</button>
              </div>
            ) : (
              <div className="flex flex-col space-y-4 pt-4">
                <button
                  onClick={() => { setIsMobileDrawerOpen(false); setIsLoginOpen(true); }}
                  className="px-6 py-3 border-2 border-[#F57C00] text-[#F57C00] font-bold rounded-xl text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setIsMobileDrawerOpen(false); setIsRegisterOpen(true); }}
                  className="bg-[#F57C00] text-white px-6 py-3 rounded-xl text-center font-bold shadow-md"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Backdrop */}
        {(isProfileOpen || isMobileDrawerOpen) && (
          <div
            className="fixed inset-0 z-[40] bg-black/10 md:bg-transparent"
            onClick={() => {
              setIsProfileOpen(false);
              setIsMobileDrawerOpen(false);
            }}
          ></div>
        )}
      </nav>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={openRegister}
      />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={openLogin}
      />
    </>
  );
};

export default PublicNavbar;