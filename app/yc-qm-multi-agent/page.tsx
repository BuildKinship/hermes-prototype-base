"use client";
// Needed for Slideshow keyboard navigation and animation state

import React, { type ReactNode } from "react";
import {
  Slideshow,
  SlideTitle,
  SectionLabel,
  SlideCard,
  SlideCardGrid,
  SlideDarkCard,
  ResponsiveSVG,
} from "@/components/slides/slideshow";
import type { Slide } from "@/components/slides/slideshow";

// ── Local helper components ───────────────────────────────────────────────

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <SlideCard>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-semibold text-[var(--kinship-ink)] text-sm mb-1">{title}</div>
      <div className="text-xs text-[var(--kinship-mid)] leading-relaxed">{description}</div>
    </SlideCard>
  );
}

function DarkFeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <SlideDarkCard>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-semibold text-sm mb-1" style={{ color: "rgba(245,240,232,0.95)" }}>{title}</div>
      <div className="text-xs mt-0.5 leading-relaxed" style={{ color: "rgba(245,240,232,0.85)" }}>{description}</div>
    </SlideDarkCard>
  );
}

function Step({ n, title, desc, url }: { n: number; title: string; desc: string; url?: string }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-7 h-7 rounded-full bg-[var(--kinship-ink)] text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{n}</div>
      <div>
        {url ? (
          <a href={url} target="_blank" rel="noopener noreferrer"
            className="font-semibold text-[var(--kinship-ink)] text-sm hover:underline underline-offset-2 flex items-center gap-1">
            {title} <span className="text-[var(--kinship-mid)] text-xs opacity-70">↗</span>
          </a>
        ) : (
          <div className="font-semibold text-[var(--kinship-ink)] text-sm">{title}</div>
        )}
        <div className="text-xs text-[var(--kinship-mid)] mt-0.5 leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}

function QuoteCard({ quote, author, role, sentiment, url }: {
  quote: string; author: string; role: string; sentiment: "positive" | "critical"; url: string;
}) {
  const colors = sentiment === "positive"
    ? "border-emerald-200 bg-emerald-50 hover:border-emerald-400"
    : "border-amber-200 bg-amber-50 hover:border-amber-400";
  const icon = sentiment === "positive" ? "✅" : "⚠️";
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className={`rounded-xl border p-3 block transition-all hover:shadow-sm ${colors}`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-xs">{icon}</span>
        <span className="text-xs font-semibold text-[var(--kinship-ink)]">{author}</span>
        <span className="ml-auto text-[var(--kinship-mid)] text-xs opacity-60">↗</span>
      </div>
      <p className="text-xs text-[var(--kinship-ink)] leading-relaxed italic mb-1.5">&ldquo;{quote}&rdquo;</p>
      <div className="text-xs text-[var(--kinship-mid)] font-medium">{role}</div>
    </a>
  );
}

function ResourceCard({ title, desc, url, tag }: { title: string; desc: string; url: string; tag: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="block p-3 rounded-xl border border-[var(--kinship-mid)] bg-white hover:border-[var(--kinship-ink)] hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[var(--kinship-ink)] text-sm truncate">{title}</div>
          <div className="text-[var(--kinship-mid)] text-xs mt-0.5 leading-relaxed">{desc}</div>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--kinship-cream)] text-[var(--kinship-mid)] font-medium border border-[var(--kinship-mid)] flex-shrink-0">{tag}</span>
      </div>
    </a>
  );
}

// ── SVG Animations ─────────────────────────────────────────────────────────

function CoverAnim() {
  return (
    <svg viewBox="0 0 520 160" width="100%" style={{ maxWidth: 520, display: "block" }}>
      <style>{`
        @keyframes qm_pulse { 0%,100%{opacity:0.6;r:22} 50%{opacity:1;r:26} }
        @keyframes qm_flow { 0%{stroke-dashoffset:40} 100%{stroke-dashoffset:0} }
        @keyframes qm_bob1 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-7px)} }
        @keyframes qm_bob2 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-7px)} }
        @keyframes qm_bob3 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-7px)} }
        .qm_n1 { animation: qm_bob1 3.2s ease-in-out infinite }
        .qm_n2 { animation: qm_bob2 3.2s 0.5s ease-in-out infinite }
        .qm_n3 { animation: qm_bob3 3.2s 1s ease-in-out infinite }
        .qm_line { animation: qm_flow 2s linear infinite; stroke-dasharray: 8 4; }
        .qm_hub { animation: qm_pulse 2.5s ease-in-out infinite }
      `}</style>

      {/* Center hub — QM core */}
      <circle cx="260" cy="80" className="qm_hub" r="24" fill="rgba(255,255,255,0.25)" />
      <text x="260" y="85" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">QM</text>

      {/* Left node — Accounting */}
      <g className="qm_n1">
        <circle cx="80" cy="80" r="24" fill="rgba(255,255,255,0.15)" />
        <text x="80" y="77" textAnchor="middle" fontSize="11" fill="white">Acct</text>
        <text x="80" y="90" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.6)">Finance</text>
      </g>

      {/* Right node — Engineering */}
      <g className="qm_n3">
        <circle cx="440" cy="80" r="24" fill="rgba(255,255,255,0.15)" />
        <text x="440" y="77" textAnchor="middle" fontSize="11" fill="white">Eng</text>
        <text x="440" y="90" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.6)">Code</text>
      </g>

      {/* Top node — Legal */}
      <g className="qm_n2">
        <circle cx="180" cy="30" r="20" fill="rgba(255,255,255,0.15)" />
        <text x="180" y="27" textAnchor="middle" fontSize="10" fill="white">Legal</text>
        <text x="180" y="39" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.5)">Docs</text>
      </g>

      {/* Bottom node — Events */}
      <g className="qm_n2">
        <circle cx="340" cy="130" r="20" fill="rgba(255,255,255,0.15)" />
        <text x="340" y="127" textAnchor="middle" fontSize="10" fill="white">Events</text>
        <text x="340" y="139" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.5)">Ops</text>
      </g>

      {/* Connection lines */}
      <line x1="104" y1="80" x2="236" y2="80" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" className="qm_line" />
      <line x1="284" y1="80" x2="416" y2="80" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" className="qm_line" />
      <line x1="194" y1="46" x2="244" y2="62" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" className="qm_line" />
      <line x1="276" y1="98" x2="324" y2="114" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" className="qm_line" />

      {/* Postgres badge */}
      <rect x="220" y="108" width="80" height="18" rx="9" fill="rgba(255,255,255,0.12)" />
      <text x="260" y="121" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.7)">Postgres backbone</text>
    </svg>
  );
}

function ArchAnim() {
  return (
    <svg viewBox="0 0 520 200" width="100%" style={{ maxWidth: 520, display: "block" }}>
      <style>{`
        @keyframes arch_fade { 0%,100%{opacity:0.7} 50%{opacity:1} }
        .arch_blink { animation: arch_fade 2s ease-in-out infinite }
      `}</style>
      {/* Background layers */}
      <rect x="20" y="10" width="480" height="40" rx="8" fill="var(--kinship-cream)" stroke="var(--kinship-mid)" strokeWidth="1" />
      <text x="260" y="33" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--kinship-ink)">Interface Layer: Slack + Web UI</text>

      <rect x="20" y="62" width="480" height="40" rx="8" fill="var(--kinship-cream)" stroke="var(--kinship-mid)" strokeWidth="1" />
      <text x="260" y="85" textAnchor="middle" fontSize="11" fontWeight="600" fill="var(--kinship-ink)">Headless Core: API · Identity · Policy · Scheduler · ACL · Audit</text>

      <rect x="20" y="114" width="230" height="40" rx="8" fill="var(--kinship-cream)" stroke="var(--kinship-mid)" strokeWidth="1" />
      <text x="135" y="134" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--kinship-ink)">Agent Harness</text>
      <text x="135" y="148" textAnchor="middle" fontSize="9" fill="var(--kinship-mid)">Pi · Claude Code · OpenCode · Codex</text>

      <rect x="270" y="114" width="230" height="40" rx="8" fill="var(--kinship-cream)" stroke="var(--kinship-mid)" strokeWidth="1" />
      <text x="385" y="134" textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--kinship-ink)">Per-Scope Sandbox</text>
      <text x="385" y="148" textAnchor="middle" fontSize="9" fill="var(--kinship-mid)">Files · Tools · Credentials · Memory</text>

      <rect x="20" y="166" width="480" height="26" rx="8" fill="var(--kinship-ink)" />
      <text x="260" y="183" textAnchor="middle" fontSize="10" fontWeight="600" fill="rgba(245,240,232,0.9)">Postgres: Sessions · Memory · Cron Queue · Audit Logs</text>

      {/* Arrows */}
      <line x1="260" y1="50" x2="260" y2="62" stroke="var(--kinship-mid)" strokeWidth="1.5" markerEnd="url(#arch_arrow)" />
      <line x1="135" y1="102" x2="135" y2="114" stroke="var(--kinship-mid)" strokeWidth="1.5" />
      <line x1="385" y1="102" x2="385" y2="114" stroke="var(--kinship-mid)" strokeWidth="1.5" />
      <line x1="260" y1="154" x2="260" y2="166" stroke="var(--kinship-mid)" strokeWidth="1.5" />
      <defs>
        <marker id="arch_arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill="var(--kinship-mid)" />
        </marker>
      </defs>
    </svg>
  );
}

function BrainCompareAnim() {
  return (
    <svg viewBox="0 0 520 170" width="100%" style={{ maxWidth: 520, display: "block" }}>
      {/* QM side */}
      <rect x="10" y="10" width="235" height="150" rx="12" fill="rgba(245,240,232,0.08)" stroke="rgba(245,240,232,0.25)" strokeWidth="1" />
      <text x="127" y="33" textAnchor="middle" fontSize="12" fontWeight="700" fill="rgba(245,240,232,0.95)">YC QM</text>
      <text x="127" y="52" textAnchor="middle" fontSize="9" fill="rgba(245,240,232,0.7)">Per-scope isolation</text>
      <text x="127" y="70" textAnchor="middle" fontSize="9" fill="rgba(245,240,232,0.7)">TypeScript + Postgres</text>
      <text x="127" y="88" textAnchor="middle" fontSize="9" fill="rgba(245,240,232,0.7)">Harness-agnostic</text>
      <text x="127" y="106" textAnchor="middle" fontSize="9" fill="rgba(245,240,232,0.7)">Self-hosted infra</text>
      <text x="127" y="124" textAnchor="middle" fontSize="9" fill="rgba(245,240,232,0.7)">Security postures</text>
      <text x="127" y="142" textAnchor="middle" fontSize="9" fill="rgba(245,240,232,0.7)">Contribution via ADRs</text>

      {/* VS divider */}
      <circle cx="260" cy="85" r="18" fill="rgba(245,240,232,0.12)" stroke="rgba(245,240,232,0.3)" strokeWidth="1" />
      <text x="260" y="90" textAnchor="middle" fontSize="11" fontWeight="700" fill="rgba(245,240,232,0.8)">VS</text>

      {/* Kinship Brain side */}
      <rect x="275" y="10" width="235" height="150" rx="12" fill="rgba(245,240,232,0.08)" stroke="rgba(245,240,232,0.25)" strokeWidth="1" />
      <text x="392" y="33" textAnchor="middle" fontSize="12" fontWeight="700" fill="rgba(245,240,232,0.95)">Kinship Brain</text>
      <text x="392" y="52" textAnchor="middle" fontSize="9" fill="rgba(245,240,232,0.7)">Notion + Wiki dual-store</text>
      <text x="392" y="70" textAnchor="middle" fontSize="9" fill="rgba(245,240,232,0.7)">Skills + Crons + Memory</text>
      <text x="392" y="88" textAnchor="middle" fontSize="9" fill="rgba(245,240,232,0.7)">Hermes as sole agent</text>
      <text x="392" y="106" textAnchor="middle" fontSize="9" fill="rgba(245,240,232,0.7)">Managed SaaS (Slack)</text>
      <text x="392" y="124" textAnchor="middle" fontSize="9" fill="rgba(245,240,232,0.7)">RBAC user-guard plugin</text>
      <text x="392" y="142" textAnchor="middle" fontSize="9" fill="rgba(245,240,232,0.7)">Human approval for writes</text>
    </svg>
  );
}

// ── Slides ──────────────────────────────────────────────────────────────────

const slides: Slide[] = [
  // Slide 1 — Cover
  {
    id: "cover",
    dark: true,
    label: "Cover",
    content: (
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="text-xs font-semibold tracking-widest uppercase" style={{ color: "rgba(245,240,232,0.55)" }}>
          YC Open-Source · July 2026
        </div>
        <SlideTitle title="QM: The Company-Wide Agent Harness" subtitle="How Y Combinator built a multiplayer AI platform for every team — and what it means for how we run Kinship." dark />
        <ResponsiveSVG maxWidth={520}>
          <CoverAnim />
        </ResponsiveSVG>
        <div className="text-xs" style={{ color: "rgba(245,240,232,0.4)" }}>
          9 slides · ← → to navigate
        </div>
      </div>
    ),
  },

  // Slide 2 — What Is It?
  {
    id: "what-is-it",
    dark: false,
    label: "1 · What Is It?",
    content: (
      <div className="flex flex-col items-center gap-6 w-full">
        <SectionLabel>1 · What Is It?</SectionLabel>
        <SlideTitle
          title="Every person in your company gets their own AI agent."
          size="sm"
        />
        <p className="text-sm text-[var(--kinship-mid)] text-center max-w-2xl leading-relaxed">
          Y Combinator open-sourced <a href="https://github.com/yc-software/qm" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 font-medium text-[var(--kinship-ink)]">QM</a> — a TypeScript multi-agent harness they&apos;ve been running internally across accounting, legal, events, and engineering. Unlike personal AI assistants, QM is designed for whole-company deployment with true per-user isolation. It got <strong>4,100+ GitHub stars</strong> within hours of the announcement.
        </p>
        <SlideCardGrid>
          <SlideCard>
            <div className="font-semibold text-[var(--kinship-ink)] text-sm mb-1">Made by YC</div>
            <div className="text-xs text-[var(--kinship-mid)]">Internal tool YC used for 12+ months across multiple departments before open-sourcing under MIT license</div>
          </SlideCard>
          <SlideCard>
            <div className="font-semibold text-[var(--kinship-ink)] text-sm mb-1">Multiplayer by design</div>
            <div className="text-xs text-[var(--kinship-mid)]">Each Slack user, channel, and project is an isolated scope with independent memory, files, credentials, and a durable sandbox</div>
          </SlideCard>
          <SlideCard>
            <div className="font-semibold text-[var(--kinship-ink)] text-sm mb-1">Self-hosted, cloud-first</div>
            <div className="text-xs text-[var(--kinship-mid)]">Runs on Fly.io or AWS. Harness-agnostic: swap between Pi, Claude Code, OpenCode, or Codex without changing anything else</div>
          </SlideCard>
        </SlideCardGrid>
      </div>
    ),
  },

  // Slide 3 — Key Features
  {
    id: "key-features",
    dark: false,
    label: "2 · Key Features",
    content: (
      <div className="flex flex-col items-center gap-5 w-full">
        <SectionLabel>2 · Key Features</SectionLabel>
        <SlideTitle title="One platform. Every team. Full isolation." size="sm" />
        <SlideCardGrid>
          <FeatureCard icon="🔒" title="Per-Scope Isolation" description="Every user and channel gets their own memory, files, credentials keychain, crons, and durable sandbox — no data leaks across scopes" />
          <FeatureCard icon="🤖" title="Harness-Agnostic" description="Swap agent backends without changing anything else. Pi, Claude Code, OpenCode, and Codex all drive the same core via a clean TypeScript interface" />
          <FeatureCard icon="🗄️" title="Postgres Backbone" description="Sessions, memory, cron queue, and audit logs all live in Postgres — nothing in-memory for durable state. Works across blue-green multi-instance deployments" />
          <FeatureCard icon="⏰" title="Triggers + Crons" description="Schedule recurring tasks, set up webhooks, and run background watchers per scope — cron jobs are user-owned and fully isolated" />
          <FeatureCard icon="🧠" title="Skills System" description="Markdown-based SKILL.md files with YAML frontmatter, scope-owned and shareable by grant. Includes seed skills for Google Workspace, GitHub, Linear, Dropbox, and more" />
          <FeatureCard icon="🛡️" title="Three Security Postures" description="Strict (every tool call pauses for approval), Auto (content provenance screening), or Dangerous. Org-wide policy; individual scopes can only tighten, never loosen" />
        </SlideCardGrid>
      </div>
    ),
  },

  // Slide 4 — Architecture
  {
    id: "architecture",
    dark: false,
    label: "3 · Architecture",
    content: (
      <div className="flex flex-col items-center gap-5 w-full">
        <SectionLabel>3 · Architecture Deep-Dive</SectionLabel>
        <SlideTitle title="Interface-first. Everything is swappable." size="sm" />
        <ResponsiveSVG maxWidth={520}>
          <ArchAnim />
        </ResponsiveSVG>
        <SlideCardGrid>
          <SlideCard>
            <div className="font-semibold text-[var(--kinship-ink)] text-sm mb-1">Headless TypeScript Core</div>
            <div className="text-xs text-[var(--kinship-mid)]">Every component (harness, session store, sandbox, memory) sits behind a TypeScript interface. Production implementations swap in via <code className="bg-[var(--kinship-cream)] px-1 rounded">src/wiring.ts</code></div>
          </SlideCard>
          <SlideCard>
            <div className="font-semibold text-[var(--kinship-ink)] text-sm mb-1">Execute Tool Primitive</div>
            <div className="text-xs text-[var(--kinship-mid)]">The core tool primitive is <code className="bg-[var(--kinship-cream)] px-1 rounded">execute</code> — which runs commands in the scope&apos;s durable sandbox. Installed tools stay installed between turns (&quot;their computer&quot;)</div>
          </SlideCard>
          <SlideCard>
            <div className="font-semibold text-[var(--kinship-ink)] text-sm mb-1">Deployment Directory</div>
            <div className="text-xs text-[var(--kinship-mid)]">Org-specific config lives in <code className="bg-[var(--kinship-cream)] px-1 rounded">deploy/layers/</code>. The core stays byte-identical to upstream. Private fork (not GitHub fork) keeps org code private</div>
          </SlideCard>
        </SlideCardGrid>
      </div>
    ),
  },

  // Slide 5 — How To Deploy
  {
    id: "how-to-deploy",
    dark: false,
    label: "4 · Deploy It",
    content: (
      <div className="flex flex-col items-center gap-5 w-full">
        <SectionLabel>4 · How To Deploy It</SectionLabel>
        <SlideTitle title="Tell an agent to deploy it for you." size="sm" />
        <div className="flex flex-col gap-3 w-full max-w-2xl">
          <Step n={1} title="Run the init command" url="https://github.com/yc-software/qm"
            desc='npm exec --yes --package=@yc-software/qm@latest -- qm init . --org <slug> --target fly' />
          <Step n={2} title="Choose your harness"
            desc="Pick Pi (default), Claude Code, OpenCode, or Codex. Set HARNESS= in your .env. You can swap later without rebuilding." />
          <Step n={3} title="Connect Slack"
            desc="Add SLACK_BOT_TOKEN + SLACK_APP_TOKEN. QM will create a bot in your workspace that each user can DM or use in channels." />
          <Step n={4} title="Set budget caps"
            desc="BUDGET_USD_PER_WINDOW per user + ORG_BUDGET_USD_PER_WINDOW org-wide. Prevents runaway costs from unsupervised agents." />
          <Step n={5} title="Choose security posture"
            desc='HARNESS_SECURITY_POSTURE=auto (default). Strict = every tool call paused for approval. Dangerous = no screening (dev only).' />
        </div>
        <div className="mt-2 p-3 rounded-xl bg-[var(--kinship-cream)] border border-[var(--kinship-mid)] w-full max-w-2xl">
          <div className="text-xs font-semibold text-[var(--kinship-ink)] mb-1">YC&apos;s suggested approach</div>
          <div className="text-xs text-[var(--kinship-mid)] font-mono">Try telling your coding agent of choice to &quot;deploy https://github.com/yc-software/qm&quot;</div>
        </div>
      </div>
    ),
  },

  // Slide 6 — Why It Matters (dark)
  {
    id: "why-it-matters",
    dark: true,
    label: "5 · Why It Matters",
    content: (
      <div className="flex flex-col items-center gap-6 w-full">
        <SectionLabel>5 · Why It Matters</SectionLabel>
        <SlideTitle title="The hardest problem in company-wide AI isn't the agent loop — it's isolation." subtitle="QM solves the problem that every enterprise AI deployment hits: how do you give everyone their own agent without data leaking across teams, without one user's cron jobs breaking another's context?" dark />
        <SlideCardGrid>
          <DarkFeatureCard icon="🌍" title="4,172 GitHub stars in 24 hours" description="Fastest-growing open-source agent harness since AutoGPT. HN thread hit 618 points — second most-discussed agent project of 2026" />
          <DarkFeatureCard icon="🏢" title="Battle-tested at YC scale" description="Used across accounting, legal, events, engineering at YC for 12+ months before open-sourcing. Not a weekend side project — a real internal tool" />
          <DarkFeatureCard icon="🔑" title="The scope insight is the breakthrough" description="Per-person, per-channel, per-project isolation — each with their own memory, files, credentials, and a durable sandbox that persists between sessions" />
        </SlideCardGrid>
      </div>
    ),
  },

  // Slide 7 — What People Are Saying
  {
    id: "reactions",
    dark: false,
    label: "6 · Reactions",
    content: (
      <div className="flex flex-col items-center gap-5 w-full">
        <SectionLabel>6 · What People Are Saying</SectionLabel>
        <SlideTitle title="The isolation insight is validated. The open-source model is debated." size="sm" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-3xl">
          <QuoteCard
            sentiment="positive"
            author="@knighthacker (HN)"
            role="Builder of AQ — a competing multiplayer harness"
            url="https://news.ycombinator.com/item?id=49127537"
            quote="The hardest problem in multiplayer agents has not been the agent loop. It is scoping, and QM's per-person scopes plus shared rooms is a sane answer for a company-wide assistant."
          />
          <QuoteCard
            sentiment="positive"
            author="@luciana1u (HN)"
            role="Hacker News community"
            url="https://news.ycombinator.com/item?id=49129444"
            quote="I gave an agent its own Slack channel and it started scheduling meetings with other agents without me. I've never felt more like middle management."
          />
          <QuoteCard
            sentiment="critical"
            author="@wxw (HN)"
            role="On QM's contribution model"
            url="https://news.ycombinator.com/item?id=49127875"
            quote="We take contributions as human-written text, not code — describe the change in a .txt file in adrs/, and if we're aligned we'll handle the implementation. Closer to feature requests at that point?"
          />
          <QuoteCard
            sentiment="critical"
            author="@hmokiguess (HN)"
            role="On unsupervised agent behavior"
            url="https://news.ycombinator.com/item?id=49134902"
            quote="That explains why there is so much low-effort cold outreach on LinkedIn from YC founders. It's getting ridiculous — the amount of unsupervised agents doing active inbox management on things that should be personal relationship work."
          />
        </div>
      </div>
    ),
  },

  // Slide 8 — Kinship Brain Comparison (dark)
  {
    id: "kinship-comparison",
    dark: true,
    label: "7 · Kinship vs QM",
    content: (
      <div className="flex flex-col items-center gap-5 w-full">
        <SectionLabel>7 · Kinship Brain vs QM</SectionLabel>
        <SlideTitle title="We share the same philosophy. Different execution." subtitle="Both systems use Slack as the interface, markdown-based skills, cron scheduling, and memory persistence. Here's where QM can inform our roadmap." dark />
        <ResponsiveSVG maxWidth={520}>
          <BrainCompareAnim />
        </ResponsiveSVG>
        <SlideCardGrid>
          <DarkFeatureCard icon="✅" title="What we do well" description="Notion-backed memory is richer than QM's Postgres memory. Our dual-store (Notion + wiki) gives us structured CRM data alongside narrative context — QM has no equivalent." />
          <DarkFeatureCard icon="🔄" title="What QM does better" description="Scope isolation: QM gives every user their own memory, files, and sandbox. Our Brain is single-agent (Hermes) — everyone shares one context. QM's per-user model prevents cross-contamination." />
          <DarkFeatureCard icon="🚀" title="Key learnings to adopt" description="1) Per-user scopes in Hermes. 2) Formal security postures (strict/auto/dangerous). 3) ADR-style contribution model for skills. 4) Budget caps per user. 5) Harness rotation without rebuilding." />
        </SlideCardGrid>
      </div>
    ),
  },

  // Slide 9 — Go Deeper
  {
    id: "go-deeper",
    dark: false,
    label: "8 · Go Deeper",
    content: (
      <div className="flex flex-col items-center gap-5 w-full">
        <SectionLabel>8 · Go Deeper</SectionLabel>
        <SlideTitle title="Everything you need to explore further." size="sm" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-3xl">
          <ResourceCard
            title="YC QM GitHub Repo"
            desc="Full source code, README, AGENTS.md, security model, and deployment guide"
            url="https://github.com/yc-software/qm"
            tag="GitHub"
          />
          <ResourceCard
            title="QM Homepage"
            desc="Official product page with hosted version and documentation"
            url="https://qm.ycombinator.com"
            tag="Official"
          />
          <ResourceCard
            title="Original YC Tweet"
            desc="The announcement tweet with 9k+ likes and 1.4M views"
            url="https://x.com/ycombinator/status/2083243960684908768"
            tag="Tweet"
          />
          <ResourceCard
            title="Hacker News Thread"
            desc="618 points, 140 comments — the deepest community analysis of QM's design decisions"
            url="https://news.ycombinator.com/item?id=49126604"
            tag="HN Discussion"
          />
          <ResourceCard
            title="QM Security Model"
            desc="Three-tier security postures, provenance labeling, command policy — and honest disclosure of known limitations"
            url="https://github.com/yc-software/qm/blob/main/SECURITY.md"
            tag="Security"
          />
          <ResourceCard
            title="QM Contributing Guide"
            desc="The ADR-based contribution model: describe changes as text, YC handles implementation"
            url="https://github.com/yc-software/qm/blob/main/CONTRIBUTING.md"
            tag="Process"
          />
          <ResourceCard
            title="QM Skills Seed"
            desc="Built-in skills: Google Workspace, GitHub, Linear, Dropbox, morning digests, and the anti-slop frontend taste skill"
            url="https://github.com/yc-software/qm/tree/main/skills-seed"
            tag="Skills"
          />
          <ResourceCard
            title="Hermes Agent Docs"
            desc="Our own agent harness — compare QM's approach with Hermes' skill system, crons, and memory architecture"
            url="https://hermes-agent.nousresearch.com/docs"
            tag="Kinship"
          />
        </div>
      </div>
    ),
  },
];

export default function Page() {
  return <Slideshow slides={slides} storageKey="yc-qm-slide" />;
}
