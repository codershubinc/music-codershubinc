/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useEffect, useState } from 'react';
import cryptoUtil from '@/lib/util/CryptoUtil';
import PageUi from '@/components/page/pageui';
import musicPlayList from '@/config/dataBase/playListsDb/musicPlayList';
import musicConfig from '@/config/dataBase/playListsDb/musicConfig';

function Page() {
    const [playListId, setPlayListId] = useState<string>('');
    const [musicDetails, setMusicDetails] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [id, setId] = useState('');

    // >=====> currently playing musicPlaylist details
    const [currentMusicPlaylist, setCurrentMusicPlaylist] = useState<any>();

    // >=====> getting playlist id from url
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const encryptedId = params.get('id') || '';
        if (encryptedId.length > 0) {
            const playListId = cryptoUtil.decryptString(encryptedId);
            setPlayListId(playListId);
        }
    }, []);
    // >=====> getting playlist details
    useEffect(() => {
        const getSongsFromPlayList = async () => {
            try {

                const playlist = await musicPlayList.getMusicPlayListOne(playListId);
                setCurrentMusicPlaylist(playlist);
                setLoading(false);


            } catch (error) {
                setLoading(false);
                console.error('Error:', error);

            }

        }

        if (playListId) {
            getSongsFromPlayList();
        }
    }, [playListId,])
    // >=====> getting music details from playlist details
    useEffect(() => {
        const getMusicsInPlayList = async () => {
            const musicContainsInCurrentPlaylist = await musicConfig.getMusicConfigBy$Id(currentMusicPlaylist?.musicContains);
            const musicDocs = musicContainsInCurrentPlaylist.documents;
            setMusicDetails(musicDocs);
        }
        if (currentMusicPlaylist) {
            getMusicsInPlayList();
        }

    }, [currentMusicPlaylist])
    useEffect(() => {
        if (!musicDetails) {
            return
        }
    }, [musicDetails])


    return (
        loading
            ?
            <PageUi className='h-screen'>
                <div>Loading...</div>
            </PageUi>
            :
            error
                ?
                <PageUi className='h-screen'>
                    <div>{error}...</div>
                </PageUi>
                :
                <PageUi className='h-screen'>
                    <p>hi {playListId}</p>
                    <p>{currentMusicPlaylist.name}</p>
                </PageUi>
    )
}

export default Page