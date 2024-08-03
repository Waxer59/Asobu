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
import { useEffect, useState } from 'react';
import { Subtitles } from './subtitles';
import { toast } from '@hooks/useToast';
import { getAiResponse, textToSpeech, transcribeAudio } from '@/app/actions';
import { useAiStore } from '@store/ai';
import { useUiStore } from '@store/ui';
import { convertBlobToBase64 } from '@lib/utils';
import { useMediaStore } from '@/store/media-devices';
import { OtherData } from '@/types/types';
import { useSpotifyStore } from '@/store/spotify';
import { usePathname } from 'next/navigation';
import { PATHNAMES } from '@/constants/constants';
import { CoreMessage, UserContent } from 'ai';
import hark, { Harker } from 'hark';

export const DockBar = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const apiKey = useAiStore((state) => state.apiKey);
  const setIsAiLoading = useAiStore((state) => state.setIsAiLoading);
  const history = useAiStore((state) => state.history);
  const setHistory = useAiStore((state) => state.setHistory);
  const setResponse = useAiStore((state) => state.setResponse);
  const webcam = useMediaStore((state) => state.webcam);
  const whiteBoardImage = useUiStore((state) => state.whiteBoardImage);
  const pathname = usePathname();
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [chunks, setChunks] = useState<BlobPart[]>([]);
  const [mic, setMic] = useState<MediaStream | null>(null);

  useEffect(() => {
    getUserMicrophone();
  }, []);

  useEffect(() => {
    if (!mic) return;

    setMediaRecorder(new MediaRecorder(mic));
  }, [mic]);

  useEffect(() => {
    if (!chunks.length) return;
    sendToAi(chunks);
    setChunks([]);
  }, [chunks]);

  useEffect(() => {
    if (!mediaRecorder) return;

    mediaRecorder.ondataavailable = (e) => {
      setChunks((prev) => [...prev, e.data]);
    };
  }, [mediaRecorder]);

  useEffect(() => {
    if (!mic || !mediaRecorder) return;

    const harkValue: Harker = hark(mic);
    harkValue.on('stopped_speaking', () => {
      mediaRecorder.stop();
    });

    return () => {
      harkValue?.stop();
    };
  }, [mediaRecorder, mic]);

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      mediaRecorder?.stop();
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

    setIsRecording(false);
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

    const otherData = data;
    //Refactor this to use a switch statement
    useSpotifyStore.setState({ spotifyQuery: text });
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

    const { data } = await getAiResponse(apiKey, newHistory);

    setHistory(newHistory);

    const otherData = data as OtherData;

    if (otherData.text) {
      const base64Audio = await textToSpeech(apiKey, otherData.text);

      const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);

      audio.play();

      setResponse(otherData.text);
    }

    setIsAiLoading(false);
  };

  const getUserMicrophone = async (): Promise<void> => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setMic(
        await navigator.mediaDevices.getUserMedia({
          audio: true
        })
      );
    } else {
      toast({
        title: 'Error',
        description: 'Your browser does not support microphone access.',
        variant: 'destructive'
      });
    }
  };

  const startRecording = async () => {
    if (!mic || !mediaRecorder) {
      toast({
        title: 'Error',
        description: 'Please allow microphone access.',
        variant: 'destructive'
      });
      return;
    }

    mediaRecorder.start();
  };

  const onNavigationClick = async () => {
    toggleNavigation();
  };

  const onMicrophoneClick = async () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="bottom-3 absolute left-0 right-0 flex flex-col items-center gap-4 justify-center">
      <Subtitles />
      <Card className="flex justify-center gap-2 z-10 p-2 relative px-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
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
                href="/chat"
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
                onClick={onMicrophoneClick}>
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
                href="/teach-mode"
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
                    <Button size="icon" variant="ghost">
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
