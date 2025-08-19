import { Button } from '@/components/ui/button'
import authService from '@/config/auth/auth'
import musicPlayListByUser from '@/config/dataBase/playListsDb/musicPlayListByUser'
import dbConfig from '@/config/dataBase/userPrefs/UserDBConfig'
import { inf } from '@/utils/saavnApis/getSongInfo.api'
import { ListPlusIcon, ListXIcon, PlusSquareIcon, XIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import CreatePlaylistByUser from '../create-playlist-by-user/createPlaylistByUser'
import LOCAL from '@/utils/func/localStorage'
import DecodeHTMLEntities from '@/utils/func/htmlDecode'
import AddFromMultiplePlaylist from './addFromMultiplePlaylist'

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
    const [selectFromMultiplePlaylist, setSelectFromMultiplePlaylist] = useState(false)

    useEffect(() => {

        async function f(url: string) {
            let res = await inf(url)
            setFetchedSongInfo(res?.data?.data[0] || [])
            // console.log(fetchedSongInfo);

        }
        if (currentSongInfo?.url) {
            f(currentSongInfo.url)
        }
        if (!userPrefs) {
            getUser()
        }


    }, [currentSongInfo])

    const getUser = async () => {
        try {
            const result = await authService.getCurrentUser()
            setCurrentUser(result)
            if (result.$id) {
                const userPrefs = await dbConfig.getDocument(result.$id)
                if (userPrefs) {
                    setUserPrefs(userPrefs)
                    if (!userPrefs?.createdPlayLists[0]) return

                    const pl = await musicPlayListByUser.getMusicPlayListsByUser(userPrefs?.$id)
                    // console.log('all pl inf', pl);


                    if (pl) {
                        setAllPlayListsInfo(pl)
                    }

                }
            }
        } catch (error) {
            console.error('Error fetching current user or playlists:', error);
            setUserPrefs({})
            setCurrentUser({})
        }
    }

    useEffect(() => {
        if (playListId && currentUser) {
            // no-op: removed debug log
        }
    }, [playListId, currentUser, currentSongInfo])

    const playlistController = async (id: string) => {
        LOCAL.set('lastAddedPlaylistId', id)
        // storing ref for current song info 
        const cSInfo = currentSongInfo
        if (allPlayListsInfo?.documents?.length > 0) {
            const loadingToast = toast.loading('adding to playlist ...')
            const containsSongs = allPlayListsInfo?.documents.map((music: any) => {
                if (music?.$id === id) {
                    return music;
                }
            }).filter(Boolean);

            if (containsSongs[0]?.musicContains?.includes(currentSongInfo.$id)) {
                toast.error(DecodeHTMLEntities('Song &quot;' + (cSInfo?.musicName || '') + '&quot; is already in playlist...   ') + containsSongs[0]?.name, { id: loadingToast })
                return
            }
            try {
                const updatedDoc = await musicPlayListByUser.updateMusicPlayListByUser({
                    id,
                    prefs: [...containsSongs[0].musicContains, currentSongInfo.$id]
                })
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
                toast.success(DecodeHTMLEntities('song &quot;' + (cSInfo?.musicName || '') + '&quot;  added to playlist ' + updatedDoc?.name), { id: loadingToast })


            } catch (error: any) {
                console.error('Failed to add to playlist:', error);
                toast.error('failed to add playlist', { id: loadingToast })
            }


        } else {
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
            if (!pl) {
                toast.error('Something went wrong || no pl found with id', { id: loadingToast })
                return
            }

            const updatedDoc = await musicPlayListByUser.updateMusicPlayListByUser({
                id,
                prefs: pl?.musicContains?.filter((song: string) => song !== currentSongInfo.$id)
            })



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

            toast.success('Successfully removed from pl' + id, { id: loadingToast })

        } catch (error: any) {
            console.error('Failed to remove from playlist:', error);
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
                                                !userPrefs?.createdPlayLists?.includes(playListId) ?
                                                    <div
                                                        className='flex gap-1 bg-[#020617] w-full justify-center items-center p-1 rounded-3xl mx-auto '
                                                    >
                                                        <div
                                                            className='  justify-center text-center items-center border border-solid border-slate-800 rounded-xl h-full'
                                                        >
                                                            <Button
                                                                type='button'
                                                                variant={'ghost'}
                                                                onClick={() => playlistController(allPlayListsInfo?.documents[0]?.$id)}
                                                            >
                                                                {
                                                                    userPrefs?.createdPlayLists?.length > 0 ?
                                                                        <ListPlusIcon
                                                                            className="w-6 h-6 text-blue-500 hover:text-slate-600"
                                                                            aria-label='hi'
                                                                        /> : 'create playlist'}
                                                            </Button>

                                                            <p className='text-sm text-slate-300' > <span className='text-blue-500 hover:text-slate-600' > {` ${LOCAL.get('lastAddedPlaylistId') ? getPlById(LOCAL.get('lastAddedPlaylistId'))?.name || 'playlist' : allPlayListsInfo?.documents[0]?.name} `} </span> </p>
                                                        </div>
                                                        <div
                                                            className='  justify-center text-center items-center border border-solid border-slate-800 rounded-xl'
                                                        >
                                                            <Button
                                                                type='button'
                                                                variant={'ghost'}
                                                                onClick={() => setSelectFromMultiplePlaylist(!selectFromMultiplePlaylist)}
                                                            >
                                                                {
                                                                    selectFromMultiplePlaylist ?
                                                                        <XIcon
                                                                            className="w-6 h-6 text-blue-500 hover:text-slate-600"
                                                                        />
                                                                        :
                                                                        <PlusSquareIcon
                                                                            className="w-6 h-6 text-blue-500 hover:text-slate-600"
                                                                        />

                                                                }
                                                            </Button>
                                                            <br />
                                                            add
                                                        </div>
                                                    </div>
                                                    :
                                                    <div>
                                                        <>
                                                            <Button
                                                                type='button'
                                                                variant={'ghost'}
                                                                onClick={() => removeFromPl(playListId)}
                                                            >
                                                                {userPrefs?.createdPlayLists?.length > 0 ?
                                                                    <ListXIcon className="w-6 h-6 text-blue-500 hover:text-slate-600" aria-label='hi' /> : 'create playlist'}
                                                            </Button>
                                                            <p className='text-sm text-white' >remove from pl
                                                                <br />
                                                                <span className='text-blue-500 hover:text-slate-600' >
                                                                    {`${playListId ? getPlById(playListId)?.name : allPlayListsInfo?.documents[0]?.name}`}
                                                                </span>
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
            {
                selectFromMultiplePlaylist &&
                <AddFromMultiplePlaylist
                    isDisplay={selectFromMultiplePlaylist}
                    setIsDisplay={setSelectFromMultiplePlaylist}
                    allPlaylistInfo={allPlayListsInfo}
                    allPlayListsInfo={allPlayListsInfo}
                    currentSongInfo={currentSongInfo}
                    setAllPlayListsInfo={setAllPlayListsInfo}
                    setCreatePlaylist={setCreatePlaylist}
                />
            }
        </>

    )

}

export default AddToPlayList
