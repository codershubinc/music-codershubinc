'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import DecodeHTMLEntities from '@/utils/func/htmlDecode'
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { inf } from '@/utils/saavnApis/getSongInfo.api';
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
};

function MusicPlayerFull(
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
        isPlaying
    }: MusicPlayerProps
) {

    const [fetchedSongInfo, setFetchedSongInfo] = useState<any>()

    useEffect(() => {

        async function f(url: string) {
            console.log('currentSongInfo.url', currentSongInfo.url);
            let res = await inf(url)
            console.log('fetched song info', res?.data?.data[0] );
            setFetchedSongInfo(res?.data?.data[0] || [])

        }


        if (currentSongInfo?.url) {
            f(currentSongInfo.url)
        }
    }, [currentSongInfo])


    return (


        <div
            className={
                `  h-[99vh] w-[100vw] m-0  top-0 left-0 right-0 bottom-0 fixed rounded-xl bg-slate-900  shadow-lg flex flex-row lg:justify-evenly md:justify-center  z-50 ${isDisplay ? 'flex' : 'hidden'} `
            }
        >
            <Button
                className='absolute top-0 right-0 rotate-180'
                onClick={() => setIsDisplay(false)}
            >^</Button>
            <div
                className='mt-9 text-left flex justify-evenly flex-col lg:border lg:border-slate-600 border-solid lg:p-3 lg:w-max lg:rounded-2xl  md:border md:border-slate-600  md:p-3 md:rounded-2xl md:w-full md:justify-center md:items-center'
            >
                <div
                    className='min-h-32 flex flex-col w-[99%] mx-auto border bg-black border-slate-600 rounded-sm rounded-tl-3xl rounded-br-3xl '
                >
                    <h1
                        className='ml-2 text-2xl'
                    >
                        <span className='font-bold text-slate-700 text-lg'> Currently Playing ...</span>
                        <br />
                        {DecodeHTMLEntities(currentSongInfo?.musicName || 'play the music  ....')}
                    </h1>
                    <hr className='w-[95%] mx-auto' />
                    <p className='pl-2'>
                        <span className='font-bold text-slate-700 text-lg'> By ...</span>
                        <br />
                        {DecodeHTMLEntities(currentSongInfo?.singer.map((singer: string) => singer.trim()).join(' , ') || 'singers ....')}
                    </p>
                </div>

                <img
                    src={
                        // currentSongInfo?.musicAvatarUrl
                        // ||
                        "https://img.icons8.com/?size=500&id=IxuZbtfqlooy&format=png"
                    }
                    alt="Music Avatar"
                    className=' w-[97vw] md:w-96 object-cover rounded-3xl m-1'
                />

                <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={(event) => seekFn(event)}
                    style={{ width: '100%', animation: 'ease-in-out', }}
                    className='w-full accent-slate-600 transition-transform'
                />

                {/* ====> bottom controllers */}
                <div
                    className='w-full flex flex-wrap justify-between p-1 bg-slate-950 min-h-20 items-center rounded-3xl border border-slate-600  md:p-3  '
                >
                    <div className="flex w-full mt-3 mb-2 justify-around">
                        <button onClick={prevFn}>
                            <SkipBack className="w-6 h-6 text-blue-500" />
                        </button>
                        <button onClick={plPaFn}>
                            {isPlaying ? (
                                <Pause className="w-6 h-6 text-blue-500" />
                            ) : (
                                <Play
                                    className="w-6 h-6  text-slate-600"
                                />
                            )}
                        </button>
                        <button onClick={nextFn}>
                            <SkipForward className="w-6 h-6 text-blue-500" />
                        </button>
                    </div>
                    <hr className='w-[95%]' />
                    <div className='ml-1'>
                        {DecodeHTMLEntities(currentSongInfo?.musicName || 'play the music  ....')}
                    </div>
                    <div
                        className='w-[30%]'
                    >
                        {Math.floor(currentTime / 60)}:{('0' + Math.floor(currentTime % 60)).slice(-2)} /
                        {Math.floor(duration / 60)}:{('0' + Math.floor(duration % 60)).slice(-2)}
                    </div>
                </div>
            </div>


            <div className=' lg:flex my-auto mt-3  h-[100%] w-fit  justify-around items-center   hidden  '>
                <div
                    className='flex'
                >
                    {/* music playList songs container */}
                    <div
                        className="flex flex-col w-max lg:w-fit md:w-[50%] mx-auto h-[75vh] border border-solid border-white  bg-[#040303]  overflow-auto gap-4 p-2 rounded-3xl  shadow-2xl mb-11"
                    >
                        {allMusicInfo.map((music: any) => (

                            <div
                                key={music.$id}
                                id={music.$id}
                                onClick={() => playMusic(music.$id)}
                                className="p-1 flex m-[2px] border rounded-lg shadow items-center  bg-white dark:bg-gray-800"
                            >
                                <img
                                    src={
                                        String
                                            (
                                                music.musicAvatarUrl
                                                ||
                                                'https://img.icons8.com/?size=80&id=IxuZbtfqlooy&format=png'
                                            )
                                    }

                                    alt=""
                                    className='w-12 h-12 object-cover rounded-3xl'
                                />
                                <h2 className="text-lg font-semibold mx-2 text-nowrap overflow-hidden">
                                    {DecodeHTMLEntities(music.musicName)}
                                </h2>
                            </div>
                        ))}
                    </div>

                </div>

            </div>

        </div>

    )
}

export default MusicPlayerFull