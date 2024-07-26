"use client";

import { Input } from "./input";
import { Button } from "./button";

export default function APIKeyForm() {
  return (
    <form method="post" action="/api/key" className="flex flex-col gap-4">
      <Input
        placeholder="Ingresa tu API key"
        type="text"
        id="apiKey"
        name="apiKey"
        required
        className="text-black"
      />
      <Button type="submit" variant={"outline"}>
        Ingresar
      </Button>
    </form>
  );
}
