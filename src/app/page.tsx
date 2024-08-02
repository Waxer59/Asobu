'use client';

import { useEffect, useRef, useState } from 'react';
import { AiActions, AiResponseData, OpenMapData } from '@/types/types';
import { DockBar } from '@components/dockBar';
import { Navigation } from '@components/navigation';
import { Card } from '@components/shadcn';
import { useMediaStore } from '@store/media-devices';
import { ApiKeyDialog } from '@components/api-key-dialog';
import Webcam from 'react-webcam';
import { toast } from '@hooks/useToast';
import { useUiStore } from '@/store/ui';

export default function Page() {
  const [aiResponseData, setAiResponseData] = useState<AiResponseData | null>(
    null
  );
  const [isWebcamError, setIsWebcamError] = useState<boolean>(false);
  const navigationFrom = useUiStore((state) => state.navigationFrom);
  const setNavigationFrom = useUiStore((state) => state.setNavigationFrom);
  const navigationTo = useUiStore((state) => state.navigationTo);
  const setNavigationTo = useUiStore((state) => state.setNavigationTo);
  const isNavigationOpen = useUiStore((state) => state.isNavigationOpen);
  const setIsNavigationOpen = useUiStore((state) => state.setIsNavigationOpen);

  const webcamRef = useRef<Webcam>(null);
  const setWebcam = useMediaStore((state) => state.setWebcam);
  const videoConstraints = useMediaStore((state) => state.baseVideoConstraints);

  useEffect(() => {
    if (webcamRef.current) {
      setWebcam(webcamRef.current);
    }
  }, [webcamRef]);

  useEffect(() => {
    switch (aiResponseData?.action) {
      case AiActions.OPEN_MAP:
        const { from, to } = aiResponseData.data as OpenMapData;
        setIsNavigationOpen(true);
        setNavigationTo(to);
        setNavigationFrom(from ?? undefined);
        break;
    }
  }, [aiResponseData]);

  const onCloseNavigation = () => {
    setIsNavigationOpen(false);
    setNavigationTo('');
    setNavigationFrom(undefined);
  };

  return (
    <main className="w-full h-full flex p-4">
      {isNavigationOpen && (
        <Navigation
          destination={navigationTo}
          from={navigationFrom}
          onClose={onCloseNavigation}
        />
      )}
      <Card className="mx-auto p-2 h-[800px] w-[650px]">
        {isWebcamError && (
          <div className="w-full h-full flex items-center justify-center bg-zinc-900/50 rounded-md">
            <p>Error accessing camera</p>
          </div>
        )}
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
      <ApiKeyDialog />
      <DockBar />
    </main>
  );
}
