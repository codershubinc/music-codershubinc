'use client'
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input'; // Ensure this path matches your project structure
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import authService from '@/config/auth/auth';
import userDbConfig from '@/config/dataBase/userPrefs/UserDBConfig';
import userAvatarDBConfig from '@/config/dataBase/userPrefs/userAvatarDBConfig';

const AvatarChange: React.FC = (className) => {
    const { userPrefs, currentUser, setUserPrefs } = useAuth();
    const { register, handleSubmit } = useForm();
    const [showForm, setShowForm] = useState(false);
    const [isAvatarUpdating, setIsAvatarUpdating] = useState(false);
    const [status, setStatus] = useState(''); 

    const onSubmit = async (data: any) => {
        if (data.avatar[0] && data.avatar[0].size > 5 * 1024 * 1024) {
            alert('File size should not exceed 5MB');
            return;
        }

        setIsAvatarUpdating(true);
        setStatus('Checking Your Data...');
        setStatus('Uploading your avatar...');

        try {
            const file = await userAvatarDBConfig.uploadUserAvatar(data.avatar[0]);
            console.log('File uploaded:', file);
            if (file) {
                setStatus('Updating your avatar...');
                const fileId = file.$id;

                if (file) {
                    const result = await userAvatarDBConfig.deleteUserAvatar(userPrefs.avatar);
                    console.log('File deleted:', result);

                }

                const result = await userDbConfig.updateDocument(currentUser?.$id, {
                    avatar: fileId
                })

                console.log('User updated:', result);
                if (result) {
                    setUserPrefs(result);
                    console.log('userPrefs updated:', userPrefs);

                }
                setStatus('Done! Avatar will be updated across your devices soon.');
                // router.push('/users/userdashboard');
            }
        } catch (error) {
            console.error('Error updating avatar:', error);
            setStatus('Failed to update avatar.');
        } finally {
            setIsAvatarUpdating(false);
            setShowForm(false);
        }
    };

    return (
        <div>
            <Button onClick={() => setShowForm(!showForm)} className="mb-4 mt-2 " variant="outline" >
                {showForm ? 'Cancel' : 'Change Avatar'}
            </Button>
            {showForm && (
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center">
                    <div>
                        {isAvatarUpdating && (
                            <div className='flex'>
                                {status}
                                <div className='w-6 h-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent'></div>
                            </div>
                        )}
                    </div>
                    <Input
                        type="file"
                        {...register('avatar')}
                        accept="image/*"
                    />
                    <Button type="submit" variant="outline">Submit</Button>
                </form>
            )}
        </div>
    );
};

export default AvatarChange;
