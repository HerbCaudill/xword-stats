import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.PORTLESS_URL
    ? {
        allowedDevOrigins: [new URL(process.env.PORTLESS_URL).hostname],
        distDir: `.next-localhost-${process.env.PORT}`,
      }
    : {}),
  /* config options here */
};

export default nextConfig;
