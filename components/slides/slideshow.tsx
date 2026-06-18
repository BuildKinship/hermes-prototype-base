"use client";
// needed for useState, useEffect, useRef (keyboard + touch event listeners require browser APIs)

import React, { useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface Slide {
  id: string;
  content: ReactNode;
  /** Per-slide dark background override. dark=true → kinship-ink bg, cream text */
  dark?: boolean;
  /** Short label shown in top-left corner (e.g. "1 · Why we're here") */
  label?: string;
  notes?: string;
}

interface SlideshowProps {
  slides: Slide[];
  /** Storage key for localStorage persistence (defaults to "slideshow-current") */
  storageKey?: string;
  className?: string;
}

// ─── Motion constants ───────────────────────────────────────────────────────────
const EASE_OUT = [0.22, 1, 0.36, 1] as unknown as Transition["ease"];
const EASE_IN  = [0.55, 0, 1, 0.45] as unknown as Transition["ease"];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.45, ease: EASE_OUT } },
  exit: (dir: number) => ({
    x: dir > 0 ? "-60%" : "60%",
    opacity: 0,
    transition: { duration: 0.35, ease: EASE_IN },
  }),
};

/**
 * Kinship fullscreen slideshow engine — production-ready.
 *
 * Features:
 *   - Keyboard nav (← → Space Home End)
 *   - Touch swipe (40px threshold, horizontal dominance)
 *   - Per-slide dark/light theming
 *   - Always-visible nav on touch devices (pointer: coarse)
 *   - localStorage position persistence
 *   - Progress dots + prev/next arrows
 *   - Slide counter + label display
 *
 * Usage:
 *   import { Slideshow } from "@/components/slides/slideshow";
 *   const slides: Slide[] = [
 *     { id: "cover", dark: true, label: "Cover", content: <CoverSlide /> },
 *     { id: "why",   dark: false, label: "1 · Why we're here", content: <WhySlide /> },
 *   ];
 *   <Slideshow slides={slides} storageKey="my-deck-slide" />
 */
export function Slideshow({ slides, storageKey = "slideshow-current", className }: SlideshowProps) {
  const [[page, dir], setPage] = useState([0, 0]);
  const [showNav, setShowNav] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const navTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Detect touch device + restore saved position
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouchDevice(true);
      setShowNav(true);
    }
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const n = parseInt(saved, 10);
      if (!isNaN(n) && n > 0 && n < slides.length) setPage([n, 0]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = useCallback(
    (newPage: number) => {
      if (newPage < 0 || newPage >= slides.length) return;
      const d = newPage > page ? 1 : -1;
      setPage([newPage, d]);
      localStorage.setItem(storageKey, String(newPage));
    },
    [page, slides.length, storageKey]
  );

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") { e.preventDefault(); go(page + 1); }
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")                    { e.preventDefault(); go(page - 1); }
      if (e.key === "Home") go(0);
      if (e.key === "End")  go(slides.length - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go, page, slides.length]);

  // Mouse-move → show nav for 2s then hide (desktop)
  const handleMouseMove = useCallback(() => {
    setShowNav(true);
    if (navTimeout.current) clearTimeout(navTimeout.current);
    navTimeout.current = setTimeout(() => setShowNav(false), 2000);
  }, []);

  // Touch swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setShowNav(true);
    if (navTimeout.current) clearTimeout(navTimeout.current);
    navTimeout.current = setTimeout(() => setShowNav(false), 2500);
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Require horizontal dominance and 40px minimum to avoid accidental swipes during vertical scroll
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx < 0 ? go(page + 1) : go(page - 1);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  }, [go, page]);

  const current = slides[page];
  const isDark = current?.dark ?? false;

  return (
    <div
      className={cn("relative w-full h-screen overflow-hidden", className)}
      style={{ background: isDark ? "var(--kinship-ink)" : "var(--kinship-cream)" }}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <AnimatePresence custom={dir} mode="wait">
        <motion.div
          key={current.id}
          custom={dir}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: isDark ? "var(--kinship-ink)" : "var(--kinship-cream)" }}
        >
          {current.content}
        </motion.div>
      </AnimatePresence>

      {/* Top-left: slide label */}
      {current.label && (
        <div
          className="absolute top-6 left-8 text-xs font-mono tracking-widest"
          style={{ color: isDark ? "oklch(40% 0.06 293)" : "oklch(65% 0.05 293)" }}
        >
          {current.label}
        </div>
      )}

      {/* Top-right: slide counter */}
      <div
        className="absolute top-6 right-8 text-xs font-mono tracking-widest"
        style={{ color: isDark ? "oklch(40% 0.06 293)" : "oklch(65% 0.05 293)" }}
      >
        {page + 1} / {slides.length}
      </div>

      {/* Bottom: nav arrows + progress dots — always visible on touch, fade on desktop */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 transition-opacity duration-200"
        style={{ opacity: isTouchDevice || showNav ? 1 : 0 }}
      >
        <button
          onClick={() => go(page - 1)}
          disabled={page === 0}
          className="p-2.5 rounded-xl border transition-all"
          style={{
            borderColor: isDark ? "oklch(35% 0.07 293)" : "var(--kinship-dim)",
            background: isDark ? "oklch(25% 0.07 293)" : "white",
            color: isDark ? "var(--kinship-cream)" : "var(--kinship-ink)",
            opacity: page === 0 ? 0.2 : 0.8,
          }}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Progress dots — active dot expands to 20px wide */}
        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="transition-all rounded-full"
              style={{
                width: i === page ? 20 : 6,
                height: 6,
                background: i === page
                  ? (isDark ? "var(--kinship-cream)" : "var(--kinship-mid)")
                  : (isDark ? "oklch(35% 0.07 293)" : "var(--kinship-dim)"),
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => go(page + 1)}
          disabled={page === slides.length - 1}
          className="p-2.5 rounded-xl border transition-all"
          style={{
            borderColor: isDark ? "oklch(35% 0.07 293)" : "var(--kinship-dim)",
            background: isDark ? "oklch(25% 0.07 293)" : "white",
            color: isDark ? "var(--kinship-cream)" : "var(--kinship-ink)",
            opacity: page === slides.length - 1 ? 0.2 : 0.8,
          }}
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}


/* ─────────────────────────────────────────────────────────────────────────────
   SLIDE LAYOUT PRIMITIVES
   Drop these into slide content components for consistent Kinship layout.
───────────────────────────────────────────────────────────────────────────── */

/**
 * Large centered hero title for cover and section-opening slides.
 * dark=true → cream text (use on dark-bg slides).
 */
export function SlideTitle({
  title,
  subtitle,
  eyebrow,
  dark = false,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  dark?: boolean;
}) {
  return (
    <div className="text-center max-w-5xl px-8">
      {eyebrow && (
        <p
          className="mb-6 text-sm font-mono tracking-[0.2em] uppercase"
          style={{ color: dark ? "oklch(70% 0.05 293)" : "var(--kinship-mid)" }}
        >
          {eyebrow}
        </p>
      )}
      <h1
        style={{
          fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
          lineHeight: 1.05,
          fontFamily: "'Georgia', 'Times New Roman', serif",
          color: dark ? "var(--kinship-cream)" : "var(--kinship-ink)",
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className="mt-8 text-xl leading-relaxed mx-auto max-w-3xl"
          style={{ color: dark ? "oklch(70% 0.05 293)" : "oklch(50% 0.06 293)", fontWeight: 400 }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

/**
 * Small section label shown above slide titles.
 * e.g. <SectionLabel dark>4 · Hermes</SectionLabel>
 */
export function SectionLabel({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p
      className="text-xs font-mono tracking-[0.2em] uppercase mb-10"
      style={{ color: dark ? "oklch(60% 0.05 293)" : "var(--kinship-mid)" }}
    >
      {children}
    </p>
  );
}

/**
 * Light card with border — no shadow (Kinship brand policy).
 */
export function SlideCard({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={"rounded-2xl border p-8 " + className}
      style={{ background: "white", borderColor: "var(--kinship-dim)", ...style }}
    >
      {children}
    </div>
  );
}

/**
 * Dark card for use on dark-background slides.
 */
export function SlideDarkCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={"rounded-2xl border p-8 " + className}
      style={{ background: "oklch(25% 0.07 293)", borderColor: "oklch(35% 0.07 293)" }}
    >
      {children}
    </div>
  );
}

/**
 * "Ask the Room" interstitial bubble — use on dark slides for discussion prompts.
 * Wraps a mic icon + label + italic serif question.
 *
 * @example
 * <AskBubble>"If Hermes could do one thing for your role, what would it be?"</AskBubble>
 */
export function AskBubble({ children }: { children: ReactNode }) {
  return (
    <div
      className="rounded-2xl p-8 text-center max-w-3xl"
      style={{ background: "oklch(25% 0.07 293)", color: "var(--kinship-cream)" }}
    >
      <div className="flex items-center justify-center gap-2 mb-4">
        {/* Mic icon inline so no lucide import needed in caller */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ color: "oklch(55% 0.04 293)" }} aria-hidden="true">
          <rect x="9" y="2" width="6" height="11" rx="3"/>
          <path d="M5 10a7 7 0 0 0 14 0"/>
          <line x1="12" y1="19" x2="12" y2="22"/>
          <line x1="8"  y1="22" x2="16" y2="22"/>
        </svg>
        <span className="text-xs font-mono tracking-[0.2em] uppercase" style={{ color: "oklch(55% 0.04 293)" }}>
          Ask the room
        </span>
      </div>
      <p className="text-2xl leading-snug" style={{ fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
        {children}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LEGACY EXPORTS (backwards compat — new code should use SlideTitle/SlideCard)
───────────────────────────────────────────────────────────────────────────── */
/** @deprecated Use SlideTitle */
export const SlideTitleLayout = SlideTitle;
/** @deprecated Use SlideCard */
export function SlideContentLayout({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="w-full max-w-5xl">
      {title && <h2 className="text-3xl mb-10 text-center" style={{ fontFamily: "'Georgia', serif" }}>{title}</h2>}
      {children}
    </div>
  );
}
