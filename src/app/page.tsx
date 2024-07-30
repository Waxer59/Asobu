"use client";

import ChatContent from "./[[...chatId]]/chat-content";
import { useAiStore } from "@/store/ai";
import { DialogForAPIKey } from "@/components/api-key-dialog";
import { useToast } from "@/hooks/useToast";
import { useEffect } from "react";
import { OptionsBar } from "./[[...chatId]]/options-bar";
import Webcam from "react-webcam";
import { useMediaStore } from "@/store/media-devices";

export default function Page() {
  // Let the user know with a toast to add API Key
  const { toast } = useToast();
  const apiKey = useAiStore((state) => state.apiKey);
  const cameraRefOnMainLayer = useMediaStore.getState().ref;
  const videoConstraints = useMediaStore.getState().baseVideoConstraints;

  useEffect(() => {
    console.log("apiKey value:", apiKey);
    if (!apiKey) {
      toast({
        description: "Por favor añade tu API Key",
      });
    }
  }, [apiKey]);

  return (
    <main className="">
      {/* <div className="w-80 h-full max-h-full border-r-2 border-neutral-300 dark:border-neutral-700 overflow-auto">
        <ChatList />
      </div> */}
      <div className="flex-1 flex flex-col h-screen">
        <DialogForAPIKey />
        <div className="self-center place-self-center w-1/2 border-2 border-gray-700 flex flex-col gap-y-10 rounded-md">
          <Webcam
            audio={false}
            ref={cameraRefOnMainLayer}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="rounded-md p-6"
          />
          <ChatContent />
          <OptionsBar />
        </div>
      </div>
    </main>
  );
}
