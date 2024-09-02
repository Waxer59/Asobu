import type { ReactNode } from 'react';
import { SpotifyLoginButton } from '@components/spotify-login-button';
import { DockBar } from '@components/dockBar';
import { ApiKeyDialog } from '@components/api-key-dialog';
import { Tools } from '@components/tools';
import { NextAuthProvider } from '@components/auth-provider';

export default function AILayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <NextAuthProvider>
      {children}
      <SpotifyLoginButton />
      <DockBar />
      <ApiKeyDialog />
      <Tools />
    </NextAuthProvider>
  );
}
