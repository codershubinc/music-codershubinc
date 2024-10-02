'use client'
import React from 'react'
import { Button } from '../../../ui/button'
import DecodeHTMLEntities from '@/utils/func/htmlDecode'
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import AddToPlayList from '../../userActions/addToPlayList';
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
            <Button
                className='text-3xl bg-slate-950 text-white fixed top-0 right-0 rotate-180 md:right-3 lg:right-4 '
                onClick={() => setIsDisplay(false)}
            >^</Button>
        </div>
    )

}

export default MusicPlayerFullZero