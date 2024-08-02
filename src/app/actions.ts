'use server';

import {
  AiActions,
  AiRequestData,
  AiResponseData,
  OpenMapData
} from '@/types/types';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import OpenAI from 'openai';
import { z } from 'zod';
import fs from 'fs';

export async function transcribeAudio(
  apiKey: string,
  base64Audio: string
): Promise<string | null> {
  'use server';

  const openai = new OpenAI({
    apiKey: apiKey
  });

  const audio = Buffer.from(base64Audio.split('base64,')[1], 'base64');

  const filePath = `tmp/${crypto.randomUUID()}.mp3`;

  try {
    fs.writeFileSync(filePath, audio);

    const readStream = fs.createReadStream(filePath);

    const { text } = await openai.audio.transcriptions.create({
      file: readStream,
      model: 'whisper-1'
    });

    return text;
  } catch (error) {
    console.log(error);
  } finally {
    fs.unlinkSync(filePath);
  }

  return null;
}

export async function textToSpeech(
  apiKey: string,
  text: string
): Promise<Blob | null> {
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

    console.log(audio);

    //! CHANGE
    return new Blob();
  } catch (error) {
    console.log(error);
    return null;
  }
}

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
    messages: [{ role: 'user', content: message }],
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
      }
    }
  });

  return {
    text,
    data: (toolResults[0].result as OpenMapData) ?? null,
    action: (toolResults[0].result as OpenMapData).action ?? AiActions.NONE
  };
}
