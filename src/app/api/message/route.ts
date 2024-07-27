import { createOpenAI } from "@ai-sdk/openai";

import { generateText } from "ai";

import { useStore } from "@/store/ai";

export const runtime = "edge";

type ContentResponse = Array<
  | { type: "image_url"; image_url: { url: string } }
  | { type: "text"; text: string }
>;

const getInputMessage = async (content: ContentResponse) => {
  for (const obj of content) {
    if (obj.type === "text") {
      return obj.text;
    }
  }
};

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? useStore.getState().apiKey,
  compatibility: "strict", // strict mode, enable when using the OpenAI API
});

export async function POST(req: Request) {
  console.log("checking if the API key is set on the backend");
  if (!useStore.getState().apiKey) {
    return new Response("No API key set", { status: 400 });
  }
  const { content } = await req.json();

  const message = await getInputMessage(content);

  const result = await generateText({
    model: openai("gpt-4"),
    system: "You are a helpful assistant.",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Do you have any information regarding this ${message}?`,
          },
        ],
      },
    ],
  });

  return new Response(result.text);
}
