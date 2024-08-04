'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@shadcn';
import { useMediaStore } from '@store/media-devices';
import { toast } from '@hooks/useToast';
import { SwitchCamera } from 'lucide-react';
import Webcam from 'react-webcam';

export default function Page() {
  const [isWebcamError, setIsWebcamError] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);
  const setWebcam = useMediaStore((state) => state.setWebcam);
  const videoConstraints = useMediaStore((state) => state.baseVideoConstraints);
  const flipCamera = useMediaStore((state) => state.flipCamera);

  const onFlipCameraClick = () => {
    flipCamera();
  };

  useEffect(() => {
    if (webcamRef.current) {
      setWebcam(webcamRef.current);
    }
  }, [webcamRef]);

  return (
    <main className="w-full h-full flex p-4">
      <Card className="mx-auto p-2 h-[800px] w-[650px] relative">
        {isWebcamError && (
          <div className="w-full h-full flex items-center justify-center bg-zinc-900/50 rounded-md">
            <p>Error accessing camera</p>
          </div>
        )}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onFlipCameraClick}
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 z-10">
                <SwitchCamera />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Switch Camera</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          onUserMediaError={() => {
            setIsWebcamError(true);
            toast({
              variant: 'destructive',
              description: 'Error accessing camera'
            });
          }}
          className="rounded-md h-full"
        />
      </Card>
    </main>
  );
}
