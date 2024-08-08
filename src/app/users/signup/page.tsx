'use client'
import React from 'react'
import PageUi from '@/components/page/pageui'
import { useAuth } from '@/context/AuthContext'
import SignUpForm from './signUpForm'
import Link from 'next/link'
import cryptoUtil from '@/lib/util/CryptoUtil'
// import Link from 'next/link'


const Page: React.FC = () => {
    const { isUserLogin, userPrefs } = useAuth();


    return (
        <PageUi
            className=' flex  flex-col items-center justify-center'
        >
            {isUserLogin ?
                <div>Already logged in visit
                    <Link
                        href={'/users/userdashboard?userId=' + cryptoUtil.encryptString(String(userPrefs?.$id))}
                        className={'text-blue-500'}
                    >Dash Board
                    </Link>
                </div>
                :
                <div>
                    <SignUpForm />

                </div>}
        </PageUi>
    )
}

export default Page