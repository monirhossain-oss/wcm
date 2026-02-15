"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";

const PublicNavbar = ({ isLoggedIn }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const menuItems = ["Discover", "Cultures", "Categories", "Regions", "Creators"];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white dark:bg-[#0a0a0a] border-b border-[#F2F2F2] dark:border-[#1F1F1F] z-50">
      <div className="flex items-center justify-between px-6 py-4">

        {/* Left */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="cursor-pointer">
            <Image
              src="/wc,-web-logo.png"
              alt="Logo"
              width={100}
              height={100}
              className="brightness-125"
            />
          </Link>
        </div>

        {/* Center */}
        <div className="flex-1 flex justify-center">
          {showSearch ? (
            <form
              className="relative w-full max-w-[70%]"
              onSubmit={(e) => e.preventDefault()}
            >
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
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-sm font-medium hover:text-[#F57C00]"
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
              className="h-9 w-9 p-2 cursor-pointer"
              onClick={() => setShowSearch(false)}
            />
          ) : (
            <FiSearch
              className="h-9 w-9 p-2 cursor-pointer"
              onClick={() => setShowSearch(true)}
            />
          )}

          {isLoggedIn ? (
            <Link
              href="/creator"
              className="hidden md:block px-4 py-2 rounded-lg bg-[#F57C00] text-white text-sm"
            >
              Become a Creator
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="hidden md:block px-4 py-2 rounded-lg border border-[#F57C00] text-[#F57C00] text-sm"
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
        className={`fixed top-0 right-0 h-full w-2/3 bg-white dark:bg-[#0a0a0a] transform transition-transform duration-300 md:hidden ${isMobileDrawerOpen ? "translate-x-0" : "translate-x-full"
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
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
