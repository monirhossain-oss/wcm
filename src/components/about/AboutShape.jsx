import React from 'react';
import Image from 'next/image';

const AboutShape = () => {
    return (
        <section className="bg-white dark:bg-[#0a0a0a] py-16 md:py-24 px-4 overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                
               
              <div className="space-y-4 md:space-y-6 order-2 lg:order-1 text-left">
    {/* Headline font size decreased: text-xl to text-2xl */}
    <h2 className="text-xl md:text-2xl font-light text-gray-900 dark:text-white leading-tight">
        Identity in every thread, <br />
        story in every shape.
    </h2>
    
    {/* Body font size decreased: text-sm to text-base */}
    <div className="space-y-3 md:space-y-4 text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed">
        <p>
            WCM is more than a marketplace. It is a digital archive of living heritage,
            curated to ensure that traditional craftsmanship survives and thrives in the modern era.
        </p>
        <p>
            We believe that global commerce has often flattened culture, rewarding mass 
            production over individual mastery. WCM reverses this trend by providing a 
            high-visibility stage for creators who represent the soul of their communities.
        </p>
        <p className="text-gray-800 dark:text-gray-200 font-medium">
            Our platform does not own the craft; we amplify it. By connecting creators
            directly to a global audience, we empower them to maintain their independence.
        </p>
    </div>
</div>

               
                <div className="relative group order-1 lg:order-2 mb-12 lg:mb-0">
                    
                    <div className="relative aspect-[3/2] w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-zinc-800">
                        <Image 
                            src="https://i.postimg.cc/k4nM8YqR/Acrylic-Painting-Techniques-768x512.jpg" 
                            alt="Artist Identity" 
                            fill 
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            unoptimized
                        />
                    </div>

                    <div className="absolute -bottom-6 -right-2 md:-bottom-10 md:-right-8 bg-[#8B1A1A] text-white p-6 md:p-8 lg:p-6 max-w-[260px] sm:max-w-xs md:max-w-sm rounded-lg shadow-2xl z-10">
                        <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] opacity-70 mb-2 md:mb-4 font-bold">Artist Spotlight</p> 
                        
                        <p className="text-lg md:text-xl font-serif italic mb-4 md:mb-6 leading-snug">
                            "My art is my language. WCM helps the world hear my voice."
                        </p>
                        
                        <div className="border-t border-white/20 pt-3 md:pt-4 flex items-center justify-between">
                            <p className="text-xs md:text-sm font-semibold tracking-wide">— Kenji A., Master Calligrapher</p>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default AboutShape;