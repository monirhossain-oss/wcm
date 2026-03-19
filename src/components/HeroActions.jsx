"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function HeroActions() {
    const { user } = useAuth();

    const isCreator = user?.role === "creator";
    const isAdmin = user?.role === "admin";

    return (
        <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/discover">
                <button className="px-8 py-3 rounded-lg bg-[#F57C00] text-white font-bold">
                    Explore Products
                </button>
            </Link>

            {isCreator || isAdmin ? (
                <button
                    disabled
                    className="px-8 py-3 rounded-lg bg-gray-400/50 text-white"
                >
                    {isAdmin ? "Admin Access Active" : "Creator Mode Active"}
                </button>
            ) : (
                <Link href={user ? `/become-creator` : `/auth/login`}>
                    <button className="
    px-8 py-3 rounded-lg font-medium transition-all duration-300
    border border-gray-300 text-gray-800 bg-white hover:bg-gray-100
    dark:border-white/30 dark:text-white dark:bg-white/10 dark:hover:bg-white/20
  ">
                        Become a Creator
                    </button>
                </Link>
            )}
        </div>
    );
}