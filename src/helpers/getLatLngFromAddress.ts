import { getEnv } from "./getEnv";

export const getLatLngFromAddress = async (
  adddress: string
): Promise<{ lat: number; lng: number } | null> => {
  const apiKey = getEnv("GOOGLE_API_KEY");

  try {
    const resp = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${adddress}&key=${apiKey}`
    );
    const data = await resp.json();
    const { lat, lng } = data.results[0].geometry.location;
    return { lat, lng };
  } catch (error) {
    console.log(error);
  }

  return null;
};
