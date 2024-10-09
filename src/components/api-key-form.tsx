import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAiStore } from '@store/ai';
import { useForm } from 'react-hook-form';
import { useToast } from '@hooks/useToast';
import { useEffect } from 'react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@shadcn/form';
import { Input } from '@shadcn/input';
import { Button } from '@shadcn/button';
import { DialogClose } from '@shadcn/dialog';

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
  const apiKey = useAiStore((state) => state.apiKey);

  useEffect(() => {
    if (apiKey) {
      form.setValue('apiKey', apiKey);
    }
  }, [apiKey, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const apiKeyInputValue = values.apiKey;

    toast({
      description: 'API Key saved'
    });

    if (!apiKeyInputValue.trim()) {
      toast({
        description: 'API Key cannot be empty'
      });
      return;
    }

    setApiKey(apiKeyInputValue);
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
                  <Input placeholder="sk-..." {...field} type="password" />
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
