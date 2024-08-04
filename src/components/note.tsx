import { useNotesStore } from '@/store';
import { NoteData } from '@/types/types';
// @ts-expect-error No types
import SwipeToDelete from 'react-swipe-to-delete-component';
import 'react-swipe-to-delete-component/dist/swipe-to-delete.css';

interface Props {
  note: NoteData;
}

export const Note = ({ note }: Props) => {
  const { id, text } = note;
  const removeNote = useNotesStore((state) => state.removeNote);

  const onDelete = () => {
    removeNote(id);
  };

  return (
    <li className="cursor-grab">
      <SwipeToDelete onDelete={onDelete} classNameTag="rounded">
        <p className="bg-zinc-800 p-2 text-pretty">{text}</p>
      </SwipeToDelete>
    </li>
  );
};
