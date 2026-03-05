import React from 'react';

const CreatorSkeleton = () => {
    const skeletons = Array(4).fill(0);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
            {skeletons.map((_, index) => (
                <div key={index} className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 p-8 text-center h-full flex flex-col items-center shadow-sm">
                    {/* Image Skeleton */}
                    <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-zinc-700 mb-4" />

                    {/* Name Skeleton */}
                    <div className="w-3/4 h-5 bg-gray-200 dark:bg-zinc-700 rounded mb-2" />

                    {/* Location Skeleton */}
                    <div className="w-1/2 h-4 bg-gray-100 dark:bg-zinc-800 rounded mb-4" />

                    {/* Listings Badge Skeleton */}
                    <div className="w-24 h-6 bg-orange-50 dark:bg-orange-950 rounded-full mb-6" />

                    {/* Button Skeleton */}
                    <div className="w-full h-10 bg-gray-200 dark:bg-zinc-700 rounded-xl mt-auto" />
                </div>
            ))}
        </div>
    );
};

export default CreatorSkeleton;