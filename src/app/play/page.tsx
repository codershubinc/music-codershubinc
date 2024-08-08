/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useState } from 'react';
import musicConfig from '@/config/dataBase/playListsDb/musicConfig';
import musicPlayList from '@/config/dataBase/playListsDb/musicPlayList';
import cryptoUtil from '@/lib/util/CryptoUtil';
import MusicPlayer from './musicPlayer';
import { useAuth } from '@/context/AuthContext';
import PageUi from '@/components/page/pageui';
import userAvatarDBConfig from '@/config/dataBase/userPrefs/userAvatarDBConfig';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { LampContainer } from '@/components/ui/lamp';

function Page() {
    const [playListId, setPlayListId] = useState<string>('');
    const [musicDetails, setMusicDetails] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { setIsSongPlaying, isUserLogin } = useAuth();
    const [id, setId] = useState('');

    // currently playing musicPlaylist details
    const [currentMusicPlaylist, setCurrentMusicPlaylist] = useState<any>();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const encryptedId = params.get('id');
        if (encryptedId) {
            const playListId = cryptoUtil.decryptString(encryptedId);
            setPlayListId(playListId);
        }
    }, []);

    useEffect(() => {
        const getSongsFromPlayList = async () => {
            try {
                console.log('Fetching playlist with ID:', playListId);
                const playlist = await musicPlayList.getMusicPlayListOne(playListId);
                setCurrentMusicPlaylist(playlist);
                if (playlist.musicContains) {
                    console.log('Fetched playlist:', playlist);
                    const avatarId = playlist?.musicPlayListAvatar;

                    const musicContainsInCurrentPlaylist = playlist?.musicContains;
                    if (musicContainsInCurrentPlaylist && avatarId) {
                        const musicDocsResponse = await musicConfig.getMusicConfig(avatarId);
                        const musicDocs = musicDocsResponse.documents;
                        console.log('Fetched music documents:', musicDocs);
                        setMusicDetails(musicDocs);
                    } else {
                        console.log('music cantains', musicContainsInCurrentPlaylist);

                        const avatar = await musicConfig.getMusicConfigBy$Id(musicContainsInCurrentPlaylist);
                        const musicDocs = avatar.documents;
                        console.log('Fetched music documents:', avatar);
                        setMusicDetails(musicDocs);
                    }
                } else {
                    setMusicDetails([]);
                }
            } catch (error) {
                console.error('Error fetching playlist:', error);
                setError('Error fetching playlist');
            } finally {
                setTimeout(() => setLoading(false), 2000);
            }
        };

        if (playListId) {
            getSongsFromPlayList();
        }
    }, [playListId,]);

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
            ) : !isUserLogin ? (
                <div className="grid grid-cols-1 w-max mx-auto gap-4">
                    Please login to play music
                </div>
            ) : (
                <div className=' my-auto mt-3  h-[100%]  justify-around items-center '>
                    <div
                        className='flex'
                    > 
                        {/* music playList songs container */}
                        <div
                            className="flex flex-col w-max mx-auto h-[75vh] border border-solid border-white  bg-[#040303]  overflow-auto gap-4 p-2 rounded-3xl  shadow-2xl mb-11"
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
                                                    currentMusicPlaylist.musicPlayListAvatar ?

                                                        'https://img.icons8.com/?size=80&id=IxuZbtfqlooy&format=png'
                                                        :

                                                        music.musicAvatarUrl
                                                )
                                        }

                                        alt=""
                                        className='w-12 h-12 object-cover rounded-3xl'
                                    />
                                    <h2 className="text-lg font-semibold mx-2 text-nowrap overflow-hidden">
                                        {music.musicName}
                                    </h2>
                                </div>
                            ))}
                        </div>

                    </div>
                    <MusicPlayer musicIds={musicIds} playMusicWithId={id} allMusicInfo={musicDetails} />
                </div>
            )
            }


        </PageUi >

    );
}

export default Page;
