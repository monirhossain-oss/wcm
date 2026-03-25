"use client";
import React from 'react';
import { Palette, Users, ExternalLink, Globe2, Sparkles, ShoppingBag } from 'lucide-react';

const AboutExplore = () => {
    const steps = [
        {
            id: '01',
            title: 'Discover Cultural Treasures',
            description: 'Explore a curated marketplace of handmade crafts, traditional textiles, and cultural art from every corner of the globe.',
            icon: <Globe2 className="w-10 h-10 text-[#E65100]" />,
        },
        {
            id: '02',
            title: 'Understand the Story',
            description: 'Go beyond the product. Learn about the traditions, the heritage, and the artisans who preserve these ancient crafts.',
            icon: <Sparkles className="w-10 h-10 text-[#E65100]" />,
        },
        {
            id: '03',
            title: "Support Creators Directly",
            description: "We act as a gateway. Follow the path to the creator's own platform to complete your purchase and support them directly.",
            icon: <ShoppingBag className="w-10 h-10 text-[#E65100]" />,
        }
    ];

    return (
        <section className="bg-white dark:bg-[#0a0a0a] py-20 px-6 transition-colors duration-500">
            <div className="max-w-7xl mx-auto">
                
                {/* Section Header */}
                <div className="text-center mb-16 space-y-4">
                    <span className="text-[#E65100] font-bold text-xs uppercase tracking-[0.3em]">How WCM Works</span>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                        The <span className="text-[#E65100]">Explorer's</span> Journey
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-base">
                        A transparent and respectful way to discover authentic cultural craftsmanship.
                    </p>
                    <div className="w-24 h-1.5 bg-[#E65100] mx-auto rounded-full"></div>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {steps.map((step) => (
                        <div key={step.id} className="group relative p-8 bg-gray-50 dark:bg-[#121212] rounded-[2rem] border border-transparent hover:border-[#E65100]/20 hover:bg-white dark:hover:bg-zinc-900 shadow-xl shadow-gray-200/50 dark:shadow-none transition-all duration-500">
                            
                            {/* Decorative Step Number */}
                            <div className="absolute top-6 right-8 text-6xl font-black text-gray-200/50 dark:text-zinc-800/50 group-hover:text-[#E65100]/10 transition-colors">
                                {step.id}
                            </div>

                            {/* Icon with Ring */}
                            <div className="relative mb-8 w-20 h-20 flex items-center justify-center rounded-2xl bg-white dark:bg-zinc-800 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                                {step.icon}
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

                            {/* Bottom Accent */}
                            <div className="mt-8 h-1 w-0 group-hover:w-full bg-[#E65100] transition-all duration-700 rounded-full"></div>
                        </div>
                    ))}
                </div>

                {/* Bottom Callout */}
                <div className="mt-16 text-center">
                    <p className="text-gray-400 dark:text-zinc-500 text-sm font-medium">
                        WCM bridges the gap between heritage and a global audience.
                    </p>
                </div>

            </div>
        </section>
    );
};

export default AboutExplore;