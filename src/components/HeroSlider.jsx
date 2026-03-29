"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
    "/artisan-weaving-textile-loom.jpeg",
    "/artisan jewelry.jpeg",
    "/Art & Sculptures.jpeg",
];

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="absolute rounded-2xl mt-10 inset-0 w-full overflow-hidden bg-black">
            {images.map((img, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? "opacity-100 z-0" : "opacity-0 -z-10"
                        }`}
                >
                    <Image
                        src={img}
                        alt={`Slide ${index}`}
                        fill
                        priority={index === 0}
                        className={`object-cover transition-transform duration-[4000ms] ${index === current ? "scale-110" : "scale-100"
                            }`}
                        sizes="100vw"
                        quality={75}
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>
            ))}
        </div>
    );
}