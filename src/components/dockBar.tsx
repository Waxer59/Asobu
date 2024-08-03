'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Card,
  Button,
  buttonVariants,
  CollapsibleTrigger,
  Collapsible,
  CollapsibleContent
} from '@shadcn/index';
import {
  HomeIcon,
  Languages,
  MessageCircle,
  Mic,
  Music,
  Navigation,
  Presentation,
  Wrench
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Subtitles } from './subtitles';
import { toast } from '@hooks/useToast';
import { getAiResponse, textToSpeech, transcribeAudio } from '@/app/actions';
import { useAiStore } from '@store/ai';
import { useUiStore } from '@store/ui';
import { convertBlobToBase64 } from '@lib/utils';
import { useMediaStore } from '@store/media-devices';
import { AiActions, OpenMapData, OtherData } from '@/types/types';
import { usePathname, useRouter } from 'next/navigation';
import { PATHNAMES } from '@/constants/constants';
import { CoreMessage, UserContent } from 'ai';
import { useMicrophone } from '@hooks/useMicrophone';

export const DockBar = () => {
  const [playAudio, setPlayAudio] = useState<boolean>(false);
  const apiKey = useAiStore((state) => state.apiKey);
  const history = useAiStore((state) => state.history);
  const setIsAiLoading = useAiStore((state) => state.setIsAiLoading);
  const setHistory = useAiStore((state) => state.setHistory);
  const setResponse = useAiStore((state) => state.setResponse);
  const webcam = useMediaStore((state) => state.webcam);
  const whiteBoardImage = useUiStore((state) => state.whiteBoardImage);
  const clearNavigation = useUiStore((state) => state.clearNavigation);
  const setIsNavigationOpen = useUiStore((state) => state.setIsNavigationOpen);
  const setNavigationTo = useUiStore((state) => state.setNavigationTo);
  const setNavigationFrom = useUiStore((state) => state.setNavigationFrom);
  const pathname = usePathname();
  const isTranslateOpen = useUiStore((state) => state.isTranslateOpen);
  const setIsTranslateOpen = useUiStore((state) => state.setIsTranslateOpen);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();
  const { startRecording, stopRecording, isRecording, alternateRecording } =
    useMicrophone({
      onGetChunks: (chunks) => {
        sendToAi(chunks);
      }
    });

  useEffect(() => {
    audioRef.current = new Audio();
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    if (playAudio) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [playAudio]);

  useEffect(() => {
    if (isRecording) {
      setPlayAudio(false);
      startRecording();
    } else {
      stopRecording();
    }
  }, [isRecording]);

  const toggleNavigation = useUiStore((state) => state.toggleNavigation);

  const sendToAi = async (chunks: BlobPart[]) => {
    if (!apiKey) {
      toast({
        title: 'Error',
        description: 'Please enter a valid API key.',
        variant: 'destructive'
      });
      return;
    }

    setIsAiLoading(true);

    const blob = new Blob(chunks, { type: 'audio/mp3' });
    const audioBase64 = await convertBlobToBase64(blob);
    const text = await transcribeAudio(apiKey, audioBase64);

    let imageBase64;

    switch (pathname) {
      case PATHNAMES.INDEX:
        if (webcam) {
          imageBase64 = webcam.getScreenshot() ?? undefined;
        }
        break;
      case PATHNAMES.TEACH_MODE:
        imageBase64 = whiteBoardImage;
        break;
    }

    const newContent: UserContent = [];

    if (text) {
      newContent.push({
        type: 'text',
        text
      });
    }

    if (imageBase64) {
      newContent.push({
        type: 'image',
        image: imageBase64
      });
    }

    const newHistory: CoreMessage[] = [
      ...history,
      {
        role: 'user',
        content: newContent
      }
    ];

    const response = await getAiResponse(apiKey, newHistory);

    if (!response) {
      setIsAiLoading(false);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
      return;
    }

    const { data } = response;

    setHistory(newHistory);

    switch (data.action) {
      case AiActions.OPEN_MAP:
        const { from, to } = data as OpenMapData;
        if (audioRef.current) {
          audioRef.current.src = `data:audio/mp3;base64,${await textToSpeech(apiKey, 'I open the map for you')}`;
          setPlayAudio(true);
        }

        setIsNavigationOpen(true);
        setNavigationTo(to);
        setNavigationFrom(from ?? undefined);
        break;
      case AiActions.CLOSE_MAP:
        clearNavigation();
        if (audioRef.current) {
          audioRef.current.src = `data:audio/mp3;base64,${await textToSpeech(apiKey, 'I close the map')}`;
        }
        setPlayAudio(true);
        break;
      case AiActions.NONE:
        const otherData = data as OtherData;

        if (otherData.text && audioRef.current) {
          audioRef.current.src = `data:audio/mp3;base64,${await textToSpeech(apiKey, otherData.text)}`;
          setPlayAudio(true);
          setResponse(otherData.text);
        }
        break;
      case AiActions.OPEN_TEACH_MODE:
        textToSpeech(apiKey, 'Opening teach mode').then((res) => {
          if (audioRef.current) {
            audioRef.current.src = `data:audio/mp3;base64,${res}`;
            setPlayAudio(true);
          }
          router.push(PATHNAMES.TEACH_MODE);
        });
        break;
      case AiActions.CLOSE_TEACH_MODE:
        textToSpeech(apiKey, 'Closing teach mode').then((res) => {
          if (audioRef.current) {
            audioRef.current.src = `data:audio/mp3;base64,${res}`;
            setPlayAudio(true);
          }
          router.push(PATHNAMES.INDEX);
        });
        break;
    }

    setIsAiLoading(false);
  };

  const onNavigationClick = async () => {
    toggleNavigation();
  };

  const onTranslateClick = async () => {
    setIsTranslateOpen(!isTranslateOpen);
  };

  return (
    <div className="bottom-3 absolute left-0 right-0 flex flex-col items-center gap-4 justify-center">
      <Subtitles />
      <Card className="flex justify-center gap-2 z-10 p-2 relative px-5">
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
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={onTranslateClick}>
                      <Languages />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Translate</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={onNavigationClick}>
                      <Navigation />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Navigation</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <Music />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Music</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};
