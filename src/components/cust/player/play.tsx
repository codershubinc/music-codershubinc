/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useState } from 'react';
import MusicPlayer from './musicPlayer';
import { useAuth } from '@/context/AuthContext';
import PageUi from '@/components/page/pageui';
import { LampContainer } from '@/components/ui/lamp';
import DecodeHTMLEntities from '@/utils/func/htmlDecode';
import GetMusic from '@/utils/musicControllers/musicDB/musicFromDB';

function Play({ playList }: { playList: any }) {

    const [musicDetails, setMusicDetails] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { setIsSongPlaying, isUserLogin } = useAuth();
    const [id, setId] = useState('');



    // currently playing musicPlaylist details 


    useEffect(() => {
        const getSongsFromPlayList = async () => {
            await GetMusic(
                setMusicDetails,
                playList,
                setError,
                setLoading,
            )
        };

        if (playList) {
            getSongsFromPlayList();
        }
    }, [playList]);

    const playMusic = (mId: string) => {
        setId(mId);
        setIsSongPlaying(true);
    };

    console.log('isUserLogin', isUserLogin);

    const musicIds = musicDetails.map((music: any) => music.$id);

    return (


        <PageUi className='h-full w-full '>

            {/* <h1 className="text-2xl font-bold mb-4 text-center">Playlist Details</h1> */}
            {loading ? (
                <LampContainer>
                    <p>Loading...</p>
                </LampContainer>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : musicDetails.length <= 0 ? (
                <p>No songs found in this playlist</p>
            ) : (
                <div className={`my-auto mt-3  h-fit min-h-screen  bg-black justify-around items-center `} >

                    <MusicPlayer
                        musicIds={musicIds}
                        playMusicWithId={id}
                        allMusicInfo={musicDetails}
                        playListId={playList.$id}
                    />

                    <div
                        className='flex pb-11 '
                    >
                        {/* music playList songs container */}
                        <div
                            className={`flex flex-col w-full lg:w-[36%] md:w-[50%] mx-auto h-[90vh] border border-solid border-white  bg-[#040303]  overflow-auto gap-4 p-2 rounded-3xl  shadow-2xl mb-11  `}
                        >
                            {musicDetails.map((music: any) => (

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
                                                    playList.musicPlayListAvatar ?

                                                        'https://img.icons8.com/?size=80&id=IxuZbtfqlooy&format=png'
                                                        :
                                                        music.musicAvatarUrl
                                                )
                                        }

                                        alt=""
                                        className='w-12 h-12 object-cover rounded-3xl'
                                    />
                                    <h2 className="text-lg font-semibold mx-2 text-nowrap overflow-hidden">
                                        {DecodeHTMLEntities(music.musicName || '')}
                                    </h2>
                                </div>
                            ))}
                        </div>

                    </div>

                </div>
            )
            }


        </PageUi >

    );
}

export default Play;
