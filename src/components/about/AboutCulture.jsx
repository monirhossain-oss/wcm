"use client";
import React from 'react';
import Image from 'next/image';
import { CheckCircle2, Globe, Heart, ShieldCheck } from 'lucide-react';

const AboutCulture = () => {
    const features = [
        {
            title: "Supporting Cultural Visibility",
            description: "We honor the people and traditions behind creative expression by providing a global stage for their work.",
            icon: <Globe className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
        },
        {
            title: "Inclusive Cultural Economy",
            description: "Our platform contributes to a respectful economy that values authenticity and fair representation for all creators.",
            icon: <ShieldCheck className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
        },
        {
            title: "Bridge Between Cultures",
            description: "We digitally connect diverse communities, ensuring that heritage is not only observed but celebrated.",
            icon: <Heart className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
        },
        {
            title: "Total Ownership",
            description: "Creators maintain 100% control over their brand, stories, and the cultural heritage they represent.",
            icon: <CheckCircle2 className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
        }
    ];

    return (
        <section className="bg-[#fafafa] dark:bg-[#0d0d0d] py-20 px-6 transition-colors duration-500">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Featured Creator Card */}
                <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-zinc-800 group transition-all duration-500 hover:-translate-y-2">
                    <div className="relative aspect-[4/5] w-full bg-[#f9f9f9] dark:bg-zinc-800">
                        <span className="absolute top-6 left-6 bg-orange-600 text-white text-[10px] font-bold px-4 py-1.5 uppercase tracking-[0.2em] z-10 rounded-full shadow-lg">
                            Preserving Heritage
                        </span>
                        <Image
                            src="https://i.postimg.cc/8CSpwq08/image-(18).jpg" // আপনার প্রোভাইড করা ইমেজ
                            alt="Cultural Craft"
                            fill
                            className="object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                            unoptimized
                        />
                    </div>
                    <div className="p-8 md:p-10 space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Honoring Traditions</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed italic">
                                "Culture is not only something to observe, but something to understand and celebrate."
                            </p>
                        </div>
                        <div className="pt-6 border-t border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                    <Globe className="w-5 h-5 text-orange-600" />
                                </div>
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 tracking-wide uppercase">WCM Global Network</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="space-y-12">
                    <div className="space-y-6">
                        <span className="bg-orange-100 dark:bg-orange-600/20 text-orange-700 dark:text-orange-400 text-[10px] font-bold px-4 py-2 uppercase tracking-[0.3em] rounded-full">
                            Our Vision & Impact
                        </span>
                        <h3 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-[1.1]">
                            Empowering the <br /> 
                            <span className="text-orange-600">Guardians of Culture.</span>
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                            What began as an idea to bridge cultures digitally is evolving into a growing network of creators, communities, and audiences who value authenticity over mass production.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
                        {features.map((item, index) => (
                            <div key={index} className="flex gap-5 group p-2">
                                {item.icon}
                                <div className="space-y-2">
                                    <h4 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-orange-600 transition-colors">
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