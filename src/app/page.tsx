"use client";

import APIKeyForm from "@/components/api-key-form";
import ChatContent from "./[[...chatId]]/chat-content";
import ChatList from "./[[...chatId]]/chat-list";
import { useAiStore } from "@/store/ai";
import { useState } from "react";
import { DialogForAPIKey } from "@/components/api-key-dialog";

export default function Page() {
  return (
    <div className="w-full h-full flex">
      <div className="w-80 h-full max-h-full border-r-2 border-neutral-300 dark:border-neutral-700 overflow-auto">
        <ChatList />
      </div>
      <div className="h-full flex-1 flex flex-col">
        <DialogForAPIKey />
        <ChatContent />
      </div>
    </div>
  );
}
