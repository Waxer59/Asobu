'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger
} from '@shadcn/dialog';
import { Key } from 'lucide-react';
import APIKeyForm from './api-key-form';
import { Button } from '@shadcn/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@shadcn/tooltip';
import { useToast } from '@hooks/useToast';
import { useAiStore } from '@store/ai';
import { useEffect, useState } from 'react';

export const ApiKeyDialog = () => {
  // Let the user know with a toast to add API Key
  const { toast } = useToast();
  const apiKey = useAiStore((state) => state.apiKey);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // We need to add this state to ensure that the toast system is initialized.
    // https://github.com/shadcn-ui/ui/issues/1674
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!apiKey) {
      toast({
        description: 'Please add your OpenAI API Key'
      });
    }
  }, [mounted]);

  return (
    <div className="absolute bottom-16 right-2 z-10 md:top-6">
      <Dialog>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Key />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>OpenAI API Key</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DialogContent>
          <DialogDescription></DialogDescription>
          <DialogTitle></DialogTitle>
          <APIKeyForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};
