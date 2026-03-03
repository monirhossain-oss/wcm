import React from 'react';
import Image from 'next/image';

const AboutContent = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 py-20 md:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                
                {/* বাম পাশের টেক্সট সেকশন */}
                <div className="space-y-6">
                    <h1 className="text-3xl md:text-4xl font-light  leading-tight">
                        Discover 
                        <span className=" font-serif text-[#F57C00] dark:text-[#F57C00]"> Culture</span> <br />
                        Worldwide
                    </h1>
                    <p className="text-xl text-gray-600 max-w-md leading-relaxed">
                        A global platform connecting cultural creators with explorers who value authenticity and heritage.
                    </p>
                    
                    {/* সোশ্যাল প্রুফ সেকশন */}
                    <div className="flex items-center gap-4 pt-8">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-gray-200">
                                    <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 font-medium">
                            Joined by <span className="text-amber-500 font-bold">12,000+</span> independent creators
                        </p>
                    </div>
                </div>

                {/* ডান পাশের স্টাইলিশ ইমেজ গ্রিড */}
                <div className="grid grid-cols-2 gap-4 h-[600px]">
                    {/* বড় লম্বা ইমেজ */}
                    <div className="space-y-4">
                        <div className="relative h-[70%] rounded-2xl overflow-hidden shadow-lg">
                             <Image 
                                src="https://i.postimg.cc/8kJLjSVK/Pottery-DEL-10-1080x.webp" 
                                alt="Pottery" fill className="object-cover" 
                             />
                        </div>
                        <div className="relative h-[28%] rounded-2xl overflow-hidden shadow-lg">
                             <Image 
                                src="https://i.postimg.cc/BQbk8tnw/138016039-15563697440551n.jpg" 
                                alt="People" fill className="object-cover" 
                             />
                        </div>
                    </div>
                    {/* ডান পাশের দুই ইমেজ */}
                    <div className="space-y-4 pt-12">
                        <div className="relative h-[30%] rounded-2xl overflow-hidden shadow-lg">
                             <Image 
                                src="https://i.postimg.cc/GhTzwD2h/istockphoto-1137526672-612x612.jpg" 
                                alt="Fabric" fill className="object-cover" 
                             />
                        </div>
                        <div className="relative h-[65%] rounded-2xl overflow-hidden shadow-lg">
                             <Image 
                                src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80" 
                                alt="Architecture" fill className="object-cover" 
                             />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default AboutContent;