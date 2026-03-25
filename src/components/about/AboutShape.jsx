import React from 'react';
import Image from 'next/image';

const AboutContent = () => {
    return (
        <section className="bg-[#fcfbf7] dark:bg-[#0d0d0d] py-16 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Text Section */}
                <div className="space-y-8 order-2 lg:order-1">
                    <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white leading-tight">
                        Identity in every thread, <br />
                        <span className="font-serif italic text-rose-900">story in every shape.</span>
                    </h2>

                    <div className="space-y-6 text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed">
                        <p>Unlike traditional marketplaces, WCM focuses on
visibility, cultural context, and
storytelling
. The platform acts as a gateway between creators and global audiences, allowing
visitors to explore cultural wor
ks while respecting the identity and history behind them.</p>
                        <p> Our goal is to contribute to the preservation and appreciation of cultural heritage by
supporting creators and helping their stories reach a wider world.</p>
                        <p className="text-gray-900 dark:text-gray-200 font-medium border-l-4 border-rose-900 pl-4">
                            Our platform does not own the craft; we amplify it.
                        </p>
                    </div>
                </div>

                {/* Image & Badge Section */}
                <div className="relative order-1 lg:order-2">
                    <div className="relative aspect-[4/3]  w-full rounded-2xl overflow-hidden shadow-2xl transform transition-transform duration-500 hover:scale-105">
                        <Image
                            src="https://i.postimg.cc/NjG2b29W/image-(16).jpg"
                            alt="Artist at work"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>

                    {/* Testimonial Badge */}
                    <div className="absolute -bottom-8 -left-8 bg-rose-900 text-white p-8 max-w-xs rounded-xl shadow-2xl hidden md:block animate-fade-in">
                        <p className="text-xl font-serif italic mb-4">"My art is my language. WCM helps the world hear my voice."</p>
                        <p className="text-xs font-bold uppercase tracking-widest opacity-70">— Kenji A., Master Calligrapher</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutContent;