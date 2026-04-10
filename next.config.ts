import type { NextConfig } from "next";

const isVercel = process.env.VERCEL === "1";

const nextConfig: NextConfig = {
  ...(isVercel
    ? {}
    : {
        output: "export",
        basePath: "/Parallax-Retail-Dashboard",
        assetPrefix: "/Parallax-Retail-Dashboard/",
      }),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
