'use client';

import { useUiStore } from '@store/ui';
import { Translate } from './translate';
import { Navigation } from './navigation';
import SpotifyWidget from './spotify-widget';
import { useNavigationStore } from '@/store';

export const Tools = () => {
  const navigationFrom = useNavigationStore((state) => state.navigationFrom);
  const navigationTo = useNavigationStore((state) => state.navigationTo);
  const clearNavigation = useNavigationStore((state) => state.clear);
  const isNavigationOpen = useUiStore((state) => state.isNavigationOpen);
  const isTranslateOpen = useUiStore((state) => state.isTranslateOpen);
  const isSpotifyOpen = useUiStore((state) => state.isSpotifyOpen);

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
