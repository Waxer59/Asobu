import { createOpenAI } from "@ai-sdk/openai";

import { generateText } from "ai";
import { createStreamableValue } from "ai/rsc";

// import { initialProgrammerMessages } from "./messages";

type ContentResponse = Array<
  | { type: 'image_url'; image_url: { url: string } }
  | { type: 'text'; text: string }>;

export const runtime = "edge";

const getInputMessage = async (content: ContentResponse) => {
  for (const obj of content) {
    if (obj.type === "text") {
      return obj.text;
    }
  }
}

const getInputImage = async (content: ContentResponse) => {
  for (const obj of content) {
    if (obj.type === "image_url") {
      return obj.image_url.url;
    }
  }
}

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: "strict", // strict mode, enable when using the OpenAI API
});

export async function POST(req: Request) {
  const { content } = await req.json();

  const message = await getInputMessage(content);
  const image = await getInputImage(content);

  const result = await generateText({
    model: openai("gpt-4o-mini"),
    system: "You are a helpful assistant.",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text:
              `What’s in this image ${message}?` ?? "What’s in this image?",
          },
          {
            type: "image",
            image: image ?? "",
          },
        ],
      },
    ],
  });

  return new Response(result.text);
}
