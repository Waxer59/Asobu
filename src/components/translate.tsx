'use client';

import Draggable from 'react-draggable';
import { Button, Card } from './shadcn';
import { ArrowRightLeft, X } from 'lucide-react';
import { useRef } from 'react';
import { TranslateLanguage } from './translate-language';
import { toast } from '@hooks/useToast';
import { translateText } from '@/app/actions';
import { useAiStore } from '@/store/ai';
import { useTranslatorStore, useUiStore } from '@/store';

export const Translate = () => {
  const dragRef = useRef(null);
  const setIsTranslateOpen = useUiStore((state) => state.setIsTranslateOpen);
  const apiKey = useAiStore((state) => state.apiKey);
  const languageOne = useTranslatorStore((state) => state.languageOne);
  const languageTwo = useTranslatorStore((state) => state.languageTwo);
  const languageOneText = useTranslatorStore((state) => state.languageOneText);
  const languageTwoText = useTranslatorStore((state) => state.languageTwoText);
  const setLanguageOne = useTranslatorStore((state) => state.setLanguageOne);
  const setLanguageTwo = useTranslatorStore((state) => state.setLanguageTwo);
  const setLanguageOneText = useTranslatorStore(
    (state) => state.setLanguageOneText
  );
  const setLanguageTwoText = useTranslatorStore(
    (state) => state.setLanguageTwoText
  );
  const switchLanguages = useTranslatorStore((state) => state.switchLanguages);
  const clearTranslate = useTranslatorStore((state) => state.clear);

  const startTranslation = async (
    textToTranslate: string,
    languageFrom: string,
    languageTo: string
  ) => {
    if (!apiKey) {
      toast({
        title: 'Error',
        description: 'Please enter a valid API key.',
        variant: 'destructive'
      });
      return;
    }

    const translatedText = await translateText(
      apiKey,
      textToTranslate,
      languageFrom,
      languageTo
    );

    return translatedText;
  };

  const onClose = () => {
    setIsTranslateOpen(false);
    clearTranslate();
  };

  const onSwitchLanguages = () => {
    if (languageOne && languageTwo) {
      switchLanguages();
    } else {
      toast({
        title: 'Error',
        description: 'Please select a language.',
        variant: 'destructive'
      });
    }
  };

  const onTranslationOneText = (value: string) => {
    if (!value) {
      setLanguageTwoText('');
      return;
    }

    setLanguageOneText(value);
    onTranslateTextChange(true, value);
  };

  const onTranslationTwoText = (value: string) => {
    if (!value) {
      setLanguageOneText('');
      return;
    }

    setLanguageTwoText(value);
    onTranslateTextChange(false, value);
  };

  const onChangeLanguageOne = (value: string) => {
    setLanguageOne(value);
  };

  const onChangeLanguageTwo = (value: string) => {
    setLanguageTwo(value);
  };

  const onTranslateTextChange = async (
    isTranslatingLanguageOne: boolean,
    text: string
  ) => {
    const haveBothLanguagesSelected = languageOne && languageTwo;

    if (!haveBothLanguagesSelected) {
      toast({
        title: 'Error',
        description: 'Please select a language.',
        variant: 'destructive'
      });
      return;
    }

    let translatedText;

    if (isTranslatingLanguageOne) {
      translatedText = await startTranslation(text, languageOne, languageTwo);
    } else {
      translatedText = await startTranslation(text, languageTwo, languageOne);
    }

    if (!translatedText) {
      toast({
        title: 'Error',
        description: 'Please try again later.',
        variant: 'destructive'
      });
      return;
    }

    if (isTranslatingLanguageOne) {
      setLanguageTwoText(translatedText);
    } else {
      setLanguageOneText(translatedText);
    }
  };

  return (
    <Draggable nodeRef={dragRef} bounds="parent" cancel=".translate-element">
      <div ref={dragRef} className="absolute z-50 top-0">
        <Card className="cursor-move p-7 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 w-5 h-5"
            onClick={onClose}>
            <X />
          </Button>

          <TranslateLanguage
            onSelectValueChange={onChangeLanguageOne}
            selectValue={languageOne}
            onTranslationTextChange={onTranslationOneText}
            translationText={languageOneText}
          />

          <div className="flex flex-col items-center gap-2">
            <Button size="icon" variant="ghost" onClick={onSwitchLanguages}>
              <ArrowRightLeft />
            </Button>
            <div className="h-60 w-[1px] bg-zinc-500"></div>
          </div>

          <TranslateLanguage
            onSelectValueChange={onChangeLanguageTwo}
            selectValue={languageTwo}
            onTranslationTextChange={onTranslationTwoText}
            translationText={languageTwoText}
          />
        </Card>
      </div>
    </Draggable>
  );
};
