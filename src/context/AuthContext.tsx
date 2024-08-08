'use client'
import authService from '@/config/auth/auth';
import dbConfig from '@/config/dataBase/userPrefs/UserDBConfig';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    isUserLogin: boolean;
    setIsUserLogin: React.Dispatch<React.SetStateAction<boolean>>;
    currentUser: any;
    setCurrentUser: React.Dispatch<React.SetStateAction<any>>;
    userPrefs: any;
    setUserPrefs: React.Dispatch<React.SetStateAction<any>>
    isSongPlaying: boolean;
    setIsSongPlaying: React.Dispatch<React.SetStateAction<boolean>>
    currentlyPlayingMusicInfo: any;
    setCurrentlyPlayingMusicInfo: React.Dispatch<React.SetStateAction<any>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isUserLogin, setIsUserLogin] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>([]);
    const [userPrefs, setUserPrefs] = useState<any>([]);
    const [isSongPlaying, setIsSongPlaying] = useState(false);
    const [currentlyPlayingMusicInfo, setCurrentlyPlayingMusicInfo] = useState<any>([]);

    useEffect(() => {
        const checkUserLogin = async () => {
            console.log('checkUserLogin called');

            try {
                const user = await authService.getCurrentUser();
                setCurrentUser(user);
                setIsUserLogin(true);
                const prefs = await dbConfig.getDocument(user.$id);
                setUserPrefs(prefs);
                setIsSongPlaying(false)

            } catch (error) {
                if (error==='false') {
                    setIsUserLogin(false);
                    console.log('User not logged in');
                    return
                    
                    
                }
                console.log('Error checking user login:', error);
                setIsUserLogin(false);
            }
        };

        checkUserLogin();
    }, []);


    return (
        <AuthContext.Provider value={
            {
                isUserLogin,
                setIsUserLogin,
                currentUser,
                setCurrentUser,
                userPrefs,
                setUserPrefs,
                isSongPlaying,
                setIsSongPlaying,
                currentlyPlayingMusicInfo,
                setCurrentlyPlayingMusicInfo
            }
        }>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
