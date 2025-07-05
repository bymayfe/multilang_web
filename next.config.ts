import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
      },
      // {
      //   protocol: "https",
      //   hostname: "pbs.twimg.com", // Twitter
      // },
      {
        protocol: "https",
        hostname: "bymayfe.vercel.app",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
