'use client'; 
import React, { useState } from 'react';

const AboutPrincpals = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const principles = [
        {
            title: "Visibility with Fairness",
            description: "We focus on bringing forward the people behind cultural expression—the creators and communities who preserve traditions through their work."
        },
        {
            title: "Culture over Commodity",
            description: "At WCM, culture is not treated as a commodity. It is presented as a living heritage, carried through people and expressed through creativity"
        },
        {
            title: "Authenticity & Respect",
            description: "We create a gateway between creators and global audiences, enabling discovery while honoring identity, history, and cultural integrity."
        },
        {
            title: "Curation & Stewardship",
            description: "Every creator and storyteller is carefully selected to ensure culture is shared with respect, responsibility, and digital authenticity."
        }
    ];

    return (
        <section className="bg-white dark:bg-[#0a0a0a] py-20 px-4 transition-colors duration-500">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <div className="space-y-4">
                        <span className="text-[#F57C00] font-bold text-xs uppercase tracking-[0.3em]">Our Foundation</span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                            Our <span className="text-[#F57C00]">Principles.</span>
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl font-medium">
                            The core values that guide our global community and ensure cultural integrity in the digital world.
                        </p>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {principles.map((item, index) => (
                        <div 
                            key={index} 
                            onClick={() => setActiveIndex(index)} 
                            className={`cursor-pointer p-10 rounded-[2rem] border transition-all duration-500 transform ${
                                activeIndex === index 
                                ? 'bg-white dark:bg-zinc-900 border-[#F57C00] shadow-2xl shadow-orange-500/10 scale-[1.05]' 
                                : 'bg-[#FAFAFA] dark:bg-zinc-900/40 border-gray-100 dark:border-white/5 hover:border-[#F57C00]/30'
                            }`}
                        >
                            {/* Decorative Line */}
                            <div className={`w-12 h-1 mb-8 rounded-full transition-all duration-500 ${
                                activeIndex === index ? 'bg-[#F57C00] w-20' : 'bg-gray-200 dark:bg-zinc-700'
                            }`}></div>

                            <h3 className={`text-xl md:text-2xl font-black mb-6 leading-tight transition-colors italic ${
                                activeIndex === index ? 'text-[#F57C00]' : 'text-gray-900 dark:text-white'
                            }`}>
                                {item.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base font-medium">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutPrincpals;