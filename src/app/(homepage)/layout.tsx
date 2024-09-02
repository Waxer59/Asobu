import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { Navbar } from '@components/navbar';
import { Footer } from '@components/footer';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Home'
};

export default function HomePageLayout({
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
