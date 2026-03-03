import { Heart } from 'lucide-react';
import Link from 'next/link';
import React from 'react';


const AboutVisibility = () => {
    return (
        <section className="bg-white dark:bg-[#0a0a0a] py-24 px-6 flex flex-col items-center text-center">
            {/* অরেঞ্জ হার্ট আইকন */}
            <div className="mb-8">
                <Heart className="w-12 h-12 text-[#F57C00] stroke-[1.5px]" />
            </div>

            {/* মেইন হেডলাইন */}
            <h2 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white leading-tight mb-8">
                Culture deserves <br />
                <span className=" text-[#F57C00] dark:text-[#F57C00]">visibility.</span>
            </h2>

            {/* কোটেশন টেক্সট */}
            <p className="max-w-2xl text-gray-500 dark:text-gray-400 text-lg md:text-xl  font-light mb-12 leading-relaxed">
                "We are not just selling products; we are sharing the lived <br className="hidden md:block" />
                experiences of humanity."
            </p>

            {/* এক্সপ্লোর বাটন */}
            <Link href="/products">
            <button className="px-8 py-3 cursor-pointer rounded-lg bg-[#F57C00] text-white font-bold hover:scale-105 transition-all shadow-xl active:scale-95">
              Explore Products
            </button>
          </Link>
        </section>
    );
};

export default AboutVisibility;