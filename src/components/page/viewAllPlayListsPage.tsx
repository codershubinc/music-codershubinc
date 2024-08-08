/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useState } from 'react';
import PageUi from './pageui';
import musicPlayList from '@/config/dataBase/playListsDb/musicPlayList';
import Link from 'next/link';
import cryptoUtil from '@/lib/util/CryptoUtil';
import userAvatarDBConfig from '@/config/dataBase/userPrefs/userAvatarDBConfig';
import { useAuth } from '@/context/AuthContext';

interface Playlists {
    name: string;
    $id: string;
    musicContains: string[];
    musicPlayListAvatar: string;
    musicPlayListAvatarUrl: string;
    // Add more properties here
}

function ViewAllPlayListsPage() {
    const [playLists, setPlayLists] = useState<Playlists[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isUserLogin } = useAuth()

    const findAllPlayLists = async () => {

        try {
            const allPlayLists = await musicPlayList.getMusicPlayListAllWoQuery();
            if (allPlayLists.documents) {
                setPlayLists(allPlayLists.documents);
            } else {
                setPlayLists([]);
            }
        } catch (error) {
            console.error('Error fetching playlists:', error);
            setError('Error fetching playlists');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        findAllPlayLists();
    }, []);


    return (
        <PageUi className="  h-min-screen h-max  ">
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">All Playlists</h1>
                {loading ?
                    (
                        <p>Loading...</p>
                    )
                    :
                    error ?
                        (
                            <p className="text-red-500">{error}</p>
                        )
                        :
                        playLists.length === 0 ? (
                            <p>Something went wrong</p>
                        )
                            :
                            isUserLogin === false ?
                                (
                                    <PageUi className="  h-min-screen h-max  ">
                                        <div className="p-4">
                                            <h1 className="text-2xl font-bold mb-4">All Playlists</h1>
                                            <p className="text-red-500">Please Login to view all Playlists</p>
                                            <Link href="/users/login" className="text-blue-500">Login</Link>
                                        </div>
                                    </PageUi>
                                )
                                :
                                (

                                    <div className="grid grid-cols-1 sm:grid-cols-2 sm:w-max lg:grid-cols-3 lg:w-max w-full m-auto gap-4">
                                        {playLists.map((playlist) => (
                                            <Link href={`/play?id=${cryptoUtil.encryptString(playlist.$id)}`} key={playlist.$id}>

                                                <div key={playlist.$id}
                                                    className="p-1 h-max  border rounded-lg hover:rounded-xl shadow  mx-auto  hover:bg-slate-900 transition duration-300 ease-in-out flex flex-row items-center justify-between"
                                                >


                                                    {/* PlayList Singer Avatar */}
                                                    <img
                                                        src={
                                                            String
                                                                (playlist.musicPlayListAvatar ?
                                                                    userAvatarDBConfig.getUserAvatarPreviewWithPrefs(
                                                                        playlist.musicPlayListAvatar,
                                                                        100)
                                                                    :
                                                                    playlist.musicPlayListAvatarUrl
                                                                )
                                                        }
                                                        alt="playListImg"
                                                        className='rounded-full w-[50px] h-[50px] mb-2 border-2 border-solid border-slate-800  '
                                                    />
                                                    {/* title of playlist */}
                                                    <p className="text-xl font-bold mb-2">{playlist.name} </p>
                                                    {/* No of Songs */}
                                                    <p className="text-xl text-slate-800 font-bold mb-2">{`  Songs  :` + playlist.musicContains.length} </p>

                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}

            </div>
        </PageUi>
    );
}

export default ViewAllPlayListsPage;
