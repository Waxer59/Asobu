'use client';

import React from 'react';
import { Inter } from 'next/font/google';
import { Toaster } from '@shadcn/index';
import { SpotifyLoginButton } from '@components/spotify-login-button';
import { DockBar } from '@components/dockBar';
import { ApiKeyDialog } from '@components/api-key-dialog';
import { Tools } from '@components/tools';
import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';

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
