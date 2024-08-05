'use client';

import { useUiStore } from '@store/ui';
import { useNavigationStore } from '@store/navigation';
import { Translate } from './translate';
import { Navigation } from './navigation';
import SpotifyWidget from './spotify-widget';
import { Notes } from './notes';

export const Tools = () => {
  const navigationFrom = useNavigationStore((state) => state.navigationFrom);
  const navigationTo = useNavigationStore((state) => state.navigationTo);
  const isNavigationOpen = useUiStore((state) => state.isNavigationOpen);
  const isTranslateOpen = useUiStore((state) => state.isTranslateOpen);
  const isSpotifyOpen = useUiStore((state) => state.isSpotifyOpen);
  const isNotesOpen = useUiStore((state) => state.isNotesOpen);
  const clearNavigation = useNavigationStore((state) => state.clear);

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
      {isNotesOpen && <Notes />}
    </>
  );
};
