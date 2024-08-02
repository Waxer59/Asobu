'use client';

import {
  Excalidraw,
  exportToBlob,
  useHandleLibrary
} from '@excalidraw/excalidraw';
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import { useState } from 'react';

const ExcalidrawWrapper = () => {
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

  return <Excalidraw theme="dark" excalidrawAPI={setExcalidrawAPI} />;
};

export default ExcalidrawWrapper;
