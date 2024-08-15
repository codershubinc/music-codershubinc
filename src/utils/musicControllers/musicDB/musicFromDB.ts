import musicConfig from "@/config/dataBase/playListsDb/musicConfig";

async function GetMusic(
    setMusicDetails: any,
    playlist: any,
    setError: any,
    setLoading: any
) {
    try {

        if (playlist?.musicContains) {
            console.log('Fetched playlist:', playlist);
            const avatarId = playlist?.musicPlayListAvatar;

            const musicContainsInCurrentPlaylist = playlist?.musicContains;

            if (musicContainsInCurrentPlaylist && avatarId) {
                const musicDocsResponse = await musicConfig.getMusicConfig(avatarId);
                const musicDocs = musicDocsResponse.documents;
                console.log('Fetched music documents:', musicDocs);
                setMusicDetails(musicDocs);
            } else {
                console.log('music contains', musicContainsInCurrentPlaylist);

                const avatar = await musicConfig.getMusicConfigBy$Id(musicContainsInCurrentPlaylist);
                const musicDocs = avatar.documents;
                console.log('Fetched music documents:', avatar);
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