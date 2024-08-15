import { Button } from '@/components/ui/button'
import authService from '@/config/auth/auth'
import musicPlayListByUser from '@/config/dataBase/playListsDb/musicPlayListByUser'
import dbConfig from '@/config/dataBase/userPrefs/UserDBConfig'
import { inf } from '@/utils/saavnApis/getSongInfo.api'
import { ListPlusIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import CreatePlaylistByUser from '../create-playlist-by-user/createPlaylistByUser'
import LOCAL from '@/utils/func/localStorage'

function AddToPlayList(
    {
        currentSongInfo,
        playListId

    }: {
        currentSongInfo: any
        playListId: string
    }
) {
    // ===========> here user is the userPrefs sry for that
    const [userPrefs, setUserPrefs] = useState<any>()
    const [currentUser, setCurrentUser] = useState<any>()
    const [createPlaylist, setCreatePlaylist] = useState(false)
    const [fetchedSongInfo, setFetchedSongInfo] = useState<any>()
    const [allPlayListsInfo, setAllPlayListsInfo] = useState<{ total: number; documents: any[] }>({ total: 1, documents: [] });
    const [ifCreateNewPlayList, setIfCreateNewPlayList] = useState(false)

    useEffect(() => {

        async function f(url: string) {
            console.log('currentSongInfo.url', currentSongInfo.url);
            let res = await inf(url)
            console.log('fetched song info', res?.data?.data[0]);
            setFetchedSongInfo(res?.data?.data[0] || [])
            // console.log(fetchedSongInfo);

        }


        if (currentSongInfo?.url) {
            f(currentSongInfo.url)
        }
        console.log('no song url found', currentSongInfo?.url);
        if (!userPrefs) {
            getUser()
        }

    }, [currentSongInfo])

    const getUser = async () => {
        const result = await authService.getCurrentUser()
        setCurrentUser(result)
        if (result.$id) {
            console.log('fond a user ', result);
            const userPrefs = await dbConfig.getDocument(result.$id)
            if (userPrefs) {
                console.log('got a user prefs', userPrefs);
                setUserPrefs(userPrefs)
                if (!userPrefs?.createdPlayLists[0]) return
                console.log('id = ', userPrefs?.createdPlayLists[0]);

                const pl = await musicPlayListByUser.getMusicPlayListsByUser(userPrefs?.$id)
                // console.log('all pl inf', pl);


                if (pl) {
                    console.log('got a playlist info', pl);
                    setAllPlayListsInfo(pl)
                }

            }
        }
    }

    useEffect(() => {
        if (playListId && currentUser) {
            console.log('is playList is created By user ', userPrefs?.createdPlayLists?.includes(playListId))
        }
    }, [playListId, currentUser, currentSongInfo])

    const playlistController = async (id: string) => {
        console.log('playlist id', id);
        LOCAL.set('lastAddedPlaylistId', id)
        console.log('all pl list => ', allPlayListsInfo?.documents?.length);

        if (allPlayListsInfo?.documents?.length > 0) {
            const loadingToast = toast.loading('adding to playlist ...')
            const containsSongs = allPlayListsInfo?.documents.map((music: any) => {
                if (music?.$id === id) {
                    return music;
                }
            }).filter(Boolean);
            console.log('contains songs', containsSongs[0]);

            if (containsSongs[0]?.musicContains?.includes(currentSongInfo.$id)) {
                toast.error('Song is already in playlist...' + containsSongs[0]?.name, { id: loadingToast })
                return
            }
            try {
                const updatedDoc = await musicPlayListByUser.updateMusicPlayListByUser({
                    id,
                    prefs: [...containsSongs[0].musicContains, currentSongInfo.$id]
                })
                console.log('added to playlist ', updatedDoc);
                setAllPlayListsInfo((prevState) => {
                    const updatedDocuments = prevState.documents.map((doc) => {
                        if (doc.$id === updatedDoc.$id) {
                            return updatedDoc;
                        }
                        return doc;
                    });

                    return {
                        ...prevState,
                        documents: updatedDocuments,
                    };
                });
                toast.success('added to playlist ', { id: loadingToast })


            } catch (error: any) {
                console.log('failed to add playlist', error);
                toast.error('failed to add playlist', { id: loadingToast })
            }


        } else {
            console.log('no playlist found');
            toast('no playlist found')
            setCreatePlaylist(true)
        }

    }

    const getPlById = (id: string) => {
        return allPlayListsInfo?.documents?.find((list: any) => list.$id === id);
    }

    const removeFromPl = async (id: string) => {
        const loadingToast = toast.loading('removing from playlist ...')

        try {
            const pl = getPlById(id)
            console.log('pl', pl);
            if (!pl) {
                toast.error('Something went wrong || no pl found with id', { id: loadingToast })
                return console.log('Something went wrong');
            }

            const updatedDoc = await musicPlayListByUser.updateMusicPlayListByUser({
                id,
                prefs: pl?.musicContains?.filter((song: string) => song !== currentSongInfo.$id)
            })
            console.log('Updated pl', updatedDoc);



            setAllPlayListsInfo((prevState) => {
                const updatedDocuments = prevState.documents.map((doc) => {
                    if (doc.$id === updatedDoc.$id) {
                        return updatedDoc; // Replace the old document with the updated one
                    }
                    return doc; // Keep the document unchanged if $id does not match
                });

                return {
                    ...prevState,
                    documents: updatedDocuments,
                };
            });

            toast.success('Succesfully removed from pl' + id, { id: loadingToast })

        } catch (error: any) {
            console.log('failed to add playlist', error);
            toast.error('failed to add playlist', { id: loadingToast })
        }

    }
    return (
        <>
            {
                !ifCreateNewPlayList ?
                    <>
                        {
                            currentUser && currentSongInfo && userPrefs ?

                                (
                                    currentUser?.labels?.includes('admin') ?
                                        <>
                                            {
                                                !userPrefs?.createdPlayLists?.includes(playListId) &&
                                                <div>
                                                    <Button
                                                        type='button'
                                                        variant={'ghost'}
                                                        onClick={() => playlistController(allPlayListsInfo?.documents[0]?.$id)}
                                                    >
                                                        {userPrefs?.createdPlayLists?.length > 0 ? <ListPlusIcon className="w-6 h-6 text-blue-500" aria-label='hi' /> : 'create playlist'}
                                                    </Button>
                                                    <p className='text-sm text-slate-300' >add to <br />  <span className='text-blue-500' > {` ${LOCAL.get('lastAddedPlaylistId') ? getPlById(LOCAL.get('lastAddedPlaylistId'))?.name : allPlayListsInfo?.documents[0]?.name} `} </span> </p>
                                                </div>
                                            }
                                            {
                                                userPrefs?.createdPlayLists?.includes(playListId)
                                                &&
                                                <div>
                                                    <>
                                                        <Button
                                                            type='button'
                                                            variant={'ghost'}
                                                            onClick={() => removeFromPl(playListId)}
                                                        >
                                                            {userPrefs?.createdPlayLists?.length > 0 ? <ListPlusIcon className="w-6 h-6 text-blue-500" aria-label='hi' /> : 'create playlist'}
                                                        </Button>
                                                        <p className='text-sm text-white' >remove from pl
                                                            {`${playListId ? getPlById(playListId)?.name : allPlayListsInfo?.documents[0]?.name}`}
                                                        </p>
                                                    </>
                                                </div>
                                            }
                                        </>
                                        :
                                        <p>
                                            {currentSongInfo && currentUser && userPrefs ? 'This feature is available for admin only ...' : 'Play the song to get options ....'}
                                        </p>

                                ) :
                                <p>
                                    {currentSongInfo ? 'Loading .....' : 'Play the song to get options ....'}
                                </p>
                        }
                    </>

                    :
                    <>

                    </>
            }
            {
                createPlaylist &&
                <CreatePlaylistByUser
                    isDisplay={true}
                    setCreatePlaylist={setCreatePlaylist}
                    setUser={setUserPrefs}
                />
            }
        </>

    )

}

export default AddToPlayList
