import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_PROTOTYPE_NAME
    ? `${process.env.NEXT_PUBLIC_PROTOTYPE_NAME} — Kinship Prototype`
    : "Kinship Prototype Base",
  description: "Hermes-managed prototype base",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Global nav — shown on every page */}
        <nav
          className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b"
          style={{
            background: "var(--kinship-ink)",
            borderColor: "color-mix(in oklch, white 10%, transparent)",
          }}
        >
          <Link
            href="/"
            className="text-xs font-semibold tracking-widest uppercase opacity-70 hover:opacity-100 transition-opacity"
            style={{ color: "var(--kinship-cream)" }}
          >
            Kinship Prototype Engine
          </Link>
          <Link
            href="/gallery"
            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 hover:scale-105"
            style={{
              background: "color-mix(in oklch, var(--kinship-cream) 15%, transparent)",
              color: "var(--kinship-cream)",
              border: "1px solid color-mix(in oklch, var(--kinship-cream) 25%, transparent)",
            }}
          >
            <span>⬡</span>
            Prototype Gallery
          </Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
