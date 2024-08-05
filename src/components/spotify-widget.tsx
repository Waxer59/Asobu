'use client';

import { searchSpotify } from '@lib/spotify';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { AuthResponse } from '@/types/types';
import { useSpotifyStore } from '@store/spotify';
import SpotifyPlayer from 'react-spotify-web-playback';

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
      setURI(res?.tracks?.items[0]?.uri ?? null);
    };

    fetchSong();
  }, [query]);

  return (
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
  );
}
