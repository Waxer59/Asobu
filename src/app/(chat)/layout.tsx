import type { ReactNode } from 'react';
import { Toaster } from '@components/shadcn/toaster';
import { ApiKeyDialog } from '@components/api-key-dialog';
import { Inter } from 'next/font/google';
import { Metadata } from 'next';
import { HomeButton } from '@components/home-button';
import '@styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Asobu | Chat',
  openGraph: {
    title: 'Asobu | Chat'
  }
};

export default function ChatLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="h-full w-full dark">
      <body className={`${inter.className} w-full h-full overflow-hidden`}>
        {children}
        <Toaster />
        <ApiKeyDialog goDownInSmallerScreen={false} />
        <HomeButton />
      </body>
    </html>
  );
}
