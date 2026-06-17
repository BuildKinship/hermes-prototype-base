"use client";
// needed for useState (copy button state) and interactive prompt cards

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Layers,
  Sparkles,
  Box,
  LayoutDashboard,
  Copy,
  Check,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Types ────────────────────────────────────────────────── */

interface PromptExample {
  label: string;
  prompt: string;
}

interface PrototypeType {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  capability: string;
  examples: PromptExample[];
  color: string;
  bgClass: string;
}

/* ─── Data ─────────────────────────────────────────────────── */

const prototypeTypes: PrototypeType[] = [
  {
    id: "slides",
    icon: Layers,
    title: "Slide Decks",
    description:
      "Research a topic and produce a polished Kinship-themed presentation — ready to present in minutes.",
    capability:
      "Keyboard-navigable slides with Kinship brand colors, serif headings, and animated transitions. Supports title slides, content layouts, data charts, and quote slides.",
    examples: [
      {
        label: "Pilot overview",
        prompt:
          "Build a slide deck summarizing the Robbins Hebrew Academy pilot — what Kinship does, who uses it, and early outcomes we expect.",
      },
      {
        label: "Sales deck",
        prompt:
          "Create a 6-slide deck for a school principal intro meeting. Cover the problem, the Kinship solution, what teachers experience, and next steps.",
      },
      {
        label: "Feature pitch",
        prompt:
          "Make a slide deck pitching the Kinship Horizon parent portal to school leadership — design, value props, and sample screens.",
      },
    ],
    color: "var(--kinship-mid)",
    bgClass:
      "bg-[color-mix(in_oklch,var(--kinship-mid)_8%,var(--kinship-cream))]",
  },
  {
    id: "animation",
    icon: Sparkles,
    title: "Animations & Visuals",
    description:
      "Bring concepts to life with motion — from data flows to abstract concepts to branded visual stories.",
    capability:
      "Framer Motion for 2D transitions and entrance sequences. GSAP for timeline-based animations. Spring physics via react-spring. Lottie for icon-level polish.",
    examples: [
      {
        label: "Data flow",
        prompt:
          "Animate how Kinship ingests data from IXL and surfaces it on the teacher dashboard — a flowing visual that shows the pipeline.",
      },
      {
        label: "Concept visual",
        prompt:
          "Build an animated visualization of the 'compressed academics' concept — students completing 4 hours of learning in 2 hours using the right tools.",
      },
      {
        label: "Onboarding motion",
        prompt:
          "Create a short animated sequence showing a new teacher's first morning using Kinship — arriving, seeing the dashboard, taking action.",
      },
    ],
    color: "#F59E0B",
    bgClass: "bg-[color-mix(in_oklch,#F59E0B_8%,var(--kinship-cream))]",
  },
  {
    id: "3d",
    icon: Box,
    title: "3D & Interactive",
    description:
      "Three.js-powered 3D scenes, interactive objects, and immersive visual experiences.",
    capability:
      "React Three Fiber + Drei for 3D scenes with orbit controls, lighting, and shaders. Full GPU-accelerated rendering in the browser via WebGL.",
    examples: [
      {
        label: "3D logo",
        prompt:
          "Build a 3D rotating Kinship K-mark in the brand ink color with soft studio lighting and a subtle cream background.",
      },
      {
        label: "Data globe",
        prompt:
          "Create an interactive 3D globe showing Canadian schools in Kinship's pipeline — each school is a glowing dot the user can hover to see details.",
      },
      {
        label: "Abstract concept",
        prompt:
          "Build a 3D particle system that visualizes 20 students learning simultaneously — each particle represents a student, color-coded by subject.",
      },
    ],
    color: "#22C55E",
    bgClass: "bg-[color-mix(in_oklch,#22C55E_8%,var(--kinship-cream))]",
  },
  {
    id: "dashboard",
    icon: LayoutDashboard,
    title: "Dashboard Pages",
    description:
      "High-fidelity Hearth or Horizon page mockups to visualize a feature concept before it's built.",
    capability:
      "Full Kinship design system — ink sidebar, cream content area, stat grids, student lists, accuracy rings, and subject badges. Mock data makes it feel real.",
    examples: [
      {
        label: "Teacher alert view",
        prompt:
          "Build a Hearth dashboard page showing a teacher's morning view — 22 Grade 3 students, color-coded by status, with a triage panel on the right.",
      },
      {
        label: "Student progress page",
        prompt:
          "Create a Horizon page showing a student's weekly progress across math, reading, and science — with platform badges and a simple accuracy trend.",
      },
      {
        label: "School admin view",
        prompt:
          "Prototype a school admin analytics page showing class-level trends across grades 3–5 — aggregate only, no individual student data.",
      },
    ],
    color: "var(--kinship-ink)",
    bgClass:
      "bg-[color-mix(in_oklch,var(--kinship-ink)_6%,var(--kinship-cream))]",
  },
];

/* ─── Prompt Copy Button ───────────────────────────────────── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 text-xs opacity-40 hover:opacity-80 transition-opacity"
      aria-label="Copy prompt"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-500" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
      {copied ? "copied" : "copy"}
    </button>
  );
}

/* ─── Prototype Type Card ──────────────────────────────────── */

function TypeCard({ type }: { type: PrototypeType }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = type.icon;

  return (
    <motion.div
      layout
      className={cn(
        "rounded-lg border border-[color-mix(in_oklch,var(--kinship-dim)_30%,transparent)]",
        type.bgClass,
        "p-6 cursor-pointer"
      )}
      onClick={() => setExpanded((e) => !e)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: `color-mix(in oklch, ${type.color} 15%, transparent)`,
            }}
          >
            <div style={{ color: type.color }}>
              <Icon className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="font-medium text-[var(--kinship-ink)]">
              {type.title}
            </h3>
          </div>
        </div>
        <ChevronRight
          className={cn(
            "w-4 h-4 opacity-40 flex-shrink-0 mt-0.5 transition-transform duration-200",
            expanded && "rotate-90"
          )}
        />
      </div>

      <p className="mt-3 text-sm text-[var(--kinship-mid)] leading-relaxed">
        {type.description}
      </p>

      {/* Expanded content */}
      {expanded && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Capability note */}
          <div className="mt-4 pt-4 border-t border-[color-mix(in_oklch,var(--kinship-dim)_20%,transparent)]">
            <p className="section-label mb-2">how it works</p>
            <p className="text-xs text-[var(--kinship-dim)] leading-relaxed">
              {type.capability}
            </p>
          </div>

          {/* Example prompts */}
          <div className="mt-4">
            <p className="section-label mb-3">sample prompts</p>
            <div className="space-y-2">
              {type.examples.map((ex) => (
                <div
                  key={ex.label}
                  className="group rounded-md p-3 bg-white border border-[color-mix(in_oklch,var(--kinship-dim)_20%,transparent)]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-xs font-medium"
                      style={{ color: type.color }}
                    >
                      {ex.label}
                    </span>
                    <CopyButton text={ex.prompt} />
                  </div>
                  <p className="text-xs text-[var(--kinship-mid)] leading-relaxed">
                    &ldquo;{ex.prompt}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────── */

export function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--kinship-cream)]">
      <div
        className="max-w-4xl mx-auto px-6 py-20"
        style={{ maxWidth: "var(--content-max)" }}
      >
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <p className="section-label mb-4">kinship prototype engine</p>
          <h1
            className="text-serif mb-6 leading-tight"
            style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)" }}
          >
            From idea to prototype
            <br />
            <span style={{ color: "var(--kinship-mid)" }}>in minutes.</span>
          </h1>
          <p className="text-[var(--kinship-mid)] max-w-xl leading-relaxed text-lg">
            Ask Hermes to build a prototype and get back a live Vercel URL.
            Slide decks, dashboard mockups, 3D visuals, animations — all on brand,
            all powered by mock data, all ready to share.
          </p>

          {/* How to use */}
          <div className="mt-8 flex items-center gap-2 text-sm text-[var(--kinship-dim)]">
            <span className="font-medium text-[var(--kinship-mid)]">How to use:</span>
            <span>Message Hermes in Slack with a prototype request.</span>
            <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Get a short link back.</span>
          </div>
        </motion.div>

        {/* Prototype types */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <p className="section-label mb-5">what you can build</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {prototypeTypes.map((type) => (
              <TypeCard key={type.id} type={type} />
            ))}
          </div>
        </motion.div>

        {/* How Hermes handles each request */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="mt-16"
        >
          <p className="section-label mb-5">the process</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            {[
              { n: "01", label: "You ask", text: "Send Hermes a prototype request in Slack — describe what you want built." },
              { n: "02", label: "Hermes plans", text: "Hermes reads PRODUCT.md, DESIGN.md, and your request — then writes a scope doc." },
              { n: "03", label: "Agent builds", text: "A coding agent takes a branch off this repo and builds the prototype using the design system." },
              { n: "04", label: "You get a link", text: "Vercel builds the preview. Hermes shortens the URL and sends it back to you." },
            ].map((step) => (
              <div
                key={step.n}
                className="rounded-lg border border-[color-mix(in_oklch,var(--kinship-dim)_30%,transparent)] bg-white p-5"
              >
                <p
                  className="text-serif mb-3"
                  style={{ fontSize: "1.75rem", color: "var(--kinship-dim)" }}
                >
                  {step.n}
                </p>
                <p className="text-sm font-medium text-[var(--kinship-ink)] mb-1.5">
                  {step.label}
                </p>
                <p className="text-xs text-[var(--kinship-mid)] leading-relaxed">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Design system note */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="mt-16 rounded-lg border border-[color-mix(in_oklch,var(--kinship-dim)_30%,transparent)] bg-white p-6"
        >
          <p className="section-label mb-3">design system</p>
          <p className="text-sm text-[var(--kinship-mid)] leading-relaxed mb-5">
            Every prototype uses the Kinship design system — brand colors, typography,
            and interaction patterns pulled directly from DESIGN.md.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { name: "Ink", hex: "#3D1A4E", color: "var(--kinship-ink)" },
              { name: "Cream", hex: "#F5F0E8", color: "var(--kinship-cream)", dark: true },
              { name: "Mid", hex: "#7A5590", color: "var(--kinship-mid)" },
              { name: "Dim", hex: "#B8A2C8", color: "var(--kinship-dim)" },
            ].map((swatch) => (
              <div key={swatch.name} className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded border border-[color-mix(in_oklch,var(--kinship-dim)_40%,transparent)]"
                  style={{ backgroundColor: swatch.color }}
                />
                <div>
                  <p className="text-xs font-medium text-[var(--kinship-ink)]">
                    {swatch.name}
                  </p>
                  <p className="text-xs text-[var(--kinship-dim)] font-mono">
                    {swatch.hex}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Gallery CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          className="mt-10"
        >
          <a
            href="/gallery"
            className="flex items-center justify-between rounded-lg border p-5 group transition-colors duration-150"
            style={{
              borderColor: "color-mix(in oklch, var(--kinship-mid) 30%, transparent)",
              background: "color-mix(in oklch, var(--kinship-mid) 5%, white)",
            }}
          >
            <div>
              <p className="section-label mb-1">prototype gallery</p>
              <p className="text-sm font-medium" style={{ color: "var(--kinship-ink)" }}>
                Browse everything the team has built
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--kinship-mid)" }}>
                Search, filter by type, and explore every prototype by creator and prompt.
              </p>
            </div>
            <ArrowRight
              className="w-5 h-5 flex-shrink-0 transition-transform duration-150 group-hover:translate-x-1"
              style={{ color: "var(--kinship-mid)" }}
            />
          </a>
        </motion.div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-[color-mix(in_oklch,var(--kinship-dim)_20%,transparent)]">
          <p className="text-xs text-[var(--kinship-dim)] text-center">
            kinship prototype engine · managed by hermes · built on next.js 16 + vercel
          </p>
        </div>
      </div>
    </div>
  );
}
