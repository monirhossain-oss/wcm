import React from 'react';
import Image from 'next/image';

const AboutPresting = () => {
    return (
        <section className="relative w-full h-[60vh] md:h-[80vh] flex items-center justify-center overflow-hidden">
            {/* Background Image using Next.js Image Component */}
            <div className="absolute inset-0 z-0">
                <Image 
                    src="https://i.postimg.cc/QtkdJ5n2/cultural-preservation-ensuring-our-legacy-endures.webp" 
                    alt="Preserving Identity Background" 
                    fill
                    className="object-cover"
                    priority // Hero section এর জন্য priority দেওয়া ভালো
                />
                {/* Overlay to match image_aad541.jpg style */}
                <div className="absolute inset-0 bg-black/70 dark:bg-black/85"></div>
            </div>

            {/* Content Section */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                <div className="space-y-6 flex flex-col items-center">
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-light text-white leading-tight tracking-tight">
                        Preserving Identity. <br />
                        <span className=" font-serif text-white/90">Amplifying Culture.</span>
                    </h2>
                    
                    {/* Orange Divider */}
                    <div className="w-20 h-1 bg-[#F57C00] rounded-full mt-2"></div>
                    
                    <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-[0.4em] pt-4">
                        A Worldwide Marketplace Manifesto
                    </p>
                </div>
            </div>
        </section>
    );
};

export default AboutPresting;