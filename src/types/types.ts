enum UIActions {
  OPEN_MAPS,
  OPEN_TEACH_MODE
}

interface AIServerActionResponse {
  action: UIActions | null;
  data: any;
}
