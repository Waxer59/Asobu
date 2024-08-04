'use client';

import { searchSpotify } from '@lib/spotify';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { AuthResponse } from '@/types/types';
import { Button } from '@components/shadcn/button';
import { useSpotifyStore } from '@store/spotify';
import SpotifyPlayer from 'react-spotify-web-playback';
import { SpotifyIcon } from './icons';

export default function SpotifyWidget() {
  const { data } = useSession();
  const authSession = data as AuthResponse;
  const token = authSession?.token.access_token;
  const query = useSpotifyStore((state) => state.spotifyQuery);
  const [URI, setURI] = useState<string | null>(null);

  useEffect(() => {
    const fetchSong = async () => {
      if (!authSession) return;
      const res = await searchSpotify(query, token);
      setURI(res.tracks.items[0].uri);
    };

    fetchSong();
  }, [query]);

  return (
    <div>
      <Button
        variant="ghost"
        className="absolute top-6 right-20"
        onClick={() => (authSession ? signOut() : signIn())}>
        <SpotifyIcon className={authSession ? 'text-green-600' : ''} />
      </Button>
      <div className="absolute bottom-40 right-10">
        {token && (
          <SpotifyPlayer
            token={token}
            uris={URI ? [URI] : []}
            layout="compact"
            play={true}
          />
        )}
      </div>
    </div>
  );
}
