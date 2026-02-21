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
  FiX,
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

  // 🛡️ Protection Logic: লগইন না থাকলে বা অ্যাডমিন না হলে রিডাইরেক্ট
  useEffect(() => {
    if (!loading) {
      if (!user) {
        // লগইন করা না থাকলে হোম পেজে পাঠিয়ে দাও
        router.replace('/');
      } else if (user.role !== 'admin') {
        // লগইন করা আছে কিন্তু অ্যাডমিন না হলে হোম পেজে পাঠিয়ে দাও
        router.replace('/');
      }
    }
  }, [user, loading, router]);

  // ড্রপডাউনের বাইরে ক্লিক করলে বন্ধ হবে
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

  // ডাটা লোড হওয়ার সময় একটি সিম্পল লোডার দেখানো ভালো যাতে কন্টেন্ট ফ্লিকার না করে
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#fafafa] dark:bg-[#080808]">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // যদি ইউজার অ্যাডমিন না হয় তবে খালি রিটার্ন করো (ইফেক্ট রিডাইরেক্ট করবে)
  if (!user || user.role !== 'admin') return null;

  const menuItems = [
    { name: 'Overview', path: '/admin', icon: FiGrid },
    { name: 'User Management', path: '/admin/users', icon: FiUsers },
    { name: 'Creator Requests', path: '/admin/requests', icon: FiCheckCircle },
    { name: 'Manage Listings', path: '/admin/listings', icon: FiLayout },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-8">
        <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tighter">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white">
            <FiShield size={18} />
          </div>
          ADMIN<span className="text-orange-500">PANEL</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setIsSidebarOpen(false)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                isActive
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'text-gray-400 hover:bg-ui hover:text-black dark:hover:text-white'
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-8">
        <Link
          href="/profile"
          className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-orange-500 transition-colors"
        >
          <FiArrowLeft /> BACK TO PROFILE
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#080808] flex font-sans">
      {/* Desktop Sidebar */}
      <aside className="w-72 bg-white dark:bg-[#111] border-r border-ui hidden lg:flex flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-60 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
        <aside
          className={`absolute left-0 top-0 h-full w-72 bg-white dark:bg-[#111] transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col shadow-2xl`}
        >
          <SidebarContent />
        </aside>
      </div>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white/80 dark:bg-[#111]/80 backdrop-blur-md border-b border-ui flex items-center justify-between px-6 md:px-8 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 bg-ui rounded-xl lg:hidden hover:text-orange-500 transition-colors"
            >
              <FiMenu size={20} />
            </button>
            <h1 className="font-black text-xs md:text-sm uppercase tracking-[0.2em] hidden sm:block">
              Dashboard Control
            </h1>
          </div>

          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            <div className="text-right hidden sm:block">
              <p className="text-[11px] font-black uppercase leading-tight">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[9px] font-bold text-orange-500 uppercase tracking-widest italic">
                Super Admin
              </p>
            </div>

            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="h-10 w-10 rounded-full bg-ui border-2 border-transparent hover:border-orange-500 overflow-hidden transition-all active:scale-90 shadow-sm"
            >
              <img
                src={
                  user?.profile?.profileImage
                    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${user.profile.profileImage}`
                    : '/default-avatar.png'
                }
                alt="admin"
                className="w-full h-full object-cover"
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-3 w-56 bg-white dark:bg-[#111] border border-ui rounded-3xl shadow-2xl p-2 animate-in slide-in-from-top-2 duration-200">
                <Link
                  href="/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:bg-ui hover:text-black dark:hover:text-white transition-all"
                >
                  <FiUser size={16} className="text-orange-500" /> My Profile
                </Link>
                <Link
                  href="/profile?edit=true"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:bg-ui hover:text-black dark:hover:text-white transition-all"
                >
                  <FiEdit size={16} className="text-orange-500" /> Edit Details
                </Link>
                <div className="my-1 border-t border-ui" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                >
                  <FiLogOut size={16} /> Logout Account
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="p-4 md:p-8 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
