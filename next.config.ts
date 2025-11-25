import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
    appIsrStatus: false,
  },
  images: {
    domains: ["i.pravatar.cc"],
  },
};

export default nextConfig;
