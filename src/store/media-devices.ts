import Webcam from 'react-webcam';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface State {
  baseVideoConstraints: MediaTrackConstraints;
  webcam: Webcam | null;
}

interface Actions {
  setBaseVideoConstraints: (constraints: MediaTrackConstraints) => void;
  setWebcam: (webcam: Webcam) => void;
  flipCamera: () => void;
  clear: () => void;
}

const initialState: State = {
  webcam: null,
  baseVideoConstraints: {
    width: 650,
    height: 800,
    facingMode: 'user'
  }
};

export const useMediaStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    setBaseVideoConstraints: (constraints) =>
      set({ baseVideoConstraints: constraints }),
    setWebcam: (webcam) => set({ webcam }),
    flipCamera: () =>
      set((state) => ({
        baseVideoConstraints: {
          ...state.baseVideoConstraints,
          facingMode:
            state.baseVideoConstraints.facingMode === 'user'
              ? 'environment'
              : 'user'
        }
      })),
    clear: () => set(initialState)
  }))
);
