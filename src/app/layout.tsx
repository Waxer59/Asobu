import type { Metadata } from 'next';
import React from 'react';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { Toaster } from '@shadcn/index';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'TODO'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full w-full dark">
      <body className={`${inter.className} w-full h-full overflow-hidden`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
