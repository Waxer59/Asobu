import { create } from 'zustand';

interface State {
  spotifyQuery: string;
}

interface Actions {
  setSpotifyQuery: (query: string) => void;
  clear: () => void;
}

const initialState: State = {
  spotifyQuery: ''
};

export const useSpotifyStore = create<State & Actions>((set) => ({
  ...initialState,
  setSpotifyQuery: (query) => set({ spotifyQuery: query }),
  clear: () => set(initialState)
}));
