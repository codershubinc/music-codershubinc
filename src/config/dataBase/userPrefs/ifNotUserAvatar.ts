import { Avatars, Client } from "appwrite";
import conf from "@/conf/conf";

export class IfNotUserAvatar {
    clint = new Client();
    avatar;

    constructor() {
        this.clint
            .setEndpoint(conf.appwriteUrl) // Your API Endpoint
            .setProject(conf.appwriteProjectId); // Your project ID
        this.avatar = new Avatars(this.clint);
    }
    getUserInitials() {
        return this.avatar.getInitials()
    }
}
const ifNotUserAvatar = new IfNotUserAvatar();
export default ifNotUserAvatar