/* eslint-disable @next/next/no-img-element */
'use client'
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from '@/context/AuthContext'
import userAvatarDBConfig from '@/config/dataBase/userPrefs/userAvatarDBConfig'
import Link from 'next/link'
import cryptoUtil from '@/lib/util/CryptoUtil'
import LogOutBtn from '../Buttons/LogOutBtn'
import ifNotUserAvatar from '@/config/dataBase/userPrefs/ifNotUserAvatar'


function RightDropdownMenu() {
    const { userPrefs, isUserLogin } = useAuth()
    return (
        <div>
            {
                !isUserLogin
                    ?
                    <div><Link href={'/users/login'}>logIn</Link></div>
                    :
                    <DropdownMenu>
                        <DropdownMenuTrigger className='cursor-pointer' asChild>
                            <img
                                src={userPrefs.avatar ? 
                                    String(userAvatarDBConfig.getUserAvatarPreviewWithPrefs(userPrefs?.avatar , 50)): String(ifNotUserAvatar.getUserInitials())}
                                alt="User"
                                className='w-[40px] h-[40px] rounded-full'
                            />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                <Link
                                    href={'/users/userdashboard?userId=' + cryptoUtil.encryptString(String(userPrefs?.$id))}
                                >
                                    Dashboard
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link href={'/'} > View All PlayLists </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Section</DropdownMenuLabel>
                            <DropdownMenuItem>Submenu item 1</DropdownMenuItem>
                            <DropdownMenuItem>
                                {isUserLogin ?
                                    <LogOutBtn className='' path='/users/login' /> :
                                    <Link href={'/users/login'}>logIn</Link>}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu >
            }
        </div>
    )
}
export default RightDropdownMenu