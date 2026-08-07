'use client';
// needed for useState + useEffect (TOC IntersectionObserver, interactive scroll-to navigation)
import React, { useState, useEffect } from 'react';

/* ─── Design tokens (Newspaper System — Issue #4+) ─────────────────────────── */
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
  crm:        { line: '#0f6b8a', bg: '#f0faff' },
};
const SERIF = "'Georgia', 'Times New Roman', serif";
const SANS  = "'Inter', 'Helvetica Neue', Arial, sans-serif";
const MONO  = "'IBM Plex Mono', 'Courier New', monospace";

/* ─── Rule helpers ─────────────────────────────────────────────────────────── */
const rule: React.CSSProperties = { border: 'none', borderTop: `1px solid ${C.paperDark}`, margin: '0' };
const ruleThick: React.CSSProperties = { border: 'none', borderTop: `3px solid ${C.ink}`, margin: '0' };
const ruleDouble: React.CSSProperties = { border: 'none', borderTop: `3px double ${C.ink}`, margin: '0' };

/* ─── Micro-components ─────────────────────────────────────────────────────── */
function Kicker({ children, color = C.accent }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '10px',
      letterSpacing: '0.14em', textTransform: 'uppercase' as const, color, marginBottom: '6px' }}>
      {children}
    </div>
  );
}

function SoWhat({ text }: { text: string }) {
  return (
    <div style={{ borderTop: `1px solid ${C.paperDark}`, paddingTop: '10px', marginTop: '10px',
      fontFamily: SANS, fontSize: '12px', color: C.inkDim, lineHeight: 1.55 }}>
      <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: '10px', letterSpacing: '0.1em',
        textTransform: 'uppercase' as const, color: C.accent, marginRight: '6px' }}>So what?</span>
      {text}
    </div>
  );
}

function ThreadLink({ href, color = C.accent }: { href: string; color?: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer"
      style={{ fontFamily: MONO, fontSize: '10px', color, textDecoration: 'none', opacity: 0.8 }}>
      ↗ thread
    </a>
  );
}

function SectionLabel({ id, emoji, title, color, bg }: { id: string; emoji: string; title: string; color: string; bg: string }) {
  return (
    <div id={id} style={{ marginBottom: '0', scrollMarginTop: '80px' }}>
      <hr style={ruleThick} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px',
        background: bg, padding: '12px 20px', borderBottom: `1px solid ${C.paperDark}` }}>
        <span style={{ fontSize: '18px' }}>{emoji}</span>
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: '12px',
          letterSpacing: '0.12em', textTransform: 'uppercase' as const, color }}>{title}</span>
      </div>
    </div>
  );
}

/* ─── Table of Contents ────────────────────────────────────────────────────── */
const TOC_ITEMS = [
  { id: 'partners',  emoji: '🤝', label: 'Partners',           color: C.partners.line },
  { id: 'pilot',     emoji: '🎯', label: 'Pilot Success',      color: C.pilot.line    },
  { id: 'product',   emoji: '⚙️',  label: 'Product Update',    color: C.product.line  },
  { id: 'topics',    emoji: '🔭', label: 'Topics',             color: C.topics.line   },
  { id: 'crm',       emoji: '🗂️', label: 'CRM Decision',      color: C.crm.line      },
];

function TableOfContents() {
  const [activeId, setActiveId] = useState('');
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveId(e.target.id); }); },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );
    TOC_ITEMS.forEach(({ id }) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);
  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  return (
    <nav style={{ borderTop: `1px solid ${C.paperDark}`, borderBottom: `1px solid ${C.paperDark}`,
      padding: 'clamp(12px, 2vw, 16px) 0', marginBottom: 'clamp(24px, 4vw, 36px)' }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '10px',
        letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: C.inkFaint, marginBottom: '10px' }}>
        In this issue
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap' as const, overflowX: 'auto' as const,
        gap: '6px 0' }}>
        {TOC_ITEMS.map((item, i) => (
          <React.Fragment key={item.id}>
            <button onClick={() => scrollTo(item.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
                fontFamily: SANS, fontSize: 'clamp(12px, 1.8vw, 13px)',
                fontWeight: activeId === item.id ? 700 : 400,
                color: activeId === item.id ? item.color : C.inkMid,
                whiteSpace: 'nowrap' as const, transition: 'color 0.15s',
                textDecoration: activeId === item.id ? 'underline' : 'none',
                textUnderlineOffset: '3px' }}>
              {item.emoji} {item.label}
            </button>
            {i < TOC_ITEMS.length - 1 && (
              <span style={{ fontFamily: SANS, color: C.inkFaint, fontSize: '12px', padding: '4px 10px', userSelect: 'none' as const }}>·</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}

/* ─── Main page ────────────────────────────────────────────────────────────── */
export default function KinshipMagazineIssue6() {
  return (
    <div style={{ minHeight: '100dvh', background: C.paper, color: C.inkMid, fontFamily: SANS }}>
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 clamp(16px, 5vw, 32px) clamp(40px, 6vw, 64px)' }}>

        {/* ── Utility Bar ── */}
        <div style={{ paddingTop: 'clamp(20px, 3vw, 32px)', paddingBottom: '10px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          fontFamily: SANS, fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em',
          textTransform: 'uppercase' as const, color: C.inkFaint }}>
          <span>The Kinship Intelligence Brief</span>
          <span>Aug 4–8, 2026</span>
        </div>

        {/* ── Double Rule + Nameplate ── */}
        <hr style={ruleDouble} />
        <div style={{ textAlign: 'center', padding: 'clamp(20px, 4vw, 36px) 0 clamp(8px, 2vw, 16px)' }}>
          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(34px, 7vw, 72px)', fontWeight: 700,
            color: C.ink, margin: '0 0 12px', lineHeight: 1.05 }}>
            The Kinship<br />Math Academy Issue
          </h1>
          <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkFaint, letterSpacing: '0.04em' }}>
            Issue #6 &nbsp;·&nbsp; August 4–8, 2026 &nbsp;·&nbsp; Produced by Hermes
          </div>
        </div>
        <hr style={ruleThick} />

        {/* ── Lede Bar ── */}
        <div style={{ background: C.ink, color: C.paper, textAlign: 'center',
          padding: 'clamp(14px, 3vw, 22px) clamp(16px, 4vw, 32px)',
          fontFamily: SERIF, fontSize: 'clamp(15px, 2.5vw, 19px)', fontStyle: 'italic', lineHeight: 1.5 }}>
          27 commits. One week. Math Academy is now live inside Kinship — and 15 schools are confirmed for fall.
        </div>
        <hr style={rule} />

        {/* ── Stats Bar ── */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' as const,
          gap: 'clamp(16px, 4vw, 40px)', padding: 'clamp(18px, 3vw, 28px) 0', textAlign: 'center' }}>
          {[
            { n: '42',  label: 'channels swept' },
            { n: '140', label: 'messages read'  },
            { n: '15',  label: 'fall pilots confirmed' },
            { n: '27',  label: 'user-facing commits' },
          ].map(({ n, label }) => (
            <div key={label}>
              <div style={{ fontFamily: SERIF, fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, color: C.accent, lineHeight: 1 }}>{n}</div>
              <div style={{ fontFamily: SANS, fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase' as const, color: C.inkFaint, marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── Table of Contents ── */}
        <TableOfContents />

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 1 — PARTNERS
        ═══════════════════════════════════════════════════════════════════════ */}
        <SectionLabel id="partners" emoji="🤝" title="Partners Update" color={C.partners.line} bg={C.partners.bg} />
        <div style={{ marginTop: 'clamp(20px, 3vw, 28px)', display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
          gap: 'clamp(16px, 2.5vw, 24px)' }}>

          <div>
            <div style={{ borderTop: `2px solid ${C.partners.line}`, paddingTop: '14px', paddingBottom: '4px' }}>
              <Kicker color={C.partners.line}>New Signatures · This Week</Kicker>
              <div style={{ fontFamily: SERIF, fontSize: '17px', fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: '8px' }}>
                Baypoint Preparatory & Rashi School signed MOUs
              </div>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                Two more schools joined the founding cohort this week — Baypoint Preparatory Academy (charter, Southern California) and Rashi School. The roster now spans public, charter, private, Jewish, and low-income school profiles, giving Kinship a genuinely diverse set of founding partners. Pipeline: 6 signed, 10 verbal commitments, 15 total for fall.
              </div>
              <SoWhat text="Diversity in the founding cohort matters for outcomes data and investor narrative. A pure private-school pilot would be a narrower proof point." />
            </div>
          </div>

          <div>
            <div style={{ borderTop: `2px solid ${C.partners.line}`, paddingTop: '14px', paddingBottom: '4px' }}>
              <Kicker color={C.partners.line}>International · Go Signal</Kicker>
              <div style={{ fontFamily: SERIF, fontSize: '17px', fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: '8px' }}>
                Alan is moving to Paris. Dave is pitching Asia-Pacific. UAE government is actively in talks.
              </div>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                International expansion is now a funded initiative with formal accountability. Singapore identified as the most strategic Asia entry point (gateway to SE Asia). UAE discussions touch 8 government-designated "AI Schools of the Future." Dave needs specific budget, school projections, and confirmed lighthouse meetings to unlock travel approval.
              </div>
              <SoWhat text="This is the moment where the international strategy goes from informal networking to a real operating plan. Lighthouse commitments are the gate." />
            </div>
          </div>

          <div>
            <div style={{ borderTop: `2px solid ${C.partners.line}`, paddingTop: '14px', paddingBottom: '4px' }}>
              <Kicker color={C.partners.line}>Funders · Silicon Schools Fund</Kicker>
              <div style={{ fontFamily: SERIF, fontSize: '17px', fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: '8px' }}>
                Silicon Schools Fund is aligned — and can co-fund school adoption
              </div>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                Silicon Schools Fund (Bay Area edtech philanthropic funder) met the team this week. They back new school models and adaptive learning platforms. Strongly aligned on the teacher-as-orchestrator model. They can provide philanthropic funding to schools to support Kinship adoption — a direct answer to the "pilot cost" objection for under-resourced schools. School leads incoming.
              </div>
              <SoWhat text="This is a funder that makes Kinship cheaper for schools to try. That matters more than it sounds at the pilot stage." />
            </div>
          </div>

          <div>
            <div style={{ borderTop: `2px solid ${C.partners.line}`, paddingTop: '14px', paddingBottom: '4px' }}>
              <Kicker color={C.partners.line}>Sales · Launch Desk Tool</Kicker>
              <div style={{ fontFamily: SERIF, fontSize: '17px', fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: '8px' }}>
                A new "launch-desk" skill is now live for pilot tracking
              </div>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                A new tool for partners to track pilot launch readiness and prevent stale knowledge from slipping through the cracks. 12 reactions in-channel — the team loved it. This is the kind of self-maintaining infrastructure that makes 15 simultaneous pilots actually manageable.
              </div>
              <SoWhat text="Operations at 15+ pilots requires systems that keep knowledge fresh automatically. This is one of them." />
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 2 — PILOT SUCCESS
        ═══════════════════════════════════════════════════════════════════════ */}
        <div style={{ marginTop: 'clamp(32px, 5vw, 52px)' }}>
          <SectionLabel id="pilot" emoji="🎯" title="Pilot Success Update" color={C.pilot.line} bg={C.pilot.bg} />
        </div>
        <div style={{ marginTop: 'clamp(20px, 3vw, 28px)' }}>

          {/* RHA Spotlight */}
          <div style={{ borderTop: `2px solid ${C.pilot.line}`, paddingTop: '14px', marginBottom: 'clamp(16px, 2.5vw, 24px)' }}>
            <Kicker color={C.pilot.line}>RHA Launch · T-Minus ~4 Weeks</Kicker>
            <div style={{ fontFamily: SERIF, fontSize: 'clamp(18px, 3vw, 22px)', fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: '10px' }}>
              RHA app stack is confirmed: Math Academy, Lexia, Moby Max, Rosetta Stone
            </div>
            <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, marginBottom: '12px' }}>
              The RHA planning session locked down the full curriculum architecture this week. No traditional multiple-choice exams — the apps carry assessment. MAP testing window: week of the 15th, order: math → reading → language → science. Math Academy diagnostic takes ~45 min; Lexia ~20 min. An in-person work session is scheduled Tue–Thu in the library.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))',
              gap: '10px', marginBottom: '12px' }}>
              {[
                { subject: 'Math', app: 'Math Academy', note: 'API integration live' },
                { subject: 'Reading', app: 'Lexia Core 5', note: 'Diagnostic ~20 min' },
                { subject: 'Science', app: 'Moby Max', note: 'Use real licenses' },
                { subject: 'French', app: 'Rosetta Stone', note: 'TBD robustness' },
              ].map(({ subject, app, note }) => (
                <div key={subject} style={{ borderTop: `1px solid ${C.pilot.line}`, paddingTop: '10px' }}>
                  <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '11px', color: C.pilot.line, marginBottom: '4px' }}>{subject}</div>
                  <div style={{ fontFamily: SERIF, fontSize: '13px', color: C.ink }}>{app}</div>
                  <div style={{ fontFamily: SANS, fontSize: '11px', color: C.inkFaint, marginTop: '3px' }}>{note}</div>
                </div>
              ))}
            </div>
            <SoWhat text="The curriculum is real and locked. The critical path now is teacher training (in-person next week) and making sure Math Academy access works for every student." />
          </div>

          {/* Grid of other school signals */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(16px, 2.5vw, 24px)' }}>

            <div style={{ borderTop: `2px solid ${C.pilot.line}`, paddingTop: '14px' }}>
              <Kicker color={C.pilot.line}>UCC · Fall Grade 9 Math Pilot</Kicker>
              <div style={{ fontFamily: SERIF, fontSize: '15px', fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: '8px' }}>
                UCC summer pilot wrapping — fall Grade 9 deal being added
              </div>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                The team is working to get a call with school leadership to confirm the fall pilot scope. Two former MA account admins need to be cleaned up. UCCC Sept 7 launch is the nearest fixed date — Nadim confirmed as on-site support.
              </div>
            </div>

            <div style={{ borderTop: `2px solid ${C.pilot.line}`, paddingTop: '14px' }}>
              <Kicker color={C.pilot.line}>York School · Data Clarity</Kicker>
              <div style={{ fontFamily: SERIF, fontSize: '15px', fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: '8px' }}>
                "Lots of data available — not abundantly clear what to do with all of it"
              </div>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                Teacher feedback from York flagged a real UX gap: the data richness isn't matched by clear guidance on what to act on. IB curriculum alignment also surfaced as a new pilot success criterion worth formalizing.
              </div>
              <SoWhat text="This is product feedback masquerading as a pilot note. The 'what do I do with this data?' question needs a design answer before September." />
            </div>

            <div style={{ borderTop: `2px solid ${C.pilot.line}`, paddingTop: '14px' }}>
              <Kicker color={C.pilot.line}>TDSB · Moving Forward</Kicker>
              <div style={{ fontFamily: SERIF, fontSize: '15px', fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: '8px' }}>
                Flemington school confirmed — TDSB pilots are a go
              </div>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                Met with Flemington this week and confirmed forward movement. TDSB gives Kinship a public school district anchor in Canada's largest city — significant signal for the broader Ontario public school play.
              </div>
            </div>

            <div style={{ borderTop: `2px solid ${C.pilot.line}`, paddingTop: '14px' }}>
              <Kicker color={C.pilot.line}>Pilot Measurement · Surveys Live</Kicker>
              <div style={{ fontFamily: SERIF, fontSize: '15px', fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: '8px' }}>
                Pilot measurement survey sent — team asked to complete by Monday
              </div>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                The Pilot Success team sent out measurement survey follow-ups this week to align on outcomes criteria before September launches. Also: a transcript from yesterday's pilot success sync was missing — "mine didn't work." Backup note-taking process needed.
              </div>
            </div>

            <div style={{ borderTop: `2px solid ${C.pilot.line}`, paddingTop: '14px' }}>
              <Kicker color={C.pilot.line}>Kiosk Mode · Policy Question</Kicker>
              <div style={{ fontFamily: SERIF, fontSize: '15px', fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: '8px' }}>
                "Is kiosk mode our stance going forward?"
              </div>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                A question surfaced about whether kiosk mode (locked devices in single-app mode) will be Kinship's standard setup. Brown used it — but it's not universally right for every school model, especially boarding or BYOD schools. Needs a clear policy before September.
              </div>
              <SoWhat text="This decision affects setup time and teacher experience at every launch. A written decision now saves a debate at every school." />
            </div>

          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 3 — PRODUCT UPDATE (highest priority)
        ═══════════════════════════════════════════════════════════════════════ */}
        <div style={{ marginTop: 'clamp(32px, 5vw, 52px)' }}>
          <SectionLabel id="product" emoji="⚙️" title="Product Update" color={C.product.line} bg={C.product.bg} />
        </div>
        <div style={{ marginTop: 'clamp(20px, 3vw, 28px)' }}>

          {/* Hero Product Story */}
          <div style={{ background: C.product.bg, padding: 'clamp(16px, 3vw, 24px)',
            borderTop: `3px solid ${C.product.line}`, marginBottom: 'clamp(20px, 3vw, 28px)' }}>
            <Kicker color={C.product.line}>Major Integration · Math Academy API</Kicker>
            <div style={{ fontFamily: SERIF, fontSize: 'clamp(20px, 3.5vw, 28px)', fontWeight: 700,
              color: C.ink, lineHeight: 1.25, marginBottom: '12px' }}>
              Math Academy is now fully wired into Kinship — 27 commits in one week
            </div>
            <div style={{ fontFamily: SANS, fontSize: '14px', color: C.inkMid, lineHeight: 1.7, marginBottom: '12px' }}>
              This week's engineering output was dominated by one story: Kinship now has a deep, live API integration with Math Academy. This means the adaptive math engine that schools are paying separately for is now visible, manageable, and actionable directly inside Kinship's dashboard — without any manual data export.
            </div>
            <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
              What changed: student rosters sync automatically from Math Academy into Kinship. Teachers can see where each student is on their Math Academy learning path from the Class Overview. Progress data, mastery levels, and activity signals flow into the same view as everything else. Students can sign in with Google — no separate Math Academy login needed at many schools.
            </div>
          </div>

          {/* New Features */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: '11px', letterSpacing: '0.1em',
              textTransform: 'uppercase' as const, color: C.product.line, marginBottom: '14px', borderBottom: `1px solid ${C.paperDark}`, paddingBottom: '8px' }}>
              ✨ New This Week
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: 'clamp(14px, 2vw, 20px)' }}>
              {[
                {
                  emoji: '📊', label: 'hearth', scope: 'Class Overview',
                  title: 'Class Overview rebuilt around goal pace, accuracy & signals',
                  desc: 'The main teacher dashboard now shows how each student is pacing against their learning goal, their accuracy trend, and live signals from their recent Math Academy sessions. Placements has been folded in as a lazy tab — it\'s there when you need it, but the main view stays clean.',
                },
                {
                  emoji: '🗓️', label: 'hearth', scope: 'School Calendar',
                  title: 'School Calendar + instructional-time goal pacing',
                  desc: 'Teachers can now set a school calendar and see goal progress paced against actual instructional days — not a flat 180-day assumption. If there are breaks, testing windows, or holidays, the pace bar adjusts automatically.',
                },
                {
                  emoji: '🎓', label: 'horizon', scope: 'Parent Portal',
                  title: 'Students can sign in with Google via classroom invitations',
                  desc: 'Parents and students using the Horizon portal can now sign in with Google — no separate password required. Schools using Google Workspace can invite students directly from their class roster. First to roll out on Horizon, with Hearth to follow.',
                },
                {
                  emoji: '🏫', label: 'hearth', scope: 'MobyMax',
                  title: 'MobyMax school-code settings added',
                  desc: 'Schools using MobyMax (e.g. RHA Grade 3/4/5) can now configure their school code directly in Kinship. Sessions become visible as activity when students are active — presence-driven, not scheduled.',
                },
                {
                  emoji: '🏗️', label: 'hearth', scope: 'Demo School',
                  title: 'Demo school is live on production — everyone has super-admin access',
                  desc: 'A workable demo school is now on production with a fixed class profile. Every team member is a super-admin. There\'s also a demo clock so anyone can set "today" to any day — useful for showing seasonal product behavior without waiting for real dates.',
                },
                {
                  emoji: '🔐', label: 'horizon', scope: 'Setup Page',
                  title: 'Chrome extension served from non-production /setup',
                  desc: 'The load-unpacked version of the Kinship Tally extension is now downloadable directly from the /setup page on the parent portal. Makes first-day setup at a new school dramatically faster.',
                },
              ].map(({ emoji, label, scope, title, desc }) => (
                <div key={title} style={{ borderTop: `2px solid ${C.product.line}`, paddingTop: '12px' }}>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px', lineHeight: 1, flexShrink: 0 }}>{emoji}</span>
                    <div>
                      <Kicker color={C.product.line}>{label} · {scope}</Kicker>
                      <div style={{ fontFamily: SERIF, fontSize: '15px', fontWeight: 700,
                        color: C.ink, lineHeight: 1.3 }}>{title}</div>
                    </div>
                  </div>
                  <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Fixes */}
          <div style={{ marginTop: 'clamp(20px, 3vw, 28px)' }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: '11px', letterSpacing: '0.1em',
              textTransform: 'uppercase' as const, color: C.product.line, marginBottom: '14px', borderBottom: `1px solid ${C.paperDark}`, paddingBottom: '8px' }}>
              🛠️ Fixed & Improved
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: 'clamp(12px, 2vw, 18px)' }}>
              {[
                { title: 'Super-admin can now reach the student sign-in switch', desc: 'A permission bug prevented super-admins from toggling the student Google sign-in feature. Fixed.' },
                { title: 'Bloom signal lanes scoped to the demo-clock day', desc: 'Signal activity in the Bloom view was showing data from wrong calendar days. Now respects the demo clock setting.' },
                { title: 'Extension now hands the correct API URL to schools', desc: 'The Kinship Tally Chrome extension was receiving the wrong API endpoint on setup pages, causing silent failures. Guarded and documented.' },
                { title: 'Math Academy student creation now works correctly', desc: 'The API response shape for creating new students was being parsed incorrectly — the student object was nested one level deeper than expected. Fixed.' },
              ].map(({ title, desc }) => (
                <div key={title} style={{ borderTop: `1px solid ${C.paperDark}`, paddingTop: '10px' }}>
                  <div style={{ fontFamily: SERIF, fontSize: '14px', fontWeight: 700, color: C.ink, marginBottom: '6px' }}>{title}</div>
                  <div style={{ fontFamily: SANS, fontSize: '12px', color: C.inkDim, lineHeight: 1.55 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Demo announcement */}
          <div style={{ marginTop: 'clamp(20px, 3vw, 24px)', background: C.accentFaint,
            borderTop: `2px solid ${C.accent}`, padding: 'clamp(12px, 2vw, 18px)' }}>
            <Kicker color={C.accent}>Team Action Required</Kicker>
            <div style={{ fontFamily: SERIF, fontSize: '16px', fontWeight: 700, color: C.ink, marginBottom: '8px' }}>
              Log into the demo school and explore it — features are ready to show
            </div>
            <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
              The demo school is live at app.buildkinship.dev with a super-admin for every team member. Tyler and Will shipped features this week that are ready to demo. If you haven't looked at the new Class Overview, the Calendar, or the Math Academy sync — now is the time.
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 4 — TOPICS WORTH WATCHING
        ═══════════════════════════════════════════════════════════════════════ */}
        <div style={{ marginTop: 'clamp(32px, 5vw, 52px)' }}>
          <SectionLabel id="topics" emoji="🔭" title="Topics Worth Watching" color={C.topics.line} bg={C.topics.bg} />
        </div>
        <div style={{ marginTop: 'clamp(20px, 3vw, 28px)' }}>

          {/* Deep Dive 1 — LearnVector */}
          <div style={{ borderTop: `2px solid ${C.topics.line}`, paddingTop: '14px', marginBottom: 'clamp(20px, 3vw, 28px)' }}>
            <Kicker color={C.topics.line}>Competitive Intel · Deep Dive</Kicker>
            <div style={{ fontFamily: SERIF, fontSize: 'clamp(20px, 3.5vw, 28px)', fontWeight: 700, color: C.ink, lineHeight: 1.25, marginBottom: '12px' }}>
              Andrew Ng + Coursera enter K-12 with LearnVector
            </div>
            <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.7, marginBottom: '14px' }}>
              An Axios story this week confirmed Andrew Ng is bringing his AI curriculum expertise and Coursera's content stack into the K-12 market through LearnVector. This is a category-defining signal. Ng's brand with school districts and education ministries is enormous — deeper than any pure edtech startup's positioning. LearnVector would likely offer adaptive AI-personalized learning paths with the Coursera content library as the backbone.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
              gap: '12px', marginBottom: '14px' }}>
              {[
                { label: 'What it is', text: 'AI-native K-12 learning platform backed by Andrew Ng (deeplearning.ai, Coursera) — adaptive, LLM-powered curriculum delivery' },
                { label: 'Why it matters', text: "Ng's credibility with governments and school systems is a top-5 global brand in AI education. If he enters K-12 with Coursera's content, that's a well-funded, credible competitor" },
                { label: 'What it means for Kinship', text: "Kinship's edge: relationship layer, teacher-in-the-loop design, and native integrations (Math Academy). Top-down platform plays often miss the school-as-relationship dynamic" },
              ].map(({ label, text }) => (
                <div key={label} style={{ borderTop: `1px solid ${C.topics.line}`, paddingTop: '10px' }}>
                  <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '10px', letterSpacing: '0.1em',
                    textTransform: 'uppercase' as const, color: C.topics.line, marginBottom: '6px' }}>{label}</div>
                  <div style={{ fontFamily: SANS, fontSize: '12px', color: C.inkMid, lineHeight: 1.55 }}>{text}</div>
                </div>
              ))}
            </div>
            <SoWhat text="This is the signal that most warrants a strategic response memo. The window before LearnVector hits school district procurement cycles is short." />
          </div>

          {/* Deep Dive 2 — Shopify Continual Learning */}
          <div style={{ borderTop: `2px solid ${C.topics.line}`, paddingTop: '14px', marginBottom: 'clamp(20px, 3vw, 28px)' }}>
            <Kicker color={C.topics.line}>Learning Science · Deep Dive</Kicker>
            <div style={{ fontFamily: SERIF, fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 700, color: C.ink, lineHeight: 1.25, marginBottom: '10px' }}>
              Shopify's "continual learning loop" as a model for AI curriculum generation
            </div>
            <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.7, marginBottom: '12px' }}>
              Someone in #topic-learning-science surfaced Shopify's approach to curriculum generation for their AI assistant Sidekick: define a clear quality rubric, calibrate with expert annotators, run the model, measure against the rubric, feed learnings back into content updates. The thread noted this maps directly to what Kinship is trying to do with its own AI curriculum layer — especially for schools that want the curriculum to improve based on student performance signals.
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' as const }}>
              <a href="https://shopify.engineering/sidekicks-continual-learning-loop" target="_blank" rel="noreferrer"
                style={{ fontFamily: MONO, fontSize: '11px', color: C.topics.line, textDecoration: 'none', opacity: 0.85 }}>
                ↗ shopify.engineering
              </a>
              <a href="https://kinship-9xb4888.slack.com/archives/C0B1K5U230W/p1786021651492549" target="_blank" rel="noreferrer"
                style={{ fontFamily: MONO, fontSize: '11px', color: C.topics.line, textDecoration: 'none', opacity: 0.85 }}>
                ↗ thread
              </a>
            </div>
            <SoWhat text="Kinship already has the signal pipeline (Math Academy activity, Lexia scores). The question is whether the curriculum layer can close the loop automatically — or if a human teacher is always in that path." />
          </div>

          {/* Brief Mentions */}
          <div style={{ borderTop: `1px solid ${C.paperDark}`, paddingTop: '16px' }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: '11px', letterSpacing: '0.1em',
              textTransform: 'uppercase' as const, color: C.topics.line, marginBottom: '14px' }}>
              Also This Week
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: 'clamp(12px, 2vw, 18px)' }}>
              {[
                {
                  channel: '#topic-edtech',
                  title: 'Coursera + Varsity Tutors funding activity',
                  text: "Multiple edtech funding stories hitting the tape. Varsity Tutors changes and Coursera's LearnVector move both signal accelerating investment into AI-native tutoring platforms. Kinship is not alone in this race.",
                  link: 'https://kinship-9xb4888.slack.com/archives/C0BHY9EV2AG/p1786114816587369',
                },
                {
                  channel: '#topic-tooling',
                  title: "ChatGPT Voice on Desktop: 'Jarvis is here'",
                  text: "Team member note from this week: 'Started using ChatGPT Voice on Desktop today. Jarvis is here. Just wild.' Also: a tool for converting content to Markdown for second-brain workflows is circulating — relevant for Kinship Brain context.",
                  link: 'https://kinship-9xb4888.slack.com/archives/C0B5FL7KTKN/p1785867125352029',
                },
                {
                  channel: '#topic-brain-context',
                  title: 'Sharing Claude skills between teammates',
                  text: "A tutorial on how to share Claude skills with teammates was shared and got 5 reactions in-channel. As Kinship builds its own Brain infrastructure, cross-team skill sharing becomes a real operational pattern.",
                  link: 'https://kinship-9xb4888.slack.com/archives/C0B3WMYDF7T/p1786123316242799',
                },
                {
                  channel: '#open-announcements',
                  title: 'Document automation is live',
                  text: "An announcement this week: 'Our documents now look after themselves.' A new automation is running on the Kinship Drive — documents that were previously manually maintained now update automatically from a data source. The team reacted well (6 replies, 2 reactions).",
                  link: 'https://kinship-9xb4888.slack.com/archives/C0BC3PW3G0P/p1786023756840049',
                },
              ].map(({ channel, title, text, link }) => (
                <div key={title} style={{ borderTop: `1px solid ${C.paperDark}`, paddingTop: '10px' }}>
                  <div style={{ fontFamily: MONO, fontSize: '10px', color: C.inkFaint, marginBottom: '6px' }}>{channel}</div>
                  <div style={{ fontFamily: SERIF, fontSize: '14px', fontWeight: 700, color: C.ink, marginBottom: '6px', lineHeight: 1.3 }}>{title}</div>
                  <div style={{ fontFamily: SANS, fontSize: '12px', color: C.inkDim, lineHeight: 1.55, marginBottom: '8px' }}>{text}</div>
                  <ThreadLink href={link} color={C.topics.line} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════════
            SECTION 5 — CRM DECISION
        ═══════════════════════════════════════════════════════════════════════ */}
        <div style={{ marginTop: 'clamp(32px, 5vw, 52px)' }}>
          <SectionLabel id="crm" emoji="🗂️" title="CRM Decision" color={C.crm.line} bg={C.crm.bg} />
        </div>
        <div style={{ marginTop: 'clamp(20px, 3vw, 28px)' }}>

          {/* Hero verdict */}
          <div style={{ background: C.crm.bg, padding: 'clamp(16px, 3vw, 24px)',
            borderTop: `3px solid ${C.crm.line}`, marginBottom: 'clamp(20px, 3vw, 28px)' }}>
            <Kicker color={C.crm.line}>Internal Decision · Sales Operations</Kicker>
            <div style={{ fontFamily: SERIF, fontSize: 'clamp(20px, 3.5vw, 28px)', fontWeight: 700,
              color: C.ink, lineHeight: 1.25, marginBottom: '12px' }}>
              Reevo is the front-runner — Kinship is picking a new CRM
            </div>
            <div style={{ fontFamily: SANS, fontSize: '14px', color: C.inkMid, lineHeight: 1.7, marginBottom: '12px' }}>
              After evaluating four tools across 103 messages and a week of discussion, the team is converging on Reevo as its next CRM platform. Azim and Dan Taylor both flagged it as the strongest contender — its AI-native features and clean interface stood out from the field. An internal call is being scheduled to confirm the decision and map out next steps.
            </div>
          </div>

          {/* The four tools side by side */}
          <div style={{ marginBottom: 'clamp(20px, 3vw, 28px)' }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: '11px', letterSpacing: '0.1em',
              textTransform: 'uppercase' as const, color: C.crm.line, marginBottom: '14px', borderBottom: `1px solid ${C.paperDark}`, paddingBottom: '8px' }}>
              The Field
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
              gap: 'clamp(12px, 2vw, 18px)' }}>
              {[
                {
                  tool: 'Reevo',
                  verdict: '✅ Front-runner',
                  verdictColor: '#1a6641',
                  desc: 'Top contender. AI features and user-friendly interface won over both Azim and Dan Taylor. Strong positive sentiment across the thread.',
                },
                {
                  tool: 'Attio',
                  verdict: '🟡 Strong but #2',
                  verdictColor: '#92400e',
                  desc: 'Solid onboarding and data sanitization. Azim found the onboarding process effective. Ranked below Reevo overall.',
                },
                {
                  tool: 'Lightfield',
                  verdict: '🔴 Likely pass',
                  verdictColor: '#b83a0c',
                  desc: 'Less evolved than alternatives. Discussed implementation time and custom-build comparison. Azim suggested moving or canceling the Lightfield call.',
                },
                {
                  tool: 'Softr / Clay',
                  verdict: '⛔ Not a CRM',
                  verdictColor: '#6b5e50',
                  desc: 'Softr is a Notion competitor. Clay is an add-on tool. Mike Li and Lydia Powell concluded neither fits the CRM use case.',
                },
              ].map(({ tool, verdict, verdictColor, desc }) => (
                <div key={tool} style={{ borderTop: `2px solid ${C.crm.line}`, paddingTop: '12px' }}>
                  <div style={{ fontFamily: SERIF, fontSize: '16px', fontWeight: 700, color: C.ink, marginBottom: '6px' }}>{tool}</div>
                  <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '11px', color: verdictColor, marginBottom: '8px' }}>{verdict}</div>
                  <div style={{ fontFamily: SANS, fontSize: '12px', color: C.inkMid, lineHeight: 1.55 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Next steps callout */}
          <div style={{ background: C.accentFaint, borderTop: `2px solid ${C.accent}`, padding: 'clamp(12px, 2vw, 18px)' }}>
            <Kicker color={C.accent}>Next Step</Kicker>
            <div style={{ fontFamily: SERIF, fontSize: '16px', fontWeight: 700, color: C.ink, marginBottom: '8px' }}>
              Internal call incoming — Reevo needs a closer look before commitment
            </div>
            <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
              Azim proposed an internal call to align the team before a final decision. Reevo is promising but will need a proper pilot or demo walkthrough to confirm fit with Kinship&apos;s sales workflow. The team is moving fast here — watch for a decision next week.
            </div>
          </div>

        </div>

        {/* ════════════════════════════════════════════════════════════════════
            FOOTER
        ═══════════════════════════════════════════════════════════════════════ */}
        <div style={{ marginTop: 'clamp(40px, 6vw, 60px)' }}>
          <hr style={ruleThick} />
          <div style={{ paddingTop: '20px', display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
            gap: 'clamp(14px, 2.5vw, 20px)' }}>
            <div>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em',
                textTransform: 'uppercase' as const, color: C.inkFaint, marginBottom: '8px' }}>Hottest Thread</div>
              <div style={{ fontFamily: SERIF, fontSize: '13px', color: C.inkMid, lineHeight: 1.5 }}>
                Chrome extension auto-update question in <span style={{ fontFamily: MONO }}>#team-eng</span> — 22 replies
              </div>
              <a href="https://kinship-9xb4888.slack.com/archives/C0ANK3CJM8V/p1786104398554509"
                target="_blank" rel="noreferrer"
                style={{ fontFamily: MONO, fontSize: '10px', color: C.accent, textDecoration: 'none' }}>
                ↗ thread
              </a>
            </div>
            <div>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em',
                textTransform: 'uppercase' as const, color: C.inkFaint, marginBottom: '8px' }}>This Issue</div>
              <div style={{ fontFamily: SANS, fontSize: '12px', color: C.inkDim, lineHeight: 1.6 }}>
                <div>Aug 4–8, 2026</div>
                <div>42 channels swept</div>
                <div>140 messages read</div>
                <div>20 Drive transcripts ingested</div>
                <div>27 user-facing commits</div>
              </div>
            </div>
            <div>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em',
                textTransform: 'uppercase' as const, color: C.inkFaint, marginBottom: '8px' }}>About</div>
              <div style={{ fontFamily: SANS, fontSize: '12px', color: C.inkDim, lineHeight: 1.6 }}>
                Produced by Hermes, Kinship&apos;s AI agent. Every Friday. Signal, not noise.
              </div>
            </div>
          </div>
          <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: `1px solid ${C.paperDark}`,
            fontFamily: MONO, fontSize: '10px', color: C.inkFaint, textAlign: 'center' }}>
            The Kinship Math Academy Issue — Issue #6 · August 4–8, 2026
          </div>
        </div>

      </div>
    </div>
  );
}
