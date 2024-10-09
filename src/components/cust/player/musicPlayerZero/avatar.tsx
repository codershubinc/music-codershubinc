import React from 'react'

function Avatar(
    {
        currentSongInfo,
        className
    }: {
        currentSongInfo: any,
        className?:string
    }
) {
    return (
        <div
            className={currentSongInfo?.musicAvatarUrl ? 'h-[40%]   md:h-auto lg:h-auto w-[40%]  ' : 'h-max   md:h-auto lg:h-auto w-[40%] bg-slate-950  '}
        >
            <img
                src={
                    currentSongInfo?.musicAvatarUrl
                    ||
                    "https://img.icons8.com/?size=500&id=IxuZbtfqlooy&format=png"
                }
                alt="Music Avatar"
                className={' w-[90%] mx-auto mt-2 md:w-auto lg:w-full object-cover rounded-3xl m-1  transition-transform duration-700 '+ className}
            />
        </div>
    )
}

export default Avatar