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
                    <button className="px-8 py-3 border border-white/30 text-white bg-white/10 rounded-lg">
                        Become a Creator
                    </button>
                </Link>
            )}
        </div>
    );
}