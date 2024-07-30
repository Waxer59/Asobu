"use client";

import { Button } from "@/components/shadcn/button";
import { Camera } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@components/shadcn/dialog";
import { DialogClose, DialogDescription } from "@radix-ui/react-dialog";
import Webcam from "react-webcam";
import { useCallback, useState } from "react";
import { useMediaStore } from "@/store/media-devices";

export const CameraButton = () => {
  const [stream, setStream] = useState(null);

  // Get stuff from store
  const webcamRef = useMediaStore.getState().ref;
  const videoConstraints = useMediaStore.getState().baseVideoConstraints;

  // Capture the image taken from the webcamera
  const capture = useCallback(() => {
    if (webcamRef.current) {
      console.log("Esta es la referencia", webcamRef.current);
      const imageSrc = webcamRef.current.getScreenshot();
      console.log(imageSrc);
    }
  }, [webcamRef]);

  return (
    <>
      <Dialog>
        <DialogContent className="p-10">
          <DialogTitle>Take a picture</DialogTitle>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="rounded-md"
          />
          <DialogDescription>
            Press the button to take a picture
          </DialogDescription>
          <DialogClose asChild>
            <Button onClick={capture}>
              <Camera />
            </Button>
          </DialogClose>
        </DialogContent>
        <DialogTrigger asChild>
          <Button>
            <Camera />
          </Button>
        </DialogTrigger>
      </Dialog>
    </>
  );
};
