import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface State {
  apiKey?: string;
}

interface Actions {
  setApiKey: (apiKey: string) => void;
}

const initialState: State = {
  apiKey: ""
};

export const useAiStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    setApiKey: (apiKey) => {
      set({ apiKey });
    }
  }))
);
