import DecodeHTMLEntities from '@/utils/func/htmlDecode'
import { SkipBack, Pause, Play, SkipForward } from 'lucide-react'
import React from 'react'

function Controllers(
    {
        allMusicInfo,
        playMusic,
        nextFn,
        prevFn,
        plPaFn,
        duration,
        currentTime,
        seekFn,
        currentSongInfo,
        isPlaying
    }: {
        allMusicInfo: any,
        playMusic: any,
        nextFn: any,
        prevFn: any,
        plPaFn: any,
        duration: any,
        currentTime: any,
        seekFn: any,
        currentSongInfo: any,
        isPlaying: any
    }
) {
    return (
        <div
        className='w-[40%] '
        >
            {/* // ! audio controller  buttons */}
            <div className="flex w-full mt-3 mb-2 justify-around">
                <button onClick={prevFn}>
                    <SkipBack size={30} className="text-blue-500 hover:text-slate-600" />
                </button>
                <button onClick={plPaFn}>
                    {isPlaying ? (
                        <Pause size={30} className="text-blue-500 hover:text-slate-600" />
                    ) : (
                        <Play
                            size={30} className="text-slate-600"
                        />
                    )}
                </button>
                <button onClick={nextFn}>
                    <SkipForward size={30} className="text-blue-500 hover:text-slate-600" />
                </button>
            </div>

            <div className='ml-1 w-full flex justify-between items-center  overflow-hidden min-h-12 '>

                {/* // ! current music name */}
                <div>
                    {DecodeHTMLEntities(currentSongInfo?.musicName || 'play the music  ....')}
                </div>
                {/* // ! current music duration display */}
                <div
                    className='w-[30%]'
                >
                    {Math.floor(currentTime / 60)}:{('0' + Math.floor(currentTime % 60)).slice(-2)} /
                    {Math.floor(duration / 60)}:{('0' + Math.floor(duration % 60)).slice(-2)}
                </div>
            </div>
            {/* // ! input type range  */}
            <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={(event) => seekFn(event)}
                // style={{ width: '100%', animation: 'ease-in-out', }}
                className='w-full accent-slate-600 transition-transform'
            />
        </div>
    )
}

export default Controllers