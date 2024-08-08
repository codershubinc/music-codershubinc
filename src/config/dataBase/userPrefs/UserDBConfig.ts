import { Client, ID, Databases, Storage, Query } from "appwrite";
import conf from "@/conf/conf"

export class DbConfig {

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
    async createDocument({
        id,
        userName,
        name,
        email,
        avatar,
    }: {
        id: string
        avatar: string
        userName: string
        name: string
        email: string
    }) {
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionUserPrefsId,
                id,
                {
                    userName,
                    name,
                    email,

                }
            )

        } catch (error) {
            throw error
        }
    }
    async updateDocument(
        id: string,
        prefs: any
    ) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionUserPrefsId,
                id,
                {
                    ...prefs
                }
            )
        } catch (error) {
            throw error
        }
    }
    async getDocument(id: string) {
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionUserPrefsId,
                id
            )
        } catch (error) {
            throw error
        }
    }
    async updatePlaylistByUser(id: string, prefs: any) {
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionUserPrefsId,
                id,
                {
                    ...prefs
                }
            )
        } catch (error) {
            throw error
        }
    }
}
const dbConfig = new DbConfig()
export default dbConfig