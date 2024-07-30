'use client';

import { useCallback, useEffect, useState } from 'react';
import { AiActions, AiResponseData, OpenMapData } from '@/types/types';
import { DockBar } from '@components/dockBar';
import { MapTab } from '@components/mapTab';
import { Card } from '@/components/shadcn';
import { useMediaStore } from '@store/media-devices';
import { ApiKeyDialog } from '@/components/api-key-dialog';
import Webcam from 'react-webcam';
import { toast } from '@hooks/useToast';

export default function Page() {
  const [showMap, setShowMap] = useState<boolean>(false);
  const [mapDestination, setMapDestination] = useState<string>('');
  const [mapOrigin, setMapOrigin] = useState<string | undefined>('');
  const [aiResponseData, setAiResponseData] = useState<AiResponseData | null>(
    null
  );
  const [isWebcamError, setIsWebcamError] = useState<boolean>(false);

  const webcamRef = useMediaStore((state) => state.ref);
  const videoConstraints = useMediaStore((state) => state.baseVideoConstraints);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      console.log('Esta es la referencia', webcamRef.current);
      const imageSrc = webcamRef.current.getScreenshot();
      console.log(imageSrc);
    }
  }, [webcamRef]);

  useEffect(() => {
    switch (aiResponseData?.action) {
      case AiActions.OPEN_MAP:
        const { from, to } = aiResponseData.data as OpenMapData;
        setShowMap(true);
        setMapDestination(to);
        setMapOrigin(from ?? undefined);
        break;
    }
  }, [aiResponseData]);

  const onCloseMapTab = () => {
    setShowMap(false);
    setMapDestination('');
    setMapOrigin(undefined);
  };

  return (
    <main className="w-full h-full flex p-4">
      {showMap && (
        <MapTab
          destination={mapDestination}
          from={mapOrigin}
          onClose={onCloseMapTab}
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
