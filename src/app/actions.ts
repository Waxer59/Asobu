'use server';

import { arrayBufferToBase64 } from '@lib/utils';
import {
  ActionData,
  AiActions,
  AiResponse,
  AiResponseData,
  OpenMapData,
  OtherData,
  TranslateData,
  SpotifySearch,
  CreateNoteData
} from '@/types/types';
import { createOpenAI } from '@ai-sdk/openai';
import { CoreMessage, generateText } from 'ai';
import OpenAI, { toFile } from 'openai';
import { z } from 'zod';
import { TRANSLATE_LANGUAGES } from '@constants';

export async function translateText(
  apiKey: string,
  translateText: string,
  languageFrom: string,
  languageTo: string
): Promise<string | null> {
  'use server';

  const openai = createOpenAI({
    apiKey,
    compatibility: 'strict' // strict mode, enable when using the OpenAI API
  });

  try {
    const { text } = await generateText({
      model: openai('gpt-4o'),
      system: 'You are a helpful assistant.',
      messages: [
        {
          role: 'user',
          content: `Translate the following text from ${languageFrom} to ${languageTo}: "${translateText}" ; (it is important that you do not add any other characters that are not inside the given text, such as quotation marks, double quotation marks are not part of the text.)`
        }
      ]
    });

    return text;
  } catch (error) {
    console.log(error);
    return null;
  }
}

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

export async function continueConversation(
  apiKey: string,
  history: CoreMessage[]
): Promise<string | null> {
  'use server';

  const openai = createOpenAI({
    apiKey,
    compatibility: 'strict' // strict mode, enable when using the OpenAI API
  });

  try {
    const { text } = await generateText({
      model: openai('gpt-4o'),
      system: 'You are a friendly assistant!',
      messages: history
    });

    return text;
  } catch (error) {
    return null;
  }
}

export async function getAiResponse(
  apiKey: string,
  history: CoreMessage[]
): Promise<AiResponseData | null> {
  'use server';

  const openai = createOpenAI({
    apiKey,
    compatibility: 'strict' // strict mode, enable when using the OpenAI API
  });

  try {
    const { toolResults } = await generateText({
      model: openai('gpt-4o'),
      system: 'You are a helpful assistant.',
      toolChoice: 'required',
      messages: history,
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
          description: 'Use this tool to open the teach mode',
          parameters: z.object({}),
          execute: async (): Promise<ActionData> => ({
            action: AiActions.OPEN_TEACH_MODE
          })
        },
        closeTeachMode: {
          description: 'Use this tool to close the teach mode',
          parameters: z.object({}),
          execute: async (): Promise<ActionData> => ({
            action: AiActions.CLOSE_TEACH_MODE
          })
        },
        translate: {
          description: 'Use this tool to translate text',
          parameters: z.object({
            text: z.string().describe('The text to translate'),
            translatedText: z.string().describe('The translated text'),
            languageOne: z
              .enum(TRANSLATE_LANGUAGES)
              .describe(
                'The language to translate from if its not provided put here the language that the person speaking'
              ),
            languageTwo: z
              .enum(TRANSLATE_LANGUAGES)
              .describe('The language to translate to')
          }),
          execute: async ({
            text,
            translatedText,
            languageOne,
            languageTwo
          }): Promise<TranslateData> => ({
            text,
            translatedText,
            languageOne,
            languageTwo,
            action: AiActions.OPEN_TRANSLATE
          })
        },
        closeTranslate: {
          description:
            'Use this tool to close the translation, translator, or translate function.',
          parameters: z.object({}),
          execute: async (): Promise<ActionData> => ({
            action: AiActions.CLOSE_TRANSLATE
          })
        },
        spotify: {
          description: 'Use this tool to play a song',
          parameters: z.object({
            query: z.string().describe('The song to play')
          }),
          execute: async ({ query }): Promise<SpotifySearch> => {
            return {
              text: query,
              action: AiActions.OPEN_SPOTIFY_WEB_PLAYER
            };
          }
        },
        closeSpotify: {
          description: 'Use this tool to close the song player',
          parameters: z.object({}),
          execute: async (): Promise<ActionData> => ({
            action: AiActions.CLOSE_SPOTIFY_WEB_PLAYER
          })
        },
        createNote: {
          description: 'Use this tool to create a note',
          parameters: z.object({
            note: z.string().describe('The note to create')
          }),
          execute: async ({ note }): Promise<CreateNoteData> => ({
            text: note,
            action: AiActions.CREATE_NOTE
          })
        },
        openNotes: {
          description: 'Use this tool to open notes or a note',
          parameters: z.object({}),
          execute: async (): Promise<ActionData> => ({
            action: AiActions.OPEN_NOTES
          })
        },
        closeNotes: {
          description: 'Use this tool to close notes or a note',
          parameters: z.object({}),
          execute: async (): Promise<ActionData> => ({
            action: AiActions.CLOSE_NOTES
          })
        },
        openChat: {
          description: 'Use this tool to open the chat',
          parameters: z.object({}),
          execute: async (): Promise<ActionData> => ({
            action: AiActions.OPEN_CHAT
          })
        }
      }
    });

    return {
      data: (toolResults[0].result as AiResponse) ?? null,
      action: (toolResults[0].result as AiResponse).action ?? AiActions.NONE
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}
