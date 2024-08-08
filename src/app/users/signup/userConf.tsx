'use client'
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PageUi from '@/components/page/pageui';
import { Button } from '@/components/ui/button';
import { Input as InputUi } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import dbConfig from '@/config/dataBase/userPrefs/UserDBConfig';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import cryptoUtil from '@/lib/util/CryptoUtil';

const UserConf: React.FC = () => {
    const navigate = useRouter();
    const { currentUser, setIsUserLogin, setUserPrefs } = useAuth();

    const { register, handleSubmit, setValue } = useForm();
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                if (currentUser) {
                    setValue('id', currentUser.$id);
                    setValue('name', currentUser.name);
                    setValue('email', currentUser.email);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };
        fetchUser();
    }, [currentUser, setValue]);

    const configureUser = async (data: any) => {
        try {
            const userCreate = await dbConfig.createDocument({
                ...data,
            });
            console.log('data', data, 'UserCreate', userCreate);
            if (userCreate) {
                const encryptedId = cryptoUtil.encryptString(String(userCreate.$id));
                setUserPrefs(userCreate)
                setIsUserLogin(true);
                navigate.push('/users/userdashboard?userId=' + encryptedId);
            }
        } catch (error: any) {
            setError(error?.message || 'An unexpected error occurred');
        }
    };

    return (
        <PageUi>
            <form
                onSubmit={handleSubmit(configureUser)}
                className="flex flex-col w-full h-full items-center justify-center gap-4 p-4 sm:p-6 md:p-8"
            >
                <h1 className='text-2xl sm:text-3xl font-bold text-center'>Create UserName</h1>
                <div className='w-max rounded-xl flex flex-col items-center justify-center my-auto gap-4 p-4 sm:p-6 md:p-8 dark:bg-slate-900'>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="username">UserName</Label>
                        <InputUi
                            type="text"
                            id="username"
                            placeholder="UserName"
                            required
                            {...register("userName", { required: true })}
                        />
                    </div>

                    <Button
                        type="submit"
                        variant={'outline'}
                        className="mt-4 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4"
                    >
                        Save
                    </Button>

                    {error && <p className='text-red-500'>{error}</p>}
                </div>
            </form>
        </PageUi>
    );
};

export default UserConf;
