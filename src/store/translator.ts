import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  languageOne: string | null;
  languageTwo: string | null;
  languageOneText: string;
  languageTwoText: string;
}

interface Actions {
  setLanguageOne: (lang: string) => void;
  setLanguageTwo: (lang: string) => void;
  setLanguageOneText: (text: string) => void;
  setLanguageTwoText: (text: string) => void;
  switchLanguages: () => void;
  clear: () => void;
}

const initialState: State = {
  languageOne: null,
  languageTwo: null,
  languageOneText: '',
  languageTwoText: ''
};

export const useTranslatorStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    setLanguageOne: (lang) => set({ languageOne: lang }),
    setLanguageTwo: (lang) => set({ languageTwo: lang }),
    setLanguageOneText: (text) => set({ languageOneText: text }),
    setLanguageTwoText: (text) => set({ languageTwoText: text }),
    switchLanguages: () =>
      set((state) => ({
        languageOne: state.languageTwo,
        languageTwo: state.languageOne,
        languageOneText: state.languageTwoText,
        languageTwoText: state.languageOneText
      })),
    clear: () => set(initialState)
  }))
);
