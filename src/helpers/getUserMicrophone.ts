export const getUserMicrophone = async (): Promise<MediaStream | null> => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    return await navigator.mediaDevices.getUserMedia({
      audio: true
    });
  }
  return null;
};
