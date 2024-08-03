export enum AiActions {
  NONE,
  OPEN_MAP,
  CLOSE_MAP,
  OPEN_TEACH_MODE,
  CLOSE_TEACH_MODE,
  VISION
}

export type AiResponse = OtherData | OpenMapData;

export interface OtherData {
  text: string;
  action: AiActions.NONE;
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
