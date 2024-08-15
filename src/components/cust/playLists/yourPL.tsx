/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import IndexPlayList from './index.playlist';
import CreatePlaylistByUser from '../create-playlist-by-user/createPlaylistByUser';
import { Button } from '@/components/ui/button';



function YourPl({ allPlayLists, user }: { allPlayLists: any, user: any }) {
    const [createNew, setCreatePlaylist] = useState(false);
    const [playLists, setPlayLists] = useState<any>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isUserLogin } = useAuth()

    const [newPlayLists, setNewPlaylists] = useState<any>();

    const findAllPlayLists = async () => {

        try {
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
        if (allPlayLists) {
            findAllPlayLists();
        }
    }, []);

    useEffect(() => {
        if (newPlayLists?.$id) {
            console.log('new pl = ', newPlayLists);


            setPlayLists((prevState: any) => {
                let doc = newPlayLists
                console.log('doc', doc);


                return [
                    ...prevState,
                    newPlayLists,
                ]
            });
        }
        setCreatePlaylist(false);
    }, [newPlayLists]);
    console.log('playlists = ', playLists);



    return (
        <>
            <Button
                onClick={() => setCreatePlaylist(true)}
                variant="outline"
                className="w-full"
            >
                Create New Playlist
            </Button>
            <IndexPlayList
                playLists={playLists}
                loading={loading}
                error={error}
                isUserLogin={isUserLogin}
                playLink='y'
            />
            {
                createNew &&
                <CreatePlaylistByUser
                    isDisplay={true}
                    setCreatePlaylist={setCreatePlaylist}
                    setCreatedPlayList={setNewPlaylists}
                />
            }
        </>
    );
}

export default YourPl
