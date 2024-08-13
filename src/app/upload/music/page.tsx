'use client'
import PageUi from '@/components/page/pageui';
import React, { useEffect } from 'react';
import MusicUploadForm from './musicUploadForm';
import SearchIfSingerPlayListExist from './searchIfSingerPlayListExist';
import { useRouter } from 'next/navigation';

function Page() {

    const router = useRouter()

    useEffect(() => {
        router.push('/upload/music/saavnCDN')
    }, [])


    return (
        <PageUi>
            {/* <div className="flex h-full my-auto items-center justify-between mx-10 "> */}
                {/* <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 mb-4 md:mb-0"> */}
                    {/* First search if singer playlist exists */}
                    {/* <SearchIfSingerPlayListExist /> */}
                {/* </div> */}
                {/* <div className="w-full h-max md:w-1/2 lg:w-1/3 xl:w-1/4"> */}
                    {/* Music upload form */}
                    {/* <MusicUploadForm className={" "} /> */}
                {/* </div> */}
            {/* </div> */}
            <p>
                Loading ....
            </p>
        </PageUi>
    );
}

export default Page;
