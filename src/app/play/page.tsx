/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';
import Play from '@/components/cust/player/play';
import musicPlayList from '@/config/dataBase/playListsDb/musicPlayList';
import cryptoUtil from '@/lib/util/CryptoUtil';
import React, { useEffect, useState } from 'react'

function Page() {
    const [currentMusicPlaylist, setCurrentMusicPlaylist] = useState()



    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const encryptedId = params.get('id');
        async function getPlDet(id: string) {
            console.log('Fetching playlist with ID:', id);
            const playlist = await musicPlayList.getMusicPlayListOne(id)
            setCurrentMusicPlaylist(playlist);
        }

        if (encryptedId) {
            const playListId = cryptoUtil.decryptString(encryptedId);
            getPlDet(playListId);
        }


    }, [])

    return (
        <Play
            playList={currentMusicPlaylist}
        />
    )
}

export default Page