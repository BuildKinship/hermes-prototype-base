'use client';
// Magazine page — requires client for IntersectionObserver TOC and scroll effects

import React, { type ReactNode, useEffect, useRef, useState } from 'react';

// ─── Design Tokens ─────────────────────────────────────────────────────────
const C = {
  ink:        '#16120c',
  inkMid:     '#3d3328',
  inkDim:     '#6b5e50',
  inkFaint:   '#a8998a',
  paper:      '#f7f3ed',
  paperWarm:  '#f0eade',
  paperDark:  '#e8e0d4',
  white:      '#fdfaf6',
  accent:     '#b83a0c',
  accentFaint:'#fef0e8',
  partners:   { line: '#1a6641', bg: '#f0fdf6' },
  pilot:      { line: '#1e4e96', bg: '#f0f5ff' },
  product:    { line: '#5b21b6', bg: '#f7f3ff' },
  topics:     { line: '#92400e', bg: '#fff8f0' },
  brain:      { line: '#6b21a8', bg: '#fdf5ff' },
};
const SERIF = "'Georgia', 'Times New Roman', serif";
const SANS  = "'Inter', 'Helvetica Neue', Arial, sans-serif";
const MONO  = "'IBM Plex Mono', 'Courier New', monospace";

// ─── Sub-components ────────────────────────────────────────────────────────
function Kicker({ children, color = C.accent }: { children: ReactNode; color?: string }) {
  return (
    <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '10px',
      letterSpacing: '0.14em', textTransform: 'uppercase', color, marginBottom: '6px' }}>
      {children}
    </div>
  );
}

function SectionLabel({ emoji, title, color, bg }: { emoji: string; title: string; color: string; bg: string }) {
  return (
    <div>
      <hr style={{ border: 'none', borderTop: `3px solid ${C.ink}`, margin: '0' }} />
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        background: bg, padding: 'clamp(8px,1.5vw,12px) clamp(12px,3vw,20px)',
        borderBottom: `1px solid ${C.paperDark}`,
      }}>
        <span style={{ fontSize: '16px' }}>{emoji}</span>
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: '11px',
          letterSpacing: '0.12em', textTransform: 'uppercase', color }}>
          {title}
        </span>
      </div>
    </div>
  );
}

function ThreadLink({ href, label = '↗ thread' }: { href: string; label?: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer"
      style={{ fontFamily: MONO, fontSize: '11px', color: C.accent,
        textDecoration: 'none', letterSpacing: '0.04em' }}>
      {label}
    </a>
  );
}

function SoWhat({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontFamily: SANS, fontSize: '12px', color: C.accent,
      fontWeight: 600, borderTop: `1px solid ${C.paperDark}`, paddingTop: '10px',
      marginTop: '10px' }}>
      <span style={{ fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase',
        fontSize: '10px' }}>So what?</span>
      {' '}{children}
    </div>
  );
}

function SignalItem({ kicker, title, body, sowhat, link, lineColor }:
  { kicker: string; title: string; body: string; sowhat: string; link?: string; lineColor: string }) {
  return (
    <div style={{ borderTop: `1px solid ${C.paperDark}`, paddingTop: 'clamp(14px,2vw,20px)',
      paddingBottom: 'clamp(14px,2vw,20px)' }}>
      <Kicker color={lineColor}>{kicker}</Kicker>
      <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(16px,2.5vw,20px)', fontWeight: 700,
        color: C.ink, margin: '0 0 8px 0', lineHeight: 1.3 }}>{title}</h3>
      <p style={{ fontFamily: SERIF, fontSize: 'clamp(14px,1.8vw,16px)', color: C.inkMid,
        lineHeight: 1.65, margin: '0 0 4px 0' }}>{body}</p>
      {link && <div style={{ marginBottom: '4px' }}><ThreadLink href={link} /></div>}
      <SoWhat>{sowhat}</SoWhat>
    </div>
  );
}

// ─── Table of Contents ─────────────────────────────────────────────────────
const TOC_SECTIONS = [
  { id: 'partners',   label: '🤝 Partners',       color: C.partners.line },
  { id: 'pilot',      label: '🎯 Pilot Success',   color: C.pilot.line },
  { id: 'product',    label: '⚙️ Product',         color: C.product.line },
  { id: 'topics',     label: '🔭 Topics',          color: C.topics.line },
  { id: 'brain',      label: '🧠 Brain',           color: C.brain.line },
];

function TableOfContents() {
  const [active, setActive] = useState('');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    TOC_SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        entries => { if (entries[0].isIntersecting) setActive(s.id); },
        { rootMargin: '-20% 0px -70% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '6px',
      padding: 'clamp(10px,1.5vw,14px) 0', borderBottom: `1px solid ${C.paperDark}`,
      borderTop: `1px solid ${C.paperDark}`, margin: 'clamp(16px,2vw,24px) 0' }}>
      <span style={{ fontFamily: SANS, fontSize: '10px', fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase', color: C.inkFaint,
        marginRight: '8px', alignSelf: 'center' }}>Jump to:</span>
      {TOC_SECTIONS.map(s => (
        <a key={s.id} href={`#${s.id}`}
          style={{ fontFamily: SANS, fontSize: '11px', fontWeight: active === s.id ? 800 : 500,
            color: active === s.id ? s.color : C.inkDim,
            textDecoration: 'none', padding: '3px 10px',
            background: active === s.id ? C.paperWarm : 'transparent',
            border: `1px solid ${active === s.id ? s.color : C.paperDark}`,
            borderRadius: '2px', transition: 'all 0.2s ease' }}>
          {s.label}
        </a>
      ))}
    </nav>
  );
}

// ─── Product Commit Card ───────────────────────────────────────────────────
function CommitCard({ tag, title, desc, type }: { tag: string; title: string; desc: string; type: 'feat' | 'fix' | 'perf' }) {
  const tagColors = {
    feat: { bg: C.product.bg, border: C.product.line, text: C.product.line, icon: '✨' },
    fix:  { bg: '#fff8f0',    border: '#b45309',        text: '#b45309',       icon: '🛠️' },
    perf: { bg: '#f0fdf6',    border: C.partners.line,  text: C.partners.line, icon: '⚡' },
  };
  const tc = tagColors[type];
  return (
    <div style={{ borderTop: `1px solid ${C.paperDark}`, paddingTop: '14px', paddingBottom: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>{tc.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontFamily: MONO, fontSize: '10px', fontWeight: 700,
              color: tc.text, background: tc.bg, border: `1px solid ${tc.border}`,
              padding: '1px 6px', borderRadius: '2px', letterSpacing: '0.06em',
              textTransform: 'uppercase' }}>{tag}</span>
          </div>
          <p style={{ fontFamily: SERIF, fontSize: 'clamp(14px,1.8vw,16px)', fontWeight: 700,
            color: C.ink, margin: '0 0 4px 0', lineHeight: 1.3 }}>{title}</p>
          <p style={{ fontFamily: SERIF, fontSize: 'clamp(13px,1.6vw,15px)', color: C.inkMid,
            lineHeight: 1.6, margin: 0 }}>{desc}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Magazine ─────────────────────────────────────────────────────────
export default function KinshipMagazineIssue5() {
  return (
    <div style={{ background: C.paper, minHeight: '100dvh', color: C.ink, fontFamily: SERIF }}>

      {/* ── Masthead ── */}
      <div style={{ maxWidth: '900px', margin: '0 auto',
        padding: 'clamp(16px,4vw,40px) clamp(16px,5vw,32px) 0' }}>

        {/* Utility bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: SANS, fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: C.inkFaint, paddingBottom: '8px' }}>
          <span>The Kinship Intelligence Brief</span>
          <span>July 28 – August 1, 2026</span>
        </div>

        {/* Double rule */}
        <hr style={{ border: 'none', borderTop: `3px double ${C.ink}`, margin: '0 0 clamp(12px,2vw,20px) 0' }} />

        {/* Nameplate */}
        <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(32px,7vw,68px)', fontWeight: 700,
          textAlign: 'center', color: C.ink, margin: '0 0 8px 0', lineHeight: 1.05,
          letterSpacing: '-0.02em' }}>
          The Kinship New Wave
        </h1>
        <p style={{ fontFamily: SANS, fontSize: 'clamp(12px,1.5vw,14px)', textAlign: 'center',
          color: C.inkFaint, margin: '0 0 clamp(12px,2vw,20px) 0',
          letterSpacing: '0.04em' }}>
          Issue #5 · July 28 – August 1, 2026 · Produced by Hermes
        </p>

        {/* Thick rule + Lede bar */}
        <hr style={{ border: 'none', borderTop: `3px solid ${C.ink}`, margin: '0' }} />
        <div style={{ background: C.ink, color: C.paper, padding: 'clamp(12px,2vw,18px) clamp(16px,4vw,28px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <span style={{ fontSize: '18px' }}>🌊</span>
          <span style={{ fontFamily: SERIF, fontSize: 'clamp(13px,1.8vw,16px)', fontStyle: 'italic',
            lineHeight: 1.5, textAlign: 'center', maxWidth: '700px' }}>
            Andrew Ng launches LearnVector with $100M, three new Kinship team members arrive, and
            Activity Interventions becomes Signals — a big naming moment.
          </span>
        </div>
        <hr style={{ border: 'none', borderTop: `1px solid ${C.paperDark}`, margin: '0 0 clamp(14px,2vw,20px) 0' }} />

        {/* Stats bar */}
        <div style={{ display: 'flex', gap: 'clamp(20px,4vw,48px)', justifyContent: 'center',
          alignItems: 'flex-end', flexWrap: 'wrap', padding: 'clamp(10px,1.5vw,14px) 0' }}>
          {[
            { n: '42', label: 'channels swept' },
            { n: '159', label: 'messages read' },
            { n: '10', label: 'signals extracted' },
            { n: '18', label: 'brain entries logged' },
          ].map(s => (
            <div key={s.n} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: SANS, fontSize: 'clamp(22px,4vw,32px)', fontWeight: 800,
                color: C.accent, lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontFamily: SANS, fontSize: '10px', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: C.inkFaint, marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <hr style={{ border: 'none', borderTop: `1px solid ${C.paperDark}`, margin: '0' }} />

        {/* Table of Contents */}
        <TableOfContents />
      </div>

      {/* ─ Content wrapper ─ */}
      <div style={{ maxWidth: '900px', margin: '0 auto',
        padding: '0 clamp(16px,5vw,32px) clamp(32px,5vw,64px)' }}>

        {/* ────────────────────────────────────────────────────────── */}
        {/* 🤝 PARTNERS UPDATE */}
        {/* ────────────────────────────────────────────────────────── */}
        <section id="partners" style={{ scrollMarginTop: '80px', paddingTop: 'clamp(24px,4vw,40px)' }}>
          <SectionLabel emoji="🤝" title="Partners Update" color={C.partners.line} bg={C.partners.bg} />

          <div style={{ paddingTop: 'clamp(14px,2vw,20px)' }}>
            <SignalItem
              lineColor={C.partners.line}
              kicker="Pipeline Strategy"
              title="80/20 Private/Public Mix Proposed for 200-Pilot Goal"
              body="A detailed pilot-mix proposal is circulating — 160 private or independent-school pilots to 40 public — as the framework for reaching 200 pilots by September 2027. The thread drew 22 replies from across the leadership team, with discussion on international public targets (5 vs 10) and whether large school-group deals (Nord Anglia, Cognita, Inspired) should count as multipliers or separate headcount."
              sowhat="Partners team needs to ratify the 80/20 before outreach planning for September. Group-deal strategy (one yes = dozens of schools) is the leverage play worth accelerating."
              link="https://kinship-9xb4888.slack.com/archives/C0B9FHWR8RE"
            />

            <SignalItem
              lineColor={C.partners.line}
              kicker="Collateral"
              title="UCC Pilot Outcomes 1-Pager Now Live in Partner Resources"
              body="A polished 1-pager summarising UCC pilot outcomes — including student agency data and session frequency — was drafted, iterated with 9 replies of partner feedback, then published to Notion Partner Resources. A Canva version is also ready. The document intentionally omits pilot duration length to let the data speak first."
              sowhat="This is now the first real proof-of-value asset for pilots. Partners team should use it in every discovery call starting this week."
              link="https://kinship-9xb4888.slack.com/archives/C0B9FHWR8RE"
            />

            <SignalItem
              lineColor={C.partners.line}
              kicker="CRM & Ops"
              title="AI-First CRM Shortlist Forming — Attio, Clay, Monaco"
              body="Three AI-native CRM options were surfaced in team-partnerships this week: Attio, Clay, and Monaco (monaco.com). A mapping project identifying 670 private schools within 25 miles of Alpha School locations is underway — early signal that outbound prospecting is moving from manual to database-driven. The Notion pipeline schema has known structural issues that are blocking agent-based updates."
              sowhat="Partners ops tooling is at an inflection point. CRM decision should happen before September pilot surge, or Notion will continue to block pipeline agents."
            />

            <SignalItem
              lineColor={C.partners.line}
              kicker="Data Privacy"
              title="DPA Blocked on Vercel AI Gateway Config Check — Partners Urgently Need This"
              body="A data processing agreement (DPA) is stalled because Kinship hasn't confirmed that Vercel's AI gateway is configured for zero-data-retention routing. At least one school is waiting on DPA details. Legal review is also required before the DPA can be shared."
              sowhat="Engineering resolved this (KIN-95 shipped this week — zero-data-retention enforced). Partners should now unblock DPA conversations immediately. Legal still needs to clear the final copy before distribution."
              link="https://kinship-9xb4888.slack.com/archives/C04PPBBCKAB"
            />
          </div>
        </section>

        {/* ────────────────────────────────────────────────────────── */}
        {/* 🎯 PILOT SUCCESS */}
        {/* ────────────────────────────────────────────────────────── */}
        <section id="pilot" style={{ scrollMarginTop: '80px', paddingTop: 'clamp(24px,4vw,40px)' }}>
          <SectionLabel emoji="🎯" title="Pilot Success Update" color={C.pilot.line} bg={C.pilot.bg} />

          <div style={{ paddingTop: 'clamp(14px,2vw,20px)' }}>

            <SignalItem
              lineColor={C.pilot.line}
              kicker="RHA — August 12 Deadline"
              title="RHA Platform Credentials Needed Urgently — Three Vendors, One Week"
              body="Robins Hebrew Academy's pilot test is August 12. This week, three vendor accounts need to land in the team's hands before then: Lexia, MobyMax, and Rosetta Stone. Rosetta Stone responded and is moving forward for French; Hebrew instruction is still being evaluated by the school principal, who may bring an AI Hebrew solution of her own. A discovery meeting with RHA's marketing/communications team reviewed the draft parent letter — distribution is on hold until after the Aug 10 teacher training."
              sowhat="Pilot Success team: vendor credential timeline is the critical path. Rosetta is moving — Lexia and MobyMax need to close this week."
              link="https://kinship-9xb4888.slack.com/archives/C0B0Y7E55KJ"
            />

            <SignalItem
              lineColor={C.pilot.line}
              kicker="Greater Dayton — API Blocker"
              title="Greater Dayton Pre-Bought MA Licenses — API Access Path Unresolved"
              body="Greater Dayton School started ahead of schedule and purchased Math Academy licenses independently. The school has already created classes for teachers. Kinship now needs to determine whether MA will grant API access on their account or whether Kinship needs to be added as an admin — an ambiguous situation that Linear ticket KIN-118 is tracking. SSO is Clever + Google."
              sowhat="Engineering and Pilot Success need to co-own this one. The API access question blocks data visibility for the September 8th pilot launch."
              link="https://kinship-9xb4888.slack.com/archives/C0BHA1YPRMF"
            />

            <SignalItem
              lineColor={C.pilot.line}
              kicker="Product Alignment"
              title="Teacher Curriculum Maps: A New Onboarding Step Before Every Pilot"
              body="A concrete proposal emerged in #topic-product-feedback: before every pilot launches, someone should sit with the teacher to map their daily and weekly session schedule against Kinship's structure. This would help set weekly and daily goals per school — but it requires a school calendar (terms, holidays, PD days) that Kinship doesn't currently ingest. The new Head of Teacher Development (starting August 3) plans to own this workstream."
              sowhat="This is a scalable onboarding step that improves data quality and teacher confidence. New hire Melissa Randazzo is the right owner — pilot success team should hand it off to her in the first week."
            />

            <SignalItem
              lineColor={C.pilot.line}
              kicker="UTS — Discovery"
              title="UTS Discovery Call Complete — Thoughtful School, Careful Pace"
              body="A discovery call with UTS (University of Toronto Schools) took place this week. Follow-up messages show the school is well-considered — 'thoughtfully curating' their AI integration approach. Scheduling is being refined to a 1:1 format (January option removed)."
              sowhat="UTS is a signal-quality school, not a sprint school. Pilot Success should set expectations internally for a slower but potentially high-value onboarding."
            />

          </div>
        </section>

        {/* ────────────────────────────────────────────────────────── */}
        {/* ⚙️ PRODUCT UPDATE */}
        {/* ────────────────────────────────────────────────────────── */}
        <section id="product" style={{ scrollMarginTop: '80px', paddingTop: 'clamp(24px,4vw,40px)' }}>
          <SectionLabel emoji="⚙️" title="Product Update — What Shipped This Week" color={C.product.line} bg={C.product.bg} />

          <div style={{ paddingTop: 'clamp(14px,2vw,20px)' }}>

            {/* Subheader */}
            <p style={{ fontFamily: SERIF, fontSize: 'clamp(14px,1.8vw,16px)', color: C.inkDim,
              fontStyle: 'italic', margin: '0 0 clamp(14px,2vw,20px) 0', lineHeight: 1.6 }}>
              A significant product week — 20+ commits to <strong>Hearth</strong> spanning
              a major UI rethink, Math Academy API foundations, portfolio concepts, and infrastructure
              that makes the app meaningfully faster and more reliable.
            </p>

            {/* New Features */}
            <div style={{ marginBottom: 'clamp(16px,2.5vw,24px)' }}>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: '11px',
                letterSpacing: '0.12em', textTransform: 'uppercase', color: C.product.line,
                marginBottom: '4px', borderBottom: `2px solid ${C.product.line}`,
                paddingBottom: '4px' }}>
                ✨ New Features
              </div>

              <CommitCard
                tag="Hearth"
                type="feat"
                title="Activity Board is Now 'Signals + Students'"
                desc="The main teacher dashboard got a significant redesign. The formerly-named 'Interventions' feature is now called Signals — a name chosen to feel open-ended, neutral, and precise. The board is redesigned to reduce visual noise and foreground what a teacher needs to act on. Product and Pilot Success teams debated the name collaboratively this week; Signals won."
              />
              <CommitCard
                tag="Hearth"
                type="feat"
                title="Class Home Rebuilt as Three Windows over Three Signals"
                desc="The Class > Home screen is rebuilt around three distinct signal windows, giving teachers a cleaner, scannable overview of what's happening in their classroom at a glance."
              />
              <CommitCard
                tag="Hearth"
                type="feat"
                title="Math Academy API Integration: Foundation Laid"
                desc="The technical foundation for pulling live Math Academy data into Kinship is in place — client library, credential management, and a sync spine. This enables Kinship to surface MA progress data directly in teacher dashboards without manual exports."
              />
              <CommitCard
                tag="Hearth"
                type="feat"
                title="Portfolio Concepts Shipped: Whisper, Dossier, Student View, Receipts, Forecast"
                desc="A cluster of portfolio-level concepts shipped this week — including Whisper (lightweight signals), Dossier (student evidence archive), a dedicated Student View, Receipts loop (submitted-work tracking), and Forecast (projected trajectory). These move Kinship from 'current snapshot' to 'longitudinal learning record.'"
              />
              <CommitCard
                tag="Hearth"
                type="feat"
                title="New Lesson Blocks: Sort Into Groups, Find and Fix, Bloom Time Machine"
                desc="Three new lesson block types for teachers: Sort Into Groups (collaborative sorting activities), Find and Fix (error-correction exercises), and the Bloom Time Machine — a tool that mines edge-case evidence to push students toward harder thinking. Plus an edge-evidence miner as a standalone feature."
              />
              <CommitCard
                tag="Hearth"
                type="feat"
                title="Studio AI Inference Is Now Durable — With a Running-Inference Tray"
                desc="When the AI is working in the background to generate lesson content, teachers now see a persistent 'running inference' tray so they know exactly what's in progress. Previously, a slow model could silently fail or leave the teacher guessing."
              />
              <CommitCard
                tag="Hearth"
                type="feat"
                title="Teacher Usage Analytics Now Active (PostHog)"
                desc="Kinship now tracks how teachers actually use the product — which screens they visit, how long they spend in key flows, where they drop off. This is the foundation for data-driven product decisions based on real classroom behaviour, not assumptions."
              />
              <CommitCard
                tag="Hearth"
                type="feat"
                title="New Classrooms Default to Math + Math Academy"
                desc="When a teacher creates a new classroom, it now defaults to Math + Math Academy as the subject configuration. This reflects where all current pilot schools are focused and reduces setup friction."
              />
              <CommitCard
                tag="Hearth"
                type="feat"
                title="Zero-Data-Retention Enforced on Every AI Gateway Call (KIN-95)"
                desc="Every call routed through the Vercel AI gateway is now confirmed to use zero-data-retention mode. This unblocks the DPA that Partners have been waiting on."
              />
            </div>

            {/* Bug Fixes */}
            <div>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: '11px',
                letterSpacing: '0.12em', textTransform: 'uppercase', color: '#b45309',
                marginBottom: '4px', borderBottom: `2px solid #b45309`, paddingBottom: '4px' }}>
                🛠️ Fixes & Performance
              </div>
              <CommitCard
                tag="Hearth"
                type="fix"
                title="Sidebar No Longer Prefetches Every Route on Every Navigation"
                desc="The sidebar was triggering a full route prefetch on every navigation event — slowing down page loads across the app. Fixed: only the current route is loaded."
              />
              <CommitCard
                tag="Hearth"
                type="perf"
                title="Mastery Rollup Is Now Incremental — Much Faster Loading"
                desc="The teacher mastery view used to recalculate everything from scratch on every load. It's now incremental, meaning only new data is processed. The improvement is significant for classrooms with long histories."
              />
              <CommitCard
                tag="Hearth"
                type="fix"
                title="PDF Parsing Upgraded to Mistral OCR 4"
                desc="Document uploads in Hearth now use Mistral OCR 4 for PDF parsing — more accurate text extraction from student work and curriculum materials."
              />
            </div>

          </div>
        </section>

        {/* ────────────────────────────────────────────────────────── */}
        {/* 🔭 TOPICS */}
        {/* ────────────────────────────────────────────────────────── */}
        <section id="topics" style={{ scrollMarginTop: '80px', paddingTop: 'clamp(24px,4vw,40px)' }}>
          <SectionLabel emoji="🔭" title="Topics Worth Watching" color={C.topics.line} bg={C.topics.bg} />

          <div style={{ paddingTop: 'clamp(14px,2vw,20px)' }}>

            {/* Deep Dive: LearnVector */}
            <div style={{ marginBottom: 'clamp(20px,3vw,32px)' }}>
              <Kicker color={C.topics.line}>Competitive Intel — Deep Dive</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(20px,3.5vw,28px)', fontWeight: 700,
                color: C.ink, margin: '0 0 16px 0', lineHeight: 1.2 }}>
                Andrew Ng Launches LearnVector with $100M — Direct Signal
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))',
                gap: 'clamp(16px,2.5vw,24px)', marginBottom: 'clamp(16px,2vw,24px)' }}>

                {[
                  {
                    label: 'What is it?',
                    content: 'LearnVector is a new AI company founded by Andrew Ng (Coursera, deeplearning.ai, Google Brain) launching with a $100M investment from Coursera. Announced July 28, 2026. Products expected "by early 2027." They\'re hiring AI Engineers, Learning Engineers, and Learning Scientists right now.'
                  },
                  {
                    label: 'What does it do?',
                    content: 'Builds "trustworthy one-to-one learning guides" — AI tutors that plan a path, adapt to how you learn, and stay with you until you\'ve mastered new skills. Explicitly contrasts with raw chatbots: cites research that chatbots without guardrails harm learning through cognitive offloading. Starts from Coursera\'s content library.'
                  },
                  {
                    label: 'What does the internet say?',
                    content: 'The announcement drew 840K+ views in 72 hours. Ed-tech community is divided: some see it as validation that AI tutoring is the next frontier, others note Ng\'s own research warns chatbots harm learning — and wonder if "guardrails" is enough of a differentiator from Khan\'s Khanmigo or Duolingo Max. Higher-ed focus appears likely, given Coursera\'s audience.'
                  },
                  {
                    label: 'What it means for Kinship?',
                    content: 'LearnVector is going after adult/higher-ed learners with a content-library model. Kinship\'s terrain — K-12 precision learning inside a school\'s existing curriculum — is distinct. But Ng\'s "chatbots harm learning" framing aligns exactly with Kinship\'s thesis. The team should watch for: (1) K-12 pivot signals, (2) school district partnerships, (3) whether "trustworthy" becomes the sector\'s new battleground word.'
                  },
                ].map(card => (
                  <div key={card.label} style={{ borderTop: `2px solid ${C.topics.line}`,
                    paddingTop: '12px' }}>
                    <div style={{ fontFamily: SANS, fontSize: '10px', fontWeight: 800,
                      letterSpacing: '0.1em', textTransform: 'uppercase', color: C.topics.line,
                      marginBottom: '6px' }}>{card.label}</div>
                    <p style={{ fontFamily: SERIF, fontSize: 'clamp(13px,1.6vw,15px)', color: C.inkMid,
                      lineHeight: 1.65, margin: 0 }}>{card.content}</p>
                  </div>
                ))}
              </div>

              <div style={{ background: C.accentFaint, padding: 'clamp(10px,1.5vw,14px) clamp(12px,2vw,18px)',
                borderLeft: `3px solid ${C.accent}` }}>
                <span style={{ fontFamily: SANS, fontSize: '11px', fontWeight: 700,
                  color: C.accent, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Quick take: </span>
                <span style={{ fontFamily: SERIF, fontSize: 'clamp(13px,1.6vw,15px)', color: C.inkMid }}>
                  Ng validated your entire thesis in one announcement. The same week you renamed Interventions to Signals,
                  the world's most-followed AI educator said chatbots harm learning and guardrails are the product.
                  That's alignment, not competition.
                </span>
              </div>
              <div style={{ marginTop: '10px' }}>
                <ThreadLink href="https://learnvector.ai" label="↗ learnvector.ai" />
                {' '}<span style={{ fontFamily: MONO, fontSize: '11px', color: C.inkFaint }}>·</span>{' '}
                <ThreadLink href="https://x.com/AndrewYNg/status/2082199333920027009" label="↗ announcement thread" />
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: `1px solid ${C.paperDark}`, margin: 'clamp(16px,2.5vw,24px) 0' }} />

            {/* Deep Dive 2: Brain/Hermes usage debate */}
            <div style={{ marginBottom: 'clamp(20px,3vw,32px)' }}>
              <Kicker color={C.topics.line}>Internal Signal — High Engagement (11 replies)</Kicker>
              <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(18px,2.8vw,22px)', fontWeight: 700,
                color: C.ink, margin: '0 0 10px 0', lineHeight: 1.3 }}>
                "Is Anyone Using Brain/Hermes in Interesting Ways?" — The Question the Team Asked Itself
              </h3>
              <p style={{ fontFamily: SERIF, fontSize: 'clamp(14px,1.8vw,16px)', color: C.inkMid,
                lineHeight: 1.65, margin: '0 0 10px 0' }}>
                The honest question surfaced in #topic-brain-context this week: some team members are still defaulting to
                ChatGPT or Claude desktop for most workflows. The thread revealed a clear usage split — some use Hermes/Claude
                as a hub with skills (brain, presentations, briefings), others haven't adopted it at all. A separate thread
                noted that Claude was writing incorrectly into Notion because the database schema is stale, and that the
                Kinship Ontology — a new foundational document — needs the team's attention before the CRM migration.
              </p>
              <p style={{ fontFamily: SERIF, fontSize: 'clamp(14px,1.8vw,16px)', color: C.inkMid,
                lineHeight: 1.65, margin: '0 0 10px 0' }}>
                An AI-native GTM stack post by Chris Pisarski (shared in #topic-collective-intelligence and #topic-brain-context)
                sparked a 4-reply discussion on building Hermes-powered sales workflows — Azim had Hermes build a research
                explainer deck on the same thread in real time.
              </p>
              <SoWhat>The Kinship Ontology page is live — before the CRM migration, the team should review it. The brain adoption gap is real: the scheduled AI Chats session this week (with Brain updates + product demo) is exactly the right venue to close it.</SoWhat>
              <div style={{ marginTop: '8px' }}>
                <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0ANK3CJM8V" label="↗ brain-context thread" />
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: `1px solid ${C.paperDark}`, margin: 'clamp(16px,2.5vw,24px) 0' }} />

            {/* Also this week */}
            <div>
              <Kicker color={C.topics.line}>Also This Week</Kicker>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                gap: 'clamp(12px,2vw,18px)' }}>
                {[
                  {
                    ch: '#topic-edtech',
                    title: 'Pangram 4 AI Detector Launched',
                    body: 'Pangram released their 4th-generation AI content detector, claiming 99.98% accuracy. One team member noted increasing skepticism of AI detection tools, citing Amanda Bickerstaff (AI + Education) on false positives. Kinship isn\'t building detection — but its presence signals growing school anxiety about AI-written student work.'
                  },
                  {
                    ch: '#topic-tooling',
                    title: 'Fish Audio: Voice Interface Demo',
                    body: 'A Fish Audio voice synthesis demo was shared — elegant voice/UX approach noted in a reply. Filed as a watch item for future Kinship voice interfaces in lesson interactions.'
                  },
                  {
                    ch: '#topic-collective-intelligence',
                    title: 'Rebecca Winthrop: 3-for-1 Learning Framework',
                    body: 'Brookings senior fellow Rebecca Winthrop published a new post on combining academics, career skills, and AI literacy — framed as "education\'s new 3-for-1." Relevant to how Kinship articulates its value beyond test scores.'
                  },
                  {
                    ch: '#topic-learning-science',
                    title: 'MAP Assessment — Political Dimension',
                    body: 'An X post about MAP and "gender ideology" in curriculum raised questions in the team. One team member with pilot school experience noted complaints came from curriculum content, not MAP itself. Worth monitoring as pilot schools may have views on assessment neutrality.'
                  },
                ].map(item => (
                  <div key={item.title} style={{ borderTop: `1px solid ${C.paperDark}`, paddingTop: '12px' }}>
                    <div style={{ fontFamily: MONO, fontSize: '11px', color: C.inkFaint, marginBottom: '4px' }}>
                      {item.ch}
                    </div>
                    <h4 style={{ fontFamily: SERIF, fontSize: 'clamp(14px,1.8vw,16px)', fontWeight: 700,
                      color: C.ink, margin: '0 0 6px 0', lineHeight: 1.3 }}>{item.title}</h4>
                    <p style={{ fontFamily: SERIF, fontSize: 'clamp(13px,1.5vw,14px)', color: C.inkMid,
                      lineHeight: 1.6, margin: 0 }}>{item.body}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ────────────────────────────────────────────────────────── */}
        {/* 🧠 BRAIN CONTRIBUTORS */}
        {/* ────────────────────────────────────────────────────────── */}
        <section id="brain" style={{ scrollMarginTop: '80px', paddingTop: 'clamp(24px,4vw,40px)' }}>
          <SectionLabel emoji="🧠" title="Brain Contributors" color={C.brain.line} bg={C.brain.bg} />

          <div style={{ paddingTop: 'clamp(14px,2vw,20px)' }}>

            {/* Team welcome banner */}
            <div style={{ background: C.paperWarm, border: `1px solid ${C.paperDark}`,
              borderTop: `3px solid ${C.accent}`, padding: 'clamp(14px,2vw,20px)',
              marginBottom: 'clamp(16px,2.5vw,24px)' }}>
              <Kicker>New This Week</Kicker>
              <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(18px,2.5vw,22px)', fontWeight: 700,
                color: C.ink, margin: '0 0 10px 0', lineHeight: 1.3 }}>
                Three New Team Members Join Kinship 🎉
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
                gap: 'clamp(10px,1.5vw,14px)' }}>
                {[
                  {
                    name: 'Melissa Randazzo',
                    title: 'Head of Teacher Development & Research',
                    start: 'August 3rd',
                    note: 'Joins from a rich ed background — already deeply aligned with Kinship\'s teacher-first philosophy.'
                  },
                  {
                    name: 'Reinier Lakhan',
                    title: 'Software Engineer',
                    start: 'August 10th',
                    note: 'Former Connected colleague of Mike\'s — described as "a consummate teacher and learner."'
                  },
                  {
                    name: 'Paul Sobocinski',
                    title: 'Software Engineer',
                    start: 'August 10th',
                    note: 'Also from Connected — same cohort, same endorsement. Two strong engineers arriving the same week.'
                  },
                ].map(p => (
                  <div key={p.name} style={{ borderTop: `1px solid ${C.paperDark}`, paddingTop: '12px' }}>
                    <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: '13px',
                      color: C.ink, marginBottom: '2px' }}>{p.name}</div>
                    <div style={{ fontFamily: SANS, fontSize: '11px', color: C.accent,
                      marginBottom: '6px' }}>{p.title}</div>
                    <div style={{ fontFamily: MONO, fontSize: '10px', color: C.inkFaint,
                      marginBottom: '6px' }}>Starts {p.start}</div>
                    <p style={{ fontFamily: SERIF, fontSize: 'clamp(12px,1.5vw,13px)', color: C.inkMid,
                      lineHeight: 1.6, margin: 0 }}>{p.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Brain entries this week */}
            <div>
              <Kicker color={C.brain.line}>Auto-Logged Via Kinship Workflows Bot</Kicker>
              <p style={{ fontFamily: SERIF, fontSize: 'clamp(13px,1.6vw,15px)', color: C.inkMid,
                lineHeight: 1.65, margin: '0 0 12px 0' }}>
                No manual human contributions to the Brain this week — all 18 entries were auto-logged by the
                Cog workflows bot from Google Meet transcripts. The Brain is working quietly in the background.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {[
                  'Weekly all-hands', 'Colegio Interamericano — Follow up', 'Prod Eng Daily Standup (×3)',
                  'Michael / Thomas — Intro', 'Claire & kinship call', 'William / Thomas — Intro',
                  '(internal) RHA expansion / board prep', 'Lydia ↔ Mike', 'Hearth/Horizon feedback',
                  'Maggie / Thomas — Intro', 'Melissa — Thomas, Intro', 'kinship/TDSB Math Pilot Check In',
                  'CRM discussion', 'Pilot Success Sync', 'Bi-weekly AI Chats', '30 min with Azim (Brenda Montgomery)',
                  'Weekly Pipeline Review', 'Azim / Thomas, Sync + Orient'
                ].map(entry => (
                  <span key={entry} style={{ fontFamily: MONO, fontSize: '11px', color: C.inkDim,
                    background: C.paperWarm, border: `1px solid ${C.paperDark}`, borderRadius: '2px',
                    padding: '3px 8px' }}>{entry}</span>
                ))}
              </div>
              <p style={{ fontFamily: SANS, fontSize: '11px', color: C.inkFaint, marginTop: '12px',
                fontStyle: 'italic' }}>
                No manual entries this week — be the first next week!
                Drop a transcript, meeting note, or insight into <span style={{ fontFamily: MONO }}>#brain-changelog</span>.
              </p>
            </div>

          </div>
        </section>

        {/* ────────────────────────────────────────────────────────── */}
        {/* FOOTER */}
        {/* ────────────────────────────────────────────────────────── */}
        <footer style={{ marginTop: 'clamp(32px,5vw,52px)', paddingTop: 'clamp(16px,2.5vw,24px)',
          borderTop: `3px double ${C.ink}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: 'clamp(16px,2.5vw,24px)', marginBottom: 'clamp(14px,2vw,20px)' }}>
            <div>
              <div style={{ fontFamily: SANS, fontSize: '10px', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase', color: C.inkFaint,
                marginBottom: '6px' }}>Hottest Thread</div>
              <p style={{ fontFamily: SERIF, fontSize: 'clamp(13px,1.6vw,15px)', color: C.inkMid,
                lineHeight: 1.6, margin: 0 }}>
                <strong>80/20 pilot mix strategy</strong> in{' '}
                <span style={{ fontFamily: MONO }}>#team-partnerships</span>{' '}
                — 22 replies, leadership-wide debate on private vs public school ratio for September 2027 goal.{' '}
                <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0B9FHWR8RE" />
              </p>
            </div>
            <div>
              <div style={{ fontFamily: SANS, fontSize: '10px', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase', color: C.inkFaint,
                marginBottom: '6px' }}>This Issue</div>
              <p style={{ fontFamily: MONO, fontSize: '12px', color: C.inkDim, lineHeight: 1.8, margin: 0 }}>
                Issue #5 · July 28 – August 1, 2026<br />
                42 channels swept · 159 messages read<br />
                10 signals extracted · 18 brain entries
              </p>
            </div>
            <div>
              <div style={{ fontFamily: SANS, fontSize: '10px', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase', color: C.inkFaint,
                marginBottom: '6px' }}>Signal Note</div>
              <p style={{ fontFamily: SERIF, fontSize: 'clamp(12px,1.5vw,13px)', color: C.inkFaint,
                lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                All private school pilot channels (space-*) are excluded per policy.
                Brain entries this week: 18 auto-logged via Cog, 0 manual contributions.
                Produced by Hermes every Friday at 5pm EST.
              </p>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${C.paperDark}`, paddingTop: '12px',
            display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontFamily: MONO, fontSize: '11px', color: C.inkFaint }}>
              The Kinship New Wave · Issue #5
            </span>
            <span style={{ fontFamily: MONO, fontSize: '11px', color: C.inkFaint }}>
              quick.buildkinship.dev/artifact/yKvElerZz0MVyrGV7DZU
            </span>
          </div>
        </footer>

      </div>
    </div>
  );
}
