import musicConfig from "@/config/dataBase/playListsDb/musicConfig";

const uploadMusicToDb = async (data: any) => {
    const result = await musicConfig.createMusicConfig({
        musicName: data.musicName,
        musicId: data.musicId || '',
        musicAvatar: data.musicAvatar,
        singer: [...data.singer.split(',').map((s: string) => s.trim())],  // Trim each singer name
        description: data.description || 'song',
        hashTags: [...data.hashTags.split(',').map((tag: string) => tag.trim())],  // Trim each hashtag
        likeId: [],
        like: 0,
        language: data.language,
        musicUri: data.musicUri,
        musicAvatarUrl: data.musicAvatarUrl,
        year: data.year,
        url: data.url
    })

    return result
}
export default uploadMusicToDb