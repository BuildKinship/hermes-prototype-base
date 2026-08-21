'use client';
// needed for IntersectionObserver TOC, scroll interactions, and useState

import React, { useState, useEffect } from 'react';

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
};

const SERIF = "'Georgia', 'Times New Roman', serif";
const SANS  = "'Inter', 'Helvetica Neue', Arial, sans-serif";
const MONO  = "'IBM Plex Mono', 'Courier New', monospace";

const rule: React.CSSProperties = { border: 'none', borderTop: `1px solid ${C.paperDark}`, margin: '0' };
const ruleThick: React.CSSProperties = { border: 'none', borderTop: `3px solid ${C.ink}`, margin: '0' };
const ruleDouble: React.CSSProperties = { border: 'none', borderTop: `3px double ${C.ink}`, margin: '0' };

const TOC_ITEMS = [
  { id: 'partners',  emoji: '🤝', label: 'Partners',        color: C.partners.line },
  { id: 'pilot',     emoji: '🎯', label: 'Pilot Success',   color: C.pilot.line    },
  { id: 'product',   emoji: '⚙️',  label: 'Product Update', color: C.product.line  },
  { id: 'topics',    emoji: '🔭', label: 'Topics',          color: C.topics.line   },
];

function TableOfContents() {
  const [activeId, setActiveId] = useState('');
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveId(e.target.id); }),
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );
    TOC_ITEMS.forEach(({ id }) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return (
    <nav style={{ borderTop: `1px solid ${C.paperDark}`, borderBottom: `1px solid ${C.paperDark}`, padding: 'clamp(12px,2vw,16px) 0', marginBottom: 'clamp(24px,4vw,36px)' }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: C.inkFaint, marginBottom: '10px' }}>In this issue</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 0', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {TOC_ITEMS.map((item, i) => (
          <React.Fragment key={item.id}>
            <button onClick={() => scrollTo(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', fontFamily: SANS, fontSize: 'clamp(12px,1.8vw,13px)', fontWeight: activeId === item.id ? 700 : 400, color: activeId === item.id ? item.color : C.inkMid, whiteSpace: 'nowrap', transition: 'color 0.15s', textDecoration: activeId === item.id ? 'underline' : 'none', textUnderlineOffset: '3px' }}>
              {item.emoji} {item.label}
            </button>
            {i < TOC_ITEMS.length - 1 && <span style={{ fontFamily: SANS, color: C.inkFaint, fontSize: '12px', padding: '4px 10px', userSelect: 'none' }}>·</span>}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}

function Kicker({ children, color = C.accent }: { children: React.ReactNode; color?: string }) {
  return <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color, marginBottom: '6px' }}>{children}</div>;
}

function SoWhat({ text }: { text: string }) {
  return (
    <div style={{ borderTop: `1px solid ${C.paperDark}`, paddingTop: '10px', marginTop: '10px', fontFamily: SANS, fontSize: '12px', color: C.inkDim, lineHeight: 1.55 }}>
      <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.accent, marginRight: '6px' }}>So what?</span>
      {text}
    </div>
  );
}

function ThreadLink({ href, color = C.accent }: { href: string; color?: string }) {
  return <a href={href} target="_blank" rel="noreferrer" style={{ fontFamily: MONO, fontSize: '10px', color, textDecoration: 'none', opacity: 0.8 }}>↗ thread</a>;
}

function SectionLabel({ id, emoji, title, color, bg }: { id: string; emoji: string; title: string; color: string; bg: string }) {
  return (
    <div id={id} style={{ marginBottom: '0', scrollMarginTop: '80px' }}>
      <hr style={ruleThick} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: bg, padding: '12px 20px', borderBottom: `1px solid ${C.paperDark}` }}>
        <span style={{ fontSize: '18px' }}>{emoji}</span>
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color }}>{title}</span>
      </div>
    </div>
  );
}

function StoryItem({ kicker, kickerColor, headline, body, link, soWhat }: {
  kicker: string; kickerColor: string; headline: string; body: string; link?: string; soWhat?: string;
}) {
  return (
    <div style={{ borderTop: `1px solid ${C.paperDark}`, paddingTop: '16px', paddingBottom: '4px' }}>
      <Kicker color={kickerColor}>{kicker}</Kicker>
      <div style={{ fontFamily: SERIF, fontSize: 'clamp(15px,2.2vw,18px)', fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: '8px' }}>{headline}</div>
      <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, marginBottom: '6px' }}>{body}</div>
      {link && <ThreadLink href={link} color={kickerColor} />}
      {soWhat && <SoWhat text={soWhat} />}
    </div>
  );
}

function ProductItem({ emoji, label, scope, headline, body }: {
  emoji: string; label: string; scope: string; headline: string; body: string;
}) {
  return (
    <div style={{ borderTop: `2px solid ${C.product.line}`, paddingTop: '14px', paddingBottom: '4px' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
        <span style={{ fontSize: '20px', lineHeight: 1, flexShrink: 0 }}>{emoji}</span>
        <div>
          <Kicker color={C.product.line}>{label} · {scope}</Kicker>
          <div style={{ fontFamily: SERIF, fontSize: '16px', fontWeight: 700, color: C.ink, lineHeight: 1.3 }}>{headline}</div>
        </div>
      </div>
      <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>{body}</div>
    </div>
  );
}

export default function KinshipMagazineIssue8() {
  return (
    <div style={{ background: C.paper, minHeight: '100dvh', color: C.ink }}>
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 clamp(16px,5vw,32px) clamp(40px,6vw,64px)' }}>

        {/* Masthead */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'clamp(16px,3vw,24px) 0 8px', fontFamily: MONO, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.inkFaint }}>
          <span>The Kinship Intelligence Brief</span>
          <span>Aug 18–22, 2026</span>
        </div>
        <hr style={ruleDouble} />
        <div style={{ textAlign: 'center', padding: 'clamp(16px,3vw,28px) 0 8px' }}>
          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(32px,7vw,66px)', fontWeight: 700, color: C.ink, margin: '0 0 10px', lineHeight: 1.05 }}>
            The Kinship Fall Countdown Issue
          </h1>
          <div style={{ fontFamily: SANS, fontSize: '14px', color: C.inkFaint }}>Issue #8 · Aug 18–22, 2026 · Produced by Hermes</div>
        </div>
        <hr style={ruleThick} />

        {/* Lede bar */}
        <div style={{ background: C.ink, color: C.paper, padding: 'clamp(14px,2.5vw,20px) clamp(20px,3vw,32px)', textAlign: 'center', margin: '0' }}>
          <div style={{ fontFamily: SERIF, fontSize: 'clamp(14px,2.2vw,18px)', fontStyle: 'italic', lineHeight: 1.55 }}>
            IMG Academy commits to a Jan 2027 pilot — the most recognized sports brand in private education just joined the pipeline.
          </div>
        </div>
        <hr style={rule} />

        {/* Stats bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(24px,5vw,60px)', padding: 'clamp(18px,3vw,28px) 0', flexWrap: 'wrap' }}>
          {[
            { n: '43', label: 'channels swept' },
            { n: '112', label: 'messages read' },
            { n: '8', label: 'signals extracted' },
          ].map(({ n, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: SERIF, fontSize: 'clamp(28px,5vw,40px)', fontWeight: 700, color: C.accent, lineHeight: 1 }}>{n}</div>
              <div style={{ fontFamily: SANS, fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.inkFaint, marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Table of Contents */}
        <TableOfContents />

        {/* ─── PARTNERS ─── */}
        <div style={{ marginTop: 'clamp(8px,2vw,16px)' }}>
          <SectionLabel id="partners" emoji="🤝" title="Partners Update" color={C.partners.line} bg={C.partners.bg} />
        </div>

        <div style={{ padding: 'clamp(16px,3vw,24px) 0 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'clamp(16px,2.5vw,24px)' }}>

          <StoryItem
            kicker="Sports Academy · New Commitment"
            kickerColor={C.partners.line}
            headline="IMG Academy commits — the most recognized sports academy in the US enters the pipeline"
            body="The flagship prep school and sports brand under Nord Anglia/EQT gave all-but-a-formal verbal commit for a Jan 2027 pilot this week, following a call with the Head of the Sports Academy program. This is Kinship's highest-profile prospective partner to date."
            link="https://kinship-9xb4888.slack.com/archives/C0B6Z4MFA3X/p1787001570075729"
            soWhat="Partners team to convert the verbal to a signed LOI before end of September. A Jan 2027 start date means roster intake and Tally onboarding need to be scoped now."
          />

          <StoryItem
            kicker="Meadowbrook School · Double Close"
            kickerColor={C.partners.line}
            headline="Meadowbrook Head of School closes a second pilot — Sports Academy model on top of Fall 2027"
            body="Jim Pierce committed to a Jan 2027 independent pilot in addition to the previously discussed Fall 2027 sports-model pilot. A double close from the same school leader in one call."
            link="https://kinship-9xb4888.slack.com/archives/C0B6Z4MFA3X/p1787001570075729"
            soWhat="Two entry points at Meadowbrook gives Kinship redundancy if one timeline slips. Partners to confirm scope of Jan pilot vs. Fall model."
          />

          <StoryItem
            kicker="UCC · Aug 24 In-Person Meetings"
            kickerColor={C.partners.line}
            headline="Two UCC in-person meetings locked for Monday — VP Academic Innovation, VP Advancement, and Head of Upper School"
            body="Senior stakeholder alignment at Upper Canada College on Monday, Aug 24. Two back-to-back sessions with key champions. A PhysicsGraph (IB/AP math) partnership exploration is also on the agenda alongside the pilot planning session."
            link="https://kinship-9xb4888.slack.com/archives/C0B9FHWR8RE/p1787153214534659"
            soWhat="UCC represents Kinship's highest-prestige Toronto school relationship. Pilot Success team should have partner guide materials and demo credentials ready for both sessions."
          />

          <StoryItem
            kicker="Pipeline Ops · Reporting Overhaul"
            kickerColor={C.partners.line}
            headline="Weekly pipeline reporting process rebuilt — numbers-first Monday structure and walkthrough recording shipped"
            body="Nadim and Dan restructured how pipeline reporting works, with a new spreadsheet format and a screen recording walkthrough. Mondays now open with the week-over-week numbers and trajectory toward 100 schools before going partner by partner."
            soWhat="This is the operational scaffolding needed to hit the 200-school goal. Making numbers primary creates accountability that the team needs as pilots scale."
          />

          <StoryItem
            kicker="Parent Portal · Cross-Pilot Signal"
            kickerColor={C.partners.line}
            headline="RHA parent portal (due Sept 22) triggers broader conversation — Mulgrave, Rosseau, and York next"
            body="RHA is unique in replacing fill curriculum and integrating life skills — parents need more communication infrastructure. Maggie is having parent comms conversations with York, Mulgrave, and Rosseau next week. Materials from RHA will seed those discussions."
            soWhat="Pilot Success to build reusable parent FAQ template from RHA materials before the Aug 24 school calls."
          />

          <StoryItem
            kicker="Fairfield · Stanstead · LFG"
            kickerColor={C.partners.line}
            headline="Stanstead pilot design meeting completed — Fairfield and LFG Academy in active discussion"
            body="Brain logged a Pilot Design Meeting with Stanstead this week alongside intro calls with Fairfield (Rinat) and LFG Academy (Ignacio Garza). Stanstead requested access to the Math Academy diagnostic to share with stakeholders ahead of next steps."
            soWhat="Pilot Success can show Stanstead the student-facing diagnostic via Amara demo account. Lindsey to prepare for follow-up call."
          />
        </div>

        {/* ─── PILOT SUCCESS ─── */}
        <div style={{ marginTop: 'clamp(32px,5vw,52px)' }}>
          <SectionLabel id="pilot" emoji="🎯" title="Pilot Success Update" color={C.pilot.line} bg={C.pilot.bg} />
        </div>

        <div style={{ padding: 'clamp(16px,3vw,24px) 0 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'clamp(16px,2.5vw,24px)' }}>

          <StoryItem
            kicker="Fall Readiness · Sept 8 Countdown"
            kickerColor={C.pilot.line}
            headline="Roster intake, MAP accounts, and Horizon set-up: the 3-week waterfall starts now"
            body="First pilots launch Sept 8. Brittany mapped the intake timeline: roster collection by late August (two-week buffer), then MAP accounts, Horizon accounts, and campus setup in sequence. Eng confirmed existing tooling can handle roster import without new engineering work."
            soWhat="Pilot Success to coordinate with engineering on the roster walkthrough video. All school contacts should receive intake instructions by Aug 25."
          />

          <StoryItem
            kicker="NWEA MAP · Training + Browser Decision"
            kickerColor={C.pilot.line}
            headline="MAP training completed — secure browser debate resolved: opt-in for managed fleets, regular Chrome fallback"
            body="The team completed MAP training with Mesha this week. Thomas's research advocates making NWEA's secure browser the default for managed Chromebook fleets — NWEA's own recommendation is 'recommended, not required.' Chrome version 143+ compatibility confirmed for all school hardware."
            link="https://kinship-9xb4888.slack.com/archives/C0BCBAJFBPC/p1787160977742899"
            soWhat="Pilot Success to update partner-facing comms to reflect secure browser guidance. Brittany to confirm with NWEA rep and pilot with 1-2 schools testing later in the MAP window."
          />

          <StoryItem
            kicker="RHA · Platform Access"
            kickerColor={C.pilot.line}
            headline="Rosetta Stone and Lexia licenses for RHA approaching resolution — Hebrew and JiTap apps still pending"
            body="Rosetta Stone admin access confirmed and handed to engineering. Lexia invoice received — Eos has it ready for payment. Dan chasing Claire on the Israeli Hebrew app and JiTap (Kinship needs only account credentials, not full licenses)."
            link="https://kinship-9xb4888.slack.com/archives/C0ANG4EMU3D/p1787082601580699"
            soWhat="Platform access needs to be complete before the Sept 8 launch. Lydia to pay Lexia invoice and track the Rosetta Stone credential delivery."
          />

          <StoryItem
            kicker="Ontario Grades 4–9 · Math Academy Courses"
            kickerColor={C.pilot.line}
            headline="Ontario curriculum content for Grades 4–9 now available or arriving this week from Math Academy"
            body="Jason at Math Academy confirmed: Grade 4–8 Ontario courses are live now. Grade 9 and both Grade 10 courses (Functions + Applications) expected by end of week. Tyler requesting test accounts to preview the curriculum before schools arrive."
            soWhat="Pilot Success to verify Ontario curriculum alignment before sharing with school partners as part of the pilot guide."
          />

          <StoryItem
            kicker="LCS · Curriculum Strategy"
            kickerColor={C.pilot.line}
            headline="LCS English offering triggers broader Lesson Builder conversation — Groupings and multi-platform scope on the table"
            body="LCS's English-language program needs raised a question about Kinship's curriculum builder strategy. Tyler flagged Groupings and the Lesson Builder as big unsolved features — engineering will build the underlying infrastructure first with a simplified first-pass UX."
            link="https://kinship-9xb4888.slack.com/archives/C0B9FHWR8RE/p1786973084128529"
            soWhat="This is a strategic feature gap for multi-language pilots. Engineering is building the foundation; Pilot Success should flag the expected timeline to LCS contacts."
          />

          <StoryItem
            kicker="Research · NWEA + U of T"
            kickerColor={C.pilot.line}
            headline="Research team scoping n=400 student cohort — Philip Oreopoulos (U of T) identified as external evaluation contact"
            body="Melissa noted the pilot cohort will be ~400 students — strong signal-to-noise ratio for research purposes. Philip Oreopoulos (Distinguished Professor, Economics of Education, U of T and Co-Chair for Education Evidence) identified as a potential external evaluator to engage before re-engaging OISE profs."
            soWhat="Research findings with a credentialed external evaluator give Kinship's partner conversations a data backbone. Melissa to set up a conversation with Azim and Alan before OISE engagement."
          />
        </div>

        {/* ─── PRODUCT UPDATE ─── */}
        <div style={{ marginTop: 'clamp(32px,5vw,52px)' }}>
          <SectionLabel id="product" emoji="⚙️" title="Product Update" color={C.product.line} bg={C.product.bg} />
        </div>

        <div style={{ padding: 'clamp(8px,2vw,16px) 0 0' }}>
          <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: 'clamp(13px,1.8vw,15px)', color: C.inkDim, marginBottom: 'clamp(16px,2.5vw,24px)' }}>What shipped this week — translated from commits to plain English.</div>

          <div style={{ marginBottom: 'clamp(20px,3vw,32px)' }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.product.line, marginBottom: '16px' }}>✨ New Features</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <ProductItem emoji="🎭" label="New Feature" scope="Hearth + Horizon" headline={"Lesson Emulator \u2014 teachers can now test-drive any lesson before students see it"} body={"Teachers can preview draft and published lessons exactly as students would experience them \u2014 no data saved, no side effects. The emulator includes condition knobs to explore how different student profiles would receive the content. Think of it as a flight simulator for lesson design."} />
              <ProductItem emoji="💙" label="New Feature" scope="Hearth" headline="K-SEL Reflection Bank — 96 social-emotional questions, now live in every session" body="End-of-session reflection questions are now drawn from a ratified 96-item K-SEL instrument developed with Melissa and Reinier. Questions rotate by domain and week, with class-wide General Interest days built in. Every answer is stored as anonymized signal data for the research cohort." />
              <ProductItem emoji="📊" label="New Feature" scope="Tally Extension" headline="MobyMax integration — live per-problem student data now tracked during MobyMax sessions" body="The Tally extension now streams real-time problem-level activity from MobyMax sessions into Kinship. Per-student read-aloud (text-to-speech) is also togglable. This is a major expansion of Kinship's multi-platform data capture for schools using MobyMax for reading and math." />
              <ProductItem emoji="📖" label="New Feature" scope="Tally Extension" headline="Lexia Core5 telemetry gaps closed — literacy platform data now complete" body="Missing student activity signals from Lexia Core5 sessions have been identified and closed. Kinship now has comprehensive telemetry for one of its core literacy partners — critical for the RHA and fall pilots using Lexia." />
              <ProductItem emoji="🔍" label="New Feature" scope="Hearth + Extension" headline="Math Academy school ID auto-detection — no more manual config step" body="The system now automatically identifies the correct Math Academy school account from API keys. This removes a manual setup step that was causing friction in pilot onboarding." />
              <ProductItem emoji="🔒" label="New Feature" scope="Tally Extension" headline="Math Academy settings lockdown — students stay in lessons, not settings" body="Students can no longer navigate into Math Academy account settings during a Kinship session. The extension enforces a clean return path back to lessons, preventing a common session disruption." />
              <ProductItem emoji="✏️" label="New Feature" scope="Hearth" headline="Plans now have human-readable names — and can be renamed" body="Lesson plans can now be given real names by teachers (and renamed later), not just system IDs. A small change with a large impact on teacher navigation and ownership." />
            </div>
          </div>

          <div style={{ marginBottom: 'clamp(20px,3vw,32px)' }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.product.line, marginBottom: '16px' }}>🛠️ Improvements</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <ProductItem emoji="🧪" label="Improvement" scope="Hearth + Horizon" headline="Learning science upgrades across vocabulary, anchor chains, fill-blank, and phase-aware tutoring" body="A wave of learning science implementation work landed: vocabulary formatting, anchor chains for connected concepts, just-in-time practice runs, closed-form fill-blank question serving, and phase-aware tutor posture in Horizon. Each change closes a gap between the learning-science research Kinship has studied and what the product actually delivers." />
              <ProductItem emoji="🛡️" label="Improvement" scope="Tally Extension" headline="Session companion shielded from stray taps and platform overlaps" body="The floating Tally companion sidebar is now protected from accidental taps and from being obscured by other platform UI elements during a session." />
              <ProductItem emoji="📱" label="Improvement" scope="Horizon" headline="Parent app: real practice examples, affirmation licence, and phase-held help" body="Horizon (the parent-facing app) now shows real practice examples instead of placeholder content. Affirmation messages are more controlled, and help surfaces appropriately for each learning phase rather than all at once." />
            </div>
          </div>

          <div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.product.line, marginBottom: '16px' }}>🐛 Bug Fixes</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <ProductItem emoji="⚡" label="Fix" scope="Hearth" headline="Publishing race condition, muted tutor, and inert demo mode — all closed" body="Three QA findings from the emulator were fixed: a race condition in lesson publishing, a state bug where the tutor could become silent, and a demo mode that wasn't responding to input." />
              <ProductItem emoji="📐" label="Fix" scope="Horizon" headline="Lesson column now centered correctly in the parent app" body="The lesson content column was pinned to the left edge of its card. It is now properly centered across all viewport sizes." />
              <ProductItem emoji="📋" label="Fix" scope="Hearth" headline="Needs-you queue counting fixed — dashboard count is now consistent" body="The count of items requiring teacher attention on the dashboard was computed differently in different places. Unified to a single source of truth." />
            </div>
          </div>

          <div style={{ marginTop: 'clamp(16px,2.5vw,24px)', background: C.accentFaint, borderTop: `2px solid ${C.accent}`, padding: 'clamp(12px,2vw,18px)', fontFamily: SANS, fontSize: '12px', color: C.inkDim, lineHeight: 1.55 }}>
            <strong style={{ color: C.ink, fontFamily: SANS }}>Feature priority thread from Tyler:</strong> Token/XP system, Tally session reliability, and roster intake are flagged as the highest priorities for the week ahead. Brittany and Melissa want a dedicated XP/tokens session — it still feels unclear to non-technical team members. Engineering is being asked to demo the roster intake process via Loom before school contacts receive instructions.
          </div>
        </div>

        {/* ─── TOPICS ─── */}
        <div style={{ marginTop: 'clamp(32px,5vw,52px)' }}>
          <SectionLabel id="topics" emoji="🔭" title="Topics Worth Watching" color={C.topics.line} bg={C.topics.bg} />
        </div>

        <div style={{ padding: 'clamp(16px,3vw,24px) 0 0', display: 'flex', flexDirection: 'column', gap: 'clamp(24px,4vw,40px)' }}>

          {/* Deep Dive #1 */}
          <div>
            <Kicker color={C.topics.line}>Deep Dive · US Dept of Education</Kicker>
            <div style={{ fontFamily: SERIF, fontSize: 'clamp(20px,3.5vw,28px)', fontWeight: 700, color: C.ink, lineHeight: 1.25, marginBottom: '12px' }}>The US DoE just told every edtech company to answer five questions</div>
            <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.7 }}>
              <p style={{ margin: '0 0 12px' }}>The U.S. Department of Education published new guidance this week on responsible AI use in classrooms. The guidance isn't binding policy — but it's a framework that schools and district procurement teams will use to evaluate vendors. Mike shared it in #topic-edtech; Maggie immediately applied it to Kinship via a Claude-assisted document.</p>
              <p style={{ margin: '0 0 12px' }}><strong>The five questions every edtech product should answer:</strong></p>
              <ol style={{ margin: '0 0 16px 20px', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  "What learning problem does it solve?",
                  "When should it be used — and when should it not be?",
                  "What evidence exists that it actually works?",
                  "How does it protect student data and privacy?",
                  "Who is accountable when something goes wrong?"
                ].map((q, i) => (
                  <li key={i} style={{ fontFamily: SANS, fontSize: '13px', color: C.ink }}><span style={{ color: C.accent, fontWeight: 700 }}>{i+1}.</span> {q}</li>
                ))}
              </ol>
              <p style={{ margin: '0 0 12px' }}><strong>What does it mean for Kinship?</strong> Kinship can already answer #1 (precision math acceleration), #4 (DPA in progress), and partially #3 (pilot data from UCC forming). Questions #2 and #5 are where the team should invest next. The "when not to use it" framing is actually a selling point — Kinship's model acknowledges teacher judgment remains essential, which most competitors don't lead with.</p>
              <div style={{ fontFamily: MONO, fontSize: '11px', color: C.inkFaint, marginTop: '8px' }}>Source: US DoE press release · <a href="https://www.ed.gov/about/news/press-release/us-department-of-education-releases-guidance-responsible-use-of-education-technology-classroom" target="_blank" rel="noreferrer" style={{ color: C.topics.line, textDecoration: 'none' }}>ed.gov ↗</a></div>
            </div>
          </div>

          <hr style={rule} />

          {/* Deep Dive #2 */}
          <div>
            <Kicker color={C.topics.line}>Deep Dive · Grok + AI Agents</Kicker>
            <div style={{ fontFamily: SERIF, fontSize: 'clamp(20px,3.5vw,28px)', fontWeight: 700, color: C.ink, lineHeight: 1.25, marginBottom: '12px' }}>Grok Build is getting attention from engineers — and the team wants access</div>
            <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.7 }}>
              <p style={{ margin: '0 0 12px' }}>Tyler and Paul flagged Grok Build this week in #topic-tooling. Paul described lower "complexity creep" compared to other models — meaning the model stays on-task for longer coding sessions without introducing unnecessary abstractions. Tyler noted parallels to OpenClaw/Hermes as personal hosted agent frameworks that the developer community is rallying around.</p>
              <p style={{ margin: '0 0 12px' }}><strong>What the team discussed:</strong> Paul suggested an OpenRouter account for model bake-offs — the ability to test Grok, Claude, and other models against the same task head-to-head. Tyler suggested trying it on the Superconductor project first. A Fable usage cap alert also surfaced — the team should clarify shared vs. individual usage credits.</p>
              <p style={{ margin: '0 0 12px' }}><strong>What it means for Kinship:</strong> Model selection for the in-product AI tutor matters. If Grok genuinely stays more coherent on extended reasoning tasks (tutoring a student through a multi-step problem), that's worth measuring. OpenRouter gives the team a low-cost way to run structured comparisons without committing to a provider switch.</p>
              <div style={{ fontFamily: MONO, fontSize: '11px', color: C.inkFaint, marginTop: '8px' }}>Discussed in <span style={{ fontFamily: MONO, color: C.topics.line }}>#topic-tooling</span></div>
            </div>
          </div>

          <hr style={rule} />

          {/* Also this week */}
          <div>
            <Kicker color={C.topics.line}>Also This Week</Kicker>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              <StoryItem
                kicker="Learning Science · Adaptive + Teacher Judgment"
                kickerColor={C.topics.line}
                headline="Why adaptive learning alone isn't enough — and why Kinship's model matters"
                body="Lindsey linked a piece about teacher judgment as the 'multiplicative effect' on top of adaptive learning — the teacher in the room is what converts the technology into student motivation and outcomes. This framing validates Kinship's hybrid positioning."
                soWhat="Worth building into the partner pitch narrative. Kinship isn't an AI tutor — it's an AI layer that amplifies teacher judgment."
              />

              <StoryItem
                kicker="Math Crisis · UC Berkeley"
                kickerColor={C.topics.line}
                headline="UC Berkeley's test-blind admissions now driving math skill gaps into freshman year"
                body={"SF Standard published an opinion piece: students entering UC Berkeley under test-blind admissions believe they are prepared, but many are not. Tyler followed up with a piece on Mission High dropout patterns from the same author. Brittany described it as depicting the true cost as students discovering their gaps in college — when it's hardest to close them."}
                soWhat={"This is Kinship's origin story playing out in public. The articles make the case for intervention at the K-12 level — the exact gap Kinship is built to close."}
              />

              <StoryItem
                kicker="EdTech Insiders · AI Tutoring"
                kickerColor={C.topics.line}
                headline="EdTech Insiders: the line between 'homework helper' and 'AI tutor' is becoming the industry's defining question"
                body="Brittany shared an EdTech Insiders piece this week distinguishing tools that do work for students from tools that help students learn to do work themselves. The piece frames it as the central product decision every edtech company is making right now."
                soWhat="Kinship's answer is unambiguous — but it's not in every sales conversation yet. Worth codifying this distinction in the pitch and the partner guide."
              />

              <StoryItem
                kicker="Alpha School Writing · Anti-Intellectual Strain"
                kickerColor={C.topics.line}
                headline="Natalie Wexler: AlphaWrite's approach reflects a 'troubling anti-intellectualism' baked into the Alpha model"
                body={"Tyler shared the Substack post; Brittany surfaced the key critique: AlphaWrite optimizes for output volume at the expense of depth and content knowledge. The best line was buried at the end — the piece suggests Alpha's writing approach may be producing fluent-sounding work without the thinking behind it."}
                soWhat={"As Kinship encounters Alpha comparisons in sales, this is a useful third-party critique to have in the back pocket. Kinship's learning model is explicitly content-knowledge-first."}
              />

              <StoryItem
                kicker="Brain Changelog · Workflow Break Fixed"
                kickerColor={C.topics.line}
                headline="Brain email password change broke meeting transcript workflow — now resolved"
                body="The Kinship Brain's meeting transcript posting to #brain-changelog was silently broken this week after a password change to the brain@buildkinship.com account. Azim identified and fixed it. 53 entries accumulated in the changelog from automated workflows despite the disruption."
                link="https://kinship-9xb4888.slack.com/archives/C0BA7AKA5K2/p1787064988293459"
                soWhat="Engineering should explore a monitoring alert for when brain-changelog posting stops. Silent failures in infrastructure are harder to catch than loud ones."
              />
            </div>
          </div>

          {/* Pedagogical framework note */}
          <div style={{ borderTop: `1px solid ${C.paperDark}`, paddingTop: '20px' }}>
            <Kicker color={C.topics.line}>From the Learning Science Webinar</Kicker>
            <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
              Brittany attended a Learning Engineering webinar on AI system development. The frameworks endorsed by participants — Bloom's Taxonomy, Backward Design, Cognitive Load Theory, IEEE TLA, and UDL — map closely to Kinship's own pedagogical bedrock. Maggie added PISA/PIRLS item frameworks as particularly relevant for international pilot design.
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ marginTop: 'clamp(40px,6vw,64px)', borderTop: `3px double ${C.ink}`, paddingTop: 'clamp(20px,3vw,28px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: 'clamp(16px,2.5vw,24px)', marginBottom: '20px' }}>
            <div>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.inkFaint, marginBottom: '8px' }}>Hottest Thread</div>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid }}>
                <strong style={{ color: C.ink }}>K-SEL reflection bank launch</strong> in <span style={{ fontFamily: MONO, fontSize: '11px' }}>#team-eng</span> — 17 replies, engineer + teacher + researcher collaboration on a single PR
              </div>
            </div>
            <div>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.inkFaint, marginBottom: '8px' }}>This Issue</div>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid }}>
                Issue #8 · Aug 18–22, 2026 · 43 channels swept · 112 messages · 8 signals extracted
              </div>
            </div>
          </div>
          <hr style={rule} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ fontFamily: SERIF, fontStyle: 'italic', fontSize: '14px', color: C.inkFaint }}>The Kinship Fall Countdown Issue</div>
            <div style={{ fontFamily: MONO, fontSize: '10px', color: C.inkFaint }}>Produced by Hermes · Kinship Intelligence Brief</div>
          </div>
        </div>

      </div>
    </div>
  );
}
