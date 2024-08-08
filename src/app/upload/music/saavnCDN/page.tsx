'use client'
import PageUi from '@/components/page/pageui'
import React, { useEffect, useState } from 'react'
import uploadMusicToDb from './upl';
import { useRouter } from 'next/navigation';
import Input from '@/components/input/Input';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import SearchIfSingerPlayListExist from '../searchIfSingerPlayListExist';
import musicPlayList from '@/config/dataBase/playListsDb/musicPlayList';
import { useAuth } from '@/context/AuthContext';

function Page() {
    const [loading, setLoading] = useState(true)
    const { handleSubmit, register } = useForm()
    const [isAdmin, setIsAdmin] = useState(false)
    const { currentUser } = useAuth()
    const upl = async (formData: any) => {
        const link = formData.link
        const musicPlayListId = formData.musicPlayListId
        console.log('kink', link, ' musicPlayListId', musicPlayListId);

        setLoading(true)
        try {
            if (!link) {
                console.log('Link not found' + 'enter link');
                alert('Enter link');
                setLoading(false)
                return
            }
            const result = await fetch(`https://api-codershubinc.vercel.app/v1.0/saavnCDN?link=${link}`)
            const dataJs = await result.json()
            console.log(dataJs.data.data[0])
            const data = dataJs.data.data[0]
            if (!data.downloadUrl.find((item: any) => item.quality === "320kbps")?.url) {
                console.log('Link not found' + 'enter link');



            }
            const musicDataFromApi = {
                musicName: data.name,
                musicId: data.musicId || '',
                musicAvatar: data.musicAvatar,
                singer: data.artists.primary.map((item: any) => item.name).join(','),
                description: data.artists.primary.map((item: any) => item.name).join(',') || 'song',
                hashTags: data.artists.primary.map((item: any) => item.name).join(','),
                likeId: [],
                like: 0,
                language: data.language,
                musicUri: data.downloadUrl.find((item: any) => item.quality === "320kbps")?.url,
                musicAvatarUrl: data.image.find((item: any) => item.quality === "500x500")?.url,
                year: Number(data.year),
                url: data.url
            }
            if (!musicDataFromApi.musicUri) {
                console.log('music Link not found' + 'enter link');
                alert('Something went wrong');
                setLoading(false)
                return

            }
            console.log('musicDataFromApi', musicDataFromApi);

            const uplMusic = await uploadMusicToDb(musicDataFromApi)

            if (!uplMusic) {
                console.log('uplMusic problem' + 'enter link');
                alert('Something went wrong');
                setLoading(false)
                return
            }
            if (!uplMusic.musicUri) {
                console.log('Link not found' + 'enter link');
                alert('Something went wrong');
                setLoading(false)
                return
            }
            console.log('uploded music uri', uplMusic.musicUri);

            console.log('music uploaded ', uplMusic);
            // navigate.push(`/upload/music/chose-playlist-for-music?musicId=${uplMusic.$id}&playListId=${musicPlayListId}`)
            console.log('all done now adding to playlist ');
            const aTpl = {
                playListId: musicPlayListId,
                musicId: uplMusic.$id
            }


            addMusicToPlayList(aTpl)

        } catch (error) {
            console.log('error', error);
            setLoading(false)
        } finally {

        }
    }
    const addMusicToPlayList = async (data: any) => {
        console.log('now adding to playlist');

        setLoading(true)
        console.log('data is', data);


        try {
            const result = await musicPlayList.getMusicPlayListOne(data.playListId);

            const id = data.playListId;
            if (result) {
                console.log(result);
                console.log(result.musicContains);
                const musicContains = [...result.musicContains, data.musicId];
                try {
                    const result = await musicPlayList.updateMusicPlayList({ id, musicContains });
                    console.log('addMusicToPlayList:', result);
                    setLoading(false);
                } catch (error) {
                    console.log(error);
                    setLoading(false);
                }
            }
        } catch (error) {
            console.log('Error:', error);

        }
    };

    useEffect(() => {
        if (currentUser?.labels) {
            if (currentUser.labels.includes('admin')) {
                setIsAdmin(true);
            }
        }
        setLoading(false);
    }, [currentUser]);

    if (loading) {
        return <PageUi><h1>Checking your role ......</h1></PageUi>
    }

    if (!isAdmin && !loading) {
        return (
            <>
                <PageUi>
                    <h1 className='text-center text-4xl text-red-700'>You are not an admin</h1>
                    <h2 className='text-center text-3xl text-green-700'>Please contact your admin to get access</h2>
                </PageUi>
            </>
        );
    }


    return (
        <PageUi>
            <form onSubmit={handleSubmit(upl)}  >
                <Input
                    type="text"
                    id="music_URI"
                    placeholder="Music  uri"
                    required
                    {...register('link')}

                />
                <Input
                    type="text"
                    id="PlayList ID"
                    placeholder="music PlayList Id"
                    required
                    {...register('musicPlayListId')}

                />
                <Button
                    type='submit'
                >
                    {loading ? 'Uploading...' : 'Upload Music'}
                </Button>
            </form>
            <SearchIfSingerPlayListExist />
        </PageUi>
    )
}

export default Page