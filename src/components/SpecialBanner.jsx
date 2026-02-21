'use client';

import Link from 'next/link';
import Image from 'next/image';

const SpecialBanner = () => {
    return (
        <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="relative overflow-hidden rounded-2xl bg-[#F3EFE0] dark:bg-[#1a1a1a] flex flex-col md:flex-row items-center transition-colors duration-500 min-h-[450px]">
                
                {/* Left Content Area */}
                <div className="w-full md:w-3/5 p-8 md:p-16 text-center md:text-left z-10">
                    <h2 className="text-4xl md:text-6xl font-serif text-[#1F1F1F] dark:text-white leading-tight">
                        Make every moment <br /> 
                        <span className="text-[#7A1E1E] italic">extra-special</span> <br />
                        with unique finds
                    </h2>
                    <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-md">
                        Explore our curated collection of authentic cultural treasures handcrafted just for you.
                    </p>
                    
                    <div className="mt-10">
                        <Link href="/products">
                        <button className="px-8 py-3 cursor-pointer rounded-lg bg-[#F57C00] text-white font-bold hover:scale-105 transition-all shadow-xl">
                            Shop Our Favourites
                        </button>
                    </Link>
                    </div>
                </div>

                {/* Right Image Area - এখানে পরিবর্তন করা হয়েছে */}
                <div className="w-full md:w-2/5 h-[400px] md:absolute md:right-0 md:h-full relative overflow-hidden">
                    <Image
                        src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=2070&auto=format&fit=crop" 
                        alt="Special Collection" 
                        fill // এটি ইমেজকে পুরো কন্টেইনার জুড়ে ছড়িয়ে দেবে
                        priority // ব্যানার ইমেজের জন্য ভালো পারফরম্যান্স দিবে
                        className="object-cover" // ইমেজটি যাতে ফেটে না যায় বা স্ট্রেচ না হয়
                    />
                    
                    {/* Decorative Gradient - ইমেজের বাম পাশে হালকা শ্যাডো যাতে টেক্সটের সাথে মিশে যায় */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#F3EFE0] dark:from-[#1a1a1a] via-transparent to-transparent hidden md:block" />
                </div>

            </div>
        </section>
    );
};

export default SpecialBanner;