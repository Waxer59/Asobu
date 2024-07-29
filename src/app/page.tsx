"use client";

import APIKeyForm from "@components/api-key-form";
import ChatList from "./[[...chatId]]/chat-list";
import { MapTab } from "@components/mapTab";
import { useEffect, useState } from "react";
import { Button } from "@/components/shadcn/button";
import { getAiResponse } from "./actions";
import { AiActions, AiResponseData, OpenMapData } from "@/types/types";

export default function Page() {
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

  return (
    <div className="bg-zinc-900 w-full h-full">
      {showMap && (
        <MapTab
          destination={mapDestination}
          from={mapOrigin}
          onClose={onCloseMapTab}
        />
      )}
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
