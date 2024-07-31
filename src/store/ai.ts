import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  apiKey?: string;
  response?: string;
}

interface Actions {
  setApiKey: (apiKey: string) => void;
  setResponse: (response: string) => void;
  clearResponse: () => void;
}

const initialState: State = {
  apiKey: '',
  response: ''
};

export const useAiStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    setApiKey: (apiKey) => {
      set({ apiKey });
    },
    setResponse: (response) => {
      set({ response });
    },
    clearResponse: () => {
      set({ response: '' });
    }
  }))
);
