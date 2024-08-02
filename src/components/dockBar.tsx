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
  Wrench,
  Camera
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Subtitles } from './subtitles';
import { toast } from '@hooks/useToast';
import { getAiResponse, textToSpeech, transcribeAudio } from '@/app/actions';
import { useAiStore } from '@store/ai';
import { useUiStore } from '@store/ui';
import { convertBlobToBase64 } from '@lib/utils';
import { useMediaStore } from '@/store/media-devices';
import { OtherData } from '@/types/types';

import { useCallback, useEffect, useState } from 'react';
import { useMediaStore } from '@store/media-devices';
import { AiResponseData, AiRequestData } from '@/types/types';
import { getAiResponse } from '@/app/actions';
import { useAiStore } from '@/store/ai';

export const DockBar = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const apiKey = useAiStore((state) => state.apiKey);
  const setIsAiLoading = useAiStore((state) => state.setIsAiLoading);
  const setResponse = useAiStore((state) => state.setResponse);
  const webcam = useMediaStore((state) => state.webcam);

  useEffect(() => {
    startRecording();
  }, [isRecording]);

  const toggleNavigation = useUiStore((state) => state.toggleNavigation);

  const getUserMicrophone = async (): Promise<MediaStream | null> => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      return await navigator.mediaDevices.getUserMedia({ audio: true });
    }

    toast({
      title: 'Error',
      description: 'Your browser does not support microphone access.',
      variant: 'destructive'
    });

    return null;
  };

  const startRecording = async () => {
    const mic = await getUserMicrophone();

    if (!isRecording || !mic) {
      if (mediaRecorder.current) {
        mediaRecorder.current.stop();
      }

      return;
    }

    setIsAiLoading(false);

    const chunks: BlobPart[] = [];

    mediaRecorder.current = new MediaRecorder(mic);
    mediaRecorder.current.start();

    mediaRecorder.current.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    mediaRecorder.current.onstop = async (e) => {
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

      if (webcam) {
        imageBase64 = webcam.getScreenshot() ?? undefined;
      }

      const { data } = await getAiResponse(apiKey, {
        message: text ?? '',
        img: imageBase64
      });

      const otherData = data as OtherData;

      if (otherData.text) {
        const base64Audio = await textToSpeech(apiKey, otherData.text);

        const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);

        audio.play();

        setResponse(otherData.text);
      }

      setIsAiLoading(false);
    };
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
