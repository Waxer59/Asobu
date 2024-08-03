import { getUserMicrophone } from '@helpers/getUserMicrophone';
import { useEffect, useState } from 'react';
import { toast } from './useToast';
import hark, { Harker } from 'hark';

interface UseMicrophoneProps {
  onGetChunks: (chunks: BlobPart[]) => void;
}

export const useMicrophone = ({ onGetChunks }: UseMicrophoneProps) => {
  const [chunks, setChunks] = useState<BlobPart[]>([]);
  const [mic, setMic] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [isRecording, setIsRecording] = useState<boolean>(false);

  useEffect(() => {
    getMic();
  }, []);

  useEffect(() => {
    if (!mic) return;

    setMediaRecorder(new MediaRecorder(mic));
  }, [mic]);

  useEffect(() => {
    if (!chunks.length) return;
    onGetChunks(chunks);
    setChunks([]);
  }, [chunks]);

  useEffect(() => {
    if (!mediaRecorder) return;

    mediaRecorder.ondataavailable = (e) => {
      setChunks((prev) => [...prev, e.data]);
    };

    mediaRecorder.onstart = () => {
      setIsRecording(true);
    };

    mediaRecorder.onstop = () => {
      setIsRecording(false);
    };
  }, [mediaRecorder]);

  useEffect(() => {
    if (!mic || !mediaRecorder) return;

    const harkValue: Harker = hark(mic);
    harkValue.on('stopped_speaking', () => {
      mediaRecorder.stop();
    });

    return () => {
      harkValue?.stop();
    };
  }, [mediaRecorder, mic]);

  const getMic = async () => {
    const mic = await getUserMicrophone();

    if (!mic) {
      toast({
        title: 'Error',
        description: 'Your browser does not support microphone access.',
        variant: 'destructive'
      });
      return;
    }

    setMic(mic);
  };

  const startRecording = () => {
    if (!mic || !mediaRecorder) {
      toast({
        title: 'Error',
        description: 'Please allow microphone access.',
        variant: 'destructive'
      });
      return;
    }

    mediaRecorder.start();
  };

  const alternateRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
    setIsRecording(!isRecording);
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setIsRecording(false);
  };

  return {
    startRecording,
    stopRecording,
    isRecording,
    alternateRecording
  };
};
