export const getEnv = (key: string): string | null => {
  const value = process.env[key];
  return value ?? null;
};
