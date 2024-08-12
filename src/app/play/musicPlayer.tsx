/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import music from '@/config/dataBase/playListsDb/music';
import { useRouter } from 'next/navigation';
import MediaSessionFunc from './mediaSession';
import { handleSeek, pauseAudio, playAudio, player, playMusic, playNextTrack, playPreviousTrack } from './playControllers';
import MusicPlayerFull from '@/components/cust/musicPlayerFullScreen';

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

    // ====> test useStates
    const [ppc, setPpc] = useState<string>()
    const [isPlaying, setIsPlaying] = useState(false);
    const [fullScreen, setFullScreen] = useState(false)


    const router = useRouter()


    // =====> at initial render defining the audio ref as a music player
    useEffect(() => {
        player(
            audioRef,
            setCurrentTrackIndex,
            setDuration,
            setCurrentTime
        )
    }, []);

    // =======> when this useEffect runs, it will set the current track index
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

    // =====>  here when track index is seed , then this call play func

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
            setPpc('pause')
            setCurrentSongInfo(allMusicInfo[currentTrackIndex]);
            // console.log('Current song info:', currentSongInfo);
        }
    }, [currentTrackIndex]);


    // =====> handling back button
    const handleBackButton = () => {
        pauseAudio(audioRef, isPlaying)
        window.removeEventListener('popstate', handleBackButton);
        router.push('/')
    };
    window.addEventListener('popstate', handleBackButton);

    const handleFullScreen = (id: string) => {
        if (id) {
            const trackIndex = musicIds.indexOf(id);

            if (trackIndex !== -1) {
                // console.log('Setting initial track index:', trackIndex);
                setCurrentTrackIndex(trackIndex);
                setCurrentSongInfo(allMusicInfo[trackIndex]);
                // console.log('Current song info:', currentSongInfo);
            } else {
                console.error('Track ID not found in musicIds:', id);
            }
        }
    }


    // ==> media session api
    useEffect(() => {
        MediaSessionFunc(
            {
                currentSongInfo,
                playNextTrackFn: () => playNextTrack(setCurrentTrackIndex),
                playPreviousTrackFn: () => playPreviousTrack(setCurrentTrackIndex, musicIds),
                setIsPlaying,
                playFn: () => playAudio(audioRef, setPpc, setCurrentTrackIndex, setIsPlaying)
            }
        )
    }, [currentSongInfo])
    useEffect(() => { console.log('isPlaying', isPlaying) }, [isPlaying])
    return (
        fullScreen ?
            <MusicPlayerFull
                currentSongInfo={currentSongInfo}
                isDisplay={fullScreen}
                allMusicInfo={allMusicInfo}
                playMusic={(id) => handleFullScreen(id)}
                setIsDisplay={(val: boolean) => setFullScreen(val)}
                plPaFn={() => playAudio(audioRef, setPpc, setCurrentTrackIndex, setIsPlaying)}
                nextFn={() => playNextTrack(setCurrentTrackIndex)}
                prevFn={() => playPreviousTrack(setCurrentTrackIndex, musicIds)}
                seekFn={(event) => handleSeek(event, audioRef, setCurrentTime)}
                duration={duration}
                currentTime={currentTime}
                isPlaying={isPlaying}
            />
            :
            <div className={` w-[97%]  mx-auto fixed  bottom-0 left-0 right-0 rounded-xl bg-slate-950 p-2 m-2`}>

                <div
                    className='flex justify-evenly'
                >
                    <button onClick={() => playPreviousTrack(setCurrentTrackIndex, musicIds)}>👈</button>
                    <button onClick={() => playAudio(audioRef, setPpc, setCurrentTrackIndex, setIsPlaying)} >{ppc || 'play'}</button>
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
                <button onClick={() => setFullScreen(true)} >dis</button>
            </div>

    );
};

export default MusicPlayer;