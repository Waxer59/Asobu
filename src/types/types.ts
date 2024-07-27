export enum AiActions {
  NONE,
  OPEN_MAP,
  CLOSE_MAP,
  OPEN_TEACH_MODE,
  CLOSE_TEACH_MODE
}

export interface OpenMapData {
  from?: string;
  to: string;
}

export interface AiRequestData {
  message: string;
  img: string;
}

export interface AiResponseData {
  text: string;
  action?: AiActions;
  data?: OpenMapData;
}
