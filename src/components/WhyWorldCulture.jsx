import React from 'react';
import Image from 'next/image';

const WhyWorldCulture = () => {
    const points = [
        {
            id: 1,
            title: "Discover authentic cultural creations",
            images: ["/African-attire.jpeg", "/artisan-hand-made-pottery.jpeg"],
        },
        {
            id: 2,
            title: "Support global creators",
            images: ["/artisan-weaving-textile-loom.jpeg", "/asian-kimono-silk-garment.jpeg"],
        },
        {
            id: 3,
            title: "Explore traditions from around the world",
            images: ["/Artisan-jewelry.png", "/why.png"],
        },
    ];

    return (
        <section className="py-6 px-4 max-w-7xl mx-auto bg-white dark:bg-[#0a0a0a]">
            {/* Heading */}
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
                Why World Culture Marketplace?
            </h2>

            <div className="flex flex-col gap-10 items-center">
                {points.map((point) => (
                    <div
                        key={point.id}
                        className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left"
                    >
                        {/* Images */}
                        <div className="flex gap-3">
                            {point.images.map((img, index) => (
                                <div
                                    key={index}
                                    className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden shadow-sm"
                                >
                                    <Image
                                        src={img}
                                        alt="Cultural representation"
                                        fill
                                        className="object-cover transition-transform duration-300 hover:scale-110"
                                        sizes="(max-width: 768px) 64px, 80px"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Text */}
                        <p className="text-lg md:text-2xl font-medium text-gray-700 dark:text-gray-300 max-w-md">
                            {point.title}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WhyWorldCulture;
