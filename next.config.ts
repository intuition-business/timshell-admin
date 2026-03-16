import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    position: "bottom-right",
  },
  images: {
    domains: ["i.pravatar.cc"],
  },
};

export default nextConfig;
