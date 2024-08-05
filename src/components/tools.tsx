'use client';

import { useUiStore } from '@store/ui';
import { useNavigationStore } from '@store/navigation';
import { Translate } from './translate';
import { Navigation } from './navigation';
import SpotifyWidget from './spotify-widget';
import { Notes } from './notes';

export const Tools = () => {
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
      {isNavigationOpen && <Navigation />}
      {isTranslateOpen && <Translate />}
      {isSpotifyOpen && <SpotifyWidget />}
      {isNotesOpen && <Notes />}
    </>
  );
};
