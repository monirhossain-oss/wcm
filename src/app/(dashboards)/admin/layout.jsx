'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  FiUsers,
  FiCheckCircle,
  FiLayout,
  FiGrid,
  FiArrowLeft,
  FiMenu,
  FiLogOut,
  FiUser,
  FiX,
  FiSettings,
  FiShield,
  FiTag,
  FiLayers,
  FiDollarSign,
  FiTrendingUp,
  FiChevronDown,
  FiHelpCircle,
} from 'react-icons/fi';
import {
  MdOutlineNavigation,
  MdOutlineHome,
  MdOutlineInfo,
  MdOutlineWebAsset,
} from 'react-icons/md';
import { TbLayoutBottombar, TbLayoutBottombarCollapse, TbSeo } from 'react-icons/tb';
import Image from 'next/image';
import { getImageUrl } from '@/lib/imageHelper';
import { Sliders, TractorIcon } from 'lucide-react';
import { FaQ } from 'react-icons/fa6';
import { PiTrainRegional } from 'react-icons/pi';

// ── Submenu item definition
const customizerSubItems = [
  {
    name: 'Navbar Edit',
    path: '/admin/theme/navbar',
    icon: MdOutlineNavigation,
  },
  {
    name: 'Home Page Edit',
    path: '/admin/theme/home',
    icon: MdOutlineHome,
  },
  {
    name: 'Footer Edit',
    path: '/admin/theme/footer',
    icon: TbLayoutBottombar,
  },
  {
    name: 'About Page Edit',
    path: '/admin/theme/about',
    icon: MdOutlineInfo,
  },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logoutUser, user, loading } = useAuth();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(
    // keep open if currently on any theme sub-route
    pathname?.startsWith('/admin/theme') ?? false
  );
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'admin') {
        router.replace('/');
      }
    }
  }, [user, loading, router]);

  // auto-expand customizer submenu when navigating to a theme route
  useEffect(() => {
    if (pathname?.startsWith('/admin/theme')) {
      setCustomizerOpen(true);
    }
  }, [pathname]);

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
    router.push('/');
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-[#050505]">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  const menuItems = [
    { name: 'Overview', path: '/admin', icon: FiGrid },
    { name: 'User Management', path: '/admin/users', icon: FiUsers },
    { name: 'Creator Requests', path: '/admin/requests', icon: FiCheckCircle },
    { name: 'Global Listings', path: '/admin/listings', icon: FiLayout },
    { name: 'Manage Curated Collection', path: '/admin/manage-curated-collection', icon: FiLayout },
    { name: 'Promoted Assets', path: '/admin/listings/promoted', icon: FiTrendingUp },
    { name: 'All Transactions', path: '/admin/transactions', icon: FiDollarSign },
    { name: 'Audit Logs', path: '/admin/logs', icon: FiShield },
    { name: 'Manage Tags', path: '/admin/tags', icon: FiTag },
    { name: 'Manage Region', path: '/admin/region', icon: PiTrainRegional },
    { name: 'Manage Tradition', path: '/admin/tradition', icon: TractorIcon },
    { name: 'Categories', path: '/admin/categories', icon: FiLayers },
    { name: 'Manage Slider', path: '/admin/manage-slider', icon: Sliders },
    { name: 'Manage Blog', path: '/admin/blogs', icon: FiSettings },
    { name: 'Create Blog', path: '/admin/create-blog', icon: FiSettings },
    { name: 'Manage FAQ', path: '/admin/faq', icon: FaQ },
    { name: 'Manage How It Works', path: '/admin/manage-how-it-work', icon: FiHelpCircle },
    { name: 'Manage About', path: '/admin/manage-about', icon: MdOutlineInfo },
    { name: 'Manage Footer', path: '/admin/manage-footer', icon: TbLayoutBottombarCollapse },
    { name: 'Manage SEO', path: '/admin/seo-settings', icon: TbSeo },
  ];

  const profileImage = user?.profile?.profileImage
    ? getImageUrl(user.profile.profileImage, 'avatar')
    : '/default-avatar.png';

  const isThemeActive = pathname?.startsWith('/admin/theme');

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="h-20 flex items-center px-8 border-b border-gray-100 dark:border-white/5">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/wc,-web-logo.png"
            alt="Logo"
            width={90}
            height={90}
            className="dark:hidden h-auto w-auto"
          />
          <Image
            src="/wc,-web-white.png"
            alt="Logo"
            width={90}
            height={90}
            className="hidden dark:block h-auto w-auto"
          />
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
        {/* Main nav */}
        <div>
          <p className="px-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">
            Main Terminal
          </p>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-4 px-4 py-3 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all group ${isActive
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
                    }`}
                >
                  <Icon
                    size={14}
                    className={isActive ? 'text-white' : 'group-hover:text-orange-500'}
                  />
                  {item.name}
                </Link>
              );
            })}

            {/* ── Website Customizer with submenu ── */}
            <div>
              <button
                onClick={() => setCustomizerOpen((p) => !p)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all group ${isThemeActive
                  ? 'bg-orange-500/10 text-orange-500 dark:text-orange-400'
                  : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
                  }`}
              >
                <FiSettings
                  size={14}
                  className={
                    isThemeActive ? 'text-orange-500' : 'group-hover:text-orange-500'
                  }
                />
                <span className="flex-1 text-left">Website Customizer</span>
                <FiChevronDown
                  size={13}
                  className={`transition-transform duration-300 ${customizerOpen ? 'rotate-180' : ''
                    } ${isThemeActive ? 'text-orange-400' : 'text-gray-400'}`}
                />
              </button>

              {/* Submenu */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${customizerOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                <div className="ml-4 mt-1 pl-4 border-l border-orange-500/20 dark:border-orange-500/15 space-y-0.5 py-1">
                  {customizerSubItems.map((sub) => {
                    const SubIcon = sub.icon;
                    const isSubActive = pathname === sub.path;
                    return (
                      <Link
                        key={sub.path}
                        href={sub.path}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all group ${isSubActive
                          ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                          : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
                          }`}
                      >
                        <SubIcon
                          size={13}
                          className={
                            isSubActive ? 'text-white' : 'group-hover:text-orange-500'
                          }
                        />
                        {sub.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* System */}
        <div>
          <p className="px-4 text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4">
            System
          </p>
          <Link
            href="/"
            className="flex items-center gap-4 px-4 py-3 rounded-sm text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-orange-500 transition-all"
          >
            <FiArrowLeft size={14} /> Go to Marketplace
          </Link>
        </div>
      </div>

      {/* Status bar */}
      <div className="p-4 bg-gray-50 dark:bg-black/20 border-t border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[8px] font-black uppercase tracking-tighter text-gray-400">
            Node Status: Online
          </span>
        </div>
      </div>
    </>
  );

  return (
    <div className="h-screen bg-white dark:bg-[#080808] flex overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white dark:bg-[#0c0c0c] border-r border-gray-100 dark:border-white/5 hidden lg:flex flex-col z-50">
        <SidebarContent />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Header */}
        <header className="h-20 bg-white/80 dark:bg-[#0c0c0c]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 flex items-center justify-between px-4 md:px-8 z-40">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-600 dark:text-gray-300"
          >
            <FiMenu size={20} />
          </button>

          <div className="flex items-center gap-6 ml-auto" ref={dropdownRef}>
            <div className="hidden md:flex items-center gap-3 pr-6 border-r border-gray-100 dark:border-white/10">
              <FiShield className="text-orange-500" size={16} />
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest leading-none text-gray-400">
                  Auth Level
                </span>
                <span className="text-[10px] font-black uppercase text-black dark:text-white mt-1">
                  Super Admin
                </span>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 group"
              >
                <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-white/5 p-0.5 border border-gray-200 dark:border-white/10 group-hover:border-orange-500 transition-all overflow-hidden relative">
                  <Image
                    src={profileImage}
                    alt="admin profile"
                    fill
                    sizes="40px"
                    className="object-cover rounded-full"
                    priority
                  />
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-sm shadow-2xl p-1 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-gray-50 dark:border-white/5 mb-1">
                    <p className="text-[10px] font-black uppercase text-black dark:text-white truncate">
                      {user?.email}
                    </p>
                    <p className="text-[8px] font-bold text-orange-500 uppercase mt-1 tracking-widest">
                      Active Session
                    </p>
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

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-[#fafafa] dark:bg-[#080808] p-4 md:p-8 scrollbar-hide">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-100 lg:hidden">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white dark:bg-[#0c0c0c] flex flex-col shadow-2xl animate-in slide-in-from-left duration-300 border-r border-white/10">
            <div className="flex justify-end p-4">
              <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400">
                <FiX size={24} />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}
    </div>
  );
}