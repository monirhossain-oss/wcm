'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FiSearch, FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';

const PublicNavbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { user, logoutUser } = useAuth();

  const menuItems = [
    { name: 'Discover', href: '/discover' },
    { name: 'Cultures', href: '/cultures' },
    { name: 'Categories', href: '/categories' },
    { name: 'Regions', href: '/regions' },
    { name: 'Creators', href: '/creators' },
    { name: 'Blogs', href: '/blogs' },
  ];

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'creator') return '/creator';
    return '/profile';
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white dark:bg-[#0a0a0a] border-b border-[#F2F2F2] dark:border-[#1F1F1F] z-50">
      <div className="flex items-center justify-between px-6 py-1">
        {/* Left: Logo */}
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

        {/* Center: Menu or Search */}
        <div className="flex-1 flex justify-center">
          {showSearch ? (
            <form className="relative w-full max-w-[70%]" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Search cultures, products, creators…"
                className="w-full border-b-2 border-[#F57C00] bg-transparent py-2 pr-20 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-[#F57C00]"
              >
                Search
              </button>
            </form>
          ) : (
            <div className="hidden md:flex space-x-6">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium hover:text-[#F57C00] transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right: User Actions */}
        <div className="flex items-center space-x-3">
          {showSearch ? (
            <FiX className="h-9 w-9 p-2 cursor-pointer" onClick={() => setShowSearch(false)} />
          ) : (
            <FiSearch className="h-9 w-9 p-2 cursor-pointer" onClick={() => setShowSearch(true)} />
          )}

          {user ? (
            <div className="relative flex items-center space-x-2">
              {user.role === 'user' && (
                <Link
                  href="/become-creator"
                  className="hidden md:block px-4 py-2 rounded-lg bg-[#F57C00] text-white text-xs font-bold"
                >
                  Become a Creator
                </Link>
              )}

              <div>
                <div
                  className="flex items-center space-x-2 cursor-pointer p-1 pr-3 rounded-full border border-gray-200 dark:border-gray-800"
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
                  <div className="absolute top-12 right-0 w-48 bg-white dark:bg-[#1a1a1a] shadow-xl border border-gray-100 dark:border-gray-800 rounded-xl py-2 z-60">
                    <Link
                      href={getDashboardLink()}
                      className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      {user?.role === 'admin'
                        ? 'Admin Dashboard'
                        : user?.role === 'creator'
                          ? 'Creator Dashboard'
                          : 'Profile'}
                    </Link>
                    <button
                      onClick={logoutUser}
                      className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <FiLogOut /> <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="hidden md:block px-6 py-2 rounded-lg border border-[#F57C00] text-[#F57C00] text-sm font-bold hover:bg-[#F57C00] hover:text-white transition-all"
            >
              Login
            </Link>
          )}

          <FiMenu
            className="md:hidden h-9 w-9 p-2 cursor-pointer"
            onClick={() => setIsMobileDrawerOpen(true)}
          />
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-2/3 bg-white dark:bg-[#0a0a0a] shadow-2xl transform transition-transform duration-300 md:hidden z-100 ${
          isMobileDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
          <span className="font-bold text-[#F57C00]">Menu</span>
          <FiX className="text-2xl cursor-pointer" onClick={() => setIsMobileDrawerOpen(false)} />
        </div>

        <div className="flex flex-col space-y-4 p-6">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-lg font-medium"
              onClick={() => setIsMobileDrawerOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          <hr className="border-gray-100 dark:border-gray-800" />

          {user ? (
            <>
              <Link href={getDashboardLink()} onClick={() => setIsMobileDrawerOpen(false)}>
                {user?.role === 'admin'
                  ? 'Admin Dashboard'
                  : user?.role === 'creator'
                    ? 'Creator Dashboard'
                    : 'Profile'}
              </Link>
              <button onClick={logoutUser} className="text-left text-red-500">
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="text-[#F57C00] font-bold"
              onClick={() => setIsMobileDrawerOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Overlay for closing dropdown when clicking outside */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
      )}
    </nav>
  );
};

export default PublicNavbar;
