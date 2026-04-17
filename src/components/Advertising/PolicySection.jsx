export const PolicySection = ({ number, title, children }) => (
    <section className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#F57C00] to-transparent rounded-full opacity-60" />
        <div className="pl-6">
            {number && (
                <span className="inline-block text-[11px] font-black tracking-[0.2em] uppercase text-[#F57C00] mb-2 opacity-90">
                    {number}
                </span>
            )}
            <h2 className="text-[22px] font-black tracking-tight text-gray-900 dark:text-white mb-5 leading-snug">
                {title}
            </h2>
            <div className="text-[14.5px] leading-[1.85] text-gray-600 dark:text-gray-400 space-y-4">
                {children}
            </div>
        </div>
    </section>
);