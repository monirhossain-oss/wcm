"use client";

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomDropdown({ icon: Icon, placeholder, value, onChange, options }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, []);

    const selectedLabel = options.find((o) => o.value === value)?.label || placeholder;
    const isActive = value !== '';

    return (
        <div ref={ref} className="relative md:w-52">
            <button
                type="button"
                onClick={() => setOpen((p) => !p)}
                className={`
          w-full flex items-center gap-2.5 pl-4 pr-3 py-3.5
          border rounded-2xl text-sm transition-all outline-none
          ${isActive
                        ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-400/50 dark:border-orange-500/40 text-orange-600 dark:text-orange-400'
                        : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400'}
          ${open ? 'ring-2 ring-orange-500/30 border-orange-500/50' : ''}
        `}
            >
                {Icon && <Icon size={14} className={isActive ? 'text-orange-500' : 'text-zinc-400'} />}
                <span className={`flex-1 text-left truncate text-[13px] font-semibold ${isActive ? 'text-orange-600 dark:text-orange-400' : 'text-zinc-600 dark:text-zinc-300'}`}>
                    {selectedLabel}
                </span>
                <ChevronDown
                    size={14}
                    className={`flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180 text-orange-500' : 'text-zinc-400'}`}
                />
            </button>

            {open && (
                <div className="
          absolute top-[calc(100%+8px)] left-0 z-50 w-full min-w-[200px]
          bg-white dark:bg-[#1a1a1a]
          border border-zinc-200 dark:border-white/10
          rounded-2xl shadow-xl overflow-hidden
          animate-in fade-in zoom-in-95 duration-150
        ">
                    <button
                        type="button"
                        onClick={() => { onChange(''); setOpen(false); }}
                        className={`
              w-full flex items-center justify-between px-4 py-3 text-[12px] font-bold uppercase tracking-wide transition-colors
              ${value === ''
                                ? 'bg-orange-500 text-white'
                                : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5'}
            `}
                    >
                        {placeholder}
                        {value === '' && <Check size={12} className="text-white" />}
                    </button>

                    <div className="h-px bg-zinc-100 dark:bg-white/8" />

                    <div className="max-h-56 overflow-y-auto">
                        {options.filter(o => o.value !== '').map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => { onChange(opt.value); setOpen(false); }}
                                className={`
                  w-full flex items-center justify-between px-4 py-2.5 text-[12px] font-semibold transition-colors
                  ${value === opt.value
                                        ? 'bg-orange-500 text-white'
                                        : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-white/5'}
                `}
                            >
                                <span className="truncate">{opt.label}</span>
                                {value === opt.value && <Check size={12} className="text-white flex-shrink-0" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}