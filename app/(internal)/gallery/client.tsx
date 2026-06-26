"use client";
// needed for search/filter/sort state, Help modal, image carousel, and interactive gallery

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useMediaUrl, useMediaUrls } from "@/hooks/useMediaUrl";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ExternalLink,
  Layers,
  Sparkles,
  Box,
  LayoutDashboard,
  ClipboardList,
  Shapes,
  X,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Video,
  Copy,
  Check,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PrototypeManifest, PrototypeType } from "@/types/manifest";
import { PrototypeDrawer } from "./drawer";

/* ─── Constants ─────────────────────────────────────────── */

const TYPE_META: Record<
  PrototypeType,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  slide: { label: "Slide", icon: Layers, color: "var(--subject-reading)" },
  animation: { label: "Animation", icon: Sparkles, color: "var(--subject-math)" },
  "3d": { label: "3D / Interactive", icon: Box, color: "var(--subject-science)" },
  dashboard: { label: "Dashboard", icon: LayoutDashboard, color: "var(--kinship-mid)" },
  survey: { label: "Survey", icon: ClipboardList, color: "var(--subject-writing)" },
  image: { label: "Image", icon: ImageIcon, color: "#EC4899" },
  video: { label: "Video", icon: Video, color: "#F97316" },
  other: { label: "Other", icon: Shapes, color: "var(--kinship-dim)" },
};

const HELP_STORAGE_KEY = "kinship-gallery-visited";

type SortKey = "newest" | "oldest" | "creator" | "name";

/* ─── Help Modal ─────────────────────────────────────────── */

const prototypeExamples = [
  { type: "Slide deck", prompt: "Build a 6-slide deck for a school principal intro meeting — the Kinship pitch." },
  { type: "Dashboard", prompt: "Prototype a teacher morning view — 22 Grade 3 students, color-coded by status." },
  { type: "Animation", prompt: "Animate how Kinship ingests IXL data and surfaces it on the teacher dashboard." },
  { type: "3D visual", prompt: "Build a 3D rotating Kinship K-mark with soft studio lighting." },
  { type: "Image", prompt: "Generate a hero image for the Kinship brain all-hands deck — abstract, on-brand." },
  { type: "Video", prompt: "Turn this reference image into a 5-second animated brand video." },
];

function CopyPromptButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className="flex items-center gap-1 text-[10px] opacity-40 hover:opacity-80 transition-opacity"
    >
      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
      {copied ? "copied" : "copy"}
    </button>
  );
}

function HelpModal({ onClose }: { onClose: () => void }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        key="help-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      >
        <motion.div
          key="help-panel"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-2xl max-h-[90dvh] overflow-y-auto rounded-2xl flex flex-col"
          style={{ background: "var(--kinship-cream)", boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex-shrink-0 flex items-start justify-between px-5 pt-6 pb-5 sm:px-8 sm:pt-8 sm:pb-6"
            style={{ borderBottom: "1px solid color-mix(in oklch, var(--kinship-dim) 30%, transparent)" }}
          >
            <div className="min-w-0 flex-1 pr-3">
              <p className="section-label mb-2">kinship prototype engine</p>
              <h2 className="text-serif text-2xl sm:text-3xl font-bold mb-2" style={{ color: "var(--kinship-ink)" }}>
                From idea to artifact{" "}
                <span style={{ color: "var(--kinship-mid)" }}>in minutes.</span>
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--kinship-mid)" }}>
                Ask Hermes in Slack to build something — slide decks, dashboard mockups,
                3D visuals, animations, images, and videos — all on brand, all tracked here.
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-[color-mix(in_oklch,var(--kinship-dim)_20%,transparent)]"
              style={{ color: "var(--kinship-mid)" }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-5 py-5 sm:px-8 sm:py-6 flex flex-col gap-6 sm:gap-8">
            {/* How it works */}
            <div>
              <p className="section-label mb-3">how to use</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                {[
                  { n: "01", label: "Message Hermes", text: "Send a request in Slack — describe what you want built or generated." },
                  { n: "02", label: "Hermes builds it", text: "Hermes plans, builds, and delivers a live URL or file in minutes." },
                  { n: "03", label: "It lands here", text: "Every artifact — prototype, image, or video — appears in this gallery." },
                ].map((step) => (
                  <div
                    key={step.n}
                    className="rounded-lg border p-3 sm:p-4 flex sm:flex-col gap-3 sm:gap-0"
                    style={{
                      borderColor: "color-mix(in oklch, var(--kinship-dim) 30%, transparent)",
                      background: "white",
                    }}
                  >
                    <p className="text-serif flex-shrink-0 sm:mb-2" style={{ fontSize: "1.5rem", color: "var(--kinship-dim)", lineHeight: 1 }}>
                      {step.n}
                    </p>
                    <div>
                      <p className="text-xs font-semibold mb-0.5 sm:mb-1" style={{ color: "var(--kinship-ink)" }}>
                        {step.label}
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: "var(--kinship-mid)" }}>
                        {step.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Example prompts */}
            <div>
              <p className="section-label mb-3">example prompts — copy and send to Hermes in Slack</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {prototypeExamples.map((ex) => (
                  <div
                    key={ex.type}
                    className="rounded-lg border p-3"
                    style={{
                      borderColor: "color-mix(in oklch, var(--kinship-dim) 25%, transparent)",
                      background: "white",
                    }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className="text-[10px] font-semibold uppercase tracking-wide"
                        style={{ color: "var(--kinship-mid)" }}
                      >
                        {ex.type}
                      </span>
                      <CopyPromptButton text={ex.prompt} />
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: "var(--kinship-mid)" }}>
                      &ldquo;{ex.prompt}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reading gallery cards */}
            <div>
              <p className="section-label mb-3">reading the gallery</p>
              <div
                className="rounded-lg border p-3 sm:p-4 text-xs leading-relaxed space-y-2"
                style={{
                  borderColor: "color-mix(in oklch, var(--kinship-dim) 25%, transparent)",
                  background: "white",
                  color: "var(--kinship-mid)",
                }}
              >
                <p>
                  <span className="font-semibold" style={{ color: "var(--kinship-ink)" }}>Thumbnail area</span>
                  {" "}— click the image/video to open the artifact directly. Image cards show a carousel if multiple images were generated.
                </p>
                <p>
                  <span className="font-semibold" style={{ color: "var(--kinship-ink)" }}>Card body</span>
                  {" "}— click anywhere below the thumbnail to open the detail drawer: full prompt, Slack thread, design decisions, and input attachments.
                </p>
                <p>
                  <span className="font-semibold" style={{ color: "var(--kinship-ink)" }}>Filters</span>
                  {" "}— use the type filters at the top to narrow the gallery. Search works across name, prompt, creator, and tags.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex-shrink-0 flex items-center justify-between gap-4 px-5 py-4 sm:px-8 sm:py-5"
            style={{ borderTop: "1px solid color-mix(in oklch, var(--kinship-dim) 30%, transparent)" }}
          >
            <p className="text-xs hidden sm:block" style={{ color: "var(--kinship-dim)" }}>
              kinship prototype engine · managed by hermes
            </p>
            <button
              onClick={onClose}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{ background: "var(--kinship-ink)", color: "var(--kinship-cream)" }}
            >
              Got it <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─── Image Carousel ─────────────────────────────────────── */

function ImageCarousel({ images, name }: { images: string[]; name: string }) {
  // images[] may be S3 keys OR legacy presigned URLs — resolve to live URLs
  const resolvedUrls = useMediaUrls(images);
  const [idx, setIdx] = useState(0);
  const prev = useCallback(() => setIdx((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIdx((i) => (i + 1) % images.length), [images.length]);

  if (images.length === 0) return null;

  if (images.length === 1) {
    const src = resolvedUrls[0];
    if (!src) return (
      <div className="w-full h-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.06)" }}>
        <ImageIcon className="w-8 h-8 opacity-20" />
      </div>
    );
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={name} className="w-full h-full object-cover object-center" />
    );
  }

  const currentSrc = resolvedUrls[idx];

  return (
    <div className="relative w-full h-full group/carousel">
      <AnimatePresence mode="wait">
        {currentSrc ? (
          <motion.img
            key={idx}
            src={currentSrc}
            alt={`${name} ${idx + 1} of ${images.length}`}
            className="w-full h-full object-cover object-center absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        ) : (
          <div key="loading" className="w-full h-full absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.06)" }}>
            <ImageIcon className="w-8 h-8 opacity-20" />
          </div>
        )}
      </AnimatePresence>
      {/* Prev/Next */}
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); prev(); }}
        className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10"
        style={{ background: "rgba(0,0,0,0.55)", color: "white" }}
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); next(); }}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10"
        style={{ background: "rgba(0,0,0,0.55)", color: "white" }}
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
      {/* Dots */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIdx(i); }}
            className="w-1.5 h-1.5 rounded-full transition-all"
            style={{ background: i === idx ? "white" : "rgba(255,255,255,0.4)" }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Video Thumbnail ────────────────────────────────────── */

function VideoThumbnail({ src: keyOrUrl, name }: { src: string; name: string }) {
  // keyOrUrl may be an S3 key or a legacy presigned URL — resolve to a live URL
  const { url: src } = useMediaUrl(keyOrUrl);
  const videoRef = useRef<HTMLVideoElement>(null);
  return (
    <div className="relative w-full h-full group/video">
      {src ? (
        /* eslint-disable-next-line jsx-a11y/media-has-caption */
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-cover"
          preload="metadata"
          playsInline
          muted
          onMouseEnter={() => videoRef.current?.play()}
          onMouseLeave={() => { if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; } }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.08)" }}>
          <Video className="w-8 h-8 opacity-20" />
        </div>
      )}
      {/* Play icon overlay */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover/video:opacity-0 transition-opacity"
        style={{ background: "rgba(0,0,0,0.25)" }}
      >
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.55)" }}
        >
          <Video className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
}

/* ─── Type Badge ─────────────────────────────────────────── */

function TypeBadge({ type }: { type: PrototypeType }) {
  const meta = TYPE_META[type] ?? TYPE_META.other;
  const Icon = meta.icon;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide border"
      style={{
        color: meta.color,
        borderColor: meta.color,
        background: `color-mix(in oklch, ${meta.color} 10%, transparent)`,
      }}
    >
      <Icon className="w-3 h-3" />
      {meta.label}
    </span>
  );
}

/* ─── Prototype Card ─────────────────────────────────────── */

function PrototypeCard({ m, onOpenDrawer }: { m: PrototypeManifest; onOpenDrawer: () => void }) {
  // created_at (manifest field) may be absent on older docs written by firebase-admin MCP,
  // which stores the timestamp as `createdAt` instead. Fall back gracefully.
  const rawDate = m.created_at || (m as unknown as Record<string, unknown>).createdAt as string | undefined;
  const dateObj = rawDate ? new Date(rawDate) : null;
  const date = dateObj && !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })
    : "—";

  const initials = m.created_by_name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Resolve the "open" href for image/video cards via the API route.
  // For images we resolve just the first image key for the card-level link;
  // ImageCarousel handles all of them internally.
  // For non-media types we use the static artifact URL as-is.
  const firstImageKey = m.type === "image" ? (m.media_images?.[0] ?? null) : null;
  const videoKey      = m.type === "video" ? (m.media_video ?? null) : null;
  const { url: firstImageUrl } = useMediaUrl(firstImageKey);
  const { url: videoUrl }      = useMediaUrl(videoKey);

  // Determine thumbnail content based on type
  const renderThumbnail = () => {
    if (m.type === "image" && m.media_images && m.media_images.length > 0) {
      return <ImageCarousel images={m.media_images} name={m.name} />;
    }
    if (m.type === "video" && m.media_video) {
      return <VideoThumbnail src={m.media_video} name={m.name} />;
    }
    if (m.thumbnail) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/prototypes/${m.slug}/thumbnail.png`}
          alt={m.name}
          className="w-full h-full object-cover object-top"
        />
      );
    }
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ background: "color-mix(in oklch, var(--kinship-mid) 8%, var(--kinship-cream))" }}
      >
        <span className="text-4xl opacity-20">⬡</span>
      </div>
    );
  };

  // For image/video types, the thumbnail itself IS the artifact — link opens the media.
  // Use resolved (fresh) URLs, not whatever was stored in Firestore.
  const artifactHref =
    m.type === "image" ? (firstImageUrl ?? "#")
    : m.type === "video" ? (videoUrl ?? "#")
    : m.url;

  const openLabel = m.type === "image" ? "View" : m.type === "video" ? "Watch" : "Open";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-lg border flex flex-col overflow-hidden"
      style={{ borderColor: "color-mix(in oklch, var(--kinship-dim) 40%, transparent)" }}
    >
      {/* Thumbnail */}
      <div
        className="relative h-44 flex items-center justify-center overflow-hidden"
        style={{ background: "color-mix(in oklch, var(--kinship-mid) 6%, var(--kinship-cream))" }}
      >
        <a
          href={artifactHref}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center group"
        >
          {renderThumbnail()}
          {/* hover overlay — only show for non-image/video since those have their own controls */}
          {m.type !== "image" && m.type !== "video" && (
            <>
              <div className="absolute inset-0 bg-[var(--kinship-ink)] opacity-0 group-hover:opacity-20 transition-opacity duration-200" />
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium"
                  style={{ background: "var(--kinship-ink)", color: "var(--kinship-cream)" }}
                >
                  <ExternalLink className="w-3 h-3" /> {openLabel}
                </span>
              </div>
            </>
          )}
          {/* For image/video, just show a subtle open indicator */}
          {(m.type === "image" || m.type === "video") && (
            <div className="absolute bottom-2 right-2">
              <span
                className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-medium opacity-70"
                style={{ background: "rgba(0,0,0,0.5)", color: "white" }}
              >
                <ExternalLink className="w-2.5 h-2.5" /> {openLabel}
              </span>
            </div>
          )}
        </a>
      </div>

      {/* Body — click to open drawer */}
      <div
        className="flex flex-col gap-3 p-4 flex-1 cursor-pointer group/body transition-colors"
        style={{ background: "white" }}
        onClick={onOpenDrawer}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onOpenDrawer(); }}
        aria-label={`View details for ${m.name}`}
        title="Click for full details"
      >
        <div className="flex items-start justify-between gap-2">
          <h3
            className="font-semibold text-sm leading-snug"
            style={{ color: "var(--kinship-ink)" }}
          >
            {m.name}
          </h3>
          <TypeBadge type={m.type} />
        </div>

        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--kinship-mid)" }}>
          {m.description}
        </p>

        {/* Prompt excerpt */}
        <div
          className="rounded-md px-3 py-2 text-xs italic line-clamp-2"
          style={{
            background: "color-mix(in oklch, var(--kinship-cream) 60%, transparent)",
            color: "var(--kinship-mid)",
            borderLeft: "2px solid var(--kinship-dim)",
          }}
        >
          &ldquo;{m.prompt}&rdquo;
        </div>

        {/* Input attachments indicator */}
        {m.input_attachments && m.input_attachments.length > 0 && (
          <div
            className="flex items-center gap-1.5 text-[10px]"
            style={{ color: "var(--kinship-dim)" }}
          >
            <span>📎</span>
            <span>
              {m.input_attachments.length} input attachment{m.input_attachments.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Tags */}
        {m.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {m.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 rounded font-mono"
                style={{
                  background: "color-mix(in oklch, var(--kinship-dim) 20%, transparent)",
                  color: "var(--kinship-mid)",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Admin PIN — shown on survey-type prototypes */}
        {m.admin_code && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg border"
            style={{
              borderColor: "color-mix(in oklch, var(--kinship-dim) 30%, transparent)",
              background: "color-mix(in oklch, var(--kinship-cream) 80%, transparent)",
            }}
          >
            <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 16 16" fill="none" style={{ color: "var(--kinship-dim)" }}>
              <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-[11px]" style={{ color: "var(--kinship-dim)" }}>
              Admin PIN:
            </span>
            <span
              className="text-[11px] font-mono font-bold tracking-widest"
              style={{ color: "var(--kinship-ink)" }}
            >
              {m.admin_code}
            </span>
            {m.admin_url && (
              <a
                href={m.admin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-[10px] hover:underline flex-shrink-0"
                style={{ color: "var(--kinship-mid)" }}
                onClick={(e) => e.stopPropagation()}
              >
                Open →
              </a>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t" style={{ borderColor: "color-mix(in oklch, var(--kinship-dim) 30%, transparent)" }}>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
              style={{ background: "var(--kinship-mid)", color: "white" }}
            >
              {initials}
            </div>
            <span className="text-xs" style={{ color: "var(--kinship-mid)" }}>
              {m.created_by_name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px]" style={{ color: "var(--kinship-dim)" }}>
              {date}
            </span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover/body:opacity-100 transition-opacity"
              style={{ background: "color-mix(in oklch, var(--kinship-ink) 8%, transparent)", color: "var(--kinship-ink)" }}
            >
              Details →
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Gallery Client ───────────────────────────────── */

export function GalleryClient({ manifests }: { manifests: PrototypeManifest[] }) {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<PrototypeType | "all">("all");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("newest");
  const [drawerManifest, setDrawerManifest] = useState<PrototypeManifest | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  // First-visit detection: show Help modal automatically once
  useEffect(() => {
    const visited = localStorage.getItem(HELP_STORAGE_KEY);
    if (!visited) {
      setShowHelp(true);
      localStorage.setItem(HELP_STORAGE_KEY, "1");
    }
  }, []);

  const closeHelp = useCallback(() => setShowHelp(false), []);

  // Collect all unique tags from manifests
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    manifests.forEach((m) => m.tags.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [manifests]);

  const filtered = useMemo(() => {
    let list = [...manifests];

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.prompt.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.created_by_name.toLowerCase().includes(q) ||
          m.tags.some((t) => t.includes(q))
      );
    }

    if (activeType !== "all") {
      list = list.filter((m) => m.type === activeType);
    }

    if (activeTag) {
      list = list.filter((m) => m.tags.includes(activeTag));
    }

    switch (sort) {
      case "newest":
        list.sort((a, b) => {
          const getMs = (m: PrototypeManifest) => {
            const raw = m.created_at || (m as unknown as Record<string, unknown>).createdAt as string | undefined;
            const ms = raw ? new Date(raw).getTime() : 0;
            return isNaN(ms) ? 0 : ms;
          };
          return getMs(b) - getMs(a);
        });
        break;
      case "oldest":
        list.sort((a, b) => {
          const getMs = (m: PrototypeManifest) => {
            const raw = m.created_at || (m as unknown as Record<string, unknown>).createdAt as string | undefined;
            const ms = raw ? new Date(raw).getTime() : 0;
            return isNaN(ms) ? 0 : ms;
          };
          return getMs(a) - getMs(b);
        });
        break;
      case "creator":
        list.sort((a, b) => a.created_by_name.localeCompare(b.created_by_name));
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return list;
  }, [manifests, query, activeType, activeTag, sort]);

  return (
    <main
      className="min-h-screen"
      style={{ background: "var(--kinship-cream)", color: "var(--kinship-ink)" }}
    >
      {/* Help Modal */}
      {showHelp && <HelpModal onClose={closeHelp} />}

      {/* Header */}
      <div
        className="border-b px-6 py-6"
        style={{ borderColor: "color-mix(in oklch, var(--kinship-dim) 30%, transparent)" }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="section-label mb-1">kinship prototype engine</p>
            <h1 className="text-serif text-3xl font-bold" style={{ color: "var(--kinship-ink)" }}>
              Artifact Gallery
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--kinship-mid)" }}>
              {manifests.length} artifact{manifests.length !== 1 ? "s" : ""} — prototypes, images, and videos built by the team
            </p>
          </div>
          {/* Help button */}
          <button
            onClick={() => setShowHelp(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium transition-all hover:bg-white"
            style={{
              borderColor: "color-mix(in oklch, var(--kinship-dim) 40%, transparent)",
              color: "var(--kinship-mid)",
            }}
            title="How to use the prototype engine"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Help</span>
          </button>
        </div>
      </div>

      {/* Controls — single sticky row, horizontally scrollable overflow */}
      <div
        className="sticky top-0 z-10 border-b backdrop-blur-sm"
        style={{
          borderColor: "color-mix(in oklch, var(--kinship-dim) 30%, transparent)",
          background: "color-mix(in oklch, var(--kinship-cream) 90%, transparent)",
        }}
      >
        <div
          className="max-w-6xl mx-auto flex items-center gap-2 px-6 py-3 overflow-x-auto"
          style={{ scrollbarWidth: "none" }}
        >
          {/* Search — fixed width, never shrinks below this */}
          <div className="relative flex-shrink-0 w-52">
            <Search
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
              style={{ color: "var(--kinship-dim)" }}
            />
            <input
              type="text"
              placeholder="Search…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-full border pl-8 pr-3 py-1.5 text-xs outline-none focus:ring-2"
              style={{
                background: "white",
                borderColor: "var(--kinship-dim)",
                color: "var(--kinship-ink)",
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2"
                style={{ color: "var(--kinship-dim)" }}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="flex-shrink-0 w-px h-5 self-center" style={{ background: "color-mix(in oklch, var(--kinship-dim) 40%, transparent)" }} />

          {/* Type filter pills — inline, no wrap */}
          {(["all", ...Object.keys(TYPE_META)] as (PrototypeType | "all")[]).map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={cn(
                "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 whitespace-nowrap",
                activeType === t ? "border-transparent" : "bg-white"
              )}
              style={
                activeType === t
                  ? { background: "var(--kinship-ink)", color: "var(--kinship-cream)", borderColor: "var(--kinship-ink)" }
                  : { borderColor: "var(--kinship-dim)", color: "var(--kinship-mid)" }
              }
            >
              {t === "all" ? "All" : TYPE_META[t as PrototypeType].label}
            </button>
          ))}

          {/* Spacer pushes sort to the right when there's room */}
          <div className="flex-1 flex-shrink-0 min-w-2" />

          {/* Divider */}
          <div className="flex-shrink-0 w-px h-5 self-center" style={{ background: "color-mix(in oklch, var(--kinship-dim) 40%, transparent)" }} />

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="flex-shrink-0 rounded-full border px-3 py-1.5 text-xs outline-none whitespace-nowrap"
            style={{
              background: "white",
              borderColor: "var(--kinship-dim)",
              color: "var(--kinship-mid)",
            }}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="creator">By creator</option>
            <option value="name">By name</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-24" style={{ color: "var(--kinship-dim)" }}>
            <p className="text-2xl mb-2">No artifacts found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <p className="text-xs mb-6" style={{ color: "var(--kinship-dim)" }}>
              {filtered.length} of {manifests.length} artifact{manifests.length !== 1 ? "s" : ""}
            </p>
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((m) => (
                  <PrototypeCard key={m.slug} m={m} onOpenDrawer={() => setDrawerManifest(m)} />
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>
      <PrototypeDrawer manifest={drawerManifest} onClose={() => setDrawerManifest(null)} />
    </main>
  );
}
