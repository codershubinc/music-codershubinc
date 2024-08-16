/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';
import Play from '@/components/cust/player/play';
import musicPlayList from '@/config/dataBase/playListsDb/musicPlayList';
import cryptoUtil from '@/lib/util/CryptoUtil';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

function Page() {
    const [currentMusicPlaylist, setCurrentMusicPlaylist] = useState()
    const [error, setError] = useState('')


    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const encryptedId = params.get('id');
        async function getPlDet(id: string) {
            try {
                console.log('Fetching playlist with ID:', id);
                const playlist = await musicPlayList.getMusicPlayListOne(id)
                setCurrentMusicPlaylist(playlist);
            } catch (error: any) {
                console.log('Error while feting playlist :: ', error);
                toast.error('Error while feting playlist :: ', error?.message)
                setError(error?.message || 'Something went wrong');
            }
        }

        if (encryptedId) {
            const playListId = cryptoUtil.decryptString(encryptedId);
            getPlDet(playListId);
        }


    }, [])

    if (error) {
        return (
            <p className='text-red-500 text-2xl' >{error}</p>
        )

    }

    return (
        <Play
            playList={currentMusicPlaylist}
        />
    )
}

export default Page