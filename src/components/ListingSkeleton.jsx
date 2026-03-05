import React from 'react';

const ListingSkeleton = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col w-full animate-pulse">
                    {/* Image Placeholder */}
                    <div className="relative aspect-[4/3] bg-gray-200 dark:bg-zinc-800 rounded-xl overflow-hidden mb-3" />

                    {/* Info Placeholder */}
                    <div className="px-1 space-y-2">
                        <div className="flex justify-between items-center gap-2">
                            {/* Creator Name Placeholder */}
                            <div className="h-4 w-24 bg-gray-200 dark:bg-zinc-800 rounded" />
                            {/* Badge Placeholder */}
                            <div className="h-5 w-16 bg-orange-100 dark:bg-orange-900/20 rounded" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ListingSkeleton;