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
import { transcribeAudio } from '@/app/actions';
import { useAiStore } from '@/store/ai';
import { convertBlobToBase64 } from '@/lib/utils';

export const DockBar = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const apiKey = useAiStore((state) => state.apiKey);

  useEffect(() => {
    record();
  }, [isRecording]);

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

  const record = async () => {
    const mic = await getUserMicrophone();

    if (!isRecording || !mic) {
      if (mediaRecorder.current) {
        mediaRecorder.current.stop();
      }

      return;
    }

    const chunks: BlobPart[] = [];

    mediaRecorder.current = new MediaRecorder(mic);
    console.log('Recording...');
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

      const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
      const audioBase64 = await convertBlobToBase64(blob);
      const text = await transcribeAudio(apiKey, audioBase64);
      console.log(text);
    };
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
                    <Button size="icon" variant="ghost">
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
