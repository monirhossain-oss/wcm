"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const creators = [
    {
        id: 1,
        name: "Anita Sharma",
        country: "India",
        culture: "Handicrafts",
        listings: 12,
        image: "/creator1.png",
        profileUrl: "/creators/anita-sharma",
        verified: true,
    },
    {
        id: 2,
        name: "Liam Nguyen",
        country: "Vietnam",
        culture: "Textiles",
        listings: 8,
        image: "/creator2.png",
        profileUrl: "/creators/liam-nguyen",
        verified: false,
    },
    {
        id: 3,
        name: "Maria Rossi",
        country: "Italy",
        culture: "Painting",
        listings: 15,
        image: "/creator3.png",
        profileUrl: "/creators/maria-rossi",
        verified: true,
    },
    {
        id: 4,
        name: "Kofi Mensah",
        country: "Ghana",
        culture: "Sculptures",
        listings: 9,
        image: "/creator4.png",
        profileUrl: "/creators/kofi-mensah",
        verified: false,
    },
    {
        id: 5,
        name: "Kofi Mensah",
        country: "Ghana",
        culture: "Sculptures",
        listings: 9,
        image: "/creator5.png",
        profileUrl: "/creators/kofi-mensah",
        verified: false,
    },
    {
        id: 6,
        name: "Kofi Mensah",
        country: "Ghana",
        culture: "Sculptures",
        listings: 9,
        image: "/creator6.png",
        profileUrl: "/creators/kofi-mensah",
        verified: false,
    },
];

const extendedCreators = [
    creators[creators.length - 1],
    ...creators,
    creators[0],
];

export default function PopularCreators() {
    const scrollRef = useRef(null);
    const cardWidth = 280;

    useEffect(() => {
        scrollRef.current.scrollLeft = cardWidth;
    }, []);

    const scrollLeft = () => {
        scrollRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
    };

    const scrollRight = () => {
        scrollRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    };

    const handleScroll = () => {
        const container = scrollRef.current;
        const maxScroll = cardWidth * (extendedCreators.length - 1);

        if (container.scrollLeft <= 0) {
            container.scrollLeft = cardWidth * creators.length;
        }

        if (container.scrollLeft >= maxScroll) {
            container.scrollLeft = cardWidth;
        }
    };

    return (
        <section
            className="py-8"
            style={{ backgroundColor: "var(--color-ui)" }}
        >
            <div className="max-w-7xl mx-auto px-4">
                {/* Title */}
                <div className="mb-4">
                    <h2
                        className="text-3xl font-semibold"
                        style={{ color: "var(--color-foreground)" }}
                    >
                        Popular Creators
                    </h2>
                    <p
                        className="mt-2 max-w-xl"
                        style={{ color: "var(--color-text)" }}
                    >
                        Meet talented creators from around the world
                    </p>
                </div>

                {/* Carousel */}
                <div className="relative">
                    {/* Left Arrow */}
                    <button
                        onClick={scrollLeft}
                        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 shadow transition"
                        style={{
                            backgroundColor: "var(--color-background)",
                            color: "var(--color-primary)",
                        }}
                    >
                        <FaArrowLeft />
                    </button>

                    {/* Right Arrow */}
                    <button
                        onClick={scrollRight}
                        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-3 shadow transition"
                        style={{
                            backgroundColor: "var(--color-background)",
                            color: "var(--color-primary)",
                        }}
                    >
                        <FaArrowRight />
                    </button>

                    {/* Cards */}
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="flex gap-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide px-10"
                    >
                        {extendedCreators.map((creator, index) => (
                            <div
                                key={index}
                                className="flex-none w-64 rounded-xl shadow-md hover:shadow-lg transition snap-start"
                                style={{ backgroundColor: "var(--color-background)" }}
                            >
                                <div className="p-6 flex flex-col items-center text-center">
                                    {/* Image */}
                                    <div className="relative w-24 h-24 mb-4">
                                        <Image
                                            src={creator.image}
                                            alt={creator.name}
                                            fill
                                            className="rounded-full object-cover"
                                        />
                                    </div>

                                    {/* Info */}
                                    <h3
                                        className="text-lg font-semibold"
                                        style={{ color: "var(--color-foreground)" }}
                                    >
                                        {creator.name}
                                    </h3>

                                    <p
                                        className="text-sm mt-1"
                                        style={{ color: "var(--color-text)" }}
                                    >
                                        {creator.country} • {creator.culture}
                                    </p>

                                    <p
                                        className="text-sm mt-1"
                                        style={{ color: "var(--color-text)" }}
                                    >
                                        {creator.listings} Listings
                                    </p>

                                    {creator.verified && (
                                        <span
                                            className="mt-3 text-xs px-3 py-1 rounded-full"
                                            style={{
                                                backgroundColor: "var(--color-success)",
                                                color: "#fff",
                                            }}
                                        >
                                            Verified
                                        </span>
                                    )}

                                    <Link
                                        href={creator.profileUrl}
                                        className="mt-5 inline-block px-4 py-2 rounded-full transition"
                                        style={{
                                            backgroundColor: "var(--color-primary)",
                                            color: "#fff",
                                        }}
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
