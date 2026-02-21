"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  FaBars,
  FaBell,
  FaUserShield,
  FaUniversity,
  FaHistory,
  FaUsers,
  FaEdit,
} from "react-icons/fa";
import { LayoutDashboard, Map, ShieldAlert, Settings, ShieldIcon } from "lucide-react";

export default function NationalAdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // National Admin Menu
  const menuItems = [
    { 
      icon: <LayoutDashboard size={20} />, 
      label: "Case OverVeiw", 
      path: "/dashboard/admin" 
    },
    { 
      icon: <Map size={20} />, 
      label: "managingList", 
      path: "/dashboard/admin/managingList" 
    },
  
 
  ];

  const isActive = (path) => {
    if (path === "/dashboard/institute") return pathname === path;
    return pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 mx-auto">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition"
            >
              <FaBars size={20} />
            </button>
            {/* <h1 className="text-xl font-bold text-blue-900">NARS National</h1> */}
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition">
              <FaBell className="text-gray-600" size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex pt-16 lg:pt-0">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-72 bg-slate-900 text-slate-300 h-screen sticky top-0">
          <div className="p-6 border-b border-slate-800">
            <Link href={"/"} className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <ShieldIcon className="text-red-500" size={24} />
                <h1 className="text-2xl font-bold text-white tracking-tight">WCM</h1>
              </div>
             
            </Link>
          </div>
          
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive(item.path)
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span className={`${isActive(item.path) ? "text-white" : "text-slate-500 group-hover:text-blue-400"} transition-colors`}>
                      {item.icon}
                    </span>
                    <span className="font-medium text-[15px]">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile Section */}
          <div className="p-4 border-t border-slate-800">
            <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl border border-slate-700">
             
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
            <aside className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-slate-900 z-50 shadow-2xl transition-transform duration-300">
              <div className="p-6 border-b border-slate-800">
                 <h1 className="text-2xl font-bold text-white">WCM</h1>
              </div>
              <nav className="p-4 overflow-y-auto h-full">
                <ul className="space-y-2">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.path}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                          isActive(item.path)
                            ? "bg-blue-600 text-white"
                            : "text-slate-400 hover:bg-slate-800"
                        }`}
                      >
                        <span>{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          </>
        )}

        {/* Main Content Area */}
        <main className="flex-1 mx-auto">
          {/* Top Desktop Header */}
          <div className="hidden lg:block sticky top-0 z-40 bg-white border-b border-slate-200">
            <div className="flex items-center justify-between px-8 py-7">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                   Admin Dashboard
                </h2>
                
              </div>

            
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}