"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

export default function CreatorsPage() {
  const [creators, setCreators] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

  const LIMIT = 8;

  const fetchCreators = async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;

    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/users/famous-creators?limit=${LIMIT}&offset=${offset}`
      );

      const newCreators = res.data.data;

      // 🔥 DUPLICATE FILTER
      setCreators((prev) => {
        const existingIds = new Set(prev.map((c) => c._id));
        const filtered = newCreators.filter(
          (c) => !existingIds.has(c._id)
        );
        return [...prev, ...filtered];
      });

      if (!res.data.pagination.hasMore) {
        setHasMore(false);
      }

      setOffset((prev) => prev + LIMIT);
    } catch (error) {
      console.error(error);
    }

    loadingRef.current = false;
  };

  // Initial fetch
  useEffect(() => {
    fetchCreators();
  }, []);

  // Scroll listener (ONLY ONCE)
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        fetchCreators();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // 🔥 empty dependency

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <h1 className="text-3xl font-bold mb-10 text-center">
        All Creators
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {creators.map((creator) => (
          <div
            key={creator._id}
            className="bg-white dark:bg-zinc-800 rounded-2xl shadow hover:shadow-lg transition p-6 text-center"
          >
            <div className="relative w-24 h-24 mx-auto mb-4">
              <Image
                src={
                  creator.profile?.profileImage ||
                  "/default-avatar.png"
                }
                alt={creator.username}
                fill
                className="rounded-full object-cover"
              />
            </div>

            <h3 className="font-semibold text-lg">
              {creator.firstName} {creator.lastName}
            </h3>

            <p className="text-sm text-gray-500">
              {creator.profile?.city || "Unknown"},{" "}
              {creator.profile?.country || "World"}
            </p>

            <p className="text-xs text-gray-400 mt-2">
              {creator.totalListings} Listings
            </p>

            <Link
              href={`/profile/${creator._id}`}
              className="mt-4 py-1 px-4 inline-block text-sm bg-orange-400 text-white rounded-2xl hover:bg-orange-700 transition"
            >
              View Profile
            </Link>
          </div>
        ))}
      </div>

      {!hasMore && (
        <p className="text-center mt-8 text-gray-400">
          You have seen all creators
        </p>
      )}
    </div>
  );
}




