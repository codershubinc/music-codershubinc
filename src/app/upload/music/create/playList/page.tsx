import PageUi from '@/components/page/pageui'
import React from 'react' 
import MusicPlayListUploadForm from './playListForm'
import SearchComponent from './searchPlayList'

function page() {
    return (
        <PageUi>
            <MusicPlayListUploadForm className={" "} />
            <div
            className='flex   items-center h-full   justify-center'
            >
                <p>
                    search
                </p>
                <SearchComponent />
            </div>
        </PageUi>
    )
}

export default page