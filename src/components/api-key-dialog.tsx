import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@components/shadcn/dialog";

import { Key } from "lucide-react";
import APIKeyForm from "./api-key-form";

export const DialogForAPIKey = () => {
  return (
    <div className="flex justify-end h-20 px-10">
      <Dialog>
        <DialogTrigger>
          <Key />
        </DialogTrigger>
        <DialogContent>
          <APIKeyForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};
