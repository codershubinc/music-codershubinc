'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import DecodeHTMLEntities from '@/utils/func/htmlDecode'
import { ListPlusIcon, Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { inf } from '@/utils/saavnApis/getSongInfo.api';
import authService from '@/config/auth/auth';
import dbConfig from '@/config/dataBase/userPrefs/UserDBConfig';
import CreatePlaylistByUser from '../create-playlist-by-user/createPlaylistByUser';
import toast, { Toast } from 'react-hot-toast'
import musicPlayListByUser from '@/config/dataBase/playListsDb/musicPlayListByUser';
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

    const [user, setUser] = useState<any>()
    const [createPlaylist, setCreatePlaylist] = useState(false)
    const [fetchedSongInfo, setFetchedSongInfo] = useState<any>()
    const [playlistContent, setPlaylistContent] = useState<any>()

    useEffect(() => {

        async function f(url: string) {
            console.log('currentSongInfo.url', currentSongInfo.url);
            let res = await inf(url)
            console.log('fetched song info', res?.data?.data[0]);
            setFetchedSongInfo(res?.data?.data[0] || [])

        }


        if (currentSongInfo?.url) {
            f(currentSongInfo.url)
        }
        console.log('no song url found', currentSongInfo?.url);
        if (!user) {
            getUser()
        }

    }, [currentSongInfo])

    const getUser = async () => {
        const result = await authService.getCurrentUser()

        if (result.$id) {
            console.log('fond a user ', result);
            const userPrefs = await dbConfig.getDocument(result.$id)
            if (userPrefs) {
                console.log('got a user prefs', userPrefs);
                setUser(userPrefs)
                if (!userPrefs?.createdPlayLists[0]) return
                console.log('id = ', userPrefs?.createdPlayLists[0]);

                const pl = await musicPlayListByUser.getMusicPlayListByUser(userPrefs?.createdPlayLists[0])

                if (pl) {
                    console.log('got a playlist info', pl);

                    setPlaylistContent(pl)
                }

            }
        }
    }


    const playlistController = async () => {
        if (playlistContent) {
            const loadingToast = toast.loading('adding to playlist ...')
            const containsSongs = playlistContent?.musicContains
            if (containsSongs?.includes(currentSongInfo.$id)) {
                toast.error('Song is already in playlist.........')
                toast.dismiss(loadingToast)
                return
            }
            try {
                const result = await musicPlayListByUser.updateMusicPlayListByUser({
                    id: playlistContent.$id,
                    prefs: [...playlistContent.musicContains, currentSongInfo.$id]
                })
                console.log('added to playlist ', result);
                setPlaylistContent(result)
                toast.dismiss(loadingToast)
                toast.success('added to playlist')


            } catch (error: any) {
                console.log('failed to add playlist', error);
                toast.dismiss(loadingToast)
                toast.error('failed to add playlist')
            }


        } else {
            console.log('no playlist found');
            toast('no playlist found')
            setCreatePlaylist(true)
        }

    }



    return (


        <div
            className={
                `  h-max-[99vh] w-[100vw] m-0  top-0 left-0 right-0 bottom-0 fixed rounded-xl bg-slate-900  shadow-lg flex flex-row lg:justify-evenly md:justify-center  z-50 ${isDisplay ? 'flex' : 'hidden'} `
            }
        >
            <Button
                className='absolute top-0 right-0 rotate-180'
                onClick={() => setIsDisplay(false)}
            >^</Button>
            <div
                className='mt-9 mx-auto text-left flex justify-evenly flex-col lg:border lg:border-slate-600 border-solid lg:p-3 lg:w-max lg:rounded-2xl  md:border md:border-slate-600  md:p-3 md:rounded-2xl md:w-full md:justify-center md:items-center'
            >
                <div
                    className='min-h-32 flex flex-col w-[99%] mx-auto border bg-black border-slate-600 rounded-sm rounded-tl-3xl rounded-br-3xl '
                >
                    <h1
                        className='ml-2 text-2xl'
                    >
                        <span className='font-bold text-slate-700 text-lg'> Currently Playing ...</span>
                        <br />
                        {DecodeHTMLEntities(currentSongInfo?.musicName || 'play the music  ....').split('[')[0]}
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
                    className=' w-[97%] md:w-96 object-cover rounded-3xl m-1'
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
                    className='w-full flex flex-wrap justify-between p-1 md:bg-slate-950   items-center rounded-3xl md:border border-slate-600  md:p-3  '
                >
                    {user && currentSongInfo ?

                        <div>
                            <Button
                                type='button'
                                variant={'ghost'}
                                onClick={() => playlistController()}
                            >
                                {user?.createdPlayLists[0] ? <ListPlusIcon className="w-6 h-6 text-blue-500" aria-label='hi' /> : 'create playlist'}
                            </Button>
                            <p className='text-sm text-slate-700' >add to pl</p>
                        </div>
                        :
                        <p>
                            {currentSongInfo ? 'Loading .....' : 'Play the song to get options ....'}
                        </p>
                    }
                    {createPlaylist &&
                        <CreatePlaylistByUser
                            isDisplay={true}
                            setCreatePlaylist={setCreatePlaylist}
                            setUser={setUser}
                        />

                    }
                </div>
                <div
                    className='w-full flex flex-wrap justify-between p-1 md:bg-slate-950 min-h-20 items-center rounded-3xl md:border border-slate-600  md:p-3  '
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
                    <div className='ml-1 w-[65%] overflow-hidden h-12 '>
                        {DecodeHTMLEntities(currentSongInfo?.musicName || 'play the music  ....').split('[')[0]}
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