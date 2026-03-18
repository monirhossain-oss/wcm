import React from 'react';
import Image from 'next/image';

const AboutPresting = () => {
    return (
        <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden">

            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://i.postimg.cc/hv36wd4y/image-(17).jpg"
                    alt="Preserving Identity Background"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 dark:bg-black/80 transition-opacity duration-500"></div>
            </div>

            {/* Hero Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                <div className="flex flex-col items-center animate-fade-in">

                    {/* Heading */}
                    <h2 className="text-4xl  md:text-6xl lg:text-7xl font-light text-white leading-tight tracking-tight">
                        Preserving Identity. <br />
                        <span className="font-serif text-white/90 italic">Amplifying Culture.</span>
                    </h2>

                    {/* Orange Divider */}
                    <div className="w-24 h-1 bg-[#F57C00] rounded-full mt-2 animate-pulse"></div>

                    {/* Subheading */}
                    <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-[0.4em] pt-4">
                        A Worldwide Marketplace Manifesto
                    </p>
                </div>
            </div>
        </section>
    );
};

export default AboutPresting;