import { Client, ID, Databases, Storage, Query, } from "appwrite";
import conf from "@/conf/conf"


export class MusicPlayList {

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
    async createMusicPlayList({
        name,
        nameId,
        musicContains,
        playListSingers,
        like,
        likeId,
        musicPlayListAvatar,
        musicPlayListBanner,
        language,
        musicPlayListAvatarUrl

    }: {
        name: string
        nameId: string
        musicContains: any
        playListSingers: any
        like: number
        likeId: any
        musicPlayListAvatar: string
        musicPlayListBanner: string
        language: string
        musicPlayListAvatarUrl: string
    }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionMusicPlayListId,
                nameId,
                {
                    name,
                    musicContains,
                    playListSingers,
                    like,
                    likeId,
                    musicPlayListAvatar,
                    musicPlayListBanner,
                    language,
                    musicPlayListAvatarUrl
                }
            )
        } catch (error) {
            throw error
        }
    }

    async getMusicPlayList(searchQuery: string): Promise<any> {
        try {


            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionMusicPlayListId,
                [
                    Query.search('name', searchQuery),
                ]
            );
        } catch (error) {
            console.error("Appwrite service :: getMusicPlayList :: error", error);
            return [];
        }
    }
    async getMusicPlayListAllWoQuery(): Promise<any> {
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionMusicPlayListId,
                [
                    Query.orderDesc('like'),
                ]
            );
        } catch (error) {
            console.error("Appwrite service :: getMusicPlayListAllWoQuery :: error", error);
            return [];
        }
    }

    async getMusicPlayListOne(id: string): Promise<any> {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionMusicPlayListId,
                id
            );
        } catch (error) {
            console.error("Appwrite service :: getMusicPlayListOne :: error", error);
            throw error;
        }
    }
    async updateMusicPlayList({
        id,
        musicContains
    }: {
        id: string
        musicContains: any
    }) {
        return await this.databases.updateDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionMusicPlayListId,
            id,
            {
                musicContains
            }
        )
    }
}
const musicPlayList = new MusicPlayList()
export default musicPlayList