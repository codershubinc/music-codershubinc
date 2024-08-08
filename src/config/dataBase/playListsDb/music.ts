import { Client, ID, Databases, Storage } from "appwrite";
import conf from "@/conf/conf";

export class Music {
    clint = new Client();
    databases;
    bucket;

    constructor() {
        this.clint
            .setEndpoint(conf.appwriteUrl) // Your API Endpoint
            .setProject(conf.appwriteProjectId); // Your project ID
        this.databases = new Databases(this.clint);
        this.bucket = new Storage(this.clint);
    }

    async uploadMusic(music: any) {
        try {
            return await this.bucket.createFile(
                conf.appwriteMusicBucketId,
                ID.unique(),
                music
            );
        } catch (error) {
            throw error;
        }
    }

    getMusic(musicId: string) {
        try {
            return this.bucket.getFileView(
                conf.appwriteMusicBucketId,
                musicId
            );
        } catch (error) {
            throw error;
        }
    }

    async deleteMusic(musicId: string) {
        return await this.bucket.deleteFile(
            conf.appwriteMusicBucketId,
            musicId
        );
    }
}

const music = new Music();
export default music;
