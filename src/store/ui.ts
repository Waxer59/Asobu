import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  isNavigationOpen: boolean;
  isTranslateOpen: boolean;
  isSpotifyOpen: boolean;
  isNotesOpen: boolean;
}

interface Actions {
  toggleNavigation: () => void;
  setIsNavigationOpen: (isOpen: boolean) => void;
  setIsSpotifyOpen: (isOpen: boolean) => void;
  setIsTranslateOpen: (isOpen: boolean) => void;
  setIsNotesOpen: (isOpen: boolean) => void;
  clear: () => void;
}

const initialState: State = {
  isNavigationOpen: false,
  isTranslateOpen: false,
  isSpotifyOpen: false,
  isNotesOpen: false
};

export const useUiStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    toggleNavigation: () =>
      set((state) => ({ isNavigationOpen: !state.isNavigationOpen })),
    setIsNavigationOpen: (isOpen) => set({ isNavigationOpen: isOpen }),
    setIsTranslateOpen: (isOpen) => set({ isTranslateOpen: isOpen }),
    setIsSpotifyOpen: (isOpen) => set({ isSpotifyOpen: isOpen }),
    setIsNotesOpen: (isOpen) => set({ isNotesOpen: isOpen }),
    clear: () => set(initialState)
  }))
);
