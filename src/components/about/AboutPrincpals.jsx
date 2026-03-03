'use client'; // যেহেতু আমরা স্টেট ব্যবহার করছি
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const AboutPrincpals = () => {
    // ক্লিক করা কার্ড ট্র্যাক করার জন্য স্টেট
    const [activeIndex, setActiveIndex] = useState(null);

    const principles = [
        {
            title: "Discovery over transactions",
            description: "We prioritize the thrill of finding something unique over the speed of checking out."
        },
        {
            title: "Authenticity over mass production",
            description: "We only represent creators who use traditional techniques or culturally rooted methods."
        },
        {
            title: "Visibility with fairness",
            description: "Our algorithms reward quality and heritage, ensuring small creators aren't buried by giants."
        },
        {
            title: "Editorial curation",
            description: "Every creator on our platform is hand-selected to ensure we maintain our cultural standards."
        }
    ];

    return (
        <section className="bg-white dark:bg-[#0a0a0a] py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white">
                            Our Principles
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-lg max-w-xl">
                            The core values that guide our curation and community growth.
                        </p>
                    </div>
                    
                    <button className="flex items-center gap-2 text-[#F57C00] font-bold text-xs uppercase tracking-widest hover:gap-4 transition-all duration-300 group">
                        Read the full manifesto 
                        {/* <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /> */}
                    </button>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {principles.map((item, index) => (
                        <div 
                            key={index} 
                            onClick={() => setActiveIndex(index)} 
                            className={`cursor-pointer p-10 rounded-sm border transition-all duration-500 transform ${
                                activeIndex === index 
                                ? 'bg-white dark:bg-zinc-900 border-orange-500 shadow-xl shadow-orange-500/10 scale-[1.02]' 
                                : 'bg-[#FAFAFA] dark:bg-zinc-900/40 border-transparent hover:border-orange-500/30'
                            }`}
                        >
                            <h3 className={`text-xl md:text-2xl font-medium mb-8 leading-tight transition-colors ${
                                activeIndex === index ? 'text-[#F57C00]' : 'text-gray-900 dark:text-white'
                            }`}>
                                {item.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base">
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