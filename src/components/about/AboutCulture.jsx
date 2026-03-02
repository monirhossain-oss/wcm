import React from 'react';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react'; // আইকনের জন্য

const AboutCulture = () => {
    const features = [
        {
            title: "Total Ownership",
            description: "You maintain 100% control over your brand, pricing, and inventory."
        },
        {
            title: "Premium Presentation",
            description: "High-end editorial layouts designed to showcase craftsmanship as art."
        },
        {
            title: "Smart Visibility",
            description: "Transparent boost options and PPC placement to reach targeted collectors."
        },
        {
            title: "Fair Representation",
            description: "No hidden fees or aggressive algorithms—just fair visibility for all."
        }
    ];

    return (
        <section className="bg-[#fafafa] dark:bg-[#0d0d0d] py-20 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                
                <div className="bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-sm border border-gray-100 dark:border-zinc-800">
                    <div className="relative aspect-square w-full bg-[#f3f3f3]">
                        <span className="absolute top-4 left-4 bg-[#7A1F1F] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider z-10">
                            Featured Creator
                        </span>
                        <Image 
                            src="https://i.postimg.cc/C1ddZ6wc/Bahai-House-of-Worship-Lotus-Temple-Delhi-India.webp" 
                            alt="Ancient Cedar Totem" 
                            fill 
                            className="object-contain p-12"
                            unoptimized
                        />
                    </div>
                    <div className="p-6 md:p-8 space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Ancient Cedar Totem</h3>
                                <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Coast Salish Tradition</p>
                            </div>
                            <span className="text-[10px] font-bold text-orange-600 border border-orange-200 px-2 py-1 uppercase">
                                Limited Edition
                            </span>
                        </div>
                        <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                                    <img src="https://i.pravatar.cc/100?u=elias" alt="Elias" />
                                </div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">By Elias Thorne</span>
                            </div>
                            <button className="text-xs font-bold flex items-center gap-1 hover:underline">
                                View Studio <span>→</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="space-y-4">
                        <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-sm">
                            Creators First
                        </span>
                        <h2 className="text-2xl md:text-3xl font-light text-gray-800 dark:text-white leading-tight">
                            Empowering the <br /> Guardians of Culture.
                        </h2>
                    </div>

                    <div className="space-y-6">
                        {features.map((item, index) => (
                            <div key={index} className="flex gap-4 group">
                                <CheckCircle2 className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                                <div className="space-y-1">
                                    <h4 className="text-lg font-medium text-gray-800 dark:text-white group-hover:text-orange-600 transition-colors">
                                        {item.title}
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default AboutCulture;