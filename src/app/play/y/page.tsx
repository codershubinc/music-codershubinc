/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';
import Play from '@/components/cust/player/play';
import musicPlayListByUser from '@/config/dataBase/playListsDb/musicPlayListByUser';
import cryptoUtil from '@/lib/util/CryptoUtil';
import React, { useEffect, useState } from 'react'

function Page() {
    const [currentMusicPlaylist, setCurrentMusicPlaylist] = useState<any>()



    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const encryptedId = params.get('id');
        async function getPlDet(id: string) {
            try {
                console.log('Fetching playlist with ID:', id);
                const playlist = await musicPlayListByUser.getMusicPlayListByUser(id)
                setCurrentMusicPlaylist(playlist);
            } catch (error: any) {
                console.log('ERROR', error);


            }
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