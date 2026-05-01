import React from 'react';
import Image from 'next/image';

const AboutShape = ({ data }) => {
    // ডাটাবেজ অবজেক্ট থেকে সেফলি ডাটা এক্সট্রাক্ট করা
    const headline = data?.headline;
    const testimonial = data?.testimonialCard;
    const descriptions = data?.descriptions || [];
    const highlightText = data?.highlightText;

    // মেইন ইমেজ হ্যান্ডলিং (যদি ডাটাবেজে না থাকে তবে ডিফল্ট ইমেজ)
    const mainImage = data?.mainImage || "https://i.postimg.cc/NjG2b29W/image-(16).jpg";

    return (
        <section className="bg-[#fcfbf7] dark:bg-[#0d0d0d] py-20 px-6 overflow-hidden transition-colors duration-300">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                {/* Text Section (Left Side) - Mobile এ নিচে যাবে, Desktop এ বামে থাকবে */}
                <div className="space-y-8 order-2 lg:order-1">
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 dark:text-white leading-tight">
                        {headline?.upperLine || "Identity in every thread,"} <br />
                        <span className="font-serif italic text-rose-900 dark:text-rose-400">
                            {headline?.lowerLine || "story in every shape."}
                        </span>
                    </h3>

                    <div className="space-y-6 text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed">
                        {/* ডেসক্রিপশন অ্যারে ম্যাপ করা হয়েছে */}
                        {descriptions.length > 0 ? (
                            descriptions.map((text, index) => (
                                <p key={index} className="transition-all">
                                    {text}
                                </p>
                            ))
                        ) : (
                            <p>WCM focuses on visibility, cultural context, and storytelling.</p>
                        )}

                        {/* হাইলাইট টেক্সট (Border-left সহ) */}
                        {highlightText && (
                            <div className="pt-4">
                                <p className="text-gray-900 dark:text-gray-100 font-medium border-l-4 border-rose-900 dark:border-rose-500 pl-5 py-1 italic">
                                    {highlightText}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Image & Testimonial Section (Right Side) */}
                <div className="relative order-1 lg:order-2">
                    {/* মেইন ইমেজ কন্টেইনার */}
                    <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-2xl transform transition-transform duration-700 hover:scale-[1.02]">
                        <Image
                            src={mainImage}
                            alt="Cultural Craftsmanship"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                            unoptimized={mainImage.includes('postimg.cc') || mainImage.includes('cloudinary')}
                        />
                        {/* ইমেজের ওপর হালকা ওভারলে (Dark mode এর জন্য) */}
                        <div className="absolute inset-0 bg-black/5 dark:bg-black/20 pointer-events-none" />
                    </div>

                    {/* Testimonial Card (Floating Badge) */}
                    {testimonial?.quote && (
                        <div className="absolute -bottom-10 -left-6 md:-left-12 bg-rose-900 dark:bg-rose-950 text-white p-6 md:p-8 max-w-[280px] md:max-w-xs rounded-2xl shadow-2xl hidden sm:block animate-in fade-in slide-in-from-bottom-5 duration-1000">
                            <svg
                                className="w-8 h-8 text-rose-400/30 mb-4"
                                fill="currentColor"
                                viewBox="0 0 32 32"
                            >
                                <path d="M10 8v8H6v2a2 2 0 002 2h2v4H8a6 6 0 01-6-6v-8a2 2 0 012-2h4zm12 0v8h-4v2a2 2 0 002 2h2v4h-4a6 6 0 01-6-6v-8a2 2 0 012-2h4z" />
                            </svg>

                            <p className="text-lg md:text-xl font-serif italic mb-6 leading-snug">
                                "{testimonial.quote}"
                            </p>

                            <div className="space-y-1">
                                <div className="h-px w-8 bg-rose-400/50 mb-2" />
                                <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-rose-200/80">
                                    — {testimonial.author || "Global Artisan"}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
};

export default AboutShape;