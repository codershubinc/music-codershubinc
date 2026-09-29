import { Account, Client, ID } from "appwrite";
import conf from "@/conf/conf";

export class AuthRecovery {
    clint = new Client();
    account;

    constructor() {
        this.clint
            .setEndpoint(conf.appwriteUrl) // Your API Endpoint
            .setProject(conf.appwriteProjectId); // Your project ID
        this.account = new Account(this.clint);
    }
    async createPassWordRecoveryLinkByEmail({
        email
    }: {
        email: string
    }) {
        return await this.account.createRecovery(
            email,
            'http://localhost:3000/login/recoveruser/password-via-email'
        )
    }
    async verifyPasswordRecoveryLinkByEmail({
        userId,
        secret,
        password,
    }: {
        userId: string
        secret: string
        password: string
    }) {
        return await this.account.updateRecovery(
            userId,
            secret,
            password,
        )
    }

    async createLoginBySendingTokenLinkToEmail({
        email
    }: {
        email: string
    }) {
        return await this.account.createMagicURLToken(
            ID.unique(),
            email,
            'http://localhost:3000/login/via-magic-url'
        )
    }
    async verifyLoginBySendingTokenLinkToEmail({
        userId,
        token
    }: {
        userId: string
        token: string
    }) {
        return await this.account.createSession(
            userId,
            token
        )
    }
    async changePasswordByPassword({
        currentPassword,
        newPassword
    }: {
        currentPassword: string
        newPassword: string
    }) {
        return await this.account.updatePassword(
            newPassword,
            currentPassword
        )
    }


}
const authRecovery = new AuthRecovery();
export default authRecovery