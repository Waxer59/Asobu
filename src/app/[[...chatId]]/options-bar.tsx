"use client";

import { CameraButton } from "@/components/camera-button";

export const OptionsBar = () => {
  return (
    <div className="self-center mb-10 bg-transparent border border-gray-500 rounded-2xl outline-none resize-none pl-12 pr-14 py-4 scrollbar-content overflow-y-auto overflow-x-clip overscroll-contain">
      <div className="flex justify-center">
        <CameraButton />
      </div>
    </div>
  );
};
