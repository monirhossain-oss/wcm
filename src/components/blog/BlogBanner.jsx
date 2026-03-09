import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const BlogBanner = () => {
    return (
        <section className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-14 bg-[#FCFBF9]">
            
            {/* Left Side: Jewelry & Culture Content */}
            <div className="flex-1 space-y-7 text-left">
                <div className="flex items-center gap-3 text-xs font-bold text-[#D4AF37] uppercase tracking-[0.2em]">
                    <span>WCM Adornments</span>
                    <span className="h-[1px] w-12 bg-[#D4AF37]"></span>
                    <span>Wear the Game</span>
                </div>
                
                <h1 className="text-3xl md:text-5xl font-serif text-[#1A1A1A] leading-[1.1] tracking-tight">
                    Timeless Jewelry for the <br /> 
                    <span className="italic font-light text-gray-500">True Football Fan</span>
                </h1>
                
                <div className="space-y-4">
                    <p className="text-lg md:text-xl text-[#4A4A4A] font-light leading-relaxed max-w-lg">
                        Discover handcrafted necklaces, engraved pendants, and heritage-inspired accessories. WCM brings you jewelry that captures the soul of the stadium and the elegance of the game.
                    </p>
                    <p className="text-sm text-gray-400 font-medium tracking-wide italic">
                        "Your passion, elegantly crafted."
                    </p>
                </div>
                
                <Link href="/blogs/details">
                    <button className="bg-[#F57C00] text-white px-12 py-4 rounded-full font-semibold text-sm hover:bg-gray-800 transition-all shadow-md active:scale-95">
                        Shop Accessories
                    </button>
                </Link>
            </div>

            {/* Right Side: Visual Collage */}
            <div className="flex-1 grid grid-cols-2 gap-5 w-full">
                {/* 1. Image */}
                <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5">
                    <Image 
                        src="https://i.postimg.cc/wvKtFknz/image-(9).jpg" 
                        alt="Handcrafted Gold Necklace" 
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 hover:scale-110"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/5 hover:bg-transparent transition-colors z-10"></div>
                </div>
                
                {/* 2. Image */}
                <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5 mt-10">
                    <Image 
                        src="https://i.postimg.cc/2ytNF0X2/image-(10).jpg" 
                        alt="Luxury Accessories" 
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/5 hover:bg-transparent transition-colors z-10"></div>
                </div>
                
                {/* 3. Image */}
                <div className="col-span-2 relative h-60 rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5">
                    <Image 
                        src="https://i.postimg.cc/0QWyFdBb/image-(11).jpg" 
                        alt="Elegance in Detail" 
                        fill
                        sizes="100vw"
                        className="object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/5 hover:bg-transparent transition-colors z-10"></div>
                </div>
            </div>
        </section>
    );
};

export default BlogBanner;