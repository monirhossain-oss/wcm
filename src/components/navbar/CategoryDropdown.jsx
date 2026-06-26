'use client';

// src/components/navbar/CategoryDropdown.jsx
// Owns: desktop nav links + the "Categories" mega dropdown + its backdrop.
// Isolated state — opening this dropdown does not re-render MobileDrawer,
// ProfileMenu, or AuthButtons.

import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FiChevronDown } from 'react-icons/fi';
import { createSlug } from './utils';

const CategoryDropdown = ({ categories, menuItems }) => {
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const categoryRef = useRef(null);
    const pathname = usePathname();

    // Listener is only attached while the dropdown is actually open —
    // avoids a permanently-live document listener doing nothing 99% of the time.
    useEffect(() => {
        if (!isCategoryDropdownOpen) return;

        const handleClickOutside = (e) => {
            if (categoryRef.current && !categoryRef.current.contains(e.target)) {
                setIsCategoryDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isCategoryDropdownOpen]);

    return (
        <>
            {menuItems.map((item) => {
                const isActive = pathname === item.href;

                if (item.name === 'Categories') {
                    return (
                        <div key={item.name} className="relative" ref={categoryRef}>
                            <button
                                type="button"
                                onClick={() => setIsCategoryDropdownOpen((prev) => !prev)}
                                className={`text-sm font-medium transition-all duration-200 pb-1 border-b-2 flex items-center gap-1 outline-none
                  ${isCategoryDropdownOpen ? 'text-[#F57C00] border-[#F57C00]' : 'border-transparent hover:text-[#F57C00]'}`}
                            >
                                Categories
                                <FiChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isCategoryDropdownOpen && (
                                <div className="fixed left-0 right-0 top-[79px] bg-white dark:bg-[#111111] border-t border-b border-gray-100 dark:border-gray-800 shadow-2xl z-[200] animate-in fade-in slide-in-from-top-1 duration-200">
                                    <div className="max-w-7xl mx-auto px-6 py-2">
                                        <div
                                            className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 max-h-[340px] overflow-y-auto pr-1"
                                            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(156,163,175,0.5) transparent' }}
                                        >
                                            {categories.map((cat) => (
                                                <Link
                                                    key={cat._id || cat.id}
                                                    href={`/explore/${createSlug(cat.title || cat.name)}`}
                                                    onClick={() => setIsCategoryDropdownOpen(false)}
                                                    className="group flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-[#F57C00]/40 hover:bg-orange-50 dark:hover:bg-orange-500/5 transition-all duration-150 cursor-pointer"
                                                >
                                                    <span className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700 group-hover:bg-[#F57C00] flex-shrink-0 transition-colors duration-150" />
                                                    <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 group-hover:text-[#F57C00] truncate transition-colors duration-150 leading-tight">
                                                        {cat.title || cat.name}
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                }

                return (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`text-sm font-medium transition-all duration-200 pb-1 border-b-2
              ${isActive ? 'text-[#F57C00] border-[#F57C00]' : 'border-transparent hover:text-[#F57C00]'}`}
                    >
                        {item.name}
                    </Link>
                );
            })}

            {/* Backdrop — only mounted while dropdown is open */}
            {isCategoryDropdownOpen && (
                <div
                    className="fixed inset-0 top-[79px] z-[190] bg-black/20 dark:bg-black/40 backdrop-blur-[1px]"
                    onClick={() => setIsCategoryDropdownOpen(false)}
                />
            )}
        </>
    );
};

export default CategoryDropdown;