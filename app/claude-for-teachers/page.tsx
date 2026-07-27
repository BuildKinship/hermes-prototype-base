"use client";
// Client component: interactive slideshow with state, keyboard navigation, localStorage
import React, { type ReactNode } from "react";
import {
  Slideshow, SlideTitle, SectionLabel,
  SlideCard, SlideCardGrid, SlideDarkCard,
  ResponsiveSVG,
} from "@/components/slides/slideshow";
import type { Slide } from "@/components/slides/slideshow";

// ─────────────────────────────────────────────────────────────────────────────
// CONTRAST RULES (enforced — do not revert):
//
//  Light slides (dark=false), bg is --kinship-cream (~#F5F0E8):
//    • Primary text:   text-[var(--kinship-ink)]              oklch 19% — AAA
//    • Body / subtext: text-[var(--kinship-mid)]              oklch 44% — ≥4.8:1 ✓ AA
//    • ❌ NEVER:       text-[var(--kinship-dim)]              oklch 70% — ~2.5:1, fails AA
//
//  Dark slides (dark=true), bg is --kinship-ink (~#3D1A4E):
//    • Primary text:   text-[var(--kinship-cream)]            oklch 93%
//    • Body / subtext: style={{color:"rgba(245,240,232,0.92)"}} — 12.9:1 verified ✓
//    • ❌ NEVER:       Tailwind opacity-XX on body text — unreliable in Tailwind v4
//
//  Tinted cards (emerald-50, amber-50, white):
//    • Body text / attribution: text-[var(--kinship-mid)]  ✓
// ─────────────────────────────────────────────────────────────────────────────

// ── Quote card — wraps in <a> so the whole card links to the source ─────────
function QuoteCard({
  quote, author, role, sentiment, url,
}: {
  quote: string; author: string; role: string;
  sentiment: "positive" | "critical"; url: string;
}) {
  const colors = sentiment === "positive"
    ? "border-emerald-200 bg-emerald-50 hover:border-emerald-400"
    : "border-amber-200 bg-amber-50 hover:border-amber-400";
  const icon = sentiment === "positive" ? "✅" : "⚠️";
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`rounded-xl border p-3 block transition-all hover:shadow-sm ${colors}`}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-xs">{icon}</span>
        <span className="text-xs font-semibold text-[var(--kinship-ink)]">{author}</span>
        {/* Link indicator */}
        <span className="ml-auto text-[var(--kinship-mid)] text-xs opacity-60">↗</span>
      </div>
      <p className="text-xs text-[var(--kinship-ink)] leading-relaxed italic mb-1.5">&ldquo;{quote}&rdquo;</p>
      <div className="text-xs text-[var(--kinship-mid)] font-medium">{role}</div>
    </a>
  );
}

// ── Resource link card ─────────────────────────────────────────────────────
function ResourceCard({ title, desc, url, tag }: {
  title: string; desc: string; url: string; tag: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-3 rounded-xl border border-[var(--kinship-mid)] bg-white hover:border-[var(--kinship-ink)] hover:shadow-sm transition-all"
    >
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

// ── Linked stat card — dark slide card where the title links to a source ───
function LinkedStat({ icon, stat, desc, url }: {
  icon: string; stat: string; desc: string; url: string;
}) {
  return (
    <SlideDarkCard>
      <div className="text-2xl mb-2">{icon}</div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-sm text-[var(--kinship-cream)] hover:underline underline-offset-2 flex items-center gap-1"
      >
        {stat} <span className="opacity-60 text-xs">↗</span>
      </a>
      <div className="text-xs mt-1" style={{ color: "rgba(245,240,232,0.92)" }}>{desc}</div>
    </SlideDarkCard>
  );
}

// ── Step item ─────────────────────────────────────────────────────────────
function Step({ n, title, desc, url }: {
  n: number; title: string; desc: string; url?: string;
}) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-7 h-7 rounded-full bg-[var(--kinship-ink)] text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
        {n}
      </div>
      <div>
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--kinship-ink)] text-sm hover:underline underline-offset-2 flex items-center gap-1"
          >
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

// ── Cover animation ────────────────────────────────────────────────────────
function CoverAnim() {
  return (
    <svg viewBox="0 0 480 140" width="100%" style={{ maxWidth: 480, display: "block" }}>
      <style>{`
        @keyframes cfloat1 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)} }
        @keyframes cfloat2 { 0%,100%{transform:translateY(-4px)} 50%{transform:translateY(4px)} }
        @keyframes corb1 { 0%,100%{opacity:.4} 50%{opacity:.9} }
        @keyframes corb2 { 0%,100%{opacity:.6} 50%{opacity:.3} }
        .cbob1{animation:cfloat1 3.2s ease-in-out infinite}
        .cbob2{animation:cfloat2 4s ease-in-out infinite}
        .cpulse1{animation:corb1 2.8s ease-in-out infinite}
        .cpulse2{animation:corb2 3.5s ease-in-out infinite}
      `}</style>
      <g className="cbob1">
        <circle cx="80" cy="70" r="28" fill="rgba(255,255,255,0.12)" />
        <circle cx="80" cy="70" r="24" fill="rgba(255,255,255,0.22)" />
        <text x="80" y="78" textAnchor="middle" fontSize="20" fill="white" opacity="0.95">T</text>
        <text x="80" y="108" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.75)">Teacher</text>
      </g>
      <g className="cbob2">
        <circle cx="240" cy="70" r="36" fill="#D97706" opacity="0.15" className="cpulse1" />
        <circle cx="240" cy="70" r="28" fill="#D97706" opacity="0.9" />
        <text x="240" y="79" textAnchor="middle" fontSize="22" fontWeight="bold" fill="white">A</text>
        <text x="240" y="116" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.75)">Claude</text>
      </g>
      <g className="cbob1">
        <circle cx="400" cy="70" r="28" fill="rgba(255,255,255,0.12)" />
        <circle cx="400" cy="70" r="24" fill="rgba(255,255,255,0.22)" />
        <text x="400" y="78" textAnchor="middle" fontSize="20" fill="white" opacity="0.95">K</text>
        <text x="400" y="108" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.75)">K-12</text>
      </g>
      <line x1="108" y1="70" x2="212" y2="70" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeDasharray="4 4" />
      <line x1="268" y1="70" x2="372" y2="70" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeDasharray="4 4" />
      <circle cx="160" cy="70" r="4" fill="#D97706" className="cpulse2" />
      <circle cx="320" cy="70" r="4" fill="#D97706" className="cpulse1" />
    </svg>
  );
}

// ── Slides ─────────────────────────────────────────────────────────────────
const slides: Slide[] = [
  {
    id: "cover",
    dark: true,
    label: "Cover",
    content: (
      <div className="flex flex-col items-center gap-6 w-full py-4">
        <a
          href="https://www.anthropic.com/news/claude-for-teachers"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold tracking-widest text-[var(--kinship-cream)] opacity-80 uppercase hover:opacity-100 transition-opacity"
        >
          Anthropic · Announced July 14, 2026 ↗
        </a>
        <SlideTitle
          title="Claude for Teachers"
          subtitle="Free AI for every US K-12 educator — what it is, how it works, and what people are saying"
          dark
        />
        <ResponsiveSVG maxWidth={480}>
          <CoverAnim />
        </ResponsiveSVG>
        <div className="flex gap-3 text-xs text-[var(--kinship-cream)] opacity-75">
          <span>8 slides</span>
          <span>·</span>
          <span>← → to navigate</span>
        </div>
      </div>
    ),
  },
  {
    id: "what",
    dark: false,
    label: "1 · What Is It?",
    content: (
      <div className="flex flex-col items-center gap-5 w-full">
        <SectionLabel>1 · What Is It?</SectionLabel>
        <SlideTitle title="Free Claude Pro for every US K-12 teacher." size="sm" />
        <div className="max-w-2xl text-center text-[var(--kinship-mid)] text-sm leading-relaxed px-4">
          Anthropic launched{" "}
          <a
            href="https://www.anthropic.com/news/claude-for-teachers"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[var(--kinship-ink)] underline underline-offset-2 hover:text-[var(--kinship-mid)] transition-colors"
          >
            Claude for Teachers
          </a>{" "}
          on July 14, 2026 — a completely free offering giving verified US K-12 educators access to
          full{" "}
          <a
            href="https://claude.com/solutions/teachers"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[var(--kinship-ink)] underline underline-offset-2 hover:text-[var(--kinship-mid)] transition-colors"
          >
            Claude Pro capabilities
          </a>
          , plus a library of teaching-specific AI skills built around learning science and real curricula.
        </div>
        <SlideCardGrid>
          <SlideCard>
            <div className="text-2xl mb-2">🎓</div>
            <div className="font-semibold text-sm text-[var(--kinship-ink)]">Who qualifies</div>
            <div className="text-xs text-[var(--kinship-mid)] mt-1">Verified US K-12 educators — teachers, coaches, librarians, counselors, specialists</div>
          </SlideCard>
          <SlideCard>
            <div className="text-2xl mb-2">💸</div>
            <div className="font-semibold text-sm text-[var(--kinship-ink)]">Cost</div>
            <div className="text-xs text-[var(--kinship-mid)] mt-1">Completely free. Sign up before June 30, 2027 and get a full year of Claude Pro</div>
          </SlideCard>
          <SlideCard>
            <div className="text-2xl mb-2">🌍</div>
            <div className="font-semibold text-sm text-[var(--kinship-ink)]">Where</div>
            <div className="text-xs text-[var(--kinship-mid)] mt-1">US only for now. District-level access is coming soon (currently individual educators only)</div>
          </SlideCard>
        </SlideCardGrid>
      </div>
    ),
  },
  {
    id: "features",
    dark: false,
    label: "2 · Key Features",
    content: (
      <div className="flex flex-col items-center gap-5 w-full">
        <SectionLabel>2 · Key Features</SectionLabel>
        <SlideTitle title="Everything a teacher needs, built in." size="sm" />
        <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-3 px-4">
          <SlideCard>
            <div className="font-semibold text-sm text-[var(--kinship-ink)] mb-1">📚 Real Curriculum Integration</div>
            <div className="text-xs text-[var(--kinship-mid)] leading-relaxed">Connects to academic standards in all 50 states via the Learning Commons connector. Supports Illustrative Mathematics and OpenSciEd curricula.</div>
          </SlideCard>
          <SlideCard>
            <div className="font-semibold text-sm text-[var(--kinship-ink)] mb-1">🔧 Teaching-Specific Skills</div>
            <div className="text-xs text-[var(--kinship-mid)] leading-relaxed">
              <a href="https://github.com/anthropics/k12-teacher-skills" target="_blank" rel="noopener noreferrer" className="underline underline-offset-1 hover:text-[var(--kinship-ink)]">Open-source skills on GitHub</a>
              {" "}co-developed with educators, evaluated for rigor and pedagogical alignment.
            </div>
          </SlideCard>
          <SlideCard>
            <div className="font-semibold text-sm text-[var(--kinship-ink)] mb-1">🔗 9 Edtech Integrations</div>
            <div className="text-xs text-[var(--kinship-mid)] leading-relaxed">ASSISTments, Brisk Teaching, Canva Education, Coteach, Diffit, Eedi, MagicSchool, Snorkl, TeachFX — all connected.</div>
          </SlideCard>
          <SlideCard>
            <div className="font-semibold text-sm text-[var(--kinship-ink)] mb-1">🔒 Privacy First</div>
            <div className="text-xs text-[var(--kinship-mid)] leading-relaxed">
              No model training on teacher inputs or student data.{" "}
              <a href="https://support.claude.com/en/articles/15926041" target="_blank" rel="noopener noreferrer" className="underline underline-offset-1 hover:text-[var(--kinship-ink)]">US K-12 Terms of Service + FERPA-aligned DPA ↗</a>
            </div>
          </SlideCard>
          <SlideCard>
            <div className="font-semibold text-sm text-[var(--kinship-ink)] mb-1">⚡ Full Claude Pro</div>
            <div className="text-xs text-[var(--kinship-mid)] leading-relaxed">Includes Claude Code and Claude Cowork (agentic features). Same tier as the paid $20/mo subscription.</div>
          </SlideCard>
          <SlideCard>
            <div className="font-semibold text-sm text-[var(--kinship-ink)] mb-1">🤝 Key Partners</div>
            <div className="text-xs text-[var(--kinship-mid)] leading-relaxed">
              AFT,{" "}
              <a href="https://www.playlab.ai/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-1 hover:text-[var(--kinship-ink)]">Playlab.ai ↗</a>
              , Teach For America, Gates Foundation, Detroit Public Schools, Prospect Schools.
            </div>
          </SlideCard>
        </div>
      </div>
    ),
  },
  {
    id: "how-to",
    dark: false,
    label: "3 · How To Use It",
    content: (
      <div className="flex flex-col items-center gap-5 w-full">
        <SectionLabel>3 · How To Use It</SectionLabel>
        <SlideTitle title="Get started in 5 steps." size="sm" />
        <div className="w-full max-w-2xl flex flex-col gap-3 px-4">
          <Step
            n={1}
            title="Go to claude.com/solutions/teachers"
            url="https://claude.com/solutions/teachers"
            desc={"Click \"Get verified\" — sign up with your school email to confirm K-12 educator status"}
          />
          <Step
            n={2}
            title="Connect the Learning Commons connector"
            desc="Links Claude to your state's academic standards, prerequisite skills, and learning progressions"
          />
          <Step
            n={3}
            title="Optionally add edtech integrations"
            desc="Connect ASSISTments for math problems, Brisk Teaching for student activities, Canva Education for lesson materials, and more"
          />
          <Step
            n={4}
            title="Use built-in teaching skill workflows"
            desc="Plan differentiated lessons from real curricula, analyze class data, create formative assessments — all standards-aligned"
          />
          <Step
            n={5}
            title="Take the AI Fluency course (optional)"
            url="https://anthropic.skilljar.com/path/ai-fluency-for-pk-12-educators"
            desc="Free PD course co-created with Teach For America — hands-on AI skill-building for PK-12 educators"
          />
        </div>
        <div className="w-full max-w-2xl px-4">
          <div className="rounded-xl border border-[var(--kinship-mid)] bg-[var(--kinship-cream)] p-3">
            <div className="text-xs font-semibold text-[var(--kinship-mid)] mb-2">Example prompt to try:</div>
            <div className="text-sm text-[var(--kinship-ink)] italic leading-relaxed">
              &ldquo;Plan a 45-min 7th grade math lesson on two-step equations. I teach Illustrative Math and students have mastered one-step equations. Create a do-now, worked example, and exit ticket.&rdquo;
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "value-prop",
    dark: true,
    label: "4 · Why It Matters",
    content: (
      <div className="flex flex-col items-center gap-6 w-full">
        <SectionLabel dark>4 · Why It Matters</SectionLabel>
        <SlideTitle title="Closing the gap between what research says works and what teachers have time to do." size="sm" dark />
        <SlideCardGrid>
          <LinkedStat
            icon="📉"
            stat="400,000+ vacancies"
            desc="Vacant or underqualified teaching positions in the US. Teacher burnout is a national crisis."
            url="https://www.anthropic.com/news/claude-for-teachers"
          />
          <LinkedStat
            icon="🔬"
            stat="Stanford SCALE research"
            desc="AI tools for teachers (not students) show more consistently positive outcomes. Teacher-side AI → stronger instructional practice."
            url="https://scale.stanford.edu/research-in-action/understanding-evidence-base-ai-k12-education"
          />
          <LinkedStat
            icon="🏫"
            stat="Under-resourced schools first"
            desc="Detroit Public Schools is the pilot site. Anthropic explicitly names equity as the primary goal — not premium schools."
            url="https://www.anthropic.com/news/claude-for-teachers"
          />
        </SlideCardGrid>
        <div className="max-w-xl text-center text-sm leading-relaxed px-4" style={{ color: "rgba(245,240,232,0.92)" }}>
          What research shows works — differentiation, mastery-based learning, small-group instruction — requires massive prep time teachers don&apos;t have. Claude handles the prep.
        </div>
      </div>
    ),
  },
  {
    id: "reactions",
    dark: false,
    label: "5 · What People Say",
    content: (
      <div className="flex flex-col items-center gap-3 w-full">
        <SectionLabel>5 · What People Are Saying</SectionLabel>
        <SlideTitle title="Educators are excited. District admins are worried." size="sm" />
        <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-2 px-4">
          <QuoteCard
            quote="You have a stealth education product on your hands and you may not know it. Teacher here, using Claude daily for Danielson/UDL lesson plans, HTML decks, and annotated editions. K-12 is yours to take!!"
            author="Ryan (@reyesfan14)"
            role="Teacher on X · July 26, 2026"
            sentiment="positive"
            url="https://x.com/reyesfan14/status/2081457751440396544"
          />
          <QuoteCard
            quote="We've been working with Anthropic on a Gold Standard that sets out industry best practices for safety and privacy in K-12 education. It's important that Anthropic is committing to these principles in their new Claude for Teachers — a tool designed by and for educators."
            author="Randi Weingarten"
            role="President, American Federation of Teachers · via Anthropic blog"
            sentiment="positive"
            url="https://www.anthropic.com/news/claude-for-teachers"
          />
          <QuoteCard
            quote="If your product encourages workflows involving protected student information, districts need governance before teachers need access. Not the other way around."
            author="Dr. Joe Phillips"
            role="District Administrator — blocked it for his district · Read full article ↗"
            sentiment="critical"
            url="https://drjoephillips.substack.com/p/anthropic-launched-claude-for-teachers"
          />
          <QuoteCard
            quote="Why has Anthropic dropped Claude for Teachers on us now? It's a consumer-facing play that makes no obvious sense to me… when the backlash to AI and edtech in schools continues to grow."
            author="Benjamin Riley"
            role="Education researcher · buildcognitiveresonance.substack.com ↗"
            sentiment="critical"
            url="https://buildcognitiveresonance.substack.com/p/why-is-claude-for-teachers"
          />
        </div>
      </div>
    ),
  },
  {
    id: "kinship",
    dark: true,
    label: "6 · Kinship Lens",
    content: (
      <div className="flex flex-col items-center gap-6 w-full">
        <SectionLabel dark>6 · Kinship Lens</SectionLabel>
        <SlideTitle title="What this means for us." size="sm" dark />
        <SlideCardGrid>
          <SlideDarkCard>
            <div className="text-2xl mb-2">🔌</div>
            <div className="font-semibold text-sm text-[var(--kinship-cream)]">Plugin opportunity</div>
            <div className="text-xs mt-1" style={{ color: "rgba(245,240,232,0.92)" }}>
              Anyone can build Claude integrations. A Kinship plugin could surface student progress, suggest interventions, and automate teacher prep — right inside Claude.{" "}
              <a href="https://www.anthropic.com/news/claude-for-teachers" target="_blank" rel="noopener noreferrer" className="underline underline-offset-1 opacity-70 hover:opacity-100">Source ↗</a>
            </div>
          </SlideDarkCard>
          <SlideDarkCard>
            <div className="text-2xl mb-2">🏗️</div>
            <div className="font-semibold text-sm text-[var(--kinship-cream)]">Playlab model</div>
            <div className="text-xs mt-1" style={{ color: "rgba(245,240,232,0.92)" }}>
              <a href="https://www.playlab.ai/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-1 opacity-80 hover:opacity-100">Playlab.ai ↗</a>
              {" "}(named partner) helps teachers become AI builders. Kinship&apos;s teacher training product could take a similar angle.
            </div>
          </SlideDarkCard>
          <SlideDarkCard>
            <div className="text-2xl mb-2">📡</div>
            <div className="font-semibold text-sm text-[var(--kinship-cream)]">Data layer</div>
            <div className="text-xs mt-1" style={{ color: "rgba(245,240,232,0.92)" }}>
              Snorkl and TeachFX provide progress + classroom talk insights to Claude. Kinship&apos;s data could power similar teacher-facing AI workflows.
            </div>
          </SlideDarkCard>
        </SlideCardGrid>
        <div className="text-center text-xs max-w-lg px-4" style={{ color: "rgba(245,240,232,0.88)" }}>
          Note from Azim in the thread: &ldquo;If we ever go down the path of creating a Kinship Claude plugin, I think that would be an easy lift. Not sure if it aligns with our product — it might align with our teacher training product.&rdquo;
        </div>
      </div>
    ),
  },
  {
    id: "resources",
    dark: false,
    label: "7 · Go Deeper",
    content: (
      <div className="flex flex-col items-center gap-4 w-full">
        <SectionLabel>7 · Go Deeper</SectionLabel>
        <SlideTitle title="Everything you need to explore further." size="sm" />
        <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-2 px-4">
          <ResourceCard
            title="Get Verified as an Educator"
            desc="Official signup — free Claude Pro access for verified US K-12 educators"
            url="https://claude.com/solutions/teachers"
            tag="Official"
          />
          <ResourceCard
            title="Anthropic Announcement"
            desc="Full blog post: what it is, all partners, research backing, privacy details"
            url="https://www.anthropic.com/news/claude-for-teachers"
            tag="Blog"
          />
          <ResourceCard
            title="AI Fluency Course (Free)"
            desc="Teach For America + Anthropic PD course for PK-12 educators — hands-on AI skill building"
            url="https://anthropic.skilljar.com/path/ai-fluency-for-pk-12-educators"
            tag="Course"
          />
          <ResourceCard
            title="Open-Source Teaching Skills"
            desc="GitHub repo — fork and adapt Claude's K-12 teaching skills for your classroom"
            url="https://github.com/anthropics/k12-teacher-skills"
            tag="GitHub"
          />
          <ResourceCard
            title="K-12 Privacy & FERPA Terms"
            desc="FERPA-aligned Data Processing Addendum and K-12 Terms of Service details"
            url="https://support.claude.com/en/articles/15926041"
            tag="Privacy"
          />
          <ResourceCard
            title="Critical: We Blocked It"
            desc="Dr. Joe Phillips explains why his district blocked Claude for Teachers — essential FERPA read"
            url="https://drjoephillips.substack.com/p/anthropic-launched-claude-for-teachers"
            tag="Critical"
          />
          <ResourceCard
            title="Critical: Why Is Claude for Teachers?"
            desc="Benjamin Riley: \"Anthropic bumbles its way into education\" — a skeptic's take"
            url="https://buildcognitiveresonance.substack.com/p/why-is-claude-for-teachers"
            tag="Critical"
          />
          <ResourceCard
            title="Stanford SCALE AI Evidence"
            desc="The research Anthropic cites on teacher-side vs. student-side AI outcomes"
            url="https://scale.stanford.edu/research-in-action/understanding-evidence-base-ai-k12-education"
            tag="Research"
          />
        </div>
      </div>
    ),
  },
];

export default function Page() {
  return <Slideshow slides={slides} storageKey="claude-for-teachers-slide" />;
}
