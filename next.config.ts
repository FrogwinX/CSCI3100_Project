import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // Whitelist images from backend
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "flowchatbackend.azurewebsites.net",
        port: "",
        pathname: "/api/Image/**",
      },
    ],
  },
};

export default nextConfig;
