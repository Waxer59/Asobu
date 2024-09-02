import type { ReactNode } from 'react';
import { ApiKeyDialog } from '@components/api-key-dialog';
import { HomeButton } from '@components/home-button';

export default function ChatLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      {children}
      <ApiKeyDialog goDownInSmallerScreen={false} />
      <HomeButton />
    </>
  );
}
