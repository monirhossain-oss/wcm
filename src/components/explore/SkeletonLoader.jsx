export default function SkeletonLoader() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-4 animate-pulse">
                    {/* Image Placeholder */}
                    <div className="aspect-[4/5] bg-zinc-100 dark:bg-white/5 rounded-sm" />
                    {/* Text Placeholders */}
                    <div className="space-y-2">
                        <div className="h-4 bg-zinc-100 dark:bg-white/5 w-3/4 rounded" />
                        <div className="h-3 bg-zinc-100 dark:bg-white/5 w-1/2 rounded" />
                    </div>
                </div>
            ))}
        </div>
    );
}