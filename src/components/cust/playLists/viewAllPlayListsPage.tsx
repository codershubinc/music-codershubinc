/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useState } from 'react';
import musicPlayList from '@/config/dataBase/playListsDb/musicPlayList';
import { useAuth } from '@/context/AuthContext';
import IndexPlayList from './index.playlist';

interface Playlists {
    name: string;
    $id: string;
    musicContains: string[];
    musicPlayListAvatar: string;
    musicPlayListAvatarUrl: string;
    // Add more properties here
}

function ViewAllPlayListsPage({ allPlayLists }: { allPlayLists: any }) {
    const [playLists, setPlayLists] = useState<Playlists[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isUserLogin } = useAuth()

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


    return (
        <IndexPlayList
            playLists={playLists}
            loading={loading}
            error={error}
            isUserLogin={isUserLogin}
            playLink=''
        />
    );
}

export default ViewAllPlayListsPage;
