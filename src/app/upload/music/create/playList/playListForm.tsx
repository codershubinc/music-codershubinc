'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import userAvatarDBConfig from '@/config/dataBase/userPrefs/userAvatarDBConfig';
import { useRouter } from 'next/navigation';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import musicPlayList from '@/config/dataBase/playListsDb/musicPlayList';

const MusicPlayListUploadForm = ({ className }: { className: string }) => {
    const { register, handleSubmit } = useForm();
    const navigate = useRouter();
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState<string>('en');

    const handleLanguageChange = (value: string) => {
        setLanguage(value);
        console.log('Selected Language:', value);
    };

    const uploadMusicToDb = async (data: any) => {
        console.log( 'data:' ,  data);
        setLoading(true);
        let avatarFileId = '';
        let bannerFileId = '';

        try {
            // Upload avatar file
            if (data.musicAvatar && data.musicAvatar) {
                const avatarFile = data.musicAvatar[0];
                const avatarResponse = await userAvatarDBConfig.uploadUserAvatar(avatarFile);
                console.log('Avatar File uploaded:', avatarResponse);
                avatarFileId = avatarResponse.$id || '';
            }

            // Upload banner file if available
            const bannerFile = data.musicPlayListBanner?.[0];
            if (bannerFile) {
                const bannerResponse = await userAvatarDBConfig.uploadUserAvatar(bannerFile);
                console.log('Banner File uploaded:', bannerResponse);
                bannerFileId = bannerResponse.$id;
            }

            // Create document in database
            const result = await musicPlayList.createMusicPlayList({
                name: data.musicName,
                nameId: data.musicName.trim().replace(" ", "-"),
                musicContains: [],
                playListSingers: [...data.singer.split(',').map((s: string) => s.trim())],
                likeId: [],
                like: 0,
                musicPlayListAvatar: avatarFileId,
                musicPlayListBanner: bannerFileId,
                language: language,
                musicPlayListAvatarUrl: data.musicPlayListAvatarUrl
            });

            if (result) {
                console.log('Music Data:', result);

                // navigate.push('upload/music');
            }

            setLoading(false);
        } catch (error) {
            console.error('Error uploading music:', error);

            // Delete uploaded files if document creation fails
            if (avatarFileId) {
                const avatarFile = await userAvatarDBConfig.deleteUserAvatar(avatarFileId);
                console.log('Deleted uploaded avatar file:', avatarFile);
            }
            if (bannerFileId) {
                const bannerFile = await userAvatarDBConfig.deleteUserAvatar(bannerFileId);
                console.log('Deleted uploaded banner file:', bannerFile);
            }

            setLoading(false);
        }
    };

    return (
        <div className={cn('flex flex-col items-center justify-center', className)}>
            <div className='text-3xl font-bold text-center mb-4'>Upload Music</div>
            <form onSubmit={handleSubmit(uploadMusicToDb)} className='flex flex-col items-center gap-3'>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="musicName">PlayList Name (singer name in lowercase)</Label>
                    <Input
                        type="text"
                        id="musicName"
                        placeholder="PlayList Name"
                        required
                        {...register('musicName')}
                    />
                </div>

                {/* <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="musicAvatar">Music Avatar / Upload file</Label>
                    <Input
                        type="file"
                        id="musicAvatar"
                        accept="image/*"
                        placeholder="Music Avatar"
                        // required
                        {...register('musicAvatar')}
                    />
                </div> */}
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="musicAvatar">Music Avatar Url</Label>
                    <Input
                        type="text"
                        id="musicAvatarUrl"
                        placeholder="Music AvatarUrl"
                        // required
                        {...register('musicPlayListAvatarUrl')}
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
                        required
                        {...register('description')}
                    />
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="hashTags">HashTags</Label>
                    <Input
                        type="text"
                        id="hashTags"
                        placeholder="HashTags"
                        required
                        {...register('hashTags')}
                    />
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="musicPlayListBanner">Music Playlist Banner</Label>
                    <Input
                        type="file"
                        id="musicPlayListBanner"
                        accept="image/*"
                        placeholder="Music Playlist Banner URL"
                        {...register('musicPlayListBanner')}
                    />
                </div>

                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Select value={language} onValueChange={handleLanguageChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="hi">Hindi</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button type="submit" disabled={loading}>
                    {loading ? 'Uploading...' : 'Submit'}
                </Button>
            </form>
        </div>
    );
};

export default MusicPlayListUploadForm;
