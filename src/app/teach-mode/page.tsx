'use client';

import {
  Excalidraw,
  exportToBlob,
  useHandleLibrary
} from '@excalidraw/excalidraw';
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import { useState } from 'react';
import { DockBar } from '@components/dockBar';
import { Card } from '@shadcn/index';
import { ApiKeyDialog } from '@components/api-key-dialog';

export default function Page() {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  useHandleLibrary({ excalidrawAPI });

  const getWhiteBoardImageBlob = async (): Promise<Blob | null> => {
    if (!excalidrawAPI) return null;

    const blob = await exportToBlob({
      elements: excalidrawAPI.getSceneElements(),
      mimeType: 'image/png',
      files: excalidrawAPI.getFiles()
    });

    return blob;
  };

  return (
    <div className="flex justify-center items-center mt-6">
      <DockBar />
      <ApiKeyDialog />
      <Card className="max-w-[1500px] w-[90%] h-[800px] p-3">
        <Excalidraw
          theme="dark"
          excalidrawAPI={(api: ExcalidrawImperativeAPI) =>
            setExcalidrawAPI(api)
          }
        />
      </Card>
    </div>
  );
}
