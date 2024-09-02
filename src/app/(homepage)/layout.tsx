import type { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { Navbar } from '@components/navbar';
import { Footer } from '@components/footer';

const inter = Inter({ subsets: ['latin'] });

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
