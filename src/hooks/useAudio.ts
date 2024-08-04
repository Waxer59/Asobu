import { useEffect, useRef, useState } from 'react';

export const useAudio = () => {
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
  }, []);

  useEffect(() => {
    if (!isAudioPlaying) {
      audioRef.current?.pause();
    }
  }, [isAudioPlaying]);

  const playAudio = (data: string) => {
    if (audioRef.current) {
      audioRef.current.src = data;
      audioRef.current.play();
    }

    setIsAudioPlaying(true);
  };

  const stopAudio = () => {
    setIsAudioPlaying(false);
  };

  return {
    playAudio,
    stopAudio,
    isAudioPlaying
  };
};
