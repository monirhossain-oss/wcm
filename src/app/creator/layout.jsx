'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiPlus, FiGrid, FiList, FiLogOut, FiUser, FiShield } from 'react-icons/fi';

export default function CreatorLayout({ children }) {
  const { user, loading, logoutUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'creator') {
        router.replace('/');
      }
    }
  }, [user, loading, router]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center font-black uppercase tracking-widest text-xs animate-pulse">
        Loading Workspace...
      </div>
    );
  if (!user || user.role !== 'creator') return null;

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#080808] flex flex-col lg:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-white dark:bg-[#111] border-r border-ui flex flex-col sticky top-0 h-auto lg:h-screen z-20">
        <div className="p-8 border-b border-ui lg:border-none">
          <Link
            href="/"
            className="flex items-center gap-2 font-black text-xl tracking-tighter uppercase"
          >
            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black">
              <FiShield size={18} />
            </div>
            CREATOR<span className="text-orange-500">HUB</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-hidden gap-2 lg:gap-0">
          {[
            { name: 'Dashboard', path: '/creator', icon: FiGrid },
            { name: 'My Listings', path: '/creator/listings', icon: FiList },
            { name: 'Add Listing', path: '/creator/add', icon: FiPlus },
          ].map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-ui hover:text-black dark:hover:text-white transition-all whitespace-nowrap"
            >
              <item.icon size={18} /> {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-8 hidden lg:block border-t border-ui">
          <button
            onClick={logoutUser}
            className="flex items-center gap-3 text-[10px] font-black uppercase text-red-500 hover:opacity-70 transition-all"
          >
            <FiLogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 p-4 md:p-10 lg:p-16 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12 flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-2">
                Welcome Back
              </p>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
                {user.firstName} <span className="text-gray-300">Studio</span>
              </h1>
            </div>
          </header>
          {children}
        </div>
      </main>
    </div>
  );
}
