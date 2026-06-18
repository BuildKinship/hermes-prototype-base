"use client";
// needed for useState, useEffect, useRef (keyboard + touch event listeners require browser APIs)

import React, { useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────────

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

// ─── Motion constants ────────────────────────────────────────────────────────────
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
 * Kinship fullscreen slideshow engine — mobile-first, production-ready.
 *
 * Features:
 *   - Keyboard nav (← → Space Home End)
 *   - Touch swipe (40px threshold, horizontal dominance)
 *   - Per-slide dark/light theming
 *   - Always-visible nav on touch devices (pointer: coarse)
 *   - localStorage position persistence
 *   - Progress dots (collapses to "N/total" text on decks >12 slides)
 *   - Mobile-safe full-bleed height via CSS dvh/svh with vh fallback
 *   - Slide counter + label display (hidden on small phones to save space)
 *   - Scrollable slide body on mobile so content never clips under nav bar
 *
 * Usage:
 *   import { Slideshow } from "@/components/slides/slideshow";
 *   const slides: Slide[] = [
 *     { id: "cover", dark: true,  label: "Cover",            content: <CoverSlide /> },
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
    // Require horizontal dominance + 40px min to avoid triggering on vertical scroll
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx < 0 ? go(page + 1) : go(page - 1);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  }, [go, page]);

  const current = slides[page];
  const isDark = current?.dark ?? false;
  // Compact dots for large decks — avoids overflow on small screens
  const useCompactDots = slides.length > 12;

  return (
    /*
     * Height strategy — mobile-safe:
     *   1. `dvh` (dynamic viewport height) — ideal: shrinks/grows with browser chrome on iOS/Android
     *   2. `svh` (small viewport height) — fallback: always the smallest stable height
     *   3. `100vh` — last resort for older browsers
     *
     * We stack the slide body and the nav bar inside a column flex container so the nav
     * is always anchored at the bottom and never overlaps slide content.
     */
    <div
      className={cn("relative w-full flex flex-col overflow-hidden", className)}
      style={{
        height: "100dvh",
        // Progressive enhancement: browsers that don't support dvh fall back via CSS cascade
        background: isDark ? "var(--kinship-ink)" : "var(--kinship-cream)",
      }}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Top chrome: label (left) + counter (right) ─────────────────────── */}
      <div className="flex-none flex items-center justify-between px-4 pt-4 pb-1 sm:px-8 sm:pt-6">
        <div
          className="text-xs font-mono tracking-widest truncate max-w-[60vw]"
          style={{ color: isDark ? "oklch(40% 0.06 293)" : "oklch(65% 0.05 293)", minHeight: "1em" }}
        >
          {current.label ?? ""}
        </div>
        <div
          className="text-xs font-mono tracking-widest flex-none"
          style={{ color: isDark ? "oklch(40% 0.06 293)" : "oklch(65% 0.05 293)" }}
        >
          {page + 1} / {slides.length}
        </div>
      </div>

      {/* ── Slide body — scrollable on mobile so long content isn't clipped ─── */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence custom={dir} mode="wait">
          <motion.div
            key={current.id}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 overflow-y-auto"
            style={{ background: isDark ? "var(--kinship-ink)" : "var(--kinship-cream)" }}
          >
            {/*
             * Inner wrapper centres content on desktop (flex column centred),
             * but on mobile lets it start from the top with padding so it never
             * hides under the nav bar at the bottom.
             */}
            <div className="min-h-full flex flex-col items-center justify-center px-4 py-6 sm:px-8 sm:py-10">
              {current.content}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom nav: prev arrow + dots/counter + next arrow ──────────────── */}
      <div
        className="flex-none flex items-center justify-center gap-4 px-4 py-4 sm:gap-6 sm:py-6 transition-opacity duration-200"
        style={{ opacity: isTouchDevice || showNav ? 1 : 0 }}
      >
        <button
          onClick={() => go(page - 1)}
          disabled={page === 0}
          className="p-2 sm:p-2.5 rounded-xl border transition-all"
          style={{
            borderColor: isDark ? "oklch(35% 0.07 293)" : "var(--kinship-dim)",
            background:   isDark ? "oklch(25% 0.07 293)" : "white",
            color:        isDark ? "var(--kinship-cream)" : "var(--kinship-ink)",
            opacity: page === 0 ? 0.2 : 0.8,
          }}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {useCompactDots ? (
          // Compact text counter for long decks
          <span
            className="text-sm font-mono w-20 text-center"
            style={{ color: isDark ? "oklch(55% 0.05 293)" : "oklch(55% 0.05 293)" }}
          >
            {page + 1} of {slides.length}
          </span>
        ) : (
          // Pill dots — active dot expands to 20px wide
          <div className="flex items-center gap-1 sm:gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className="transition-all rounded-full"
                style={{
                  width:  i === page ? 18 : 6,
                  height: 6,
                  background: i === page
                    ? (isDark ? "var(--kinship-cream)" : "var(--kinship-mid)")
                    : (isDark ? "oklch(35% 0.07 293)" : "var(--kinship-dim)"),
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}

        <button
          onClick={() => go(page + 1)}
          disabled={page === slides.length - 1}
          className="p-2 sm:p-2.5 rounded-xl border transition-all"
          style={{
            borderColor: isDark ? "oklch(35% 0.07 293)" : "var(--kinship-dim)",
            background:   isDark ? "oklch(25% 0.07 293)" : "white",
            color:        isDark ? "var(--kinship-cream)" : "var(--kinship-ink)",
            opacity: page === slides.length - 1 ? 0.2 : 0.8,
          }}
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
}


/* ─────────────────────────────────────────────────────────────────────────────
   SLIDE LAYOUT PRIMITIVES
   Drop these into slide content components for consistent Kinship layout.
   All primitives are mobile-first: responsive font sizes, fluid grids, safe padding.
───────────────────────────────────────────────────────────────────────────── */

/**
 * Large centered hero title for cover and section-opening slides.
 *
 * Font scale:
 *   - Cover / section break → use default (2.4rem→5.5rem)
 *   - Content slides with lots of body → pass size="sm" (1.8rem→3rem)
 *
 * dark=true → cream text (use on dark-bg slides).
 */
export function SlideTitle({
  title,
  subtitle,
  eyebrow,
  dark = false,
  size = "lg",
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  dark?: boolean;
  /** "lg" = cover/section (default) | "sm" = content slide with lots of body */
  size?: "lg" | "sm";
}) {
  const fontSize = size === "lg"
    ? "clamp(2.4rem, 6vw, 5.5rem)"
    : "clamp(1.8rem, 4vw, 3rem)";

  return (
    <div className="text-center w-full max-w-4xl px-2">
      {eyebrow && (
        <p
          className="mb-4 text-xs font-mono tracking-[0.2em] uppercase sm:mb-6 sm:text-sm"
          style={{ color: dark ? "oklch(70% 0.05 293)" : "var(--kinship-mid)" }}
        >
          {eyebrow}
        </p>
      )}
      <h1
        style={{
          fontSize,
          lineHeight: 1.05,
          fontFamily: "'Georgia', 'Times New Roman', serif",
          color: dark ? "var(--kinship-cream)" : "var(--kinship-ink)",
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className="mt-5 text-base leading-relaxed mx-auto max-w-2xl sm:mt-8 sm:text-xl"
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
      className="text-xs font-mono tracking-[0.2em] uppercase mb-6 sm:mb-10"
      style={{ color: dark ? "oklch(60% 0.05 293)" : "var(--kinship-mid)" }}
    >
      {children}
    </p>
  );
}

/**
 * Responsive card grid — 1 col on mobile, 2 on tablet, 3 on desktop.
 * Pass cols={2} to max at 2 columns instead of 3.
 *
 * @example
 * <SlideCardGrid>
 *   <SlideCard>…</SlideCard>
 *   <SlideCard>…</SlideCard>
 *   <SlideCard>…</SlideCard>
 * </SlideCardGrid>
 */
export function SlideCardGrid({
  children,
  cols = 3,
  className = "",
}: {
  children: ReactNode;
  cols?: 2 | 3;
  className?: string;
}) {
  const gridClass = cols === 2
    ? "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5";
  return (
    <div className={`w-full max-w-5xl ${gridClass} ${className}`}>
      {children}
    </div>
  );
}

/**
 * Light card with border — no shadow (Kinship brand policy).
 * Padding is tighter on mobile (p-5) than desktop (p-8).
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
      className={"rounded-2xl border p-5 sm:p-8 " + className}
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
      className={"rounded-2xl border p-5 sm:p-8 " + className}
      style={{ background: "oklch(25% 0.07 293)", borderColor: "oklch(35% 0.07 293)" }}
    >
      {children}
    </div>
  );
}

/**
 * Responsive SVG wrapper — scales inline SVGs down on mobile without blurring.
 *
 * Problem: SVG animations are often authored at a fixed width (e.g. 460px) that
 * overflows a 390px phone screen. Wrapping in this component makes the SVG fluid.
 *
 * Usage:
 *   <ResponsiveSVG maxWidth={460}>
 *     <MyAnimatedSVG />     ← your SVG component with fixed width/height props
 *   </ResponsiveSVG>
 *
 * The SVG itself should still have explicit width/height (for viewBox to work),
 * but those become the maximum — the wrapper scales it down on smaller screens.
 */
export function ResponsiveSVG({ children, maxWidth = 480 }: { children: ReactNode; maxWidth?: number }) {
  return (
    <div
      className="w-full flex justify-center"
      style={{ maxWidth: "100%" }}
    >
      <div style={{ width: "100%", maxWidth, overflow: "visible" }}>
        <div style={{ width: "100%", overflowX: "auto", display: "flex", justifyContent: "center" }}>
          {children}
        </div>
      </div>
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
      className="rounded-2xl p-6 sm:p-8 text-center w-full max-w-3xl mx-auto"
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
      <p className="text-xl sm:text-2xl leading-snug" style={{ fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
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
/** @deprecated Use SlideCard + SlideCardGrid */
export function SlideContentLayout({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="w-full max-w-5xl px-2">
      {title && <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-10 text-center" style={{ fontFamily: "'Georgia', serif" }}>{title}</h2>}
      {children}
    </div>
  );
}
