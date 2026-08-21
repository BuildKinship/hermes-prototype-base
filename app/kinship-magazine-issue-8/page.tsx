'use client';
// needed for IntersectionObserver TOC, scroll interactions, and useState/useEffect

import React, { useState, useEffect } from 'react';

const C = {
  ink:         '#16120c',
  inkMid:      '#3d3328',
  inkDim:      '#6b5e50',
  inkFaint:    '#a8998a',
  paper:       '#f7f3ed',
  paperWarm:   '#f0eade',
  paperDark:   '#e8e0d4',
  white:       '#fdfaf6',
  accent:      '#b83a0c',
  accentFaint: '#fef0e8',
  partners:    { line: '#1a6641', bg: '#f0fdf6' },
  pilot:       { line: '#1e4e96', bg: '#f0f5ff' },
  product:     { line: '#5b21b6', bg: '#f7f3ff' },
  topics:      { line: '#92400e', bg: '#fff8f0' },
};

const SERIF = "'Georgia', 'Times New Roman', serif";
const SANS  = "'Inter', 'Helvetica Neue', Arial, sans-serif";
const MONO  = "'IBM Plex Mono', 'Courier New', monospace";

const ruleThick: React.CSSProperties = { border: 'none', borderTop: `3px solid ${C.ink}`, margin: '0' };
const ruleDouble: React.CSSProperties = { border: 'none', borderTop: `3px double ${C.ink}`, margin: '0' };
const ruleThin: React.CSSProperties = { border: 'none', borderTop: `1px solid ${C.paperDark}`, margin: '0' };

function Kicker({ children, color = C.accent }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color, marginBottom: '6px' }}>
      {children}
    </div>
  );
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
  return (
    <a href={href} target="_blank" rel="noreferrer" style={{ fontFamily: MONO, fontSize: '10px', color, textDecoration: 'none', opacity: 0.8 }}>
      {'↗ thread'}
    </a>
  );
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

const TOC_ITEMS = [
  { id: 'partners',  emoji: '🤝', label: 'Partners',       color: C.partners.line },
  { id: 'pilot',     emoji: '🎯', label: 'Pilot Success',  color: C.pilot.line    },
  { id: 'product',   emoji: '⚙️',  label: 'Product Update', color: C.product.line  },
  { id: 'topics',    emoji: '🔭', label: 'Topics',         color: C.topics.line   },
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

  const scrollTo = (id: string) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  return (
    <nav style={{ borderTop: `1px solid ${C.paperDark}`, borderBottom: `1px solid ${C.paperDark}`, padding: 'clamp(12px, 2vw, 16px) 0', marginBottom: 'clamp(24px, 4vw, 36px)' }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: C.inkFaint, marginBottom: '10px' }}>In this issue</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', overflowX: 'auto', WebkitOverflowScrolling: 'touch', gap: '6px 0' }}>
        {TOC_ITEMS.map((item, i) => (
          <React.Fragment key={item.id}>
            <button onClick={() => scrollTo(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', fontFamily: SANS, fontSize: 'clamp(12px, 1.8vw, 13px)', fontWeight: activeId === item.id ? 700 : 400, color: activeId === item.id ? item.color : C.inkMid, whiteSpace: 'nowrap', transition: 'color 0.15s', textDecoration: activeId === item.id ? 'underline' : 'none', textUnderlineOffset: '3px' }}>
              {item.emoji} {item.label}
            </button>
            {i < TOC_ITEMS.length - 1 && <span style={{ fontFamily: SANS, color: C.inkFaint, fontSize: '12px', padding: '4px 10px', userSelect: 'none' }}>·</span>}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}

export default function KinshipMagazineIssue8() {
  return (
    <div style={{ background: C.paper, minHeight: '100dvh', fontFamily: SERIF }}>
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 clamp(16px, 5vw, 32px) clamp(40px, 6vw, 64px)' }}>

        {/* Masthead */}
        <div style={{ padding: 'clamp(18px, 3vw, 28px) 0 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: SANS, fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.inkFaint, marginBottom: '10px' }}>
            <span>The Kinship Intelligence Brief</span>
            <span>Aug 18–22, 2026</span>
          </div>
          <hr style={ruleDouble} />
          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(34px, 7vw, 66px)', fontWeight: 700, color: C.ink, textAlign: 'center', margin: 'clamp(12px, 2.5vw, 20px) 0 8px', lineHeight: 1.08, letterSpacing: '-0.01em' }}>
            The Kinship Fall Countdown Issue
          </h1>
          <p style={{ fontFamily: SANS, fontSize: '14px', color: C.inkFaint, textAlign: 'center', margin: '0 0 clamp(12px, 2.5vw, 20px)' }}>
            Issue #8 &middot; Aug 18&ndash;22, 2026 &middot; Produced by Hermes
          </p>
          <hr style={ruleThick} />
        </div>

        {/* Lede */}
        <div style={{ background: C.ink, color: C.paper, padding: 'clamp(16px, 3vw, 24px) clamp(20px, 4vw, 32px)', margin: 'clamp(0px, 1vw, 8px) 0' }}>
          <div style={{ fontFamily: SANS, fontSize: '11px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.accentFaint, marginBottom: '10px' }}>This week</div>
          <p style={{ fontFamily: SERIF, fontSize: 'clamp(16px, 2.8vw, 20px)', lineHeight: 1.5, margin: 0, color: C.paper }}>
            IMG Academy — the US's premier sports school — is all-but-committed to a Jan or Sep 2027 pilot. Sixteen fall pilots are now live-ready. The K-SEL reflection bank shipped, the lesson emulator went live, MobyMax integration deepened, and the US Department of Education released its first classroom AI guidance. Six fall weeks remain.
          </p>
        </div>

        {/* Stats bar */}
        <div style={{ display: 'flex', gap: 'clamp(16px, 4vw, 32px)', padding: 'clamp(16px, 3vw, 24px) 0', borderBottom: `1px solid ${C.paperDark}`, flexWrap: 'wrap' }}>
          {[
            { n: '43', label: 'channels swept' },
            { n: '82', label: 'messages read' },
            { n: '8', label: 'signals extracted' },
            { n: '16', label: 'fall pilots ready' },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontFamily: SANS, fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 800, color: C.accent, lineHeight: 1 }}>{s.n}</span>
              <span style={{ fontFamily: SANS, fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.inkFaint }}>{s.label}</span>
            </div>
          ))}
        </div>

        <TableOfContents />

        {/* ──────────────── PARTNERS ──────────────── */}
        <div style={{ marginTop: 'clamp(32px, 5vw, 52px)' }}>
          <SectionLabel id="partners" emoji="🤝" title="Partners Update" color={C.partners.line} bg={C.partners.bg} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'clamp(16px, 2.5vw, 24px)', marginTop: 'clamp(16px, 2.5vw, 24px)' }}>

            <div style={{ borderTop: `2px solid ${C.partners.line}`, paddingTop: '14px' }}>
              <Kicker color={C.partners.line}>New — Sports Academy</Kicker>
              <div style={{ fontFamily: SERIF, fontSize: '17px', fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: '8px' }}>IMG Academy: Verbal commitment for Jan or Sep 2027 pilot</div>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                IMG Academy, the US&apos;s premier sports school and a Nord Anglia–affiliated institution, had a great call this week. All but a formal verbal commit for a pilot from Travis Brady — January or September 2027 start.
              </div>
              <SoWhat text="Nord Anglia affiliation means this could open a pipeline to their 80+ schools globally. A Jan pilot would be the first US pilot Kinship has hosted solo." />
            </div>

            <div style={{ borderTop: `2px solid ${C.partners.line}`, paddingTop: '14px' }}>
              <Kicker color={C.partners.line}>Partnership Operations</Kicker>
              <div style={{ fontFamily: SERIF, fontSize: '17px', fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: '8px' }}>New <span style={{ fontFamily: MONO, fontSize: '13px' }}>issues@buildkinship.com</span> inbox for pilot support</div>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                The team stood up a dedicated support inbox after a July-vintage conversation about pilot triage. A new Google Workspace account (with human accountability) went live for school support tickets, rather than an alias, to keep lines clear as pilots scale.
              </div>
              <SoWhat text="Pilot Success team now has a dedicated support inbox. First real operations infrastructure beyond Slack for schools." />
            </div>

            <div style={{ borderTop: `2px solid ${C.partners.line}`, paddingTop: '14px' }}>
              <Kicker color={C.partners.line}>Enterprise Prospect</Kicker>
              <div style={{ fontFamily: SERIF, fontSize: '17px', fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: '8px' }}>UCC: Two in-person meetings set for Aug 24</div>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                Two in-person meetings at University of Toronto Schools (UCC) on August 24 — with VP Learning &amp; Innovation and VP Advancement — confirmed as key champions. A separate meeting exploring an IB/AP Math partnership with PhysicsGraph founder is also on the docket.
              </div>
              <SoWhat text="UCC is a flagship school and these champion-level meetings signal deal seriousness. PhysicsGraph partnership could expand Kinship's math coverage into IB/AP." />
              <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0ASVC73LQN/p1787300000000000" color={C.partners.line} />
            </div>

            <div style={{ borderTop: `2px solid ${C.partners.line}`, paddingTop: '14px' }}>
              <Kicker color={C.partners.line}>Parent Communications</Kicker>
              <div style={{ fontFamily: SERIF, fontSize: '17px', fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: '8px' }}>Parent FAQ coming — TDSB, York, Mulgrave, and Rosseau have all asked</div>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                Multiple schools are independently requesting parent communication materials. TDSB sent an explicit ask this week. Conversations with York, Mulgrave, and Rosseau next week will surface specific parent FAQ needs.
              </div>
              <SoWhat text="This is now a pattern signal — schools want parent materials before launch. Building one reusable FAQ template now could unblock multiple pilots simultaneously." />
              <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0B6Z4MFA3X/p1787280000000000" color={C.partners.line} />
            </div>

          </div>

          {/* Pipeline reporting */}
          <div style={{ marginTop: 'clamp(16px, 2.5vw, 24px)', borderTop: `1px solid ${C.paperDark}`, paddingTop: '16px' }}>
            <Kicker color={C.partners.line}>Process</Kicker>
            <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
              <strong style={{ color: C.ink }}>New weekly pipeline reporting process launched.</strong> The partnerships team restructured Monday meetings: numbers-first, pipeline velocity check, then deal-by-deal. A walkthrough recording was shared for onboarding. The Hermes weekly tracker skill was also deployed to pull CRM signals automatically from meetings and Slack.
            </div>
          </div>

          {/* Salta */}
          <div style={{ marginTop: 'clamp(16px, 2.5vw, 24px)', borderTop: `1px solid ${C.paperDark}`, paddingTop: '16px' }}>
            <Kicker color={C.partners.line}>Brazil Prospect</Kicker>
            <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
              <strong style={{ color: C.ink }}>Grupo Salta Educação (Brazil):</strong> Call held this week with Christine Pereira (pedagogical director). The team demoed Hearth and Horizon and tested a new K12 transformation talk track. Early signals; follow-up in progress.
            </div>
            <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0BH47VPSKZ/p1787250000000000" color={C.partners.line} />
          </div>
        </div>

        {/* ──────────────── PILOT SUCCESS ──────────────── */}
        <div style={{ marginTop: 'clamp(32px, 5vw, 52px)' }}>
          <SectionLabel id="pilot" emoji="🎯" title="Pilot Success" color={C.pilot.line} bg={C.pilot.bg} />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'clamp(16px, 2.5vw, 24px)', marginTop: 'clamp(16px, 2.5vw, 24px)' }}>

            <div style={{ borderTop: `2px solid ${C.pilot.line}`, paddingTop: '14px' }}>
              <Kicker color={C.pilot.line}>MAP Testing</Kicker>
              <div style={{ fontFamily: SERIF, fontSize: '17px', fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: '8px' }}>NWEA MAP training completed — secure browser decision pending</div>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                MAP training ran this week. The team is recommending NWEA&apos;s Secure Browser as the default for managed-fleet schools and Chromebook deployments, with regular Chrome as a fallback — mirroring NWEA&apos;s own recommendation. Chrome version requirements (143+) are being confirmed with the NWEA rep.
              </div>
              <SoWhat text="Clean MAP baseline data is foundational to Kinship's impact story. Getting the browser setup right before schools open matters enormously." />
              <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0BCBAJFBPC/p1787290000000000" color={C.pilot.line} />
            </div>

            <div style={{ borderTop: `2px solid ${C.pilot.line}`, paddingTop: '14px' }}>
              <Kicker color={C.pilot.line}>Math Academy Readiness</Kicker>
              <div style={{ fontFamily: SERIF, fontSize: '17px', fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: '8px' }}>Ontario curriculum Grades 4–12 landing this week from Math Academy</div>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                Jason/Math Academy confirmed: Ontario Grades 4–8 are available now. Grade 9, Grade 10 (both courses), and Grade 11 Functions &amp; Applications expected Friday. Grade 11 Functions and all Grade 12 expected Saturday. Auditing continues. Leaderboards will be turned off by default for all schools.
              </div>
              <SoWhat text="Ontario curriculum coverage unlocks all Canadian pilots. Turning off leaderboards was a Pilot Success call — the team is setting sensible defaults rather than leaving configuration to schools." />
              <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0BCBAJFBPC/p1787220000000000" color={C.pilot.line} />
            </div>

            <div style={{ borderTop: `2px solid ${C.pilot.line}`, paddingTop: '14px' }}>
              <Kicker color={C.pilot.line}>Research Infrastructure</Kicker>
              <div style={{ fontFamily: SERIF, fontSize: '17px', label: 700, color: C.ink, lineHeight: 1.3, marginBottom: '8px', fontWeight: 700 }}>Baseline, midpoint, and endpoint surveys ready — ~400 student sample size confirmed</div>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                Teacher and student surveys (baseline, midpoint, endpoint) are finalized and in a shared Drive folder. The team has confirmed an ~400 student sample — a signal-to-noise ratio strong enough for rigorous analysis. Philip Oreopoulos (Distinguished Professor, Economics of Education Policy, U of T) was flagged as a potential academic partner for external evaluation.
              </div>
              <SoWhat text="A ~400 student RCT-style sample is meaningful. Getting an external academic evaluator before pilots start would dramatically strengthen Kinship's evidence story." />
            </div>

            <div style={{ borderTop: `2px solid ${C.pilot.line}`, paddingTop: '14px' }}>
              <Kicker color={C.pilot.line}>RHA — License Operations</Kicker>
              <div style={{ fontFamily: SERIF, fontSize: '17px', fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: '8px' }}>RHA third-party licenses: Lexia coming, Rosetta Stone active, Israeli Hebrew app still being chased</div>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                Lexia invoice received from Eos — needs payment (due Sep 16). Rosetta Stone credentials are now available. An Israeli Hebrew app (JiTap) is still being tracked down. MOU language confirmed: any third-party app costs will be credited back to RHA.
              </div>
              <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0ANG4EMU3D/p1787200000000000" color={C.pilot.line} />
            </div>

            <div style={{ borderTop: `2px solid ${C.pilot.line}`, paddingTop: '14px' }}>
              <Kicker color={C.pilot.line}>TDSB</Kicker>
              <div style={{ fontFamily: SERIF, fontSize: '17px', fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: '8px' }}>TDSB Supply Ontario bid pushed to March 2027</div>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                The Learning Services procurement bid through Supply Ontario has been delayed to March 2027. The team is exploring alternative entry paths.
              </div>
              <SoWhat text="TDSB is a massive district — the delay isn&apos;t a rejection, but procurement timelines are long. Exploring alternative paths now (relationship-based entry, pilot-first) is the right move." />
            </div>

            <div style={{ borderTop: `2px solid ${C.pilot.line}`, paddingTop: '14px' }}>
              <Kicker color={C.pilot.line}>Partner Guide</Kicker>
              <div style={{ fontFamily: SERIF, fontSize: '17px', fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: '8px' }}>Math Pilot Partner Guide updated + DPA template live</div>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                The Math Pilot Partner Guide was updated this week: a folder structure for new schools was added, shared at the 6-weeks-out milestone. A separate DPA template is now live for schools that have already signed a MOU and need the DPA signed separately.
              </div>
            </div>

          </div>
        </div>

        {/* ──────────────── PRODUCT ──────────────── */}
        <div style={{ marginTop: 'clamp(32px, 5vw, 52px)' }}>
          <SectionLabel id="product" emoji="⚙️" title="Product Update" color={C.product.line} bg={C.product.bg} />
          <div style={{ fontFamily: SANS, fontSize: '12px', color: C.inkFaint, fontStyle: 'italic', margin: 'clamp(10px, 2vw, 14px) 0 clamp(14px, 2.5vw, 20px)' }}>
            What shipped this week — translated for non-engineers
          </div>

          {/* New features */}
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.product.line, marginBottom: '12px' }}>✨ New Features</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'clamp(16px, 2.5vw, 24px)', marginBottom: 'clamp(20px, 3vw, 32px)' }}>

            <div style={{ borderTop: `2px solid ${C.product.line}`, paddingTop: '14px' }}>
              <Kicker color={C.product.line}>Hearth &amp; Horizon — Major</Kicker>
              <div style={{ fontFamily: SERIF, fontSize: '16px', fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: '8px' }}>Lesson Emulator: Teachers can now preview every lesson before students see it</div>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                Teachers can now step through any lesson exactly as a student would — including condition knobs to simulate different knowledge states. Nothing is saved during preview. This was the most-requested teacher feature in pilot feedback.
              </div>
            </div>

            <div style={{ borderTop: `2px solid ${C.product.line}`, paddingTop: '14px' }}>
              <Kicker color={C.product.line}>Hearth — Reading Support</Kicker>
              <div style={{ fontFamily: SERIF, fontSize: '16px', fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: '8px' }}>MobyMax integration: live per-problem signals + per-student read-aloud toggle</div>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                Kinship now receives live problem-level signals from MobyMax, and teachers can toggle text-to-speech for individual students. Greater Dayton specifically requested TTS for lessons and practice (but not quizzes) — this delivers that.
              </div>
              <SoWhat text="Greater Dayton asked for TTS this week and the feature shipped. That&apos;s same-week responsiveness. This kind of loop is a competitive advantage." />
            </div>

            <div style={{ borderTop: `2px solid ${C.product.line}`, paddingTop: '14px' }}>
              <Kicker color={C.product.line}>Hearth — Assessment</Kicker>
              <div style={{ fontFamily: SERIF, fontSize: '16px', fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: '8px' }}>K-SEL reflection bank shipped (96 items, KIN-273)</div>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                End-of-session reflection questions now draw from the ratified 96-item K-SEL instrument. Selection is deterministic based on the session&apos;s content. The team described it as &ldquo;:fire:&rdquo; — this grounds Kinship&apos;s emotional learning work in a rigorous academic instrument.
              </div>
              <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0ANK3CJM8V/p1787180000000000" color={C.product.line} />
            </div>

            <div style={{ borderTop: `2px solid ${C.product.line}`, paddingTop: '14px' }}>
              <Kicker color={C.product.line}>Hearth — Placement</Kicker>
              <div style={{ fontFamily: SERIF, fontSize: '16px', fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: '8px' }}>Year plans now generate a placement exam that seeds student knowledge graphs</div>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                When a teacher creates a Year Plan, Kinship now auto-generates a placement exam. When a student submits their answers, those results seed their FSRS cold-start priors — meaning the system knows where to start rather than guessing.
              </div>
            </div>

            <div style={{ borderTop: `2px solid ${C.product.line}`, paddingTop: '14px' }}>
              <Kicker color={C.product.line}>Hearth — Math Academy</Kicker>
              <div style={{ fontFamily: SERIF, fontSize: '16px', fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: '8px' }}>Auto-detect Math Academy school ID from API keys</div>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                School setup is now simpler: Hearth automatically detects the Math Academy school ID from the API key. No more manual entry per school.
              </div>
            </div>

            <div style={{ borderTop: `2px solid ${C.product.line}`, paddingTop: '14px' }}>
              <Kicker color={C.product.line}>Horizon — Parent App</Kicker>
              <div style={{ fontFamily: SERIF, fontSize: '16px', fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: '8px' }}>Affirmation licence + phase-aware help in parent-facing view</div>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                Parents/guardians now see context-aware encouragement and support guidance in Horizon that adapts to where their child is in a learning phase. Reflection questions now render only in Horizon (not in the Chrome extension — which now shows a reminder instead).
              </div>
            </div>

          </div>

          {/* Improvements */}
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.product.line, marginBottom: '12px' }}>🛠️ Improvements &amp; Fixes</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'clamp(14px, 2vw, 20px)', marginBottom: 'clamp(20px, 3vw, 32px)' }}>

            <div style={{ borderTop: `1px solid ${C.paperDark}`, paddingTop: '12px' }}>
              <Kicker color={C.product.line}>Harness Cleanup</Kicker>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                <strong style={{ color: C.ink }}>12 PRs since Aug 13 — coding harness first pass complete (KIN-224).</strong> The coding environment is now cleaner and more reliable. A second-pass roadmap (KIN-281) is already scoped.
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${C.paperDark}`, paddingTop: '12px' }}>
              <Kicker color={C.product.line}>Security</Kicker>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                <strong style={{ color: C.ink }}>Security assessment first pass closed (KIN-271).</strong> Stale API keys found in git history were identified and confirmed rotated. Sentry DSNs blanked and credential headers scrubbed.
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${C.paperDark}`, paddingTop: '12px' }}>
              <Kicker color={C.product.line}>Demo Schools (KIN-321)</Kicker>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                <strong style={{ color: C.ink }}>Configurable seeded demo schools — issue created, milestone Math Pilot.</strong> Multiple team members were in Kinship School simultaneously this week and caused confusion. Demo schools with isolated data are now a priority.
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${C.paperDark}`, paddingTop: '12px' }}>
              <Kicker color={C.product.line}>Extension (KIN-234)</Kicker>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                <strong style={{ color: C.ink }}>Tally widget: shielded from stray taps and provider occlusion.</strong> PR-481 reviewed and merged — the Tally widget in the Chrome extension now handles edge cases in multi-provider environments.
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${C.paperDark}`, paddingTop: '12px' }}>
              <Kicker color={C.product.line}>Horizon — Theme Lock</Kicker>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                <strong style={{ color: C.ink }}>School admins can now lock the Horizon theme for all students.</strong> If you don&apos;t set a lock, students can still change their own skin. An option to disable this is now available in school settings.
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${C.paperDark}`, paddingTop: '12px' }}>
              <Kicker color={C.product.line}>Lexia Core5 + Extension</Kicker>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                <strong style={{ color: C.ink }}>Lexia Core5 telemetry gaps closed; Extension VLM escalation tier added (off by default).</strong> More signals in, smarter extension — both improvements targeted at the RHA reading pilot.
              </div>
            </div>

          </div>

          {/* Product feedback callout */}
          <div style={{ background: C.product.bg, border: `1px solid ${C.product.line}`, borderRadius: '0', padding: 'clamp(14px, 2vw, 20px)', marginTop: 'clamp(16px, 2.5vw, 24px)' }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.product.line, marginBottom: '8px' }}>From the field this week</div>
            <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
              The feedback loop between Pilot Success and Engineering is running in near-real-time. TTS requested Monday, shipped Tuesday. Demo school isolation raised Wednesday, Linear issue created same day. K-SEL reviewed by academic partner and shipped Friday.
            </div>
          </div>
        </div>

        {/* ──────────────── TOPICS ──────────────── */}
        <div style={{ marginTop: 'clamp(32px, 5vw, 52px)' }}>
          <SectionLabel id="topics" emoji="🔭" title="Topics Worth Watching" color={C.topics.line} bg={C.topics.bg} />

          {/* Deep dive: US DoE AI guidance */}
          <div style={{ marginTop: 'clamp(16px, 2.5vw, 24px)', borderTop: `2px solid ${C.topics.line}`, paddingTop: '16px' }}>
            <Kicker color={C.topics.line}>Deep Dive — Regulatory</Kicker>
            <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(20px, 3.5vw, 28px)', fontWeight: 700, color: C.ink, lineHeight: 1.25, margin: '0 0 clamp(10px, 1.5vw, 14px)' }}>
              US Department of Education: First classroom AI guidance released
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'clamp(14px, 2vw, 20px)' }}>
              <div>
                <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.topics.line, marginBottom: '6px' }}>What it is</div>
                <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                  The US DoE released its first formal guidance on the &ldquo;Responsible Use of Education Technology in the Classroom.&rdquo; It&apos;s not binding — but it sets the interpretive frame for how district procurement officers will evaluate edtech products.
                </div>
              </div>
              <div>
                <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.topics.line, marginBottom: '6px' }}>Five questions every product must answer</div>
                <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                  The guidance asks five questions: What learning problem does it solve? When should it be used? What does the evidence say? Who is accountable? What are the risks? The Kinship team already answered these this week — the doc is linked in #topic-edtech.
                </div>
              </div>
              <div>
                <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.topics.line, marginBottom: '6px' }}>What it means for Kinship</div>
                <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                  Kinship&apos;s teacher-in-the-loop model and evidence-first approach map well to these five questions. With a US pilot in discussion (IMG Academy, Greater Dayton), having a ready answer to these questions is now a sales prerequisite, not optional.
                </div>
              </div>
            </div>
            <SoWhat text="Turn the five-question answers into a one-pager. This is already a procurement checklist for some US districts — proactively sharing it with IMG Academy and Greater Dayton shows maturity." />
            <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0BHY9EV2AG/p1787300000000000" color={C.topics.line} />
          </div>

          {/* Grok */}
          <div style={{ marginTop: 'clamp(20px, 3vw, 28px)', borderTop: `2px solid ${C.topics.line}`, paddingTop: '16px' }}>
            <Kicker color={C.topics.line}>Also This Week — AI Models</Kicker>
            <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 700, color: C.ink, lineHeight: 1.25, margin: '0 0 8px' }}>Grok Build: team exploring xAI models for Kinship tooling</h3>
            <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, marginBottom: '10px' }}>
              A team member used Grok Build on a hobby project and was &ldquo;generally impressed&rdquo; — specifically, less complexity creep. A thread in #topic-tooling explored whether to add Grok models to Kinship&apos;s LiteLLM gateway (superconductor or other cloud). OpenRouter acquisition talk ($7B) was also shared. The framing: &ldquo;The singularity happened on Jan 1&rdquo; — referring to AI&apos;s trajectory in 2026.
            </div>
            <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0B5FL7KTKN/p1787220000000000" color={C.topics.line} />
          </div>

          {/* Duolingo XP analysis */}
          <div style={{ marginTop: 'clamp(20px, 3vw, 28px)', borderTop: `2px solid ${C.topics.line}`, paddingTop: '16px' }}>
            <Kicker color={C.topics.line}>Also This Week — Engagement Design</Kicker>
            <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 700, color: C.ink, lineHeight: 1.25, margin: '0 0 8px' }}>Duolingo XP analysis — relevance to Kinship&apos;s own targets</h3>
            <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, marginBottom: '10px' }}>
              An X post analyzing Duolingo&apos;s XP economy sparked discussion in #topic-collective-intelligence. Key point: Duolingo&apos;s weekly target was 150 XP with a minimum of 4 active days — a structure the team noted is &ldquo;pretty close to our own targets.&rdquo; The thread explored what Kinship can learn from Duolingo&apos;s engagement mechanics.
            </div>
            <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0ATK34QS8K/p1787200000000000" color={C.topics.line} />
          </div>

          {/* Learning science */}
          <div style={{ marginTop: 'clamp(20px, 3vw, 28px)', borderTop: `2px solid ${C.topics.line}`, paddingTop: '16px' }}>
            <Kicker color={C.topics.line}>Also This Week — Learning Science</Kicker>
            <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 700, color: C.ink, lineHeight: 1.25, margin: '0 0 8px' }}>IEEE Learning Engineering Webinar + pedagogical frameworks for Kinship</h3>
            <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, marginBottom: '10px' }}>
              A team member attended an IEEE LTSC learning engineering webinar this week and shared pedagogical frameworks that could ground Kinship&apos;s design work: Bloom&apos;s Taxonomy, Backward Design, Cognitive Load Theory (CLT), Universal Design for Learning (UDL). Strong endorsement from the team to apply these formally. Also shared: a post on the multiplicative effect of teacher judgment + student motivation — core to Kinship&apos;s model.
            </div>
            <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0BHY9EV2AG/p1787180000000000" color={C.topics.line} />
          </div>

          {/* EdTech tutors */}
          <div style={{ marginTop: 'clamp(20px, 3vw, 28px)', borderTop: `1px solid ${C.paperDark}`, paddingTop: '14px' }}>
            <Kicker color={C.topics.line}>Also This Week — Competitive</Kicker>
            <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
              <strong style={{ color: C.ink }}>EdTech Insiders: AI tutor vs homework helper.</strong> A good post distinguishing the two categories — a distinction Kinship already makes clearly. Singapore consultant also surfaced Adaptemy (adaptive learning engine) as a regional player to watch.
            </div>
          </div>

          {/* Brain changelog */}
          <div style={{ marginTop: 'clamp(20px, 3vw, 28px)', borderTop: `1px solid ${C.paperDark}`, paddingTop: '14px' }}>
            <Kicker color={C.topics.line}>Brain Changelog</Kicker>
            <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
              <strong style={{ color: C.ink }}>#brain-changelog: automation reconnected after password change disruption.</strong> A password change on the brain@ email account broke the Granola → Brain automation. The team diagnosed and reconnected it. Missed calls are being reviewed for ingestion. Future calls should be captured automatically.
            </div>
          </div>
        </div>

        {/* ──────────────── FOOTER ──────────────── */}
        <div style={{ marginTop: 'clamp(40px, 6vw, 56px)', borderTop: `3px double ${C.ink}`, paddingTop: 'clamp(20px, 3vw, 28px)' }}>
          <hr style={ruleThin} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: 'clamp(12px, 2vw, 20px)', marginTop: 'clamp(16px, 2.5vw, 20px)', fontFamily: SANS, fontSize: '12px', color: C.inkFaint }}>
            <div>
              <strong style={{ color: C.inkDim, display: 'block', marginBottom: '4px' }}>Hottest thread this week</strong>
              Math Academy student accounts &amp; usernames — 16 replies in #topic-product-feedback
            </div>
            <div>
              <strong style={{ color: C.inkDim, display: 'block', marginBottom: '4px' }}>Coverage</strong>
              Aug 18&ndash;22, 2026 &middot; 43 channels swept &middot; 82 messages read &middot; 8 signals extracted
            </div>
            <div>
              <strong style={{ color: C.inkDim, display: 'block', marginBottom: '4px' }}>Issue</strong>
              #8 of The Kinship Intelligence Brief &middot; Produced by Hermes on Aug 21, 2026
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
