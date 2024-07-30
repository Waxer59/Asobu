'use client';

import ChatList from './[[...chatId]]/chat-list';
import { useEffect, useState } from 'react';
import { ApiKeyDialog } from '@components/api-key-dialog';
import { AiActions, AiResponseData, OpenMapData } from '@/types/types';
import { MapTab } from '@components/mapTab';
import ChatContent from './[[...chatId]]/chat-content';
import { DockBar } from '@/components/dockBar';

export default function Page() {
  const [showMap, setShowMap] = useState<boolean>(false);
  const [mapDestination, setMapDestination] = useState<string>('');
  const [mapOrigin, setMapOrigin] = useState<string | undefined>('');
  const [aiResponseData, setAiResponseData] = useState<AiResponseData | null>(
    null
  );

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
    <main className="w-full h-full flex">
      {showMap && (
        <MapTab
          destination={mapDestination}
          from={mapOrigin}
          onClose={onCloseMapTab}
        />
      )}
      <div className="w-80 h-full max-h-full border-r-2 border-neutral-300 dark:border-neutral-700 overflow-auto">
        <ChatList />
      </div>
      <div className="h-full flex-1 flex flex-col">
        <ApiKeyDialog />
        <ChatContent />
      </div>
      <DockBar />
    </main>
  );
}
