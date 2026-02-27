'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FiGrid, FiList, FiPlus, FiUser, FiLogOut, FiArrowLeft, FiMenu, FiX } from 'react-icons/fi';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imageHelper';

export default function CreatorLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logoutUser } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'creator') {
        router.replace('/');
      }
    }
  }, [user, loading, router]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || user.role !== 'creator') return null;

  const navItems = [
    { name: 'Overview', path: '/creator', icon: FiGrid },
    { name: 'My Listings', path: '/creator/listings', icon: FiList },
    { name: 'Add Listings', path: '/creator/add', icon: FiPlus },
  ];

  const profileImage = user?.profile?.profileImage
    ? getImageUrl(user.profile.profileImage)
    : '/default-avatar.png';

  const SidebarContent = () => (
    <>
      <div className="p-6 flex items-center justify-between">
       
         <Link href="/" className="cursor-pointer">
            {/* Light Mode Logo */}
            <Image
              src="/wc,-web-logo.png"
              alt="Logo Light"
              width={100}
              height={100}
              className="dark:hidden brightness-125 h-auto w-auto"
            />
            {/* Dark Mode Logo */}
            <Image
               src="/wc,-web-white.png" 
                 alt="Logo Dark"
                 width={100}
                height={100}
                className="hidden dark:block brightness-125 h-auto w-auto"
                />
          </Link>
        
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden p-2 text-gray-500 hover:text-black dark:hover:text-white"
        >
          <FiX size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        <p className="px-6 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
          Command Center
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                isActive
                  ? 'bg-orange-500 text-white shadow-[0_10px_20px_-5px_rgba(249,115,22,0.3)]'
                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
              }`}
            >
              <Icon size={16} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-gray-100 dark:border-white/10">
        <Link
          href="/"
          className="flex items-center gap-2 text-[9px] font-black text-gray-400 hover:text-orange-500 transition-colors uppercase tracking-widest"
        >
          <FiArrowLeft size={14} /> Back to Gateway
        </Link>
      </div>
    </>
  );

  return (
    <div className="h-screen bg-gray-50/50 dark:bg-[#0a0a0a] flex overflow-hidden">
      {/* 🔹 Sidebar (Desktop) */}
      <aside className="w-64 bg-white dark:bg-white/5 border-r border-gray-100 dark:border-white/10 hidden lg:flex flex-col">
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* 🔹 Header */}
        <header className="h-20 bg-white/80 dark:bg-white/5 backdrop-blur-md border-b border-gray-100 dark:border-white/10 flex items-center justify-between lg:justify-end px-6 md:px-10 z-40">
          {/* Mobile Menu Toggle (Left side on Mobile) */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-300"
          >
            <FiMenu size={20} />
          </button>

          <div className="flex items-center gap-3" ref={dropdownRef}>
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-tight leading-none mb-1 text-[#1f1f1f] dark:text-white">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-[8px] font-bold text-orange-500 uppercase bg-orange-500/10 px-2 py-0.5 rounded-md">
                {user?.role}
              </span>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="h-11 w-11 rounded-full bg-gray-100 dark:bg-white/5 p-0.5 border border-transparent hover:border-orange-500 transition-all overflow-hidden shadow-sm"
              >
                <img
                  src={profileImage}
                  alt="creator"
                  className="w-full h-full object-cover rounded-full"
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-4 w-60 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] p-2 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-gray-50 dark:border-white/10 mb-2">
                    <p className="text-[10px] font-black uppercase text-[#1f1f1f] dark:text-white truncate">
                      {user?.email}
                    </p>
                    <p className="text-[8px] font-bold text-gray-400 uppercase mt-1">
                      Creator Access Node
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition-all"
                  >
                    <FiUser size={16} className="text-orange-500" /> Identity Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5 transition-all mt-1"
                  >
                    <FiLogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 🔹 Main Content Area */}
        <main className="flex-1 overflow-y-auto scrollbar-hide p-6 md:p-10">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* 🔹 Mobile Sidebar (Overlay & Content) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-100 lg:hidden">
          {/* Backdrop/Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsSidebarOpen(false)}
          />
          {/* Side Content */}
          <aside className="absolute left-0 top-0 h-full w-72 bg-white dark:bg-[#0a0a0a] flex flex-col animate-in slide-in-from-left duration-300 shadow-2xl border-r border-gray-100 dark:border-white/10">
            <SidebarContent />
          </aside>
        </div>
      )}
    </div>
  );
}
