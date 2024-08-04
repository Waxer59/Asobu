import { useUiStore } from '@/store';
import {
  Button,
  Card,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@shadcn';
import {
  Languages,
  Music,
  Navigation,
  NotebookPen,
  Wrench
} from 'lucide-react';

export const DockbarTools = () => {
  const {
    isSpotifyOpen,
    setIsSpotifyOpen,
    toggleNavigation,
    isTranslateOpen,
    setIsTranslateOpen,
    isNotesOpen,
    setIsNotesOpen
  } = useUiStore();

  const onMusicClick = () => {
    setIsSpotifyOpen(!isSpotifyOpen);
  };

  const onNavigationClick = async () => {
    toggleNavigation();
  };

  const onTranslateClick = async () => {
    setIsTranslateOpen(!isTranslateOpen);
  };

  const onNotesClick = async () => {
    setIsNotesOpen(!isNotesOpen);
  };
  return (
    <Collapsible>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-14">
                <Wrench className="stroke-1" />
              </Button>
            </CollapsibleTrigger>
          </TooltipTrigger>
          <TooltipContent>Tools</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <CollapsibleContent>
        <Card className="absolute flex gap-4 p-2 top-0 left-64">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={onTranslateClick}>
                  <Languages />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Translate</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={onNavigationClick}>
                  <Navigation />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Navigation</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={onMusicClick}>
                  <Music />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Music</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="ghost" onClick={onNotesClick}>
                  <NotebookPen />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notes</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};
