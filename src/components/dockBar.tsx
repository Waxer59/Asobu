'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Card,
  Button,
  buttonVariants,
  CollapsibleTrigger,
  Collapsible,
  CollapsibleContent
} from '@shadcn/index';
import {
  HomeIcon,
  Languages,
  MessageCircle,
  Mic,
  Music,
  Navigation,
  Presentation,
  Wrench
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Subtitles } from './subtitles';
import { toast } from '@hooks/useToast';
import { getAiResponse, textToSpeech, transcribeAudio } from '@/app/actions';
import {
  useAiStore,
  useUiStore,
  useSpotifyStore,
  useMediaStore,
  useTeachModeStore,
  useNavigationStore,
  useTranslatorStore
} from '@store';
import { convertBlobToBase64 } from '@lib/utils';
import {
  AiActions,
  OpenMapData,
  OtherData,
  SpotifySearch,
  TranslateData
} from '@/types/types';
import { usePathname, useRouter } from 'next/navigation';
import { PATHNAMES } from '@/constants/constants';
import { CoreMessage, UserContent } from 'ai';
import { useMicrophone } from '@hooks/useMicrophone';

export const DockBar = () => {
  const router = useRouter();
  const [playAudio, setPlayAudio] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const apiKey = useAiStore((state) => state.apiKey);
  const setIsAiLoading = useAiStore((state) => state.setIsAiLoading);
  const setResponse = useAiStore((state) => state.setResponse);
  const webcam = useMediaStore((state) => state.webcam);
  const whiteBoardImage = useTeachModeStore((state) => state.whiteBoardImage);
  const clearNavigation = useNavigationStore((state) => state.clear);
  const setNavigationTo = useNavigationStore((state) => state.setNavigationTo);
  const setNavigationFrom = useNavigationStore(
    (state) => state.setNavigationFrom
  );
  const setIsNavigationOpen = useUiStore((state) => state.setIsNavigationOpen);
  const isTranslateOpen = useUiStore((state) => state.isTranslateOpen);
  const setIsTranslateOpen = useUiStore((state) => state.setIsTranslateOpen);
  const setIsSpotifyOpen = useUiStore((state) => state.setIsSpotifyOpen);
  const setLanguageOne = useTranslatorStore((state) => state.setLanguageOne);
  const setLanguageTwo = useTranslatorStore((state) => state.setLanguageTwo);
  const setLanguageOneText = useTranslatorStore(
    (state) => state.setLanguageOneText
  );
  const setLanguageTwoText = useTranslatorStore(
    (state) => state.setLanguageTwoText
  );
  const clearclearTranslate = useTranslatorStore((state) => state.clear);
  const setSpotifyQuery = useSpotifyStore((state) => state.setSpotifyQuery);
  const clearSpotify = useSpotifyStore((state) => state.clear);
  const pathname = usePathname();
  const { isRecording, alternateRecording } = useMicrophone({
    onGetChunks: (chunks) => {
      sendToAi(chunks);
    }
  });

  useEffect(() => {
    audioRef.current = new Audio();
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    if (playAudio) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [playAudio]);

  useEffect(() => {
    if (isRecording) {
      setPlayAudio(false);
    }
  }, [isRecording]);

  const toggleNavigation = useUiStore((state) => state.toggleNavigation);

  const sendToAi = async (chunks: BlobPart[]) => {
    if (!apiKey) {
      toast({
        title: 'Error',
        description: 'Please enter a valid API key.',
        variant: 'destructive'
      });
      return;
    }

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
        if (audioRef.current) {
          audioRef.current.src = `data:audio/mp3;base64,${await textToSpeech(apiKey, 'Opening the map')}`;
          setPlayAudio(true);
        }

        setIsNavigationOpen(true);
        setNavigationTo(to);
        setNavigationFrom(from ?? undefined);
        break;
      case AiActions.CLOSE_MAP:
        clearNavigation();
        if (audioRef.current) {
          audioRef.current.src = `data:audio/mp3;base64,${await textToSpeech(apiKey, 'Closing the map')}`;
        }
        setPlayAudio(true);
        break;
      case AiActions.NONE:
        const otherData = data as OtherData;

        if (otherData.text && audioRef.current) {
          audioRef.current.src = `data:audio/mp3;base64,${await textToSpeech(apiKey, otherData.text)}`;
          setPlayAudio(true);
          setResponse(otherData.text);
        }
        break;
      case AiActions.OPEN_TEACH_MODE:
        textToSpeech(apiKey, 'Opening teach mode').then((res) => {
          if (audioRef.current) {
            audioRef.current.src = `data:audio/mp3;base64,${res}`;
            setPlayAudio(true);
          }
          router.push(PATHNAMES.TEACH_MODE);
        });
        break;
      case AiActions.CLOSE_TEACH_MODE:
        textToSpeech(apiKey, 'Closing teach mode').then((res) => {
          if (audioRef.current) {
            audioRef.current.src = `data:audio/mp3;base64,${res}`;
            setPlayAudio(true);
          }
          router.push(PATHNAMES.INDEX);
        });
        break;
      case AiActions.OPEN_TRANSLATE:
        const { languageOne, languageTwo, text, translatedText } =
          data as TranslateData;
        if (audioRef.current) {
          audioRef.current.src = `data:audio/mp3;base64,${await textToSpeech(apiKey, 'Opening the translator')}`;
          setPlayAudio(true);
        }

        setIsTranslateOpen(true);
        setLanguageOne(languageOne);
        setLanguageTwo(languageTwo);
        setLanguageOneText(text);
        setLanguageTwoText(translatedText);
        break;
      case AiActions.CLOSE_TRANSLATE:
        if (audioRef.current) {
          audioRef.current.src = `data:audio/mp3;base64,${await textToSpeech(apiKey, 'Closing the translator')}`;
          setPlayAudio(true);
        }
        clearclearTranslate();
        break;
      case AiActions.OPEN_SPOTIFY_WEB_PLAYER:
        const { text: spotifySearch } = data as SpotifySearch;

        if (audioRef.current) {
          audioRef.current.src = `data:audio/mp3;base64,${await textToSpeech(apiKey, 'Opening Spotify player')}`;
          setPlayAudio(true);
        }

        setSpotifyQuery(spotifySearch);
        setIsSpotifyOpen(true);
        break;
      case AiActions.CLOSE_SPOTIFY_WEB_PLAYER:
        if (audioRef.current) {
          audioRef.current.src = `data:audio/mp3;base64,${await textToSpeech(apiKey, 'Closing Spotify player')}`;
          setPlayAudio(true);
        }

        clearSpotify();
        break;
    }

    setIsAiLoading(false);
  };

  const onNavigationClick = async () => {
    toggleNavigation();
  };

  const onTranslateClick = async () => {
    setIsTranslateOpen(!isTranslateOpen);
  };

  return (
    <div className="bottom-3 absolute left-0 right-0 flex flex-col items-center gap-4 justify-center">
      <Subtitles />
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

        <Collapsible>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -right-14">
                    <Wrench className="stroke-1" />
                  </Button>
                </CollapsibleTrigger>
              </TooltipTrigger>
              <TooltipContent>Tools</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <CollapsibleContent>
            <Card className="absolute flex gap-4 p-2 top-0 left-64">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={onTranslateClick}>
                      <Languages />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Translate</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={onNavigationClick}>
                      <Navigation />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Navigation</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <Music />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Music</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};
