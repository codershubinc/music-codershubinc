'use client'
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import PageUi from '@/components/page/pageui';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import authService from '@/config/auth/auth';
import { Loader2 } from "lucide-react";
import cryptoUtil from '@/lib/util/CryptoUtil';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import dbConfig from '@/config/dataBase/userPrefs/UserDBConfig';

interface LoginFormInputs {
    email: string;
    password: string;
}

const LoginPage: React.FC = () => {
    const { register, handleSubmit } = useForm<LoginFormInputs>();
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const { setCurrentUser, setIsUserLogin, isUserLogin, setUserPrefs } = useAuth();

    const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
        setLoading(true);
        setError('');
        try {
            await authService.login(data);
            const user = await authService.getCurrentUser();
            if (user) {
                const userId = user?.$id ? cryptoUtil.encryptString(String(user.$id)) : '';
                setCurrentUser(user);
                if (user) {
                    const userPref = await dbConfig.getDocument(user.$id);
                    if (userPref) {
                        setUserPrefs(userPref);
                        // console.log('userPref call at login', userPref);
                    }
                }
                setIsUserLogin(true);
                router.push('/');
            }
        } catch (error: any) {
            setError(error.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };
    if (isUserLogin) {
        return (
            <PageUi className='flex flex-col items-center justify-center'>
                <h1 className='text-3xl font-bold'>
                    You are already logged in
                </h1>
                <Link href={'/users/userdashboard'}>
                    <h1 className='text-3xl font-bold'>
                        Click here to go to dashboard
                    </h1>
                </Link>
            </PageUi>
        )
    }

    return (
        <PageUi className='flex flex-col items-center justify-center'>
            {error && <p className='text-red-500'>{error}</p>}
            <div className='w-max h-max'>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='flex flex-col items-center justify-center gap-3 text-center'
                >
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            placeholder="Email"
                            className="w-full"
                            type="email"
                            id="email"
                            required
                            {...register("email", { required: true })}
                        />
                    </div>

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            placeholder="Password"
                            className="w-full"
                            type="password"
                            id="password"
                            required
                            {...register("password", { required: true })}
                        />
                    </div>

                    {loading ? (
                        <Button disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Please wait
                        </Button>
                    ) : (
                        <Button variant="outline" type='submit'>
                            Login
                        </Button>
                    )}
                </form>
                <p>
                    {` Don't have an account?`} <Link href="/users/signup">Sign Up</Link>
                </p>
            </div>
        </PageUi>
    );
};

export default LoginPage;
