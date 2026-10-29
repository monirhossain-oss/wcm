export default function CultureSkeleton() {
    return (
        <div className="flex gap-4 md:gap-6 overflow-hidden w-full">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="min-w-[70%] md:min-w-[23%] h-48 md:h-56 bg-gray-100 dark:bg-zinc-900 animate-pulse rounded-xl relative">
                    <div className="absolute bottom-5 left-5 w-3/4">
                        <div className="h-4 bg-gray-200 dark:bg-zinc-800 rounded mb-2 w-full"></div>
                        <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}