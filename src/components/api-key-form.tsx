"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  Form,
} from "@/components/form";
import { Input } from "./input";
import { Button } from "./button";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useStore } from "@/store/ai";

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

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    useStore.getState().setApiKey(values.apiKey);

    //sanity check
    console.log(useStore.getState().apiKey);

    //After setting the API key, we hide the top layer
    if (useStore.getState().apiKey) {
      const modal = document.getElementById("modal-1");
      if (modal) {
        modal.style.display = "none";
      }
    }
  }

  return (
    <div id="modal-1" className="grid h-screen place-items-center">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ingresa tu API Key</FormLabel>
                <FormControl>
                  <Input
                    placeholder="shadcn"
                    {...field}
                    className="text-black"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant={"outline"}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
