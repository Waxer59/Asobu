export enum AiActions {
  NONE,
  OPEN_MAP,
  CLOSE_MAP,
  OPEN_TEACH_MODE,
  CLOSE_TEACH_MODE,
  OPEN_TRANSLATE,
  CLOSE_TRANSLATE,
  SPOTIFY_SEARCH,
  OPEN_SPOTIFY_WEB_PLAYER,
  CLOSE_SPOTIFY_WEB_PLAYER
}

export type AiResponse = OtherData | OpenMapData | ActionData | TranslateData | SpotifySearch;

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

export interface SpotifySearch {
  text: string;
  action: AiActions.SPOTIFY_SEARCH;
}

export interface AiRequestData {
  message: string;
  img?: string;
}

export interface AiResponseData {
  action: AiActions;
  data: AiResponse;
}

export type User = {
  name: string;
  email: string;
  image: string;
};

export type Token = {
  name: string;
  email: string;
  picture: string;
  sub: string;
  access_token: string;
  iat: number;
  exp: number;
  jti: string;
};

export type AuthResponse = {
  user: User;
  expires: string;
  token: Token;
};