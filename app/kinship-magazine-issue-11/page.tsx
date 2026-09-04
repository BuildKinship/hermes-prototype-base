
'use client';
// 'use client' required: uses useState + useEffect for TableOfContents IntersectionObserver

import React, { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';

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
  crm:        { line: '#0e5f7a', bg: '#f0fbff' },
};

const SERIF = "'Georgia', 'Times New Roman', serif";
const SANS  = "'Inter', 'Helvetica Neue', Arial, sans-serif";
const MONO  = "'IBM Plex Mono', 'Courier New', monospace";

const rule: React.CSSProperties = { border: 'none', borderTop: `1px solid ${C.paperDark}`, margin: '0' };
const ruleThick: React.CSSProperties = { border: 'none', borderTop: `3px solid ${C.ink}`, margin: '0' };
const ruleDouble: React.CSSProperties = { border: 'none', borderTop: `3px double ${C.ink}`, margin: '0' };

function Kicker({ children, color = C.accent }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '10px',
      letterSpacing: '0.14em', textTransform: 'uppercase', color, marginBottom: '6px' }}>
      {children}
    </div>
  );
}

function SoWhat({ text }: { text: string }) {
  return (
    <div style={{ borderTop: `1px solid ${C.paperDark}`, paddingTop: '10px', marginTop: '10px',
      fontFamily: SANS, fontSize: '12px', color: C.inkDim, lineHeight: 1.55 }}>
      <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: '10px', letterSpacing: '0.1em',
        textTransform: 'uppercase', color: C.accent, marginRight: '6px' }}>
        So what?
      </span>
      {text}
    </div>
  );
}

function ThreadLink({ href, color = C.accent }: { href: string; color?: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer"
      style={{ fontFamily: MONO, fontSize: '10px', color, textDecoration: 'none', opacity: 0.8 }}>
      {'↗ thread'}
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
          letterSpacing: '0.12em', textTransform: 'uppercase', color }}>
          {title}
        </span>
      </div>
    </div>
  );
}

const TOC_ITEMS = [
  { id: 'partners',  emoji: '🤝', label: 'Partners',        color: C.partners.line },
  { id: 'pilot',     emoji: '🎯', label: 'Pilot Success',   color: C.pilot.line },
  { id: 'product',   emoji: '⚙️',  label: 'Product Update', color: C.product.line },
  { id: 'topics',    emoji: '🔭', label: 'Topics',          color: C.topics.line },
  { id: 'crm',       emoji: '🗂️',  label: 'Internal',       color: C.crm.line },
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
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '10px',
        letterSpacing: '0.14em', textTransform: 'uppercase', color: C.inkFaint, marginBottom: '10px' }}>
        In this issue
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', overflowX: 'auto',
        WebkitOverflowScrolling: 'touch', gap: '6px 0' }}>
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
              <span style={{ fontFamily: SANS, color: C.inkFaint, fontSize: '12px',
                padding: '4px 10px', userSelect: 'none' }}>·</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}

export default function KinshipMagazineIssue11() {
  return (
    <div style={{ background: C.paper, minHeight: '100dvh', fontFamily: SERIF }}>
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 clamp(16px,5vw,32px) clamp(40px,6vw,64px)' }}>

        {/* Masthead utility bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: 'clamp(12px,2vw,18px) 0 8px',
          fontFamily: SANS, fontWeight: 600, fontSize: '10px',
          letterSpacing: '0.12em', textTransform: 'uppercase', color: C.inkFaint }}>
          <span>The Kinship Intelligence Brief</span>
          <span>Sep 1{'\u20135'}, 2026</span>
        </div>

        <hr style={ruleDouble} />

        {/* Nameplate */}
        <div style={{ textAlign: 'center', padding: 'clamp(18px,3vw,28px) 0 8px' }}>
          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(34px,7vw,68px)', fontWeight: 700,
            color: C.ink, lineHeight: 1.08, margin: '0 0 10px' }}>
            The Kinship Launch Week Issue
          </h1>
          <div style={{ fontFamily: SANS, fontSize: '14px', color: C.inkFaint, letterSpacing: '0.04em' }}>
            Issue 11 &middot; September 1{'\u20135'}, 2026 &middot; Produced by Hermes
          </div>
        </div>

        <hr style={ruleThick} />

        {/* Lede bar */}
        <div style={{ background: C.ink, color: C.paper,
          padding: 'clamp(14px,2.5vw,20px) clamp(16px,3vw,28px)',
          margin: '0', fontFamily: SERIF, fontSize: 'clamp(14px,2vw,17px)', lineHeight: 1.55,
          textAlign: 'center' }}>
          RHA and Greater Dayton launch in days &mdash; rosters are live, onboarding videos are cut, and the team shipped a SSO fix and a class-creation fix in real time to keep the debut clean.
        </div>

        {/* Stats bar */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(24px,5vw,56px)',
          padding: 'clamp(16px,3vw,24px) 0', borderBottom: `1px solid ${C.paperDark}`,
          flexWrap: 'wrap' }}>
          {[
            { n: '44', label: 'channels swept' },
            { n: '237', label: 'messages read' },
            { n: '12', label: 'signals extracted' },
            { n: '37', label: 'brain entries' },
          ].map(({ n, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: SERIF, fontSize: 'clamp(22px,4vw,32px)',
                fontWeight: 700, color: C.accent, lineHeight: 1 }}>{n}</div>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '10px',
                letterSpacing: '0.12em', textTransform: 'uppercase', color: C.inkFaint, marginTop: '4px' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Table of Contents */}
        <TableOfContents />

        {/* ─── PARTNERS ─── */}
        <section style={{ marginTop: 'clamp(32px,5vw,52px)' }}>
          <SectionLabel id="partners" emoji="🤝" title="Partners Update" color={C.partners.line} bg={C.partners.bg} />
          <div style={{ marginTop: 'clamp(16px,2.5vw,24px)', display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap: 'clamp(16px,2.5vw,24px)' }}>

            {/* Colegio Interamericano MoU */}
            <div style={{ borderTop: `2px solid ${C.partners.line}`, paddingTop: '14px' }}>
              <Kicker color={C.partners.line}>Latin America &middot; New MoU</Kicker>
              <h3 style={{ fontFamily: SERIF, fontSize: '18px', fontWeight: 700, color: C.ink,
                lineHeight: 1.3, margin: '0 0 8px' }}>
                Colegio Interamericano signs &mdash; first Latin American school
              </h3>
              <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0 0 8px' }}>
                The MoU is signed for Colegio Interamericano with a target start of September 2027,
                potentially accelerated to January 2026 if alignment moves quickly.
                Countersignature is in progress. This is Kinship{"'"}s first partnership in Latin America.
              </p>
              <SoWhat text="Signals early international expansion traction. Partners team should map curriculum alignment and identify an on-the-ground champion for onboarding ahead of the January window." />
            </div>

            {/* CRM goes live */}
            <div style={{ borderTop: `2px solid ${C.partners.line}`, paddingTop: '14px' }}>
              <Kicker color={C.partners.line}>GTM Ops &middot; Infrastructure</Kicker>
              <h3 style={{ fontFamily: SERIF, fontSize: '18px', fontWeight: 700, color: C.ink,
                lineHeight: 1.3, margin: '0 0 8px' }}>
                Reevo CRM invites sent &mdash; opportunity owners being aligned
              </h3>
              <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0 0 8px' }}>
                Team members received Reevo invitations this week. Implementation is still in progress
                but the platform is open for exploration and opportunity ownership assignment.
                An objection-handling working doc was also shared for team contribution.
              </p>
              <SoWhat text="CRM infrastructure is finally live. Partners team should log all active opportunities before the fall pipeline heats up. Objection doc is a living artifact &mdash; contribute your Q&A patterns now." />
            </div>

            {/* Toronto travel + TDSB */}
            <div style={{ borderTop: `2px solid ${C.partners.line}`, paddingTop: '14px' }}>
              <Kicker color={C.partners.line}>Expansion &middot; Pipeline</Kicker>
              <h3 style={{ fontFamily: SERIF, fontSize: '18px', fontWeight: 700, color: C.ink,
                lineHeight: 1.3, margin: '0 0 8px' }}>
                Toronto visits planned &mdash; Sep 29 and Oct 18{'\u201320'} on the calendar
              </h3>
              <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0 0 8px' }}>
                A team member will be in Vancouver Sep 29 and Toronto Oct 18{'\u201320'}. TDSB discussions are
                ongoing &mdash; the team is preparing Ontario curriculum alignment materials for
                a TDSB head review. CIRIS independent school resource shared as a potential expansion reference.
              </p>
              <SoWhat text="TDSB is a large-district conversation with real compliance requirements. Math Academy's Ontario standards alignment needs to be crisply documented before the head-level meeting." />
            </div>

            {/* DPA update */}
            <div style={{ borderTop: `2px solid ${C.partners.line}`, paddingTop: '14px' }}>
              <Kicker color={C.partners.line}>Legal &middot; EU Compliance</Kicker>
              <h3 style={{ fontFamily: SERIF, fontSize: '18px', fontWeight: 700, color: C.ink,
                lineHeight: 1.3, margin: '0 0 8px' }}>
                DPA Section 2.3a updated for EU compliance
              </h3>
              <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0 0 8px' }}>
                A minor adjustment was made to Section 2.3a of the standard Data Processing Agreement
                template for EU compliance. No retroactive action needed on existing agreements.
                Always use the latest template going forward.
              </p>
              <SoWhat text="Routine but important: any partner in the EU pipeline should receive the updated DPA template from this point forward. Ask legal for the current version before the next European school conversation." />
            </div>
          </div>
        </section>

        {/* ─── PILOT SUCCESS ─── */}
        <section style={{ marginTop: 'clamp(32px,5vw,52px)' }}>
          <SectionLabel id="pilot" emoji="🎯" title="Pilot Success Update" color={C.pilot.line} bg={C.pilot.bg} />
          <div style={{ marginTop: 'clamp(16px,2.5vw,24px)' }}>

            {/* Launch week alert */}
            <div style={{ background: C.accentFaint, border: `1px solid ${C.accent}`,
              borderRadius: '4px', padding: 'clamp(12px,2vw,18px)', marginBottom: '20px' }}>
              <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: '11px',
                letterSpacing: '0.1em', textTransform: 'uppercase', color: C.accent, marginBottom: '8px' }}>
                Launch week &mdash; one week out
              </div>
              <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0' }}>
                <strong>RHA and Greater Dayton launch in one week.</strong> Rosters are confirmed and
                students are auto-published in Hearth. The team is coordinating SSO, Tally instructions,
                and production cleanup of existing campuses. A class-creation bug in Dayton was escalated
                and fixed in the same week &mdash; fast turnaround on a pre-launch critical.
              </p>
            </div>

            <div style={{ display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
              gap: 'clamp(16px,2.5vw,24px)' }}>

              {/* Onboarding video */}
              <div style={{ borderTop: `2px solid ${C.pilot.line}`, paddingTop: '14px' }}>
                <Kicker color={C.pilot.line}>Student Onboarding &middot; Media</Kicker>
                <h3 style={{ fontFamily: SERIF, fontSize: '17px', fontWeight: 700, color: C.ink,
                  lineHeight: 1.3, margin: '0 0 8px' }}>
                  Student onboarding video V1 &mdash; first cut shared for feedback
                </h3>
                <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0 0 8px' }}>
                  A team member produced a student onboarding video over the weekend. Feedback:
                  strong V1, team wants more natural delivery and visual effects to match the experience.
                  A separate Learning How to Learn script was also drafted this week.
                </p>
                <SoWhat text="Video onboarding at launch week is ambitious but high-value. V2 polish should be prioritized before day-one student sessions at RHA and Dayton." />
              </div>

              {/* Teacher feedback win */}
              <div style={{ borderTop: `2px solid ${C.pilot.line}`, paddingTop: '14px' }}>
                <Kicker color={C.pilot.line}>Real Teacher Signal &middot; Validation</Kicker>
                <h3 style={{ fontFamily: SERIF, fontSize: '17px', fontWeight: 700, color: C.ink,
                  lineHeight: 1.3, margin: '0 0 8px' }}>
                  {"\"I think this is really great\""}  &mdash; live warm-up demo lands with teacher
                </h3>
                <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0 0 8px' }}>
                  During a live demo, a teacher gave unprompted positive feedback on the Warm-up Generator.
                  The team noted excitement about reaching these moments of teacher delight as the fall
                  pilot season begins.
                </p>
                <SoWhat text="Real validation at exactly the right moment. Capture and document these teacher reactions &mdash; they are the strongest assets for the next round of school conversations." />
              </div>

              {/* Mulgrave teacher simulator request */}
              <div style={{ borderTop: `2px solid ${C.pilot.line}`, paddingTop: '14px' }}>
                <Kicker color={C.pilot.line}>Mulgrave &middot; Product Request</Kicker>
                <h3 style={{ fontFamily: SERIF, fontSize: '17px', fontWeight: 700, color: C.ink,
                  lineHeight: 1.3, margin: '0 0 8px' }}>
                  Teachers want to experience the student view before launch
                </h3>
                <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0 0 8px' }}>
                  Multiple Mulgrave teachers asked to interact with the student view of Math Academy
                  before putting students in. Discussion on the best path: test accounts in the
                  Kinship MA account vs. per-school accounts. Horizon post-diagnostic access also
                  requested. The team confirmed: post-assessment access is being set up.
                </p>
                <SoWhat text="Teacher simulator access is a recurring ask across schools. A standardized 'teacher experience' onboarding path — where teachers see the student view safely — would reduce this friction at every new school." />
              </div>

              {/* York co-design session */}
              <div style={{ borderTop: `2px solid ${C.pilot.line}`, paddingTop: '14px' }}>
                <Kicker color={C.pilot.line}>York Region &middot; Deep Partnership</Kicker>
                <h3 style={{ fontFamily: SERIF, fontSize: '17px', fontWeight: 700, color: C.ink,
                  lineHeight: 1.3, margin: '0 0 8px' }}>
                  York onboarding design session &mdash; {"\"co-designing is my happy place\""}
                </h3>
                <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0 0 8px' }}>
                  Post-York collaborative session, a team member described it as their {"\"happy place\""}
                  and referenced building scar tissue through a complex week. Discussion surfaced a
                  need for a standards mapping tool and a design session as part of onboarding.
                  A multi-modality mapping view between Kinship and MA is being explored.
                </p>
                <SoWhat text="York is becoming a model for deep co-design partnerships. The insights from this session should shape how Kinship structures future onboarding for district-level clients." />
              </div>

              {/* LCS English course issue */}
              <div style={{ borderTop: `2px solid ${C.pilot.line}`, paddingTop: '14px' }}>
                <Kicker color={C.pilot.line}>LCS &middot; Onboarding Friction</Kicker>
                <h3 style={{ fontFamily: SERIF, fontSize: '17px', fontWeight: 700, color: C.ink,
                  lineHeight: 1.3, margin: '0 0 8px' }}>
                  LCS teachers landed in the wrong org &mdash; access confusion resolved
                </h3>
                <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0 0 8px' }}>
                  LCS teachers were showing as invited to {"\"Kinship Training\""} instead of the LCS
                  org. Engineering confirmed they were correctly placed in the LCS org with the exception
                  of one account. Issue was resolved quickly but surfaced the need to verify org
                  assignment during onboarding.
                </p>
                <SoWhat text="Org-assignment errors at onboarding are hard to spot and easy to miss. A checklist step confirming org placement before teacher invites are sent would catch this class of issue." />
              </div>

              {/* RHA badges + JiTap */}
              <div style={{ borderTop: `2px solid ${C.pilot.line}`, paddingTop: '14px' }}>
                <Kicker color={C.pilot.line}>RHA &middot; Integration Notes</Kicker>
                <h3 style={{ fontFamily: SERIF, fontSize: '17px', fontWeight: 700, color: C.ink,
                  lineHeight: 1.3, margin: '0 0 8px' }}>
                  RHA badges confirmed on; JiTap integration notes shared
                </h3>
                <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0 0 8px' }}>
                  RHA{"'"}s badge feature is being used for their life skills portion &mdash; previously
                  assumed disabled. JiTap integration notes were compiled to explore playlist/code-based
                  options as a possible addition to the pilot stack.
                </p>
                <SoWhat text="RHA is customizing Kinship's feature set in ways the team hadn't anticipated. Keep an eye on their badge usage patterns as a signal for how other schools might want to use this feature." />
              </div>
            </div>
          </div>
        </section>

        {/* ─── PRODUCT UPDATE ─── */}
        <section style={{ marginTop: 'clamp(32px,5vw,52px)' }}>
          <SectionLabel id="product" emoji="⚙️" title="Product Update" color={C.product.line} bg={C.product.bg} />
          <div style={{ marginTop: '8px', marginBottom: '20px',
            fontFamily: SANS, fontSize: '12px', color: C.inkFaint, fontStyle: 'italic' }}>
            What shipped and what{"'"}s moving this week
          </div>

          {/* New Features */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: '11px',
              letterSpacing: '0.1em', textTransform: 'uppercase', color: C.product.line, marginBottom: '16px' }}>
              ✨ New Features
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: 'clamp(14px,2vw,20px)' }}>
              {[
                {
                  title: 'Feature flag assignment dashboard',
                  body: 'A dedicated dashboard for controlling which features are enabled for which schools, replacing ad-hoc flag wrangling. Teachers and admins now see exactly what is enabled for their campus.',
                  scope: 'Hearth',
                },
                {
                  title: 'Live Markdown styling in lesson editor',
                  body: 'Lesson content fields now render Markdown styling live as you type, making lesson authoring significantly more visual and reducing publish-to-preview friction.',
                  scope: 'Hearth',
                },
                {
                  title: 'Course teacher controls',
                  body: 'Teachers can now name a unit\'s strand themselves and the factory will never overwrite it. Gives educators meaningful ownership over course structure.',
                  scope: 'Hearth',
                },
                {
                  title: 'Evidence rules and by-skill class view',
                  body: 'Teachers can now see evidence rules written in plain words, view skill-level evidence per class, and see strand labels and the unlock verb that governs advancement.',
                  scope: 'Hearth + Horizon',
                },
                {
                  title: 'Auto-fill student login credentials',
                  body: 'The Tally extension now auto-fills login credentials for Math Academy, MobyMax, and Lexia when students navigate to those platforms, reducing login friction in multi-tool classrooms.',
                  scope: 'Tally Extension',
                },
                {
                  title: 'All-Feature Academy internal tenant',
                  body: 'An internal test school that structurally resolves every feature flag simultaneously, giving engineering a reliable baseline for cross-feature testing without touching production schools.',
                  scope: 'Engineering',
                },
                {
                  title: 'Math Academy school ID auto-detection',
                  body: 'Kinship now auto-detects the Math Academy school ID from API keys, removing a manual step in school setup and reducing configuration errors at onboarding.',
                  scope: 'Hearth',
                },
                {
                  title: 'Supabase read replica added',
                  body: 'A production read replica was added in Supabase (Canada Central) to offload read-bound queries and provide a safer path for partnership analytics queries.',
                  scope: 'Infrastructure',
                },
              ].map(({ title, body, scope }) => (
                <div key={title} style={{ borderTop: `2px solid ${C.product.line}`, paddingTop: '12px' }}>
                  <Kicker color={C.product.line}>{scope}</Kicker>
                  <div style={{ fontFamily: SERIF, fontSize: '15px', fontWeight: 700, color: C.ink,
                    lineHeight: 1.3, marginBottom: '6px' }}>{title}</div>
                  <div style={{ fontFamily: SANS, fontSize: '12px', color: C.inkMid, lineHeight: 1.6 }}>{body}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bug Fixes + Improvements */}
          <div>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: '11px',
              letterSpacing: '0.1em', textTransform: 'uppercase', color: C.product.line, marginBottom: '16px' }}>
              🛠️ Fixed & Improved
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: 'clamp(12px,2vw,18px)' }}>
              {[
                { title: 'Dayton class creation bug fixed', body: 'A race condition was causing class creation to fail in Dayton\'s campus. Root cause identified and resolved within the same week it was reported.', scope: 'Hearth' },
                { title: 'Google login fixed on production', body: 'Student login via Google was failing on prod. Escalated, investigated, and resolved. WorkOS integration hardened.', scope: 'Hearth' },
                { title: 'Session timer default raised to 25 minutes', body: 'Most schools were already using 25-minute sessions. The default in Hearth now matches real-world practice.', scope: 'Hearth' },
                { title: 'Demo-prep fixes across teacher and student surfaces', body: 'Multiple visual and interaction fixes applied across Hearth and Horizon in preparation for upcoming school demos.', scope: 'Hearth + Horizon' },
                { title: 'XP visibility fix', body: 'XP was not showing in Hearth for one school. Identified and resolved in the same day it was reported ahead of a training session.', scope: 'Hearth' },
                { title: 'Hearth + Horizon pinned to Vercel\'s Montreal region', body: 'Reduces round-trip latency to Supabase from 17\u201320ms to 2ms, meaningfully improving responsiveness for Canadian schools.', scope: 'Infrastructure' },
                { title: 'AI model bump considered for in-app assistant', body: 'A team discussion weighed bumping the in-app AI model to Gemini 3.7 Flash. Decision in progress.', scope: 'Product' },
              ].map(({ title, body, scope }) => (
                <div key={title} style={{ borderTop: `1px solid ${C.paperDark}`, paddingTop: '10px' }}>
                  <Kicker color={C.product.line}>{scope}</Kicker>
                  <div style={{ fontFamily: SERIF, fontSize: '14px', fontWeight: 700, color: C.ink,
                    lineHeight: 1.3, marginBottom: '4px' }}>{title}</div>
                  <div style={{ fontFamily: SANS, fontSize: '12px', color: C.inkMid, lineHeight: 1.55 }}>{body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── TOPICS ─── */}
        <section style={{ marginTop: 'clamp(32px,5vw,52px)' }}>
          <SectionLabel id="topics" emoji="🔭" title="Topics Worth Watching" color={C.topics.line} bg={C.topics.bg} />
          <div style={{ marginTop: 'clamp(16px,2.5vw,24px)' }}>

            {/* Deep dive: NYC AI ban */}
            <div style={{ marginBottom: '32px' }}>
              <Kicker color={C.topics.line}>Deep Dive &middot; Policy</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(24px,4vw,38px)', fontWeight: 700,
                color: C.ink, lineHeight: 1.2, margin: '0 0 12px' }}>
                NYC bans student-facing AI in middle schools &mdash; what it means for Kinship
              </h2>
              <hr style={rule} />
              <div style={{ marginTop: '16px', display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                gap: 'clamp(14px,2.5vw,22px)' }}>

                <div>
                  <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '11px',
                    letterSpacing: '0.1em', textTransform: 'uppercase', color: C.accent, marginBottom: '8px' }}>
                    What happened
                  </div>
                  <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0' }}>
                    New York City{"'"}s Department of Education announced a policy banning{"  "}
                    {"\"student-facing AI\""} in middle schools and setting screen time limits.
                    The policy emerged alongside five approved vendor pilots: Quill, and others.
                    Key wording from the DOE: the target is{"  \"student-facing AI\""} and screen time,
                    not AI in general. The team flagged this was signaled weeks earlier.
                  </p>
                  <div style={{ marginTop: '10px' }}>
                    <a href="https://www.chalkbeat.org/newyork/2026/09/02/nyc-schools-to-set-ai-policy-ban-screen-time-limits/"
                      target="_blank" rel="noreferrer"
                      style={{ fontFamily: MONO, fontSize: '10px', color: C.topics.line, textDecoration: 'none' }}>
                      {'↗ Chalkbeat coverage'}
                    </a>
                  </div>
                </div>

                <div>
                  <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '11px',
                    letterSpacing: '0.1em', textTransform: 'uppercase', color: C.accent, marginBottom: '8px' }}>
                    What the internet says
                  </div>
                  <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0' }}>
                    Ed-tech Twitter is split. Many educators read this as a sensible
                    screen-time measure, not an AI-specific reversal. Others see it as a signal
                    that districts are getting nervous about AI products that weren{"'"}t designed with
                    school workflows in mind. The rapid-rise of AI councils and advisory boards
                    in schools is noted as a parallel trend: districts want governance frameworks,
                    not just vendor access.
                  </p>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '11px',
                    letterSpacing: '0.1em', textTransform: 'uppercase', color: C.accent, marginBottom: '8px' }}>
                    What it means for Kinship
                  </div>
                  <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0 0 10px' }}>
                    Kinship{"'"}s model is built around teacher-mediated AI, not student-facing
                    autonomous AI &mdash; exactly the distinction NYC is drawing. The assistant in
                    Hearth is a teacher tool. The Horizon student view is structured practice, not
                    an open-ended AI chat. This framing should be front and center in any
                    district conversation, especially in the US.
                  </p>
                  <SoWhat text="NYC's move is not a threat to Kinship's model. It's an argument for it. Partnerships should update the school positioning deck to explicitly address the teacher-mediated vs. student-facing AI distinction. This is a competitive advantage that deserves a slide." />
                </div>
              </div>
            </div>

            <hr style={rule} />
            <div style={{ marginTop: '24px' }}>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '11px',
                letterSpacing: '0.1em', textTransform: 'uppercase', color: C.inkFaint, marginBottom: '16px' }}>
                Also this week
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                gap: 'clamp(14px,2vw,20px)' }}>

                {[
                  {
                    ch: '#topic-tooling',
                    title: 'Cursor Agents enter the dev bake-off',
                    body: 'New Cursor agent features surfaced alongside Grok performance-per-dollar comparisons. Team is watching the AI coding assistant landscape closely as part of ongoing tooling evaluation.',
                    link: null,
                  },
                  {
                    ch: '#topic-edtech',
                    title: 'Paloma Learning: at-home adaptive math for families',
                    body: 'Paloma Learning was shared as a competitor or adjacent tool positioned for both districts and families enabling at-home learning. Worth monitoring as a signal of the home/school convergence trend.',
                    link: 'https://www.palomalearning.com',
                  },
                  {
                    ch: '#topic-learning-science',
                    title: 'New pre-print: evidence relevant to Kinship\'s approach',
                    body: 'A pre-print from edarXiv was shared ahead of the fall launch. The team flagged it as relevant to the evidence base being built. Filed for the research canon.',
                    link: 'https://osf.io/preprints/edarxiv/cj7sv_v1',
                  },
                  {
                    ch: '#topic-collective-intelligence',
                    title: 'AI Councils rising in schools',
                    body: 'EdTech Insiders newsletter surfaced the rapid growth of AI governance councils and advisory bodies in school districts. Districts want process and policy, not just tools.',
                    link: null,
                  },
                ].map(({ ch, title, body, link }) => (
                  <div key={title} style={{ borderTop: `1px solid ${C.paperDark}`, paddingTop: '12px' }}>
                    <div style={{ fontFamily: MONO, fontSize: '10px', color: C.inkFaint, marginBottom: '6px' }}>{ch}</div>
                    <div style={{ fontFamily: SERIF, fontSize: '15px', fontWeight: 700, color: C.ink,
                      lineHeight: 1.3, marginBottom: '6px' }}>{title}</div>
                    <div style={{ fontFamily: SANS, fontSize: '12px', color: C.inkMid, lineHeight: 1.6,
                      marginBottom: '6px' }}>{body}</div>
                    {link && (
                      <a href={link} target="_blank" rel="noreferrer"
                        style={{ fontFamily: MONO, fontSize: '10px', color: C.topics.line, textDecoration: 'none' }}>
                        {'↗ source'}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── INTERNAL / CRM ─── */}
        <section style={{ marginTop: 'clamp(32px,5vw,52px)' }}>
          <SectionLabel id="crm" emoji="🗂️" title="Internal Decisions" color={C.crm.line} bg={C.crm.bg} />
          <div style={{ marginTop: 'clamp(16px,2.5vw,24px)', display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: 'clamp(14px,2.5vw,20px)' }}>

            <div style={{ borderTop: `2px solid ${C.crm.line}`, paddingTop: '14px' }}>
              <Kicker color={C.crm.line}>Team &middot; Transition</Kicker>
              <h3 style={{ fontFamily: SERIF, fontSize: '17px', fontWeight: 700, color: C.ink,
                lineHeight: 1.3, margin: '0 0 8px' }}>
                Azim{"'"}s last day is Friday, September 11
              </h3>
              <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0 0 8px' }}>
                Following the all-hands announcement, Azim will be moving on to a new opportunity.
                The team expressed gratitude for his contributions and the systems he put in place.
                His last day is September 11, 2026.
              </p>
              <div style={{ fontFamily: SANS, fontSize: '12px', color: C.inkFaint, fontStyle: 'italic' }}>
                The Kinship team wishes him all the best.
              </div>
            </div>

            <div style={{ borderTop: `2px solid ${C.crm.line}`, paddingTop: '14px' }}>
              <Kicker color={C.crm.line}>Engineering &middot; Process</Kicker>
              <h3 style={{ fontFamily: SERIF, fontSize: '17px', fontWeight: 700, color: C.ink,
                lineHeight: 1.3, margin: '0 0 8px' }}>
                Linear status now means verified-on-production
              </h3>
              <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0' }}>
                A new proposal was raised in standups: {"\"Done\""} on Linear should require a verification
                gate on production, not just {"\"In Review\""}. Squash-merging without that gate is being
                flagged as a process gap. Decision pending.
              </p>
            </div>

            <div style={{ borderTop: `2px solid ${C.crm.line}`, paddingTop: '14px' }}>
              <Kicker color={C.crm.line}>Engineering &middot; Data Security</Kicker>
              <h3 style={{ fontFamily: SERIF, fontSize: '17px', fontWeight: 700, color: C.ink,
                lineHeight: 1.3, margin: '0 0 8px' }}>
                PII encryption migration underway via Neon
              </h3>
              <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0' }}>
                Engineering is migrating some PII data to encrypted storage as part of security
                hardening (KIN-459). Access to Neon is being provisioned. This is part of the
                ongoing data compliance work ahead of district-level partnerships.
              </p>
            </div>

            <div style={{ borderTop: `2px solid ${C.crm.line}`, paddingTop: '14px' }}>
              <Kicker color={C.crm.line}>Brain &middot; Operations</Kicker>
              <h3 style={{ fontFamily: SERIF, fontSize: '17px', fontWeight: 700, color: C.ink,
                lineHeight: 1.3, margin: '0 0 8px' }}>
                Zoom transcripts to be added to the Kinship Brain
              </h3>
              <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65, margin: '0' }}>
                A ticket was created to add Zoom transcript ingestion to the Brain, mirroring how
                Google Meet transcripts work (KIN-475). This week{"'"}s brain-changelog logged 37 entries,
                all via automated workflow. Zoom coverage will further close the context gap.
              </p>
            </div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer style={{ marginTop: 'clamp(40px,6vw,56px)', paddingTop: '20px',
          borderTop: `2px solid ${C.ink}` }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))',
            gap: '16px', marginBottom: '20px' }}>
            <div>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '10px',
                letterSpacing: '0.12em', textTransform: 'uppercase', color: C.inkFaint, marginBottom: '6px' }}>
                Hottest thread this week
              </div>
              <div style={{ fontFamily: SERIF, fontSize: '14px', color: C.ink }}>
                Team escalations &mdash; Dayton class creation bug
              </div>
              <div style={{ fontFamily: MONO, fontSize: '11px', color: C.inkDim, marginTop: '2px' }}>
                39 replies &middot; #team-escalations
              </div>
            </div>
            <div>
              <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '10px',
                letterSpacing: '0.12em', textTransform: 'uppercase', color: C.inkFaint, marginBottom: '6px' }}>
                Week range
              </div>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid }}>
                September 1{'\u20135'}, 2026
              </div>
              <div style={{ fontFamily: SANS, fontSize: '12px', color: C.inkFaint, marginTop: '4px' }}>
                44 channels swept &middot; 237 messages read &middot; 12 signals extracted
              </div>
            </div>
          </div>
          <hr style={rule} />
          <div style={{ paddingTop: '14px', display: 'flex', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ fontFamily: MONO, fontSize: '11px', color: C.inkFaint }}>
              Issue #11 &middot; The Kinship Launch Week Issue
            </div>
            <div style={{ fontFamily: MONO, fontSize: '11px', color: C.inkFaint }}>
              Produced by Hermes &middot; Sep 4, 2026
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
