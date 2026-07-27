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
// CONTRAST RULES (baked in so future edits stay accessible):
//
//  Light slides (dark=false), bg is --kinship-cream (~#F5F0E8):
//    • Primary text:   text-[var(--kinship-ink)]       oklch 19% — passes AAA
//    • Body / subtext: text-[var(--kinship-mid)]        oklch 44% — ≥4.8:1 on cream ✓ AA
//    • ❌ NEVER use:   text-[var(--kinship-dim)]        oklch 70% — only ~2.5:1, fails AA
//
//  Dark slides (dark=true), bg is --kinship-ink (~#3D1A4E):
//    • Primary text:   text-[var(--kinship-cream)]       oklch 93%
//    • Body / subtext: text-[var(--kinship-cream)] + opacity-85  — stays ≥4.5:1 ✓
//    • ❌ NEVER use:   opacity-60 or opacity-70 on body text — too faint
//
//  Tinted/colored card backgrounds (emerald-50, amber-50, white):
//    • Body text:      text-[var(--kinship-mid)]  ✓  (darker than card bg)
//    • Attribution:    text-[var(--kinship-mid)]  ✓
//    • ❌ NOT:         text-[var(--kinship-dim)]
// ─────────────────────────────────────────────────────────────────────────────

// ── Quote card ─────────────────────────────────────────────────────────────
function QuoteCard({ quote, author, role, sentiment }: {
  quote: string; author: string; role: string; sentiment: "positive" | "critical";
}) {
  const colors = sentiment === "positive"
    ? "border-emerald-200 bg-emerald-50"
    : "border-amber-200 bg-amber-50";
  const icon = sentiment === "positive" ? "✅" : "⚠️";
  return (
    <div className={`rounded-xl border p-3 ${colors}`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-xs">{icon}</span>
        {/* Author uses ink — highest contrast on tinted bg */}
        <span className="text-xs font-semibold text-[var(--kinship-ink)]">{author}</span>
      </div>
      {/* Quote body: ink for readability */}
      <p className="text-xs text-[var(--kinship-ink)] leading-relaxed italic mb-1.5">&ldquo;{quote}&rdquo;</p>
      {/* Role/attribution: mid (oklch 44%) — passes AA on light tinted bg */}
      <div className="text-xs text-[var(--kinship-mid)] font-medium">{role}</div>
    </div>
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
          {/* desc: mid not dim — passes AA on white */}
          <div className="text-[var(--kinship-mid)] text-xs mt-0.5 leading-relaxed">{desc}</div>
        </div>
        {/* tag pill: mid text on cream bg — passes AA */}
        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--kinship-cream)] text-[var(--kinship-mid)] font-medium border border-[var(--kinship-mid)] flex-shrink-0">{tag}</span>
      </div>
    </a>
  );
}

// ── Step item ─────────────────────────────────────────────────────────────
function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-7 h-7 rounded-full bg-[var(--kinship-ink)] text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
        {n}
      </div>
      <div>
        <div className="font-semibold text-[var(--kinship-ink)] text-sm">{title}</div>
        {/* Step desc: mid — passes AA on cream bg */}
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
      {/* Left: teacher circle */}
      <g className="cbob1">
        <circle cx="80" cy="70" r="28" fill="rgba(255,255,255,0.12)" />
        <circle cx="80" cy="70" r="24" fill="rgba(255,255,255,0.22)" />
        {/* Labels at 90% opacity on dark bg — passes AA */}
        <text x="80" y="78" textAnchor="middle" fontSize="20" fill="white" opacity="0.95">T</text>
        <text x="80" y="108" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.75)">Teacher</text>
      </g>
      {/* Center: Anthropic mark */}
      <g className="cbob2">
        <circle cx="240" cy="70" r="36" fill="#D97706" opacity="0.15" className="cpulse1" />
        <circle cx="240" cy="70" r="28" fill="#D97706" opacity="0.9" />
        <text x="240" y="79" textAnchor="middle" fontSize="22" fontWeight="bold" fill="white">A</text>
        <text x="240" y="116" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.75)">Claude</text>
      </g>
      {/* Right: school circle */}
      <g className="cbob1">
        <circle cx="400" cy="70" r="28" fill="rgba(255,255,255,0.12)" />
        <circle cx="400" cy="70" r="24" fill="rgba(255,255,255,0.22)" />
        <text x="400" y="78" textAnchor="middle" fontSize="20" fill="white" opacity="0.95">K</text>
        <text x="400" y="108" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.75)">K-12</text>
      </g>
      {/* Connecting lines */}
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
        {/* Byline: 80% opacity on dark = sufficient contrast */}
        <div className="text-xs font-semibold tracking-widest text-[var(--kinship-cream)] opacity-80 uppercase">
          Anthropic · Announced July 14, 2026
        </div>
        <SlideTitle
          title="Claude for Teachers"
          subtitle="Free AI for every US K-12 educator — what it is, how it works, and what people are saying"
          dark
        />
        <ResponsiveSVG maxWidth={480}>
          <CoverAnim />
        </ResponsiveSVG>
        {/* Nav hint: 75% opacity — still reads at small size on dark */}
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
        {/* Body text: mid not dim — passes AA on cream */}
        <div className="max-w-2xl text-center text-[var(--kinship-mid)] text-sm leading-relaxed px-4">
          Anthropic launched <strong className="text-[var(--kinship-ink)]">Claude for Teachers</strong> on July 14, 2026 —
          a specialized, completely free offering giving verified US K-12 educators access to
          full <strong className="text-[var(--kinship-ink)]">Claude Pro capabilities</strong>,
          plus a library of teaching-specific AI skills built around learning science and real curricula.
        </div>
        <SlideCardGrid>
          <SlideCard>
            <div className="text-2xl mb-2">🎓</div>
            <div className="font-semibold text-sm text-[var(--kinship-ink)]">Who qualifies</div>
            {/* Card body: mid on white — passes AA */}
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
            <div className="text-xs text-[var(--kinship-mid)] leading-relaxed">Open-source skills co-developed with educators, evaluated for rigor and pedagogical alignment. Available on GitHub.</div>
          </SlideCard>
          <SlideCard>
            <div className="font-semibold text-sm text-[var(--kinship-ink)] mb-1">🔗 9 Edtech Integrations</div>
            <div className="text-xs text-[var(--kinship-mid)] leading-relaxed">ASSISTments, Brisk Teaching, Canva Education, Coteach, Diffit, Eedi, MagicSchool, Snorkl, TeachFX — all connected.</div>
          </SlideCard>
          <SlideCard>
            <div className="font-semibold text-sm text-[var(--kinship-ink)] mb-1">🔒 Privacy First</div>
            <div className="text-xs text-[var(--kinship-mid)] leading-relaxed">No model training on teacher inputs or student data. US K-12 Terms of Service + FERPA-aligned Data Processing Addendum.</div>
          </SlideCard>
          <SlideCard>
            <div className="font-semibold text-sm text-[var(--kinship-ink)] mb-1">⚡ Full Claude Pro</div>
            <div className="text-xs text-[var(--kinship-mid)] leading-relaxed">Includes Claude Code and Claude Cowork (agentic features). Same tier as the paid $20/mo subscription.</div>
          </SlideCard>
          <SlideCard>
            <div className="font-semibold text-sm text-[var(--kinship-ink)] mb-1">🤝 Key Partners</div>
            <div className="text-xs text-[var(--kinship-mid)] leading-relaxed">AFT, Teach For America, Gates Foundation, Detroit Public Schools, Prospect Schools, and Playlab.ai for teacher-built AI tools.</div>
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
          <Step n={1} title="Go to claude.com/solutions/teachers" desc={"Click \"Get verified\" — you'll sign up with your school email address to confirm K-12 educator status"} />
          <Step n={2} title="Connect the Learning Commons connector" desc="Links Claude to your state's academic standards, prerequisite skills, and learning progressions" />
          <Step n={3} title="Optionally add edtech integrations" desc="Connect ASSISTments for math problems, Brisk Teaching for student activities, Canva Education for lesson materials, and more" />
          <Step n={4} title="Use built-in teaching skill workflows" desc="Plan differentiated lessons from real curricula, analyze class data, create formative assessments — all standards-aligned" />
          <Step n={5} title="Take the AI Fluency course (optional but great)" desc="Free course co-created with Teach For America: anthropic.skilljar.com/path/ai-fluency-for-pk-12-educators" />
        </div>
        <div className="w-full max-w-2xl px-4">
          <div className="rounded-xl border border-[var(--kinship-mid)] bg-[var(--kinship-cream)] p-3">
            {/* Label: mid on cream — passes AA */}
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
          <SlideDarkCard>
            <div className="text-2xl mb-2">📉</div>
            <div className="font-semibold text-sm text-[var(--kinship-cream)]">400,000+</div>
            {/* Dark slide body: cream at 85% — passes AA on dark bg */}
            <div className="text-xs text-[var(--kinship-cream)] opacity-85 mt-1">Vacant or underqualified teaching positions in the US. Teacher burnout is a national crisis.</div>
          </SlideDarkCard>
          <SlideDarkCard>
            <div className="text-2xl mb-2">🔬</div>
            <div className="font-semibold text-sm text-[var(--kinship-cream)]">Stanford SCALE research</div>
            <div className="text-xs text-[var(--kinship-cream)] opacity-85 mt-1">AI tools for teachers (not students) show more consistently positive outcomes. Teacher-side AI → stronger instructional practice.</div>
          </SlideDarkCard>
          <SlideDarkCard>
            <div className="text-2xl mb-2">🏫</div>
            <div className="font-semibold text-sm text-[var(--kinship-cream)]">Under-resourced schools first</div>
            <div className="text-xs text-[var(--kinship-cream)] opacity-85 mt-1">Detroit Public Schools is the pilot site. Anthropic explicitly names equity as the primary goal — not premium schools.</div>
          </SlideDarkCard>
        </SlideCardGrid>
        {/* Supporting body text: cream at 85% */}
        <div className="max-w-xl text-center text-[var(--kinship-cream)] opacity-85 text-sm leading-relaxed px-4">
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
            quote="You have a stealth education product on your hands. Teacher here — using Claude daily for lesson plans, HTML decks, annotated editions. K-12 is yours to take!"
            author="Educator on X"
            role="July 26, 2026"
            sentiment="positive"
          />
          <QuoteCard
            quote="We've been working with Anthropic on a Gold Standard for safety and privacy in K-12 education. This tool is designed by and for educators."
            author="Randi Weingarten"
            role="President, American Federation of Teachers"
            sentiment="positive"
          />
          <QuoteCard
            quote="The district offering should have come first. If your product encourages workflows involving student data, districts need governance before teachers have access."
            author="Dr. Joe Phillips"
            role="District Administrator — blocked the tool for his district"
            sentiment="critical"
          />
          <QuoteCard
            quote="Teachers aren't FERPA experts. When a company says a product is safe with student data, many educators will assume those workflows are appropriate."
            author="Dr. Joe Phillips"
            role="Full article: drjoephillips.substack.com"
            sentiment="critical"
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
            <div className="text-xs text-[var(--kinship-cream)] opacity-85 mt-1">Anyone can build Claude integrations. A Kinship plugin could surface student progress, suggest interventions, and automate teacher prep — right inside Claude.</div>
          </SlideDarkCard>
          <SlideDarkCard>
            <div className="text-2xl mb-2">🏗️</div>
            <div className="font-semibold text-sm text-[var(--kinship-cream)]">Playlab model</div>
            <div className="text-xs text-[var(--kinship-cream)] opacity-85 mt-1">Playlab.ai (named partner) helps teachers become AI builders. Kinship&apos;s teacher training product could take a similar angle — hands-on AI tool creation.</div>
          </SlideDarkCard>
          <SlideDarkCard>
            <div className="text-2xl mb-2">📡</div>
            <div className="font-semibold text-sm text-[var(--kinship-cream)]">Data layer</div>
            <div className="text-xs text-[var(--kinship-cream)] opacity-85 mt-1">Snorkl and TeachFX provide progress + classroom talk insights to Claude. Kinship&apos;s data could power similar teacher-facing AI workflows.</div>
          </SlideDarkCard>
        </SlideCardGrid>
        {/* Footer quote: 80% opacity — clearly readable on dark */}
        <div className="text-center text-[var(--kinship-cream)] opacity-80 text-xs max-w-lg px-4">
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
            desc="Sign up for free Claude Pro access at claude.com/solutions/teachers"
            url="https://claude.com/solutions/teachers"
            tag="Official"
          />
          <ResourceCard
            title="Claude for Teachers in Action"
            desc="Video tutorials with real teachers (Zac & Karina) showing actual workflows"
            url="https://claude.com/resources/tutorials/claude-for-teachers-in-action"
            tag="Tutorial"
          />
          <ResourceCard
            title="AI Fluency Course (Free)"
            desc="Teach For America + Anthropic PD course for PK-12 educators"
            url="https://anthropic.skilljar.com/path/ai-fluency-for-pk-12-educators"
            tag="Course"
          />
          <ResourceCard
            title="Open-Source Teaching Skills"
            desc="GitHub repo with all teaching skills — fork and adapt for your classroom"
            url="https://github.com/anthropics/k12-teacher-skills"
            tag="GitHub"
          />
          <ResourceCard
            title="K-12 Privacy & Terms"
            desc="FERPA-aligned Data Processing Addendum and K-12 Terms of Service details"
            url="https://support.claude.com/en/articles/15926041"
            tag="Privacy"
          />
          <ResourceCard
            title="Critical Read: We Blocked It"
            desc="District admin explains why they blocked Claude for Teachers — essential FERPA context"
            url="https://drjoephillips.substack.com/p/anthropic-launched-claude-for-teachers"
            tag="Critical"
          />
          <ResourceCard
            title="Playlab.ai"
            desc="Anthropic ecosystem partner helping teachers build their own AI tools (lab schools network)"
            url="https://www.playlab.ai/"
            tag="Partner"
          />
          <ResourceCard
            title="Stanford SCALE AI Evidence"
            desc="The research Anthropic cites on teacher-side vs. student-side AI impact"
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
