'use server';

import { arrayBufferToBase64 } from '@lib/utils';
import {
  ActionData,
  AiActions,
  AiResponse,
  AiResponseData,
  OpenMapData,
  OtherData
} from '@/types/types';
import { createOpenAI } from '@ai-sdk/openai';
import { CoreMessage, generateText } from 'ai';
import OpenAI, { toFile } from 'openai';
import { z } from 'zod';

export async function transcribeAudio(
  apiKey: string,
  base64Audio: string
): Promise<string | null> {
  'use server';

  const openai = new OpenAI({
    apiKey: apiKey
  });

  const audioBuffer = Buffer.from(base64Audio.split('base64,')[1], 'base64');

  try {
    const { text } = await openai.audio.transcriptions.create({
      file: await toFile(audioBuffer, 'tmp.mp3', {
        type: 'audio/mp3'
      }),
      model: 'whisper-1'
    });

    return text;
  } catch (error) {
    console.log(error);
  }

  return null;
}

export async function textToSpeech(
  apiKey: string,
  text: string
): Promise<string | null> {
  'use server';

  const openai = new OpenAI({
    apiKey: apiKey
  });

  try {
    const audio = await openai.audio.speech.create({
      model: 'tts-1',
      voice: 'echo',
      input: text
    });

    const arrayBuffer = await audio.arrayBuffer();

    return arrayBufferToBase64(arrayBuffer);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getAiResponse(
  apiKey: string,
  history: CoreMessage[]
): Promise<AiResponseData> {
  'use server';

  const openai = createOpenAI({
    apiKey,
    compatibility: 'strict' // strict mode, enable when using the OpenAI API
  });

  const { toolResults } = await generateText({
    model: openai('gpt-4o'),
    system: 'You are a helpful assistant.',
    toolChoice: 'required',
    messages: [...history],
    tools: {
      other: {
        description: 'Use this tool when you need to answer any question',
        parameters: z.object({
          answer: z.string().describe('The answer to the question')
        }),
        execute: async ({ answer }): Promise<OtherData> => ({
          text: answer,
          action: AiActions.NONE
        })
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
      closeNavigation: {
        description: 'Use this tool to close the navigation or the map',
        parameters: z.object({}),
        execute: async (): Promise<ActionData> => ({
          action: AiActions.CLOSE_MAP
        })
      },
      openTeachMode: {
        description: 'Use this tool to open the teach mode or whiteboard',
        parameters: z.object({}),
        execute: async (): Promise<ActionData> => ({
          action: AiActions.OPEN_TEACH_MODE
        })
      },
      closeTeachMode: {
        description: 'Use this tool to close the teach mode or whiteboard',
        parameters: z.object({}),
        execute: async (): Promise<ActionData> => ({
          action: AiActions.CLOSE_TEACH_MODE
        })
      }
    }
  });

  return {
    data: (toolResults[0].result as AiResponse) ?? null,
    action: (toolResults[0].result as AiResponse).action ?? AiActions.NONE
  };
}
