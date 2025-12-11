import { Client, ID, Databases, Storage, ImageFormat, ImageGravity } from "appwrite";
import conf from "@/conf/conf"

export class UserAvatarDBConfig {

    clint = new Client()
    databases
    bucket

    constructor() {
        this.clint
            .setEndpoint(conf.appwriteUrl) // Your API Endpoint
            .setProject(conf.appwriteProjectId) // Your project ID
            .setDevKey(conf.appwriteDevKey); // Dev key for Appwrite client
        this.databases = new Databases(this.clint)
        this.bucket = new Storage(this.clint)
    }

    async uploadUserAvatar(userAvatar: any) {
        return await this.bucket.createFile(
            conf.appwriteAvatarBucketId,
            ID.unique(),
            userAvatar
        )
    }
    async deleteUserAvatar(avatarId: string) {
        try {
            await this.bucket.deleteFile(
                conf.appwriteAvatarBucketId,
                avatarId
            )
            return true
        } catch (error) {
            console.log("Appwrite serive :: deleteFile :: error", error);
            return false
        }

    }
    getUserAvatarPreview(avatarId: string) {
        return this.bucket.getFilePreview(
            conf.appwriteAvatarBucketId,
            avatarId
        )
    }
    getUserAvatarPreviewWithPrefs(avatarId: string, size: number) {
        return this.bucket.getFilePreview(
            conf.appwriteAvatarBucketId,
            avatarId,
            size, // width (optional)
            size, // height (optional)
            ImageGravity.Center, // gravity (optional)

        )
    }
    // Return the original/full-quality file view (no preview/resizing)
    getUserAvatarView(avatarId: string) {
        return this.bucket.getFileView(
            conf.appwriteAvatarBucketId,
            avatarId
        )
    }
}
const userAvatarDBConfig = new UserAvatarDBConfig();
export default userAvatarDBConfig