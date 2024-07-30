'use client';

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  Form,
  Input,
  Button,
  DialogClose
} from '@shadcn/index';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { useAiStore } from '@store/ai';
import { useToast } from '@hooks/useToast';

const formSchema = z.object({
  apiKey: z.string()
});

export default function APIKeyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: ''
    }
  });
  const { toast } = useToast();
  const setApiKey = useAiStore((state) => state.setApiKey);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const apiKey = values.apiKey;

    toast({
      description: 'API Key saved'
    });

    if (!apiKey.trim()) {
      toast({
        description: 'API Key cannot be empty'
      });
      return;
    }

    setApiKey(apiKey);
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 flex flex-col items-center gap-2">
          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-4 w-full">
                <FormLabel className="text-xl text-center">
                  Enter your OpenAI API Key
                </FormLabel>
                <FormControl>
                  <Input placeholder="sk-..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogClose asChild>
            <Button type="submit">Save</Button>
          </DialogClose>
        </form>
      </Form>
    </div>
  );
}
