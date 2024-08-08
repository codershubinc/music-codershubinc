'use client'
import React, { useEffect, useState } from 'react';
import PageUi from '@/components/page/pageui';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import LogOutBtn from '@/components/Buttons/LogOutBtn';
import UserAvatar from './userAvatar';
import cryptoUtil from '@/lib/util/CryptoUtil';
import dbConfig from '@/config/dataBase/userPrefs/UserDBConfig';
import Link from 'next/link';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import CopyButton from '@/components/Buttons/CopyBtn';
import AvatarChange from './AvatarChange';


const UserDashboard: React.FC = () => {
    const [currentUserPrefs, setCurrentUserPrefs] = useState<any>({});
    const [isMyDashboard, setIsMyDashboard] = useState(true);
    const router = useRouter();
    const { isUserLogin, currentUser, userPrefs } = useAuth();
    const searchParams = useSearchParams();
    const IdInUrl = cryptoUtil.decryptString(searchParams.get('userId') || '');
    const encryptedUserId = cryptoUtil.encryptString(currentUser?.$id);




    useEffect(() => {

        const fetchUser = async () => {
            try {
                if (IdInUrl === currentUser?.$id) {
                    setCurrentUserPrefs(userPrefs);
                    setIsMyDashboard(true);
                } else if (IdInUrl === '') {
                    setCurrentUserPrefs(userPrefs);
                    setIsMyDashboard(true);
                } else {
                    const user = await dbConfig.getDocument(IdInUrl);
                    setCurrentUserPrefs(user);
                    setIsMyDashboard(false);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        console.log('id in url:', IdInUrl);
        

        fetchUser();
    }, [IdInUrl, currentUser, userPrefs]);

    return (
        <PageUi className='flex flex-col items-center justify-center' >
            {!isMyDashboard && (
                <Link
                    href={`/users/userdashboard?userId=${encryptedUserId}`}
                    className='fixed top-[50px] right-5'
                >
                    Visit Your Dashboard
                </Link>
            )}
            <div
                className='flex flex-col items-center   w-max'
            >
                {isUserLogin ? (
                    <>
                        <UserAvatar />
                        <Card
                            className='w-full flex flex-col items-center justify-center  mx-auto'
                        >
                            <CardHeader>
                                <CardTitle> Name : {currentUserPrefs.name}</CardTitle>

                            </CardHeader>
                            <CardContent>
                                <CardTitle>UserName : {currentUserPrefs.userName}</CardTitle>
                                <CardDescription> Email : {currentUserPrefs.email}</CardDescription>
                            </CardContent>
                            <CardFooter>
                                <div className='flex  gap-2'>
                                    {isMyDashboard
                                        &&

                                        <LogOutBtn path='/users/login' className='' />

                                    }
                                    <CopyButton textToCopy={window.location.href} />
                                </div>
                            </CardFooter>

                        </Card>
                        <AvatarChange />
                    </>
                ) : (
                    <Button onClick={() => router.push('/users/login')} variant='outline'>
                        Loading
                    </Button>
                )}
            </div>
        </PageUi>
    );
};

export default UserDashboard;
