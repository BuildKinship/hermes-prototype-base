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
      // Magazine slug routes → artifact UUIDs so the internal auth gate is enforced.
      // The slug URLs (/kinship-magazine-issue-X) are direct Next.js pages with no auth;
      // redirecting them to /artifact/[uuid] ensures the internal:true gate always applies.
      {
        source: "/kinship-magazine-issue-1",
        destination: "/artifact/T2mS7LYMqfxoyzNazM9K",
        permanent: false,
      },
      {
        source: "/kinship-magazine-issue-2",
        destination: "/artifact/qpObQhfRSgHa6btWJpGq",
        permanent: false,
      },
      {
        source: "/kinship-magazine-issue-3",
        destination: "/artifact/ef91d7d568154a66b8d6",
        permanent: false,
      },
      {
        source: "/kinship-magazine-issue-4",
        destination: "/artifact/x0qDQQ7t3dT5pqcooYLV",
        permanent: false,
      },
      {
        source: "/kinship-magazine-issue-5",
        destination: "/artifact/yKvElerZz0MVyrGV7DZU",
        permanent: false,
      },
      {
        source: "/kinship-magazine-issue-6",
        destination: "/artifact/iTum80LuTqWcQp9Nbaue",
        permanent: false,
      },
      {
        source: "/kinship-magazine-issue-7",
        destination: "/artifact/z7bjiiw8ZjIUX8gYWpcI",
        permanent: false,
      },
      {
        source: "/kinship-magazine-issue-8",
        destination: "/artifact/CSaxdOGWyUHfykZBenfU",
        permanent: false,
      },
      {
        source: "/kinship-magazine-issue-9",
        destination: "/artifact/Ak28ekSbt5npyVnVIvv9",
        permanent: false,
      },
      {
        source: "/kinship-magazine-issue-10",
        destination: "/artifact/lchYRUHpxLqmXHRinzRV",
        permanent: false,
      },
      {
        source: "/kinship-magazine-issue-11",
        destination: "/artifact/fQPTvVDordNXoevFY7uZ",
        permanent: false,
      },
      {
        source: "/kinship-magazine-issue-12",
        destination: "/artifact/9b9f52db67244a54a635",
        permanent: false,
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
