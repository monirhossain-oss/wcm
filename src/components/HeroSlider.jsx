"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
    "https://i.ibb.co.com/6RXQcNcM/15-4-11zon-min-2048x1365-1-1170x550.webp",
    "https://i.ibb.co.com/ycFMBh0N/photo-1589463349208-95817c91f971.avif",
    "https://i.ibb.co.com/JRMkRJqG/abstract-silhouettes-front-view-geometric-260nw-2496928155.webp",
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
        <div className="absolute rounded-2xl mt-10 inset-0 w-full  overflow-hidden bg-black">
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
                        className={`object-cover transition-transform duration-[4000ms] ${index === current ? "scale-110" : "scale-100"}`}
                        sizes="100vw"
                        quality={75}
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>
            ))}
        </div>
    );
}