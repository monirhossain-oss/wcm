"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";

const PublicNavbar = ({ isLoggedIn }) => {
  const [showLogo, setShowLogo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Scroll effect for logo visibility
  useEffect(() => {
    const handleScroll = () => setShowLogo(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = ["Discover", "Cultures", "Categories", "Regions", "Creators"];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white dark:bg-[#0a0a0a] border-b border-[#F2F2F2] dark:border-[#1F1F1F] z-50">
      <div className="flex items-center justify-between px-6 py-4 relative">

        {/* Left: Logo */}
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-semibold text-[#F57C00] dark:text-[#F57C00]">
            WCM
          </h1>
          <div
            className={`hidden md:flex items-center transition-all duration-500 ${showLogo ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
          >
            <span className="text-xl text-[#7A1E1E] font-semibold">
              World Culture Marketplace
            </span>
          </div>
        </div>

        {/* Center: Nav or Search */}
        <div className="flex-1 flex items-center justify-center relative">
          {showSearch ? (
            <form
              className="relative w-full max-w-[70%]"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="text"
                placeholder="Search cultures, products, creators…"
                className="w-full border-b-2 border-[#F57C00] bg-transparent text-[#1F1F1F] dark:text-white placeholder-gray-400 py-2 pr-20 focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-medium text-[#F57C00]"
              >
                Search
              </button>
            </form>
          ) : (
            <div
              className={`hidden md:flex space-x-6 transition-all duration-500 ${showLogo ? "translate-x-12" : "translate-x-0"
                }`}
            >
              {menuItems.map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-sm font-medium text-[#1F1F1F] dark:text-white hover:text-[#F57C00] transition"
                >
                  {item}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center space-x-3">
          {showSearch ? (
            <FiX
              className="cursor-pointer h-9 w-9 p-2 rounded-full border border-[#F57C00] text-[#F57C00]"
              onClick={() => setShowSearch(false)}
            />
          ) : (
            <FiSearch
              className="cursor-pointer h-9 w-9 p-2 rounded-full hover:bg-[#F2F2F2] dark:hover:bg-[#1F1F1F]"
              onClick={() => setShowSearch(true)}
            />
          )}

          {isLoggedIn ? (
            <Link
              href="/creator"
              className="hidden md:block px-4 py-2 rounded-lg bg-[#F57C00] text-white text-sm font-medium hover:opacity-90"
            >
              Become a Creator
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden md:block px-4 py-2 rounded-lg border border-[#F57C00] text-[#F57C00] text-sm font-medium hover:bg-[#F57C00] hover:text-white transition"
            >
              Login
            </Link>
          )}

          <FiMenu
            className="cursor-pointer h-9 w-9 p-2 rounded-full hover:bg-[#F2F2F2] dark:hover:bg-[#1F1F1F] md:hidden"
            onClick={() => setIsMobileDrawerOpen(true)}
          />
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-2/3 bg-white dark:bg-[#0a0a0a] transform transition-transform duration-300 z-50 md:hidden ${isMobileDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex justify-end p-4">
          <FiX
            className="text-2xl cursor-pointer"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
        </div>

        <div className="flex flex-col space-y-4 px-6">
          {menuItems.map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="text-sm font-medium text-[#1F1F1F] dark:text-white hover:text-[#F57C00]"
            >
              {item}
            </Link>
          ))}

          {isLoggedIn ? (
            <Link
              href="/creator"
              className="mt-4 px-4 py-2 rounded-lg bg-[#F57C00] text-white text-center"
            >
              Become a Creator
            </Link>
          ) : (
            <Link
              href="/login"
              className="mt-4 px-4 py-2 rounded-lg border border-[#F57C00] text-[#F57C00] text-center"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
