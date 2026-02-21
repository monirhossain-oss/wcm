'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  FiUsers,
  FiCheckCircle,
  FiLayout,
  FiShield,
  FiGrid,
  FiArrowLeft,
  FiMenu,
  FiLogOut,
  FiEdit,
  FiUser,
} from 'react-icons/fi';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logoutUser, user, loading } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'admin') {
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
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: FiGrid },
    { name: 'Users', path: '/admin/users', icon: FiUsers },
    { name: 'Approvals', path: '/admin/requests', icon: FiCheckCircle },
    { name: 'Listings', path: '/admin/listings', icon: FiLayout },
  ];

  const profileImage = user?.profile?.profileImage
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${user.profile.profileImage}?t=${new Date().getTime()}`
    : '/default-avatar.png';

  const SidebarContent = () => (
    <>
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3 font-black text-lg tracking-tighter">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <FiShield size={20} />
          </div>
          <span className="text-[#1f1f1f] dark:text-white uppercase">WCM</span>
          <span className="text-orange-500 uppercase font-black">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        <p className="px-6 text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
          Core Management
        </p>
        {menuItems.map((item) => {
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

      <div className="p-6 border-t border-gray-100 dark:border-white/5">
        <Link
          href="/profile"
          className="flex items-center gap-2 text-[9px] font-black text-gray-400 hover:text-orange-500 transition-colors uppercase tracking-widest"
        >
          <FiArrowLeft size={14} /> Back to Gateway
        </Link>
      </div>
    </>
  );

  return (
    <div className="h-screen bg-gray-50/50 dark:bg-[#0a0a0a] flex overflow-hidden">
      {/* Sidebar - Light mode border fixed */}
      <aside className="w-64 bg-white dark:bg-[#0c0c0c] border-r border-gray-100 dark:border-white/5 hidden lg:flex flex-col">
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Header - Light mode border fixed */}
        <header className="h-20 bg-white/80 dark:bg-[#0c0c0c]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 flex items-center justify-between px-6 md:px-10 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2.5 bg-gray-50 dark:bg-white/5 rounded-lg lg:hidden"
            >
              <FiMenu size={18} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <h1 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-400">
                System Active
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-5" ref={dropdownRef}>
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-tight leading-none mb-1 text-[#1f1f1f] dark:text-white">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-[8px] font-bold text-orange-500 uppercase bg-orange-500/10 px-2 py-0.5 rounded-md">
                Superuser
              </span>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="h-11 w-11 rounded-xl bg-gray-100 dark:bg-white/5 p-0.5 border border-transparent hover:border-orange-500 transition-all overflow-hidden shadow-sm"
              >
                <img
                  src={profileImage}
                  alt="admin"
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-4 w-60 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] p-2 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-4 border-b border-gray-50 dark:border-white/5 mb-2">
                    <p className="text-[10px] font-black uppercase text-[#1f1f1f] dark:text-white">
                      {user?.email}
                    </p>
                    <p className="text-[8px] font-bold text-gray-400 uppercase mt-1">
                      Admin Access Node
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
                    <FiLogOut size={16} /> Exit Terminal
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Area */}
        <main className="flex-1 overflow-y-auto scrollbar-hide p-6 md:p-10">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-[#0c0c0c] flex flex-col animate-in slide-in-from-left duration-300 shadow-2xl">
            <SidebarContent />
          </aside>
        </div>
      )}
    </div>
  );
}
