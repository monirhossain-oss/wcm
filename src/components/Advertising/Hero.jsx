import React from 'react';

const Hero = () => (
    <div className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0F0F0E]">
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-[#F57C00] opacity-[0.06] blur-[80px] rounded-full translate-x-1/4 -translate-y-1/4" />

        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-14">
            <h1 className="text-[52px] leading-[1.05] font-black tracking-tight text-gray-900 dark:text-white mb-5">
                Advertising<br />
                <span className="text-[#F57C00]">Policy</span>
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-[13px] text-gray-500 dark:text-gray-500">
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span>World Culture Marketplace (WCM)</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-400 dark:text-gray-600">Last updated</span>
                    <span className="font-bold text-gray-700 dark:text-gray-300">30 April 2026</span>
                </div>
            </div>
        </div>
    </div>
);

export default Hero;