"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { getImageUrl } from "@/lib/imageHelper";

export default function HeroSlider() {
    const [sliders, setSliders] = useState([]);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

    // ১. ডাটাবেজ থেকে স্লাইডার ডাটা নিয়ে আসা
    useEffect(() => {
        const fetchSliders = async () => {
            try {
                const res = await axios.get(`${API_BASE}/api/sliders`);
                // যদি ডাটাবেজে কোনো স্লাইডার না থাকে, তবে একটি ফলব্যাক হিসেবে পুরনো স্ট্যাটিক ইমেজ সেট করতে পারেন
                if (res.data && res.data.length > 0) {
                    setSliders(res.data);
                }
            } catch (error) {
                console.error("Error fetching sliders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSliders();
    }, [API_BASE]);

    // ২. অটো প্লে টাইমার
    useEffect(() => {
        if (sliders.length === 0) return;

        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % sliders.length);
        }, 4000); // ৩ সেকেন্ড থেকে বাড়িয়ে ৪ সেকেন্ড করা হয়েছে স্মুথনেসের জন্য

        return () => clearInterval(timer);
    }, [sliders.length]);

    // ৩. লোডিং অবস্থায় বা ডাটা না থাকলে কি দেখাবে
    if (loading) return <div className="absolute inset-0 bg-gray-900 animate-pulse rounded-2xl mt-10" />;
    if (sliders.length === 0) return null; // অথবা কোনো ডিফল্ট ইমেজ দেখাতে পারেন

    return (
        <div className="absolute rounded-2xl mt-10 inset-0 w-full overflow-hidden ">
            {sliders.map((slide, index) => (
                <div
                    key={slide._id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-120 z-10" : "opacity-0 z-0"
                        }`}
                >
                    <Image
                        src={getImageUrl(slide.imageUrl)} // আপনার হেল্পার ব্যবহার করা হয়েছে
                        alt={slide.title || `Slide ${index}`}
                        fill
                        priority={index === 0}
                        className={`object-cover transition-transform duration-[6000ms] ease-out ${index === current ? "scale-110" : "scale-100"
                            }`}
                        sizes="100vw"
                        // quality={100}
                    />
                    <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-20 text-white">
                        {index === current && (
                            <div className="max-w-2xl animate-fade-in-up">
                                <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                                    {slide.title}
                                </h1>
                                <p className="text-lg md:text-xl opacity-90 drop-shadow-md">
                                    {slide.subTitle}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {/* ডটস নেভিগেশন (ঐচ্ছিক) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {sliders.map((_, i) => (
                    <div
                        key={i}
                        className={`h-2 w-2 rounded-full transition-all ${i === current ? "bg-white w-6" : "bg-white/50"}`}
                    />
                ))}
            </div>
        </div>
    );
}