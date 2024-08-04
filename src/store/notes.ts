import { NoteData } from '@/types/types';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface State {
  notes: NoteData[];
}

interface Actions {
  addNote: (note: NoteData) => void;
  removeNote: (id: string) => void;
  setNotes: (notes: NoteData[]) => void;
  clear: () => void;
}

const initialState: State = {
  notes: []
};

export const useNotesStore = create<State & Actions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
        removeNote: (id) =>
          set((state) => ({
            notes: state.notes.filter((note) => note.id !== id)
          })),
        setNotes: (notes) => set({ notes }),
        clear: () => set(initialState)
      }),
      {
        name: 'notes-storage'
      }
    )
  )
);
