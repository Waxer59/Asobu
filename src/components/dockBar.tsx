'use client';

import { Card } from '@shadcn/card';
import { useEffect } from 'react';
import { Subtitles } from './subtitles';
import { useMicrophone, useAudio, useSendToAi } from '@hooks';
import { DockbarTools } from './dockbarTools';
import { DockbarNavigation } from './dockbarNavigation';
import { useAiStore, useUiStore } from '@/store';

export const DockBar = () => {
  const { isSubtitlesOpen } = useUiStore();
  const { isRecording, alternateRecording } = useMicrophone({
    onGetChunks: (chunks) => {
      sendToAi(chunks);
    }
  });
  const { playAudio, stopAudio } = useAudio();
  const apiKey = useAiStore((state) => state.apiKey);
  const { sendToAi } = useSendToAi({
    apiKey,
    playAudio
  });

  useEffect(() => {
    if (isRecording) {
      stopAudio();
    }
  }, [isRecording]);

  return (
    <div className="bottom-3 absolute left-0 right-0 flex flex-col items-center gap-4 justify-center">
      {isSubtitlesOpen && <Subtitles />}
      <Card className="flex justify-center gap-2 z-10 p-2 relative px-5">
        <DockbarNavigation
          alternateRecording={alternateRecording}
          isRecording={isRecording}
        />
        <DockbarTools />
      </Card>
    </div>
  );
};
