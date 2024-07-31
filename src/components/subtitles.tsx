import { useAiStore } from '@/store/ai';

export const Subtitles = () => {
  const response = useAiStore((state) => state.response);

  return (
    <div
      className={`max-w-xl origin-bottom ${response?.trim() ? 'block' : 'hidden'}`}>
      <p className="bg-zinc-900/80 p-2 rounded-md truncate text-ellipsis hover:overflow-visible hover:whitespace-normal">
        {response}
      </p>
    </div>
  );
};
