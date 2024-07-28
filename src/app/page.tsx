"use client";

import APIKeyForm from "@/components/api-key-form";
import ChatContent from "./[[...chatId]]/chat-content";
import ChatList from "./[[...chatId]]/chat-list";
import { useAiStore } from "@/store/ai";
import { use, useState } from "react";
import { DialogForAPIKey } from "@/components/api-key-dialog";
import { useToast } from "@/hooks/useToast";
import { useEffect } from "react";
import { OptionsBar } from "./[[...chatId]]/options-bar";

export default function Page() {
  // Let the user know with a toast to add API Key
  const { toast } = useToast();
  const apiKey = useAiStore((state) => state.apiKey);

  useEffect(() => {
    console.log("apiKey value:", apiKey);
    if (!apiKey) {
      toast({
        description: "Por favor añade tu API Key",
      });
    }
  }, [apiKey]);
  return (
    <main className="w-full h-full flex">
      <div className="w-80 h-full max-h-full border-r-2 border-neutral-300 dark:border-neutral-700 overflow-auto">
        <ChatList />
      </div>
      <div className="h-full flex-1 flex flex-col">
        <DialogForAPIKey />
        <ChatContent />
        <OptionsBar />
      </div>
    </main>
  );
}
