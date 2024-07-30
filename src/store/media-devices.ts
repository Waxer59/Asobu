import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { WebcamProps } from 'react-webcam';
import { createRef, MutableRefObject } from 'react';

interface State {
  baseVideoConstraints: WebcamProps['videoConstraints'];
  file?: File | null;
}

interface Actions {
  ref: MutableRefObject<null>;
}

const initialState: State = {
  baseVideoConstraints: {
    width: 650,
    height: 800,
    facingMode: 'user'
  }
};

export const useMediaStore = create<State & Actions>()(
  devtools((set) => ({
    ...initialState,
    ref: createRef<null>()
  }))
);
