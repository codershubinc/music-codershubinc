import DecodeHTMLEntities from '@/utils/func/htmlDecode'
import { isNotPc } from '@/utils/func/isNotPc';
import React, { useState, useEffect } from 'react'

function NextSongInfoDisplay({
    nextSongInfo,
    nextFn
}: {
    nextSongInfo: any,
    nextFn: any
}) {
    // Local state to trigger animation when nextSongInfo changes
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Trigger transition whenever nextSongInfo changes
    useEffect(() => {
        setIsTransitioning(true);  // Start transition
        const timeout = setTimeout(() => {
            setIsTransitioning(false);  // End transition after the duration
        }, 700);  // Duration should match the CSS transition duration

        return () => clearTimeout(timeout);  // Clean up timeout on unmount or next render
    }, [nextSongInfo]);

    return (
        <div
            className={`transition-all duration-700 transform w-max cursor-pointer   ${isTransitioning ? 'scale-95' : 'scale-100'}`}
        >
            <p className='text-center' >Up Next</p>
            <div
                className={`flex text-center justify-center items-center gap-2 border border-white rounded-full p-2 mt-2 transition-all duration-700 transform lg:hover:scale-105 ${isTransitioning ? 'scale-95' : 'scale-100'}`}
                onClick={() => nextFn()}
            >
                <img
                    src={nextSongInfo?.musicAvatarUrl}
                    alt=""
                    className={`w-14 h-14 rounded-full border transition-transform duration-700 ${isTransitioning ? 'rotate-0' : 'rotate-6'}`}
                />
                <p
                    className='text-white text-xl font-semibold transition-all duration-700'
                >
                    {DecodeHTMLEntities(nextSongInfo?.musicName || '')}
                </p>
            </div>
        </div>
    )
}

export default NextSongInfoDisplay;
