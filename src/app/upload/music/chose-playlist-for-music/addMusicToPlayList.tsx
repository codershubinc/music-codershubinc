'use client';
import musicPlayList from '@/config/dataBase/playListsDb/musicPlayList';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

function AddMusicToPlayList() {
    const { register, handleSubmit, setValue } = useForm();
    const urlParams = useSearchParams();
    const [done, setDone] = useState(false)

    useEffect(() => {
        setValue('musicId', urlParams.get('musicId'));
        setValue('playListId', urlParams.get('playListId'));
    }, [urlParams, setValue]);

    const addMusicToPlayList = async (data: any) => {
        try {
            const result = await musicPlayList.getMusicPlayListOne(data.playListId);

            const id = data.playListId;
            if (result) {
                console.log(result);
                console.log(result.musicContains);
                const musicContains = [...result.musicContains, data.musicId];
                try {
                    const result = await musicPlayList.updateMusicPlayList({ id, musicContains });
                    setDone(true);
                    console.log(result);
                } catch (error) {
                    console.log(error);
                }
            }
        } catch (error) {
            console.log('Error:', error);

        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold mb-4">Add Music To PlayList</h1>
            <form onSubmit={handleSubmit(addMusicToPlayList)} className="w-full max-w-sm space-y-4">
                <div className="flex flex-col">
                    <label className="mb-1 font-semibold">Playlist ID <p className="text-red-500 text-sm" >check your playlist id from url</p> </label>
                    <input
                        type="text"
                        placeholder="Enter Playlist ID"
                        readOnly
                        value={String(urlParams.get('playListId'))}
                        className="p-2 border border-gray-300 rounded cursor-not-allowed"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="mb-1 font-semibold">Music ID <p className="text-red-500 text-sm" >check your music id from url</p> </label>
                    <input
                        type="text"
                        placeholder="Enter Music ID"
                        value={String(urlParams.get('musicId'))}
                        readOnly
                        className="p-2 border border-gray-300 rounded cursor-not-allowed"
                    />
                </div>
                <button disabled={done} type="submit" className={"px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600  " + (done ? "cursor-not-allowed" : "")}>
                    Submit
                </button>
                {done && <p className="text-green-500">Done ... go back and upload new music</p>}
            </form>
        </div>
    );
}

export default AddMusicToPlayList;
