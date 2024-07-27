"use client";

import APIKeyForm from "@/components/api-key-form";
import ChatContent from "./[[...chatId]]/chat-content";
import ChatList from "./[[...chatId]]/chat-list";
import { useAiStore } from "@/store/ai";
import { useState } from "react";
import { Button } from "@/components/shadcn/button";

export default function Page() {
  return (
    <div className="bg-zinc-900 w-full h-full">
      <APIKeyForm />
      <div className="w-full h-full flex">
        <div className="w-80 h-full max-h-full border-r-2 border-neutral-300 dark:border-neutral-700 overflow-auto">
          <ChatList />
        </div>
        <div className="h-full flex-1 flex flex-col">
          {/* <ChatContent /> */}
        </div>
      </div>
    </div>
  );
}
