"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegistationModal";

export default function HeroActions() {
    const { user } = useAuth();
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    const isCreator = user?.role === "creator";
    const isAdmin = user?.role === "admin";

    // মোডাল সুইচিং লজিক
    const openRegister = () => {
        setIsLoginOpen(false);
        setIsRegisterOpen(true);
    };

    const openLogin = () => {
        setIsRegisterOpen(false);
        setIsLoginOpen(true);
    };

    const handleBecomeCreatorClick = (e) => {
        if (!user) {
            e.preventDefault(); // লিংক এর ডিফল্ট কাজ বন্ধ করবে
            setIsLoginOpen(true); // লগইন মোডাল ওপেন করবে
        }
    };

    return (
        <div className="mt-8 flex justify-center gap-3 sm:gap-4">
            {/* Explore Button */}
            <Link href="/discover">
                <button className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-[#F57C00] text-white font-bold whitespace-nowrap">
                    Discover Creations
                </button>
            </Link>

            {/* Creator Button Logic */}
            {isCreator || isAdmin ? (
                <button
                    disabled
                    className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-gray-400/50 text-black dark:text-white font-medium whitespace-nowrap"
                >
                    {isAdmin ? "Admin Access Active" : "Creator Mode Active"}
                </button>
            ) : (
                <Link
                    href="/become-creator"
                    onClick={handleBecomeCreatorClick}
                >
                    <button className="
                        px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg font-medium whitespace-nowrap
                        border border-[#F57C00] text-[#F57C00] bg-transparent
                        transition-all duration-300 cursor-pointer
                        hover:bg-[#F57C00] hover:text-white hover:shadow-md
                        dark:border-[#F57C00] dark:text-[#F57C00]
                        dark:hover:bg-[#F57C00] dark:hover:text-white
                    ">
                        Become a Creator
                    </button>
                </Link>
            )}

            {/* Modals */}
            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                onSwitchToRegister={openRegister}
            />

            <RegisterModal
                isOpen={isRegisterOpen}
                onClose={() => setIsRegisterOpen(false)}
                onSwitchToLogin={openLogin}
            />
        </div>
    );
}