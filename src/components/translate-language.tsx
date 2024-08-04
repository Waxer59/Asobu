'use client';

import { Mic, Volume2 } from 'lucide-react';

import { TRANSLATE_LANGUAGES } from '@constants';
import { useEffect, useState } from 'react';
import { useAiStore } from '@/store/ai';
import { textToSpeech, transcribeAudio } from '@/app/actions';
import { useDebounce } from 'use-debounce';
import { convertBlobToBase64 } from '@lib/utils';
import { useAudio } from '@/hooks/useAudio';
import { useMicrophone } from '@/hooks/useMicrophone';
import { toast } from '@/hooks/useToast';
import { Button } from '@shadcn/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@shadcn/select';
import { Textarea } from '@shadcn/textarea';

interface Props {
  onSelectValueChange: (value: string) => void;
  onTranslationTextChange: (value: string) => void;
  translationText: string;
  selectValue?: string | null;
}

export const TranslateLanguage = ({
  onSelectValueChange,
  selectValue,
  onTranslationTextChange,
  translationText
}: Props) => {
  const apiKey = useAiStore((state) => state.apiKey);
  const [text, setText] = useState<string>(translationText);
  const [debouncedText] = useDebounce(text, 1000);
  const { isRecording, alternateRecording } = useMicrophone({
    onGetChunks: (chunks) => {
      translateAudio(chunks);
    }
  });
  const { playAudio, stopAudio } = useAudio();

  useEffect(() => {
    if (translationText === debouncedText) return;

    onTranslationTextChange(debouncedText);
  }, [debouncedText]);

  useEffect(() => {
    if (text.trim() === '') {
      onTranslationTextChange('');
    }
  }, [text]);

  useEffect(() => {
    setText(translationText);
  }, [translationText]);

  const translateAudio = async (chunks: BlobPart[]) => {
    if (!apiKey) {
      toast({
        title: 'Error',
        description: 'Please enter a valid API key',
        variant: 'destructive'
      });
      return;
    }

    const blob = new Blob(chunks, { type: 'audio/mp3' });
    const audioBase64 = await convertBlobToBase64(blob);
    const transcribedText = await transcribeAudio(apiKey, audioBase64);

    if (!transcribedText) {
      return;
    }

    onTranslationTextChange(transcribedText);
  };

  const onReproduceAudio = async () => {
    if (!apiKey) {
      toast({
        title: 'Error',
        description: 'Please enter a valid API key',
        variant: 'destructive'
      });
      return;
    }

    const audioBase64 = await textToSpeech(apiKey, translationText);

    playAudio(`data:audio/mp3;base64,${audioBase64}`);
  };

  return (
    <div className="flex flex-col gap-2 items-cente translate-element">
      <Select onValueChange={onSelectValueChange} value={selectValue ?? ''}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Translate" />
        </SelectTrigger>
        <SelectContent>
          {TRANSLATE_LANGUAGES.map((lang) => (
            <SelectItem key={lang} value={lang}>
              {lang}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Textarea
        className="w-64 h-48 min-h-48 max-h-48 resize-none"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      <div className="flex items-center gap-4 justify-start">
        <Button
          size="icon"
          variant={isRecording ? 'default' : 'outline'}
          className="rounded-full"
          onClick={alternateRecording}>
          <Mic />
        </Button>
        <Button size="icon" variant="ghost" onClick={onReproduceAudio}>
          <Volume2 />
        </Button>
      </div>
    </div>
  );
};
