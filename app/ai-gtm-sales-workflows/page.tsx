"use client";
// Interactive explainer deck for AI-powered GTM & sales workflows

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

// ─── Cover Animation ────────────────────────────────────────────────────────
function CoverAnim() {
  return (
    <svg viewBox="0 0 520 130" width="100%" style={{ maxWidth: 520, display: "block" }}>
      <style>{`
        @keyframes gtm_float { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-7px)} }
        @keyframes gtm_pulse { 0%,100%{opacity:0.3} 50%{opacity:0.9} }
        @keyframes gtm_dash { to{stroke-dashoffset:-24} }
        .gtm_bob1 { animation: gtm_float 3.0s ease-in-out infinite }
        .gtm_bob2 { animation: gtm_float 3.4s ease-in-out infinite 0.4s }
        .gtm_bob3 { animation: gtm_float 2.8s ease-in-out infinite 0.8s }
        .gtm_bob4 { animation: gtm_float 3.2s ease-in-out infinite 0.2s }
        .gtm_bob5 { animation: gtm_float 3.6s ease-in-out infinite 0.6s }
        .gtm_pulse { animation: gtm_pulse 1.8s ease-in-out infinite }
        .gtm_dash { animation: gtm_dash 1.2s linear infinite }
      `}</style>

      {/* Center: Claude */}
      <g className="gtm_bob3" style={{ transformOrigin: "260px 65px" }}>
        <circle cx="260" cy="65" r="32" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
        <text x="260" y="60" textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.95)" fontWeight="bold">CLAUDE</text>
        <text x="260" y="74" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.7)">CODE</text>
      </g>

      {/* Left: HubSpot */}
      <g className="gtm_bob1" style={{ transformOrigin: "75px 65px" }}>
        <circle cx="75" cy="65" r="24" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <text x="75" y="61" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.85)" fontWeight="600">Hub</text>
        <text x="75" y="72" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.85)" fontWeight="600">Spot</text>
      </g>

      {/* Right: Crustdata */}
      <g className="gtm_bob2" style={{ transformOrigin: "445px 65px" }}>
        <circle cx="445" cy="65" r="24" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <text x="445" y="61" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.85)" fontWeight="600">Crust</text>
        <text x="445" y="72" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.85)" fontWeight="600">data</text>
      </g>

      {/* Top-left: Fathom */}
      <g className="gtm_bob4" style={{ transformOrigin: "130px 22px" }}>
        <circle cx="130" cy="22" r="18" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <text x="130" y="26" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.8)">Fathom</text>
      </g>

      {/* Bottom-left: Instantly */}
      <g className="gtm_bob5" style={{ transformOrigin: "130px 108px" }}>
        <circle cx="130" cy="108" r="18" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <text x="130" y="112" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.8)">Instantly</text>
      </g>

      {/* Top-right: Slack */}
      <g className="gtm_bob1" style={{ transformOrigin: "390px 22px" }}>
        <circle cx="390" cy="22" r="18" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <text x="390" y="26" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.8)">Slack</text>
      </g>

      {/* Bottom-right: Google */}
      <g className="gtm_bob2" style={{ transformOrigin: "390px 108px" }}>
        <circle cx="390" cy="108" r="18" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
        <text x="390" y="112" textAnchor="middle" fontSize="8" fill="rgba(255,255,255,0.8)">GWS</text>
      </g>

      {/* Dashed lines from center to satellites */}
      {/* Left */}
      <line x1="228" y1="65" x2="99" y2="65" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 4" className="gtm_dash" />
      {/* Right */}
      <line x1="292" y1="65" x2="421" y2="65" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="4 4" className="gtm_dash" />
      {/* Top-left */}
      <line x1="240" y1="43" x2="144" y2="32" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 4" className="gtm_dash" />
      {/* Bottom-left */}
      <line x1="240" y1="87" x2="144" y2="98" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 4" className="gtm_dash" />
      {/* Top-right */}
      <line x1="280" y1="43" x2="376" y2="32" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 4" className="gtm_dash" />
      {/* Bottom-right */}
      <line x1="280" y1="87" x2="376" y2="98" stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3 4" className="gtm_dash" />
    </svg>
  );
}

// ─── Step component ──────────────────────────────────────────────────────────
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

// ─── Prompt block ────────────────────────────────────────────────────────────
function PromptBlock({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--kinship-mid)] bg-[var(--kinship-ink)] px-4 py-3 w-full max-w-2xl">
      <div className="text-[10px] font-semibold text-[var(--kinship-cream)] opacity-60 uppercase tracking-widest mb-2">Prompt to Claude</div>
      <div className="text-xs text-[var(--kinship-cream)] leading-relaxed font-mono whitespace-pre-wrap">{children}</div>
    </div>
  );
}

// ─── Tool badge ──────────────────────────────────────────────────────────────
function ToolBadge({ name, role }: { name: string; role: string }) {
  return (
    <div className="flex items-start gap-2 p-2 rounded-lg border border-[var(--kinship-mid)] bg-white">
      <div className="w-8 h-8 rounded-md bg-[var(--kinship-ink)] flex items-center justify-center flex-shrink-0">
        <span className="text-[var(--kinship-cream)] text-xs font-bold">{name[0]}</span>
      </div>
      <div>
        <div className="font-semibold text-[var(--kinship-ink)] text-xs">{name}</div>
        <div className="text-[var(--kinship-mid)] text-[10px] leading-tight mt-0.5">{role}</div>
      </div>
    </div>
  );
}

// ─── Dark prompt block ────────────────────────────────────────────────────────
function DarkPromptBlock({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-[rgba(245,240,232,0.3)] bg-[rgba(0,0,0,0.3)] px-4 py-3 w-full max-w-2xl">
      <div className="text-[10px] font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(245,240,232,0.5)" }}>Prompt to Claude</div>
      <div className="text-xs leading-relaxed font-mono whitespace-pre-wrap" style={{ color: "rgba(245,240,232,0.9)" }}>{children}</div>
    </div>
  );
}

// ─── Slides ───────────────────────────────────────────────────────────────────
const slides: Slide[] = [
  // 1. Cover
  {
    id: "cover",
    dark: true,
    label: "Cover",
    content: (
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(245,240,232,0.5)" }}>
          Chris Pisarski · @chrispisarski · Jul 28, 2026
        </div>
        <SlideTitle
          title="AI-Powered GTM & Sales"
          subtitle="How to build autonomous outbound workflows with Claude Code + MCP tools"
          dark
        />
        <ResponsiveSVG maxWidth={520}>
          <CoverAnim />
        </ResponsiveSVG>
        <div className="text-xs" style={{ color: "rgba(245,240,232,0.45)" }}>
          9 slides · ← → to navigate
        </div>
      </div>
    ),
  },

  // 2. What Is This?
  {
    id: "what",
    dark: false,
    label: "1 · What Is This?",
    content: (
      <div className="flex flex-col items-center gap-5 w-full">
        <SectionLabel>1 · What Is This?</SectionLabel>
        <SlideTitle
          title="Replace your SDR stack with an AI agent that never stops working."
          size="sm"
        />
        <p className="text-sm text-[var(--kinship-mid)] text-center max-w-xl leading-relaxed">
          Chris Pisarski built five autonomous sales workflows at his company using{" "}
          <a href="https://claude.ai/code" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">Claude Code</a>{" "}
          connected to their entire GTM tool stack via{" "}
          <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">MCP (Model Context Protocol)</a>.
          The agent reads your CRM, enriches data, analyzes patterns, writes ideal customer profiles,
          builds outbound lists, and routes leads — all without manual work.
        </p>
        <SlideCardGrid cols={3}>
          <SlideCard
            icon="🤖"
            title="Claude Code as the Brain"
            description="Claude Code runs multi-step workflows with spawned subagents that validate and loop until quality thresholds are met."
          />
          <SlideCard
            icon="🔌"
            title="MCP = Tool Access"
            description="Model Context Protocol gives Claude read/write access to your real tools: CRM, email, enrichment APIs, Slack, and Sheets."
          />
          <SlideCard
            icon="♾️"
            title="Fully Autonomous Loops"
            description="Workflows self-verify with holdout tests, score thresholds, and subagent blind-checks — they loop until they pass."
          />
        </SlideCardGrid>
      </div>
    ),
  },

  // 3. The Stack
  {
    id: "stack",
    dark: false,
    label: "2 · The Tool Stack",
    content: (
      <div className="flex flex-col items-center gap-5 w-full">
        <SectionLabel>2 · The Tool Stack</SectionLabel>
        <SlideTitle title="6 MCP tools. One agent that connects them all." size="sm" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full max-w-2xl">
          <ToolBadge
            name="HubSpot MCP"
            role="CRM — export contacts, deals, pipeline stages; create/update companies and contacts programmatically"
          />
          <ToolBadge
            name="Crustdata MCP"
            role="People + company enrichment — headcount, dept mix, funding, open roles, tech stack, exec hire detection, reverse email → LinkedIn"
          />
          <ToolBadge
            name="Fathom MCP"
            role="Call recordings — extract verbatim buying triggers, pain signals, and deal context from recorded sales calls"
          />
          <ToolBadge
            name="Instantly MCP"
            role="Outbound sequencing — add contacts to email sequences, manage campaigns, track reply rates"
          />
          <ToolBadge
            name="Slack MCP"
            role="Team comms + alerts — notify AEs of signals, push champion job-change alerts, send drafted first touches"
          />
          <ToolBadge
            name="Google Workspace CLI"
            role="Docs + Sheets — push enriched prospect lists to Sheets, write ICP.md + signals.md, share outputs with team"
          />
        </div>
        <p className="text-xs text-[var(--kinship-mid)] text-center max-w-lg">
          Setup: install each MCP server locally, add config to your Claude Code settings, then ask Claude to build workflows across all of them.
          Each tool gives Claude full API access — reads and writes.
        </p>
      </div>
    ),
  },

  // 4. ICP / TAM Mapping
  {
    id: "icp",
    dark: false,
    label: "3 · ICP / TAM Mapping",
    content: (
      <div className="flex flex-col items-center gap-4 w-full">
        <SectionLabel>3 · Workflow A: ICP / TAM Mapping</SectionLabel>
        <SlideTitle title="Let Claude reverse-engineer your ideal customer from closed-won data." size="sm" />
        <div className="flex flex-col gap-2 w-full max-w-2xl">
          <Step n={1} title="Export closed-won deals from HubSpot" desc="Pull: company name, deal size, sales cycle length. If you have no closed-won yet: use your best open opps + competitors' customers scraped from their case-study pages and G2." />
          <Step n={2} title="Enrich every company via Crustdata MCP" desc="Add: industry, headcount by dept, geo, funding stage, tech stack, open roles, exec hires. This reconstructs what each company looked like when they bought." />
          <Step n={3} title="Run this prompt on the enriched data" desc="Ask Claude to flag patterns, weight by deal size, and write a living ICP document:" />
        </div>
        <PromptBlock>{`you have ./winners/ (one json per closed-won customer)
and ./crm_export.csv (deal size + cycle length)

1. flag every attribute shared by 70%+ of winners, weighted by deal size
2. drop attributes any random B2B company would also match
3. write ./icp.md: hard filters (industry, headcount, geo, funding)
   + soft signals with weights (dept ratios, hiring, tech)
   + anti-icp (attributes of wins that churned or closed slow)
4. spawn a subagent to blind-score every winner against icp.md.
   80% of winners must score 70+. loop until they do.`}</PromptBlock>
        <p className="text-xs text-[var(--kinship-mid)] text-center max-w-lg">
          The subagent self-validates: it scores your own closed-won against the ICP it just wrote.
          If fewer than 80% score above 70, Claude refines and loops automatically.
        </p>
      </div>
    ),
  },

  // 5. Mail Infrastructure
  {
    id: "mail",
    dark: true,
    label: "4 · Mail Infrastructure",
    content: (
      <div className="flex flex-col items-center gap-5 w-full">
        <SectionLabel dark>4 · Workflow B: Mail Infrastructure</SectionLabel>
        <SlideTitle title="Cold email infra is ops work Claude can spec for you." size="sm" dark />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
          <SlideDarkCard>
            <div className="text-lg mb-1">📬</div>
            <div className="font-semibold text-sm text-[var(--kinship-cream)]">Domain Strategy</div>
            <div className="text-xs mt-1" style={{ color: "rgba(245,240,232,0.88)" }}>
              Never send cold from your main domain. Buy 2–5 alternate domains to start (yourbrand-hq.com, tryyourbrand.com), up to 20–40 at scale. 2–3 inboxes per domain, first-name format only (john@, not sales@, no numbers).
            </div>
          </SlideDarkCard>
          <SlideDarkCard>
            <div className="text-lg mb-1">🔐</div>
            <div className="font-semibold text-sm text-[var(--kinship-cream)]">DNS Setup (required)</div>
            <div className="text-xs mt-1" style={{ color: "rgba(245,240,232,0.88)" }}>
              Every domain needs: SPF, DKIM, DMARC + a custom tracking domain (CNAME). Disable open tracking — the pixel hurts deliverability. Track replies only.
            </div>
          </SlideDarkCard>
          <SlideDarkCard>
            <div className="text-lg mb-1">🔥</div>
            <div className="font-semibold text-sm text-[var(--kinship-cream)]">Warmup Protocol</div>
            <div className="text-xs mt-1" style={{ color: "rgba(245,240,232,0.88)" }}>
              Warmup 2–4 weeks before sending anything. Start at 5–10/day per inbox and ramp. Warmup never stops: after ramp, send ~20 cold + ~30 warmup per inbox daily. Capacity: 1,000 cold/day ≈ 50 inboxes across 20 domains.
            </div>
          </SlideDarkCard>
          <SlideDarkCard>
            <div className="text-lg mb-1">🛡️</div>
            <div className="font-semibold text-sm text-[var(--kinship-cream)]">Pre-Campaign Checks</div>
            <div className="text-xs mt-1" style={{ color: "rgba(245,240,232,0.88)" }}>
              Before every send: verify the list (bounce rate must stay under 2–3%) + run an inbox placement test (primary vs promotions vs spam). Check for secure email gateways (Proofpoint, Mimecast, Barracuda) — throttle those contacts or switch to LinkedIn campaigns instead.
            </div>
          </SlideDarkCard>
        </div>
        <p className="text-xs text-center max-w-lg" style={{ color: "rgba(245,240,232,0.6)" }}>
          Claude can help you spec the full domain/inbox matrix in a Sheet and flag any DNS misconfiguration — give it access via Google Workspace CLI.
        </p>
      </div>
    ),
  },

  // 6. Signal-Based Lists
  {
    id: "signals",
    dark: false,
    label: "5 · Signal-Based Lists",
    content: (
      <div className="flex flex-col items-center gap-4 w-full">
        <SectionLabel>5 · Workflow C: Signal-Based Outreach</SectionLabel>
        <SlideTitle title="Find out which signals actually made prospects reply — then automate the watch." size="sm" />
        <div className="flex flex-col gap-2 w-full max-w-2xl">
          <Step n={1} title="Export your full outbound history from Instantly + HubSpot" desc="Every prospect ever contacted: date contacted, replied y/n, meeting y/n, won y/n. Add Fathom call context for accounts that did reply." />
          <Step n={2} title="Reconstruct signal state at contact date via Crustdata" desc="For each account, look back to what was true on the day you sent: headcount delta prior quarter, days since funding, open roles matching buyer titles, new VP+ hire in prior 90 days." />
          <Step n={3} title="Run the signal analysis prompt" desc="Claude calculates lift per signal and finds the optimal contact window:" />
        </div>
        <PromptBlock>{`you have ./outbound_history.csv (every account ever contacted: date, replied, meeting, won)

1. for each account, reconstruct signal state at contact date via crustdata:
   headcount delta prior quarter, days since funding, open roles matching [titles],
   exec hires prior 90 days, posts, all relevant signals
2. calculate lift per signal: reply rate with signal vs baseline reply rate
3. calculate each signal's window: median days between signal and the replies it produced
4. read the reply threads per signal and extract the angle that worked
5. write ./signals.md: only signals with 1.5x+ lift, each with: lift, window, proven angle.
   everything else gets deleted, not monitored
6. verify with a subagent: hold out 20% of history, check the ranking predicts reply rate
   on the holdout. loop until it does.`}</PromptBlock>
        <p className="text-xs text-[var(--kinship-mid)] text-center max-w-lg">
          Once signals.md is written, set up a Crustdata real-time watcher for those signals.
          When a company fires one, automatically add them to the matching Instantly sequence.
        </p>
      </div>
    ),
  },

  // 7. Lookalike Lists
  {
    id: "lookalike",
    dark: true,
    label: "6 · Lookalike Lists",
    content: (
      <div className="flex flex-col items-center gap-4 w-full">
        <SectionLabel dark>6 · Workflow D: Lookalike Lists</SectionLabel>
        <SlideTitle title="Find companies that look like your best customers did at the time they bought." size="sm" dark />
        <div className="flex flex-col gap-2 w-full max-w-2xl">
          <div className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-full bg-[rgba(245,240,232,0.2)] text-[var(--kinship-cream)] text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
            <div>
              <div className="font-semibold text-[var(--kinship-cream)] text-sm">Rank your customers</div>
              <div className="text-xs mt-0.5 leading-relaxed" style={{ color: "rgba(245,240,232,0.85)" }}>
                Score by: ACV × speed-to-close × expansion, minus churn. Only top-third customers become lookalike seeds.
              </div>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-7 h-7 rounded-full bg-[rgba(245,240,232,0.2)] text-[var(--kinship-cream)] text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
            <div>
              <div className="font-semibold text-[var(--kinship-cream)] text-sm">Reconstruct the company at purchase date (not today)</div>
              <div className="text-xs mt-0.5 leading-relaxed" style={{ color: "rgba(245,240,232,0.85)" }}>
                Via Crustdata: headcount, dept mix, funding stage, open roles they were hiring for when they bought.
                Pull Fathom transcripts: extract buying trigger verbatim + observable proxy pain.
              </div>
            </div>
          </div>
        </div>
        <DarkPromptBlock>{`1. check the customer ranks in the top third (ACV × close speed × expansion, minus churn)
2. reconstruct the company at purchase date via crustdata, not its current state
3. read the fathom transcripts from the deal. extract the buying trigger in their words
   + the observable proxy (what would this pain look like from the outside)
4. crustdata search: companies matching the at-purchase profile AND the pain proxy.
   exclude current customers, open pipeline, closed-lost < 6 months old
5. score 1-100 on firmographic match × pain-proxy match. keep 70+, cap at 25
6. verify with a subagent: blind-mix the 25 with 25 random companies that pass basic
   ICP filters. it must identify the real lookalikes 80%+ of the time.
   if it can't, the criteria are too generic, tighten and loop`}</DarkPromptBlock>
        <p className="text-xs text-center max-w-lg" style={{ color: "rgba(245,240,232,0.6)" }}>
          Output pushed to Google Sheets via Google Workspace CLI, added to HubSpot, or sent directly to Instantly.
        </p>
      </div>
    ),
  },

  // 8. Champion Tracking
  {
    id: "champions",
    dark: false,
    label: "7 · Champion Tracking",
    content: (
      <div className="flex flex-col items-center gap-4 w-full">
        <SectionLabel>7 · Workflow E: Champion Tracking</SectionLabel>
        <SlideTitle title="When your champion moves to a new job, get alerted instantly." size="sm" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
          <SlideCard
            icon="📋"
            title="Step 1: Pull all champions from HubSpot"
            description="Extract every contact tagged as champion or decision-maker on closed-won deals. Add Fathom context for each."
          />
          <SlideCard
            icon="🔍"
            title="Step 2: Resolve to LinkedIn profiles"
            description="Crustdata batch reverse-email lookup maps their email → LinkedIn profile. One-time backfill first, then diff current employer vs deal account."
          />
          <SlideCard
            icon="👁️"
            title="Step 3: Create Crustdata watchers"
            description="Set a watcher on each profile. Get a Slack alert whenever: new company, new funding, new hire at their firm, posts mentioning relevant topics."
          />
          <SlideCard
            icon="🤝"
            title="Step 4: Claude auto-routes and drafts outreach"
            description="When a job change fires: enrich new company, score vs icp.md, create in HubSpot if 70+, assign original AE, Slack a drafted first touch referencing deal history."
          />
        </div>
        <PromptBlock>{`pull fired watchers. for each job change:
1. enrich the new company + the new email of the champion using crustdata
2. score the new company against icp.md. below 70 → log it in hubspot, no alert
3. 70+ → create the company + contact in hubspot, tag champion-landed,
   assign the AE from the original deal
4. slack the AE: who they are, what they bought, the original deal size,
   what the new company does + a drafted first touch referencing the history
   using fathom as context`}</PromptBlock>
      </div>
    ),
  },

  // 9. How to Actually Build This
  {
    id: "build",
    dark: true,
    label: "8 · How to Build This",
    content: (
      <div className="flex flex-col items-center gap-5 w-full">
        <SectionLabel dark>8 · How to Actually Build This</SectionLabel>
        <SlideTitle title="Real implementation steps — no vague 'just use AI' advice." size="sm" dark />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-3xl">
          <SlideDarkCard>
            <div className="font-semibold text-sm text-[var(--kinship-cream)] mb-1">① Install MCP Servers</div>
            <div className="text-xs leading-relaxed" style={{ color: "rgba(245,240,232,0.88)" }}>
              Each tool (HubSpot, Crustdata, Fathom, Instantly, Slack, GWS) has an MCP server you add to your{" "}
              <a href="https://docs.anthropic.com/en/docs/claude-code/mcp" target="_blank" rel="noopener noreferrer"
                className="underline underline-offset-1">Claude Code settings</a>.
              Run <code className="bg-[rgba(255,255,255,0.1)] px-1 rounded">claude mcp add</code> for each.
              Authenticate each tool — most use OAuth or API keys.
            </div>
          </SlideDarkCard>
          <SlideDarkCard>
            <div className="font-semibold text-sm text-[var(--kinship-cream)] mb-1">② Set Up Your Data Directory</div>
            <div className="text-xs leading-relaxed" style={{ color: "rgba(245,240,232,0.88)" }}>
              Create a local workspace folder (e.g. <code className="bg-[rgba(255,255,255,0.1)] px-1 rounded">~/gtm-agent/</code>).
              Export your HubSpot data to <code className="bg-[rgba(255,255,255,0.1)] px-1 rounded">crm_export.csv</code> and closed-won deal JSONs to <code className="bg-[rgba(255,255,255,0.1)] px-1 rounded">winners/</code>.
              Claude reads from and writes to this directory during each workflow run.
            </div>
          </SlideDarkCard>
          <SlideDarkCard>
            <div className="font-semibold text-sm text-[var(--kinship-cream)] mb-1">③ Run the ICP Workflow First</div>
            <div className="text-xs leading-relaxed" style={{ color: "rgba(245,240,232,0.88)" }}>
              Start with ICP mapping — it creates <code className="bg-[rgba(255,255,255,0.1)] px-1 rounded">icp.md</code>, which every other workflow depends on.
              The subagent self-validation loop means it will refine until it passes.
              This typically runs in 5–15 minutes depending on deal volume.
            </div>
          </SlideDarkCard>
          <SlideDarkCard>
            <div className="font-semibold text-sm text-[var(--kinship-cream)] mb-1">④ Signal Analysis Needs History</div>
            <div className="text-xs leading-relaxed" style={{ color: "rgba(245,240,232,0.88)" }}>
              Minimum viable: 50–100 contacted prospects with reply/meeting outcomes.
              No history yet? Run signal analysis on closed-won instead (what signals existed in the 90 days before each win entered pipeline).
              Export outbound history from Instantly + HubSpot.
            </div>
          </SlideDarkCard>
          <SlideDarkCard>
            <div className="font-semibold text-sm text-[var(--kinship-cream)] mb-1">⑤ Real-Time Watchers via Crustdata</div>
            <div className="text-xs leading-relaxed" style={{ color: "rgba(245,240,232,0.88)" }}>
              After signals.md is written, use the{" "}
              <a href="https://crustdata.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-1">Crustdata API</a>{" "}
              to create webhook watchers for each signal. When triggered, call Claude Code programmatically (via API) to run the routing workflow.
              Set a Slack webhook for champion alerts.
            </div>
          </SlideDarkCard>
          <SlideDarkCard>
            <div className="font-semibold text-sm text-[var(--kinship-cream)] mb-1">⑥ Automate with Scheduled Runs</div>
            <div className="text-xs leading-relaxed" style={{ color: "rgba(245,240,232,0.88)" }}>
              Lookalike list generation and champion backfill run on a schedule (cron job or workflow tool like n8n / Make).
              Each new closed-won deal triggers the lookalike workflow automatically.
              Champion job-change watchers run continuously — Crustdata polls LinkedIn daily.
            </div>
          </SlideDarkCard>
        </div>
        <p className="text-xs text-center max-w-xl mt-1" style={{ color: "rgba(245,240,232,0.5)" }}>
          Source: Chris Pisarski (@chrispisarski) on X · Jul 28, 2026 ·{" "}
          <a href="https://x.com/chrispisarski/status/2082236016161677644" target="_blank" rel="noopener noreferrer"
            className="underline underline-offset-1">Read the original thread ↗</a>
        </p>
      </div>
    ),
  },
];

export default function Page() {
  return <Slideshow slides={slides} storageKey="ai-gtm-sales-workflows-slide" />;
}
