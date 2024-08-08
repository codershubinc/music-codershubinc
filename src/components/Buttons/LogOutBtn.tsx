'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import authService from '@/config/auth/auth'
import { ReloadIcon } from "@radix-ui/react-icons"
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

function LogOutBtn({ className, path }: { className: string, path: string }) {

    const [loading, setLoading] = useState(false)
    const navigate = useRouter()
    const { setIsUserLogin, setCurrentUser } = useAuth()

    const logOut = async () => {
        setLoading(true)
        try {
            const result = await authService.logout()
            console.log(result);
            setLoading(false)
            setIsUserLogin(false)
            setCurrentUser({})

            navigate.push(`${path}`)
        } catch (error) {
            console.log(error);

        }

    }

    return (
        <>
            {
                !loading
                    ?
                    <Button
                        variant="outline"
                        onClick={logOut}
                        className={className}
                    >
                        LogOut
                    </Button >
                    :
                    <Button disabled>
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                    </Button>

            }
        </>
    )
}

export default LogOutBtn