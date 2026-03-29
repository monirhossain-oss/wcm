import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineArrowNarrowLeft } from 'react-icons/hi';

const DetailsPage = () => {
    return (
        <div className="min-h-screen bg-[#FCFBF9] dark:bg-slate-950 py-10 md:py-20 px-6 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                
                {/* --- হোম পেজে যাওয়ার বাটন --- */}
                <Link href="/" className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors mb-10 group">
                    <HiOutlineArrowNarrowLeft className="text-xl transition-transform group-hover:-translate-x-1" />
                    <span className="text-sm font-medium uppercase tracking-widest">Back to Home</span>
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    
                    {/* প্রোডাক্ট ইমেজ গ্যালারি */}
                    <div className="space-y-6">
                        {/* Main Image */}
                        <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
                            <Image 
                                src="https://i.postimg.cc/wvKtFknz/image-(9).jpg" 
                                alt="Main Product View"
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                            />
                        </div>
                        {/* Sub Images */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative h-40 rounded-2xl overflow-hidden shadow-md ring-1 ring-black/5 dark:ring-white/10">
                                 <Image src="https://i.postimg.cc/2ytNF0X2/image-(10).jpg" alt="Detail 1" fill sizes="25vw" className="object-cover hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="relative h-40 rounded-2xl overflow-hidden shadow-md ring-1 ring-black/5 dark:ring-white/10">
                                 <Image src="https://i.postimg.cc/0QWyFdBb/image-(11).jpg" alt="Detail 2" fill sizes="25vw" className="object-cover hover:scale-110 transition-transform duration-500" />
                            </div>
                        </div>
                    </div>

                    {/* প্রোডাক্ট ইনফরমেশন */}
                    <div className="space-y-8 lg:sticky lg:top-20">
                        <div className="space-y-2">
                            <span className="text-[#D4AF37] font-bold tracking-widest text-sm uppercase">Limited Heritage Edition</span>
                            <h1 className="text-4xl md:text-5xl font-serif text-gray-900 dark:text-white leading-tight transition-colors">
                                Handcrafted Stadium Coordinates Pendant
                            </h1>
                            <p className="text-2xl font-light text-gray-700 dark:text-gray-300">$145.00</p>
                        </div>

                        <div className="space-y-4 border-y border-gray-200 dark:border-slate-800 py-6 transition-colors">
                            <h3 className="font-bold text-gray-800 dark:text-gray-100 uppercase text-xs tracking-wider">Description</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                                Crafted in 18k solid gold, this piece commemorates the hallowed grounds of football history. Every pendant is hand-engraved with the precise coordinates of your chosen iconic stadium.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button className="flex-1 bg-[#F57C00] text-white py-4 rounded-full font-bold hover:bg-black dark:hover:bg-blue-600 transition-all transform active:scale-95 shadow-lg">
                                Add to Cart
                            </button>
                            {/* Wishlist Button */}
                            <button className="w-16 h-16 flex items-center justify-center border-2 border-gray-200 dark:border-slate-800 rounded-full hover:bg-gray-50 dark:hover:bg-slate-900 transition-all text-xl dark:text-white">
                                ❤
                            </button>
                        </div>

                        {/* Note Section with Glassmorphism */}
                        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-6 rounded-2xl border border-white/20 dark:border-slate-800">
                            <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed italic">
                                * WCM Adornments are ethically sourced and handmade by local artisans. Ships globally in a premium heritage gift box.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsPage;