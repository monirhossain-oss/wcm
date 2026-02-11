"use client";
import React, { useState } from "react";
import { FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const trendingItems = [
    { title: "Handwoven Moroccan Rug", subtitle: "Traditional Berber design", image: "/rug.jpg", author: "Fatima K.", likes: 234, promoted: true },
    { title: "Tea Ceremony Set", subtitle: "Authentic Japanese craftsmanship", image: "/tea-set.jpg", author: "Kenji T.", likes: 189, promoted: false },
    { title: "Tribal Wooden Mask", subtitle: "West African tradition", image: "/mask.jpg", author: "Kofi A.", likes: 156, promoted: false },
    { title: "Embroidered Huipil", subtitle: "Oaxacan handcraft", image: "/huipil.jpg", author: "Maria G.", likes: 312, promoted: true },
    { title: "Native Beaded Necklace", subtitle: "Native American craftsmanship", image: "/necklace.jpg", author: "Alex R.", likes: 98, promoted: false },
    { title: "Hand-painted Vase", subtitle: "Mediterranean style", image: "/vase.jpg", author: "Sophia L.", likes: 145, promoted: false },
    { title: "Silk Kimono", subtitle: "Japanese traditional clothing", image: "/kimono.jpg", author: "Hiroshi T.", likes: 203, promoted: true },
    { title: "African Drum", subtitle: "West African percussion instrument", image: "/drum.jpg", author: "Kwame N.", likes: 178, promoted: false },
    { title: "Persian Carpet", subtitle: "Authentic Persian design", image: "/persian-carpet.jpg", author: "Leila M.", likes: 276, promoted: true },
    { title: "Handmade Pottery", subtitle: "Rustic craftsmanship", image: "/pottery.jpg", author: "Emma K.", likes: 132, promoted: false },
    { title: "Traditional Basket", subtitle: "African handcraft", image: "/basket.jpg", author: "Samuel A.", likes: 88, promoted: false },
    { title: "Colorful Shawl", subtitle: "Mexican handwoven textile", image: "/shawl.jpg", author: "Isabel G.", likes: 199, promoted: true },
];

const TrendingListings = () => {
    const [filter, setFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    // Filtering
    const filteredItems = trendingItems.filter((item) => {
        if (filter === "All") return true;
        if (filter === "Today") return true;
        if (filter === "This week") return true;
    });

    // Pagination 
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 relative">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Trending listings
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Discover what's popular right now
                    </p>
                </div>

                {/* Filters */}
                <div className="flex space-x-2">
                    {["All", "Today", "This week"].map((f) => (
                        <button
                            key={f}
                            onClick={() => { setFilter(f); setCurrentPage(1); }}
                            className={`px-3 py-1 text-sm font-medium rounded ${filter === f
                                ? "bg-[#F57C00] text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
                {currentItems.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-[#0a0a0a] shadow rounded-lg overflow-hidden relative"
                    >
                        {item.promoted && (
                            <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                                Promoted
                            </span>
                        )}
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                                {item.title}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {item.subtitle}
                            </p>
                            <div className="flex items-center justify-between mt-3 text-xs text-gray-500 dark:text-gray-400">
                                <span>{item.author}</span>
                                <span className="flex items-center space-x-1">
                                    <FaHeart className="text-red-500" /> <span>{item.likes}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="absolute inset-y-0 left-0 flex items-center">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                        <FaChevronLeft />
                    </button>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center">
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                        <FaChevronRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrendingListings;
