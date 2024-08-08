'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import musicPlayList from '@/config/dataBase/playListsDb/musicPlayList';
import CopyButton from '@/components/Buttons/CopyBtn';
import Link from 'next/link';

const SearchIfSingerPlayListExist = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const handleSearch = async () => {
        console.log('Searching music playlists...');
        const queries: any = {
            queryType: 'name',
            queryName: searchQuery
        }

        try {
            const results = await musicPlayList.getMusicPlayList(searchQuery);
            setSearchResults(results?.documents);
            console.log('Search results:', results?.documents);

        } catch (error) {
            console.error('Error searching music playlists:', error);
        }
        if (searchResults?.length < 0) {
            console.log('No results found');

        }
    };

    return (
        <div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="search">Search</Label>
                <Input
                    type="text"
                    id="search"
                    placeholder="Enter search query"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <Button onClick={handleSearch}>Search</Button>

            {searchResults?.length > 0 && (
                <div>
                    <h2>Search Results:</h2>
                    <ul>
                        {searchResults.map((result) => (
                            <div key={result.$id} className='space-y-2 border border-solid  rounded-lg px-2 ' >
                                <li key={result.$id}> PlayList Name : {result.name}</li>

                                <li>

                                    PlayList Id = {result.$id}
                                    <p className='text-gray-500 text-sm'>copy id</p>
                                    <CopyButton textToCopy={result.$id} />

                                </li>
                                <li key={result.$id}>avatar id = {result.musicPlayListAvatar}
                                </li>
                                <li className='flex items-center gap-1'> <p className='text-gray-500 text-sm'>copy avatar id</p> <CopyButton textToCopy={result.musicPlayListAvatar} /> </li>
                            </div>
                        ))}
                    </ul>
                </div >
            )}
            <>
                <div>
                    <Link href={'/upload/music/create/playList'}>If Singer PlayList Not Exist</Link>
                </div>
            </>
        </div >
    );
};

export default SearchIfSingerPlayListExist;
