import { useAiStore } from '@/store/ai';
import { BeatLoader } from 'react-spinners';

export const Subtitles = () => {
  const response = useAiStore((state) => state.response);
  const isAiLoading = useAiStore((state) => state.isAiLoading);

  return (
    <div
      className={`max-w-xl origin-bottom ${response?.trim() || isAiLoading ? 'block' : 'hidden'} bg-zinc-900/80 p-2 rounded-md`}>
      {isAiLoading ? (
        <BeatLoader color="#f2f2f2" size={10} />
      ) : (
        <p className="truncate text-ellipsis hover:overflow-visible hover:whitespace-normal">
          {response}
        </p>
      )}
    </div>
  );
};
