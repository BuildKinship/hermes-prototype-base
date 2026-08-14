'use client';
// needed for useState + useEffect (TOC IntersectionObserver, scroll animations, interactive navigation)
import React, { useState, useEffect } from 'react';

/* ─── Design tokens (Newspaper System — Issue #4+ canonical warm amber) ────── */
const C = {
  ink:         '#16120c',
  inkMid:      '#3d3328',
  inkDim:      '#6b5e50',
  inkFaint:    '#a8998a',
  paper:       '#f7f3ed',
  paperWarm:   '#f0eade',
  paperDark:   '#e8e0d4',
  white:       '#fdfaf6',
  accent:      '#b83a0c',   // burnt orange — kickers, stats, "So what?"
  accentFaint: '#fef0e8',
  partners:    { line: '#1a6641', bg: '#f0fdf6', kicker: '#14532d' },
  pilot:       { line: '#1e4e96', bg: '#eff6ff', kicker: '#1e3a6e' },
  product:     { line: '#6d28d9', bg: '#f5f3ff', kicker: '#4c1d95' },
  topics:      { line: '#92400e', bg: '#fffbeb', kicker: '#78350f' },
};
const SERIF = "'Georgia', 'Times New Roman', serif";
const SANS  = "'Inter', 'Helvetica Neue', Arial, sans-serif";
const MONO  = "'IBM Plex Mono', 'Courier New', monospace";

/* ─── Rule helpers ─────────────────────────────────────────────────────────── */
const rule: React.CSSProperties = { border: 'none', borderTop: `1px solid ${C.paperDark}`, margin: '0' };
const ruleThick: React.CSSProperties = { border: 'none', borderTop: `3px solid ${C.ink}`, margin: '0' };
const ruleDouble: React.CSSProperties = { border: 'none', borderTop: `3px double ${C.ink}`, margin: '0' };

/* ─── Kicker component ─────────────────────────────────────────────────────── */
function Kicker({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div style={{
      fontFamily: SANS, fontSize: '10px', fontWeight: 700,
      letterSpacing: '0.14em', textTransform: 'uppercase',
      color, marginBottom: '6px',
    }}>
      {children}
    </div>
  );
}

/* ─── SoWhat component ─────────────────────────────────────────────────────── */
function SoWhat({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: SANS, fontSize: '12px', color: C.inkDim,
      marginTop: '10px', paddingTop: '10px',
      borderTop: `1px solid ${C.paperDark}`, lineHeight: 1.55,
    }}>
      <span style={{
        fontFamily: SANS, fontWeight: 700, fontSize: '10px',
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: C.accent, marginRight: '6px',
      }}>So what?</span>
      {children}
    </div>
  );
}

/* ─── ThreadLink component ─────────────────────────────────────────────────── */
function ThreadLink({ href, label = '↗ thread' }: { href: string; label?: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer"
      style={{
        fontFamily: MONO, fontSize: '10px', color: C.accent,
        textDecoration: 'none', opacity: 0.85,
      }}>
      {label}
    </a>
  );
}

/* ─── SectionLabel component ───────────────────────────────────────────────── */
function SectionLabel({ id, emoji, title, color, bg }: {
  id: string; emoji: string; title: string; color: string; bg: string;
}) {
  return (
    <div id={id} style={{ marginBottom: '0', scrollMarginTop: '80px' }}>
      <hr style={ruleThick} />
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        background: bg, padding: '12px 20px',
        borderBottom: `1px solid ${C.paperDark}`,
      }}>
        <span style={{ fontSize: '18px' }}>{emoji}</span>
        <span style={{
          fontFamily: SANS, fontWeight: 800, fontSize: '12px',
          letterSpacing: '0.12em', textTransform: 'uppercase', color,
        }}>
          {title}
        </span>
      </div>
    </div>
  );
}

/* ─── Table of Contents ────────────────────────────────────────────────────── */
const TOC_ITEMS = [
  { id: 'partners',  emoji: '🤝', label: 'Partners',        color: C.partners.line },
  { id: 'pilot',     emoji: '🎯', label: 'Pilot Success',   color: C.pilot.line },
  { id: 'product',   emoji: '⚙️',  label: 'Product Update', color: C.product.line },
  { id: 'topics',    emoji: '🔭', label: 'Topics',          color: C.topics.line },
];

function TableOfContents() {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );
    TOC_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav style={{
      borderTop: `1px solid ${C.paperDark}`,
      borderBottom: `1px solid ${C.paperDark}`,
      padding: 'clamp(12px, 2vw, 16px) 0',
      marginBottom: 'clamp(24px, 4vw, 36px)',
    }}>
      <div style={{
        fontFamily: SANS, fontWeight: 700, fontSize: '10px',
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: C.inkFaint, marginBottom: '10px',
      }}>
        In this issue
      </div>
      <div style={{
        display: 'flex', flexWrap: 'wrap',
        overflowX: 'auto', scrollbarWidth: 'none',
        gap: '6px 0',
      }}>
        {TOC_ITEMS.map((item, i) => (
          <React.Fragment key={item.id}>
            <button
              onClick={() => scrollTo(item.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '4px 0', fontFamily: SANS,
                fontSize: 'clamp(12px, 1.8vw, 13px)',
                fontWeight: activeId === item.id ? 700 : 400,
                color: activeId === item.id ? item.color : C.inkMid,
                whiteSpace: 'nowrap', transition: 'color 0.15s',
                textDecoration: activeId === item.id ? 'underline' : 'none',
                textUnderlineOffset: '3px',
              }}
            >
              {item.emoji} {item.label}
            </button>
            {i < TOC_ITEMS.length - 1 && (
              <span style={{
                fontFamily: SANS, color: C.inkFaint, fontSize: '12px',
                padding: '4px 10px', userSelect: 'none',
              }}>·</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════════════════ */
export default function KinshipMagazineIssue7() {
  return (
    <div style={{
      background: C.paper, minHeight: '100dvh', color: C.ink,
    }}>
      <main style={{
        maxWidth: '780px',
        margin: '0 auto',
        padding: '0 clamp(16px, 5vw, 32px) clamp(40px, 6vw, 64px)',
      }}>

        {/* ══ MASTHEAD ══════════════════════════════════════════════════════ */}
        <header style={{ paddingTop: 'clamp(24px, 4vw, 48px)' }}>
          {/* Utility bar */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            fontFamily: SANS, fontSize: '10px', fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: C.inkFaint, marginBottom: '10px',
          }}>
            <span>The Kinship Intelligence Brief</span>
            <span>Aug 11–15, 2026</span>
          </div>

          {/* Double rule */}
          <hr style={ruleDouble} />

          {/* Nameplate */}
          <h1 style={{
            fontFamily: SERIF, fontSize: 'clamp(34px, 7vw, 72px)', fontWeight: 700,
            color: C.ink, textAlign: 'center', margin: 'clamp(16px,3vw,28px) 0 8px',
            lineHeight: 1.1, letterSpacing: '-0.01em',
          }}>
            The Kinship First-Day Issue
          </h1>

          {/* Byline */}
          <p style={{
            fontFamily: SANS, fontSize: '14px', color: C.inkFaint,
            textAlign: 'center', margin: '0 0 clamp(16px,3vw,24px)',
          }}>
            Issue #7 · Aug 11–15, 2026 · Produced by Hermes
          </p>

          {/* Thick rule */}
          <hr style={ruleThick} />

          {/* Lede bar — dark bg, cream text */}
          <div style={{
            background: C.ink, color: C.paper,
            padding: 'clamp(12px,2vw,18px) clamp(16px,4vw,28px)',
            margin: '0', textAlign: 'center',
          }}>
            <p style={{
              fontFamily: SERIF, fontSize: 'clamp(14px, 2.5vw, 18px)',
              margin: '0', lineHeight: 1.5, color: '#f7f3ed',
            }}>
              🎉 RHA Day 1 goes live — a student stayed after class because they
              didn&apos;t want to stop. And we signed our first US public district MoU.
            </p>
          </div>

          {/* Thin rule */}
          <hr style={rule} />

          {/* Stats bar */}
          <div style={{
            display: 'flex', justifyContent: 'center', flexWrap: 'wrap',
            gap: 'clamp(16px, 4vw, 40px)',
            padding: 'clamp(14px, 2.5vw, 22px) 0',
          }}>
            {[
              { num: '43',  label: 'Channels Swept' },
              { num: '153', label: 'Messages Read' },
              { num: '9',   label: 'Signals Extracted' },
              { num: '16',  label: 'Fall Pilots Confirmed' },
            ].map(({ num, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: SERIF, fontSize: 'clamp(22px, 4vw, 32px)',
                  fontWeight: 700, color: C.accent, lineHeight: 1,
                }}>{num}</div>
                <div style={{
                  fontFamily: SANS, fontSize: '10px', fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: C.inkFaint, marginTop: '4px',
                }}>{label}</div>
              </div>
            ))}
          </div>
          <hr style={rule} />
        </header>

        {/* Table of Contents */}
        <TableOfContents />

        {/* ══ PARTNERS UPDATE ══════════════════════════════════════════════ */}
        <section style={{ marginTop: 'clamp(32px, 5vw, 52px)' }}>
          <SectionLabel
            id="partners"
            emoji="🤝"
            title="Partners Update"
            color={C.partners.kicker}
            bg={C.partners.bg}
          />

          <div style={{ paddingTop: 'clamp(20px, 3vw, 28px)', display: 'flex', flexDirection: 'column', gap: 'clamp(20px, 3vw, 28px)' }}>

            {/* Story 1 — US Public District MoU */}
            <div style={{ borderTop: `2px solid ${C.partners.line}`, paddingTop: '14px' }}>
              <Kicker color={C.partners.kicker}>Milestone · US Public District</Kicker>
              <h3 style={{ fontFamily: SERIF, fontSize: '18px', fontWeight: 700, color: C.ink, lineHeight: 1.3, margin: '0 0 8px' }}>
                First US public district MoU signed — Shrewsbury enters the pipeline
              </h3>
              <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0' }}>
                A signed Memorandum of Understanding arrived this week from Kinship&apos;s first US public school district. Shrewsbury is a public district — no entrance selectivity — which makes it a meaningful signal. The partnership lead noted the Superintendent previously transformed Edison Township and is now doing the same in Shrewsbury, describing him as &quot;a perfect partner for a total district partnership.&quot;
              </p>
              <SoWhat>
                This is the model that unlocks scale: a superintendent who already believes in school transformation, an open-enrollment public district, and the NJ geography where Curriki grant money ($10k verbal commitment) may already be earmarked. Partners team should prioritize an intro call with the Head of Teacher Dev upon return from RHA.
              </SoWhat>
              <div style={{ marginTop: '10px' }}>
                <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0ANS36DN3W/p1786547640601259" label="↗ #open-kinship thread" />
              </div>
            </div>

            {/* Story 2 — York gifted student */}
            <div style={{ borderTop: `2px solid ${C.partners.line}`, paddingTop: '14px' }}>
              <Kicker color={C.partners.kicker}>Active Pilot · York School</Kicker>
              <h3 style={{ fontFamily: SERIF, fontSize: '18px', fontWeight: 700, color: C.ink, lineHeight: 1.3, margin: '0 0 8px' }}>
                York&apos;s gifted Grade 7 math student surfaces a new D2C vs classroom experiment
              </h3>
              <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0' }}>
                York is exploring using Kinship for a single Grade 7 student with &quot;gifted challenges&quot; in math — a student far ahead of peers who needs advanced content. A discovery meeting with the Head of School, Director of Academics, and head of inclusion is scheduled for next week. The team sees this as a natural A/B test of direct-to-student vs. classroom delivery.
              </p>
              <SoWhat>
                A gifted student use case at York could become an accelerated-learning template replicable across other private schools. The complexity risk (one student, one school) is real, but the learning value is high. Worth proceeding carefully with defined success criteria.
              </SoWhat>
              <div style={{ marginTop: '10px' }}>
                <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0B43SP08TB/p1786537013487019" label="↗ #edu-york thread" />
              </div>
            </div>

            {/* Story 3 — Data privacy policy */}
            <div style={{ borderTop: `2px solid ${C.partners.line}`, paddingTop: '14px' }}>
              <Kicker color={C.partners.kicker}>Ops · Compliance</Kicker>
              <h3 style={{ fontFamily: SERIF, fontSize: '18px', fontWeight: 700, color: C.ink, lineHeight: 1.3, margin: '0 0 8px' }}>
                Personal Information Policy updated — 16-pilot secure file-sharing process established
              </h3>
              <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0' }}>
                The Kinship Personal Information Policy was updated to reflect the database move from Neon to Supabase (now Canadian-domiciled). A secure file-sharing flow for student rosters was agreed: school-specific folders in Google Drive, time-limited access links, with data deleted from Kinship storage after ingestion. All 16 fall pilots now have dedicated Drive folders. The pilot team shared a walkthrough video to onboard everyone on the new structure.
              </p>
              <SoWhat>
                Compliant data handling is becoming a blocker for new pilot sign-offs, especially in Ontario (FIPPA) and US public districts. This infrastructure is now in place — but it needs to be surfaced to prospective partners as a trust signal, not just an internal process.
              </SoWhat>
              <div style={{ marginTop: '10px' }}>
                <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0B6Z4MFA3X/p1786376456333239" label="↗ #team-partnerships thread" />
              </div>
            </div>

            {/* Story 4 — Greater Dayton MA API */}
            <div style={{ borderTop: `2px solid ${C.partners.line}`, paddingTop: '14px' }}>
              <Kicker color={C.partners.kicker}>Pilot Ops · Greater Dayton</Kicker>
              <h3 style={{ fontFamily: SERIF, fontSize: '18px', fontWeight: 700, color: C.ink, lineHeight: 1.3, margin: '0 0 8px' }}>
                Greater Dayton pilot set for Sept 8 — Math Academy API access being coordinated
              </h3>
              <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0' }}>
                Greater Dayton&apos;s school year has started and the Kinship pilot launches Sept 8. The school already has an MA account — the team is working to obtain the teacher&apos;s MA email to relay to Jason at Math Academy for the specific API key needed to connect their account to Kinship.
              </p>
              <SoWhat>
                API access dependency on Math Academy for every new school is a recurring friction. Tracking it per-pilot and ensuring Jason&apos;s team has a direct channel for these requests will reduce delay at launch.
              </SoWhat>
              <div style={{ marginTop: '10px' }}>
                <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0BHZECFG05/p1786391445827979" label="↗ #edu-greater-dayton" />
              </div>
            </div>

          </div>
        </section>

        {/* ══ PILOT SUCCESS UPDATE ══════════════════════════════════════════ */}
        <section style={{ marginTop: 'clamp(32px, 5vw, 52px)' }}>
          <SectionLabel
            id="pilot"
            emoji="🎯"
            title="Pilot Success Update"
            color={C.pilot.kicker}
            bg={C.pilot.bg}
          />

          <div style={{ paddingTop: 'clamp(20px, 3vw, 28px)', display: 'flex', flexDirection: 'column', gap: 'clamp(20px, 3vw, 28px)' }}>

            {/* Story 1 — RHA Day 1 */}
            <div style={{ borderTop: `2px solid ${C.pilot.line}`, paddingTop: '14px' }}>
              <Kicker color={C.pilot.kicker}>Live Pilot · Rundle Heritage Academy</Kicker>
              <h3 style={{ fontFamily: SERIF, fontSize: '18px', fontWeight: 700, color: C.ink, lineHeight: 1.3, margin: '0 0 8px' }}>
                RHA goes live — 75-reply session thread, kids didn&apos;t want to stop
              </h3>
              <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0' }}>
                RHA&apos;s first live student session generated the week&apos;s biggest thread: 75 replies across the Pilot Success team as issues were triaged in real time. Among the highlights: a student staying after the session because they didn&apos;t want to stop working; a parent reaching out unsolicited to say their son was &quot;more animated about school than ever&quot; after hitting 4% of the curriculum already. Student surveys were administered at session end. Attendance tracking and MA data-display bugs were flagged and handled within hours.
              </p>
              <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '8px 0 0' }}>
                The Pilot Success team ran training Tue–Thu with teacher Camila while engineering monitored the live session. Several Horizon UI adjustments were made mid-session (hiding unnecessary Horizon features, removing student-to-student comments).
              </p>
              <SoWhat>
                The &quot;student didn&apos;t want to stop&quot; moment is the product story — log it, screenshot it, and surface it in partner conversations. The session also confirmed that live-session triage needs a cleaner escalation path between Pilot Success and Engineering for future deployments.
              </SoWhat>
              <div style={{ marginTop: '10px' }}>
                <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0ANG4EMU3D/p1786554184016629" label="↗ #edu-rha session thread (75 replies)" />
              </div>
            </div>

            {/* Story 2 — Learning velocity signal */}
            <div style={{ borderTop: `2px solid ${C.pilot.line}`, paddingTop: '14px' }}>
              <Kicker color={C.pilot.kicker}>Product Signal · Teacher Feedback</Kicker>
              <h3 style={{ fontFamily: SERIF, fontSize: '18px', fontWeight: 700, color: C.ink, lineHeight: 1.3, margin: '0 0 8px' }}>
                Teachers need to see &quot;learning velocity&quot; — the interplay of time, lessons, and XP
              </h3>
              <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0' }}>
                Camila flagged a gap: Hearth doesn&apos;t cleanly surface learning velocity for non-Math Academy students — defined as time spent multiplied by lessons completed. Teachers working across multiple platforms need a unified view of whether students are making progress relative to time invested, especially when MA is not the sole platform. A separate ask: desktop/tab-level notifications for open Signals so teachers can multitask safely outside of Hearth.
              </p>
              <SoWhat>
                These two signals (learning velocity + background notifications) both point to the same teacher need: situational awareness without being tethered to the app. Engineering has tickets open on both. Pilot Success should clarify with Camila whether an existing XP/lesson metric suffices or whether a dedicated velocity view is needed.
              </SoWhat>
              <div style={{ marginTop: '10px' }}>
                <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0B9FHWR8RE/p1786535369701369" label="↗ #topic-product-feedback" />
                {' '}
                <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0B9FHWR8RE/p1786533822403239" label="↗ notification request" />
              </div>
            </div>

            {/* Story 3 — Brown pilot */}
            <div style={{ borderTop: `2px solid ${C.pilot.line}`, paddingTop: '14px' }}>
              <Kicker color={C.pilot.kicker}>Upcoming Pilot · Brown</Kicker>
              <h3 style={{ fontFamily: SERIF, fontSize: '18px', fontWeight: 700, color: C.ink, lineHeight: 1.3, margin: '0 0 8px' }}>
                Brown pilot resurrected — teacher Carrie&apos;s class joining in January
              </h3>
              <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0' }}>
                The Brown pilot thread was revived this week after an email from teacher Carrie surfaced through internal channels. Carrie will participate in training but her class won&apos;t start until January. A discovery call with the school contact Andrea is scheduled for next week to clarify access and scope.
              </p>
              <SoWhat>
                Brown is an existing relationship that needs re-warming with a clear Jan 2027 pilot plan. The Head of Teacher Dev should be looped in to ensure Carrie gets proper pre-pilot support before January.
              </SoWhat>
              <div style={{ marginTop: '10px' }}>
                <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0AUZPNN83S/p1786473873997059" label="↗ #edu-brown thread" />
              </div>
            </div>

            {/* Story 4 — Chromebook question */}
            <div style={{ borderTop: `2px solid ${C.pilot.line}`, paddingTop: '14px' }}>
              <Kicker color={C.pilot.kicker}>Ops · Hardware</Kicker>
              <h3 style={{ fontFamily: SERIF, fontSize: '18px', fontWeight: 700, color: C.ink, lineHeight: 1.3, margin: '0 0 8px' }}>
                Chromebook screen size flagged — pilot ops standardizing hardware recommendations
              </h3>
              <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0' }}>
                A question arose about whether 11.6&quot; Chromebook screens are adequate for Grade 6 students, noting that Brown ran on 14&quot; devices and IXL had scroll issues even at that resolution. The touchpad quality on Chromebooks was also flagged as a friction point for students.
              </p>
              <SoWhat>
                Pilot Success should document a minimum hardware spec (screen size, pointer device) and share it with schools before onboarding. This prevents a session-day surprise.
              </SoWhat>
              <div style={{ marginTop: '10px' }}>
                <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0BCBAJFBPC/p1786394162803749" label="↗ #team-pilot-success thread" />
              </div>
            </div>

          </div>
        </section>

        {/* ══ PRODUCT UPDATE ═══════════════════════════════════════════════ */}
        <section style={{ marginTop: 'clamp(32px, 5vw, 52px)' }}>
          <SectionLabel
            id="product"
            emoji="⚙️"
            title="Product Update"
            color={C.product.kicker}
            bg={C.product.bg}
          />

          <p style={{
            fontFamily: SANS, fontSize: '12px', color: C.inkFaint,
            fontStyle: 'italic', marginTop: '16px', marginBottom: '4px',
          }}>
            What shipped this week in plain English — from the git changelog
          </p>

          {/* ✨ New Features */}
          <div style={{ marginTop: '16px' }}>
            <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(20px, 3.5vw, 26px)', fontWeight: 700, color: C.ink, margin: '0 0 16px' }}>
              ✨ New Features
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.5vw, 22px)' }}>

              {[
                {
                  scope: 'Horizon · Learning Science',
                  title: 'Worked-example fade — scaffolding that disappears as you learn',
                  desc: 'Horizon now shows students fully worked examples at first, then gradually removes the steps as the student demonstrates understanding. The scaffold fades based on actual performance, not a timer. Students who need more help see more of the solution; students who are ready get less.',
                  link: 'https://kinship-9xb4888.slack.com/archives/C0ANK3CJM8V/p1786543108443329',
                },
                {
                  scope: 'Horizon · Student Experience',
                  title: 'Celebrations move from outcome numbers to effort',
                  desc: 'The celebration moments students see in Horizon no longer highlight raw scores or answer counts — they now celebrate effort indicators (time spent, attempts, persistence). This aligns with the learning science principle that praising effort over outcome supports a growth mindset.',
                  link: null,
                },
                {
                  scope: 'Horizon · Parent View',
                  title: 'Kinship-native work joins the XP economy',
                  desc: 'Work done inside Kinship\'s own activities (not just Math Academy) now earns XP and shows up in the Horizon experience. Parents and students can see Kinship-native progress alongside Math Academy data in a unified view.',
                  link: null,
                },
                {
                  scope: 'Horizon · Confidence & Metacognition',
                  title: 'In-flow confidence tap — students say how sure they are before seeing results',
                  desc: 'Students can now tap a confidence indicator before their answer is graded. This data feeds into Kinship\'s calibration ledger — tracking whether students are well-calibrated (confident when correct, uncertain when wrong) over time. Miscalibrated confidence is a learning science signal worth surfacing to teachers.',
                  link: null,
                },
                {
                  scope: 'Hearth · Teacher Tools',
                  title: 'Bulk grading drafts feedback — AI writes first, teachers review',
                  desc: 'Teachers grading multiple student submissions can now trigger a draft feedback pass: the system generates a first-cut comment on each piece of work, which the teacher reviews and edits before sending. Reduces repetitive work while keeping the teacher in control of what students receive.',
                  link: null,
                },
                {
                  scope: 'Hearth · Teacher Tools',
                  title: 'Teachers now see the retrieval checks their students just took',
                  desc: 'Hearth now shows teachers a view of the retrieval questions their students answered, alongside results. Previously this data existed only on the student side. Now teachers can see which concepts students successfully recalled and which they missed, enabling more targeted follow-up.',
                  link: null,
                },
                {
                  scope: 'Hearth · Content Factory',
                  title: 'Worked examples become real lesson blocks, and lessons open with retrieval',
                  desc: 'The content factory now embeds worked examples as structured lesson blocks (not just text inserts). Additionally, every lesson now opens with a retrieval prompt — asking students to recall relevant prior knowledge before new content is presented, consistent with spaced retrieval research.',
                  link: null,
                },
                {
                  scope: 'Hearth · AI Harness',
                  title: 'Respond-back channel — agents can now reply to teacher comments',
                  desc: 'Hearth\'s AI agents can now write back into teacher-facing threads, not just student-facing ones. This enables a closed feedback loop where a teacher\'s note triggers an AI acknowledgment or follow-up question — keeping the teacher informed without requiring manual checking.',
                  link: null,
                },
                {
                  scope: 'Chrome Extension',
                  title: 'Extension dev build is now port-agnostic with E2E verification',
                  desc: 'The Tally Chrome extension can now be built against any local dev port — not hardcoded to a single one. An automated E2E verification script was added to confirm the extension connects correctly before it\'s packaged. Schools doing pilot testing with the extension will see fewer environment-specific breakages.',
                  link: null,
                },
                {
                  scope: 'Security · CI',
                  title: 'Gitleaks secret-scanning is now a required CI gate',
                  desc: 'Every pull request now runs Gitleaks — a tool that scans code for accidentally committed secrets (API keys, passwords, tokens). PRs with detected secrets are blocked from merging. This is an important layer for a product that handles student data and third-party API credentials.',
                  link: 'https://kinship-9xb4888.slack.com/archives/C0ANK3CJM8V/p1786461402720619',
                },
              ].map(({ scope, title, desc, link }) => (
                <div key={title} style={{ borderTop: `2px solid ${C.product.line}`, paddingTop: '14px' }}>
                  <Kicker color={C.product.kicker}>{scope}</Kicker>
                  <h4 style={{ fontFamily: SERIF, fontSize: '16px', fontWeight: 700, color: C.ink, lineHeight: 1.3, margin: '0 0 8px' }}>
                    {title}
                  </h4>
                  <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0' }}>
                    {desc}
                  </p>
                  {link && (
                    <div style={{ marginTop: '8px' }}>
                      <ThreadLink href={link} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 🐛 Bug Fixes */}
          <div style={{ marginTop: 'clamp(24px, 3vw, 32px)' }}>
            <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(20px, 3.5vw, 26px)', fontWeight: 700, color: C.ink, margin: '0 0 16px' }}>
              🐛 Bug Fixes
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2vw, 18px)' }}>
              {[
                { scope: 'Horizon', desc: "Student calibration records no longer log silent non-responses — only intentional answers count toward the student's confidence model." },
                { scope: 'Horizon', desc: 'Page titles were missing from the /check, /results, and /writing routes — now fixed so browser tabs and screen readers see meaningful names.' },
                { scope: 'Hearth', desc: 'Pending campaign edges were blocking the curriculum frontier for some students. This is now resolved — students should see their next recommended content correctly.' },
                { scope: 'Hearth', desc: 'The attendance-tracking tab was intermittently showing "not yet started" for students who were clearly active. The session state is now correctly read.' },
              ].map(({ scope, desc }) => (
                <div key={desc.slice(0, 40)} style={{
                  borderTop: `1px solid ${C.paperDark}`, paddingTop: '10px',
                  display: 'flex', gap: '10px',
                }}>
                  <span style={{
                    fontFamily: MONO, fontSize: '10px', color: C.product.line,
                    paddingTop: '2px', flexShrink: 0, fontWeight: 600,
                  }}>{scope}</span>
                  <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.6, margin: '0' }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Engineering practices note */}
          <div style={{
            marginTop: 'clamp(20px, 3vw, 28px)',
            background: C.accentFaint,
            border: `1px solid ${C.paperDark}`,
            padding: 'clamp(12px, 2vw, 18px)',
          }}>
            <Kicker color={C.accent}>Engineering Practice</Kicker>
            <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0' }}>
              The team is rolling out <strong>Claude Code Review</strong> — Anthropic&apos;s AI-native PR reviewer — as a manual-mode experiment. An internal discussion around LLM documentation style surfaced an important principle: LLMs are better at induction than deduction, so documentation should lead with concrete examples rather than abstract rules. Engineering is also aligning around a new PR practice for new team members: draft → AI/self-review → publish when confident.
            </p>
            <div style={{ marginTop: '8px' }}>
              <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0B5FL7KTKN/p1786628812935059" label="↗ Claude Code Review discussion" />
              {' '}
              <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0ANK3CJM8V/p1786543108443329" label="↗ LLM documentation thread" />
            </div>
          </div>

        </section>

        {/* ══ TOPICS WORTH WATCHING ════════════════════════════════════════ */}
        <section style={{ marginTop: 'clamp(32px, 5vw, 52px)' }}>
          <SectionLabel
            id="topics"
            emoji="🔭"
            title="Topics Worth Watching"
            color={C.topics.kicker}
            bg={C.topics.bg}
          />

          <div style={{ paddingTop: 'clamp(20px, 3vw, 28px)', display: 'flex', flexDirection: 'column', gap: 'clamp(24px, 4vw, 36px)' }}>

            {/* Deep dive 1 — Alpha School */}
            <div style={{ borderTop: `2px solid ${C.topics.line}`, paddingTop: '14px' }}>
              <Kicker color={C.topics.kicker}>Competitive Intel · Deep Dive</Kicker>
              <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 700, color: C.ink, lineHeight: 1.25, margin: '0 0 12px' }}>
                Alpha School&apos;s positioning problem — and why it matters for Kinship
              </h3>
              <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0 0 10px' }}>
                <strong>What is it?</strong> Alpha School is a US microschool network built around 2-hour-a-day AI instruction (primarily IXL), with the remaining school day focused on &quot;life skills.&quot; Their model — TimeBack — is the underlying philosophy. Alpha&apos;s positioning has sharpened this week: they published a clear POV on &quot;helpful vs. harmful AI in education&quot; and are actively differentiating from tools that &quot;self-generate eighth-grade math lessons or hallucinate third-grade writing curriculum.&quot;
              </p>
              <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0 0 10px' }}>
                <strong>The credibility question.</strong> Researcher Dan Meyer published a piece questioning whether Alpha&apos;s model works for &quot;regular&quot; kids — flagging that Alpha enforces academic standards by removing students who don&apos;t meet them, which may be selecting for a certain type of learner, not demonstrating universal effectiveness. The team flagged: Unbound (who used the old Alpha/IXL system, not TimeBack) had mixed results this past year.
              </p>
              <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0 0 10px' }}>
                <strong>What does the edtech world say?</strong> Researchers and educators on X are parsing Alpha&apos;s claims carefully. The model gets credit for clarity of vision; it gets skepticism on generalizability. One team member noted: Alpha&apos;s IRL results are real for the narrow segment they serve — but the segment is narrow.
              </p>
              <SoWhat>
                Alpha and Kinship are not in direct competition — different segment, different philosophy — but Alpha&apos;s sharpening POV on &quot;what AI in school should be&quot; is the same conversation Kinship needs to own publicly. Kinship&apos;s differentiation: in-flow, real-time teacher intelligence, not replace-the-teacher 2-hour blocks. The team should be shaping this conversation before others define it for us.
              </SoWhat>
              <div style={{ marginTop: '10px' }}>
                <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0BHY9EV2AG/p1786545121545139" label="↗ #topic-edtech thread" />
                {' '}
                <a href="https://danmeyer.substack.com/p/does-alpha-school-work-for-regular" target="_blank" rel="noreferrer"
                  style={{ fontFamily: MONO, fontSize: '10px', color: C.topics.line, textDecoration: 'none', opacity: 0.85 }}>
                  ↗ Dan Meyer piece
                </a>
              </div>
            </div>

            {/* Deep dive 2 — Wonde */}
            <div style={{ borderTop: `2px solid ${C.topics.line}`, paddingTop: '14px' }}>
              <Kicker color={C.topics.kicker}>Market Signal · Data Infrastructure</Kicker>
              <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 700, color: C.ink, lineHeight: 1.25, margin: '0 0 12px' }}>
                Wonde — the UK&apos;s school data integration layer that&apos;s worth understanding
              </h3>
              <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0 0 10px' }}>
                <strong>What is it?</strong> Wonde is a UK company that works with the UK Department of Education on student data integration for 30,000+ schools. Their model: a single integration layer that connects any edtech tool to school MIS (management information systems) data, with the school in control of what data flows where.
              </p>
              <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0 0 10px' }}>
                <strong>Why it surfaced.</strong> A partnership contact mentioned Wonde while exploring UK-market Academy Trust connections. Wonde&apos;s approach — act as a trusted data intermediary between schools and third-party tools — is a model Kinship will eventually need to solve for as it scales to more schools and platforms.
              </p>
              <SoWhat>
                Kinship&apos;s current integration approach (direct MA API calls, manual roster imports) won&apos;t scale to 200 pilots. Wonde&apos;s model is worth studying as a reference architecture for what a &quot;Kinship integration layer&quot; might look like for Canadian and US school systems. Not urgent now; important to understand before we get there.
              </SoWhat>
              <div style={{ marginTop: '10px' }}>
                <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0BHY9EV2AG/p1786397536888429" label="↗ #topic-edtech thread" />
                {' '}
                <a href="https://www.wonde.com/schools/" target="_blank" rel="noreferrer"
                  style={{ fontFamily: MONO, fontSize: '10px', color: C.topics.line, textDecoration: 'none', opacity: 0.85 }}>
                  ↗ wonde.com
                </a>
              </div>
            </div>

            {/* Surface topics */}
            <div style={{ borderTop: `2px solid ${C.topics.line}`, paddingTop: '14px' }}>
              <Kicker color={C.topics.kicker}>Also This Week</Kicker>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  {
                    channel: '#topic-learning-science',
                    text: 'A David Yeager study on "wise feedback" was shared — the idea that feedback framed around a student\'s capacity to grow (not their current performance) measurably changes outcomes. One team member is using a "capacity vs. capability" frame with Camila at RHA.',
                    link: 'https://kinship-9xb4888.slack.com/archives/C0B1K5U230W/p1786618438244679',
                  },
                  {
                    channel: '#topic-brain-context',
                    text: 'The biweekly AI chat was replaced with a self-paced Claude walkthrough — an artifact that walks through how Kinship uses AI tools internally. The team also debugged Gemini transcript timing (some meetings take up to 2 hours to surface in Notion).',
                    link: 'https://kinship-9xb4888.slack.com/archives/C0B3WMYDF7T/p1786457692757979',
                  },
                  {
                    channel: '#topic-tooling',
                    text: 'ML Research Agent that wrote 30 academic papers in 30 days was shared — team discussed whether this could be applied to learning science questions using Kinship\'s 400-student pilot dataset as a baseline.',
                    link: 'https://kinship-9xb4888.slack.com/archives/C0B5FL7KTKN/p1786385000766809',
                  },
                  {
                    channel: '#topic-conferences-and-tradeshows',
                    text: 'AIEOU (AI in Education Oxford Unit) webinar proposals close August 30. A team member flagged it as a potential thought leadership opportunity.',
                    link: 'https://aieou.site.ox.ac.uk/home',
                  },
                ].map(({ channel, text, link }) => (
                  <div key={channel} style={{ borderTop: `1px solid ${C.paperDark}`, paddingTop: '12px' }}>
                    <span style={{ fontFamily: MONO, fontSize: '11px', color: C.topics.line, fontWeight: 600 }}>{channel}</span>
                    <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.6, margin: '6px 0 4px' }}>
                      {text}
                    </p>
                    <ThreadLink href={link} />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ══ FOOTER ════════════════════════════════════════════════════════ */}
        <hr style={{ ...ruleDouble, marginTop: 'clamp(40px, 6vw, 60px)' }} />
        <footer id="footer" style={{ paddingTop: '24px', scrollMarginTop: '80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '24px', marginBottom: '20px' }}>
            <div>
              <Kicker color={C.inkFaint}>Hottest thread this week</Kicker>
              <p style={{ fontFamily: SERIF, fontSize: '14px', color: C.inkMid, margin: '0 0 8px', lineHeight: 1.55 }}>
                <strong>RHA Day 1 live session</strong> in #edu-rha — 75 replies. Real-time triage as students went live for the first time, ending with a student who didn&apos;t want to stop.
              </p>
              <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0ANG4EMU3D/p1786554184016629" label="↗ Read thread" />
            </div>
            <div>
              <Kicker color={C.inkFaint}>Signal gap</Kicker>
              <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkDim, margin: '0', lineHeight: 1.6 }}>
                Several pilot school channels (edu-lcs, edu-mulgrave, edu-rosseau, edu-uts, edu-netivot, edu-branksome-hall, edu-stanstead-college, edu-bialek, edu-leo-baeck) had zero messages this week. The magazine only reflects schools with active Slack presence.
              </p>
            </div>
          </div>
          <hr style={rule} />
          <div style={{ paddingTop: '16px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '8px' }}>
            <span style={{ fontFamily: MONO, fontSize: '11px', color: C.inkFaint }}>
              Issue #7 · The Kinship First-Day Issue · Aug 11–15, 2026
            </span>
            <span style={{ fontFamily: MONO, fontSize: '11px', color: C.inkFaint }}>
              43 channels swept · 153 messages · 9 signals extracted
            </span>
          </div>
          <p style={{ fontFamily: SANS, fontSize: '11px', color: C.inkFaint, marginTop: '8px', lineHeight: 1.5 }}>
            Built by Hermes every Friday. Data from Slack, Google Drive transcripts, and the Kinship git changelog.
            Internal — @buildkinship.com only.
          </p>
        </footer>

      </main>
    </div>
  );
}
