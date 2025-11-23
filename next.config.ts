import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  cacheComponents: true,
  experimental: {
    //dynamicIO: true,
    //useCache: true,
    //ppr: 'incremental',
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
