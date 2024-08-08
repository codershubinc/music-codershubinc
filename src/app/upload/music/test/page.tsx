/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import PageUi from '@/components/page/pageui';
import { Input } from '@/components/ui/input';
import musicConfig from '@/config/dataBase/playListsDb/musicConfig';
import musicPlayListByUser from '@/config/dataBase/playListsDb/musicPlayListByUser';
import dbConfig from '@/config/dataBase/userPrefs/UserDBConfig';
import { useAuth } from '@/context/AuthContext';
import { Label } from '@radix-ui/react-dropdown-menu';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

function Page() {
    const { register, handleSubmit } = useForm();
    const { userPrefs, setUserPrefs } = useAuth()
    const createPlaylist = async (data: any) => {

        const result = await musicPlayListByUser.createMusicPlayListByUser(
            {
                name: data.nameForPlayList,
                musicContains: [],
                playListSingers: [],
                like: 0,
                likeId: [],
                musicPlayListAvatar: '',
                musicPlayListBanner: '',
                publicPlayList: false,
                createdBy: userPrefs.$id
            }
        )
        console.log('playList', result);
        const addCreatedPlaylistToUser = async () => {
            const playlistList = userPrefs.createdPlayLists || [];
            console.log('playlistList', playlistList);

            const user = await dbConfig.updatePlaylistByUser(
                userPrefs.$id,
                {
                    createdPlayLists: [...playlistList, result.$id]
                }
            )
            const updatedUserPrefs = await dbConfig.getDocument(user.$id)
            setUserPrefs(updatedUserPrefs)
            console.log('user', user);
            console.log('updated', userPrefs.createdPlayLists);
            

        }

        if (result) {
            addCreatedPlaylistToUser()

        }
    }


    return (
        <PageUi>
            <form onSubmit={handleSubmit(createPlaylist)}>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label >nameForPlayList</Label>
                    <Input
                        type="text"
                        id="nameForPlayList"
                        placeholder="nameForPlayList"
                        required
                        {...register('nameForPlayList')}
                    />
                </div>
                <button type='submit'>submit</button>
            </form>
        </PageUi>
    );
}

export default Page;
