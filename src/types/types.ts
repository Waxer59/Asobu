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