import React from 'react';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';

const FaqContact = () => {
    return (
        <section className="bg-white dark:bg-[#0a0a0a] py-12 px-6">
            <div className="max-w-5xl mx-auto">
                {/* কার্ড কন্টেইনার */}
                <div className="bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
                    
                    {/* বাম পাশের টেক্সট সেকশন */}
                    <div className="space-y-4 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-[#F57C00] font-bold text-[10px] uppercase tracking-[0.2em]">
                            <MessageCircle size={16} strokeWidth={3} />
                            <span>Connect With Us</span>
                        </div>
                        
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                            Still have questions?
                        </h2>
                        
                        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base max-w-md leading-relaxed">
                            Our dedicated support team is available 24/7 to <br className="hidden lg:block" />
                            help you with any cultural or technical inquiries.
                        </p>
                    </div>

                    {/* ডান পাশের বাটন সেকশন */}
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                       

                         <Link href="/contact">
             <button className="bg-[#F57C00] dark:bg-transparent border border-[#F57C00] text-white dark:text-white dark:border-zinc-700 px-8 py-3.5 rounded-lg text-sm font-bold hover:bg-white hover:text-black dark:hover:bg-white dark:hover:text-black transition-all duration-300 shadow-sm">
                            Contact Support
                        </button>
          </Link>
                        
                        <button className="text-gray-600 dark:text-gray-400 text-sm font-bold hover:text-gray-900 dark:hover:text-white transition-colors">
                            Read Documentation
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default FaqContact;