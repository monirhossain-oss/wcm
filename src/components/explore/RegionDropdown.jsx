'use client';
import React, { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

const regions = [
    'All Regions', 'Asia', 'Middle East', 'Europe',
    'Africa', 'North America', 'Latin America', 'Oceania'
];

export default function RegionDropdown({ selected, onSelect }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-zinc-200 dark:hover:bg-white/10 rounded-full transition-all min-w-[130px] justify-between"
            >
                <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-orange-500" />
                    <span className="text-[11px] font-bold uppercase tracking-tight text-zinc-700 dark:text-zinc-200">
                        {selected}
                    </span>
                </div>
                <ChevronDown size={14} className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white dark:bg-[#121212] border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden py-2 animate-in fade-in zoom-in duration-200">
                    {regions.map((r) => (
                        <div
                            key={r}
                            onClick={() => {
                                onSelect(r);
                                setIsOpen(false);
                            }}
                            className={`px-4 py-2.5 text-[10px] font-bold uppercase cursor-pointer flex items-center justify-between ${selected === r
                                    ? 'bg-orange-500 text-white'
                                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5'
                                }`}
                        >
                            {r}
                            {selected === r && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}