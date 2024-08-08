import musicPlayListByUser from '@/config/dataBase/playListsDb/musicPlayListByUser'
import dbConfig from '@/config/dataBase/userPrefs/UserDBConfig'
import { useAuth } from '@/context/AuthContext'
import React from 'react'
import { Button } from '../ui/button'

function CreatePlaylistByUser(nameForPlayList: string) {
    const { currentUser } = useAuth()
    const createPlaylist = async () => {

        const result = await musicPlayListByUser.createMusicPlayListByUser(
            {
                name: nameForPlayList,
                musicContains: [],
                playListSingers: [],
                like: 0,
                likeId: [],
                musicPlayListAvatar: '',
                musicPlayListBanner: '',
                publicPlayList: false,
                createdBy: currentUser.$id
            }
        )
        console.log('playList', result);
        const addCreatedPlaylistToUser = async () => {
            const user = await dbConfig.updatePlaylistByUser(
                currentUser.$id,
                {
                    createdPlayLists: [result.$id]
                }
            )
            console.log('user', user);

        }

        if (result) {
            addCreatedPlaylistToUser()

        }
    }

    return (
        <Button
            variant={"outline"}
            onClick={createPlaylist}
        >
            Create Playlist
        </Button>
    )
}

export default CreatePlaylistByUser
