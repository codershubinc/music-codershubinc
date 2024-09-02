'use client'
import React from 'react'
import { Button } from '../../ui/button'
import DecodeHTMLEntities from '@/utils/func/htmlDecode'
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import AddToPlayList from '../userActions/addToPlayList';
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
        isPlaying,
        playListId,
    }: MusicPlayerProps
) {



    return (


        <div
            className={
                `  max-h-screen h-screen w-screen m-0  top-0 left-0 right-0 bottom-2 fixed rounded-xl bg-slate-900  shadow-lg flex flex-row overscroll-y-contain lg:justify-between md:justify-evenly   z-50 ${isDisplay ? 'flex' : 'hidden'} `
            }
        >
            <Button
                className='text-3xl bg-slate-950 text-white fixed top-0 right-0 rotate-180 md:right-3 lg:right-4 '
                onClick={() => setIsDisplay(false)}
            >^</Button>




            {/* music info && music player */}
            <div
                className='mx-auto h-screen text-left flex justify-between flex-col lg:border lg:border-slate-600 border-solid lg:p-3 lg:w-[40%] lg:rounded-2xl  md:border md:border-slate-600  md:p-3 md:rounded-2xl md:w-full md:justify-evenly md:items-center'
            >

                {/* // ~add to playlist btn */}
                <AddToPlayList
                    currentSongInfo={currentSongInfo}
                    playListId={playListId}
                />
                <hr className='w-[95%] mx-auto bg-slate-700 ' />
                {/* // ? ====> music avatar  */}
                <div
                    className='h-max   md:h-auto lg:h-auto '
                >
                    <img
                        src={
                            currentSongInfo?.musicAvatarUrl
                            ||
                            "https://img.icons8.com/?size=500&id=IxuZbtfqlooy&format=png"
                        }
                        alt="Music Avatar"
                        className=' w-[90%] mx-auto mt-2 md:w-auto lg:w-full object-cover rounded-3xl m-1 '
                    />

                </div>
                {/* // ~ bottom control section   */}
                <div
                    className='w-full flex flex-wrap justify-between p-1 md:bg-slate-950 min-h-20 h-max items-center rounded-3xl md:border border-slate-600  md:p-3  '
                >

                    <div className='ml-1 w-full flex justify-between items-center  overflow-hidden min-h-12 '>

                        {/* // ! current music name */}
                        <div>
                            {DecodeHTMLEntities(currentSongInfo?.musicName || 'play the music  ....').split(']')[0] + ' ...'}
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

                </div>


            </div>

            {/* //? music playList  && songs container */}
            <div className=' lg:flex my-auto mt-3  h-[100%]  lg:w-max-[60%]  justify-around items-center   hidden  '>
                <div
                    className='flex'
                >
                    <div
                        className="flex flex-col w-full   mx-auto h-[75vh] border border-solid border-white  bg-[#040303]  overflow-auto gap-4 p-2 rounded-3xl  shadow-2xl mb-11"
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