'use client'
import musicPlayListByUser from '@/config/dataBase/playListsDb/musicPlayListByUser';
import React from 'react'
import { Button } from '../../ui/button'

function AddSongToPlayList(id: string, show: boolean, playListId: string) {

    const addMusicToPlayList = async (playListIdToAddSong: string) => {
        const result: any = await musicPlayListByUser.getMusicPlayListByUser(playListIdToAddSong)

        const musicContains = [...result?.musicContains]  //  [id, ...musicContains]

        try {
            const result = await musicPlayListByUser.updateMusicPlayListByUser(
                {
                    id: playListIdToAddSong,
                    prefs: [id, ...musicContains]
                }
            )

        } catch (error) {
            console.error('Error adding song to playlist:', error);
            throw error

        }
    }
    return (
        <Button
            onClick={() => addMusicToPlayList(playListId)}
            variant={"outline"}
        >
            Add To PlayList
        </Button>
    )
}

export default AddSongToPlayList