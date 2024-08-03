import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  isNavigationOpen: boolean;
  navigationFrom?: string;
  navigationTo: string;
  whiteBoardImage: string;
}

interface Actions {
  toggleNavigation: () => void;
  setIsNavigationOpen: (isOpen: boolean) => void;
  setNavigationFrom: (from: string | undefined) => void;
  setNavigationTo: (to: string) => void;
  setWhiteBoardImage: (image: string) => void;
  clear: () => void;
  clearNavigation: () => void;
}

const initialState: State = {
  isNavigationOpen: false,
  navigationFrom: undefined,
  navigationTo: '',
  whiteBoardImage: ''
};

export const useUiStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    toggleNavigation: () =>
      set((state) => ({ isNavigationOpen: !state.isNavigationOpen })),
    setIsNavigationOpen: (isOpen) => set({ isNavigationOpen: isOpen }),
    setNavigationFrom: (from) => set({ navigationFrom: from }),
    setNavigationTo: (to) => set({ navigationTo: to }),
    setWhiteBoardImage: (image) => set({ whiteBoardImage: image }),
    clear: () => set(initialState),
    clearNavigation: () =>
      set({
        navigationFrom: initialState.navigationFrom,
        navigationTo: initialState.navigationTo,
        isNavigationOpen: initialState.isNavigationOpen
      })
  }))
);
