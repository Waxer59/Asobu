import { create } from 'zustand';

interface State {
  spotifyQuery: string;
  isSpotifyOpen: boolean;
}

interface Actions {
  setSpotifyQuery: (query: string) => void;
  setIsSpotifyOpen: (isOpen: boolean) => void;
}

const initialState: State = {
  spotifyQuery: '',
  isSpotifyOpen: false
};

export const useSpotifyStore = create<State & Actions>((set) => ({
  ...initialState,
  setSpotifyQuery: (query) => set({ spotifyQuery: query }),
  setIsSpotifyOpen: (isOpen) => set({ isSpotifyOpen: isOpen })
}));
