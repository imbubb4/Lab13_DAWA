import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyCredentials } from "@/lib/userService";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            // Forzar que Google muestre el selector de cuenta cada vez
            // Esto hace que Google pida seleccionar cuenta (útil si hay varias)
            authorization: {
                params: {
                    prompt: 'select_account',
                    access_type: 'offline',
                    response_type: 'code'
                }
            }
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'Email' },
                password: { label: 'Password', type: 'password', placeholder: 'Password' },
            },
            async authorize(credentials, req) {
                if (!credentials) return null;
                try {
                    const user = await verifyCredentials(credentials.email, credentials.password);
                    if (user) {
                        return user;
                    } else {
                        return null;
                    }
                }catch (error: any) {
                        throw new Error(error.message || 'Invalid credentials.');
                    }
                }
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        }),
    ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };