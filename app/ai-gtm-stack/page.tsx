
"use client";
// Client component — interactive slideshow with keyboard navigation

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

// ── Cover animation ─────────────────────────────────────────────────────────
function CoverAnim() {
  return (
    <svg viewBox="0 0 520 130" width="100%" style={{ maxWidth: 520, display: "block" }}>
      <style>{`
        @keyframes aigs_pulse { 0%,100%{opacity:0.4;r:22} 50%{opacity:1;r:26} }
        @keyframes aigs_flow { 0%{stroke-dashoffset:40} 100%{stroke-dashoffset:0} }
        @keyframes aigs_bob { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-6px)} }
        .aigs_hub { animation: aigs_pulse 2.2s ease-in-out infinite }
        .aigs_pipe { animation: aigs_flow 1.8s linear infinite }
        .aigs_node { animation: aigs_bob 3s ease-in-out infinite }
      `}</style>

      {/* Center AI hub */}
      <circle cx="260" cy="65" r="32" fill="rgba(255,255,255,0.15)" />
      <circle cx="260" cy="65" className="aigs_hub" r="22" fill="rgba(255,255,255,0.25)" />
      <text x="260" y="70" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">AI</text>

      {/* Left nodes */}
      <g className="aigs_node" style={{ animationDelay: "0s" }}>
        <circle cx="80" cy="40" r="22" fill="rgba(255,255,255,0.12)" />
        <text x="80" y="45" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.9)">ICP</text>
      </g>
      <g className="aigs_node" style={{ animationDelay: "0.5s" }}>
        <circle cx="80" cy="92" r="22" fill="rgba(255,255,255,0.12)" />
        <text x="80" y="97" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.9)">Signal</text>
      </g>

      {/* Right nodes */}
      <g className="aigs_node" style={{ animationDelay: "0.3s" }}>
        <circle cx="440" cy="40" r="22" fill="rgba(255,255,255,0.12)" />
        <text x="440" y="45" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.9)">Pipeline</text>
      </g>
      <g className="aigs_node" style={{ animationDelay: "0.8s" }}>
        <circle cx="440" cy="92" r="22" fill="rgba(255,255,255,0.12)" />
        <text x="440" y="97" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.9)">CRM</text>
      </g>

      {/* Connecting pipes */}
      <line x1="102" y1="40" x2="235" y2="60" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="5 4" className="aigs_pipe" />
      <line x1="102" y1="92" x2="235" y2="70" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="5 4" className="aigs_pipe" strokeDashoffset="20" />
      <line x1="285" y1="60" x2="418" y2="40" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="5 4" className="aigs_pipe" />
      <line x1="285" y1="70" x2="418" y2="92" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeDasharray="5 4" className="aigs_pipe" strokeDashoffset="15" />
    </svg>
  );
}

// ── Quote card ──────────────────────────────────────────────────────────────
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
        <span className="ml-auto text-[var(--kinship-mid)] text-xs">↗</span>
      </div>
      <p className="text-xs text-[var(--kinship-ink)] leading-relaxed italic mb-1.5">&ldquo;{quote}&rdquo;</p>
      <div className="text-xs text-[var(--kinship-mid)] font-medium">{role}</div>
    </a>
  );
}

// ── Resource card ───────────────────────────────────────────────────────────
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

// ── Step ────────────────────────────────────────────────────────────────────
function Step({ n, title, desc, url }: { n: number; title: string; desc: string; url?: string }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-7 h-7 rounded-full bg-[var(--kinship-ink)] text-white text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{n}</div>
      <div>
        {url ? (
          <a href={url} target="_blank" rel="noopener noreferrer"
            className="font-semibold text-[var(--kinship-ink)] text-sm hover:underline underline-offset-2 flex items-center gap-1">
            {title} <span className="text-[var(--kinship-mid)] text-xs">↗</span>
          </a>
        ) : (
          <div className="font-semibold text-[var(--kinship-ink)] text-sm">{title}</div>
        )}
        <div className="text-xs text-[var(--kinship-mid)] mt-0.5 leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}

// ── Slides ──────────────────────────────────────────────────────────────────
const slides: Slide[] = [
  // ── 1. Cover ─────────────────────────────────────────────────────────────
  {
    id: "cover",
    dark: true,
    label: "Cover",
    content: (
      <div className="flex flex-col items-center gap-6 w-full text-center">
        <div className="text-xs font-semibold tracking-widest uppercase" style={{ color: "rgba(245,240,232,0.55)" }}>
          @chrispisarski on X &nbsp;·&nbsp; Jul 27, 2026
        </div>
        <SlideTitle
          title="The AI GTM Stack"
          subtitle="Every YC founder is looking for one person who can do all of this with AI."
          dark
        />
        <ResponsiveSVG maxWidth={520}>
          <CoverAnim />
        </ResponsiveSVG>
        <div className="text-xs" style={{ color: "rgba(245,240,232,0.45)" }}>
          132K views &nbsp;·&nbsp; 8 slides &nbsp;·&nbsp; ← → to navigate
        </div>
      </div>
    ),
  },

  // ── 2. What Is It ────────────────────────────────────────────────────────
  {
    id: "what-is-it",
    dark: false,
    label: "1 · What Is It?",
    content: (
      <div className="flex flex-col items-center gap-5 w-full">
        <SectionLabel>1 · What Is It?</SectionLabel>
        <SlideTitle
          title="The full-stack AI sales operator."
          size="sm"
        />
        <p className="text-sm text-[var(--kinship-mid)] text-center max-w-xl leading-relaxed">
          Chris Pisarski, a GTM operator who helped scale a company from $700K to millions, posted a viral thread about the new archetype of hire that YC founders can&apos;t find: someone who can automate their entire revenue pipeline using AI.
        </p>
        <SlideCardGrid>
          <SlideCard>
            <div className="font-semibold text-[var(--kinship-ink)] text-sm mb-1">Who Posted It</div>
            <div className="text-xs text-[var(--kinship-mid)] leading-relaxed">Chris Pisarski (@chrispisarski) — GTM operator, growth advisor. Worked directly with YC-stage founders.</div>
          </SlideCard>
          <SlideCard>
            <div className="font-semibold text-[var(--kinship-ink)] text-sm mb-1">Why It Went Viral</div>
            <div className="text-xs text-[var(--kinship-mid)] leading-relaxed">132K+ views in one day. Names 20+ concrete sales workflows that AI can now handle — what used to need a whole team.</div>
          </SlideCard>
          <SlideCard>
            <div className="font-semibold text-[var(--kinship-ink)] text-sm mb-1">The Core Claim</div>
            <div className="text-xs text-[var(--kinship-mid)] leading-relaxed">Two technical operators + Claude Code + a few APIs took a startup from $700K to millions in revenue. The team is now 3.</div>
          </SlideCard>
        </SlideCardGrid>
      </div>
    ),
  },

  // ── 3. The Full List ─────────────────────────────────────────────────────
  {
    id: "the-list",
    dark: false,
    label: "2 · The Full List",
    content: (
      <div className="flex flex-col items-center gap-4 w-full">
        <SectionLabel>2 · The Full List</SectionLabel>
        <SlideTitle title="20+ workflows. One role." size="sm" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-3xl">
          {[
            ["Map ICP & TAM", "Define your ideal customer profile and total addressable market — continuously updated"],
            ["Signal-based lists", "Trigger prospecting based on real events: funding, hiring, tech stack changes"],
            ["Lookalike lists", "Find new accounts that look like your closed-won customers"],
            ["Champion tracking", "When a buyer changes jobs, automatically route them as a new account"],
            ["Mail infra setup", "Domain warming, deliverability, inbox rotation — the plumbing"],
            ["Outbound sequences", "Multi-touch email + LinkedIn cadences auto-built per segment"],
            ["Inbound system", "Content creation, ICP-filtered, distributed via creator network"],
            ["Score inbound", "Every inbound lead scored against your best closed-won accounts"],
            ["De-anonymize traffic", "Identify anonymous site visitors and push them into sequences"],
            ["AEO efforts", "Answer Engine Optimization — getting your brand cited in AI answers"],
            ["Re-engage closed-lost", "Automated nurture loops for deals that didn't close yet"],
            ["Expansion signals", "Product usage triggers that identify upsell and cross-sell moments"],
            ["Call analysis", "Record and analyze every sales call to create rep feedback loops"],
            ["Pre-call briefs", "Auto-generated meeting prep for every scheduled call"],
            ["Proposals & ROI models", "One-pager + ROI calc + proposal generated per deal automatically"],
            ["CRM architecture", "Own the CRM data model, hygiene, and reporting end-to-end"],
          ].map(([name, desc]) => (
            <div key={name} className="flex gap-2 items-start p-2 rounded-lg bg-white border border-[var(--kinship-mid)]">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--kinship-ink)] flex-shrink-0 mt-1.5" />
              <div>
                <div className="text-xs font-semibold text-[var(--kinship-ink)]">{name}</div>
                <div className="text-xs text-[var(--kinship-mid)] leading-relaxed">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },

  // ── 4. How They Build It ─────────────────────────────────────────────────
  {
    id: "how-to-build",
    dark: false,
    label: "3 · How It Works",
    content: (
      <div className="flex flex-col items-center gap-5 w-full">
        <SectionLabel>3 · How It Works</SectionLabel>
        <SlideTitle title="The technical recipe." size="sm" />
        <p className="text-sm text-[var(--kinship-mid)] text-center max-w-xl">
          Pisarski was explicit: his team uses{" "}
          <a href="https://claude.ai/code" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-[var(--kinship-ink)]">Claude Code</a>{" "}
          with a small number of external APIs, not a stack of expensive SaaS tools.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-2xl">
          <Step n={1} title="Define your ICP deeply" desc="Use AI to analyze your closed-won accounts: company size, tech stack, funding stage, job titles of buyers. This becomes your scoring model." />
          <Step n={2} title="Wire up signal sources" desc="Connect data providers (CrustData, Apollo, LinkedIn, Crunchbase) via API. Watch for funding rounds, new hires, tech stack changes, headcount swings." />
          <Step n={3} title="Build the automation layer with Claude Code" desc="Write agents that monitor signals, score accounts, build lists, and push records into your CRM. Use /subagents to verify output and /loop until the outcome is right." url="https://claude.ai/code" />
          <Step n={4} title="Set up mail infrastructure" desc="Warm domains, manage inbox rotation, set up email + LinkedIn sequences. Deliverability is the unglamorous foundation everything else depends on." />
          <Step n={5} title="Close the loop" desc="Feed sales call recordings back into the model. Score expansion signals. Re-engage closed-lost on triggers. The system learns from every deal." />
        </div>
      </div>
    ),
  },

  // ── 5. The Three Traits ──────────────────────────────────────────────────
  {
    id: "three-traits",
    dark: true,
    label: "4 · The Hire Profile",
    content: (
      <div className="flex flex-col items-center gap-6 w-full">
        <SectionLabel dark>4 · Who Can Actually Do This</SectionLabel>
        <SlideTitle
          title="Three traits. Non-negotiable."
          subtitle="Pisarski's team shares all three. This is why most founders can't find them."
          dark
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
          <SlideDarkCard>
            <div className="text-2xl mb-3">1</div>
            <div className="font-semibold text-[var(--kinship-cream)] text-sm mb-2">Full-cycle sales fluency</div>
            <div className="text-xs mt-1 leading-relaxed" style={{ color: "rgba(245,240,232,0.92)" }}>
              They understand the complete arc from cold prospect to closed deal. Not just top-of-funnel, not just closing — the entire chain.
            </div>
          </SlideDarkCard>
          <SlideDarkCard>
            <div className="text-2xl mb-3">2</div>
            <div className="font-semibold text-[var(--kinship-cream)] text-sm mb-2">Highly technical thinking</div>
            <div className="text-xs mt-1 leading-relaxed" style={{ color: "rgba(245,240,232,0.92)" }}>
              They don&apos;t need to be engineers, but they think in systems, APIs, and automation. They can debug a broken workflow.
            </div>
          </SlideDarkCard>
          <SlideDarkCard>
            <div className="text-2xl mb-3">3</div>
            <div className="font-semibold text-[var(--kinship-cream)] text-sm mb-2">Claude power user</div>
            <div className="text-xs mt-1 leading-relaxed" style={{ color: "rgba(245,240,232,0.92)" }}>
              They use Claude Code with /subagents that verify output and /loop until the outcome is achieved — not just chat prompts.
            </div>
          </SlideDarkCard>
        </div>
        <div className="max-w-xl text-center text-xs" style={{ color: "rgba(245,240,232,0.70)" }}>
          The combination is rare: most salespeople aren&apos;t technical, most technical people don&apos;t want to do sales, and most Claude users are still prompting, not building.
        </div>
      </div>
    ),
  },

  // ── 6. What People Are Saying ────────────────────────────────────────────
  {
    id: "reactions",
    dark: false,
    label: "5 · Reactions",
    content: (
      <div className="flex flex-col items-center gap-4 w-full">
        <SectionLabel>5 · What People Are Saying</SectionLabel>
        <SlideTitle title="132K views. The internet agrees — and pushes back." size="sm" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-3xl">
          <QuoteCard
            quote="4 months later and the majority of YC founders i'm speaking with are still trying to hire the person that can do all of this with AI... it's really hard to find one person who can own and maintain all of this"
            author="@chrispisarski"
            role="GTM Operator — the original thread"
            sentiment="positive"
            url="https://x.com/chrispisarski/status/2081846875217399998"
          />
          <QuoteCard
            quote="they built and ran every workflow above and more, and took us from 700k to millions in revenue. The team has since grown to 3."
            author="@chrispisarski"
            role="On what two technical operators accomplished"
            sentiment="positive"
            url="https://x.com/chrispisarski/status/2081846875217399998"
          />
          <QuoteCard
            quote="most of these workflows run for a fraction of what the equivalent sales tools cost, as long as your team builds them internally with claude code and a few external APIs"
            author="@chrispisarski"
            role="On cost advantage vs SaaS sales tools"
            sentiment="positive"
            url="https://x.com/chrispisarski/status/2081846875217399998"
          />
          <QuoteCard
            quote="The risk: this is a hard dependency on one or two people. If they leave, none of the institutional knowledge lives in a tool — it lives in their head and their custom agents."
            author="Common concern"
            role="Key pushback in replies — bus factor problem"
            sentiment="critical"
            url="https://x.com/chrispisarski/status/2081846875217399998"
          />
        </div>
      </div>
    ),
  },

  // ── 7. Kinship Relevance ─────────────────────────────────────────────────
  {
    id: "kinship-lens",
    dark: true,
    label: "6 · Kinship Lens",
    content: (
      <div className="flex flex-col items-center gap-6 w-full">
        <SectionLabel dark>6 · Kinship Lens</SectionLabel>
        <SlideTitle
          title="What does this mean for us?"
          subtitle="Kinship sells B2B into schools. The GTM stack described here applies directly."
          dark
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
          <SlideDarkCard>
            <div className="text-lg mb-2">🎯</div>
            <div className="font-semibold text-[var(--kinship-cream)] text-sm mb-2">ICP signals for schools</div>
            <div className="text-xs mt-1 leading-relaxed" style={{ color: "rgba(245,240,232,0.92)" }}>
              Districts that just received ESSER/Title I funding, hired new curriculum directors, or are running RFPs are high-signal targets. This is automatable.
            </div>
          </SlideDarkCard>
          <SlideDarkCard>
            <div className="text-lg mb-2">🔁</div>
            <div className="font-semibold text-[var(--kinship-cream)] text-sm mb-2">Champion tracking matters</div>
            <div className="text-xs mt-1 leading-relaxed" style={{ color: "rgba(245,240,232,0.92)" }}>
              Teachers and principals move districts constantly. Tracking champions who change schools — and routing them as new accounts — is a real edge in edtech.
            </div>
          </SlideDarkCard>
          <SlideDarkCard>
            <div className="text-lg mb-2">⚙️</div>
            <div className="font-semibold text-[var(--kinship-cream)] text-sm mb-2">Build vs buy</div>
            <div className="text-xs mt-1 leading-relaxed" style={{ color: "rgba(245,240,232,0.92)" }}>
              Clay + Apollo + Claude Code can replace a $50K/yr SaaS stack. The question is whether Kinship has the technical operator to build and maintain it.
            </div>
          </SlideDarkCard>
        </div>
        <div className="max-w-xl text-center text-xs" style={{ color: "rgba(245,240,232,0.70)" }}>
          The role Pisarski describes is essentially a GTM engineer. Kinship is early enough that one person in this role could define the entire sales motion.
        </div>
      </div>
    ),
  },

  // ── 8. Resources ─────────────────────────────────────────────────────────
  {
    id: "resources",
    dark: false,
    label: "7 · Go Deeper",
    content: (
      <div className="flex flex-col items-center gap-4 w-full">
        <SectionLabel>7 · Go Deeper</SectionLabel>
        <SlideTitle title="The tools, the thread, the stack." size="sm" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-3xl">
          <ResourceCard
            title="The Original Thread"
            desc="Chris Pisarski's full tweet with all 20+ GTM workflows listed"
            url="https://x.com/chrispisarski/status/2081846875217399998"
            tag="Source"
          />
          <ResourceCard
            title="Claude Code"
            desc="The AI coding agent Pisarski's team uses to build GTM automation — /subagents, /loop patterns"
            url="https://claude.ai/code"
            tag="Tool"
          />
          <ResourceCard
            title="CrustData"
            desc="Real-time company data API — headcount, funding, tech stack. Mentioned by replies as a key signal source"
            url="https://crustdata.com"
            tag="Tool"
          />
          <ResourceCard
            title="Clay"
            desc="No-code data enrichment platform — pull from 75+ data sources to build signal-based prospect lists"
            url="https://clay.com"
            tag="Tool"
          />
          <ResourceCard
            title="Common Room"
            desc="Community-led growth platform — tracks product usage, champion job changes, and engagement signals"
            url="https://commonroom.io"
            tag="Tool"
          />
          <ResourceCard
            title="What is Signal-Based Selling?"
            desc="Primer on using buying signals (funding, hiring, tech changes) to time outreach for higher response rates"
            url="https://www.apollo.io/blog/signal-based-selling"
            tag="Learn"
          />
          <ResourceCard
            title="AEO: Answer Engine Optimization"
            desc="The practice of getting your brand cited in AI answers (ChatGPT, Perplexity) — the new SEO for AI-native buyers"
            url="https://searchengineland.com/answer-engine-optimization-guide-446494"
            tag="Learn"
          />
          <ResourceCard
            title="Apollo.io"
            desc="Sales intelligence + sequence platform. Source for ICP data, email + LinkedIn outbound at scale"
            url="https://apollo.io"
            tag="Tool"
          />
        </div>
      </div>
    ),
  },
];

export default function Page() {
  return <Slideshow slides={slides} storageKey="ai-gtm-stack-slide" />;
}
