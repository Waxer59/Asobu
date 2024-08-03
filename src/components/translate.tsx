'use client';

import Draggable from 'react-draggable';
import { Button, Card } from './shadcn';
import { ArrowRightLeft, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useUiStore } from '@/store/ui';
import { TranslateLanguage } from './translate-language';
import { toast } from '@hooks/useToast';
import { translateText } from '@/app/actions';
import { useAiStore } from '@/store/ai';
import { useDebounce } from 'use-debounce';

export const Translate = () => {
  const dragRef = useRef(null);
  const apiKey = useAiStore((state) => state.apiKey);
  const languageOne = useUiStore((state) => state.languageOne);
  const languageTwo = useUiStore((state) => state.languageTwo);
  const languageOneText = useUiStore((state) => state.languageOneText);
  const languageTwoText = useUiStore((state) => state.languageTwoText);
  const setLanguageOne = useUiStore((state) => state.setLanguageOne);
  const setLanguageTwo = useUiStore((state) => state.setLanguageTwo);
  const setLanguageOneText = useUiStore((state) => state.setLanguageOneText);
  const setLanguageTwoText = useUiStore((state) => state.setLanguageTwoText);
  const switchLanguages = useUiStore((state) => state.switchLanguages);
  const clearTranslate = useUiStore((state) => state.clearTranslate);

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
