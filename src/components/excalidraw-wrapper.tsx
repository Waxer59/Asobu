'use client';

import { convertBlobToBase64 } from '@lib/utils';
import { useUiStore } from '@store/ui';
import {
  Excalidraw,
  exportToBlob,
  useHandleLibrary
} from '@excalidraw/excalidraw';
import { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';
import { useEffect, useState } from 'react';

const ExcalidrawWrapper = () => {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);
  const setWhiteBoardImage = useUiStore((state) => state.setWhiteBoardImage);

  useHandleLibrary({ excalidrawAPI });

  useEffect(() => {
    if (!excalidrawAPI) return;

    excalidrawAPI.onPointerUp(async () => {
      const blob = await getWhiteBoardImageBlob();

      if (!blob) return;

      const base64 = await convertBlobToBase64(blob);
      setWhiteBoardImage(base64);
    });
  }, [excalidrawAPI]);

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
