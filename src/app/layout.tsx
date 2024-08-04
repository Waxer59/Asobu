'use client';

import React from 'react';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { ApiKeyDialog } from '@components/api-key-dialog';
import { DockBar } from '@components/dockBar';
import { SpotifyLoginButton } from '@components/spotify-login-button';
import { Tools } from '@components/tools';
import '../styles/globals.css';
import { Toaster } from '@shadcn/toaster';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full w-full dark">
      <head>
        <title>Asobu | Ai</title>
        <meta name="description" content="TODO" />
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className={`${inter.className} w-full h-full overflow-hidden`}>
        <SessionProvider>
          {children}
          <Toaster />
          <SpotifyLoginButton />
          <DockBar />
          <ApiKeyDialog />
          <Tools />
        </SessionProvider>
      </body>
    </html>
  );
}
