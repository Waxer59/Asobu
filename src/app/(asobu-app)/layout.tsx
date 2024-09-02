import { Toaster } from '@components/shadcn/toaster';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI',
  openGraph: {
    title: 'AI'
  }
};

export default function AppLayout({
  children
}: Readonly<{
  children: ReactNode;
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
