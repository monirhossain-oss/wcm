"use client";
import React from 'react';
import { Palette, Users, ExternalLink, Globe2, Sparkles, ShoppingBag, Search, Heart } from 'lucide-react';

const AboutExplore = ({ data }) => {
    // ১. আইকন ম্যাপ (ডাটাবেজের iconId এর সাথে মিল রেখে)
    const iconMap = {
        search: <Search className="w-10 h-10 text-[#E65100]" />,
        connect: <Users className="w-10 h-10 text-[#E65100]" />,
        heart: <Heart className="w-10 h-10 text-[#E65100]" />,
        globe: <Globe2 className="w-10 h-10 text-[#E65100]" />,
        sparkles: <Sparkles className="w-10 h-10 text-[#E65100]" />,
        shopping: <ShoppingBag className="w-10 h-10 text-[#E65100]" />
    };

    // ২. ডাটা পাথ ফিক্স (আপনার লগের স্ট্রাকচার অনুযায়ী)
    // যদি আপনি <AboutExplore data={aboutData} /> এভাবে কল করেন, 
    // তবে explorerJourney থাকবে data.explorerJourney তে।
    const explorerJourney = data?.explorerJourney || data || {};
    const topSection = explorerJourney?.topSection || {};
    const steps = explorerJourney?.steps || [];

    // কনসোল লগ দিয়ে চেক করুন ডাটা ঠিক পাথে আছে কিনা
    // console.log("Final Steps to Render:", steps);

    return (
        <section className="bg-white dark:bg-[#0a0a0a] py-20 px-6 transition-colors duration-500">
            <div className="max-w-7xl mx-auto">

                {/* Section Header */}
                <div className="text-center mb-16 space-y-4">
                    <span className="text-[#E65100] font-bold text-xs uppercase tracking-[0.3em]">
                        {topSection?.badge || "How WCM Works"}
                    </span>
                    <h3 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                        {topSection?.titleMain || "The Explorer Journey"}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-base">
                        {topSection?.subTitle || "A transparent and respectful way to discover authentic cultural craftsmanship."}
                    </p>
                    <div className="w-24 h-1.5 bg-[#E65100] mx-auto rounded-full"></div>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {steps.length > 0 ? steps.map((step, index) => (
                        <div key={step._id || index} className="group relative p-8 bg-gray-50 dark:bg-[#121212] rounded-[2rem] border border-transparent hover:border-[#E65100]/20 hover:bg-white dark:hover:bg-zinc-900 shadow-xl shadow-gray-200/50 dark:shadow-none transition-all duration-500">

                            {/* Decorative Step Number */}
                            <div className="absolute top-6 right-8 text-6xl font-black text-gray-200/50 dark:text-zinc-800/50 group-hover:text-[#E65100]/10 transition-colors">
                                {step.stepNumber !== "NaN" ? step.stepNumber : `0${index + 1}`}
                            </div>

                            {/* Icon */}
                            <div className="relative mb-8 w-20 h-20 flex items-center justify-center rounded-2xl bg-white dark:bg-zinc-800 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                                {iconMap[step.iconId] || <Search className="w-10 h-10 text-[#E65100]" />}
                            </div>

                            {/* Content */}
                            <div className="space-y-4 relative z-10">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white group-hover:text-[#E65100] transition-colors italic">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base">
                                    {step.description}
                                </p>
                            </div>

                            <div className="mt-8 h-1 w-0 group-hover:w-full bg-[#E65100] transition-all duration-700 rounded-full"></div>
                        </div>
                    )) : (
                        <p className="text-center col-span-3 text-gray-500">No steps found in Database.</p>
                    )}
                </div>

                {/* Bottom Callout */}
                <div className="mt-16 text-center">
                    <p className="text-gray-400 dark:text-zinc-500 text-sm font-medium">
                        {explorerJourney?.footerText || "WCM bridges the gap between heritage and a global audience."}
                    </p>
                </div>

            </div>
        </section>
    );
};

export default AboutExplore;