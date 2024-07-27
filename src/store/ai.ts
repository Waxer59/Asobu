import { create } from "zustand";

interface State {
  apiKey: string | undefined;
}

interface Actions {
  setApiKey: (apiKey: string) => void;
}

const initialState: State = {
  apiKey: "",
};

export const useStore = create<State & Actions>(() => ({
  ...initialState,
  setApiKey: (apiKey) => {
    useStore.setState({ apiKey });
  },
}));
