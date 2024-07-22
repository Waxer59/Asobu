import { createOpenAI } from "@ai-sdk/openai";

import { StreamingTextResponse, streamText } from "ai";

import { initialProgrammerMessages } from "./messages";

export const runtime = "edge";

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: "strict", // strict mode, enable when using the OpenAI API
});

export async function POST(req: Request) {
  const { content } = await req.json();

  // const settings = {
  //   messages: [...initialProgrammerMessages, { role: "user", content }],
  //   model: "gpt-4-vision-preview",
  //   stream: true,
  //   max_tokens: 4096,
  // };

  // const result = await streamText(
  //   model: "gpt-4-vision-preview",
  //   content.messages,
  // )

  const result  = await openai.completion(
    "gpt-4o-mini",
    {
      //Stuff to handle with vision
    }
  )

  // return result.toAIStreamResponse();
  return new Response("Hello, World!");
}
