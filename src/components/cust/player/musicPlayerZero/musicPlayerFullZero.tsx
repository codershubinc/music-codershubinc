'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '../../../ui/button'
import KeepScreenAwake from '../../screenAwake/keepAwake';
import Avatar from './avatar';
import Controllers from './controlleres';
import NextSongInfoDisplay from './nextSongInfoDisplay';

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
    }: MusicPlayerProps
) {

    // console.log('all music info', allMusicInfo);

    const [nextSongInfo, setNextSongInfo] = useState<SongInfo | null>(null);

    const findNextSongInfo = () => {

        const currentIndex = allMusicInfo?.indexOf(currentSongInfo)
        const nextIndex = currentIndex === -1 ? 1 : (currentIndex + 1) % allMusicInfo.length
        setNextSongInfo(allMusicInfo[nextIndex])
    }

    useEffect(() => {
        findNextSongInfo()
    }, [currentSongInfo])

    return (
        <div
            className=' w-screen h-screen flex flex-col justify-center items-center fixed top-0 left-0 right-0 bottom-0 z-50 bg-black '
        >
            <div
                className='flex w-screen h-screen   justify-evenly items-center'
            >
                <Avatar
                    currentSongInfo={currentSongInfo}
                    className={`${(isPlaying ? '' : 'scale-95')} lg:hover:scale-105  `}
                />
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
            <NextSongInfoDisplay nextSongInfo={nextSongInfo} nextFn={nextFn} />
            <Button
                className='text-3xl bg-slate-950 text-white fixed top-0 right-0 rotate-180 md:right-3 lg:right-4 '
                onClick={() => setIsDisplay(false)}
            >^</Button>
        </div>
    )

}

export default MusicPlayerFullZero