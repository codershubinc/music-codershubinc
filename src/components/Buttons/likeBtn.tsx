/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'
import dbConfig from '@/config/dataBase/userPrefs/UserDBConfig'
import { useAuth } from '@/context/AuthContext'
import React, { useEffect, useState } from 'react'

function LikeBtn({ musicId }: { musicId: string }) {
    const [liked, setLiked] = useState(false)
    const [loading, setLoading] = useState(true)
    const { currentUser, userPrefs } = useAuth()

    const handleLike = async() => {}


    const findUserPrefs = async() => {

    }

    useEffect(() => {

    }, [])

    if (!musicId) return null

    return (
        <div>
            <img
                src={
                    liked ?
                        'https://cdn4.iconfinder.com/data/icons/set-1/32/__1-64.png'
                        :
                        "https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/like-64.png"
                }
                alt="Like button"
                className={`w-8 cursor-pointer ${loading ? 'opacity-50' : ''}`}
                onClick={handleLike}
            />
        </div>
    )
}

export default LikeBtn
