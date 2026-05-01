"use client";
import React, { useState } from 'react';

const AboutPrincpals = ({ data }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    // কনসোল লগের স্ট্রাকচার অনুযায়ী সরাসরি ডাটা ডিকনস্ট্রাকশন
    const header = data?.header || {};
    const principles = data?.principlesList || [];

    return (
        <section className="bg-white dark:bg-[#0a0a0a] px-4 py-20 transition-colors duration-500">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <div className="space-y-4">
                        <span className="text-[#F57C00] font-bold text-xs uppercase tracking-[0.3em]">
                            {header.badge || "Our Foundation"}
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                            {header.titlePart1 || "Our"}{' '}
                            <span className="text-[#F57C00]">
                                {header.titleColored || "Principles."}
                            </span>
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl font-medium">
                            {header.description || "The core values that guide our global community."}
                        </p>
                    </div>
                </div>

                {/* Principles Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {principles.length > 0 ? principles.map((item, index) => (
                        <div
                            key={item._id || index}
                            onClick={() => setActiveIndex(index)}
                            className={`cursor-pointer p-10 rounded-[2rem] border transition-all duration-500 transform ${activeIndex === index
                                    ? 'bg-white dark:bg-zinc-900 border-[#F57C00] shadow-2xl shadow-orange-500/10 scale-[1.05]'
                                    : 'bg-[#FAFAFA] dark:bg-zinc-900/40 border-gray-100 dark:border-white/5 hover:border-[#F57C00]/30'
                                }`}
                        >
                            {/* Decorative Line Accent */}
                            <div className={`w-12 h-1 mb-8 rounded-full transition-all duration-500 ${activeIndex === index ? 'bg-[#F57C00] w-20' : 'bg-gray-200 dark:bg-zinc-700'
                                }`}></div>

                            <h3 className={`text-xl md:text-2xl font-black mb-6 leading-tight transition-colors italic ${activeIndex === index ? 'text-[#F57C00]' : 'text-gray-900 dark:text-white'
                                }`}>
                                {item.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base font-medium">
                                {item.content}
                            </p>
                        </div>
                    )) : (
                        <div className="col-span-full py-10 text-center text-gray-500 italic border border-dashed border-gray-200 rounded-3xl">
                            Waiting for foundation data...
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default AboutPrincpals;