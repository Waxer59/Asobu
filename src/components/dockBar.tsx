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

import { useCallback, useEffect, useState } from 'react';
import { useMediaStore } from '@store/media-devices';
import { AiResponseData, AiRequestData } from '@/types/types';
import { getAiResponse } from '@/app/actions';
import { useAiStore } from '@/store/ai';

export const DockBar = () => {
  const [aiResponseData, setAiResponseData] = useState<AiResponseData | null>(
    null
  );
  const [imageRef, setImageRef] = useState<string | null>(null);

  const webcamRef = useMediaStore((state) => state.ref);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      useMediaStore.setState({ CapturedImage: imageSrc });
      setImageRef(imageSrc);
    }
  }, [webcamRef]);

  const handleRequest = async () => {
    const encodedImage = useMediaStore.getState().CapturedImage;
    const ApiKey = useAiStore.getState().apiKey;

    const data: AiRequestData = {
      message: 'Analyze this image',
      img: encodedImage as string
    };
    try {
      const res = await getAiResponse(ApiKey as string, data);
      console.log(res);
      setAiResponseData(res);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!useMediaStore.getState().CapturedImage)
      console.log('no se ejecuto el efecto');
    if (useMediaStore.getState().CapturedImage) {
      console.log('se ejecuto el efecto');
      handleRequest();
      console.log(aiResponseData);
    }
  }, [imageRef]);

  return (
    <div className="bottom-3 absolute left-0 right-0 flex items-center gap-4 justify-center">
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
              <Button size="icon" variant="secondary" className="rounded-full">
                <Mic className="stroke-1" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Talk to the AI</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full"
                onClick={capture}>
                <Camera className="stroke-1" />
                <TooltipContent>Camera</TooltipContent>
              </Button>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/teach-mode"
                className={buttonVariants({ variant: 'ghost', size: 'icon' })}>
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
