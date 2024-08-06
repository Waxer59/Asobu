'use client';

import { useState } from 'react';
import GrowingTextArea from '@components/grow-text-area';
import ImageSelection from '@components/image-selection';
import { ArrowUp } from 'lucide-react';
import { Button } from '@shadcn/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@shadcn/tooltip';
import { BeatLoader } from 'react-spinners';

interface Props {
  onSubmit?: (value: string, file?: File) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSubmit, isLoading }: Props) {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | undefined>(
    undefined
  );

  const submit = (value: string) => {
    onSubmit?.(value, selectedImage);
    setContent('');
    setSelectedImage(undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(content);
  };

  const buttonDisabled = content.trim().length === 0 || isLoading;

  return (
    <div className="absolute bottom-24 w-full flex flex-col items-center">
      {isLoading && (
        <div className="absolute bg-secondary p-2 rounded">
          <BeatLoader color="#f2f2f2" size={10} />
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="w-[90%] flex flex-col gap-y-4 relative max-w-4xl mx-auto">
        <ImageSelection
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
        <GrowingTextArea
          className="w-full bg-transparent border border-gray-500 rounded-2xl outline-none resize-none pl-12 pr-14 py-4 scrollbar-content overflow-hidden overscroll-contain"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                type="submit"
                className="rounded-xl flex absolute -right-4 bottom-0 p-1 mr-7 mb-2 z-10"
                disabled={buttonDisabled}>
                <ArrowUp />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Submit</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </form>
    </div>
  );
}
