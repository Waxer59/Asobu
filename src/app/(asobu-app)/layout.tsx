import type { ReactNode } from 'react';
import { Toaster } from '@components/shadcn/toaster';
import { SpotifyLoginButton } from '@components/spotify-login-button';
import { DockBar } from '@components/dockBar';
import { ApiKeyDialog } from '@components/api-key-dialog';
import { Tools } from '@components/tools';
import { Inter } from 'next/font/google';
import { NextAuthProvider } from '@components/auth-provider';
import { Metadata } from 'next';
import '../../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Asobu | AI',
  description:
    'Asobu, derived from the Japanese word for "play," is a project that explores the possibilities of AI by integrating various interactive and assistive features. Developed for the Midudev 2024 hackathon, Asobu showcases the versatility of AI by combining music, navigation, translation, education, note-taking, chat, image recognition, and voice commands into a single platform.',
  icons: {
    icon: '/favicon.png'
  },
  openGraph: {
    title: 'Asobu | Home',
    description:
      'Asobu, derived from the Japanese word for "play," is a project that explores the possibilities of AI by integrating various interactive and assistive features. Developed for the Midudev 2024 hackathon, Asobu showcases the versatility of AI by combining music, navigation, translation, education, note-taking, chat, image recognition, and voice commands into a single platform.',
    type: 'website',
    images: [
      {
        url: '/asobu-og.png',
        width: 1200,
        height: 630,
        alt: 'og banner'
      }
    ]
  }
};

export default function AILayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="h-full w-full dark">
      <body className={`${inter.className} w-full h-full overflow-hidden`}>
        <NextAuthProvider>
          {children}
          <Toaster />
          <SpotifyLoginButton />
          <DockBar />
          <ApiKeyDialog />
          <Tools />
        </NextAuthProvider>
      </body>
    </html>
  );
}
