import React from 'react';
import Image from 'next/image';

const AboutContent = ({ data }) => {
    // কনসোল লগ অনুযায়ী ডাটা এক্সট্রাক্ট করা
    const headline = data?.headline;
    const socialProof = data?.socialProof;
    const gridImages = data?.gridImages || [
        "https://i.postimg.cc/85QQHWKK/image-(4).jpg",
        "https://i.postimg.cc/T1nrb8y4/image-(13).jpg",
        "https://i.postimg.cc/K8hmf61T/image-(14).jpg",
        "https://i.postimg.cc/wTTvL8sJ/Whats-App-Image-2026-03-18-at-2-41-26-PM.jpg"
    ];

    // ডিবাগিং এর জন্য লগ (প্রয়োজন শেষে রিমুভ করে দিবেন)
    console.log("Rendering with creatorCount:", socialProof?.creatorCountText);

    return (
        <section className="max-w-7xl mx-auto px-6 md:px-10 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-24 items-center">

                {/* Left Side: Content Management */}
                <div className="space-y-8">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl 
                                   font-light leading-tight 
                                   text-gray-900 dark:text-white">
                        {headline?.normalTextPart1 || "Discover"}
                        <span className="font-serif text-rose-900 dark:text-rose-400">
                            {` ${headline?.coloredTextPart || "Culture"}`}
                        </span> <br />
                        {headline?.normalTextPart2 || "Worldwide"}
                    </h2>

                    <p className="text-base sm:text-lg md:text-xl 
                                  text-gray-600 dark:text-gray-300 
                                  max-w-md leading-relaxed">
                        {data?.description || "WCM connects audience with creators and the heritage they represent."}
                    </p>

                    <div className="flex items-center gap-5 pt-6">
                        {/* Static User Avatars */}
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="w-10 h-10 rounded-full border-2 
                                               border-white dark:border-[#1F1F1F] 
                                               overflow-hidden bg-gray-200 
                                               shadow-sm"
                                >
                                    <img
                                        src={`https://i.pravatar.cc/150?u=${i}`}
                                        alt="user"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* এখন এখানে ডাইনামিক "300" বা ডাটাবেজের ভ্যালু দেখাবে */}
                        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium">
                            Joined by <span className="text-amber-500 font-bold">
                                {socialProof?.creatorCountText || "12,000+"}
                            </span> {socialProof?.fullTextSuffix || "independent creators"}
                        </p>
                    </div>
                </div>

                {/* Right Side: Dynamic Image Grid */}
                <div className="grid grid-cols-2 gap-5 md:gap-6 h-[520px] sm:h-[560px] md:h-[620px]">

                    {/* Column 1 */}
                    <div className="space-y-5">
                        <div className="relative h-[70%] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-500 bg-gray-100">
                            {gridImages[0] && (
                                <Image
                                    src={gridImages[0]}
                                    alt="Pottery"
                                    fill
                                    className="object-cover transition-transform duration-700 hover:scale-105"
                                />
                            )}
                        </div>

                        <div className="relative h-[28%] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-500 bg-gray-100">
                            {gridImages[1] && (
                                <Image
                                    src={gridImages[1]}
                                    alt="People"
                                    fill
                                    className="object-cover transition-transform duration-700 hover:scale-105"
                                />
                            )}
                        </div>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-5 pt-10 md:pt-12">
                        <div className="relative h-[30%] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-500 bg-gray-100">
                            {gridImages[2] && (
                                <Image
                                    src={gridImages[2]}
                                    alt="Fabric"
                                    fill
                                    className="object-cover transition-transform duration-700 hover:scale-105"
                                />
                            )}
                        </div>

                        <div className="relative h-[65%] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-500 bg-gray-100">
                            {gridImages[3] && (
                                <Image
                                    src={gridImages[3]}
                                    alt="Architecture"
                                    fill
                                    className="object-cover transition-transform duration-700 hover:scale-105"
                                />
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default AboutContent;