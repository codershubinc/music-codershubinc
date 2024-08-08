import { Account, Client, ID } from "appwrite";
import conf from "@/conf/conf";

export class AuthVerify {
    clint = new Client();
    account;

    constructor() {
        this.clint
            .setEndpoint(conf.appwriteUrl) // Your API Endpoint
            .setProject(conf.appwriteProjectId); // Your project ID
        this.account = new Account(this.clint);
    }
    async createAccountVerification() {
        return await this.account.createVerification(
            'http://localhost:3000/login/verifyuser'
        )
    }
    async verifyAccount({
        userId,
        secret,
    }: {
        userId: string;
        secret: string;
    }) {
        return await this.account.updateVerification(userId, secret)
    }


}
const authVerify = new AuthVerify();
export default authVerify