import musicPlayListByUser from '@/config/dataBase/playListsDb/musicPlayListByUser'
import dbConfig from '@/config/dataBase/userPrefs/UserDBConfig'
import { useAuth } from '@/context/AuthContext'
import React, { useState } from 'react'
import { Button } from '../../ui/button'
import tost from 'react-hot-toast'
import { Input } from '../../ui/input'
import RA from '@/utils/openApiFuncs/randomAvatar'

function CreatePlaylistByUser(
    {
        isDisplay,
        setCreatedPlayList,
        setCreatePlaylist,
        setUser
    }: {
        isDisplay: boolean,
        setCreatedPlayList?: any,
        setCreatePlaylist?: any,
        setUser?: any
    }
) {
    const { currentUser, userPrefs } = useAuth()
    const [nameForPlayList, setNameForPlayList] = useState<string>('')


    const createPlaylist = async () => {
        const loadingToast = tost.loading('creating a playlist ...')
        try {

            const result = await musicPlayListByUser.createMusicPlayListByUser(
                {
                    name: nameForPlayList,
                    musicContains: [],
                    playListSingers: [],
                    like: 0,
                    likeId: [],
                    musicPlayListAvatar: await RA.getAvatar(),
                    musicPlayListBanner: '',
                    publicPlayList: false,
                    createdBy: currentUser.$id
                }
            )
            console.log('playList', result);

            if (result) {

                const user = await dbConfig.updatePlaylistByUser(
                    currentUser.$id,
                    {

                        createdPlayLists: [result.$id, ...userPrefs?.createdPlayLists]

                    }
                )
                console.log('user', user);
                if (user) {
                    console.log('got a user', user);
                    isDisplay = false
                    setCreatePlaylist(false)
                    if (setUser) {
                        setUser(user)
                    }
                    if (setCreatePlaylist) {
                        setCreatedPlayList(result)
                    }
                    tost.dismiss(loadingToast)
                    tost.success('Playlist created successfully')
                    tost('Now you can add songs to a playlist ... ')
                    return
                }
            }
        } catch (error: any) {
            console.log('error', error);
            tost.error('Something went wrong', { id: loadingToast })
        }
    }

    return (
        <div
            className={`w-full md:w-[50%] mx-auto border border-solid border-slate-600  min-h-60 h-max bg-black flex flex-col fixed my-auto top-0 bottom-0 right-0 left-0 justify-center items-center gap-5 rounded-2xl backdrop:bg-zinc-800  ${isDisplay ? 'flex' : 'hidden'}`}
        >
            <form
                action=""
                onSubmit={(e) => {
                    e?.preventDefault()
                    createPlaylist()
                }}
                className={`w-[97%] md:w-70% h-min-[200px] flex flex-col gap-3 justify-center items-center `}
            >
                <Input
                    type="text"
                    placeholder="Enter a playlist name ....."
                    name="nameForPlayList"
                    onChange={(e) => setNameForPlayList(e?.target?.value)}
                    required={true}
                />
                <Button
                    type="submit"
                >
                    Create
                </Button>
            </form>
            <hr className='w-[90%] text-slate-700 ' />
            <Button
                type='button'
                onClick={() => setCreatePlaylist(false)}
                className='bg-red-700 text-white w-full'
            >
                Close
            </Button>
        </div>
    )
}

export default CreatePlaylistByUser
