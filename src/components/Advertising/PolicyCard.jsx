import { Ul } from './SharedComponents';

export const PolicyCard = ({ num, title, intro, items, note }) => (
    <div className="bg-white dark:bg-white/[0.03] border border-gray-100 dark:border-gray-800 rounded-2xl p-5 flex flex-col gap-3 h-full">
        <span className="text-[11px] font-black tracking-[0.2em] text-[#F57C00]">SECTION {num}</span>
        <h3 className="text-[15px] font-black text-gray-900 dark:text-white">{title}</h3>
        {intro && <p className="text-[13.5px] text-gray-600 dark:text-gray-400">{intro}</p>}
        <Ul items={items} />
        {note && (
            <p className="text-[12px] text-gray-400 dark:text-gray-600 italic border-t border-gray-100 dark:border-gray-800 pt-3 mt-auto">
                {note}
            </p>
        )}
    </div>
);