"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/imageHelper";

const DEFAULT_IMAGE = "/hero (2).png";

const SliderSkeleton = () => (
    <div className="absolute inset-0 w-full h-full bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-2xl flex flex-col justify-end p-10 md:p-16">
        <div className="h-8 md:h-12 w-3/4 bg-zinc-300 dark:bg-zinc-700 rounded-lg mb-4" />
        <div className="h-4 md:h-6 w-1/2 bg-zinc-300 dark:bg-zinc-700 rounded-lg mb-2" />
        <div className="h-4 md:h-6 w-1/3 bg-zinc-300 dark:bg-zinc-700 rounded-lg" />
    </div>
);

export default function HeroSlider({ initialSliders = [] }) {
    const [current, setCurrent] = useState(0);

    // ✅ Fix 1: কোনো artificial delay নেই
    const sliders = initialSliders.length > 0 ? initialSliders : [];

    // ✅ Fix 2: useCallback দিয়ে stable reference
    const next = useCallback(() => {
        setCurrent((prev) => (prev + 1) % sliders.length);
    }, [sliders.length]);

    useEffect(() => {
        if (sliders.length <= 1) return;
        const timer = setInterval(next, 5000);
        return () => clearInterval(timer);
    }, [next, sliders.length]);

    // ✅ Fix 3: Fallback — DEFAULT_IMAGE দেখাবে
    if (sliders.length === 0) {
        return (
            <div className="absolute rounded-2xl inset-0 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-2xl">
                <Image
                    src={DEFAULT_IMAGE}
                    alt="World Culture Marketplace"
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/30" />
            </div>
        );
    }

    return (
        <div className="absolute rounded-2xl inset-0 w-full overflow-hidden bg-black shadow-2xl border border-white/5">
            {sliders.map((slide, index) => (
                <div
                    key={slide._id || index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    <Image
                        src={getImageUrl(slide.imageUrl)}
                        alt={slide.alt || slide.title || "Hero Slide"}
                        fill
                        // ✅ Fix 4: শুধু প্রথম image priority, বাকিগুলো lazy
                        priority={index === 0}
                        loading={index === 0 ? "eager" : "lazy"}
                        className={`object-cover transition-transform duration-[7000ms] ease-out ${index === current ? "scale-110" : "scale-100"
                            }`}
                        sizes="(max-width: 768px) 100vw, 50vw"
                    />

                    <div className="absolute inset-0 flex flex-col justify-end pb-12 px-10 md:px-20 text-white">
                        {index === current && (
                            <div className="max-w-2xl animate-fade-in-up">
                                <h1 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-2xl">
                                    {slide.title}
                                </h1>
                                <p className="text-base md:text-lg opacity-90 font-medium drop-shadow-lg line-clamp-2">
                                    {slide.subTitle}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {sliders.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {sliders.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            aria-label={`Slide ${i + 1}`}
                            // ✅ Fix 5: div → button, clickable dots
                            className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? "bg-white w-8" : "bg-white/30 w-3"
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}