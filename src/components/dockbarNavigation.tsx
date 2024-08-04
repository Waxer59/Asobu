import { PATHNAMES } from '@constants';
import {
  Button,
  buttonVariants,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@shadcn';
import { HomeIcon, MessageCircle, Mic, Presentation } from 'lucide-react';
import Link from 'next/link';

interface Props {
  alternateRecording: () => void;
  isRecording: boolean;
}

export const DockbarNavigation: React.FC<Props> = ({
  alternateRecording,
  isRecording
}) => {
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={PATHNAMES.INDEX}
              className={`${buttonVariants({ variant: 'ghost', size: 'icon' })} absolute -left-14`}>
              <HomeIcon className="stroke-1" />
            </Link>
          </TooltipTrigger>
          <TooltipContent>Go home</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={PATHNAMES.CHAT}
              className={buttonVariants({ variant: 'ghost', size: 'icon' })}>
              <MessageCircle className="stroke-1" />
            </Link>
          </TooltipTrigger>
          <TooltipContent>Chat</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant={isRecording ? 'default' : 'secondary'}
              className="rounded-full"
              onClick={alternateRecording}>
              <Mic className="stroke-1" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isRecording ? 'Recording...' : 'Talk to the AI'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={PATHNAMES.TEACH_MODE}
              className={buttonVariants({
                variant: 'ghost',
                size: 'icon'
              })}>
              <Presentation className="stroke-1" />
            </Link>
          </TooltipTrigger>
          <TooltipContent>Teach mode</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
};
