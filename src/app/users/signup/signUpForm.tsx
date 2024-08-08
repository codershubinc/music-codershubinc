'use client'
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useForm } from 'react-hook-form';
import authService from '@/config/auth/auth';
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from 'next/navigation';
import UserConf from './userConf';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import dbConfig from '@/config/dataBase/userPrefs/UserDBConfig';

function SignUpForm() {
    const navigate = useRouter();
    const { setCurrentUser } = useAuth();
    const [isAccountCreated, setIsAccountCreated] = useState<boolean>(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const signUp = async (data: any) => {
        setLoading(true);
        setError('');

        try {
            const userAccount = await authService.createAccount(data);
            if (userAccount) {
                const logIn = await authService.login({
                    email: data.email,
                    password: data.password
                });
                if (logIn) {
                    const user = await authService.getCurrentUser();
                    if (user) {
                        setCurrentUser(user);
                        setIsAccountCreated(true);
                    }
                }
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (isAccountCreated) {
        return <UserConf />;
    }

    return (
        <>
            {error && <p className='text-red-500'>{error}</p>}
            <div className='w-max h-max'>
                <form onSubmit={handleSubmit(signUp)} className='flex flex-col items-center justify-center gap-3 text-center'>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            placeholder="Name"
                            className="w-full"
                            type="text"
                            id="name"
                            required
                            {...register("name", { required: true })}
                        />
                    </div>

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

                    <div className="flex items-center space-x-2">
                        <Checkbox id="terms" required {...register("terms", { required: true })} />
                        <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Accept terms and conditions
                        </label>
                    </div>

                    <Button type="submit" variant="outline" disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait ...
                            </>
                        ) : (
                            'Sign Up'
                        )}
                    </Button>
                </form>
            </div>
            <p>
                Already have an account? <Link href={'/users/login'}>Login</Link>
            </p>
        </>
    );
}

export default SignUpForm;
