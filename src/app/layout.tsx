import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

import LogoutButton from "@/components/LogoutButton";
import Provider from "@/components/SessionProvider";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "My Next Auth App",
  description: "My Next Auth App",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  // console.log(session); // solo para debug, luego lo puedes quitar

  const userImage = session?.user?.image as string | undefined;

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <nav className="w-full bg-black shadow-sm">
          <div className="mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold text-white">
              MyAuthApp
            </Link>

            <ul className="flex items-center justify-center gap-6 text-sm text-white">
              <li>
                <Link href="/dashboard" className="hover:text-gray-400">
                  Dashboard
                </Link>
              </li>

              {session?.user && (
                <li>
                  <Link href="/profile" className="hover:text-gray-400">
                    Profile
                  </Link>
                </li>
              )}

              {session?.user && (
                <li>
                  <LogoutButton />
                </li>
              )}

              {userImage && (
                <li>
                  <Image
                    src={userImage}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                  />
                </li>
              )}
            </ul>
          </div>
        </nav>

        <Provider>
          <main>{children}</main>
        </Provider>
      </body>
    </html>
  );
}
