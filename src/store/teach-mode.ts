import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  whiteBoardImage: string;
}

interface Actions {
  setWhiteBoardImage: (image: string) => void;
  clear: () => void;
}

const initialState: State = {
  whiteBoardImage: ''
};

export const useTeachModeStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    setWhiteBoardImage: (image) => set({ whiteBoardImage: image }),
    clear: () => set(initialState)
  }))
);
