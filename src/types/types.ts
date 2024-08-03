export enum AiActions {
  NONE,
  OPEN_MAP,
  CLOSE_MAP,
  OPEN_TEACH_MODE,
  CLOSE_TEACH_MODE,
  VISION,
  SPOTIFY_SEARCH,
  OPEN_SPOTIFY_WEB_PLAYER,
  CLOSE_SPOTIFY_WEB_PLAYER
}

export type AiResponse = OtherData | OpenMapData | SpotifySearch;

export interface OtherData {
  text: string;
  action: AiActions.NONE;
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
