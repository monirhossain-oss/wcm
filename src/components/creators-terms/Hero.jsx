import React from 'react';

const Hero = () => (
    <div className="relative overflow-hidden border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-[#0F0F0E]">
        {/* Background Glow Effect */}
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-orange-500 opacity-[0.06] blur-[80px] rounded-full translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[200px] bg-orange-600 opacity-[0.03] blur-[100px] rounded-full -translate-x-1/4 translate-y-1/4" />

        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-14">
            <h1 className="text-[52px] leading-[1.05] font-black tracking-tight text-zinc-900 dark:text-white mb-6">
                Creator<br />
                <span className="text-[#F57C00]">Terms & Conditions</span>
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-[13px]">
                {/* Brand Tag */}
                <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-medium">World Culture Marketplace (WCM)</span>
                </div>

                {/* Vertical Divider (Hidden on mobile) */}
                <div className="hidden md:block w-px h-4 bg-zinc-200 dark:bg-zinc-800" />

                {/* Date Tag */}
                <div className="flex items-center gap-2">
                    <span className="font-medium text-zinc-400 dark:text-zinc-600">Last updated:</span>
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">30 April 2026</span>
                </div>
            </div>
        </div>
    </div>
);

export default Hero;