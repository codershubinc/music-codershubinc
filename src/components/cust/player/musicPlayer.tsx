/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import music from '@/config/dataBase/playListsDb/music';
import { useRouter } from 'next/navigation';
import MediaSessionFunc from '../../../utils/musicControllers/mediaSession';
import { handleSeek, pauseAudio, playAudio, player, playMusic, playNextTrack, playPreviousTrack } from '../../../utils/musicControllers/playControllers';
import MusicPlayerFull from './musicPlayerFullScreen';
import MusicPlayerFullZero from './musicPlayerZero/musicPlayerFullZero';
import { Button } from '@/components/ui/button';
import DecodeHTMLEntities from '@/utils/func/htmlDecode';
interface Props {
    musicIds: string[];
    playMusicWithId: string;
    allMusicInfo: any;
    playListId: string;
}

const MusicPlayer: React.FC<Props> = ({ musicIds, playMusicWithId, allMusicInfo, playListId }) => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [currentSongInfo, setCurrentSongInfo] = useState<any>();

    // Test useStates
    const [ppc, setPpc] = useState<string>('play');
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [fullScreen, setFullScreen] = useState<boolean>(false);
    const [fullScreenZero, setFullScreenZero] = useState<boolean>(false);

    const router = useRouter();

    // Initialize audio player
    useEffect(() => {
        player(audioRef, setCurrentTrackIndex, setDuration, setCurrentTime);
    }, []);

    // Set current track index on initial render
    useEffect(() => {
        if (playMusicWithId) {
            const trackIndex = musicIds.indexOf(playMusicWithId);
            if (trackIndex !== -1) {
                setCurrentTrackIndex(trackIndex);
                setCurrentSongInfo(allMusicInfo[trackIndex]);
            } else {
                console.error('Track ID not found in musicIds:', playMusicWithId);
            }
        }
    }, [playMusicWithId, musicIds]);

    // Play music when track index is set
    useEffect(() => {
        if (currentTrackIndex !== -1) {
            playMusic(
                currentTrackIndex,
                audioRef,
                allMusicInfo,
                musicIds,
                setCurrentSongInfo,
                setCurrentTrackIndex,
                currentTrackIndex,
                music,
                setIsPlaying
            );
            setPpc('pause');
            setCurrentSongInfo(allMusicInfo[currentTrackIndex]);
        }
    }, [currentTrackIndex, allMusicInfo, musicIds]);

    // Handle back button press
    const handleBackButton = useCallback(() => {
        // Pause the audio
        pauseAudio(audioRef, setIsPlaying);
        const audio = audioRef.current;

        if (audio?.duration) {
            audio.currentTime = audio.duration;
            setCurrentTime(audio.duration);
        }
        router.push('/');
        return () => {
            window.removeEventListener('popstate', handleBackButton);
        };

    }, [audioRef, router]);


    window.addEventListener('popstate', handleBackButton);


    // Handle full screen
    const handleFullScreen = useCallback((id: string) => {
        const trackIndex = musicIds.indexOf(id);
        if (trackIndex !== -1) {
            setCurrentTrackIndex(trackIndex);
            setCurrentSongInfo(allMusicInfo[trackIndex]);
        } else {
            console.error('Track ID not found in musicIds:', id);
        }
    }, [musicIds, allMusicInfo]);

    // Media Session API
    useEffect(() => {
        MediaSessionFunc({
            currentSongInfo,
            playNextTrackFn: () => playNextTrack(setCurrentTrackIndex),
            playPreviousTrackFn: () => playPreviousTrack(setCurrentTrackIndex, musicIds),
            setIsPlaying,
            playFn: () => playAudio(audioRef, setPpc, setCurrentTrackIndex, setIsPlaying),
        });
    }, [currentSongInfo, musicIds]);

    return (
        fullScreen ? (
            <MusicPlayerFull
                currentSongInfo={currentSongInfo}
                isDisplay={fullScreen}
                allMusicInfo={allMusicInfo}
                playMusic={handleFullScreen}
                setIsDisplay={setFullScreen}
                plPaFn={() => playAudio(audioRef, setPpc, setCurrentTrackIndex, setIsPlaying)}
                nextFn={() => playNextTrack(setCurrentTrackIndex)}
                prevFn={() => playPreviousTrack(setCurrentTrackIndex, musicIds)}
                seekFn={(event) => handleSeek(event, audioRef, setCurrentTime)}
                duration={duration}
                currentTime={currentTime}
                isPlaying={isPlaying}
                playListId={playListId}
            />
        ) :
        
        fullScreenZero ? (
            <>
                <MusicPlayerFullZero
                    currentSongInfo={currentSongInfo}
                    isDisplay={fullScreenZero}
                    allMusicInfo={allMusicInfo}
                    playMusic={handleFullScreen}
                    setIsDisplay={setFullScreenZero}
                    plPaFn={() => playAudio(audioRef, setPpc, setCurrentTrackIndex, setIsPlaying)}
                    nextFn={() => playNextTrack(setCurrentTrackIndex)}
                    prevFn={() => playPreviousTrack(setCurrentTrackIndex, musicIds)}
                    seekFn={(event) => handleSeek(event, audioRef, setCurrentTime)}
                    duration={duration}
                    currentTime={currentTime}
                    isPlaying={isPlaying}
                    playListId={playListId}  
                />
            </>
            
        )
        :
        (
            <div className="w-[97%] mx-auto fixed bottom-0 left-0 right-0 rounded-xl bg-slate-950 p-2 m-2">
                <div className='flex justify-evenly'>
                    <button onClick={() => playPreviousTrack(setCurrentTrackIndex, musicIds)}>👈</button>
                    <button onClick={() => playAudio(audioRef, setPpc, setCurrentTrackIndex, setIsPlaying)}>
                        {ppc}
                    </button>
                    <button onClick={() => playNextTrack(setCurrentTrackIndex)}>⏭️</button>
                </div>
                {/* Seek bar */}
                <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={(event) => handleSeek(event, audioRef, setCurrentTime)}
                    style={{ width: '100%' }}
                />
                <div className="flex flex-row gap-5">
                    <p className='w-[70%] overflow-hidden text-nowrap'>
                        {DecodeHTMLEntities(currentSongInfo?.musicName || 'Play the music')}
                    </p>
                    <div className='w-[30%]'>
                        {Math.floor(currentTime / 60)}:{('0' + Math.floor(currentTime % 60)).slice(-2)} /
                        {Math.floor(duration / 60)}:{('0' + Math.floor(duration % 60)).slice(-2)}
                    </div>
                </div>
                <Button
                    className='absolute top-0 right-0  '
                    onClick={() => setFullScreen(true)}
                >^</Button>
                <Button
                    className='absolute top-3 right-3  '
                    onClick={() => setFullScreenZero(true)}
                >^</Button>
            </div>
        )
    );
};

export default MusicPlayer;
