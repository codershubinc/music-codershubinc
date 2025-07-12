/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useState } from 'react';
import PageUi from '../../page/pageui';
import Link from 'next/link';
import cryptoUtil from '@/lib/util/CryptoUtil';
import getAvatarInitials, { asyncHandler } from '@/lib/util/avatar';
interface Playlists {
    name: string;
    $id: string;
    musicContains: string[];
    musicPlayListAvatar: string;
    musicPlayListAvatarUrl: string;
    // Add more properties here
}

function IndexPlayList(
    {
        playLists,
        loading,
        error,
        isUserLogin,
        playLink,
        headline
    }: {
        playLists: Playlists[],
        loading: boolean,
        error: string | null,
        isUserLogin: boolean,
        playLink: string,
        headline?: string
    }
) {



    // State to store avatar URLs for each playlist item
    const [avatarUrls, setAvatarUrls] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchAvatars = async () => {
            const urls: { [key: string]: string } = {};
            if (!playLists) return;
            for (const playlist of playLists) {
                if (!playlist.musicPlayListAvatarUrl) {
                    // Fetch avatar initials for playlists that don’t have a URL
                    try {
                        const avatarUrl = await getAvatarInitials(playlist.name);
                        urls[playlist.$id] = avatarUrl;
                    } catch (error) {
                        console.error(`Failed to fetch avatar for ${playlist.name}`, error);
                    }
                }
            }
            setAvatarUrls(urls);
        };

        fetchAvatars();
    }, [playLists]);



    return (
        <PageUi className="  h-min-screen h-max  ">
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">{headline || 'All Playlists'}</h1>
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
                            (

                                <div className="grid grid-cols-1 sm:grid-cols-2 sm:w-max lg:grid-cols-3 lg:w-max w-full m-auto gap-4">
                                    {playLists?.map((playlist) => (
                                        <Link
                                            href={`/play${playLink && `/${playLink}`}?id=${cryptoUtil.encryptString(playlist.$id)}`}
                                            key={playlist.$id}>

                                            <div key={playlist.$id}
                                                className="p-1 h-max  border rounded-lg hover:rounded-xl shadow  mx-auto  hover:bg-slate-900 transition duration-300 ease-in-out flex flex-row items-center justify-between"
                                            >


                                                {/* PlayList Singer Avatar */}
                                                <img
                                                    src={
                                                        String
                                                            (
                                                                playlist?.musicPlayListAvatarUrl
                                                                    ?
                                                                    playlist?.musicPlayListAvatarUrl?.replaceAll('500x500', '50x50') || 'https://usagif.com/wp-content/uploads/loading-45.gif'
                                                                    :
                                                                    avatarUrls[playlist?.$id] || 'https://usagif.com/wp-content/uploads/loading-45.gif'
                                                            )
                                                    }
                                                    alt="playListImg"
                                                    className='rounded-full w-[50px] h-[50px] mb-2 border-2 border-solid border-slate-800 bg-slate-700  '
                                                />
                                                {/* title of playlist */}
                                                <p className="text-xl font-bold mb-2">{playlist.name} </p>
                                                {/* No of Songs */}
                                                <p className="text-xl text-slate-700 font-bold mb-2">{`  Songs  :` + playlist.musicContains.length} </p>

                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
            </div>
        </PageUi>
    );
}

export default IndexPlayList;
