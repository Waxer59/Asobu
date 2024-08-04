'use client';

import { AuthResponse } from '@/types/types';
import { SpotifyIcon } from './icons';
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@shadcn';
import { signIn, signOut, useSession } from 'next-auth/react';

export const SpotifyLoginButton = () => {
  const { data } = useSession();
  const authSession = data as AuthResponse;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="absolute top-6 right-20 z-10"
            onClick={() => (authSession ? signOut() : signIn())}>
            <SpotifyIcon className={authSession ? 'text-green-600' : ''} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {authSession ? 'Sign Out' : 'Sign In with Spotify'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
