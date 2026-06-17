"use client";
// slide deck presentation — keyboard nav, interactive ask-the-room prompts

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, type Transition } from "framer-motion";
import {
  Brain,
  Zap,
  Users,
  Calendar,
  MessageSquare,
  Database,
  GitBranch,
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Network,
  BookOpen,
  Mic,
  Star,
  CheckCircle2,
  Layers,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SlideProps {
  slideNumber: number;
  totalSlides: number;
}

// ─── Motion constants ─────────────────────────────────────────────────────────
const EASE_OUT = [0.22, 1, 0.36, 1] as unknown as Transition["ease"];
const EASE_IN = [0.55, 0, 1, 0.45] as unknown as Transition["ease"];

// ─── Slide content components ─────────────────────────────────────────────────

function SlideTitle({ title, subtitle, eyebrow, dark = false }: { title: string; subtitle?: string; eyebrow?: string; dark?: boolean }) {
  return (
    <div className="text-center max-w-5xl px-8">
      {eyebrow && (
        <p className="mb-6 text-sm font-mono tracking-[0.2em] uppercase" style={{ color: dark ? "oklch(70% 0.05 293)" : "var(--kinship-mid)" }}>
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
        <p className="mt-8 text-xl leading-relaxed mx-auto max-w-3xl" style={{ color: dark ? "oklch(70% 0.05 293)" : "oklch(50% 0.06 293)", fontWeight: 400 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function SectionLabel({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className="text-xs font-mono tracking-[0.2em] uppercase mb-10" style={{ color: dark ? "oklch(60% 0.05 293)" : "var(--kinship-mid)" }}>
      {children}
    </p>
  );
}

function Pill({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      className="inline-block px-3 py-1 rounded-full text-sm font-medium border"
      style={{
        background: accent ? "var(--kinship-ink)" : "transparent",
        color: accent ? "var(--kinship-cream)" : "var(--kinship-mid)",
        borderColor: accent ? "var(--kinship-ink)" : "var(--kinship-dim)",
      }}
    >
      {children}
    </span>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={"rounded-2xl border p-8 " + className}
      style={{ background: "white", borderColor: "var(--kinship-dim)" }}
    >
      {children}
    </div>
  );
}

function DarkCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={"rounded-2xl border p-8 " + className}
      style={{ background: "oklch(25% 0.07 293)", borderColor: "oklch(35% 0.07 293)" }}
    >
      {children}
    </div>
  );
}

function AskBubble({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl p-8 text-center max-w-3xl"
      style={{ background: "oklch(25% 0.07 293)", color: "var(--kinship-cream)" }}
    >
      <div className="flex items-center justify-center gap-2 mb-4">
        <Mic className="w-5 h-5" style={{ color: "var(--kinship-dim)" }} />
        <span className="text-xs font-mono tracking-[0.2em] uppercase" style={{ color: "var(--kinship-dim)" }}>
          Ask the room
        </span>
      </div>
      <p className="text-2xl leading-snug" style={{ fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
        {children}
      </p>
    </div>
  );
}

// ─── Individual Slides ────────────────────────────────────────────────────────

// Slide 0 — Cover
function CoverSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8" style={{ background: "var(--kinship-ink)" }}>
      <div className="flex items-center justify-center w-24 h-24 rounded-3xl border" style={{ borderColor: "oklch(35% 0.08 293)", background: "oklch(25% 0.08 293)" }}>
        <Brain className="w-12 h-12" style={{ color: "var(--kinship-cream)" }} />
      </div>
      <SlideTitle
        dark
        eyebrow="All-Hands · June 2026"
        title="The Kinship Brain"
        subtitle="Shared memory. Connected tools. A team that punches above its weight."
      />
      <p className="text-sm font-mono tracking-widest uppercase mt-4" style={{ color: "oklch(45% 0.06 293)" }}>
        ← → to navigate · space to advance
      </p>
    </div>
  );
}

// Slide 1 — Opening framing
function WhySlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-10 px-16 max-w-6xl mx-auto w-full">
      <SectionLabel>1 · Why we&apos;re here</SectionLabel>
      <SlideTitle
        title="Every company loses context."
        subtitle="It lives in someone's inbox, someone's head, a doc nobody can find. At our size — survivable. As we grow — fatal."
      />
      <div className="grid grid-cols-3 gap-6 w-full max-w-4xl mt-4">
        {[
          { icon: Database, label: "One place", desc: "Schools, conversations, decisions — connected & searchable" },
          { icon: Users, label: "For humans & AI", desc: "Readable by your team and by the agents that work alongside you" },
          { icon: Network, label: "Needs you", desc: "The pipes are built. The knowledge that flows through them — that's yours" },
        ].map(({ icon: Icon, label, desc }) => (
          <Card key={label} className="text-center">
            <div className="flex justify-center mb-4">
              <Icon className="w-7 h-7" style={{ color: "var(--kinship-mid)" }} />
            </div>
            <p className="font-semibold mb-2" style={{ color: "var(--kinship-ink)" }}>{label}</p>
            <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>{desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Slide 2 — Ask the room #1
function AskRoom1() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8" style={{ background: "var(--kinship-ink)" }}>
      <SectionLabel dark>Quick show of hands</SectionLabel>
      <AskBubble>
        &ldquo;Who has lost time this month because information was somewhere you couldn&apos;t get to it?&rdquo;
      </AskBubble>
      <p className="text-sm" style={{ color: "oklch(45% 0.06 293)" }}>This is the pain the brain solves.</p>
    </div>
  );
}

// Slide 3 — Tools in your hands
function ToolsSlide() {
  const tools = [
    { name: "Notion", role: "Company filing system — schools, contacts, deals, meetings, tasks, devices. Smart and connected." },
    { name: "Google Workspace", role: "Docs, sheets, slides. The working surface for human-made artifacts." },
    { name: "Claude Team", role: "Shared AI workspace. Skills and assets one person builds become everyone's tools." },
    { name: "Claude Cowork", role: "Your personal AI operator — connectors, scheduled tasks, daily briefings." },
    { name: "Hermes", role: "Our Slack agent. The operational brain that lives where we already talk." },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-16 max-w-6xl mx-auto w-full">
      <SectionLabel>2 · Tools already in your hands</SectionLabel>
      <SlideTitle title="No new app to learn." subtitle="The brain connects the tools you already use." />
      <div className="grid grid-cols-5 gap-4 w-full max-w-5xl mt-2">
        {tools.map(({ name, role }) => (
          <Card key={name} className="flex flex-col gap-3">
            <p className="font-semibold text-base" style={{ color: "var(--kinship-ink)" }}>{name}</p>
            <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>{role}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Slide 4 — Skills
function SkillsSlide() {
  const skills = [
    "kinship-design",
    "kinship-product",
    "morning-briefing",
    "kinship-brain-sync",
    "kinship-brain-query",
    "competitive-intelligence",
    "call-prep",
    "create-an-asset",
    "call-follow-up",
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-16 max-w-6xl mx-auto w-full">
      <SectionLabel>3a · Skills</SectionLabel>
      <SlideTitle title="Stop rewriting the same prompt." subtitle="A skill is a reusable bundle of context. Load it once, get expert output every time." />
      <div className="flex flex-wrap gap-3 justify-center max-w-3xl">
        {skills.map(s => <Pill key={s} accent={["kinship-design", "kinship-product", "morning-briefing"].includes(s)}>{s}</Pill>)}
      </div>
      <Card className="max-w-3xl w-full mt-2">
        <p className="text-xs font-mono tracking-widest uppercase mb-3" style={{ color: "var(--kinship-dim)" }}>Live demo prompt</p>
        <p className="text-lg leading-relaxed" style={{ color: "var(--kinship-ink)", fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
          &ldquo;Using the <span className="font-mono not-italic text-base" style={{ color: "var(--kinship-mid)" }}>kinship-design</span> and <span className="font-mono not-italic text-base" style={{ color: "var(--kinship-mid)" }}>kinship-product</span> skills, draft a one-page overview of Hearth for a prospective school principal.&rdquo;
        </p>
        <p className="text-sm mt-4" style={{ color: "oklch(55% 0.06 293)" }}>Two-line prompt. On-brand. Accurate. No manual context pasted in.</p>
      </Card>
    </div>
  );
}

// Slide 5 — Ask room #2
function AskRoom2() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8" style={{ background: "var(--kinship-ink)" }}>
      <SectionLabel dark>Skill backlog</SectionLabel>
      <AskBubble>
        &ldquo;What&apos;s a repetitive prompt you keep retyping? That&apos;s probably a skill we should build.&rdquo;
      </AskBubble>
      <p className="text-sm" style={{ color: "oklch(45% 0.06 293)" }}>Capture every answer — this is your skill backlog.</p>
    </div>
  );
}

// Slide 6 — Connectors + Scheduled tasks
function ConnectorsSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-16 max-w-6xl mx-auto w-full">
      <div className="grid grid-cols-2 gap-10 w-full max-w-5xl">
        <div className="flex flex-col gap-6">
          <SectionLabel>3b · Connectors</SectionLabel>
          <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "2rem", color: "var(--kinship-ink)", lineHeight: 1.1 }}>
            Give Claude eyes on your real work.
          </h2>
          <p style={{ color: "oklch(50% 0.06 293)", lineHeight: 1.6 }}>
            We use: <strong>Gmail · Google Calendar · Google Drive · Notion · Slack · Zoom.</strong>
          </p>
          <p style={{ color: "oklch(50% 0.06 293)", lineHeight: 1.6 }}>
            &ldquo;What&apos;s on my plate today?&rdquo; pulls from your real calendar, inbox, and the brain — not a guess.
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <SectionLabel>3c · Scheduled tasks</SectionLabel>
          <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "2rem", color: "var(--kinship-ink)", lineHeight: 1.1 }}>
            Set it once, get value every day.
          </h2>
          <Card className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--kinship-cream)", border: "1px solid var(--kinship-dim)" }}>
                <Calendar className="w-4 h-4" style={{ color: "var(--kinship-mid)" }} />
              </div>
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: "var(--kinship-ink)" }}>Morning debrief</p>
                <p className="text-sm" style={{ color: "oklch(50% 0.06 293)" }}>Runs <code className="text-xs px-1 py-0.5 rounded" style={{ background: "#f0ece4" }}>morning-briefing</code> against calendar, inbox, Slack, and brain. Start here — it&apos;s the fastest &ldquo;wow.&rdquo;</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--kinship-cream)", border: "1px solid var(--kinship-dim)" }}>
                <Clock className="w-4 h-4" style={{ color: "var(--kinship-mid)" }} />
              </div>
              <div>
                <p className="font-semibold text-sm mb-1" style={{ color: "var(--kinship-ink)" }}>Evening data dump</p>
                <p className="text-sm" style={{ color: "oklch(50% 0.06 293)" }}>Runs <code className="text-xs px-1 py-0.5 rounded" style={{ background: "#f0ece4" }}>kinship-brain-sync</code> to sweep the day&apos;s signal into the brain so tomorrow&apos;s briefing is richer.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Slide 7 — Hermes agent
function HermesSlide() {
  const capabilities = ["Book appointments", "Create Zoom calls", "Financial updates", "Rapid prototyping", "Coding tasks", "Research synthesis"];
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-16 max-w-6xl mx-auto w-full">
      <SectionLabel>4 · Hermes</SectionLabel>
      <div className="grid grid-cols-2 gap-12 w-full max-w-5xl items-center">
        <div className="flex flex-col gap-6">
          <h2 style={{ fontFamily: "'Georgia', serif", fontSize: "2.5rem", color: "var(--kinship-ink)", lineHeight: 1.1 }}>
            The shared operator in Slack.
          </h2>
          <p style={{ color: "oklch(50% 0.06 293)", lineHeight: 1.6 }}>
            Claude is <em>your</em> personal operator. Hermes is the <em>shared</em> operator — it lives where we already talk.
          </p>
          <p style={{ color: "oklch(50% 0.06 293)", lineHeight: 1.6 }}>
            It already knows our product and design. It reads from Notion. It acts on what it reads.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <p className="text-xs font-mono tracking-widest uppercase mb-2" style={{ color: "var(--kinship-dim)" }}>Already can do</p>
          <div className="grid grid-cols-2 gap-3">
            {capabilities.map(c => (
              <div key={c} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: "var(--kinship-mid)" }} />
                <span className="text-sm" style={{ color: "var(--kinship-ink)" }}>{c}</span>
              </div>
            ))}
          </div>
          <p className="text-sm mt-4" style={{ color: "oklch(55% 0.06 293)" }}>This is a <em>starting</em> set. We want to grow it based on what you need.</p>
        </div>
      </div>
    </div>
  );
}

// Slide 8 — Ask room #3 (the big one)
function AskRoom3() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-16" style={{ background: "var(--kinship-ink)" }}>
      <SectionLabel dark>The most important question today</SectionLabel>
      <AskBubble>
        &ldquo;If Hermes could do one thing for your role, what would it be?&rdquo;
      </AskBubble>
      <div className="flex flex-wrap gap-3 justify-center max-w-3xl mt-2">
        {["A support agent that drafts replies?", "A sales agent that preps every call?", "An agent that flags when a school goes quiet?"].map(ex => (
          <span key={ex} className="text-sm px-4 py-2 rounded-full" style={{ background: "oklch(28% 0.07 293)", color: "oklch(70% 0.05 293)" }}>
            {ex}
          </span>
        ))}
      </div>
      <p className="text-sm" style={{ color: "oklch(45% 0.06 293)" }}>Dream big — start complex, we can always scale it down. This list is your agent roadmap.</p>
    </div>
  );
}

// Slide 9 — Context engineering
function ContextSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-16 max-w-6xl mx-auto w-full">
      <SectionLabel>5 · Context engineering</SectionLabel>
      <SlideTitle title="Three connected contexts." subtitle="Signals pass between them — selectively, on purpose." />
      <div className="grid grid-cols-3 gap-6 w-full max-w-5xl mt-2">
        {[
          {
            label: "Customer context",
            color: "oklch(60% 0.17 142)",
            desc: "What our customer-facing AI knows about each school and student.",
            status: "future",
          },
          {
            label: "Operations context",
            color: "var(--kinship-mid)",
            desc: "What helps us work better together. This is where the brain lives today — Hermes is its engine.",
            status: "live",
          },
          {
            label: "Product context",
            color: "oklch(62% 0.21 27)",
            desc: "What engineers use to build the right things. Lives in the codebase today; near-term goal: wire ops → product.",
            status: "coming",
          },
        ].map(({ label, color, desc, status }) => (
          <Card key={label} className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1" style={{ background: color }} />
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold" style={{ color: "var(--kinship-ink)" }}>{label}</p>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{
                  background: status === "live" ? "oklch(93% 0.05 142)" : "oklch(94% 0.02 293)",
                  color: status === "live" ? "oklch(42% 0.15 142)" : "oklch(55% 0.06 293)",
                }}>
                  {status === "live" ? "● live" : status === "future" ? "coming" : "near-term"}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>{desc}</p>
            </div>
          </Card>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-2">
        <ArrowRight className="w-5 h-5" style={{ color: "var(--kinship-dim)" }} />
        <p className="text-sm" style={{ color: "oklch(55% 0.06 293)" }}>
          Near-term goal: wire <strong>operations → product</strong> so we build based on real feedback from the field.
        </p>
      </div>
    </div>
  );
}

// Slide 10 — Ask room #4
function AskRoom4() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8" style={{ background: "var(--kinship-ink)" }}>
      <SectionLabel dark>Cross-team signals</SectionLabel>
      <AskBubble>
        &ldquo;What&apos;s a signal your team generates that another team would kill to know about automatically?&rdquo;
      </AskBubble>
    </div>
  );
}

// Slide 11 — How context is captured
function CaptureSilde() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-16 max-w-6xl mx-auto w-full">
      <SectionLabel>6 · How context gets captured</SectionLabel>
      <SlideTitle title="You shouldn't be doing manual data entry." subtitle="The brain is assembled from tools you already use — and we're selective about what we capture." />
      <div className="grid grid-cols-3 gap-6 w-full max-w-5xl mt-2">
        <Card className="col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-5 h-5" style={{ color: "oklch(60% 0.17 142)" }} />
            <p className="font-semibold" style={{ color: "var(--kinship-ink)" }}>Live automations</p>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>
            <strong>Zoom</strong> and <strong>Google Meet</strong> — turn on the transcript. It flows through automation into the brain, updating both Notion databases and Hermes&apos;s wiki automatically.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>
            Focus: <strong>external conversations</strong>. Any external partner meeting transcribed via Zoom or Meet → straight into the brain. Nobody typed this.
          </p>
        </Card>
        <Card className="flex flex-col gap-4" style={{ background: "oklch(98% 0.01 80)" }}>
          <div className="flex items-center gap-3 mb-2">
            <Layers className="w-5 h-5" style={{ color: "var(--kinship-mid)" }} />
            <p className="font-semibold" style={{ color: "var(--kinship-ink)" }}>What we don&apos;t capture</p>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>
            Everything. Capturing all transcripts floods the brain with noise. We&apos;re picky.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>
            Internal chatter mostly doesn&apos;t need to be in the brain.
          </p>
        </Card>
      </div>
    </div>
  );
}

// Slide 12 — Two representations
function TwoRepresentationsSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-16 max-w-6xl mx-auto w-full">
      <SectionLabel>7 · How the brain is presented</SectionLabel>
      <SlideTitle title="Same knowledge. Two lenses." />
      <div className="grid grid-cols-2 gap-8 w-full max-w-4xl mt-2">
        <Card className="flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-1">
            <Database className="w-6 h-6" style={{ color: "var(--kinship-mid)" }} />
            <p className="font-semibold text-lg" style={{ color: "var(--kinship-ink)" }}>Notion databases</p>
          </div>
          <p className="text-xs font-mono tracking-widest uppercase" style={{ color: "var(--kinship-dim)" }}>For humans</p>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>
            A friendlier, navigable spreadsheet. Human-driven, agent-assisted. This is where you go to <em>see</em> and <em>work with</em> information.
          </p>
        </Card>
        <Card className="flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-1">
            <GitBranch className="w-6 h-6" style={{ color: "var(--kinship-mid)" }} />
            <p className="font-semibold text-lg" style={{ color: "var(--kinship-ink)" }}>The wiki / knowledge graph</p>
          </div>
          <p className="text-xs font-mono tracking-widest uppercase" style={{ color: "var(--kinship-dim)" }}>For AI</p>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>
            Freeform. Hermes manages it automatically — &ldquo;this is a person,&rdquo; &ldquo;this is a company.&rdquo; Less human opinion required on how to organize.
          </p>
        </Card>
      </div>
      <div className="flex items-center gap-3 mt-4 rounded-2xl px-8 py-5" style={{ background: "oklch(25% 0.07 293)" }}>
        <BookOpen className="w-5 h-5 flex-shrink-0" style={{ color: "var(--kinship-dim)" }} />
        <p className="text-base" style={{ color: "var(--kinship-cream)", fontFamily: "'Georgia', serif", fontStyle: "italic" }}>
          &ldquo;Databases are how <em>we</em> read the brain. The knowledge graph is how <em>AI</em> reads it.&rdquo;
        </p>
      </div>
    </div>
  );
}

// Slide 13 — How you help
function HowYouHelpSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-16 max-w-6xl mx-auto w-full">
      <SectionLabel>8 · This is a team sport</SectionLabel>
      <SlideTitle title="Your job isn't data entry." subtitle="It's spotting where automation would help and raising it." />
      <div className="grid grid-cols-2 gap-8 w-full max-w-5xl mt-2">
        <Card className="flex flex-col gap-4">
          <Zap className="w-6 h-6 mb-1" style={{ color: "var(--kinship-mid)" }} />
          <p className="font-semibold" style={{ color: "var(--kinship-ink)" }}>Where to bring ideas</p>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>
            Channel: <code className="px-2 py-0.5 rounded text-xs" style={{ background: "#f0ece4" }}>#topic-brain-context</code>
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>
            Anything about the brain — automations, &ldquo;how do I capture this,&rdquo; ideas — goes there.
          </p>
        </Card>
        <Card className="flex flex-col gap-4">
          <MessageSquare className="w-6 h-6 mb-1" style={{ color: "var(--kinship-mid)" }} />
          <p className="font-semibold" style={{ color: "var(--kinship-ink)" }}>Worked example: in-person meeting</p>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>
            No Zoom. No Meet. Open Notion mobile → start a private page → record/transcribe the meeting → hand the transcript to Hermes.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>
            Hermes organizes it: updates the wiki and the Notion databases. No manual entry.
          </p>
        </Card>
      </div>
    </div>
  );
}

// Slide 14 — Ask room #5
function AskRoom5() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8" style={{ background: "var(--kinship-ink)" }}>
      <SectionLabel dark>Automation ideas</SectionLabel>
      <AskBubble>
        &ldquo;Name one moment this week where you wished something just recorded itself into the brain.&rdquo;
      </AskBubble>
    </div>
  );
}

// Slide 15 — Slack conventions
function SlackSlide() {
  const conventions = [
    { prefix: "proj-…", reads: true, desc: "A specific project or school (e.g. proj-brown). The brain reads these." },
    { prefix: "team-…", reads: true, desc: "How a team works (team-sales, team-eng). The brain reads these." },
    { prefix: "space-…", reads: false, desc: "Social, community. Free zone — the brain doesn't read." },
    { prefix: "open-…", reads: false, desc: "Open discussions. Free zone." },
    { prefix: "topic-…", reads: false, desc: "Side topics. Free zone. (Including #topic-brain-context!)" },
    { prefix: "alerts-…", reads: false, desc: "Notifications and alerts. Free zone." },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-16 max-w-6xl mx-auto w-full">
      <SectionLabel>9 · Slack conventions</SectionLabel>
      <SlideTitle title="Talk in public." subtitle="The brain learns from public channels — and so does our culture." />
      <div className="w-full max-w-4xl flex flex-col gap-3 mt-2">
        {conventions.map(({ prefix, reads, desc }) => (
          <div key={prefix} className="flex items-start gap-4 rounded-xl border px-5 py-4" style={{ borderColor: "var(--kinship-dim)", background: "white" }}>
            <code className="text-sm font-mono px-3 py-1 rounded-lg flex-shrink-0 w-28 text-center" style={{
              background: reads ? "oklch(93% 0.05 293)" : "oklch(95% 0.01 80)",
              color: reads ? "var(--kinship-mid)" : "oklch(55% 0.06 293)",
            }}>
              {prefix}
            </code>
            <div className="flex-1 min-w-0">
              <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>{desc}</p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full flex-shrink-0" style={{
              background: reads ? "oklch(93% 0.05 142)" : "oklch(94% 0.02 293)",
              color: reads ? "oklch(42% 0.15 142)" : "oklch(65% 0.04 293)",
            }}>
              {reads ? "● brain reads" : "free zone"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Slide 16 — Close + CTAs
function CloseSlide() {
  const actions = [
    { num: "01", action: "Turn on your daily debrief", detail: "In Claude Cowork. We'll help anyone after the meeting." },
    { num: "02", action: "Move work talk into public channels", detail: "proj- and team- channels. That's where the brain listens." },
    { num: "03", action: "Bring one automation idea", detail: "To #topic-brain-context. That's the roadmap." },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full gap-10 px-16 max-w-6xl mx-auto w-full" style={{ background: "var(--kinship-ink)" }}>
      <SectionLabel dark>10 · Three things to do this week</SectionLabel>
      <div className="flex flex-col gap-5 w-full max-w-3xl">
        {actions.map(({ num, action, detail }) => (
          <DarkCard key={num} className="flex items-start gap-5">
            <span className="text-4xl font-mono flex-shrink-0" style={{ color: "oklch(35% 0.07 293)" }}>{num}</span>
            <div>
              <p className="text-lg font-semibold mb-1" style={{ color: "var(--kinship-cream)" }}>{action}</p>
              <p className="text-sm" style={{ color: "oklch(60% 0.05 293)" }}>{detail}</p>
            </div>
          </DarkCard>
        ))}
      </div>
    </div>
  );
}

// Slide 17 — Final framing
function FinalSlide() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8" style={{ background: "var(--kinship-ink)" }}>
      <div className="flex items-center justify-center w-20 h-20 rounded-2xl border" style={{ borderColor: "oklch(35% 0.08 293)", background: "oklch(25% 0.08 293)" }}>
        <Sparkles className="w-10 h-10" style={{ color: "var(--kinship-cream)" }} />
      </div>
      <SlideTitle
        dark
        title="I built the pipes."
        subtitle="You're the ones who know what should flow through them. Let's build it together."
      />
      <div className="mt-4 flex items-center gap-3 text-sm font-mono tracking-widest uppercase" style={{ color: "oklch(40% 0.06 293)" }}>
        <Star className="w-4 h-4" />
        <span>#topic-brain-context</span>
        <Star className="w-4 h-4" />
      </div>
    </div>
  );
}

// Slide 18 — FAQ
function FAQSlide() {
  const faqs = [
    { q: "Is the brain reading my DMs or private channels?", a: "No. Private channels and DMs are never read. Only public proj- and team- channels feed the brain." },
    { q: "Do I have to learn a new app?", a: "No. The brain connects tools you already use. The main new habit is talking in public channels." },
    { q: "What if the AI gets something wrong?", a: "Humans review and approve. Agents propose, they don't silently overwrite. The source transcript/email always wins on raw facts." },
    { q: "Will every meeting get recorded?", a: "No — we're selective. Right now it's external conversations transcribed via Zoom/Meet. We deliberately avoid capturing everything." },
    { q: "I'm not technical — is this for me?", a: "Especially for you. The point is to remove admin work, not add it. Start with the daily debrief." },
  ];
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-16 max-w-6xl mx-auto w-full">
      <SectionLabel>Appendix · Likely questions</SectionLabel>
      <div className="w-full max-w-4xl flex flex-col gap-4">
        {faqs.map(({ q, a }) => (
          <div key={q} className="rounded-xl border px-6 py-5" style={{ borderColor: "var(--kinship-dim)", background: "white" }}>
            <p className="font-semibold text-sm mb-2" style={{ color: "var(--kinship-ink)" }}>{q}</p>
            <p className="text-sm leading-relaxed" style={{ color: "oklch(50% 0.06 293)" }}>{a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Slide registry ───────────────────────────────────────────────────────────

const SLIDES = [
  { id: "cover", component: <CoverSlide />, label: "Cover", dark: true },
  { id: "why", component: <WhySlide />, label: "Why we're here", dark: false },
  { id: "ask-1", component: <AskRoom1 />, label: "Ask the room", dark: true },
  { id: "tools", component: <ToolsSlide />, label: "Your tools", dark: false },
  { id: "skills", component: <SkillsSlide />, label: "Skills", dark: false },
  { id: "ask-2", component: <AskRoom2 />, label: "Ask the room", dark: true },
  { id: "connectors", component: <ConnectorsSlide />, label: "Connectors + tasks", dark: false },
  { id: "hermes", component: <HermesSlide />, label: "Hermes", dark: false },
  { id: "ask-3", component: <AskRoom3 />, label: "Ask the room", dark: true },
  { id: "context", component: <ContextSlide />, label: "Context engineering", dark: false },
  { id: "ask-4", component: <AskRoom4 />, label: "Ask the room", dark: true },
  { id: "capture", component: <CaptureSilde />, label: "How context is captured", dark: false },
  { id: "representations", component: <TwoRepresentationsSlide />, label: "Two lenses", dark: false },
  { id: "help", component: <HowYouHelpSlide />, label: "How you help", dark: false },
  { id: "ask-5", component: <AskRoom5 />, label: "Ask the room", dark: true },
  { id: "slack", component: <SlackSlide />, label: "Slack conventions", dark: false },
  { id: "close", component: <CloseSlide />, label: "Three actions", dark: true },
  { id: "final", component: <FinalSlide />, label: "Close", dark: true },
  { id: "faq", component: <FAQSlide />, label: "FAQ", dark: false },
];

// ─── Main Slideshow ───────────────────────────────────────────────────────────

export default function AllHandsPresentation() {
  const [[page, dir], setPage] = useState([0, 0]);
  const [showNav, setShowNav] = useState(false);
  const navTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Save progress
  useEffect(() => {
    const saved = localStorage.getItem("kinship-allhands-slide");
    if (saved) setPage([parseInt(saved, 10), 0]);
  }, []);

  const go = useCallback(
    (newPage: number) => {
      if (newPage < 0 || newPage >= SLIDES.length) return;
      const d = newPage > page ? 1 : -1;
      setPage([newPage, d]);
      localStorage.setItem("kinship-allhands-slide", String(newPage));
    },
    [page]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") go(page + 1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(page - 1);
      if (e.key === "Home") go(0);
      if (e.key === "End") go(SLIDES.length - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [go, page]);

  const handleMouseMove = useCallback(() => {
    setShowNav(true);
    if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    navTimeoutRef.current = setTimeout(() => setShowNav(false), 2000);
  }, []);

  const current = SLIDES[page];

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.45, ease: EASE_OUT } },
    exit: (d: number) => ({ x: d > 0 ? "-60%" : "60%", opacity: 0, transition: { duration: 0.35, ease: EASE_IN } }),
  };

  return (
    <div
      className="w-full h-screen overflow-hidden relative"
      onMouseMove={handleMouseMove}
      style={{ background: current.dark ? "var(--kinship-ink)" : "var(--kinship-cream)" }}
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
          style={{ background: current.dark ? "var(--kinship-ink)" : "var(--kinship-cream)" }}
        >
          {current.component}
        </motion.div>
      </AnimatePresence>

      {/* Slide counter */}
      <div
        className="absolute top-6 right-8 text-xs font-mono tracking-widest"
        style={{ color: current.dark ? "oklch(40% 0.06 293)" : "oklch(65% 0.05 293)" }}
      >
        {page + 1} / {SLIDES.length}
      </div>

      {/* Slide title */}
      <div
        className="absolute top-6 left-8 text-xs font-mono tracking-widest"
        style={{ color: current.dark ? "oklch(40% 0.06 293)" : "oklch(65% 0.05 293)" }}
      >
        {current.label}
      </div>

      {/* Nav arrows */}
      <motion.div
        animate={{ opacity: showNav ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6"
      >
        <button
          onClick={() => go(page - 1)}
          disabled={page === 0}
          className="p-2.5 rounded-xl border transition-all"
          style={{
            borderColor: current.dark ? "oklch(35% 0.07 293)" : "var(--kinship-dim)",
            background: current.dark ? "oklch(25% 0.07 293)" : "white",
            color: current.dark ? "var(--kinship-cream)" : "var(--kinship-ink)",
            opacity: page === 0 ? 0.2 : 0.8,
          }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Dot indicator */}
        <div className="flex items-center gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="transition-all rounded-full"
              style={{
                width: i === page ? 20 : 6,
                height: 6,
                background: i === page
                  ? (current.dark ? "var(--kinship-cream)" : "var(--kinship-mid)")
                  : (current.dark ? "oklch(35% 0.07 293)" : "var(--kinship-dim)"),
              }}
            />
          ))}
        </div>

        <button
          onClick={() => go(page + 1)}
          disabled={page === SLIDES.length - 1}
          className="p-2.5 rounded-xl border transition-all"
          style={{
            borderColor: current.dark ? "oklch(35% 0.07 293)" : "var(--kinship-dim)",
            background: current.dark ? "oklch(25% 0.07 293)" : "white",
            color: current.dark ? "var(--kinship-cream)" : "var(--kinship-ink)",
            opacity: page === SLIDES.length - 1 ? 0.2 : 0.8,
          }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
}
