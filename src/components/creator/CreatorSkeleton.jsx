import React from 'react';

const CreatorSkeleton = () => {
    return (
        <div className="flex gap-4 md:gap-6 overflow-hidden w-full animate-pulse">
            {[...Array(4)].map((_, index) => (
                <div key={index} className="min-w-[70%] sm:min-w-[40%] md:min-w-[23%] bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 p-6 text-center flex flex-col items-center shadow-sm">
                    {/* Image Skeleton */}
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gray-200 dark:bg-zinc-800 mb-4" />
                    {/* Name Skeleton */}
                    <div className="w-3/4 h-4 bg-gray-200 dark:bg-zinc-800 rounded mb-2" />
                    {/* Location Skeleton */}
                    <div className="w-1/2 h-3 bg-gray-100 dark:bg-zinc-800/50 rounded mb-4" />
                    {/* Badge Skeleton */}
                    <div className="w-20 h-5 bg-orange-50 dark:bg-orange-900/10 rounded-full mb-6" />
                    {/* Button Skeleton */}
                    <div className="w-full h-9 bg-gray-200 dark:bg-zinc-800 rounded-full mt-auto" />
                </div>
            ))}
        </div>
    );
};

export default CreatorSkeleton;