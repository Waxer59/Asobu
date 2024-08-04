'use client';

import { Card } from '@shadcn/card';
import { useEffect } from 'react';
import { Subtitles } from './subtitles';
import { DockbarTools } from './dockbarTools';
import { DockbarNavigation } from './dockbarNavigation';
import { convertBlobToBase64 } from '@/lib/utils';
import { transcribeAudio } from '@/app/actions';
import { useAudio } from '@hooks/useAudio';
import { useMicrophone } from '@hooks/useMicrophone';
import { useSendToAi } from '@hooks/useSendToAi';
import { toast } from '@hooks/useToast';
import { useAiStore } from '@store/ai';
import { useUiStore } from '@store/ui';

export const DockBar = () => {
  const { isSubtitlesOpen } = useUiStore();
  const apiKey = useAiStore((state) => state.apiKey);
  const { isRecording, alternateRecording } = useMicrophone({
    onGetChunks: async (chunks) => {
      const blob = new Blob(chunks, { type: 'audio/mp3' });
      const audioBase64 = await convertBlobToBase64(blob);

      if (!apiKey) {
        toast({
          title: 'Error',
          description: 'Please enter a valid API key.',
          variant: 'destructive'
        });
        return;
      }

      const text = await transcribeAudio(apiKey, audioBase64);

      if (!text) {
        toast({
          title: 'Error',
          description: 'Could not transcribe audio.',
          variant: 'destructive'
        });
        return;
      }

      sendToAi(text);
    }
  });

  const { playAudio, stopAudio } = useAudio();
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
