import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface State {
  apiKey?: string;
  response?: string;
  isAiLoading: boolean;
}

interface Actions {
  setApiKey: (apiKey: string) => void;
  setResponse: (response: string) => void;
  setIsAiLoading: (isAiLoading: boolean) => void;
  clearResponse: () => void;
}

const initialState: State = {
  apiKey: '',
  response: '',
  isAiLoading: false
};

export const useAiStore = create<State & Actions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        setApiKey: (apiKey) => {
          set({ apiKey });
        },
        setResponse: (response) => {
          set({ response });
        },
        clearResponse: () => {
          set({ response: '' });
        },
        setIsAiLoading: (isAiLoading) => {
          set({ isAiLoading });
        }
      }),
      {
        name: 'ai-store',
        partialize: (state) => ({ apiKey: state.apiKey })
      }
    )
  )
);
