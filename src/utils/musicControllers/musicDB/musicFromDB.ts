import musicConfig from "@/config/dataBase/playListsDb/musicConfig";

async function GetMusic(
    setMusicDetails: any,
    playlist: any,
    setError: any,
    setLoading: any
) {
    try {

        if (playlist?.musicContains) {
            const avatarId = playlist?.musicPlayListAvatar;

            const musicContainsInCurrentPlaylist = playlist?.musicContains;

            if (musicContainsInCurrentPlaylist && avatarId) {
                const musicDocsResponse = await musicConfig.getMusicConfig(avatarId);
                const musicDocs = musicDocsResponse.documents;
                setMusicDetails(musicDocs);
            } else {
                const avatar = await musicConfig.getMusicConfigBy$Id(musicContainsInCurrentPlaylist);
                const musicDocs = avatar.documents;
                setMusicDetails(musicDocs);
            }
        } else {
            setMusicDetails([]);
        }
    } catch (error) {
        console.error('Error fetching playlist:', error);
        setError('Error fetching playlist');
    } finally {
        setTimeout(() => setLoading(false), 1000);
    }
}

export default GetMusic