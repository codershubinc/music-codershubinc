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
        return;
    }

    const musicAvatarUrl = currentSongInfo.musicAvatar
        ? userAvatarDBConfig.getUserAvatarView(currentSongInfo.musicAvatar)
        : currentSongInfo.musicAvatarUrl;

    const setupMediaSessionMetadata = () => {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: DecodeHTMLEntities(currentSongInfo?.musicName || 'Unknown Title'),
            artist: DecodeHTMLEntities(currentSongInfo.singer?.map(singer => singer.trim()).join(', ') || 'Unknown Artist'),
            album: DecodeHTMLEntities(currentSongInfo.musicName || 'Unknown Album'),
            artwork: [
                // Provide multiple sizes so browsers pick the best quality
                // Edge/Chrome cache based on declared sizes, so we include
                // larger sizes to prevent excessive compression
                {
                    src: String(musicAvatarUrl),
                    sizes: '96x96',
                    type: 'image/png',
                },
                {
                    src: String(musicAvatarUrl),
                    sizes: '128x128',
                    type: 'image/png',
                },
                {
                    src: String(musicAvatarUrl),
                    sizes: '192x192',
                    type: 'image/png',
                },
                {
                    src: String(musicAvatarUrl),
                    sizes: '256x256',
                    type: 'image/png',
                },
                {
                    src: String(musicAvatarUrl),
                    sizes: '384x384',
                    type: 'image/png',
                },
                {
                    src: String(musicAvatarUrl),
                    sizes: '512x512',
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
        // Media Session API not supported; silently no-op in production
    }

    // Cleanup: remove event listener on component unmount
    return () => {
        document.removeEventListener('keydown', handleKeyDown);
    };
};

export default MediaSessionFunc;
