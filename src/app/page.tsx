'use client';

import { useEffect, useRef, useState } from 'react';
import { DockBar } from '@components/dockBar';
import { Navigation } from '@components/navigation';
import { Card } from '@components/shadcn';
import { useMediaStore } from '@store/media-devices';
import { ApiKeyDialog } from '@components/api-key-dialog';
import Webcam from 'react-webcam';
import { toast } from '@hooks/useToast';
import { useUiStore } from '@/store/ui';

export default function Page() {
  const [isWebcamError, setIsWebcamError] = useState<boolean>(false);
  const navigationFrom = useUiStore((state) => state.navigationFrom);
  const navigationTo = useUiStore((state) => state.navigationTo);
  const isNavigationOpen = useUiStore((state) => state.isNavigationOpen);
  const clearNavigation = useUiStore((state) => state.clearNavigation);
  const webcamRef = useRef<Webcam>(null);
  const setWebcam = useMediaStore((state) => state.setWebcam);
  const videoConstraints = useMediaStore((state) => state.baseVideoConstraints);

  useEffect(() => {
    if (webcamRef.current) {
      setWebcam(webcamRef.current);
    }
  }, [webcamRef]);

  const onCloseNavigation = () => {
    clearNavigation();
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
