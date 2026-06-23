import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  async redirects() {
    return [
      // Old survey admin URL → new Google-auth-gated route
      {
        source: "/survey/:slug/admin",
        destination: "/survey-admin/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
