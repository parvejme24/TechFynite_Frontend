import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "images.unsplash.com", 
      "source.unsplash.com", 
      "localhost",
      "127.0.0.1",
      "localhost:5000",
      "127.0.0.1:5000"
    ],
  },
};

export default nextConfig;
