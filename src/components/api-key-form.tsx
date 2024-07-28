"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  Form,
} from "@shadcn/form";
import { Input } from "@shadcn/input";
import { Button } from "@shadcn/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAiStore } from "@store/ai";
import { DialogClose } from "./shadcn/dialog";
import { useToast } from "@/hooks/useToast";

const formSchema = z.object({
  apiKey: z.string(),
});

export default function APIKeyForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: "",
    },
  });
  const { toast } = useToast();
  const setApiKey = useAiStore((state) => state.setApiKey);
  const apiKey = useAiStore((state) => state.apiKey);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const apiKey = values.apiKey;

    toast({
      description: "Se guardó la API Key",
    });

    if (!apiKey.trim()) {
      // TODO: SHOW ERROR TOAST
      toast({
        description: "La API Key no puede estar vacía",
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
          className="space-y-8 flex flex-col gap-2"
        >
          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-4">
                <FormLabel className="text-xl text-center">
                  Ingresa tu API Key
                </FormLabel>
                <FormControl>
                  <Input placeholder="sk-..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogClose>
            <Button type="submit">Enviar</Button>
          </DialogClose>
        </form>
      </Form>
    </div>
  );
}
