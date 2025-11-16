import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

import {
  findUserByEmail,
  isAccountLocked,
  registerFailedLogin,
  resetLoginAttempts,
  verifyPassword,
} from "@/lib/userStore";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) {
          throw new Error("Email y contraseña son obligatorios");
        }

        // 1) Verificar bloqueo
        const lock = isAccountLocked(email);
        if (lock.locked) {
          throw new Error("Cuenta bloqueada por demasiados intentos. Intenta en 1 minuto.");
        }

        const user = findUserByEmail(email);
        if (!user) {
          registerFailedLogin(email);
          throw new Error("Credenciales inválidas");
        }

        const isValid = await verifyPassword(user, password);

        if (!isValid) {
          registerFailedLogin(email);
          throw new Error("Credenciales inválidas");
        }

        // login exitoso ⇒ reset intentos
        resetLoginAttempts(email);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin", // usamos TU pantalla de login
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
