// src/components/navbar/utils.js
// No 'use client' / no 'use server' needed — plain JS module.
// Importable from both the Server Component (PublicNavbar) and the
// Client Components (CategoryDropdown, MobileDrawer) without duplication.

// Static nav config — defined once at module load, not recreated on every render.
export const menuItems = [
    { name: 'Explore', key: 'explore', href: '/explore' },
    { name: 'Categories', key: 'categories', href: null },
    { name: 'Creators', key: 'creators', href: '/creators' },
    { name: 'About', key: 'about', href: '/about-us' },
    { name: 'Blogs', key: 'blogs', href: '/blogs' },
];

// Pure function — safe to hoist out of any component body.
export const createSlug = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/&/g, '-and-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
};
