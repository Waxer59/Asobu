"use client";

import APIKeyForm from "@components/api-key-form";
import ChatList from "./[[...chatId]]/chat-list";
import { useAiStore } from "@/store/ai";
import { useEffect, useState } from "react";
import { DialogForAPIKey } from "@components/api-key-dialog";
import { useToast } from "@/hooks/useToast";
import { getAiResponse } from "./actions";
import { AiActions, AiResponseData, OpenMapData } from "@/types/types";
import { MapTab } from "@components/mapTab";

export default function Page() {
  // Let the user know with a toast to add API Key
  const { toast } = useToast();
  const apiKey = useAiStore((state) => state.apiKey);
  const [showMap, setShowMap] = useState<boolean>(false);
  const [mapDestination, setMapDestination] = useState<string>("");
  const [mapOrigin, setMapOrigin] = useState<string | undefined>("");
  const [aiResponseData, setAiResponseData] = useState<AiResponseData | null>(
    null
  );

  useEffect(() => {
    switch (aiResponseData?.action) {
      case AiActions.OPEN_MAP:
        const { from, to } = aiResponseData.data as OpenMapData;
        setShowMap(true);
        setMapDestination(to);
        setMapOrigin(from ?? undefined);
        break;
    }
  }, [aiResponseData]);

  const onCloseMapTab = () => {
    setShowMap(false);
    setMapDestination("");
    setMapOrigin(undefined);
  };

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
      {showMap && (
        <MapTab
          destination={mapDestination}
          from={mapOrigin}
          onClose={onCloseMapTab}
        />
      )}
      <div className="w-80 h-full max-h-full border-r-2 border-neutral-300 dark:border-neutral-700 overflow-auto">
        <ChatList />
      </div>
      <div className="h-full flex-1 flex flex-col">
        <DialogForAPIKey />
        <ChatContent />
      </div>
    </main>
  );
}
