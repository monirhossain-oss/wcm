import React from 'react'
import { FaUtensils, FaChevronDown, FaGlobe, FaTheaterMasks } from "react-icons/fa";

export default function HeroSection() {
    return (
        <section className="bg-[#F2F2F2] dark:bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto px-6 pt-20 pb-8 md:pt-20 flex flex-col items-center text-center">

                {/* Heading */}
                <h1 className="text-5xl md:text-6xl font-semibold text-[#1F1F1F] dark:text-gray-100">
                    Discover <br /> culture <span className="text-[#7A1E1E]">worldwide</span>
                </h1>

                {/* Subheading */}
                <p className="mt-6 max-w-2xl text-lg text-[#1F1F1F]/80 dark:text-gray-300">
                    Explore authentic products, stories, and experiences from creators
                    around the world — crafted with culture, passion, and purpose.
                </p>

                {/* CTA Buttons */}
                <div className="mt-4 flex py-4 sm:flex-row gap-3 sm:gap-4">
                    <button className="px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base cursor-pointer rounded-lg bg-[#F57C00] text-white font-medium hover:opacity-90 transition">
                        Explore Products
                    </button>

                    <button className="px-4 py-2 sm:px-6 sm:py-2 text-sm sm:text-base cursor-pointer rounded-lg border border-[#7A1E1E] text-[#7A1E1E] font-medium hover:bg-[#7A1E1E] hover:text-white transition">
                        Become a Creator
                    </button>
                </div>
                {/* Filters / Selects */}
                <div className="max-w-3xl w-full mx-auto py-4 flex flex-col md:flex-row gap-4">

                    {/* Category */}
                    <div className="relative w-full md:w-1/3 mx-auto">
                        <FaUtensils className="absolute left-4 top-1/2 -translate-y-1/2 text-[#716f6f]" />
                        <select
                            className="w-full bg-white px-12 py-3 rounded-full  
                         text-[#1F1F1F] dark:text-gray-500 appearance-none
                         border border-gray-300 dark:border-gray-700
                         focus:outline-none focus:ring-2 focus:ring-[#F57C00]
                         transition duration-200"
                        >
                            <option value="">Category</option>
                            <option value="food">Food</option>
                            <option value="art">Art</option>
                            <option value="music">Music</option>
                        </select>
                        <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#716f6f] dark:text-gray-200" />
                    </div>

                    {/* Region */}
                    <div className="relative w-full md:w-1/3 mx-auto">
                        <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-[#716f6f]" />
                        <select
                            className="w-full bg-white px-12 py-3 rounded-full 
                         text-[#1F1F1F] dark:text-gray-500 appearance-none
                         border border-gray-300 dark:border-gray-700
                         focus:outline-none focus:ring-2 focus:ring-[#F57C00]
                         transition duration-200"
                        >
                            <option value="">Region</option>
                            <option value="asia">Asia</option>
                            <option value="europe">Europe</option>
                            <option value="africa">Africa</option>
                        </select>
                        <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#716f6f] dark:text-gray-200" />
                    </div>

                    {/* Cultural */}
                    <div className="relative w-full md:w-1/3 mx-auto">
                        <FaTheaterMasks className="absolute left-4 top-1/2 -translate-y-1/2 text-[#716f6f]" />
                        <select
                            className="w-full bg-white px-12 py-3 rounded-full 
                         text-[#1F1F1F] dark:text-gray-500 appearance-none
                         border border-gray-300 dark:border-gray-700
                         focus:outline-none focus:ring-2 focus:ring-[#F57C00]
                         transition duration-200"
                        >
                            <option value="">Cultural</option>
                            <option value="traditional">Traditional</option>
                            <option value="modern">Modern</option>
                            <option value="fusion">Fusion</option>
                        </select>
                        <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#716f6f] dark:text-gray-200" />
                    </div>

                </div>

            </div>
        </section>
    )
}
