import React from 'react';
import Image from 'next/image';

const AboutContent = () => {
    return (
        <section className="max-w-7xl mx-auto px-6 md:px-10 ">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-24 items-center">

               
                <div className="space-y-8">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl 
                                   font-light leading-tight 
                                   text-gray-900 dark:text-white">
                        Discover
                        <span className="font-serif text-rose-900 dark:text-rose-400"> Culture</span> <br />
                        Worldwide
                    </h1>

                    <p className="text-base sm:text-lg md:text-xl 
                                  text-gray-600 dark:text-gray-300 
                                  max-w-md leading-relaxed">
                        A global platform connecting cultural creators with explorers who value authenticity and heritage.
                    </p>

                    <div className="flex items-center gap-5 pt-6">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="w-10 h-10 rounded-full border-2 
                                               border-white dark:border-[#1F1F1F] 
                                               overflow-hidden bg-gray-200 
                                               shadow-sm">
                                    <img
                                        src={`https://i.pravatar.cc/150?u=${i}`}
                                        alt="user"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>

                        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium">
                            Joined by <span className="text-amber-500 font-bold">12,000+</span> independent creators
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-5 md:gap-6 h-[520px] sm:h-[560px] md:h-[620px]">

                    <div className="space-y-5">
                        <div className="relative h-[70%] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-500">
                            <Image
                                src="https://i.postimg.cc/8kJLjSVK/Pottery-DEL-10-1080x.webp"
                                alt="Pottery"
                                fill
                                className="object-cover transition-transform duration-700 hover:scale-105"
                            />
                        </div>

                        <div className="relative h-[28%] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-500">
                            <Image
                                src="https://i.postimg.cc/BQbk8tnw/138016039-15563697440551n.jpg"
                                alt="People"
                                fill
                                className="object-cover transition-transform duration-700 hover:scale-105"
                            />
                        </div>
                    </div>

                    <div className="space-y-5 pt-10 md:pt-12">
                        <div className="relative h-[30%] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-500">
                            <Image
                                src="https://i.postimg.cc/GhTzwD2h/istockphoto-1137526672-612x612.jpg"
                                alt="Fabric"
                                fill
                                className="object-cover transition-transform duration-700 hover:scale-105"
                            />
                        </div>

                        <div className="relative h-[65%] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-500">
                            <Image
                                src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80"
                                alt="Architecture"
                                fill
                                className="object-cover transition-transform duration-700 hover:scale-105"
                            />
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
};

export default AboutContent;