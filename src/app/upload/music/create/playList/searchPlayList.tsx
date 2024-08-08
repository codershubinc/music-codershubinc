'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import musicPlayList from '@/config/dataBase/playListsDb/musicPlayList';
import CopyButton from '@/components/Buttons/CopyBtn';

const SearchComponent = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const handleSearch = async () => {
        console.log('Searching music playlists...');
        const queries: any = {
            queryType: 'name',
            queryName: searchQuery
        }

        try {
            const results = await musicPlayList.getMusicPlayList(queries);
            setSearchResults(results.documents);
            console.log('Search results:', results.documents);

        } catch (error) {
            console.error('Error searching music playlists:', error);
        }
        if (searchResults.length < 0) {
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

            {searchResults.length > 0 && (
                <div>
                    <h2>Search Results:</h2>
                    <ul>
                        {searchResults.map((result) => (
                            <div key={result.$id} >
                                <li key={result.$id}>{result.name}</li>
                                <li key={result.$id}>avatar id = {result.musicPlayListAvatar} <CopyButton textToCopy={result.musicPlayListAvatar} />  </li>
                            </div>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchComponent;
