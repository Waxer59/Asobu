/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mapbox does not load correctly in development mode using strict mode
  reactStrictMode: false
};

export default nextConfig;
