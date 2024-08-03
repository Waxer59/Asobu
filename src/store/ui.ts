import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  isNavigationOpen: boolean;
  isTranslateOpen: boolean;
  languageOne: string | null;
  languageTwo: string | null;
  languageOneText: string;
  languageTwoText: string;
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
  setIsTranslateOpen: (isOpen: boolean) => void;
  setLanguageOne: (lang: string) => void;
  setLanguageTwo: (lang: string) => void;
  setLanguageOneText: (text: string) => void;
  setLanguageTwoText: (text: string) => void;
  switchLanguages: () => void;
  clear: () => void;
  clearNavigation: () => void;
  clearTranslate: () => void;
}

const initialState: State = {
  isNavigationOpen: false,
  navigationFrom: undefined,
  navigationTo: '',
  whiteBoardImage: '',
  languageOne: null,
  languageTwo: null,
  isTranslateOpen: false,
  languageOneText: '',
  languageTwoText: ''
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
      }),
    setIsTranslateOpen: (isOpen) => set({ isTranslateOpen: isOpen }),
    setLanguageOne: (from) => set({ languageOne: from }),
    setLanguageTwo: (to) => set({ languageTwo: to }),
    setLanguageOneText: (text) => set({ languageOneText: text }),
    setLanguageTwoText: (text) => set({ languageTwoText: text }),
    switchLanguages: () =>
      set((state) => ({
        languageOne: state.languageTwo,
        languageTwo: state.languageOne,
        languageOneText: state.languageTwoText,
        languageTwoText: state.languageOneText
      })),
    clearTranslate: () =>
      set({
        languageOne: initialState.languageOne,
        languageTwo: initialState.languageTwo,
        languageOneText: initialState.languageOneText,
        languageTwoText: initialState.languageTwoText,
        isTranslateOpen: initialState.isTranslateOpen
      })
  }))
);
