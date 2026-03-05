"use client";

import { useState, useEffect } from "react";

export default function HeroSlider() {
    const images = [
        "https://i.ibb.co.com/6RXQcNcM/15-4-11zon-min-2048x1365-1-1170x550.webp",
        "https://i.ibb.co.com/ycFMBh0N/photo-1589463349208-95817c91f971.avif",
        "https://i.ibb.co.com/JRMkRJqG/abstract-silhouettes-front-view-geometric-260nw-2496928155.webp",
    ];

    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 8000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="absolute inset-0 w-full h-full">
            {images.map((img, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentImage ? "opacity-100" : "opacity-0"
                        }`}
                    style={{
                        backgroundImage: `url(${img})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/50 to-black/80" />
                </div>
            ))}
        </div>
    );
}