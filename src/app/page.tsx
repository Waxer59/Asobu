"use client";

import Draggable from "react-draggable";
import { useEffect, useRef } from "react";
import { generateText, tool } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import { MapTab } from "@components/MapTab";

const openai = createOpenAI({
  apiKey: ""
});

export default function Home() {
  const dragRef = useRef(null);

  const onClick = async () => {
    const resp = await generateText({
      model: openai("gpt-4o"),
      system: "You are a friendly assistant!",
      // messages: [{ role: 'user', content: "convert 10c to fahrenheit" }],
      // tools: {
      //   celsiusToFahrenheit: {
      //     description: "Converts celsius to fahrenheit",
      //     parameters: z.object({
      //       value: z.string().describe("The value in celsius")
      //     }),
      //     execute: async ({ value }) => {
      //       const celsius = parseFloat(value);
      //       console.log("here!");
      //       const fahrenheit = celsius * (9 / 5) + 32;
      //       return `${celsius}°C is ${fahrenheit.toFixed(2)}°F`;
      //     }
      //   }
      // }
      toolChoice: "required",
      tools: {
        other: tool({
          description: "Use this tool when you need to answer any question",
          parameters: z.object({
            question: z.string().describe("The question to answer")
          }),
          execute: async ({ question }) => {
            return `Answering the question: ${question}`;
          }
        }),
        navigation: tool({
          description: "Use this tool to navigate to a specific location",
          parameters: z.object({
            location: z.string().describe("The location to navigate to"),
            from: z.string().describe("The starting point").optional()
          }),
          execute: async ({ location, from }) => {
            return `Navigating to ${location} from ${
              from || "current location"
            }`;
          }
        })
      }
    });
    console.log(resp);
  };

  return (
    <>
      <Draggable nodeRef={dragRef} bounds="parent" cancel="#map">
        <div
          ref={dragRef}
          id="handle"
          className="p-5 rounded-md bg-black absolute cursor-move"
        >
          <MapTab />
        </div>
      </Draggable>
      <button onClick={onClick}>Test</button>
    </>
  );
}
