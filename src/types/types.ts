export enum AiActions {
  NONE,
  OPEN_MAP,
  CLOSE_MAP,
  OPEN_TEACH_MODE,
  CLOSE_TEACH_MODE,
  VISION
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
  text: string;
  action: AiActions;
  data?: OpenMapData | VisionData;
}

export interface VisionData {
  text: string;
  action: AiActions.VISION;
}
