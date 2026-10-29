"use client";

import { useState, useMemo } from 'react';
import { Search, Globe, LayoutGrid, X } from 'lucide-react';
import CustomDropdown from './CustomDropdown';
import CreatorCard from './CreatorCard';

export default function CreatorsClient({ initialCreators, categories }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCulture, setSelectedCulture] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const cultures = useMemo(() =>
        Array.from(new Set(initialCreators.map((c) => c.profile?.country).filter(Boolean))),
        [initialCreators]
    );

    const filteredCreators = useMemo(() => {
        return initialCreators.filter((creator) => {
            const searchTerm = searchQuery.toLowerCase();
            const fullName = `${creator.firstName || ''} ${creator.lastName || ''}`.toLowerCase();
            const country = (creator.profile?.country || '').toLowerCase();
            const bio = (creator.profile?.bio || '').toLowerCase();

            const matchesSearch = fullName.includes(searchTerm) || country.includes(searchTerm) || bio.includes(searchTerm);
            const matchesCulture = selectedCulture === '' || creator.profile?.country === selectedCulture;
            const creatorCatId = creator.profile?.category?._id || creator.profile?.category;
            const matchesCategory = selectedCategory === '' || String(creatorCatId) === String(selectedCategory);

            return matchesSearch && matchesCulture && matchesCategory;
        });
    }, [initialCreators, searchQuery, selectedCulture, selectedCategory]);

    const hasActiveFilter = searchQuery || selectedCulture || selectedCategory;

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCulture('');
        setSelectedCategory('');
    };

    return (
        <div className="min-h-screen bg-[#f8f7f4] dark:bg-[#0a0a0a] pb-24 transition-colors duration-300">

            {/* Hero Header */}
            <div className="relative overflow-hidden pt-6 pb-20 px-6">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-3xl" />
                    <div className="absolute top-12 left-10 w-2 h-2 rounded-full bg-orange-400 opacity-40" />
                    <div className="absolute top-20 right-20 w-1 h-1 rounded-full bg-orange-300 opacity-60" />
                    <div className="absolute bottom-10 left-1/4 w-1.5 h-1.5 rounded-full bg-orange-400 opacity-30" />
                </div>

                <div className="relative max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 dark:bg-orange-500/15 rounded-full border border-orange-500/20 mb-8">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-orange-600 dark:text-orange-400">
                            Global Creator Network
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-zinc-900 dark:text-white leading-[0.9] mb-6">
                        Discover
                        <br />
                        <span className="text-orange-500 italic">Creators</span>
                        <br />
                        <span className="text-zinc-400 dark:text-zinc-600 text-4xl md:text-5xl">Around the World</span>
                    </h1>

                    <p className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg max-w-xl mx-auto font-medium leading-relaxed">
                        Explore creators inspired by cultures and traditions worldwide
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-8 mt-10">
                        <div className="text-center">
                            <p className="text-2xl font-black text-zinc-900 dark:text-white">{initialCreators.length}+</p>
                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Creators</p>
                        </div>
                        <div className="w-px h-10 bg-zinc-200 dark:bg-white/10" />
                        <div className="text-center">
                            <p className="text-2xl font-black text-zinc-900 dark:text-white">{cultures.length}+</p>
                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Cultures</p>
                        </div>
                        <div className="w-px h-10 bg-zinc-200 dark:bg-white/10" />
                        <div className="text-center">
                            <p className="text-2xl font-black text-zinc-900 dark:text-white">{categories.length}+</p>
                            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Categories</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search + Filters */}
            <div className="max-w-7xl mx-auto px-4 mb-14">
                <div className="bg-white dark:bg-[#141414] rounded-[28px] border border-zinc-200/80 dark:border-white/5 shadow-sm p-3 flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search by name, country or bio..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-10 py-3.5 bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/50 transition-all"
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-orange-500 transition-colors">
                                <X size={15} />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center justify-between gap-3">
                        <CustomDropdown
                            icon={Globe}
                            placeholder="All Countries"
                            value={selectedCulture}
                            onChange={setSelectedCulture}
                            options={[{ value: '', label: 'All Countries' }, ...cultures.map((c) => ({ value: c, label: c }))]}
                        />
                        <CustomDropdown
                            icon={LayoutGrid}
                            placeholder="All Categories"
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            options={[{ value: '', label: 'All Categories' }, ...categories.map((cat) => ({ value: cat._id, label: cat.name }))]}
                        />
                    </div>

                    {hasActiveFilter && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-2 px-5 py-3.5 bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all whitespace-nowrap"
                        >
                            <X size={13} /> Clear
                        </button>
                    )}
                </div>

                {hasActiveFilter && (
                    <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mt-4 ml-1">
                        {filteredCreators.length} creator{filteredCreators.length !== 1 ? 's' : ''} found
                    </p>
                )}
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-6">
                {filteredCreators.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredCreators.map((creator, index) => (
                            <CreatorCard key={creator._id} creator={creator} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-28 bg-white dark:bg-[#141414] rounded-[40px] border-2 border-dashed border-zinc-200 dark:border-white/5">
                        <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-5">
                            <Search size={24} className="text-zinc-300 dark:text-zinc-600" />
                        </div>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-semibold mb-1">No creators found</p>
                        <p className="text-zinc-400 dark:text-zinc-600 text-xs mb-6">Try adjusting your search or filters</p>
                        <button onClick={clearFilters} className="text-orange-500 text-xs font-black uppercase tracking-widest hover:underline">
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}