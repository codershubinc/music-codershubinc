import { Client, ID, Databases, Storage, Query } from "appwrite";
import conf from "@/conf/conf"

export class MusicPlayListByUser {

    clint = new Client()
    databases
    bucket

    constructor() {
        this.clint
            .setEndpoint(conf.appwriteUrl) // Your API Endpoint
            .setProject(conf.appwriteProjectId) // Your project ID
        this.databases = new Databases(this.clint)
        this.bucket = new Storage(this.clint)
    }
    async createMusicPlayListByUser({
        name,
        musicContains,
        playListSingers,
        like,
        likeId,
        musicPlayListAvatar,
        musicPlayListBanner,
        publicPlayList,
        createdBy
    }: {
        name: string
        musicContains: any
        playListSingers: any
        like: number
        likeId: any
        musicPlayListAvatar: string
        musicPlayListBanner: string
        publicPlayList: boolean
        createdBy: string
    }) {
        return await this.databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionPlayListByUserId,
            ID.unique(),
            {
                name,
                musicContains,
                playListSingers,
                like,
                likeId,
                musicPlayListAvatar,
                musicPlayListBanner,
                publicPlayList,
                createdBy
            }
        )
    }

    async getMusicPlayListByUser(
        query: string
    ) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionPlayListByUserId,
                query
            )
        } catch (error: any) {
            console.log('ERROR', error);
            return {}

        }
    }
    async updateMusicPlayListByUser({
        id,
        prefs
    }: {
        id: string
        prefs: any
    }) {
        return await this.databases.updateDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionPlayListByUserId,
            id,
            { musicContains: prefs }
        )
    }

    async getMusicPlayListsByUser(id: string) {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionPlayListByUserId,
                [
                    Query.equal('createdBy', id)
                ]
            )

        } catch (error: any) {
            console.log('Error:', error);

            return null
        }
    }
}
const musicPlayListByUser = new MusicPlayListByUser()
export default musicPlayListByUser