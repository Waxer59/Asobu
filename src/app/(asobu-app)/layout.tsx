import type { ReactNode } from 'react';
import { Toaster } from '@components/shadcn/toaster';
import { SpotifyLoginButton } from '@components/spotify-login-button';
import { DockBar } from '@components/dockBar';
import { ApiKeyDialog } from '@components/api-key-dialog';
import { Tools } from '@components/tools';
import { Inter } from 'next/font/google';
import { NextAuthProvider } from '@components/auth-provider';
import { Metadata } from 'next';
import '@styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Asobu | AI'
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
