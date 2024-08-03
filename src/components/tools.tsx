'use client';

import { useUiStore } from '@/store/ui';
import { Translate } from './translate';
import { Navigation } from './navigation';
import { useSpotifyStore } from '@/store/spotify';
import SpotifyWidget from './spotify-widget';

export const Tools = () => {
  const navigationFrom = useUiStore((state) => state.navigationFrom);
  const navigationTo = useUiStore((state) => state.navigationTo);
  const isNavigationOpen = useUiStore((state) => state.isNavigationOpen);
  const isTranslateOpen = useUiStore((state) => state.isTranslateOpen);
  const clearNavigation = useUiStore((state) => state.clearNavigation);
  const isSpotifyOpen = useSpotifyStore((state) => state.isSpotifyOpen);

  const onCloseNavigation = () => {
    clearNavigation();
  };

  return (
    <>
      {isNavigationOpen && (
        <Navigation
          destination={navigationTo}
          from={navigationFrom}
          onClose={onCloseNavigation}
        />
      )}
      {isTranslateOpen && <Translate />}
      {isSpotifyOpen && <SpotifyWidget />}
    </>
  );
};
