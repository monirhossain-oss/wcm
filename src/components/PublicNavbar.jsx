'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiUser, FiLogOut, FiHeart, FiChevronDown } from 'react-icons/fi';
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

  // Ref for desktop category dropdown (click outside to close)
  const categoryRef = useRef(null);

  const menuItems = [
    { name: 'Explore', href: '/discover' },
    { name: 'Categories', href: null }, // href null = no navigation, only dropdown
    { name: 'Creators', href: '/creators' },
    { name: 'About', href: '/aboutUs' },
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
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Click outside handler for desktop dropdown
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

  const openLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const openRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  // ---- Category Dropdown Content (shared between desktop & mobile) ----
  const CategoryDropdownContent = ({ onSelect }) => (
    <>
      {isLoadingCategories ? (
        <div className="px-4 py-3 text-xs text-gray-400 italic">Loading categories...</div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 gap-0.5">
          {categories.slice(0, 15).map((cat) => (
            <Link
              key={cat._id || cat.id}
              href={`/discover?category=${encodeURIComponent(cat.title || cat.name)}`}
              className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-white/5 hover:text-[#F57C00] rounded-lg transition-all duration-150 group"
              onClick={onSelect}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-[#F57C00] transition-colors flex-shrink-0" />
              {cat.title || cat.name}
            </Link>
          ))}
        </div>
      ) : (
        <div className="px-4 py-3 text-xs text-gray-400">No categories found</div>
      )}

      <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
        <Link
          href="/discover"
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-[#F57C00] hover:bg-orange-50 dark:hover:bg-white/5 rounded-lg transition-all"
          onClick={onSelect}
        >
          Browse All Categories
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </>
  );

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
                        {item.name}
                        <FiChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {/* Desktop Dropdown */}
                      {isCategoryDropdownOpen && (
                        <div className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-60 bg-white dark:bg-[#141414] shadow-2xl border border-gray-100 dark:border-gray-800 rounded-2xl py-2 px-2 z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                          {/* Decorative top arrow */}
                          <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-[#141414] border-l border-t border-gray-100 dark:border-gray-800 rotate-45" />

                          <p className="px-3 pt-1 pb-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600">
                            Browse by Category
                          </p>

                          <CategoryDropdownContent onSelect={() => setIsCategoryDropdownOpen(false)} />
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

            {/* Heart (Wishlist) Icon */}
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
          className={`fixed top-0 right-0 h-full w-2/3 bg-white dark:bg-[#0a0a0a] shadow-2xl transform transition-transform duration-300 md:hidden z-[100] overflow-y-auto ${isMobileDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
            <span className="font-bold text-[#F57C00] uppercase tracking-widest text-sm">Menu</span>
            <FiX
              className="text-2xl cursor-pointer text-gray-500"
              onClick={() => setIsMobileDrawerOpen(false)}
            />
          </div>

          <div className="flex flex-col p-4">
            {menuItems.map((item) => {
              if (item.name === 'Categories') {
                return (
                  <div key={item.name}>
                    {/* Categories toggle button */}
                    <button
                      type="button"
                      onClick={() => setIsMobileCategoryOpen((prev) => !prev)}
                      className={`w-full flex items-center justify-between px-2 py-3.5 text-lg font-medium rounded-xl transition-colors
                        ${isMobileCategoryOpen ? 'text-[#F57C00] bg-orange-50 dark:bg-white/5' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                    >
                      <span>Categories</span>
                      <FiChevronDown
                        className={`w-5 h-5 transition-transform duration-300 ${isMobileCategoryOpen ? 'rotate-180 text-[#F57C00]' : ''}`}
                      />
                    </button>

                    {/* Mobile Category Accordion */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${isMobileCategoryOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                      <div className="mt-1 mb-2 ml-2 bg-gray-50 dark:bg-white/3 rounded-xl border border-gray-100 dark:border-gray-800 p-2">
                        <p className="px-3 pt-2 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          Browse by Category
                        </p>
                        <CategoryDropdownContent
                          onSelect={() => {
                            setIsMobileCategoryOpen(false);
                            setIsMobileDrawerOpen(false);
                          }}
                        />
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
                  className={`px-2 py-3.5 text-lg font-medium rounded-xl transition-colors
                    ${pathname === item.href
                      ? 'text-[#F57C00] bg-orange-50 dark:bg-white/5'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                >
                  {item.name}
                </Link>
              );
            })}

            {/* Mobile Wishlist Link */}
            {user && (
              <Link
                href="/favorites"
                onClick={() => setIsMobileDrawerOpen(false)}
                className={`flex items-center gap-2 px-2 py-3.5 text-lg font-medium rounded-xl transition-colors
                  ${pathname === '/favorites'
                    ? 'text-red-500 bg-red-50 dark:bg-red-500/10'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
              >
                <FiHeart /> Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </Link>
            )}

            <hr className="border-gray-100 dark:border-gray-800 my-3" />

            {user ? (
              <div className="flex flex-col gap-2">
                <Link
                  href={getDashboardLink()}
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="px-2 py-3.5 text-lg font-medium text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { logoutUser(); setIsMobileDrawerOpen(false); }}
                  className="text-left px-2 py-3.5 text-red-500 font-bold text-lg rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-2">
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
          />
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