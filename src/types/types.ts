export enum AiActions {
  NONE,
  OPEN_MAP,
  CLOSE_MAP,
  OPEN_TEACH_MODE,
  CLOSE_TEACH_MODE,
  OPEN_TRANSLATE,
  CLOSE_TRANSLATE
}

export type AiResponse = OtherData | OpenMapData | ActionData | TranslateData;

export interface OtherData {
  text: string;
  action: AiActions.NONE;
}

export interface TranslateData {
  text: string;
  translatedText: string;
  languageOne: string;
  languageTwo: string;
  action: AiActions.OPEN_TRANSLATE;
}

export interface ActionData {
  action: AiActions;
}

export interface OpenMapData {
  from?: string;
  to: string;
  action: AiActions.OPEN_MAP;
}

export interface AiRequestData {
  message: string;
  img?: string;
}

export interface AiResponseData {
  action: AiActions;
  data: AiResponse;
}
