import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["statik.tempo.co", "horizon.com", "traveltolyon.com"],
  },
};

export default nextConfig;
