/* eslint-disable @next/next/no-img-element */
'use client'
import ifNotUserAvatar from '@/config/dataBase/userPrefs/ifNotUserAvatar'
import userAvatarDBConfig from '@/config/dataBase/userPrefs/userAvatarDBConfig'
import { useAuth } from '@/context/AuthContext'
import React, { useEffect, useState } from 'react'

function UserAvatar() {
    const [userAvatar, setUserAvatar] = useState<any>()
    const { userPrefs } = useAuth()
    // useEffect(() => {
    //     const getUserAvatar = () => {
    //         if (userPrefs.avatar) {
    //             const result =
    //                 setUserAvatar(result)
    //         } else {
    //             const result =
    //                 setUserAvatar(result)
    //         }

    //     }

    //     getUserAvatar()

    // }, [userPrefs])

    return (
        <div>
            <img
                src={
                    userPrefs.avatar ?
                        String(userAvatarDBConfig.getUserAvatarPreview(userPrefs?.avatar)) :
                        String(ifNotUserAvatar.getUserInitials())
                }

                alt=""
                className='  w-[70vw] h-[30vh]  md:w-[400px] md:h-[400px]  rounded-full object-cover m-2 border-white border-2 border-solid'
            />
        </div>

    )
}

export default UserAvatar