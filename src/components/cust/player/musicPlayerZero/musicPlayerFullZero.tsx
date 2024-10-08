'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '../../../ui/button'
import KeepScreenAwake from '../../screenAwake/keepAwake';
import Avatar from './avatar';
import Controllers from './controlleres';
type SongInfo = {
    $id: string;
    musicName: string;
    singer: string[];
    musicAvatarUrl: string;
    url: string
}
type MusicPlayerProps = {
    currentSongInfo: SongInfo;
    isDisplay: boolean;
    allMusicInfo: SongInfo[];
    playMusic: (id: string) => void;
    setIsDisplay: (val: boolean) => void;
    nextFn: () => void;
    prevFn: () => void;
    plPaFn: () => void;
    duration: number;
    currentTime: number;
    seekFn: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isPlaying: boolean;
    playListId: string;
};

function MusicPlayerFullZero(
    {
        currentSongInfo,
        isDisplay,
        setIsDisplay,
        allMusicInfo,
        playMusic,
        nextFn,
        prevFn,
        plPaFn,
        duration,
        currentTime,
        seekFn,
        isPlaying,
        playListId,
    }: MusicPlayerProps
) {

    // console.log('all music info', allMusicInfo);

    const [nextSongInfo, setNextSongInfo] = useState<SongInfo | null>(null);

    useEffect(() => {
        console.log('playListId', playListId);
        const currentIndex = allMusicInfo?.indexOf(currentSongInfo)

        if (currentIndex) {
            console.log('currentIndex', currentIndex);


            const nextIndex = currentIndex === -1 ? 1 : (currentIndex + 1) % allMusicInfo.length

            console.log('nextSongInfo', allMusicInfo[nextIndex]);
            setNextSongInfo(allMusicInfo[nextIndex])
        }




    }, [currentSongInfo])

    return (
        <div
            className='w-screen h-screen flex flex-col justify-center items-center fixed top-0 left-0 right-0 bottom-0 z-50 bg-black'
        >
            <div
                className='flex w-screen h-screen   justify-evenly items-center'
            >
                <Avatar currentSongInfo={currentSongInfo} />
                <Controllers
                    allMusicInfo={allMusicInfo}
                    playMusic={playMusic}
                    nextFn={nextFn}
                    prevFn={prevFn}
                    plPaFn={plPaFn}
                    duration={duration}
                    currentTime={currentTime}
                    seekFn={seekFn}
                    currentSongInfo={currentSongInfo}
                    isPlaying={isPlaying}
                />
            </div>


            {/* // ! other controls */}
            <KeepScreenAwake />
            <p>Up Next</p>
            <div
            className='flex text-center justify-center items-center gap-2 border border-white rounded-full p-2 mt-2 animate-aurora'
            >
                <img
                    src={nextSongInfo?.musicAvatarUrl}
                    alt=""
                    className='w-14 h-14 rounded-full border      '
                />
                <p
                className='text-white text-xl font-semibold'
                >
                    {nextSongInfo?.musicName}
                </p>
            </div>
            <Button
                className='text-3xl bg-slate-950 text-white fixed top-0 right-0 rotate-180 md:right-3 lg:right-4 '
                onClick={() => setIsDisplay(false)}
            >^</Button>
        </div>
    )

}

export default MusicPlayerFullZero