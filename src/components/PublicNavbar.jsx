'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import LoginModal from './LoginModal';
import RegisterModal from './RegistationModal';

const PublicNavbar = () => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Modal States
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const { user, logoutUser } = useAuth();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Discover', href: '/discover' },
    { name: 'Cultures', href: '/cultures' },
    { name: 'Categories', href: '/categories' },
    { name: 'Regions', href: '/regions' },
    { name: 'Creators', href: '/creators' },
    { name: 'About Us', href: '/aboutUs' },
    { name: 'Blogs', href: '/blogs' },
  ];

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'creator') return '/creator';
    return '/profile';
  };

  // Modal Switching Logic
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
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-sm font-medium transition-all duration-200 pb-1 border-b-2
                    ${isActive
                        ? 'text-[#F57C00] border-[#F57C00]'
                        : 'border-transparent hover:text-[#F57C00]'
                      }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
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
                        onClick={logoutUser}
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
          className={`fixed top-0 right-0 h-full w-2/3 bg-white dark:bg-[#0a0a0a] shadow-2xl transform transition-transform duration-300 md:hidden z-[100] ${isMobileDrawerOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
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
                <button onClick={logoutUser} className="text-left text-red-500 font-bold">Logout</button>
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

        {/* Backdrop for Profile & Mobile Menu */}
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

      {/* Auth Modals */}
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