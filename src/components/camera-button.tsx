"use client";

import { Button } from "@/components/shadcn/button";
import { Camera } from "lucide-react";
import Webcam from "react-webcam";
import { useCallback, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@components/shadcn/dialog";

export const CameraButton = () => {
  // Define constraints
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  const [permissionGranted, setPermissionGranted] = useState(false);
  const webcamRef = useRef(null);

  const requestPermission = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        setPermissionGranted(true);
        // Stop all tracks to release the webcam after checking permission
        stream.getTracks().forEach((track) => track.stop());
      })
      .catch((error) => {
        console.error("Permission denied:", error);
      });
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      console.log(imageSrc);
    }
  }, [webcamRef]);

  return (
    <>
      <Dialog>
        <DialogContent className="p-10">
          <Webcam
            audio={false}
            ref={webcamRef}
            height={720}
            screenshotFormat="image/jpeg"
            width={1280}
            videoConstraints={videoConstraints}
            className="rounded-md"
          />
        </DialogContent>
        <DialogTrigger asChild>
          <Button onClick={capture}>
            <Camera />
          </Button>
        </DialogTrigger>
      </Dialog>
    </>
  );
};
