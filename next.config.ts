import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Remove the deprecated domains array
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;