'use client';

import { useEffect, useRef, useState } from 'react';
import { Card } from '@components/shadcn';
import { useMediaStore } from '@store/media-devices';
import Webcam from 'react-webcam';
import { toast } from '@hooks/useToast';
import { SessionProvider } from 'next-auth/react';
import SpotifyWidget from '@components/spotify-widget';
import { DockBar } from '@/components/dockBar';
import { ApiKeyDialog } from '@/components/api-key-dialog';
import { Tools } from '@/components/tools';

export default function Page() {
  const [isWebcamError, setIsWebcamError] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);
  const setWebcam = useMediaStore((state) => state.setWebcam);
  const videoConstraints = useMediaStore((state) => state.baseVideoConstraints);

  useEffect(() => {
    if (webcamRef.current) {
      setWebcam(webcamRef.current);
    }
  }, [webcamRef]);

  return (
    <SessionProvider>
      <main className="w-full h-full flex p-4">
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
        <SpotifyWidget />
      </main>
      <DockBar />
      <ApiKeyDialog />
      <Tools />
    </SessionProvider>
  );
}
