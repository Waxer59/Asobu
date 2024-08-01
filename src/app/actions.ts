'use server';

import {
  AiActions,
  AiRequestData,
  AiResponseData,
  OpenMapData,
  VisionData
} from '@/types/types';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { z } from 'zod';

export async function getAiResponse(
  apiKey: string,
  data: AiRequestData
): Promise<AiResponseData> {
  'use server';

  const { message, img } = data;

  const openai = createOpenAI({
    apiKey,
    compatibility: 'strict' // strict mode, enable when using the OpenAI API
  });

  const { text, toolResults } = await generateText({
    model: openai('gpt-4o'),
    system: 'You are a helpful assistant.',
    toolChoice: 'required',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: message },
          { type: 'image', image: img ?? '' }
        ]
      }
    ],
    tools: {
      other: {
        description: 'Use this tool when you need to answer any question',
        parameters: z.object({
          question: z.string().describe('The question to answer')
        }),
        execute: async ({ question }) => {
          return `Answering the question: ${question}`;
        }
      },
      navigation: {
        description: 'Use this tool to navigate to a specific location',
        parameters: z.object({
          to: z.string().describe('The location to navigate to'),
          from: z.string().optional().describe('The starting point')
        }),
        execute: async ({ to, from }): Promise<OpenMapData> => {
          return {
            to,
            from,
            action: AiActions.OPEN_MAP
          };
        }
      },
      vision: {
        description: 'Use this tool to analyze an image',
        parameters: z.object({
          description: z.string().describe('Description of the image')
        }),
        execute: async ({ description }): Promise<VisionData> => {
          return {
            text: description,
            action: AiActions.VISION
          };
        }
        // messages: [
        //   {
        //     role: 'user',
        //     content: [
        //       {
        //         type: 'text',
        //         text:
        //           `What’s in this image ${message}?` ?? 'What’s in this image?'
        //       },
        //       {
        //         type: 'image',
        //         image: img ?? ''
        //       }
        //     ]
        //   }
        // ]
      }
    }
  });

  return {
    text,
    data: (toolResults[0].result as OpenMapData | VisionData) ?? null,
    action:
      (toolResults[0].result as OpenMapData | VisionData).action ??
      AiActions.NONE
  };
}
