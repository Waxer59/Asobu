import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { Navbar } from '@components/navbar';
import { Footer } from '@components/footer';
import '../../styles/globals.css';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Asobu | Home',
  description: 'TODO',
  icons: {
    icon: '/favicon.png'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="h-full w-full dark">
      <body className={`${inter.className} w-full h-full`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
