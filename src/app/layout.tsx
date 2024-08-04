import React from 'react';
import { Inter } from 'next/font/google';
import { Navbar } from '@components/navbar';
import { Footer } from '@components/footer';
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
      <body className={`${inter.className} w-full h-full`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
