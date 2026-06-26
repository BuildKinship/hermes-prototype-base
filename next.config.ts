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
  async rewrites() {
    return [
      // Firebase Auth handler proxy — required for signInWithRedirect on custom domains.
      // When authDomain=quick.buildkinship.dev, Firebase redirects to
      // quick.buildkinship.dev/__/auth/handler after OAuth. This rewrite proxies those
      // requests to the real Firebase auth handler on firebaseapp.com.
      {
        source: "/__/auth/:path*",
        destination:
          "https://kinship-prototyper.firebaseapp.com/__/auth/:path*",
      },
      {
        source: "/__/firebase/:path*",
        destination:
          "https://kinship-prototyper.firebaseapp.com/__/firebase/:path*",
      },
    ];
  },
};

export default nextConfig;
