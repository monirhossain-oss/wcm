'use client';
import { useState, useRef } from 'react';
import CreatorPopover from './CreatorPopover';

export default function CreatorName({ creator, item, region, API_BASE_URL }) {
    const [showCreator, setShowCreator] = useState(false);
    const hoverTimeout = useRef(null);
    // console.log(item)

    return (
        <div className="relative inline-block"
            onMouseEnter={() => { clearTimeout(hoverTimeout.current); setShowCreator(true); }}
            onMouseLeave={() => { hoverTimeout.current = setTimeout(() => setShowCreator(false), 150); }}>
            <button className="font-bold hover:underline dark:text-white cursor-pointer transition-colors whitespace-nowrap text-xs sm:text-sm">
                {item?.creatorId.profile.displayName || 'Anonymous'}
            </button>

            {showCreator && (
                <div className="absolute z-[200] bottom-full left-0 -translate-y-1 animate-creatorFade">
                    <CreatorPopover creator={creator} item={item} API_BASE_URL={API_BASE_URL} creatorLocation={region} />
                </div>
            )}
        </div>
    );
}