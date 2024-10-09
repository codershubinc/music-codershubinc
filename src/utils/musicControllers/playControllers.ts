const playAudio = (audioRef: any, setPpc: any, setCurrentTrackIndex: any, isSongPlaying: any) => {
    if (audioRef?.current?.src) {
        // console.log(audioRef?.current.src);

        if (audioRef.current?.paused) {
            audioRef.current?.play()
            isSongPlaying(true)
            setPpc('pause')

        } else {
            audioRef.current?.pause()
            isSongPlaying(false)
            setPpc('play')
        }
    } else {
        console.log('no audio ref');
        setPpc('pause')
        setCurrentTrackIndex(0)
        isSongPlaying(true)
    }

}
const handleSeek = (event: React.ChangeEvent<HTMLInputElement>, audioRef: any, setCurrentTime: any) => {
    const audio = audioRef.current;
    const newTime = parseFloat(event.target.value);
    if (audio) {
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    }
};


const playMusic = (
    trackIndex: number,
    audioRef: any,
    allMusicInfo: any,
    musicIds: any,
    setCurrentSongInfo: any,
    setCurrentTrackIndex: any,
    currentTrackIndex: number,
    music: any,
    isSongPlaying: any
) => {
    const audio = audioRef.current;
    if (trackIndex >= 0 && trackIndex < musicIds.length && audio) {

        setCurrentSongInfo(allMusicInfo[currentTrackIndex]);
        // console.log('Current song info at play music func:', allMusicInfo[trackIndex]);
        const currentMusicId = (allMusicInfo[trackIndex].musicId ?
            String(music.getMusic(allMusicInfo[trackIndex].musicId)) :
            String(allMusicInfo[trackIndex].musicUri)
        );

        // console.log('Playing music with ID:', currentMusicId);
        audio.src = currentMusicId;
        audio.play().catch((error: any) => {
            console.error('Error playing music:', error);
        });
        isSongPlaying(true)
    } else if (trackIndex >= musicIds.length) {
        // console.error('Track index out of bounds:', trackIndex);
        setCurrentTrackIndex(0);
        isSongPlaying(true)
    } else {
        isSongPlaying(false)
        console.error('Invalid track index:', trackIndex);
    }
};


const pauseAudio = (audioRef: any, isSongPlaying: any) => {
    audioRef.current?.pause()
    isSongPlaying(false)

}

const playNextTrack = (setCurrentTrackIndex: any) => {
    setCurrentTrackIndex((prevIndex: number) => prevIndex + 1)
    // console.log('Playing next track:', currentTrackIndex + 1);
};

const playPreviousTrack = (setCurrentTrackIndex: any, musicIds: any) => {
    setCurrentTrackIndex((prevIndex: number) => {
        const previousIndex = prevIndex > 0 ? (prevIndex - 1) : (musicIds.length - 1);
        // console.log('Playing previous track:', previousIndex);
        return previousIndex;
    });
};


const player = (
    audioRef: any,
    setCurrentTrackIndex: any,
    setDuration: any,
    setCurrentTime: any
) => {
    if (typeof window !== 'undefined') {
        audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    const handleAudioEnd = () => {
        // console.log('Audio has ended');
        playNextTrack(
            setCurrentTrackIndex
        );
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
}



export {
    playAudio,
    handleSeek,
    playMusic,
    pauseAudio,
    playNextTrack,
    playPreviousTrack,
    player
}