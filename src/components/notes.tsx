'use client';

import { TabLayout } from '@layouts/tab-layout';
import { Input } from '@shadcn/input';
import { Note } from './note';
import { useState } from 'react';
import { useUiStore } from '@store/ui';
import { useNotesStore } from '@store/notes';

export const Notes = () => {
  const setIsNotesOpen = useUiStore((state) => state.setIsNotesOpen);
  const notes = useNotesStore((state) => state.notes);
  const [search, setSearch] = useState<string>('');

  const onNoteSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onClose = () => {
    setIsNotesOpen(false);
  };

  return (
    <TabLayout onClose={onClose} cancelDrag="#notes-container">
      <div className="flex flex-col w-96 gap-4" id="notes-container">
        <Input placeholder="Find a note..." onChange={onNoteSearch} />
        <ul className="flex flex-col gap-2 max-h-72 overflow-auto p-1">
          {notes
            .filter((el) => el.text.includes(search))
            .map((el) => (
              <Note key={el.id} note={el} />
            ))}
        </ul>
      </div>
    </TabLayout>
  );
};
