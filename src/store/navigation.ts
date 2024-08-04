import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  navigationFrom?: string;
  navigationTo: string;
}

interface Actions {
  setNavigationFrom: (from: string | undefined) => void;
  setNavigationTo: (to: string) => void;
  clear: () => void;
}

const initialState: State = {
  navigationFrom: undefined,
  navigationTo: ''
};

export const useNavigationStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    setNavigationFrom: (from) => set({ navigationFrom: from }),
    setNavigationTo: (to) => set({ navigationTo: to }),
    clear: () => set(initialState)
  }))
);
