/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import music from '@/config/dataBase/playListsDb/music';
import { useAuth } from '@/context/AuthContext';
import userAvatarDBConfig from '@/config/dataBase/userPrefs/userAvatarDBConfig';
import { useRouter } from 'next/navigation';
import LikeBtn from '@/components/Buttons/likeBtn';

interface Props {
    musicIds: string[];
    playMusicWithId: string;
    allMusicInfo: any;
}

const MusicPlayer: React.FC<Props> = ({ musicIds, playMusicWithId, allMusicInfo }) => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentSongInfo, setCurrentSongInfo] = useState<any>();
    const { isSongPlaying } = useAuth();

    const router = useRouter()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            audioRef.current = new Audio();
        }

        const audio = audioRef.current;

        const handleAudioEnd = () => {
            // console.log('Audio has ended');
            playNextTrack();
        };

        const handleTimeUpdate = () => {
            if (audio) setCurrentTime(audio.currentTime);
        };

        const handleLoadedMetadata = () => {
            if (audio) setDuration(audio.duration);
        };

        if (audio) {
            audio.addEventListener('ended', handleAudioEnd);
            audio.addEventListener('timeupdate', handleTimeUpdate);
            audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        }

        return () => {
            if (audio) {
                audio.removeEventListener('ended', handleAudioEnd);
                audio.removeEventListener('timeupdate', handleTimeUpdate);
                audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            }
        };
    }, []);

    const playNextTrack = () => {
        setCurrentTrackIndex(prevIndex => prevIndex + 1)
        // console.log('Playing next track:', currentTrackIndex + 1);
    };

    const playPreviousTrack = () => {
        setCurrentTrackIndex(prevIndex => {
            const previousIndex = prevIndex > 0 ? (prevIndex - 1) : (musicIds.length - 1);
            // console.log('Playing previous track:', previousIndex);
            return previousIndex;
        });
    };

    const playMusic = (trackIndex: number) => {
        const audio = audioRef.current;
        if (trackIndex >= 0 && trackIndex < musicIds.length && audio) {

            setCurrentSongInfo(allMusicInfo[currentTrackIndex]);
            // console.log('Current song info at play music func:', allMusicInfo[trackIndex]);

            const currentMusicId = (allMusicInfo[trackIndex].musicId ?
                String(music.getMusic(allMusicInfo[trackIndex].musicId)) :
                String(allMusicInfo[trackIndex].musicUri)
            );

            console.log('Playing music with ID:', currentMusicId);
            audio.src = currentMusicId;
            audio.play().catch(error => {
                console.error('Error playing music:', error);
            });
        } else if (trackIndex >= musicIds.length) {
            // console.error('Track index out of bounds:', trackIndex);
            setCurrentTrackIndex(0);

        } else {
            console.error('Invalid track index:', trackIndex);
        }
    };

    useEffect(() => {
        if (playMusicWithId) {
            const trackIndex = musicIds.indexOf(playMusicWithId);

            if (trackIndex !== -1) {
                // console.log('Setting initial track index:', trackIndex);
                setCurrentTrackIndex(trackIndex);
                setCurrentSongInfo(allMusicInfo[trackIndex]);
                // console.log('Current song info:', currentSongInfo);
            } else {
                console.error('Track ID not found in musicIds:', playMusicWithId);
            }
        }
    }, [playMusicWithId, musicIds]);

    useEffect(() => {
        if (isSongPlaying && currentTrackIndex !== -1) {
            playMusic(currentTrackIndex);
            setCurrentSongInfo(allMusicInfo[currentTrackIndex]);
            // console.log('Current song info:', currentSongInfo);

        }

    }, [isSongPlaying, currentTrackIndex]);

    const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        const newTime = parseFloat(event.target.value);
        if (audio) {
            audio.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    // >=====> media session api handling
    useEffect(() => {
        if (currentSongInfo === undefined) return console.log('currentSongInfo is undefined');

        const handleKeyDown = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'MediaTrackPrevious':
                    playPreviousTrack();
                    break;
                case 'MediaTrackNext':
                    playNextTrack();
                    break;
                default:
                    break;
            }
        };

        if ('mediaSession' in navigator) {
            const musicAvatarUrl =
                (
                    currentSongInfo?.musicAvatar ?
                        userAvatarDBConfig.getUserAvatarPreviewWithPrefs(currentSongInfo.musicAvatar, 500) :
                        currentSongInfo?.musicAvatarUrl
                )
            // console.log('music avatar url', musicAvatarUrl.href);

            // console.log('currentSongInfo', currentSongInfo);
            // console.log('music avatar id', currentSongInfo?.musicAvatar);


            navigator.mediaSession.metadata = new MediaMetadata({

                title: currentSongInfo?.musicName || 'music',
                artist: currentSongInfo?.singer.map((singer: string) => singer.trim()).join(' , ') || 'Singer Name',
                album: currentSongInfo?.musicName || '',
                artwork: [
                    {
                        src: String(musicAvatarUrl),
                        sizes: '500x500',
                        type: 'image/png',
                    },
                ],
            })
            // Handling the previous track action here

            navigator.mediaSession.setActionHandler('previoustrack', () => {
                playPreviousTrack();
            })



            // Handling the next track action here

            navigator.mediaSession.setActionHandler('nexttrack', () => {
                playNextTrack();
            })
            // Adding keyboard event listeners
            document.addEventListener('keydown', handleKeyDown);

        }

        navigator.mediaSession.setActionHandler('seekto', (val: any) => {
            console.log('seek to');
            handleSeek(val)


        })


        // Cleanup: remove event listener on component unmount
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };

    }, [currentSongInfo]);

    const handleBackButton = () => {
        // console.log('back btn called');

        pauseAudio()
        // const audio = audioRef.current || new Audio();
        // audio.src = 'df' 

        // audioRef.current?.remove()
        // audioRef.current = null
        window.removeEventListener('popstate', handleBackButton);
        router.push('/')
    };
    const playAudio = () => {
        if (audioRef.current?.paused) {
            audioRef.current?.play()
        }else{
            audioRef.current?.pause()
        }
    }
    const pauseAudio = () => {
        // console.log('pause audio');
        audioRef.current?.pause()
    }

    window.addEventListener('popstate', handleBackButton);
    return (
        <div className={` w-[97%]  mx-auto fixed  bottom-0 left-0 right-0 rounded-xl bg-slate-950 p-2 m-2`}>

            <button onClick={playPreviousTrack}>👈</button>
            <button onClick={playAudio} >pl/pa</button>
            <button onClick={playNextTrack}>⏭️</button>
            {/* Seek bar */}
            <input
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                style={{ width: '100%' }}
            />
            <div className="flex flex-row  gap-5">
                <p
                    className='w-[70%] overflow-hidden text-nowrap'
                >
                    {currentSongInfo?.musicName || 'play the music'}
                </p>

                {/* <LikeBtn musicId={currentSongInfo?.$id} /> */}

                <div
                    className='w-[30%]'
                >
                    {Math.floor(currentTime / 60)}:{('0' + Math.floor(currentTime % 60)).slice(-2)} /
                    {Math.floor(duration / 60)}:{('0' + Math.floor(duration % 60)).slice(-2)}
                </div>
            </div>
        </div>
    );
};

export default MusicPlayer;