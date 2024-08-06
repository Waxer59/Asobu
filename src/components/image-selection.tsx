import { Paperclip } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@shadcn/button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from './shadcn/tooltip';
import { toast } from '@hooks/useToast';
import { MB_IN_BYTES } from '@constants';

export default function ImageSelection({
  selectedImage,
  setSelectedImage
}: {
  selectedImage: File | undefined;
  setSelectedImage: (file: File | undefined) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (selectedImage) {
      const objectUrl = URL.createObjectURL(selectedImage);
      setPreview(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
    setPreview(undefined);
  }, [selectedImage]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file && file.size > MB_IN_BYTES) {
      toast({
        title: 'Error',
        description: 'File size too large',
        variant: 'destructive'
      });
      return;
    }

    setSelectedImage(file);
  };

  const onAttachMediaClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setSelectedImage(undefined);
  };

  return (
    <div className="container mx-auto p-4 pr-5">
      <label className="flex absolute -left-4 -bottom-1 mx-7 mb-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onAttachMediaClick}
                type="button">
                <Paperclip />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Attach image</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <input
          ref={fileInputRef}
          className="bg-transparent flex-1 border-none outline-none hidden"
          name="media"
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleImageChange}
        />
      </label>
      {preview && (
        <div className="w-full p-2">
          <img
            src={preview}
            alt="Selected"
            className="object-cover w-32 h-32"
          />
          <button
            onClick={handleRemoveImage}
            type="button"
            className="px-4 py-2 text-white bg-red-500 hover:bg-red-700 rounded mt-2">
            Remove Image
          </button>
        </div>
      )}
    </div>
  );
}
