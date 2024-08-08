import { Account, Client, ID } from "appwrite";
import conf from "@/conf/conf";

export class AuthService {
    clint = new Client();
    account;

    constructor() {
        this.clint
            .setEndpoint(conf.appwriteUrl) // Your API Endpoint
            .setProject(conf.appwriteProjectId); // Your project ID
        this.account = new Account(this.clint);
    }

    async createAccount({ email, password, name }: {
        email: string;
        password: string;
        name: string;
    }) {
        try {
            return await this.account.create(
                ID.unique(),
                email,
                password,
                name
            );

        } catch (error) {
            throw error;
        }
    }

    async login({ email, password }: {
        email: string;
        password: string;

    }) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            throw false;
        }
    }

    async logout() {
        try {
            await this.account.deleteSessions();
        } catch (error) {
            console.log("Appwrite serive :: logout :: error", error);
            throw error;
        }
    }
}

const authService = new AuthService();
export default authService;
