import { CoreMessage } from 'ai';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface State {
  apiKey?: string;
  response?: string;
  isAiLoading: boolean;
  history: CoreMessage[];
}

interface Actions {
  setApiKey: (apiKey: string) => void;
  setResponse: (response: string) => void;
  setIsAiLoading: (isAiLoading: boolean) => void;
  setHistory: (history: CoreMessage[]) => void;
  addToHistory: (text: CoreMessage) => void;
  clearResponse: () => void;
}

const initialState: State = {
  apiKey: '',
  response: '',
  isAiLoading: false,
  history: []
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
        },
        setHistory: (history) => {
          set({ history });
        },
        addToHistory: (text) => {
          set((state) => ({ history: [...state.history, text] }));
        }
      }),
      {
        name: 'ai-store',
        partialize: (state) => ({ apiKey: state.apiKey })
      }
    )
  )
);
