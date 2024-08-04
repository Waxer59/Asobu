'use client';

import { AuthResponse } from '@/types/types';
import { SpotifyIcon } from './icons';
import { Button } from './shadcn';
import { signIn, signOut, useSession } from 'next-auth/react';

export const SpotifyLoginButton = () => {
  const { data } = useSession();
  const authSession = data as AuthResponse;

  return (
    <Button
      variant="ghost"
      className="absolute top-6 right-20"
      onClick={() => (authSession ? signOut() : signIn())}>
      <SpotifyIcon className={authSession ? 'text-green-600' : ''} />
    </Button>
  );
};
