import userAvatarDBConfig from "@/config/dataBase/userPrefs/userAvatarDBConfig";
import DecodeHTMLEntities from "../func/htmlDecode";

interface MediaSessionFuncProps {
    currentSongInfo: {
        musicAvatar?: string;
        musicAvatarUrl?: string;
        musicName?: string;
        singer?: string[];
    } | undefined;
    playNextTrackFn: () => void;
    playPreviousTrackFn: () => void;
    setIsPlaying: (isPlaying: boolean) => void;
    playFn: () => void;
}

const MediaSessionFunc = ({
    currentSongInfo,
    playNextTrackFn,
    playPreviousTrackFn,
    playFn,
}: MediaSessionFuncProps) => {
    if (!currentSongInfo) {
        console.log('currentSongInfo is undefined');
        return;
    }

    const musicAvatarUrl = currentSongInfo.musicAvatar
        ? userAvatarDBConfig.getUserAvatarPreviewWithPrefs(currentSongInfo.musicAvatar, 500)
        : currentSongInfo.musicAvatarUrl;

    const setupMediaSessionMetadata = () => {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: DecodeHTMLEntities(currentSongInfo?.musicName || 'Unknown Title'),
            artist: DecodeHTMLEntities(currentSongInfo.singer?.map(singer => singer.trim()).join(', ') || 'Unknown Artist'),
            album: DecodeHTMLEntities(currentSongInfo.musicName || 'Unknown Album'),
            artwork: [
                {
                    src: String(musicAvatarUrl),
                    sizes: '500x500',
                    type: 'image/png',
                },
            ],
        });
    };

    const setupMediaSessionHandlers = () => {
        navigator.mediaSession.setActionHandler('previoustrack', playPreviousTrackFn);
        navigator.mediaSession.setActionHandler('nexttrack', playNextTrackFn);
        navigator.mediaSession.setActionHandler('play', playFn);
        navigator.mediaSession.setActionHandler('pause', playFn);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
            case 'MediaTrackPrevious':
                playPreviousTrackFn();
                break;
            case 'MediaTrackNext':
                playNextTrackFn();
                break;
            default:
                break;
        }
    };

    if ('mediaSession' in navigator) {
        setupMediaSessionMetadata();
        setupMediaSessionHandlers();

        document.addEventListener('keydown', handleKeyDown);
    } else {
        console.warn('Media Session API is not supported in this browser.');
    }

    // Cleanup: remove event listener on component unmount
    return () => {
        document.removeEventListener('keydown', handleKeyDown);
    };
};

export default MediaSessionFunc;
