import React from 'react';

const TableOfContents = ({ toc }) => (
    <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl p-6">
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#F57C00] mb-4">Table of Contents</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5">
            {toc.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-[13px] text-gray-500 dark:text-gray-500">
                    <span className="text-[10px] font-black text-[#F57C00] w-5 flex-shrink-0">
                        {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="hover:text-[#F57C00] transition-colors cursor-default">{item}</span>
                </div>
            ))}
        </div>
    </div>
);

export default TableOfContents;