"use client";
// Client component — interactive slideshow with keyboard nav and citation links

import React, { type ReactNode, useState, useEffect, useRef, useCallback } from "react";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Citation {
  label: string;
  url: string;
  author?: string;
}

interface Article {
  id: string;
  theme: string;
  dark?: boolean;
  label: string;
  content: ReactNode;
}

// ─── Shared visual components ──────────────────────────────────────────────────

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-widest border border-current opacity-70">
      {children}
    </span>
  );
}

function CitationLink({ citation }: { citation: Citation }) {
  return (
    <a
      href={citation.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs opacity-60 hover:opacity-100 transition-opacity underline underline-offset-2"
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
        <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {citation.label}
      {citation.author && <span className="opacity-70">· @{citation.author}</span>}
    </a>
  );
}

function InsightCard({
  icon,
  title,
  body,
  citation,
  dark,
}: {
  icon: ReactNode;
  title: string;
  body: string;
  citation?: Citation;
  dark?: boolean;
}) {
  return (
    <div className={`rounded-xl border p-4 flex flex-col gap-2 ${dark ? "border-white/20 bg-white/5" : "border-black/10 bg-black/3"}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">{icon}</span>
        <div className="flex flex-col gap-1 min-w-0">
          <p className="font-semibold text-sm leading-snug">{title}</p>
          <p className="text-xs opacity-70 leading-relaxed">{body}</p>
          {citation && <CitationLink citation={citation} />}
        </div>
      </div>
    </div>
  );
}

function StatBubble({ value, label, dark }: { value: string; label: string; dark?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-1 rounded-2xl border px-5 py-4 ${dark ? "border-white/20 bg-white/5" : "border-black/10 bg-black/3"}`}>
      <span className="text-3xl font-black tracking-tight">{value}</span>
      <span className="text-xs opacity-60 text-center leading-snug max-w-[120px]">{label}</span>
    </div>
  );
}

// ─── SVG Illustrations ──────────────────────────────────────────────────────────

function CoverIllustration() {
  return (
    <svg viewBox="0 0 560 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 560, height: "auto" }}>
      {/* Neural network nodes */}
      {[
        [280, 130, 26, "#f5f0e8", 1],
        [180, 80, 16, "#e8d5b0", 0.85],
        [380, 80, 16, "#e8d5b0", 0.85],
        [160, 170, 14, "#d4c89a", 0.75],
        [400, 170, 14, "#d4c89a", 0.75],
        [90, 120, 10, "#c4b885", 0.6],
        [470, 120, 10, "#c4b885", 0.6],
        [240, 200, 10, "#b8a870", 0.55],
        [320, 200, 10, "#b8a870", 0.55],
        [100, 60, 7, "#a89560", 0.45],
        [460, 60, 7, "#a89560", 0.45],
        [70, 190, 7, "#a89560", 0.4],
        [490, 190, 7, "#a89560", 0.4],
      ].map(([cx, cy, r, fill, opacity], i) => (
        <circle key={i} cx={cx as number} cy={cy as number} r={r as number} fill={fill as string} opacity={opacity as number} />
      ))}
      {/* Connections */}
      {[
        [280, 130, 180, 80],
        [280, 130, 380, 80],
        [280, 130, 160, 170],
        [280, 130, 400, 170],
        [180, 80, 90, 120],
        [380, 80, 470, 120],
        [180, 80, 100, 60],
        [380, 80, 460, 60],
        [160, 170, 70, 190],
        [400, 170, 490, 190],
        [160, 170, 240, 200],
        [400, 170, 320, 200],
        [90, 120, 70, 190],
        [470, 120, 490, 190],
      ].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#f5f0e8" strokeWidth="0.75" opacity="0.25" />
      ))}
      {/* Center glow */}
      <circle cx="280" cy="130" r="50" fill="#f5f0e8" opacity="0.06" />
      <circle cx="280" cy="130" r="35" fill="#f5f0e8" opacity="0.06" />
    </svg>
  );
}

function SchoolIllustration() {
  return (
    <svg viewBox="0 0 440 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 440, height: "auto" }}>
      {/* Building */}
      <rect x="150" y="80" width="140" height="100" rx="4" fill="#2a2a2a" stroke="#e8d5b0" strokeWidth="1.5" />
      {/* Roof */}
      <path d="M140 80L220 30L300 80Z" fill="#3a3a3a" stroke="#e8d5b0" strokeWidth="1.5" />
      {/* Windows */}
      {[[168, 100], [202, 100], [236, 100], [168, 135], [202, 135], [236, 135]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="18" height="20" rx="2" fill="#e8d5b0" opacity="0.3" />
      ))}
      {/* Door */}
      <rect x="207" y="145" width="26" height="35" rx="3" fill="#e8d5b0" opacity="0.5" />
      {/* AI sparkle */}
      <circle cx="340" cy="60" r="28" fill="#e8d5b0" opacity="0.08" />
      <circle cx="340" cy="60" r="18" fill="#e8d5b0" opacity="0.1" />
      <path d="M340 48L343 57H352L345 63L348 72L340 66L332 72L335 63L328 57H337Z" fill="#e8d5b0" opacity="0.7" />
      {/* Connecting line */}
      <line x1="290" y1="90" x2="318" y2="68" stroke="#e8d5b0" strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />
      {/* Small figures */}
      {[100, 130, 160, 355, 385].map((x, i) => (
        <g key={i} opacity="0.5">
          <circle cx={x} cy="168" r="6" fill="#c4b885" />
          <rect x={x - 4} y="174" width="8" height="12" rx="2" fill="#c4b885" />
        </g>
      ))}
    </svg>
  );
}

function BrainIllustration() {
  return (
    <svg viewBox="0 0 400 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 400, height: "auto" }}>
      {/* Knowledge levels */}
      {[
        [200, 20, 60, "#3a3a3a", "#e8d5b0", "Level 5\nConflict Resolution"],
        [200, 65, 85, "#2a2a2a", "#d4c89a", "Level 4\nAuthority Weighting"],
        [200, 110, 110, "#1a1a1a", "#c4b885", "Level 3\nEntity Extraction"],
        [200, 150, 140, "#141414", "#b8a870", "Level 1–2\nIndex + Meetings"],
      ].map(([cx, cy, w, fill, stroke, _label], i) => (
        <ellipse key={i} cx={cx as number} cy={cy as number} rx={(w as number) / 2} ry="18"
          fill={fill as string} stroke={stroke as string} strokeWidth="1.5" opacity={0.9 - i * 0.1} />
      ))}
      {/* Most stuck label */}
      <path d="M310 110L360 100" stroke="#e8d5b0" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
      <text x="362" y="104" fontSize="9" fill="#e8d5b0" opacity="0.7">← stuck here</text>
    </svg>
  );
}

function AlphaIllustration() {
  return (
    <svg viewBox="0 0 440 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 440, height: "auto" }}>
      {/* Morning / Afternoon split */}
      <rect x="20" y="30" width="185" height="130" rx="10" fill="#1a1a1a" stroke="#e8d5b0" strokeWidth="1.5" />
      <rect x="230" y="30" width="185" height="130" rx="10" fill="#2a3a1a" stroke="#90a060" strokeWidth="1.5" />
      {/* Labels */}
      <text x="112" y="58" textAnchor="middle" fontSize="11" fill="#e8d5b0" fontWeight="700" opacity="0.9">☀️ MORNING</text>
      <text x="322" y="58" textAnchor="middle" fontSize="11" fill="#90c040" fontWeight="700" opacity="0.9">🚀 AFTERNOON</text>
      <text x="112" y="76" textAnchor="middle" fontSize="9" fill="#e8d5b0" opacity="0.6">Core Academics</text>
      <text x="322" y="76" textAnchor="middle" fontSize="9" fill="#90c040" opacity="0.6">Projects + Creation</text>
      {/* NO AI icon */}
      <text x="112" y="108" textAnchor="middle" fontSize="26" opacity="0.7">🚫</text>
      <text x="112" y="140" textAnchor="middle" fontSize="9" fill="#e8d5b0" opacity="0.7">AI use = cheating</text>
      {/* YES AI icon */}
      <text x="322" y="108" textAnchor="middle" fontSize="26" opacity="0.9">🤖</text>
      <text x="322" y="140" textAnchor="middle" fontSize="9" fill="#90c040" opacity="0.9">No AI = cheating yourself</text>
      {/* Divider label */}
      <text x="220" y="102" textAnchor="middle" fontSize="20" opacity="0.5">↕</text>
    </svg>
  );
}

function GapIllustration() {
  return (
    <svg viewBox="0 0 440 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 440, height: "auto" }}>
      {/* Grade levels bar chart */}
      {[
        [50, 40, 40, "#e8d5b0", "Top 10%\nGrade 14+"],
        [130, 100, 40, "#c4b885", "Q2\nGrade 9"],
        [210, 130, 40, "#a89560", "Q3\nGrade 7"],
        [290, 155, 40, "#786840", "Bottom 25%\nGrade 3–4"],
      ].map(([x, barTop, _w, fill, label], i) => (
        <g key={i}>
          <rect x={x as number} y={barTop as number} width="50" height={170 - (barTop as number)} rx="4" fill={fill as string} opacity="0.8" />
          <text x={(x as number) + 25} y={175} textAnchor="middle" fontSize="7" fill="#f5f0e8" opacity="0.6">
            {(label as string).split("\n")[0]}
          </text>
          <text x={(x as number) + 25} y={183} textAnchor="middle" fontSize="7" fill="#f5f0e8" opacity="0.5">
            {(label as string).split("\n")[1]}
          </text>
        </g>
      ))}
      {/* Gap arrow */}
      <path d="M75 45L315 45" stroke="#e8d5b0" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.4" markerEnd="url(#arr)" />
      <text x="195" y="40" textAnchor="middle" fontSize="9" fill="#e8d5b0" opacity="0.7">10+ grade level gap</text>
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="#e8d5b0" opacity="0.5" />
        </marker>
      </defs>
    </svg>
  );
}

function LegislationMap() {
  return (
    <svg viewBox="0 0 440 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 440, height: "auto" }}>
      {/* Simplified US map silhouette with highlighted states */}
      <rect x="20" y="20" width="400" height="145" rx="8" fill="#1a1a1a" stroke="#e8d5b0" strokeWidth="1" opacity="0.5" />
      <text x="220" y="95" textAnchor="middle" fontSize="11" fill="#e8d5b0" opacity="0.4">United States</text>
      {/* Dots for states */}
      {[
        [60, 70, "#e8d5b0", "Idaho"],
        [80, 80, "#c4b885", "Utah"],
        [380, 55, "#d4c89a", "New York"],
        [50, 95, "#b0c880", "California"],
        [45, 110, "#90a060", "Oregon"],
        [55, 85, "#80a050", "Washington"],
        [350, 120, "#c0b060", "Tennessee"],
      ].map(([x, y, fill, label], i) => (
        <g key={i}>
          <circle cx={x as number} cy={y as number} r="8" fill={fill as string} opacity="0.6" />
          <text x={(x as number)} y={(y as number) + 20} textAnchor="middle" fontSize="6.5" fill={fill as string} opacity="0.8">{label}</text>
        </g>
      ))}
      {/* Stats */}
      <text x="220" y="130" textAnchor="middle" fontSize="10" fill="#e8d5b0" opacity="0.7">3 states enacted · 25+ active bills · Federal tension growing</text>
    </svg>
  );
}

function AgentArchIllustration() {
  return (
    <svg viewBox="0 0 440 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", maxWidth: 440, height: "auto" }}>
      {/* Center supervisor */}
      <circle cx="220" cy="90" r="32" fill="#1a2a3a" stroke="#6090c0" strokeWidth="2" />
      <text x="220" y="86" textAnchor="middle" fontSize="9" fill="#90c0f0" fontWeight="700">SUPERVISOR</text>
      <text x="220" y="98" textAnchor="middle" fontSize="8" fill="#90c0f0" opacity="0.7">AGENT</text>
      {/* Subagents */}
      {[
        [80, 50, "Retrieval", "#3a1a1a", "#c06060"],
        [360, 50, "Analytics", "#1a3a1a", "#60c060"],
        [80, 140, "Structured\nData", "#2a2a1a", "#c0c060"],
        [360, 140, "Synthesis", "#2a1a3a", "#9060c0"],
      ].map(([x, y, label, fill, stroke], i) => (
        <g key={i}>
          <circle cx={x as number} cy={y as number} r="24" fill={fill as string} stroke={stroke as string} strokeWidth="1.5" />
          <text x={x as number} y={(y as number) + 4} textAnchor="middle" fontSize="7.5" fill={stroke as string} fontWeight="600">
            {(label as string).split("\n").map((t, j) => (
              <tspan key={j} x={x as number} dy={j === 0 ? (label as string).includes("\n") ? -5 : 0 : 12}>{t}</tspan>
            ))}
          </text>
          <line x1={x as number > 220 ? (x as number) - 24 : (x as number) + 24}
            y1={y as number}
            x2={x as number > 220 ? 252 : 188}
            y2={y as number > 90 ? 106 : 74}
            stroke={stroke as string} strokeWidth="1" opacity="0.4" strokeDasharray="4 3" />
        </g>
      ))}
    </svg>
  );
}

// ─── Slide definitions ──────────────────────────────────────────────────────────

function makeSlides(): Article[] {
  return [
    // ─── 0. Cover ──────────────────────────────────────────────────────────────
    {
      id: "cover",
      theme: "Cover",
      dark: true,
      label: "Cover",
      content: (
        <div className="flex flex-col items-center justify-center gap-6 w-full py-4">
          <CoverIllustration />
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-xs tracking-[0.3em] uppercase opacity-50 font-semibold">Issue 01 · June 2026</span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none" style={{ color: "var(--kinship-cream)" }}>
              COLLECTIVE
            </h1>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-none" style={{ color: "var(--kinship-cream)" }}>
              INTELLIGENCE
            </h1>
            <p className="text-sm opacity-60 max-w-sm mt-2 leading-relaxed">
              The best ideas from the Kinship team's reading list — AI, education, and the future of learning.
            </p>
          </div>
          <div className="flex items-center gap-4 opacity-40 text-xs mt-2">
            <span>37 sources read</span>
            <span>·</span>
            <span>8 themes</span>
            <span>·</span>
            <span>#topic-collective-intelligence</span>
          </div>
        </div>
      ),
    },

    // ─── 1. Contents / Issue Themes ───────────────────────────────────────────
    {
      id: "contents",
      theme: "Contents",
      dark: false,
      label: "1 · In This Issue",
      content: (
        <div className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-1">
            <span className="text-xs tracking-widest uppercase opacity-40 font-semibold">In This Issue</span>
            <h2 className="text-2xl font-black leading-tight" style={{ color: "var(--kinship-ink)" }}>
              8 stories shaping the future of learning
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              ["🏫", "The AI School Wars", "How schools are navigating AI — from bans to mandates."],
              ["📊", "The 10-Grade Gap", "America's alarming K-12 learning inequality."],
              ["🤖", "AI Tools for Builders", "Claude Code, multi-agents & the new developer stack."],
              ["🏛️", "The Race to Legislate", "25+ states drafting AI education laws right now."],
              ["🎓", "Owning Intelligence", "Why renting AI from APIs is a strategic risk."],
              ["🧠", "Building a Company Brain", "5 levels of organizational AI knowledge."],
              ["📚", "Edtech's Broken Model", "Why procurement kills good products."],
              ["💡", "The Personalization Debate", "When AI adaptation actually helps vs. hinders."],
            ].map(([icon, title, desc], i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border p-3" style={{ borderColor: "var(--kinship-mid)" }}>
                <span className="text-xl shrink-0">{icon}</span>
                <div>
                  <p className="font-bold text-sm" style={{ color: "var(--kinship-ink)" }}>{title}</p>
                  <p className="text-xs opacity-60">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },

    // ─── 2. The AI School Wars ─────────────────────────────────────────────────
    {
      id: "ai-school-wars",
      theme: "AI in Schools",
      dark: true,
      label: "2 · The AI School Wars",
      content: (
        <div className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-1">
            <Tag>Story 1</Tag>
            <h2 className="text-2xl font-black leading-tight mt-1" style={{ color: "var(--kinship-cream)" }}>
              The AI School Wars
            </h2>
            <p className="text-sm opacity-70">Schools are splitting into two camps — and the dividing line is how they use AI.</p>
          </div>
          <AlphaIllustration />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InsightCard
              icon="🏫"
              title="Alpha School's Heuristic"
              body="If you use AI for core academics in the morning: cheating. If you do not use AI for afternoon projects: cheating yourself."
              citation={{ label: "Matt Bateman on Alpha's AI policy", url: "https://x.com/mbateman/status/2057506545479389364", author: "mbateman" }}
              dark
            />
            <InsightCard
              icon="🚀"
              title="Primer goes real-time"
              body="Primer launched live, transparent parent dashboards showing exactly what their child is learning and when — edtech accountability in action."
              citation={{ label: "Ryan Delk, Primer founder", url: "https://x.com/delk/status/2049523798127653007", author: "delk" }}
              dark
            />
            <InsightCard
              icon="📖"
              title="AI Reading Platform"
              body='Math is "solved" by adaptive edtech — the skill graph is simple. Reading is far harder, requiring a nuanced skill graph. A new platform is tackling this.'
              citation={{ label: "Advik Kapoor on reading vs. math", url: "https://x.com/heyadvikkapoor/status/2061816696743342492", author: "heyadvikkapoor" }}
              dark
            />
            <InsightCard
              icon="🏛️"
              title="David Game College (London)"
              body="AI-powered A-Level programme: adaptive learning in the mornings + life skills afternoons. Sounds exactly like the Alpha model, but in the UK."
              citation={{ label: "David Game College Sabrewing Programme", url: "https://www.davidgamecollege.com/courses/courses-overview/item/110/a-level-ai-powered-adaptive-learning-programme" }}
              dark
            />
          </div>
        </div>
      ),
    },

    // ─── 3. The 10-Grade Gap ───────────────────────────────────────────────────
    {
      id: "learning-gap",
      theme: "Learning Gaps",
      dark: false,
      label: "3 · The 10-Grade Gap",
      content: (
        <div className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-1">
            <Tag>Story 2</Tag>
            <h2 className="text-2xl font-black leading-tight mt-1" style={{ color: "var(--kinship-ink)" }}>
              America's 10-Grade Gap
            </h2>
            <p className="text-sm opacity-60">The highest-performing 13-year-olds are functionally more than 10 grade levels ahead of the lowest performers.</p>
          </div>
          <GapIllustration />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatBubble value="10+" label="Grade levels separating top & bottom 13-year-olds" />
            <StatBubble value="28→42%" label="Tennessee math proficiency, grades 3-8 (2021–2025)" />
            <StatBubble value="$3.86B" label="Federal COVID relief funding Tennessee used for tutoring" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InsightCard
              icon="📈"
              title="Tennessee's Comeback"
              body="High-dosage tutoring (≤3 students, 2-3x/week), quality instructional materials, and summer learning drove TN to #2 nationally for math improvement."
              citation={{ label: "The 74 · Tennessee math recovery report", url: "https://www.the74million.org/article/report-tennessee-students-have-nearly-returned-to-pre-covid-math-achievement/" }}
            />
            <InsightCard
              icon="🏫"
              title="Ability Grouping Debate"
              body="Research backs ability grouping — mixed classrooms may be throttling top achievers. A hot-button topic gaining renewed traction online."
              citation={{ label: "Christine Harrington on ability grouping", url: "https://x.com/clharrington024/status/2050897466115891551", author: "clharrington024" }}
            />
          </div>
        </div>
      ),
    },

    // ─── 4. AI Tools Builders Are Buzzing About ────────────────────────────────
    {
      id: "ai-tools",
      theme: "AI Tooling",
      dark: true,
      label: "4 · AI Tools Builders Are Using",
      content: (
        <div className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-1">
            <Tag>Story 3</Tag>
            <h2 className="text-2xl font-black leading-tight mt-1" style={{ color: "var(--kinship-cream)" }}>
              The New Developer Stack
            </h2>
            <p className="text-sm opacity-60 max-w-xl">The tools builders are actually using day-to-day — from AI coding to video generation.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InsightCard
              icon="💻"
              title="Claude Code Token Waste"
              body="Boris Cherny (Claude Code creator) revealed 9 patterns that waste 73% of tokens — including 14% lost to CLAUDE.md before you type a word."
              citation={{ label: "5,493 likes · @Mnilax thread", url: "https://x.com/mnilax/status/2050321700802408552", author: "mnilax" }}
              dark
            />
            <InsightCard
              icon="🎬"
              title="AI Video Editing with Fable"
              body="Thariq used Fable to edit its own launch video — writing ffmpeg code, using Figma MCP, and Remotion — without touching a video editor. 9,300+ likes."
              citation={{ label: "Thariq · Fable self-editing video", url: "https://x.com/trq212/status/2064826394589442448", author: "trq212" }}
              dark
            />
            <InsightCard
              icon="📧"
              title="Inbox Zero with Codex"
              body="Dan Shipper (Every.to) shared how he uses OpenAI's Codex to hit inbox zero every day — a workflow that went highly viral."
              citation={{ label: "Dan Shipper · Codex workflow", url: "https://x.com/danshipper/status/2062927700218859686", author: "danshipper" }}
              dark
            />
            <InsightCard
              icon="🎥"
              title="Simi: Instant Explainer Videos"
              body="Generate whiteboard-style explainer videos from a prompt or docs in 20 seconds. YC P26 company. Directly relevant for Kinship content creation."
              citation={{ label: "Sudip · Simi launch", url: "https://x.com/sudiprokaya/status/2063132817526309183", author: "sudiprokaya" }}
              dark
            />
          </div>
          <InsightCard
            icon="📚"
            title="Couch to 5K for AI"
            body="A free 30-day AI skill-building program (10 min/day) — Walk → Jog → Run → Race. Goes from browser-based Claude to building automated workflows. Highly relevant for training school staff."
            citation={{ label: "Hilary Gridley · couchto5k.ai", url: "https://couchto5k.ai/" }}
            dark
          />
        </div>
      ),
    },

    // ─── 5. JP Morgan multi-agent ─────────────────────────────────────────────
    {
      id: "enterprise-ai",
      theme: "Enterprise AI",
      dark: false,
      label: "5 · Enterprise AI at Scale",
      content: (
        <div className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-1">
            <Tag>Story 4</Tag>
            <h2 className="text-2xl font-black leading-tight mt-1" style={{ color: "var(--kinship-ink)" }}>
              Enterprise AI at Scale
            </h2>
            <p className="text-sm opacity-60 max-w-xl">What real AI deployments look like at companies — architecture, ROI challenges, and lessons from the frontier.</p>
          </div>
          <AgentArchIllustration />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InsightCard
              icon="🏦"
              title="JP Morgan's Ask David"
              body="Supervisor agent orchestrates specialized subagents for retrieval, structured data, and analytics. 6,900+ likes — this multi-agent pattern is showing up everywhere."
              citation={{ label: "Adam Ghowiba · JP Morgan architecture", url: "https://x.com/adamghowiba/status/2050886233921061281", author: "adamghowiba" }}
            />
            <InsightCard
              icon="⚖️"
              title="Harvey AI: $300M ARR"
              body="Harvey burns 13 trillion tokens/month. Lessons for engineering teams: AI-first companies operate at a completely different scale and cost structure."
              citation={{ label: "Adam Cohen · Harvey AI lessons", url: "https://x.com/adambcohen93/status/2068041108744196206", author: "adambcohen93" }}
            />
            <InsightCard
              icon="🚧"
              title="The Seven Gates of Software Hell"
              body="AI ROI is elusive not because AI doesn't work — but because of organizational and integration barriers. Brandon Carl documents the 7 gates every company hits."
              citation={{ label: "Brandon Carl · AI ROI barriers", url: "https://x.com/brandonjcarl/status/2062376138446418120", author: "brandonjcarl" }}
            />
            <InsightCard
              icon="🔒"
              title="Meta Pauses Internal AI Training"
              body="Meta suspended an internal AI program after sensitive company data was found accessible across the organization. A cautionary data-governance story."
              citation={{ label: "FirstSquawk · Meta AI suspension", url: "https://x.com/firstsquawk/status/2069156036330889638", author: "firstsquawk" }}
            />
          </div>
        </div>
      ),
    },

    // ─── 6. Legislation ───────────────────────────────────────────────────────
    {
      id: "legislation",
      theme: "Policy & Regulation",
      dark: true,
      label: "6 · The Race to Regulate",
      content: (
        <div className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-1">
            <Tag>Story 5</Tag>
            <h2 className="text-2xl font-black leading-tight mt-1" style={{ color: "var(--kinship-cream)" }}>
              The Race to Regulate AI in Schools
            </h2>
            <p className="text-sm opacity-60 max-w-xl">Legislators are moving fast. The window for industry to shape AI policy is closing.</p>
          </div>
          <LegislationMap />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InsightCard
              icon="🏛️"
              title="25+ States, 3 Enacted"
              body="Idaho, Utah, and New York enacted AI education laws. 25+ more states have active legislation covering district AI policies, parental transparency, and chatbot protections."
              citation={{ label: "Whiteboard Advisors · AI education legislation", url: "https://whiteboardadvisors.com/inside-the-race-to-legislate-ai-in-education/" }}
              dark
            />
            <InsightCard
              icon="🤖"
              title="Chatbot Companion Laws"
              body="Five states are targeting AI companion apps specifically — requiring hourly disclosure reminders for minors and banning manipulative engagement tactics."
              citation={{ label: "Whiteboard Advisors · AI chatbot regulation", url: "https://whiteboardadvisors.com/state-policymakers-move-to-regulate-ai-chatbots-companions/" }}
              dark
            />
            <InsightCard
              icon="📱"
              title="Screen Time Backlash"
              body="3 states introduced legislation to overhaul edtech vetting. Rhode Island's bill bans audio/video activation on school devices. The 'less screens' movement is now policy."
              citation={{ label: "EdSurge · Screen time backlash", url: "https://www.edsurge.com/news/2026-05-07-screen-time-concerns-lead-to-backlash-against-edtech-vetting-process" }}
              dark
            />
            <InsightCard
              icon="🍁"
              title="Ontario Bets $60M on Edwin"
              body="Ontario is rolling out Nelson's Edwin platform to all 72 school boards in September 2026 — giving every teacher curriculum-aligned digital tools and real-time student data."
              citation={{ label: "Ontario Government · $60M education investment", url: "https://news.ontario.ca/en/release/1007641/ontario-investing-60-million-to-upgrade-student-learning-resources" }}
              dark
            />
          </div>
        </div>
      ),
    },

    // ─── 7. Owning vs Renting Intelligence ───────────────────────────────────
    {
      id: "owning-intelligence",
      theme: "AI Strategy",
      dark: false,
      label: "7 · Own vs. Rent Intelligence",
      content: (
        <div className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-1">
            <Tag>Story 6</Tag>
            <h2 className="text-2xl font-black leading-tight mt-1" style={{ color: "var(--kinship-ink)" }}>
              Own Your Intelligence
            </h2>
            <p className="text-sm opacity-60 max-w-xl">Building on top of frontier APIs is renting intelligence. The companies that win will own it.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border p-4 flex flex-col gap-3" style={{ borderColor: "var(--kinship-mid)", backgroundColor: "#fef9f0" }}>
              <p className="font-bold text-sm" style={{ color: "var(--kinship-ink)" }}>🏘️ Renting Intelligence</p>
              <ul className="text-xs space-y-1 opacity-70">
                <li>• API pricing can change overnight</li>
                <li>• Provider can shut down your use case</li>
                <li>• No proprietary data advantage</li>
                <li>• Model updates break your product</li>
              </ul>
              <p className="text-xs opacity-50 italic">What Mythos learned the hard way</p>
            </div>
            <div className="rounded-xl border p-4 flex flex-col gap-3" style={{ borderColor: "#90c060", backgroundColor: "#f0f8e8" }}>
              <p className="font-bold text-sm" style={{ color: "#3a6020" }}>🏠 Owning Intelligence</p>
              <ul className="text-xs space-y-1 opacity-80" style={{ color: "#3a6020" }}>
                <li>• Post-train open models on your data</li>
                <li>• Domain expertise baked in</li>
                <li>• Proprietary workflow knowledge</li>
                <li>• You control the roadmap</li>
              </ul>
              <p className="text-xs opacity-60 italic" style={{ color: "#3a6020" }}>The Satya Nadella vision for the LLM/learning loop</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InsightCard
              icon="🔮"
              title="Satya's Ecosystem Thesis"
              body='"A frontier without an ecosystem is not stable." Microsoft CEO argues AI models need robust ecosystems to be sustainable. 41,000+ likes.'
              citation={{ label: "Satya Nadella · ecosystem thesis", url: "https://x.com/satyanadella/status/2066182223213293753", author: "satyanadella" }}
            />
            <InsightCard
              icon="📦"
              title="Applied AI Is Hard"
              body="Box CEO Aaron Levie: the Applied AI layer is proving far more complex than critics predicted. Driving real agentic workflows in enterprise is deeply involved."
              citation={{ label: "Aaron Levie · Applied AI complexity", url: "https://x.com/levie/status/2067455756795039957", author: "levie" }}
            />
            <InsightCard
              icon="🌐"
              title="OpenAlex: Modern Library of Alexandria"
              body="20 people built a free catalog of all human knowledge — called OpenAlex. 240M+ scholarly works, freely accessible. A monumental open-access achievement."
              citation={{ label: "Ihtesham Ali · OpenAlex thread", url: "https://x.com/ihtesham2005/status/2062947159562240161", author: "ihtesham2005" }}
            />
            <InsightCard
              icon="💡"
              title="Owning vs. Renting Intelligence"
              body="Lin Qiao (Fireworks AI): companies that build core products on frontier APIs are renting intelligence — exposed to pricing changes and provider decisions they can't control."
              citation={{ label: "Readwise · Owning vs Renting Intelligence", url: "https://readwise.io/reader/shared/01kvbny1etfmyn9820mmyfpkma" }}
            />
          </div>
        </div>
      ),
    },

    // ─── 8. Building a Company Brain ──────────────────────────────────────────
    {
      id: "company-brain",
      theme: "Knowledge Systems",
      dark: true,
      label: "8 · Building a Company Brain",
      content: (
        <div className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-1">
            <Tag>Story 7</Tag>
            <h2 className="text-2xl font-black leading-tight mt-1" style={{ color: "var(--kinship-cream)" }}>
              5 Levels of a Company Brain
            </h2>
            <p className="text-sm opacity-60">Most companies stall before level 3. Here's the full ladder.</p>
          </div>
          <BrainIllustration />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              ["1", "Index Everything", "Chats, email, docs, code — all indexed and searchable.", false],
              ["2", "Meeting + Agent Traces", "Add recordings and agent reasoning logs to the corpus.", false],
              ["3", "Entity Extraction", "Identify people, projects, decisions — most companies stop here.", true],
              ["4", "Authority Weighting", "Weight by recency, source credibility, and topic authority.", false],
              ["5", "Surface + Resolve Conflicts", "When two sources disagree, the brain knows which to trust.", false],
            ].map(([level, title, body, stuck]) => (
              <div key={level as string} className={`rounded-xl border p-3 flex items-start gap-3 ${stuck ? "border-yellow-400/40 bg-yellow-400/5" : "border-white/10 bg-white/5"}`}>
                <span className={`text-lg font-black shrink-0 ${stuck ? "text-yellow-400" : "opacity-50"}`}>{level}</span>
                <div>
                  <p className={`font-semibold text-sm ${stuck ? "text-yellow-300" : ""}`} style={{ color: stuck ? undefined : "var(--kinship-cream)" }}>
                    {title} {stuck && "← most stuck here"}
                  </p>
                  <p className="text-xs opacity-60">{body as string}</p>
                </div>
              </div>
            ))}
          </div>
          <CitationLink citation={{ label: "Conor Brennan-Burke · 5 levels of company brain", url: "https://x.com/contextconor/status/2069077989611151627", author: "contextconor" }} />
        </div>
      ),
    },

    // ─── 9. The Personalization Debate ────────────────────────────────────────
    {
      id: "personalization",
      theme: "Learning Science",
      dark: false,
      label: "9 · The Personalization Debate",
      content: (
        <div className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-1">
            <Tag>Story 8</Tag>
            <h2 className="text-2xl font-black leading-tight mt-1" style={{ color: "var(--kinship-ink)" }}>
              Does AI Personalization Actually Work?
            </h2>
            <p className="text-sm opacity-60 max-w-xl">A researcher makes a contrarian case — and why it matters for how we build.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border-2 p-4 flex flex-col gap-3" style={{ borderColor: "#c04040", backgroundColor: "#fff5f5" }}>
              <p className="font-bold text-sm" style={{ color: "#800000" }}>❌ Personalization by interest → mostly doesn't work</p>
              <p className="text-xs opacity-80 leading-relaxed" style={{ color: "#800000" }}>
                Daisy Christodoulou: interest-based personalization is a "solution in search of a problem." The right analogy depends on the <em>content</em>, not the learner's preferences.
              </p>
              <CitationLink citation={{ label: "Daisy Christodoulou · Substack", url: "https://open.substack.com/pub/daisychristodoulou/p/why-personalising-education-based", author: "daisychristodoulou" }} />
            </div>
            <div className="rounded-xl border-2 p-4 flex flex-col gap-3" style={{ borderColor: "#40a040", backgroundColor: "#f0fff5" }}>
              <p className="font-bold text-sm" style={{ color: "#205020" }}>✅ Personalization by pace → genuinely powerful</p>
              <p className="text-xs opacity-80 leading-relaxed" style={{ color: "#205020" }}>
                The one form that works: adaptive pacing through shared content. Move students forward only when they've mastered the material. This is what Kinship does.
              </p>
              <CitationLink citation={{ label: "kutluokan · personalization works", url: "https://x.com/kutluokan/status/2049504344509128877", author: "kutluokan" }} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InsightCard
              icon="🧩"
              title="AI Makes You Stupid?"
              body="Nir Zicherman (Oboe): LLMs are not good teachers — they give answers without building retention. Oboe is built to actually teach, not just respond."
              citation={{ label: "Nir Zicherman · Oboe launch", url: "https://x.com/nirzicherman/status/2054205304938594324", author: "nirzicherman" }}
            />
            <InsightCard
              icon="🧑‍🏫"
              title="AI + Human Tutor Combo"
              body="Ben Somers: a student jumped from the 29th to 65th percentile in math in one semester by combining AI tutoring with a real human tutor. The hybrid beats either alone."
              citation={{ label: "Ben Somers · AI + human tutor study", url: "https://x.com/ben_m_somers/status/2060822444353720527", author: "ben_m_somers" }}
            />
          </div>
        </div>
      ),
    },

    // ─── 10. Edtech's Broken Procurement Model ────────────────────────────────
    {
      id: "edtech-procurement",
      theme: "Edtech Industry",
      dark: true,
      label: "10 · Why Bad Edtech Wins",
      content: (
        <div className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-1">
            <Tag>Story 9</Tag>
            <h2 className="text-2xl font-black leading-tight mt-1" style={{ color: "var(--kinship-cream)" }}>
              Why Bad Edtech Wins
            </h2>
            <p className="text-sm opacity-60 max-w-xl">Schools buy terrible software because the procurement process has nothing to do with product quality.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InsightCard
              icon="💸"
              title="i-Ready: $800M/Year"
              body="i-Ready is widely disliked by teachers and students. It makes $800M annually in school contracts. The broken procurement path rewards sales, not outcomes."
              citation={{ label: "Joe Norman · edtech procurement broken", url: "https://x.com/normonics/status/2054388672988934493", author: "normonics" }}
              dark
            />
            <InsightCard
              icon="🔍"
              title="IT Officials Worry About AI"
              body="School IT officials cite cybersecurity, data privacy, and student safety as top concerns with AI adoption. Distrust is high — and procurement gatekeepers are cautious."
              citation={{ label: "ASCD · school IT officials on AI", url: "https://information.ascd.org/school-it-officials-worry-about-ai-adoption-cybersecurity" }}
              dark
            />
            <InsightCard
              icon="🎯"
              title="Koji AI Tutor"
              body="Jason Calacanis praised an AI tutoring product called Koji that 'teaches kids to think rather than make them dependent on AI.' 2,570 likes — strong interest in AI that builds cognition."
              citation={{ label: "Jason Calacanis · Koji tutor", url: "https://x.com/Jason/status/2060405197965512989", author: "Jason" }}
              dark
            />
            <InsightCard
              icon="📊"
              title="Stanford EdOpportunity"
              body="The first national database of academic performance — built at Stanford to finally let researchers, parents, and policymakers see real outcome data across U.S. schools."
              citation={{ label: "edopportunity.org", url: "https://edopportunity.org/" }}
              dark
            />
          </div>
        </div>
      ),
    },

    // ─── 11. The Builders' Vision ────────────────────────────────────────────
    {
      id: "builders-vision",
      theme: "Big Picture",
      dark: false,
      label: "11 · The Builders' Vision",
      content: (
        <div className="flex flex-col gap-5 w-full">
          <div className="flex flex-col gap-1">
            <Tag>Big Picture</Tag>
            <h2 className="text-2xl font-black leading-tight mt-1" style={{ color: "var(--kinship-ink)" }}>
              The Builders' Vision
            </h2>
            <p className="text-sm opacity-60 max-w-xl">The best quotes and predictions from the most insightful builders in the channel.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                quote: "Every service, every app, every data source will either wrap themselves in a headless MCP/CLI, create a new AI-enabled UI, or be killed by someone who does.",
                author: "Antonio García Martínez",
                handle: "antoniogm",
                url: "https://x.com/antoniogm/status/2057915316706083304",
              },
              {
                quote: "We're still writing code like it's 2013. The future of software is just-in-time and 10x less code. And the agents will be free.",
                author: "Garry Tan",
                handle: "garrytan",
                url: "https://x.com/garrytan/status/2061456247799644203",
              },
              {
                quote: "2-3 years in IB or consulting early in your career builds the cognitive endurance to outwork everyone else for the rest of your life.",
                author: "Jihad",
                handle: "jaesmail",
                url: "https://x.com/jaesmail/status/2064699287427006601",
              },
              {
                quote: "FREEDOM IS THE LEARNING ITSELF. There is no point at which we 'finish' learning — it builds character, improves society, and connects us to something divine.",
                author: "Eliana Goldin",
                handle: "eliana_goldin",
                url: "https://x.com/eliana_goldin/status/2069635348624298180",
              },
            ].map(({ quote, author, handle, url }) => (
              <div key={handle} className="rounded-xl border p-4 flex flex-col gap-3" style={{ borderColor: "var(--kinship-mid)" }}>
                <p className="text-sm italic opacity-80 leading-relaxed" style={{ color: "var(--kinship-ink)" }}>"{quote}"</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold opacity-70">{author}</span>
                  <CitationLink citation={{ label: `@${handle}`, url, author: handle }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },

    // ─── 12. Closing / Kinship Angle ──────────────────────────────────────────
    {
      id: "kinship-angle",
      theme: "Kinship Angle",
      dark: true,
      label: "12 · What This Means for Kinship",
      content: (
        <div className="flex flex-col gap-6 w-full items-center text-center">
          <div className="flex flex-col gap-2 items-center">
            <Tag>Takeaways</Tag>
            <h2 className="text-2xl font-black leading-tight mt-1 max-w-xl" style={{ color: "var(--kinship-cream)" }}>
              What This Means for Kinship
            </h2>
            <p className="text-sm opacity-60 max-w-md">The collective intelligence of the team, distilled.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left w-full">
            {[
              ["🎯", "Pace-based personalization wins", "Interest-based personalization is a myth. Kinship's adaptive pacing model is validated by the research."],
              ["🧠", "Own your intelligence", "Post-training on student/teacher data is a strategic moat. Don't just rent from OpenAI."],
              ["🏫", "The Alpha model is spreading", "Adaptive mornings + creative afternoons is becoming the default model for AI-first schools worldwide."],
              ["⚖️", "Policy window is closing", "25+ states are writing AI education law NOW. Kinship needs a policy voice in this moment."],
              ["💪", "Hybrid beats solo", "AI + human tutor together outperforms either alone. Kinship's teacher-in-the-loop model is right."],
              ["📊", "Prove outcomes", "Tennessee proved outcomes with data. Kinship needs the same story — clear metrics, clear gains."],
            ].map(([icon, title, desc]) => (
              <div key={title as string} className="rounded-xl border p-3 flex items-start gap-3 border-white/10 bg-white/5">
                <span className="text-xl shrink-0">{icon}</span>
                <div>
                  <p className="font-bold text-sm" style={{ color: "var(--kinship-cream)" }}>{title as string}</p>
                  <p className="text-xs opacity-60">{desc as string}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col items-center gap-1 mt-2 opacity-40 text-xs">
            <p>Sources: Slack channel #topic-collective-intelligence</p>
            <p>Compiled by Hermes · June 2026</p>
          </div>
        </div>
      ),
    },
  ];
}

// ─── Main Slideshow ─────────────────────────────────────────────────────────────

export default function CollectiveIntelligenceMagazine() {
  const slides = makeSlides();
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const go = useCallback(
    (next: number) => {
      if (transitioning || next < 0 || next >= slides.length) return;
      setTransitioning(true);
      setTimeout(() => {
        setCurrent(next);
        setTransitioning(false);
        containerRef.current?.scrollTo({ top: 0, behavior: "instant" });
      }, 200);
    },
    [transitioning, slides.length]
  );

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") go(current + 1);
      if (e.key === "ArrowLeft") go(current - 1);
      if (e.key === "Home") go(0);
      if (e.key === "End") go(slides.length - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current, go, slides.length]);

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) go(current + 1);
      else go(current - 1);
    }
  };

  const slide = slides[current];
  const isDark = slide.dark ?? false;

  const bg = isDark ? "var(--kinship-ink)" : "var(--kinship-cream)";
  const fg = isDark ? "var(--kinship-cream)" : "var(--kinship-ink)";

  return (
    <div
      style={{
        height: "100dvh",
        backgroundColor: bg,
        color: fg,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
          flexShrink: 0,
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", opacity: 0.5, textTransform: "uppercase" }}>
          Collective Intelligence
        </span>
        <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => go(i)}
              style={{
                width: i === current ? 24 : 6,
                height: 6,
                borderRadius: 3,
                border: "none",
                cursor: "pointer",
                backgroundColor: i === current ? fg : `${fg}40`,
                transition: "all 0.2s ease",
                padding: 0,
              }}
            />
          ))}
        </div>
        <span style={{ fontSize: "11px", opacity: 0.4 }}>
          {current + 1} / {slides.length}
        </span>
      </div>

      {/* Slide label */}
      <div style={{ padding: "8px 20px 0", flexShrink: 0 }}>
        <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.35 }}>
          {slide.label}
        </span>
      </div>

      {/* Main content */}
      <div
        ref={containerRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 20px 24px",
          opacity: transitioning ? 0 : 1,
          transition: "opacity 0.2s ease",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto", width: "100%" }}>
          {slide.content}
        </div>
      </div>

      {/* Bottom nav */}
      <div
        style={{
          padding: "12px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => go(current - 1)}
          disabled={current === 0}
          style={{
            padding: "8px 18px",
            borderRadius: 8,
            border: `1px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.12)"}`,
            background: "transparent",
            color: fg,
            cursor: current === 0 ? "not-allowed" : "pointer",
            opacity: current === 0 ? 0.3 : 1,
            fontSize: 13,
            fontWeight: 600,
            transition: "opacity 0.2s",
          }}
        >
          ← Prev
        </button>
        <span style={{ fontSize: 11, opacity: 0.35 }}>← swipe or use arrow keys →</span>
        <button
          onClick={() => go(current + 1)}
          disabled={current === slides.length - 1}
          style={{
            padding: "8px 18px",
            borderRadius: 8,
            border: "none",
            background: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
            color: fg,
            cursor: current === slides.length - 1 ? "not-allowed" : "pointer",
            opacity: current === slides.length - 1 ? 0.3 : 1,
            fontSize: 13,
            fontWeight: 600,
            transition: "opacity 0.2s",
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
