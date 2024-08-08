'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import music from '@/config/dataBase/playListsDb/music';
import musicConfig from '@/config/dataBase/playListsDb/musicConfig';
import userAvatarDBConfig from '@/config/dataBase/userPrefs/userAvatarDBConfig';
import { useRouter } from 'next/navigation';
import { ID } from 'appwrite';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const MusicUploadForm = ({ className }: { className: string }) => {
    const { register, handleSubmit } = useForm();
    const navigate = useRouter()
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState<string>('hi');

    const handleLanguageChange = (value: string) => {
        setLanguage(value);
        // Assuming you have some logic to handle the language change
        // For example, updating the i18n settings or redirecting to a localized route
        console.log('Selected Language:', value);

        // You can also perform any other logic here based on the selected language
    };
    const uploadMusicToDb = async (data: any) => {
        setLoading(true);
        try {
            // Upload music file
            // const musicFile = data.music[0];
            // const musicResponse = await music.uploadMusic(musicFile);
            // console.log('Music File uploaded:', musicResponse);

            // const musicFileId = musicResponse.$id;

            // Upload avatar file
            // const avatarFile = data.musicAvatar || ''
            // console.log('Avatar File uploaded:', avatarFile);
            // const avatarFileId = avatarFile;

            // Create document in database
            console.log('musicUrl:', data.musicUrl);

            const result = await musicConfig.createMusicConfig({
                musicName: data.musicName,
                musicId: data.musicId || '',
                musicAvatar: data.musicAvatar,
                singer: [...data.singer.split(',').map((s: string) => s.trim())],  // Trim each singer name
                description: data.description || 'song',
                hashTags: [...data.hashTags.split(',').map((tag: string) => tag.trim())],  // Trim each hashtag
                likeId: [],
                like: 0,
                language: language,
                musicUri: data.musicUrl,
                musicAvatarUrl: data.musicAvatarUrl,
                year: 2332,
                url: ' no url'
            });

            console.log('Music Data:', result);

            if (result) {
                const id = result.$id

                // Add music to playlist
                console.log(data.PlayListId);
                navigate.push(`/upload/music/chose-playlist-for-music?musicId=${id}&playListId=${data.PlayListId}`);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error uploading music:', error);
            setLoading(false);
        }
    };

    return (
        <div className={cn('flex flex-col items-center justify-center ', className)}>
            <div className='text-3xl font-bold text-center mb-4'>Upload Music</div>
            <form onSubmit={handleSubmit(uploadMusicToDb)} className='flex flex-col items-center gap-3'>
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label htmlFor="music">Music /for now not required</Label>
                    <Input
                        type="file"
                        accept="audio/*"
                        id="music"
                        placeholder="Music"
                        // required
                        {...register('music')}
                    />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="musicName">Music URI</Label>
                    <Input
                        type="text"
                        id="music URI"
                        placeholder="Music  uri"
                        required
                        {...register('musicUrl')}
                    />
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="musicName">Music Name</Label>
                    <Input
                        type="text"
                        id="musicName"
                        placeholder="Music Name"
                        required
                        {...register('musicName')}
                    />
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="musicAvatar">Music Avatar / Upload file / Id</Label>
                    <Input
                        type="text"
                        id="musicAvatar"
                        placeholder="Music Avatar Id"
                        // required
                        {...register('musicAvatar')}
                    />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="musicAvatar">Music Avatar Url</Label>
                    <Input
                        type="text"
                        id="musicAvatarUrl"
                        placeholder="Music Avatar URL"
                        // required
                        {...register('musicAvatarUrl')}
                    />
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="singer">Singers <p className='text-gray-500 text-sm'>{`('please give in lowercase with comma separated')`}</p> </Label>
                    <Input
                        type="text"
                        id="singer"
                        placeholder="Singers"
                        required
                        {...register('singer')}
                    />
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        placeholder="Description"
                        // required
                        {...register('description')}
                    />
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="hashTags">HashTags (paste all Singers name here)</Label>
                    <Input
                        type="text"
                        id="hashTags"
                        placeholder="HashTags"
                        required
                        {...register('hashTags')}
                    />
                </div>
                <div className='grid w-full max-w-sm items-center gap-1.5' >
                    <Select value={language} onValueChange={handleLanguageChange} >
                        <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="hi">Hindi</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                        </SelectContent >
                    </Select >
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="PlayListId">PlayListId</Label>
                    <Input
                        type="text"
                        id='PlayListId'
                        placeholder="Paste here PlayListId"
                        required
                        {...register('PlayListId')}
                    />
                </div>

                <Button type="submit" disabled={loading}>
                    {loading ? 'Uploading...' : 'Submit'}
                </Button>
            </form>
        </div>
    );
};

export default MusicUploadForm;
