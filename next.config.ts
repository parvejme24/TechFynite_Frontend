import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "images.unsplash.com",
      "source.unsplash.com",
      "localhost",
      "images.pexels.com",
      "example.com",
      "encrypted-tbn0.gstatic.com",
      "play-lh.googleusercontent.com",
      "media.licdn.com",
    ],
  },
};

export default nextConfig;
