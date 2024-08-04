import type { Metadata } from 'next';
import React from 'react';
import { Inter } from 'next/font/google';
import { Toaster } from '@shadcn/index';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Asobu | Ai',
  description: 'TODO'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full w-full dark">
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
      </head>
      <body className={`${inter.className} w-full h-full overflow-hidden`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
