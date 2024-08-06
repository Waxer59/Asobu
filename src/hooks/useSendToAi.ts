import { getAiResponse, textToSpeech } from '@/app/actions';
import { PATHNAMES } from '@constants';
import {
  AiActions,
  OpenMapData,
  OtherData,
  TranslateData,
  SpotifySearch,
  CreateNoteData
} from '@/types/types';
import { useRouter } from 'next/navigation';
import { UserContent, CoreMessage } from 'ai';
import { usePathname } from 'next/navigation';
import { useAiStore } from '@store/ai';
import { useMediaStore } from '@store/media-devices';
import { useNavigationStore } from '@store/navigation';
import { useNotesStore } from '@store/notes';
import { useSpotifyStore } from '@store/spotify';
import { useTeachModeStore } from '@store/teach-mode';
import { useTranslatorStore } from '@store/translator';
import { useUiStore } from '@store/ui';
import { toast } from './useToast';

interface Props {
  apiKey: string | undefined;
  playAudio: (audio: string) => void;
}

export const useSendToAi = ({ apiKey, playAudio }: Props) => {
  const pathname = usePathname();
  const {
    setIsSubtitlesOpen,
    setIsNavigationOpen,
    setIsNotesOpen,
    setIsSpotifyOpen,
    setIsTranslateOpen
  } = useUiStore();
  const {
    setNavigationTo,
    setNavigationFrom,
    clear: clearNavigation
  } = useNavigationStore();
  const {
    setLanguageOne,
    setLanguageTwo,
    setLanguageOneText,
    setLanguageTwoText,
    clear: clearTranslate
  } = useTranslatorStore();
  const { setSpotifyQuery, clear: clearSpotify } = useSpotifyStore();
  const setResponse = useAiStore((state) => state.setResponse);
  const setIsAiLoading = useAiStore((state) => state.setIsAiLoading);
  const webcam = useMediaStore((state) => state.webcam);
  const addNote = useNotesStore((state) => state.addNote);
  const whiteBoardImage = useTeachModeStore((state) => state.whiteBoardImage);
  const router = useRouter();

  const sendToAi = async (text: string) => {
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
      case AiActions.OPEN_CHAT:
        setIsSubtitlesOpen(false);
        playAudio(
          `data:audio/mp3;base64,${await textToSpeech(apiKey, 'Opening chat')}`
        );
        router.push(PATHNAMES.CHAT);
        break;
    }

    setIsAiLoading(false);
  };

  return {
    sendToAi
  };
};
