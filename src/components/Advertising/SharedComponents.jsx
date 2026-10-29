import React from 'react';

export const Ul = ({ items }) => (
    <ul className="mt-2 space-y-1.5">
        {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
                <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#F57C00] flex-shrink-0" />
                <span>{item}</span>
            </li>
        ))}
    </ul>
);

export const Sub = ({ label, children }) => (
    <div className="mt-5">
        <h3 className="text-[13px] font-black uppercase tracking-widest text-gray-900 dark:text-gray-200 mb-2">
            {label}
        </h3>
        <div className="text-[14px] leading-relaxed text-gray-600 dark:text-gray-400">
            {children}
        </div>
    </div>
);

export const Divider = () => (
    <div className="border-t border-dashed border-gray-200 dark:border-gray-800" />
);

export const ContactRow = ({ icon, children }) => (
    <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#F57C00]/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-[#F57C00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {icon}
            </svg>
        </div>
        {children}
    </div>
);