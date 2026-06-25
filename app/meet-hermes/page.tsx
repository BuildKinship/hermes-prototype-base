"use client";
// client component — keyboard/touch nav + localStorage persistence require browser APIs

import React, { useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MessageSquare, Zap, Brain, Shield, Users, Star, ArrowRight } from "lucide-react";

// ─── Slide variants ────────────────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};
const EASE = [0.22, 1, 0.36, 1] as unknown as import("framer-motion").Transition["ease"];
const STORAGE_KEY = "meet-hermes-slide";

// ─── Animated SVGs ─────────────────────────────────────────────────────────────

function HermesCoverAnimation() {
  return (
    <svg width="340" height="220" viewBox="0 0 340 220" fill="none" aria-hidden="true"
      style={{ width: "min(100%, 340px)", height: "auto" }}>
      <style>{`
        @keyframes hc-pulse { 0%,100%{opacity:0.12;r:72} 50%{opacity:0.28;r:80} }
        @keyframes hc-pulse2 { 0%,100%{opacity:0.08;r:95} 50%{opacity:0.18;r:103} }
        @keyframes hc-orbit1 { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes hc-orbit2 { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
        @keyframes hc-glow { 0%,100%{opacity:0.55} 50%{opacity:1} }
        .hc-ring1 { transform-origin:170px 110px; animation:hc-pulse 3.5s ease-in-out infinite; }
        .hc-ring2 { transform-origin:170px 110px; animation:hc-pulse2 4.2s ease-in-out infinite 0.5s; }
        .hc-orb1 { transform-origin:170px 110px; animation:hc-orbit1 9s linear infinite; }
        .hc-orb2 { transform-origin:170px 110px; animation:hc-orbit2 12s linear infinite 1s; }
        .hc-glow { animation:hc-glow 3s ease-in-out infinite; }
      `}</style>

      {/* Pulse rings */}
      <circle className="hc-ring2" cx="170" cy="110" r="95" fill="none" stroke="oklch(72% 0.12 293)" strokeWidth="1"/>
      <circle className="hc-ring1" cx="170" cy="110" r="72" fill="none" stroke="oklch(72% 0.12 293)" strokeWidth="1.5"/>

      {/* Orbiting dots ring 1 */}
      <g className="hc-orb1">
        <circle cx="170" cy="38" r="5" fill="oklch(72% 0.18 293)" opacity="0.9"/>
        <circle cx="170" cy="182" r="4" fill="oklch(72% 0.18 293)" opacity="0.7"/>
        <circle cx="242" cy="74" r="3.5" fill="oklch(72% 0.14 293)" opacity="0.6"/>
        <circle cx="98" cy="146" r="3.5" fill="oklch(72% 0.14 293)" opacity="0.6"/>
      </g>

      {/* Orbiting dots ring 2 */}
      <g className="hc-orb2">
        <circle cx="263" cy="110" r="4" fill="oklch(66% 0.10 270)" opacity="0.7"/>
        <circle cx="77" cy="110" r="4" fill="oklch(66% 0.10 270)" opacity="0.7"/>
      </g>

      {/* Hub circle */}
      <circle cx="170" cy="110" r="52" fill="oklch(14% 0.05 293)"/>
      <circle cx="170" cy="110" r="52" fill="none" stroke="oklch(55% 0.12 293)" strokeWidth="2"/>

      {/* Hermes image */}
      <defs>
        <clipPath id="hc-clip">
          <circle cx="170" cy="110" r="50"/>
        </clipPath>
      </defs>
      <image href="/logos/hermes.png" x="120" y="60" width="100" height="100"
        preserveAspectRatio="xMidYMid meet" clipPath="url(#hc-clip)"/>

      {/* Glow overlay */}
      <circle className="hc-glow" cx="170" cy="110" r="52" fill="none" stroke="oklch(72% 0.20 293)" strokeWidth="1.5"/>
    </svg>
  );
}

function CapabilitiesHubAnimation() {
  // Spoke positions with 28px padding from all edges to prevent clip
  // ViewBox: 0 0 380 270 — hub at center (190, 135)
  const spokes = [
    { x: 190, y: 28,  label: "Knowledge",    icon: "/logos/notion.png" },
    { x: 348, y: 82,  label: "Productivity", icon: "/logos/google-workspace.webp" },
    { x: 348, y: 188, label: "Creative",     icon: "/logos/slack.png" },
    { x: 190, y: 242, label: "Research",     icon: "/logos/google.webp" },
    { x: 32,  y: 188, label: "Zoom/Comms",   icon: "/logos/zoom.webp" },
    { x: 32,  y: 82,  label: "Engineering",  icon: "/logos/notion.png" },
  ];

  const cx = 190, cy = 135;

  return (
    <svg width="380" height="270" viewBox="0 0 380 270" fill="none" aria-hidden="true"
      style={{ width: "min(100%, 380px)", height: "auto", overflow: "visible" }}>
      <style>{`
        @keyframes cap-hub-glow { 0%,100%{opacity:0.5} 50%{opacity:1} }
        .cap-hub { animation:cap-hub-glow 3s ease-in-out infinite; }
      `}</style>
      <defs>
        {spokes.map((s, i) => (
          <path key={i} id={`cap-sp-${i}`} d={`M ${cx} ${cy} L ${s.x} ${s.y}`} fill="none"/>
        ))}
      </defs>

      {/* Spoke lines */}
      {spokes.map((s, i) => (
        <line key={i} x1={cx} y1={cy} x2={s.x} y2={s.y}
          stroke="oklch(70% 0.08 293)" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.5"/>
      ))}

      {/* Particles on each spoke */}
      {spokes.map((s, i) => (
        <circle key={i} r="3.5" fill="oklch(72% 0.18 293)" opacity="0.85">
          <animateMotion dur="2.4s" repeatCount="indefinite" begin={`${i * 0.4}s`}>
            <mpath xlinkHref={`#cap-sp-${i}`}/>
          </animateMotion>
          <animate attributeName="opacity" values="0;0.9;0.9;0" dur="2.4s" repeatCount="indefinite" begin={`${i * 0.4}s`}/>
        </circle>
      ))}

      {/* Hub */}
      <circle className="cap-hub" cx={cx} cy={cy} r="40" fill="oklch(14% 0.05 293)" stroke="oklch(55% 0.12 293)" strokeWidth="2"/>
      <defs>
        <clipPath id="cap-hermes-clip">
          <circle cx={cx} cy={cy} r="38"/>
        </clipPath>
      </defs>
      <image href="/logos/hermes.png" x={cx - 38} y={cy - 38} width="76" height="76"
        preserveAspectRatio="xMidYMid meet" clipPath="url(#cap-hermes-clip)"/>

      {/* Spoke nodes — r=22 gives enough room; labels below at +r+13 */}
      {spokes.map((s, i) => {
        const r = 22;
        const pad = r * 0.22;
        const clipId = `cap-clip-${i}`;
        return (
          <g key={i}>
            <defs>
              <clipPath id={clipId}><circle cx={s.x} cy={s.y} r={r - 1}/></clipPath>
            </defs>
            <circle cx={s.x} cy={s.y} r={r} fill="white" stroke="oklch(82% 0.04 293)" strokeWidth="1.5"/>
            <image
              href={s.icon}
              x={s.x - r + pad} y={s.y - r + pad}
              width={(r - pad) * 2} height={(r - pad) * 2}
              preserveAspectRatio="xMidYMid meet"
              clipPath={`url(#${clipId})`}
            />
            <text x={s.x} y={s.y + r + 13} fontSize="9" textAnchor="middle"
              fill="oklch(45% 0.06 293)" fontFamily="system-ui" fontWeight="600">{s.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function PersonalizationAnimation() {
  return (
    <svg width="400" height="120" viewBox="0 0 400 120" fill="none" aria-hidden="true"
      style={{ width: "min(100%, 400px)", height: "auto" }}>
      <style>{`
        @keyframes pers-bubble1 { 0%,15%{opacity:0;transform:translateY(8px)} 30%,75%{opacity:1;transform:translateY(0)} 90%,100%{opacity:0;transform:translateY(-4px)} }
        @keyframes pers-bubble2 { 0%,30%{opacity:0;transform:translateY(8px)} 45%,85%{opacity:1;transform:translateY(0)} 95%,100%{opacity:0;transform:translateY(-4px)} }
        @keyframes pers-bubble3 { 0%,45%{opacity:0;transform:translateY(8px)} 60%,90%{opacity:1;transform:translateY(0)} 98%,100%{opacity:0;transform:translateY(-4px)} }
        @keyframes pers-dot { 0%,100%{opacity:0.3;transform:translateY(0)} 50%{opacity:1;transform:translateY(-3px)} }
        .pb1 { animation:pers-bubble1 4s ease-in-out infinite; }
        .pb2 { animation:pers-bubble2 4s ease-in-out infinite; }
        .pb3 { animation:pers-bubble3 4s ease-in-out infinite; }
        .pd1 { animation:pers-dot 1.2s ease-in-out infinite 0s; }
        .pd2 { animation:pers-dot 1.2s ease-in-out infinite 0.4s; }
        .pd3 { animation:pers-dot 1.2s ease-in-out infinite 0.8s; }
      `}</style>

      {/* User A */}
      <circle cx="40" cy="60" r="24" fill="oklch(94% 0.04 293)" stroke="oklch(78% 0.08 293)" strokeWidth="1.5"/>
      <text x="40" y="55" fontSize="18" textAnchor="middle">👩</text>
      <text x="40" y="72" fontSize="8.5" textAnchor="middle" fill="oklch(40% 0.06 293)" fontWeight="600">User</text>

      {/* User B */}
      <circle cx="200" cy="60" r="24" fill="oklch(94% 0.04 293)" stroke="oklch(78% 0.08 293)" strokeWidth="1.5"/>
      <text x="200" y="55" fontSize="18" textAnchor="middle">👨‍💼</text>
      <text x="200" y="72" fontSize="8.5" textAnchor="middle" fill="oklch(40% 0.06 293)" fontWeight="600">Dan</text>

      {/* User C */}
      <circle cx="360" cy="60" r="24" fill="oklch(94% 0.04 293)" stroke="oklch(78% 0.08 293)" strokeWidth="1.5"/>
      <text x="360" y="55" fontSize="18" textAnchor="middle">🧑‍💻</text>
      <text x="360" y="72" fontSize="8.5" textAnchor="middle" fill="oklch(40% 0.06 293)" fontWeight="600">Dev</text>

      {/* Bubble A */}
      <g className="pb1">
        <rect x="68" y="38" width="96" height="26" rx="8" fill="oklch(60% 0.15 142)" opacity="0.9"/>
        <text x="116" y="55" fontSize="9" textAnchor="middle" fill="white" fontWeight="500">School pipeline update</text>
      </g>

      {/* Bubble B */}
      <g className="pb2">
        <rect x="228" y="38" width="96" height="26" rx="8" fill="oklch(62% 0.17 27)" opacity="0.9"/>
        <text x="276" y="55" fontSize="9" textAnchor="middle" fill="white" fontWeight="500">Q2 deals summary</text>
      </g>

      {/* Bubble C — typing dots */}
      <g className="pb3">
        <rect x="116" y="4" width="52" height="22" rx="8" fill="oklch(55% 0.10 270)" opacity="0.9"/>
        <circle className="pd1" cx="131" cy="15" r="2.5" fill="white" opacity="0.85"/>
        <circle className="pd2" cx="142" cy="15" r="2.5" fill="white" opacity="0.85"/>
        <circle className="pd3" cx="153" cy="15" r="2.5" fill="white" opacity="0.85"/>
      </g>
    </svg>
  );
}

function GuardrailAnimation() {
  return (
    <svg width="380" height="100" viewBox="0 0 380 100" fill="none" aria-hidden="true"
      style={{ width: "min(100%, 380px)", height: "auto" }}>
      <style>{`
        @keyframes grd-check { 0%,40%{opacity:0;transform:scale(0.5)} 55%,100%{opacity:1;transform:scale(1)} }
        @keyframes grd-block { 0%,20%{opacity:0} 35%,100%{opacity:1} }
        @keyframes grd-flow { 0%{stroke-dashoffset:80} 100%{stroke-dashoffset:0} }
        .grd-check { animation:grd-check 2s ease-out infinite 1s; transform-origin: 310px 50px; }
        .grd-block { animation:grd-block 2s ease-out infinite 0.3s; }
        .grd-line { stroke-dasharray:80; animation:grd-flow 2s ease-in-out infinite; }
      `}</style>

      {/* Request arrow */}
      <text x="12" y="45" fontSize="10.5" fill="oklch(45% 0.06 293)" fontWeight="600">User Request</text>
      <text x="10" y="60" fontSize="9" fill="oklch(55% 0.06 293)">@Hermes deploy to prod</text>

      {/* Arrow */}
      <line x1="130" y1="50" x2="175" y2="50" stroke="oklch(65% 0.10 293)" strokeWidth="2" markerEnd="url(#grd-arrow)"/>
      <defs>
        <marker id="grd-arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="oklch(65% 0.10 293)"/>
        </marker>
      </defs>

      {/* Guard box */}
      <rect x="178" y="28" width="78" height="42" rx="8" fill="oklch(16% 0.06 293)" stroke="oklch(55% 0.12 293)" strokeWidth="1.5"/>
      <text x="217" y="47" fontSize="9.5" textAnchor="middle" fill="oklch(85% 0.06 293)" fontWeight="700">GUARD</text>
      <text x="217" y="59" fontSize="8" textAnchor="middle" fill="oklch(65% 0.08 293)">Role check</text>

      {/* Blocked path */}
      <line x1="256" y1="50" x2="295" y2="50" className="grd-line" stroke="oklch(60% 0.22 25)" strokeWidth="2"/>
      <g className="grd-block">
        <circle cx="310" cy="50" r="16" fill="oklch(55% 0.22 25)" opacity="0.15"/>
        <circle cx="310" cy="50" r="12" fill="oklch(60% 0.22 25)" opacity="0.9"/>
        <line x1="303" y1="50" x2="317" y2="50" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        <text x="310" y="78" fontSize="8.5" textAnchor="middle" fill="oklch(50% 0.18 25)" fontWeight="600">Blocked</text>
      </g>

      {/* Allowed path - different request */}
      <text x="10" y="88" fontSize="8.5" fill="oklch(55% 0.06 293)" fontStyle="italic">Search Notion → ✓ Allowed</text>
    </svg>
  );
}

// ─── Slides ────────────────────────────────────────────────────────────────────

interface SlideProps { children: ReactNode; dark?: boolean; }

function SlideShell({ children, dark }: SlideProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 py-6 sm:px-10 sm:py-10"
      style={{ background: dark ? "var(--kinship-ink)" : "var(--kinship-cream)" }}>
      {children}
    </div>
  );
}

function SectionLabel({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className="text-xs font-mono tracking-widest uppercase mb-3"
      style={{ color: dark ? "oklch(65% 0.12 293)" : "oklch(50% 0.10 293)" }}>
      {children}
    </div>
  );
}

function SlideTitle({ title, subtitle, dark, size = "lg" }: { title: string; subtitle?: string; dark?: boolean; size?: "lg" | "sm" }) {
  return (
    <div className="text-center mb-4 sm:mb-6">
      <h2 style={{
        fontSize: size === "lg" ? "clamp(2.2rem, 5.5vw, 4.8rem)" : "clamp(1.6rem, 3.8vw, 3rem)",
        fontWeight: 800,
        lineHeight: 1.1,
        color: dark ? "var(--kinship-cream)" : "var(--kinship-ink)",
        letterSpacing: "-0.02em",
      }}>{title}</h2>
      {subtitle && (
        <p className="mt-3" style={{
          fontSize: "clamp(0.95rem, 2.2vw, 1.3rem)",
          color: dark ? "oklch(75% 0.06 293)" : "oklch(45% 0.06 293)",
          lineHeight: 1.5,
          maxWidth: "52ch",
          margin: "0.75rem auto 0",
        }}>{subtitle}</p>
      )}
    </div>
  );
}

function Card({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className="rounded-xl p-4 sm:p-5 flex flex-col gap-2"
      style={{
        background: dark ? "oklch(18% 0.05 293)" : "white",
        border: `1px solid ${dark ? "oklch(30% 0.06 293)" : "oklch(88% 0.04 293)"}`,
      }}>
      {children}
    </div>
  );
}

// ─── Individual Slides ─────────────────────────────────────────────────────────

function CoverSlide() {
  return (
    <SlideShell dark>
      <SectionLabel dark>Kinship · June 2026</SectionLabel>
      <HermesCoverAnimation />
      <div className="text-center mt-2">
        <h1 style={{
          fontSize: "clamp(2.8rem, 7vw, 6rem)",
          fontWeight: 900,
          color: "var(--kinship-cream)",
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
        }}>Hermes Update</h1>
        <p className="mt-3" style={{
          fontSize: "clamp(1rem, 2.4vw, 1.4rem)",
          color: "oklch(72% 0.08 293)",
          maxWidth: "42ch",
          margin: "0.75rem auto 0",
          lineHeight: 1.5,
        }}>
          We've been building AI into our workflows quietly.<br/>
          Today, let me introduce myself properly.
        </p>
      </div>
    </SlideShell>
  );
}

function WhatHermesIsSlide() {
  const points = [
    { icon: Brain,        title: "Persistent Memory",    body: "Unlike ChatGPT, I remember Kinship — the team, the schools, the context. I learn over time." },
    { icon: Zap,          title: "Takes Real Actions",   body: "I don't just answer questions. I can schedule a Zoom, draft a document, generate a prototype, or search Notion." },
    { icon: MessageSquare,title: "Lives in Slack",       body: "Just DM me or @mention me in any channel. No special app, no prompting skills needed." },
    { icon: Star,         title: "Knows Your Context",  body: "If you're in #open-kinship or any other channel, I know that context. I tailor every response to where you are." },
  ];
  return (
    <SlideShell>
      <SectionLabel>1 · What I Am</SectionLabel>
      <SlideTitle title="Your AI teammate that lives in Slack." size="sm"/>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-3xl">
        {points.map(({ icon: Icon, title, body }) => (
          <Card key={title}>
            <div className="flex items-center gap-2">
              <div className="rounded-lg p-1.5" style={{ background: "oklch(93% 0.04 293)" }}>
                <Icon className="w-4 h-4" style={{ color: "var(--kinship-ink)" }}/>
              </div>
              <span className="font-700 text-sm sm:text-base" style={{ color: "var(--kinship-ink)", fontWeight: 700 }}>{title}</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "oklch(40% 0.06 293)" }}>{body}</p>
          </Card>
        ))}
      </div>
    </SlideShell>
  );
}

function CapabilitiesSlide() {
  const groups = [
    { label: "Knowledge Base",      detail: "Notion Brain, local wiki — schools, deals, accounts, history",          color: "oklch(60% 0.15 293)" },
    { label: "Productivity",        detail: "Google Workspace (email, calendar, docs, sheets) · Zoom scheduling",      color: "oklch(55% 0.15 142)" },
    { label: "Creative Tools",      detail: "Generate images, videos, slides, surveys, web prototypes — in Slack",      color: "oklch(60% 0.18 27)" },
    { label: "Research",            detail: "Web search, YouTube summaries, arXiv papers, market data",                color: "oklch(58% 0.16 200)" },
    { label: "Engineering",         detail: "GitHub, Vercel, Railway — for the engineering team",                      color: "oklch(52% 0.12 260)" },
    { label: "Analytics & Tasks",   detail: "Notion Tasks, Linear, Airtable, spend tracking, weekly digests",         color: "oklch(56% 0.13 330)" },
  ];
  return (
    <SlideShell>
      <SectionLabel>2 · What I Can Do</SectionLabel>
      <SlideTitle title="Six domains of capability." size="sm"/>
      <div className="flex flex-col items-center w-full max-w-4xl gap-4">
        <CapabilitiesHubAnimation />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full">
          {groups.map(({ label, detail, color }) => (
            <div key={label} className="rounded-lg p-3 flex items-start gap-2.5"
              style={{ background: "white", border: "1px solid oklch(90% 0.03 293)" }}>
              <div className="w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0" style={{ background: color }}/>
              <div>
                <div className="text-sm font-700" style={{ color: "var(--kinship-ink)", fontWeight: 700, fontSize: "0.82rem" }}>{label}</div>
                <div className="text-xs leading-snug mt-0.5" style={{ color: "oklch(45% 0.05 293)", fontSize: "0.75rem" }}>{detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}

function PersonalizationSlide() {
  return (
    <SlideShell dark>
      <SectionLabel dark>3 · What Makes It Different</SectionLabel>
      <SlideTitle title="Every person gets a different Hermes." dark size="sm"
        subtitle="I create a profile for everyone I talk to. Your context, your preferences, your history — all remembered."/>
      <PersonalizationAnimation />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl mt-2">
        {[
          { name: "User",  role: "Education",  example: '"Show me the Grade 3 school pipeline"' },
          { name: "Dan",   role: "Sales",       example: '"Summarize my Q2 deals + next steps"' },
          { name: "Dev",   role: "Engineering", example: '"Deploy the staging branch to Vercel"' },
        ].map(({ name, role, example }) => (
          <Card key={name} dark>
            <div className="text-sm font-700" style={{ color: "var(--kinship-cream)", fontWeight: 700 }}>{name} · {role}</div>
            <div className="text-xs italic leading-relaxed" style={{ color: "oklch(68% 0.08 293)" }}>{example}</div>
          </Card>
        ))}
      </div>
    </SlideShell>
  );
}

function GuardrailsSlide() {
  const guards = [
    { text: "Won't create Google or Zoom accounts without admin approval" },
    { text: "Won't run code in production systems without engineering role" },
    { text: "Won't modify Hermes configuration unless you're an admin" },
    { text: "Won't take destructive GitHub or Vercel actions for general users" },
    { text: "Budget cap per person — no surprise $500 image generation bills" },
  ];
  return (
    <SlideShell>
      <SectionLabel>4 · What I Cannot Do (By Design)</SectionLabel>
      <SlideTitle title="Guardrails are a feature, not a bug." size="sm"
        subtitle="Explicit limits build trust. Here's exactly what's locked down and why."/>
      <div className="flex flex-col items-center gap-4 w-full max-w-3xl">
        <GuardrailAnimation />
        <div className="w-full flex flex-col gap-2">
          {guards.map(({ text }) => (
            <div key={text} className="flex items-start gap-3 rounded-lg px-4 py-3"
              style={{ background: "white", border: "1px solid oklch(90% 0.03 293)" }}>
              <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "oklch(58% 0.16 25)" }}/>
              <span className="text-sm" style={{ color: "oklch(38% 0.05 293)" }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}

function HowToUseSlide() {
  const demos = [
    { prompt: '"Write me a summary of our Q2 school pipeline"',      result: "Pulls from Notion Brain, summarises deals + next steps" },
    { prompt: '"Schedule a Zoom with Park School for next Tuesday"',  result: "Creates the calendar invite + sends Zoom link" },
    { prompt: '"Generate a logo for this teacher guide"',             result: "Produces 4 image variations, posts directly to Slack" },
  ];
  return (
    <SlideShell dark>
      <SectionLabel dark>5 · How to Start</SectionLabel>
      <SlideTitle title="Just talk to me. No setup required." dark size="sm"
        subtitle='DM me or @mention me in any channel. Natural language — no special syntax.​'/>
      <div className="flex flex-col gap-2 w-full max-w-3xl">
        {demos.map(({ prompt, result }, i) => (
          <div key={i} className="rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2"
            style={{ background: "oklch(18% 0.05 293)", border: "1px solid oklch(28% 0.06 293)" }}>
            <div className="flex-1">
              <div className="text-sm font-600 italic" style={{ color: "oklch(80% 0.08 293)", fontWeight: 600 }}>{prompt}</div>
            </div>
            <ArrowRight className="hidden sm:block w-4 h-4 flex-shrink-0" style={{ color: "oklch(55% 0.10 293)" }}/>
            <div className="flex-1">
              <div className="text-sm" style={{ color: "oklch(60% 0.08 293)" }}>{result}</div>
            </div>
          </div>
        ))}
        <div className="rounded-xl p-4 flex items-start gap-3 mt-1"
          style={{ background: "oklch(20% 0.06 293)", border: "1px solid oklch(55% 0.12 293)" }}>
          <Star className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "oklch(72% 0.18 293)" }}/>
          <div>
            <p className="text-sm font-600" style={{ color: "var(--kinship-cream)", fontWeight: 600 }}>
              All generated artifacts are saved to the gallery
            </p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "oklch(60% 0.08 293)" }}>
              Sign in with your Kinship Google account at{" "}
              <a href="https://quick.buildkinship.dev" target="_blank" rel="noreferrer"
                style={{ color: "oklch(72% 0.18 293)", textDecoration: "underline" }}>
                quick.buildkinship.dev
              </a>
              {" "}to browse prototypes, slides, images and surveys — and see exactly how they were created.
            </p>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

function RolesSlide() {
  const roles = [
    { role: "Admin",  who: "Admin users",   access: "Everything — all tools, config, training",                   color: "oklch(58% 0.18 293)" },
    { role: "Team",   who: "Kinship staff", access: "Notion, Zoom, Google Workspace, creative tools, research",   color: "oklch(55% 0.15 142)" },
    { role: "User",   who: "Teachers, partners", access: "Creative tools (image/video/slides), research, read-only", color: "oklch(58% 0.16 60)" },
  ];
  return (
    <SlideShell>
      <SectionLabel>6 · Roles & Getting Started</SectionLabel>
      <SlideTitle title="Not everyone gets the same access." size="sm"
        subtitle="That's intentional. Role-based access keeps everyone safe and efficient."/>
      <div className="flex flex-col gap-2 w-full max-w-3xl mb-3">
        {roles.map(({ role, who, access, color }) => (
          <div key={role} className="rounded-xl p-3 sm:p-4 flex items-start gap-3"
            style={{ background: "white", border: "1px solid oklch(90% 0.03 293)" }}>
            <div className="rounded-lg px-2.5 py-1 text-xs font-800 flex-shrink-0"
              style={{ background: color, color: "white", fontWeight: 800, fontSize: "0.72rem" }}>
              {role.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-700" style={{ color: "var(--kinship-ink)", fontWeight: 700 }}>{who}</div>
              <div className="text-xs mt-0.5" style={{ color: "oklch(45% 0.05 293)" }}>{access}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-3xl">
        <div className="rounded-xl p-4 text-center"
          style={{ background: "var(--kinship-ink)", border: "1px solid oklch(30% 0.06 293)" }}>
          <Users className="w-4 h-4 mx-auto mb-1.5" style={{ color: "oklch(72% 0.14 293)" }}/>
          <p className="text-xs font-600" style={{ color: "var(--kinship-cream)", fontWeight: 600 }}>
            Permission denied? Post in <span style={{ color: "oklch(72% 0.14 293)" }}>#brain-feedback</span>
          </p>
          <p className="text-xs mt-1" style={{ color: "oklch(55% 0.08 293)" }}>
            All feedback for Hermes goes to #brain-feedback
          </p>
        </div>
        <div className="rounded-xl p-4 text-center"
          style={{ background: "white", border: "1px solid oklch(88% 0.04 293)" }}>
          <MessageSquare className="w-4 h-4 mx-auto mb-1.5" style={{ color: "oklch(50% 0.10 293)" }}/>
          <p className="text-xs font-600" style={{ color: "var(--kinship-ink)", fontWeight: 600 }}>
            Start now
          </p>
          <p className="text-xs mt-1" style={{ color: "oklch(45% 0.05 293)" }}>
            DM @Hermes or mention me in any channel
          </p>
        </div>
      </div>
    </SlideShell>
  );
}

// ─── Slides array ──────────────────────────────────────────────────────────────

interface Slide { id: number; dark: boolean; label: string; component: ReactNode; }

const SLIDES: Slide[] = [
  { id: 0, dark: true,  label: "Cover",                component: <CoverSlide /> },
  { id: 1, dark: false, label: "1 · What I Am",        component: <WhatHermesIsSlide /> },
  { id: 2, dark: false, label: "2 · Capabilities",     component: <CapabilitiesSlide /> },
  { id: 3, dark: true,  label: "3 · Personalization",  component: <PersonalizationSlide /> },
  { id: 4, dark: false, label: "4 · Guardrails",       component: <GuardrailsSlide /> },
  { id: 5, dark: true,  label: "5 · How to Use",       component: <HowToUseSlide /> },
  { id: 6, dark: false, label: "6 · Roles & Start",    component: <RolesSlide /> },
];

// ─── Progress dots ─────────────────────────────────────────────────────────────

function DotRow({ page, total, onGo, dark }: { page: number; total: number; onGo: (i: number) => void; dark: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <button key={i} onClick={() => onGo(i)} aria-label={`Slide ${i + 1}`}
          className="rounded-full transition-all"
          style={{
            width: i === page ? "28px" : "8px",
            height: "8px",
            background: i === page
              ? (dark ? "var(--kinship-cream)" : "var(--kinship-ink)")
              : (dark ? "oklch(50% 0.05 293)" : "oklch(72% 0.05 293)"),
          }}/>
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function MeetHermesPage() {
  const [[page, dir], setPage] = useState<[number, number]>([0, 1]);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const navTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const slide = SLIDES[page];

  const go = useCallback((next: number) => {
    if (next < 0 || next >= SLIDES.length) return;
    setPage([next, next > page ? 1 : -1]);
  }, [page]);

  // Touch device detection + localStorage restore
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouchDevice(true);
      setShowNav(true);
    }
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const n = parseInt(saved, 10);
      if (!isNaN(n)) setPage([Math.min(n, SLIDES.length - 1), 1]);
    }
  }, []);

  // Save slide position
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(page));
  }, [page]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); go(page + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(page - 1); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go, page]);

  // Mouse move show nav
  const handleMouseMove = useCallback(() => {
    if (isTouchDevice) return;
    setShowNav(true);
    if (navTimer.current) clearTimeout(navTimer.current);
    navTimer.current = setTimeout(() => setShowNav(false), 2500);
  }, [isTouchDevice]);

  // Touch swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) < 40 || Math.abs(dy) > Math.abs(dx)) return;
    dx < 0 ? go(page + 1) : go(page - 1);
  }, [go, page]);

  const isDark = slide.dark;
  const navColor = isDark ? "oklch(65% 0.08 293)" : "oklch(35% 0.06 293)";
  const navBg = isDark ? "oklch(20% 0.05 293)" : "white";
  const navBorder = isDark ? "oklch(28% 0.06 293)" : "oklch(88% 0.04 293)";

  return (
    <div
      className="w-full flex flex-col overflow-hidden"
      style={{ height: "100dvh", background: isDark ? "var(--kinship-ink)" : "var(--kinship-cream)" }}
      onMouseMove={handleMouseMove}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top chrome */}
      <div className="flex-none flex items-center justify-between px-4 pt-3 pb-1 sm:px-8 sm:pt-5"
        style={{ opacity: isTouchDevice || showNav ? 1 : 0, transition: "opacity 0.3s" }}>
        <span className="text-xs font-mono truncate max-w-[55vw]"
          style={{ color: navColor }}>{slide.label}</span>
        <span className="text-xs font-mono"
          style={{ color: navColor }}>{page + 1} / {SLIDES.length}</span>
      </div>

      {/* Slide body */}
      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence custom={dir} mode="wait">
          <motion.div
            key={slide.id}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.38, ease: EASE }}
            className="absolute inset-0 overflow-y-auto"
          >
            <div className="min-h-full flex flex-col items-center justify-center">
              {slide.component}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav bar */}
      <div className="flex-none flex items-center justify-center gap-4 px-4 py-3 sm:py-5"
        style={{ opacity: isTouchDevice || showNav ? 1 : 0, transition: "opacity 0.3s" }}>
        <button
          onClick={() => go(page - 1)}
          disabled={page === 0}
          aria-label="Previous slide"
          className="rounded-full p-1.5 transition-all disabled:opacity-30"
          style={{ background: navBg, border: `1px solid ${navBorder}`, color: navColor }}
        >
          <ChevronLeft className="w-4 h-4"/>
        </button>
        <DotRow page={page} total={SLIDES.length} onGo={go} dark={isDark}/>
        <button
          onClick={() => go(page + 1)}
          disabled={page === SLIDES.length - 1}
          aria-label="Next slide"
          className="rounded-full p-1.5 transition-all disabled:opacity-30"
          style={{ background: navBg, border: `1px solid ${navBorder}`, color: navColor }}
        >
          <ChevronRight className="w-4 h-4"/>
        </button>
      </div>
    </div>
  );
}
