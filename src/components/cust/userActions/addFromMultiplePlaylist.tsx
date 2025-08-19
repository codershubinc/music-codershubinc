import { Button } from '@/components/ui/button'
import musicPlayListByUser from '@/config/dataBase/playListsDb/musicPlayListByUser';
import DecodeHTMLEntities from '@/utils/func/htmlDecode';
import LOCAL from '@/utils/func/localStorage';
import { XIcon } from 'lucide-react';
import React from 'react'
import toast from 'react-hot-toast';

function AddFromMultiplePlaylist(
    {
        isDisplay,
        allPlaylistInfo,
        currentSongInfo,
        allPlayListsInfo,
        setCreatePlaylist,
        setAllPlayListsInfo,
        setIsDisplay

    }: {
        isDisplay: any
        setIsDisplay: any
        allPlaylistInfo: any
        currentSongInfo: any
        allPlayListsInfo: any
        setCreatePlaylist: any
        setAllPlayListsInfo: any
    }
) {

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
                isDisplay = false
                setIsDisplay(false)
                return
            }
            try {
                const updatedDoc = await musicPlayListByUser.updateMusicPlayListByUser({
                    id,
                    prefs: [...containsSongs[0].musicContains, currentSongInfo.$id]
                })
                setAllPlayListsInfo((prevState: any) => {
                    const updatedDocuments = prevState.documents.map((doc: any) => {
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
                isDisplay = false
                setIsDisplay(false)


            } catch (error: any) {
                isDisplay = false
                setIsDisplay(false)
                console.error('failed to add playlist', error);
                toast.error('failed to add playlist', { id: loadingToast })
            }


        } else {
            toast('no playlist found')
            setCreatePlaylist(true)
        }

    }
    return (
        <div
            className={`w-max min-w-40   h-max bg-black fixed left-0 right-0 top-0 bottom-0 mx-auto my-auto text-center justify-center items-center border border-solid border-slate-600 rounded-2xl backdrop-blur-md ${isDisplay ? 'block' : 'invisible'} `}
        >
            Select playlist
            <div>
                <XIcon
                    className="w-6 h-6 text-blue-500 hover:text-slate-600 absolute right-0 top-0"
                    onClick={() => {
                        isDisplay = false
                        setIsDisplay(false)
                    }}
                />
            </div>
            <div
                className='flex flex-col p-2 '
            >
                {
                    allPlaylistInfo?.documents?.map((pl: any) => {
                        return (
                            <Button
                                type='button'
                                variant={'outline'}
                                onClick={() => playlistController(pl?.$id)}
                            >
                                {pl?.name}
                            </Button>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default AddFromMultiplePlaylist