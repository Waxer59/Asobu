'use client';

import { AuthResponse } from '@/types/types';
import { SpotifyIcon } from './icons';
import { Button } from '@shadcn/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@shadcn/tooltip';
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
            className="absolute bottom-16 right-16 md:right-2 md:top-20 z-50"
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
