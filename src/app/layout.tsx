import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Asobu | Home',
  description:
    'Asobu, derived from the Japanese word for "play," is a project that explores the possibilities of AI by integrating various interactive and assistive features. Developed for the Midudev 2024 hackathon, Asobu showcases the versatility of AI by combining music, navigation, translation, education, note-taking, chat, image recognition, and voice commands into a single platform.',
  icons: {
    icon: '/favicon.png'
  },
  openGraph: {
    title: 'Asobu | Home',
    description:
      'Asobu, derived from the Japanese word for "play," is a project that explores the possibilities of AI by integrating various interactive and assistive features. Developed for the Midudev 2024 hackathon, Asobu showcases the versatility of AI by combining music, navigation, translation, education, note-taking, chat, image recognition, and voice commands into a single platform.',
    type: 'website',
    images: [
      {
        url: `/asobu-og.png`,
        width: 1200,
        height: 630,
        alt: 'og banner'
      }
    ]
  }
};

export default function BaseLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
}
