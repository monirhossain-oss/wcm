'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FiGrid, FiList, FiPlus, FiUser, FiLogOut, FiArrowLeft, FiMenu, FiX, FiActivity } from 'react-icons/fi';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imageHelper';
import { DollarSign } from 'lucide-react';

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
      <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-[#050505]">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || user.role !== 'creator') return null;

  const navItems = [
    { name: 'Overview', path: '/creator', icon: FiGrid },
    { name: 'Ad Promotions', path: '/creator/promotions', icon: DollarSign },
    { name: 'Transactions', path: '/creator/transactions', icon: DollarSign },
    { name: 'My Listings', path: '/creator/listings', icon: FiList },
    { name: 'Add Listing', path: '/creator/add', icon: FiPlus },
  ];

  const profileImage = user?.profile?.profileImage
    ? getImageUrl(user.profile.profileImage, 'avatar')
    : '/default-avatar.png';

  const SidebarContent = () => (
    <>
      <div className="h-20 flex items-center px-8 border-b border-gray-100 dark:border-white/5">
        <Link href="/" className="cursor-pointer">
          <Image src="/wc,-web-logo.png" alt="Logo" width={90} height={90} className="dark:hidden h-auto w-auto" />
          <Image src="/wc,-web-white.png" alt="Logo" width={90} height={90} className="hidden dark:block h-auto w-auto" />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
        <div>
          <p className="px-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">
            Creator Terminal
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all group ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-white' : 'group-hover:text-orange-500'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <p className="px-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">
            Navigation
          </p>
          <Link
            href="/"
            className="flex items-center gap-4 px-4 py-3 rounded-sm text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-orange-500 transition-all"
          >
            <FiArrowLeft size={14} /> Go to Marketplace
          </Link>
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-black/20 border-t border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
          <span className="text-[8px] font-black uppercase tracking-tighter text-gray-400">Mode: Creator Active</span>
        </div>
      </div>
    </>
  );

  return (
    <div className="h-screen bg-white dark:bg-[#080808] flex overflow-hidden font-sans">
      {/* 🔹 Sidebar (Desktop) */}
      <aside className="w-64 bg-white dark:bg-[#0c0c0c] border-r border-gray-100 dark:border-white/5 hidden lg:flex flex-col z-50">
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* 🔹 Header */}
        <header className="h-20 bg-white/80 dark:bg-[#0c0c0c]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 flex items-center justify-between px-6 md:px-10 z-40">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-gray-600 dark:text-gray-300">
            <FiMenu size={20} />
          </button>

          <div className="flex items-center gap-6 ml-auto" ref={dropdownRef}>
            <div className="hidden md:flex items-center gap-3 pr-6 border-r border-gray-100 dark:border-white/10">
               <FiActivity className="text-orange-500" size={16} />
               <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest leading-none text-gray-400">Account Type</span>
                  <span className="text-[10px] font-black uppercase text-black dark:text-white mt-1">Verified Creator</span>
               </div>
            </div>

            <div className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-3 group">
                <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-white/5 p-0.5 border border-gray-200 dark:border-white/10 group-hover:border-orange-500 transition-all overflow-hidden shadow-sm">
                  <img src={profileImage} alt="creator" className="w-full h-full object-cover rounded-full" />
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-sm shadow-2xl p-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-gray-50 dark:border-white/5 mb-1">
                    <p className="text-[10px] font-black uppercase text-black dark:text-white truncate">{user?.email}</p>
                    <p className="text-[8px] font-bold text-gray-400 uppercase mt-1 tracking-widest">Active Workspace</p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition-all rounded-sm"
                  >
                    <FiUser size={14} /> My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5 transition-all rounded-sm"
                  >
                    <FiLogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 🔹 Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#fafafa] dark:bg-[#080808] p-6 md:p-8 scrollbar-hide">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* 🔹 Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-100 lg:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white dark:bg-[#0c0c0c] flex flex-col shadow-2xl animate-in slide-in-from-left duration-300 border-r border-white/10">
             <div className="flex justify-end p-4">
                <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400"><FiX size={24} /></button>
             </div>
            <SidebarContent />
          </aside>
        </div>
      )}
    </div>
  );
}