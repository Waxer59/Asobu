'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Card,
  Button,
  buttonVariants
} from '@shadcn/index';
import { HomeIcon, MessageCircle, Mic, Presentation } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { Subtitles } from './subtitles';
import { toast, useMicrophone, useAudio } from '@hooks';
import { getAiResponse, textToSpeech, transcribeAudio } from '@/app/actions';
import {
  useAiStore,
  useUiStore,
  useSpotifyStore,
  useMediaStore,
  useTeachModeStore,
  useNavigationStore,
  useTranslatorStore,
  useNotesStore
} from '@store';
import { convertBlobToBase64 } from '@lib/utils';
import {
  AiActions,
  CreateNoteData,
  OpenMapData,
  OtherData,
  SpotifySearch,
  TranslateData
} from '@/types/types';
import { usePathname, useRouter } from 'next/navigation';
import { PATHNAMES } from '@constants';
import { CoreMessage, UserContent } from 'ai';
import { DockbarTools } from './dockbarTools';

export const DockBar = () => {
  const router = useRouter();
  const apiKey = useAiStore((state) => state.apiKey);
  const setIsAiLoading = useAiStore((state) => state.setIsAiLoading);
  const setResponse = useAiStore((state) => state.setResponse);
  const webcam = useMediaStore((state) => state.webcam);
  const whiteBoardImage = useTeachModeStore((state) => state.whiteBoardImage);
  const {
    setNavigationFrom,
    setNavigationTo,
    clear: clearNavigation
  } = useNavigationStore();
  const {
    setIsNavigationOpen,
    isSubtitlesOpen,
    setIsTranslateOpen,
    setIsNotesOpen,
    setIsSubtitlesOpen,
    setIsSpotifyOpen
  } = useUiStore();
  const {
    setLanguageOne,
    setLanguageTwo,
    setLanguageOneText,
    setLanguageTwoText,
    clear: clearTranslate
  } = useTranslatorStore();
  const { setSpotifyQuery, clear: clearSpotify } = useSpotifyStore();
  const addNote = useNotesStore((state) => state.addNote);
  const pathname = usePathname();
  const { isRecording, alternateRecording } = useMicrophone({
    onGetChunks: (chunks) => {
      sendToAi(chunks);
    }
  });
  const { playAudio, stopAudio } = useAudio();

  useEffect(() => {
    if (isRecording) {
      stopAudio();
    }
  }, [isRecording]);

  const sendToAi = async (chunks: BlobPart[]) => {
    if (!apiKey) {
      toast({
        title: 'Error',
        description: 'Please enter a valid API key.',
        variant: 'destructive'
      });
      return;
    }

    setIsSubtitlesOpen(true);
    setIsAiLoading(true);

    const blob = new Blob(chunks, { type: 'audio/mp3' });
    const audioBase64 = await convertBlobToBase64(blob);
    const text = await transcribeAudio(apiKey, audioBase64);

    let imageBase64;

    switch (pathname) {
      case PATHNAMES.INDEX:
        if (webcam) {
          imageBase64 = webcam.getScreenshot() ?? undefined;
        }
        break;
      case PATHNAMES.TEACH_MODE:
        imageBase64 = whiteBoardImage;
        break;
    }

    const newContent: UserContent = [];

    if (text) {
      newContent.push({
        type: 'text',
        text
      });
    }

    if (imageBase64) {
      newContent.push({
        type: 'image',
        image: imageBase64
      });
    }

    const newMessage: CoreMessage[] = [
      {
        role: 'user',
        content: newContent
      }
    ];

    const response = await getAiResponse(apiKey, newMessage);

    if (!response) {
      setIsAiLoading(false);
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive'
      });
      return;
    }

    const { data } = response;

    switch (data.action) {
      case AiActions.OPEN_MAP:
        const { from, to } = data as OpenMapData;
        playAudio(
          `data:audio/mp3;base64,${await textToSpeech(apiKey, 'Opening the map')}`
        );
        setIsNavigationOpen(true);
        setNavigationTo(to);
        setNavigationFrom(from ?? undefined);
        break;
      case AiActions.CLOSE_MAP:
        clearNavigation();
        playAudio(
          `data:audio/mp3;base64,${await textToSpeech(apiKey, 'Closing the map')}`
        );
        break;
      case AiActions.NONE:
        const otherData = data as OtherData;

        if (otherData.text) {
          playAudio(
            `data:audio/mp3;base64,${await textToSpeech(apiKey, otherData.text)}`
          );
          setResponse(otherData.text);
        }
        break;
      case AiActions.OPEN_TEACH_MODE:
        textToSpeech(apiKey, 'Opening teach mode').then((res) => {
          playAudio(`data:audio/mp3;base64,${res}`);
          router.push(PATHNAMES.TEACH_MODE);
        });
        break;
      case AiActions.CLOSE_TEACH_MODE:
        textToSpeech(apiKey, 'Closing teach mode').then((res) => {
          playAudio(`data:audio/mp3;base64,${res}`);
          router.push(PATHNAMES.INDEX);
        });
        break;
      case AiActions.OPEN_TRANSLATE:
        const { languageOne, languageTwo, text, translatedText } =
          data as TranslateData;
        playAudio(
          `data:audio/mp3;base64,${await textToSpeech(apiKey, 'Opening the translator')}`
        );

        setIsTranslateOpen(true);
        setLanguageOne(languageOne);
        setLanguageTwo(languageTwo);
        setLanguageOneText(text);
        setLanguageTwoText(translatedText);
        break;
      case AiActions.CLOSE_TRANSLATE:
        playAudio(
          `data:audio/mp3;base64,${await textToSpeech(apiKey, 'Closing the translator')}`
        );
        setIsTranslateOpen(false);
        clearTranslate();
        break;
      case AiActions.OPEN_SPOTIFY_WEB_PLAYER:
        const { text: spotifySearch } = data as SpotifySearch;

        playAudio(
          `data:audio/mp3;base64,${await textToSpeech(apiKey, 'Opening Spotify player')}`
        );

        setSpotifyQuery(spotifySearch);
        setIsSpotifyOpen(true);
        break;
      case AiActions.CLOSE_SPOTIFY_WEB_PLAYER:
        playAudio(
          `data:audio/mp3;base64,${await textToSpeech(apiKey, 'Closing Spotify player')}`
        );

        clearSpotify();
        setIsSpotifyOpen(false);
        break;
      case AiActions.CREATE_NOTE:
        const { text: noteText } = data as CreateNoteData;

        playAudio(
          `data:audio/mp3;base64,${await textToSpeech(apiKey, 'Note created!')}`
        );
        const id = crypto.randomUUID();
        addNote({ id, text: noteText });
        break;
      case AiActions.OPEN_NOTES:
        setIsNotesOpen(true);
        playAudio(
          `data:audio/mp3;base64,${await textToSpeech(apiKey, 'Opening notes')}`
        );
        break;
      case AiActions.CLOSE_NOTES:
        setIsNotesOpen(false);
        playAudio(
          `data:audio/mp3;base64,${await textToSpeech(apiKey, 'Closing notes')}`
        );
        break;
    }

    setIsAiLoading(false);
  };

  return (
    <div className="bottom-3 absolute left-0 right-0 flex flex-col items-center gap-4 justify-center">
      {isSubtitlesOpen && <Subtitles />}
      <Card className="flex justify-center gap-2 z-10 p-2 relative px-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={PATHNAMES.INDEX}
                className={`${buttonVariants({ variant: 'ghost', size: 'icon' })} absolute -left-14`}>
                <HomeIcon className="stroke-1" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Go home</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={PATHNAMES.CHAT}
                className={buttonVariants({ variant: 'ghost', size: 'icon' })}>
                <MessageCircle className="stroke-1" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Chat</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant={isRecording ? 'default' : 'secondary'}
                className="rounded-full"
                onClick={alternateRecording}>
                <Mic className="stroke-1" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isRecording ? 'Recording...' : 'Talk to the AI'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={PATHNAMES.TEACH_MODE}
                className={buttonVariants({
                  variant: 'ghost',
                  size: 'icon'
                })}>
                <Presentation className="stroke-1" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>Teach mode</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DockbarTools />
      </Card>
    </div>
  );
};
