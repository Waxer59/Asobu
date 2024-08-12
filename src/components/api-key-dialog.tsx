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

interface Props {
  goDownInSmallerScreen?: boolean;
}

const defaultProps: Props = {
  goDownInSmallerScreen: true
};

export const ApiKeyDialog: React.FC<Props> = ({
  goDownInSmallerScreen = defaultProps.goDownInSmallerScreen
}) => {
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
    <div
      className={`absolute ${goDownInSmallerScreen ? 'right-2 bottom-16 md:top-6' : 'right-2 top-6'} `}>
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
