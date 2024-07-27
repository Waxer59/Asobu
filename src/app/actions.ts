"use server";

import { AiRequestData, AiResponseData } from "@/types/types";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function getAiResponse(
  apiKey: string,
  data: AiRequestData
): Promise<AiResponseData> {
  "use server";

  const { message, img } = data;

  const openai = createOpenAI({
    apiKey,
    compatibility: "strict" // strict mode, enable when using the OpenAI API
  });

  const result = await generateText({
    model: openai("gpt-4o"),
    system: "You are a helpful assistant.",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Do you have any information regarding this ${message}?`
          }
        ]
      }
    ]
  });

  return {
    text: result.text
  };
}
