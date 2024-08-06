import { MessageData } from '@/types/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  messages: MessageData[];
}

interface Actions {
  addMessage: (message: MessageData) => void;
  removeMessage: (id: string) => void;
  setMessages: (messages: MessageData[]) => void;
  clear: () => void;
}

const initialState: State = {
  messages: []
};

export const useChatStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    addMessage: (message) =>
      set((state) => ({ messages: [...state.messages, message] })),
    removeMessage: (id) =>
      set((state) => ({
        messages: state.messages.filter((message) => message.id !== id)
      })),
    setMessages: (messages) => set({ messages }),
    clear: () => set(initialState)
  }))
);
