import { useAiStore } from '@/store/ai';
import { BeatLoader } from 'react-spinners';
import { Button } from './shadcn';
import { X } from 'lucide-react';
import { useUiStore } from '@/store';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@shadcn';

export const Subtitles = () => {
  const response = useAiStore((state) => state.response);
  const isAiLoading = useAiStore((state) => state.isAiLoading);
  const setIsSubtitlesOpen = useUiStore((state) => state.setIsSubtitlesOpen);

  const onCloseSubtitles = () => {
    setIsSubtitlesOpen(false);
  };

  return (
    <div
      className={`max-w-xl origin-bottom ${response?.trim() || isAiLoading ? 'block' : 'hidden'} bg-zinc-900/80 p-2 rounded-md z-10 group`}>
      {isAiLoading ? (
        <BeatLoader color="#f2f2f2" size={10} />
      ) : (
        <div className="flex items-center gap-2">
          <p className="truncate text-ellipsis group-hover:overflow-visible group-hover:whitespace-normal">
            {response}
          </p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={onCloseSubtitles}>
                  <X />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Close</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};
