import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Other configurations...

  allowedDevOrigins: ['testlineoa.luangphorsodh.com', 'lineoa.luangphorsodh.com', '*.luangphorsodh.com', 'localhost'],
  output: 'standalone',
};

export default nextConfig;