import userAvatarDBConfig from "@/config/dataBase/userPrefs/userAvatarDBConfig";

const MediaSessionFunc = (
    {
        currentSongInfo,
        playNextTrackFn,
        playPreviousTrackFn,
        setIsPlaying,
        playFn
    }: {
        currentSongInfo: any,
        playNextTrackFn: () => void,
        playPreviousTrackFn: () => void,
        setIsPlaying: any
        playFn: () => void
    }
) => {

    if (currentSongInfo === undefined) return console.log('currentSongInfo is undefined');

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
            playPreviousTrackFn();
        })



        // Handling the next track action here

        navigator.mediaSession.setActionHandler('nexttrack', () => {
            playNextTrackFn();
        })

        navigator.mediaSession.setActionHandler('play', () => {


            playFn()
        })
        navigator.mediaSession.setActionHandler('pause', () => {


            playFn()
        })




        // Adding keyboard event listeners
        document.addEventListener('keydown', handleKeyDown);



    }

    // Cleanup: remove event listener on component unmount
    return () => {
        document.removeEventListener('keydown', handleKeyDown);
    };




}

export default MediaSessionFunc