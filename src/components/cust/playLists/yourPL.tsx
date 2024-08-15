/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import IndexPlayList from './index.playlist';
import musicPlayListByUser from '@/config/dataBase/playListsDb/musicPlayListByUser';

function YourPl() {
    const [playLists, setPlayLists] = useState<any>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isUserLogin, currentUser } = useAuth()

    const findAllPlayLists = async () => {

        try {
            const allPlayLists = await musicPlayListByUser.getMusicPlayListsByUser(currentUser?.$id);
            if (allPlayLists?.documents) {
                setPlayLists(allPlayLists?.documents);
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
        if (currentUser) {
            console.log('id', currentUser?.$id);

            findAllPlayLists();
        }
    }, []);


    return (
        <IndexPlayList
            playLists={playLists}
            loading={loading}
            error={error}
            isUserLogin={isUserLogin}
            playLink='y'
        />
    );
}

export default YourPl
