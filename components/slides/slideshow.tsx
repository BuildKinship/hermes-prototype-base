"use client";
// needed for useState (slide navigation) and keyboard event listeners

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Slide {
  id: string;
  content: React.ReactNode;
  notes?: string;
}

interface SlideshowProps {
  slides: Slide[];
  theme?: "kinship" | "dark" | "light";
  className?: string;
}

const EASE_OUT = [0.22, 1, 0.36, 1] as unknown as Transition["ease"];
const EASE_IN = [0.55, 0, 1, 0.45] as unknown as Transition["ease"];

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? "-100%" : "100%",
    opacity: 0,
    transition: { duration: 0.3, ease: EASE_IN },
  }),
};

/**
 * Kinship-themed slideshow engine.
 * Usage:
 *   import { Slideshow } from "@/components/slides/slideshow";
 *   const slides = [{ id: "1", content: <MySlide /> }];
 *   <Slideshow slides={slides} />
 */
export function Slideshow({ slides, theme = "kinship", className }: SlideshowProps) {
  const [[page, dir], setPage] = useState([0, 0]);

  const go = useCallback(
    (newPage: number) => {
      if (newPage < 0 || newPage >= slides.length) return;
      setPage([newPage, newPage > page ? 1 : -1]);
    },
    [page, slides.length]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") go(page + 1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(page - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go, page]);

  const themeClasses = {
    kinship: "bg-[var(--kinship-cream)] text-[var(--kinship-ink)]",
    dark:    "bg-[var(--kinship-ink)] text-[var(--kinship-cream)]",
    light:   "bg-white text-[var(--kinship-ink)]",
  };

  return (
    <div
      className={cn(
        "relative w-full h-screen overflow-hidden",
        themeClasses[theme],
        className
      )}
    >
      <AnimatePresence custom={dir} initial={false}>
        <motion.div
          key={page}
          custom={dir}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 flex flex-col items-center justify-center p-16"
        >
          {slides[page]?.content}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-4">
        <button
          onClick={() => go(page - 1)}
          disabled={page === 0}
          className="p-2 rounded-lg border opacity-50 hover:opacity-100 disabled:opacity-20 transition-opacity"
          style={{ borderColor: "color-mix(in oklch, currentColor 25%, transparent)" }}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all",
                i === page
                  ? "bg-current opacity-80 scale-125"
                  : "bg-current opacity-25 hover:opacity-50"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => go(page + 1)}
          disabled={page === slides.length - 1}
          className="p-2 rounded-lg border opacity-50 hover:opacity-100 disabled:opacity-20 transition-opacity"
          style={{ borderColor: "color-mix(in oklch, currentColor 25%, transparent)" }}
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Slide counter */}
      <div className="absolute top-6 right-8 section-label opacity-60">
        {page + 1} / {slides.length}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SLIDE LAYOUT PRIMITIVES
   Use these inside slide content for consistent layout
───────────────────────────────────────────────────────────── */

export function SlideTitleLayout({
  title,
  subtitle,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}) {
  return (
    <div className="text-center max-w-4xl">
      {eyebrow && <p className="section-label mb-6">{eyebrow}</p>}
      <h1 className="text-serif" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)", lineHeight: 1.1 }}>
        {title}
      </h1>
      {subtitle && (
        <p className="mt-6 text-xl opacity-60 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}

export function SlideContentLayout({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-5xl">
      {title && (
        <h2 className="text-serif text-3xl mb-10 text-center">{title}</h2>
      )}
      {children}
    </div>
  );
}
