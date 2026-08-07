'use client';
// needed for useState + useEffect (TOC IntersectionObserver, scroll animations, interactive navigation)
import React, { useState, useEffect, useRef } from 'react';

/* ─── Design tokens (Newspaper System — Issue #4+ warm amber variant) ─────── */
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
  brain:       { line: '#6b21a8', bg: '#faf5ff', kicker: '#4a044e' },
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
      fontFamily: SANS, fontSize: '12px', color: C.accent,
      marginTop: '10px', paddingTop: '10px',
      borderTop: `1px solid ${C.paperDark}`,
    }}>
      <span style={{ fontWeight: 700 }}>So what?</span>{' '}{children}
    </div>
  );
}

/* ─── ThreadLink component ─────────────────────────────────────────────────── */
function ThreadLink({ href, label = '↗ thread' }: { href: string; label?: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" style={{
      fontFamily: MONO, fontSize: '11px', color: C.inkFaint,
      textDecoration: 'none', borderBottom: `1px solid ${C.paperDark}`,
    }}>
      {label}
    </a>
  );
}

/* ─── Section header ───────────────────────────────────────────────────────── */
function SectionHeader({ emoji, title, color, id }: { emoji: string; title: string; color: string; id: string }) {
  return (
    <div id={id} style={{ scrollMarginTop: '80px', marginBottom: 'clamp(24px, 3vw, 36px)' }}>
      <div style={{ height: '3px', background: color, marginBottom: '12px' }} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
        <span style={{ fontSize: 'clamp(20px, 3vw, 26px)' }}>{emoji}</span>
        <h2 style={{
          fontFamily: SERIF, fontSize: 'clamp(20px, 3.5vw, 28px)',
          fontWeight: 700, color: C.ink, margin: '0', letterSpacing: '-0.02em',
        }}>{title}</h2>
      </div>
    </div>
  );
}

/* ─── Signal card ──────────────────────────────────────────────────────────── */
function SignalCard({ kicker, headline, body, soWhat, link, kicColor }: {
  kicker: string; headline: string; body: string; soWhat: string; link?: string; kicColor: string;
}) {
  return (
    <div style={{ borderTop: `1px solid ${C.paperDark}`, paddingTop: '16px', paddingBottom: '16px' }}>
      <Kicker color={kicColor}>{kicker}</Kicker>
      <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(15px, 2vw, 18px)', fontWeight: 700, color: C.ink, margin: '0 0 8px', lineHeight: 1.3 }}>
        {headline}
      </h3>
      <p style={{ fontFamily: SERIF, fontSize: '14px', color: C.inkMid, margin: '0', lineHeight: 1.65 }}>
        {body}
      </p>
      {link && <div style={{ marginTop: '8px' }}><ThreadLink href={link} /></div>}
      <SoWhat>{soWhat}</SoWhat>
    </div>
  );
}

/* ─── Product commit card ──────────────────────────────────────────────────── */
function CommitCard({ icon, tag, title, body }: { icon: string; tag: string; title: string; body: string }) {
  const tagColors: Record<string, string> = {
    '✨ New': C.partners.kicker,
    '🛠️ Improved': C.pilot.kicker,
    '🐛 Fixed': C.accent,
  };
  return (
    <div style={{ borderTop: `1px solid ${C.paperDark}`, paddingTop: '14px', paddingBottom: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <span style={{ fontSize: '20px', lineHeight: 1, flexShrink: 0, marginTop: '2px' }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'inline-block', fontFamily: MONO, fontSize: '10px', fontWeight: 700,
            color: tagColors[tag] || C.accent, letterSpacing: '0.08em',
            textTransform: 'uppercase', marginBottom: '4px',
          }}>{tag}</div>
          <h4 style={{ fontFamily: SERIF, fontSize: 'clamp(14px, 1.8vw, 16px)', fontWeight: 700, color: C.ink, margin: '0 0 6px', lineHeight: 1.35 }}>
            {title}
          </h4>
          <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkDim, margin: '0', lineHeight: 1.6 }}>
            {body}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Table of Contents ────────────────────────────────────────────────────── */
const TOC_ITEMS = [
  { id: 'partners',  label: '🤝 Partners',      color: C.partners.line },
  { id: 'pilot',     label: '🎯 Pilot Success', color: C.pilot.line },
  { id: 'product',   label: '⚙️ Product',        color: C.product.line },
  { id: 'topics',    label: '🔭 Topics',          color: C.topics.line },
  { id: 'footer',    label: '📋 Footer',          color: C.inkFaint },
];

function TableOfContents() {
  const [active, setActive] = useState('partners');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    TOC_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav style={{
      display: 'flex', flexWrap: 'wrap', gap: '8px',
      padding: 'clamp(12px, 2vw, 16px) 0',
      borderTop: `1px solid ${C.paperDark}`,
      borderBottom: `1px solid ${C.paperDark}`,
      marginBottom: 'clamp(32px, 5vw, 52px)',
    }}>
      {TOC_ITEMS.map(({ id, label, color }) => (
        <button key={id} onClick={() => scrollTo(id)} style={{
          fontFamily: SANS, fontSize: '12px', fontWeight: active === id ? 700 : 400,
          color: active === id ? color : C.inkFaint,
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '4px 8px',
          borderBottom: active === id ? `2px solid ${color}` : '2px solid transparent',
          transition: 'all 0.15s',
        }}>
          {label}
        </button>
      ))}
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  MAIN PAGE                                                                   */
/* ═══════════════════════════════════════════════════════════════════════════ */
export default function KinshipMagazineIssue7() {
  return (
    <div style={{ background: C.paper, minHeight: '100dvh', color: C.ink }}>

      {/* ── MASTHEAD ──────────────────────────────────────────────────────── */}
      <header style={{ background: C.ink, color: C.paper }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(20px, 4vw, 40px) clamp(16px, 5vw, 32px)' }}>
          <hr style={{ border: 'none', borderTop: '2px solid #4a3f30', marginBottom: '16px' }} />
          <h1 style={{
            fontFamily: SERIF, fontSize: 'clamp(28px, 6vw, 60px)',
            fontWeight: 700, textAlign: 'center', margin: '0 0 8px',
            letterSpacing: '-0.03em', lineHeight: 1.05,
            color: C.paper,
          }}>
            The Kinship RHA Issue
          </h1>
          <div style={{ textAlign: 'center', marginBottom: '12px' }}>
            <span style={{ fontFamily: MONO, fontSize: '11px', color: '#9b8e80', letterSpacing: '0.08em' }}>
              ISSUE #7 &nbsp;·&nbsp; AUG 4–8, 2026 &nbsp;·&nbsp; 42 CHANNELS SWEPT &nbsp;·&nbsp; 143 MESSAGES READ
            </span>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #4a3f30', marginTop: '16px' }} />
        </div>
      </header>

      {/* ── LEDE BAR ──────────────────────────────────────────────────────── */}
      <div style={{ background: '#221c14', color: C.paper }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(20px, 3vw, 28px) clamp(16px, 5vw, 32px)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '24px', alignItems: 'center' }}>
            <div>
              <Kicker color={C.accent}>This week's signal</Kicker>
              <p style={{ fontFamily: SERIF, fontSize: 'clamp(16px, 2.5vw, 20px)', margin: '0', lineHeight: 1.5, color: C.paper }}>
                RHA's signed MOU landed today. Three-day on-site teacher training starts Tuesday. The product shipped 19 user-facing commits in five days. Stanstead's math head pushed back on format.{' '}
                <strong style={{ color: '#e8d5b0' }}>Everything is converging.</strong>
              </p>
            </div>
            <div style={{ display: 'flex', gap: 'clamp(20px, 3vw, 36px)', flexWrap: 'wrap' }}>
              {[
                { n: '19', label: 'commits shipped' },
                { n: '20', label: 'brain entries' },
                { n: '7', label: 'school signals' },
              ].map(s => (
                <div key={s.n} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, color: C.accent, lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontFamily: SANS, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9b8e80', marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(24px, 4vw, 48px) clamp(16px, 5vw, 32px)' }}>

        <TableOfContents />

        {/* ══ PARTNERS UPDATE ════════════════════════════════════════════════ */}
        <section style={{ marginBottom: 'clamp(40px, 6vw, 64px)' }}>
          <SectionHeader emoji="🤝" title="Partners Update" color={C.partners.line} id="partners" />

          <SignalCard
            kicker="RHA · MOU"
            kicColor={C.partners.kicker}
            headline="Robbins Hebrew Academy MOU signed — pilot formally locked"
            body="A signed agreement is now on file with Robbins Hebrew Academy. The deal was adapted from Kinship's standard MOU to reflect the 'precision learning program' framing rather than math-only scope. Kinship is covering the third-party app costs (Rosetta Stone ~$1,675 CAD, Lexia Core ~$1,852 CAD, MobyMax Science) upfront, with plans to fold those into RHA's pricing going forward. Pilot launch: September 8."
            soWhat="Partners can now reference RHA as a formally contracted school. Pricing model for multi-app pilots — Kinship absorbs platform costs in year one — needs to be documented before replication at scale."
            link="https://kinship-9xb4888.slack.com/archives/C0ANG4EMU3D/p1785867407258589"
          />

          <SignalCard
            kicker="Stanstead College · Quebec"
            kicColor={C.partners.kicker}
            headline="Stanstead's math head raises format concern — 25-minute block needs framing"
            body="In this morning's discovery call with Stanstead's head of math, Lisa Smith, the 25-minutes-per-day block model received direct pushback: she would not independently seat students in front of a computer for 25 minutes. The Kinship team positioned flexibility around that block — teacher-led warm-up, the 25-min adaptive session, and a 5-10 min reflection — and explained that the curriculum builder lets teachers govern the bookends entirely. Lisa's concern was pedagogical, not logistical."
            soWhat="Pilot Success should prepare a one-pager specifically addressing the 25-min framing for independent-school teachers with strong classroom-practice convictions. This objection will recur at every school where the lead teacher has constructivist leanings."
            link="https://kinship-9xb4888.slack.com/archives/C0B6Z4MFA3X/p1785880978663919"
          />

          <SignalCard
            kicker="Conferences & Speaking"
            kicColor={C.partners.kicker}
            headline="Speaking engagement strategy launched — Partners building conference pipeline"
            body="A conference speaking strategy deck and associated documentation was shared with the team this week. Initial data suggests a ~5% conversion rate from in-person speaking contacts to closed deals, significantly above typical digital channels. The team is mapping existing invitations and identifying jump-in points for each team member. Melissa is being onboarded as a contributor."
            soWhat="This is Partners' long-play pipeline tool. Worth tracking conference contact → pilot conversion as a formal KPI as this scales."
            link="https://kinship-9xb4888.slack.com/archives/C0B6Z4MFA3X/p1785880978663919"
          />

          <SignalCard
            kicker="Compliance · Urgent"
            kicColor={C.partners.kicker}
            headline="Compliance ownership gap surfaced — needs a lead now, not later"
            body="A direct call went out to the team: someone needs to own compliance (FERPA, HIPAA, IDEA/IEP, Title IX, accessibility/ADA, IRB/REB) as Kinship moves into live student data handling. Several team members volunteered subject-matter familiarity. The urgency: Kinship is in the rostering and student data flow stage at active schools. Research partnerships (IRB exemption) were also flagged as a related concern."
            soWhat="Leadership should assign a compliance lead this week. This is a pre-condition for any public-school contracts. The longer it stays unowned, the bigger the legal surface."
            link="https://kinship-9xb4888.slack.com/archives/C0B6Z4MFA3X/p1786033133696119"
          />

          <SignalCard
            kicker="Hong Kong · Pipeline"
            kicColor={C.partners.kicker}
            headline="Warm intro to Hong Kong international school contacts in the pipeline"
            body="A network contact (former Disney World HK president, now CFO of Disney Experiences) has committed to making email introductions to prominent international school contacts in Hong Kong. This supplements the ongoing Asia market strategy that includes Elite K12 Shanghai."
            soWhat="Partners team should brief the contact on the three-sentence Kinship pitch and prepare for warm inbound from HK. Coordinate with the Asia strategy thread."
          />
        </section>

        <hr style={rule} />

        {/* ══ PILOT SUCCESS ══════════════════════════════════════════════════ */}
        <section style={{ marginBottom: 'clamp(40px, 6vw, 64px)', marginTop: 'clamp(32px, 5vw, 48px)' }}>
          <SectionHeader emoji="🎯" title="Pilot Success Update" color={C.pilot.line} id="pilot" />

          {/* RHA teacher training highlight */}
          <div style={{
            background: C.pilot.bg, borderTop: `3px solid ${C.pilot.line}`,
            padding: 'clamp(16px, 2.5vw, 24px)', marginBottom: 'clamp(20px, 3vw, 28px)',
          }}>
            <Kicker color={C.pilot.kicker}>RHA · Teacher Training · Aug 12–14</Kicker>
            <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(17px, 2.5vw, 22px)', fontWeight: 700, color: C.ink, margin: '0 0 12px', lineHeight: 1.3 }}>
              Three days, on-site, live students on Day 2 — Kinship's first full teacher training
            </h3>
            <p style={{ fontFamily: SERIF, fontSize: '14px', color: C.inkMid, margin: '0 0 12px', lineHeight: 1.7 }}>
              The RHA Teacher Training Agenda is finalized. Camila (RHA's teacher) will spend three full days with the Kinship team, 9am–5pm on-site. Day 2 includes a <strong>live session with real RHA students</strong> while Kinship watches Hearth light up in real time. Day 3 builds her concrete first-days plan. The learning objectives cover: app fluency across all five platforms, signal triage (skill vs. will), the motivational model, and IB framework alignment.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '12px', marginTop: '12px' }}>
              {[
                { day: 'Day 1', sub: 'Aug 12', what: 'App fluency — all platforms. Signal walkthroughs. Skill vs. will triage.' },
                { day: 'Day 2', sub: 'Aug 13', what: 'Motivational model. Coaching roleplay. Live session with real students.' },
                { day: 'Day 3', sub: 'Aug 14', what: 'First-days plan. Week-over-week expectations. Full dry run.' },
              ].map(d => (
                <div key={d.day} style={{ background: C.paper, padding: '12px', borderTop: `2px solid ${C.pilot.line}` }}>
                  <div style={{ fontFamily: MONO, fontSize: '11px', fontWeight: 700, color: C.pilot.line }}>{d.day} · {d.sub}</div>
                  <div style={{ fontFamily: SANS, fontSize: '12px', color: C.inkMid, marginTop: '6px', lineHeight: 1.55 }}>{d.what}</div>
                </div>
              ))}
            </div>
          </div>

          <SignalCard
            kicker="York School · IB MYP"
            kicColor={C.pilot.kicker}
            headline="York teacher loves grouping feature but flags IB and Building Thinking Classrooms gaps"
            body="Feedback from the York call this week: teachers find the data dense but valuable, particularly the grouping feature. Two specific product gaps surfaced: the warm-up generator needs IB MYP framework input options, and there's no integration with Building Thinking Classrooms (a pedagogy used in Ontario). The grouping feature also doesn't yet connect to Curriculum Builder in live demos — a friction point Pilot Success flagged to engineering."
            soWhat="Engineering should add IB MYP and Building Thinking Classrooms as warm-up inputs (KIN-138 adjacent). The grouping → curriculum builder disconnect is a demo risk — should be patched before the next school demo."
            link="https://kinship-9xb4888.slack.com/archives/C0B9FHWR8RE/p1786121015342009"
          />

          <SignalCard
            kicker="TDSB · Text-to-Speech · Urgent"
            kicColor={C.pilot.kicker}
            headline="TDSB pilot confirmed moving forward — text-to-speech needed for Oct launch"
            body="The TDSB pilot at Flemington is confirmed for October. A specific requirement has surfaced: text-to-speech capability for non-native English speakers. There is no current plan for this. Engineering created KIN-161 to evaluate Chrome text-to-speech extensions compatible with Math Academy."
            soWhat="This is a hard accessibility requirement that affects student access from day one at TDSB. KIN-161 needs to close before October. Pilot Success should confirm the student count and language profiles with the school."
            link="https://kinship-9xb4888.slack.com/archives/C0BF55AMDJQ/p1785868058133989"
          />

          <SignalCard
            kicker="Pilot Measurement"
            kicColor={C.pilot.kicker}
            headline="Pilot measurement survey framework drafted — parent and student questionnaires under review"
            body="The Pilot Success team shared a draft framework for student, teacher, and parent surveys. Open questions: parent questions may not be meaningful until RHA parents know what they're seeing from Kinship directly; the success criteria threshold in the draft was questioned as insufficiently ambitious. IB-aligned success criteria was proposed from the York call — tracking relation to graded IB performance."
            soWhat="Pilot Success needs to lock survey instruments before pilots launch in September. The IB-alignment thread is a long-term research opportunity that could differentiate Kinship in the IB school market."
            link="https://kinship-9xb4888.slack.com/archives/C0BCBAJFBPC/p1786035781237379"
          />

          <SignalCard
            kicker="Support Infrastructure"
            kicColor={C.pilot.kicker}
            headline="Team building a support tool tracker — Pylon flagged as an option for multi-school scale"
            body="As pilot school count grows, Pilot Success flagged the need for a formal support tool. Pylon (usepylon.com) was surfaced as a candidate. Hermes created a Notion tracker page under Operations with a comparison table for support tools."
            soWhat="At 10+ schools, async support tooling becomes critical. Evaluating now lets Partners price support into contracts before scale. Pilot Success and Partners should converge on a tool choice before the September cohort launches."
            link="https://kinship-9xb4888.slack.com/archives/C0BCBAJFBPC/p1786048966940249"
          />
        </section>

        <hr style={rule} />

        {/* ══ PRODUCT UPDATE ═════════════════════════════════════════════════ */}
        <section style={{ marginBottom: 'clamp(40px, 6vw, 64px)', marginTop: 'clamp(32px, 5vw, 48px)', background: C.product.bg, padding: 'clamp(20px, 3vw, 32px)', borderTop: `3px solid ${C.product.line}` }}>
          <SectionHeader emoji="⚙️" title="Product Update" color={C.product.line} id="product" />
          <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkDim, margin: '-12px 0 24px', fontStyle: 'italic' }}>
            19 user-facing commits shipped Mon–Fri. Translated for non-engineers.
          </p>

          <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(16px, 2.5vw, 20px)', fontWeight: 700, color: C.ink, margin: '0 0 8px' }}>
            ✨ New Features
          </h3>

          <CommitCard
            icon="🔗"
            tag="✨ New"
            title="Math Academy is now fully connected to Kinship"
            body="Teachers can enter their Math Academy credentials directly in Kinship, and the system automatically imports student rosters, knowledge states, and daily activity — no more manual data entry. This is the keystone that makes the multi-platform dashboard actually work. Students see their real MA progress reflected in Hearth signals, and goal calculations now factor in actual MA data."
          />

          <CommitCard
            icon="👤"
            tag="✨ New"
            title="Students can sign in with Google — no more per-school passwords"
            body="Parents and students at pilot schools can now sign into the student app (Horizon) with their Google accounts. Kinship sends classroom invitations via WorkOS, and students accept with one click. For schools already on Google Workspace for Education, this eliminates the friction of distributing separate logins."
          />

          <CommitCard
            icon="📅"
            tag="✨ New"
            title="School Calendar + instructional-time goal pacing"
            body="Schools can now set their academic calendar inside Kinship. The system uses that to pace weekly and daily goals around actual instructional days — holidays, breaks, and professional development days don't count against students' progress targets. This was a direct result of feedback from 2HL pilots where Alpha School's calendar was incorrectly applied to all schools."
          />

          <CommitCard
            icon="🎮"
            tag="✨ New"
            title="Demo school is live on production — the whole team can try Kinship"
            body="A fully functional demo school (Grade 7 Math Academy) is now running on the live production app. Everyone on the Kinship team is set up as a super-admin. This lets Partners run live demos for prospects without needing staging credentials or pre-seeded test data."
          />

          <CommitCard
            icon="🏫"
            tag="✨ New"
            title="MobyMax school-code settings added"
            body="MobyMax integration can now be configured per school with individual school codes, so multi-school Kinship deployments can each have their own MobyMax setup without interference."
          />

          <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(16px, 2.5vw, 20px)', fontWeight: 700, color: C.ink, margin: '20px 0 8px' }}>
            🛠️ Improvements
          </h3>

          <CommitCard
            icon="📊"
            tag="🛠️ Improved"
            title="Overhauled student page — Class Overview tabs replace the old layout"
            body="The main student view inside Hearth was rebuilt around tabbed Class Overview sections (KIN-142). The previous layout showed too much information at once; the new design groups signals by context so teachers can scan what matters quickly. The Subject page was also simplified as part of this pass."
          />

          <CommitCard
            icon="📡"
            tag="🛠️ Improved"
            title="Math Academy data now shows how it was captured — transparent provenance"
            body="Kinship now shows teachers whether a data point came from the Math Academy API or from the screen-capture extension (Tally). The API-sourced data is more reliable; showing the source lets teachers know when to trust signals and when to investigate further."
          />

          <CommitCard
            icon="🔧"
            tag="🛠️ Improved"
            title="Extension setup page available outside production"
            body="The /setup page (for installing the Tally Chrome extension) now works on all non-production environments. This makes it easier for new pilot schools to onboard before their production accounts are fully configured."
          />

          <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(16px, 2.5vw, 20px)', fontWeight: 700, color: C.ink, margin: '20px 0 8px' }}>
            🐛 Bug Fixes
          </h3>

          <CommitCard
            icon="🔐"
            tag="🐛 Fixed"
            title="Super-admin can now access the student Google sign-in settings"
            body="A permission bug prevented super-admins from reaching the switch that controls whether student Google sign-in is enabled. Fixed — admins can now turn this on or off per school."
          />

          <CommitCard
            icon="🏦"
            tag="🐛 Fixed"
            title="Demo school is now properly linked to a WorkOS org"
            body="The demo school was missing its WorkOS organization connection, which blocked login. Fixed — team members can now sign in and experience the full app as it would appear to a real school."
          />

          <CommitCard
            icon="📐"
            tag="🐛 Fixed"
            title="Math Academy student creation now reads the correct API response format"
            body="When creating a new student in Math Academy from Kinship's Profile tab, the system was reading the wrong field in MA's API response. This caused student creation to silently fail. Fixed."
          />

          {/* A live demo callout */}
          <div style={{
            background: C.paper, borderTop: `2px solid ${C.product.line}`,
            padding: 'clamp(14px, 2vw, 20px)', marginTop: '20px',
          }}>
            <Kicker color={C.product.kicker}>Try it now</Kicker>
            <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, margin: '0', lineHeight: 1.6 }}>
              <strong>The demo school is live on production.</strong> Log in at{' '}
              <a href="https://app.buildkinship.dev" target="_blank" rel="noreferrer" style={{ fontFamily: MONO, color: C.product.line }}>app.buildkinship.dev</a>{' '}
              with your super-admin account. The demo class runs Grade 7 Math Academy — you can log in as a student too (instructions posted in #topic-product-feedback).
            </p>
          </div>
        </section>

        <hr style={rule} />

        {/* ══ TOPICS WORTH WATCHING ══════════════════════════════════════════ */}
        <section style={{ marginBottom: 'clamp(40px, 6vw, 64px)', marginTop: 'clamp(32px, 5vw, 48px)' }}>
          <SectionHeader emoji="🔭" title="Topics Worth Watching" color={C.topics.line} id="topics" />

          {/* Deep dive #1: LearnVector */}
          <div style={{ marginBottom: 'clamp(28px, 4vw, 40px)' }}>
            <Kicker color={C.topics.kicker}>Deep Dive · Competitive Intel</Kicker>
            <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 700, color: C.ink, margin: '0 0 16px', lineHeight: 1.25 }}>
              LearnVector — Andrew Ng's $100M AI tutoring bet
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '16px', marginBottom: '20px' }}>
              {[
                {
                  label: 'What is it?',
                  text: 'LearnVector is Andrew Ng\'s new AI company, launched in 2026 with a $100M investment from Coursera. It\'s building one-to-one adaptive learning experiences — starting with adult professional development, planning to expand.'
                },
                {
                  label: 'What does it do?',
                  text: 'Plans a personalized learning path, adapts in real-time, and "patiently stays with you until you\'ve mastered new skills." No product yet — Ng says "products to show by early 2027." Key thesis: chatbots without guardrails harm learning through cognitive offloading.'
                },
                {
                  label: 'What does the internet say?',
                  text: 'Mixed. AI educators see it as validation of guardrailed adaptive learning. Skeptics note Coursera\'s MOOC completion rates never improved much. Ng specifically calls out the "chatbot → answer → done" failure mode — which mirrors Kinship\'s positioning exactly.'
                },
                {
                  label: 'What it means for Kinship',
                  text: 'LearnVector validates the core thesis (structured, guardrailed, mastery-based AI tutoring > unguarded chatbots). But Kinship is already shipping — with real classrooms, teacher integration, and a multi-app signal layer. LearnVector won\'t have a product until 2027 at the earliest.'
                },
              ].map(b => (
                <div key={b.label} style={{ borderTop: `2px solid ${C.topics.line}`, paddingTop: '12px' }}>
                  <div style={{ fontFamily: MONO, fontSize: '10px', fontWeight: 700, color: C.topics.line, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>{b.label}</div>
                  <p style={{ fontFamily: SERIF, fontSize: '13px', color: C.inkMid, margin: '0', lineHeight: 1.65 }}>{b.text}</p>
                </div>
              ))}
            </div>

            <div style={{ background: C.accentFaint, borderTop: `2px solid ${C.accent}`, padding: '14px' }}>
              <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, margin: '0', lineHeight: 1.65 }}>
                <strong style={{ color: C.accent }}>Kinship angle:</strong> The Kinship positioning document should explicitly reference the ChatGPT cognitive offloading research that Ng cites — it legitimizes the mastery-based approach Kinship is building. Kinship's edge: K-12, teacher-in-the-loop, multi-platform signal aggregation. LearnVector is adult/professional learning. Not the same market in year one.
              </p>
            </div>
            <div style={{ marginTop: '10px' }}>
              <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0BHY9EV2AG/p1785874337019069" label="↗ topic-edtech thread" />
              {' · '}
              <a href="https://learnvector.ai" target="_blank" rel="noreferrer" style={{ fontFamily: MONO, fontSize: '11px', color: C.inkFaint }}>learnvector.ai ↗</a>
            </div>
          </div>

          <hr style={rule} />

          {/* Deep dive #2: OpenAI Codex for teachers */}
          <div style={{ marginTop: '24px', marginBottom: 'clamp(28px, 4vw, 40px)' }}>
            <Kicker color={C.topics.kicker}>Deep Dive · AI Tools for Educators</Kicker>
            <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 700, color: C.ink, margin: '0 0 16px', lineHeight: 1.25 }}>
              OpenAI's "Learn, Teach, Work" — free for K-12 teachers
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '16px', marginBottom: '20px' }}>
              {[
                {
                  label: 'What is it?',
                  text: 'OpenAI launched a free K-12 teacher offering — ChatGPT access with curriculum-building features, designed to help teachers create lesson plans, worksheets, and classroom materials. Free for verified K-12 educators.'
                },
                {
                  label: 'What does it do?',
                  text: 'Lesson planning, worksheet generation, differentiation suggestions. Positioned as a teacher productivity tool — comparable to MagicSchool AI, SchoolAI, and TeachersPayTeachers with AI. Does not touch student-facing adaptive learning.'
                },
                {
                  label: 'What does the internet say?',
                  text: 'Team\'s take: this is a "faster horses" play. MagicSchool AI and SchoolAI both underwent big layoffs recently — OpenAI entering the teacher toolbox space likely accelerated that. The sector is bifurcating: teacher-side productivity tools (AI-assisted prep) vs. student-side adaptive learning (what Kinship does).'
                },
                {
                  label: 'What it means for Kinship',
                  text: 'Kinship is not a teacher productivity tool. This OpenAI offering doesn\'t compete directly — it might actually make Kinship\'s pitch easier: teachers already fluent in AI tools will understand the value of AI-powered student signals faster. Kinship\'s moat is the learning platform integration + teacher dashboard, not lesson planning.'
                },
              ].map(b => (
                <div key={b.label} style={{ borderTop: `2px solid ${C.topics.line}`, paddingTop: '12px' }}>
                  <div style={{ fontFamily: MONO, fontSize: '10px', fontWeight: 700, color: C.topics.line, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>{b.label}</div>
                  <p style={{ fontFamily: SERIF, fontSize: '13px', color: C.inkMid, margin: '0', lineHeight: 1.65 }}>{b.text}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '10px' }}>
              <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0B1K5U230W/p1785872807205509" label="↗ topic-learning-science thread" />
            </div>
          </div>

          <hr style={rule} />

          {/* Brief mentions */}
          <div style={{ marginTop: '24px' }}>
            <Kicker color={C.topics.kicker}>Also This Week</Kicker>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '16px', marginTop: '12px' }}>
              {[
                {
                  ch: '#topic-tooling',
                  headline: 'PostHog Replay Vision — AI-powered session replay analysis',
                  text: 'PostHog\'s new "Replay Vision" watches session recordings and turns patterns into structured observations. Team flagged as relevant for Kinship\'s training and research loops — could power automated "how teachers use the app" analysis.',
                  link: 'https://kinship-9xb4888.slack.com/archives/C0B5FL7KTKN/p1785846673170799'
                },
                {
                  ch: '#topic-tooling',
                  headline: 'ChatGPT Desktop Voice — the interface layer is gone',
                  text: 'Team is using ChatGPT desktop voice for real workflows. One member noted they\'ve grown "perpetually impatient with GPT-4o\'s latency" — GPT Luna (128K context, 80% price reduction) is the new benchmark. The inference cost floor keeps dropping.',
                  link: 'https://kinship-9xb4888.slack.com/archives/C0B5FL7KTKN/p1785874389034719'
                },
                {
                  ch: '#topic-tooling',
                  headline: 'CRM evaluation: Lightfield demoed',
                  text: 'The team demoed Lightfield (CRM) this week — Google, Notion, Slack connections confirmed working. Per-school opportunity tracking and sales phase management were highlighted as strong features. A dedicated CRM thread is tracking next steps.',
                  link: 'https://kinship-9xb4888.slack.com/archives/C0B5FL7KTKN/p1785867125352029'
                },
                {
                  ch: '#topic-learning-science',
                  headline: 'Shopify\'s continual learning loop + Amplify\'s curriculum quality process',
                  text: 'A rich thread on AI-generated curriculum quality processes — Shopify\'s "define rubric, calibrate evaluator, capture failures, train on corrections" model, and Alexandra Walsh of Amplify describing similar quality thresholds. Melissa synthesized best practices from both.',
                  link: 'https://kinship-9xb4888.slack.com/archives/C0B1K5U230W/p1786021651492549'
                },
              ].map(item => (
                <div key={item.headline} style={{ borderTop: `1px solid ${C.paperDark}`, paddingTop: '14px' }}>
                  <div style={{ fontFamily: MONO, fontSize: '10px', color: C.inkFaint, marginBottom: '4px' }}>#{item.ch.replace('#', '')}</div>
                  <h4 style={{ fontFamily: SERIF, fontSize: '14px', fontWeight: 700, color: C.ink, margin: '0 0 6px', lineHeight: 1.3 }}>{item.headline}</h4>
                  <p style={{ fontFamily: SANS, fontSize: '12px', color: C.inkDim, margin: '0 0 8px', lineHeight: 1.55 }}>{item.text}</p>
                  <ThreadLink href={item.link} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr style={rule} />

        {/* ══ BRAIN CONTRIBUTORS (all automated this week) ════════════════════ */}
        <section style={{ marginBottom: 'clamp(40px, 6vw, 64px)', marginTop: 'clamp(32px, 5vw, 48px)' }}>
          <div style={{ borderTop: `2px solid ${C.brain.line}`, paddingTop: '20px', marginBottom: '16px' }}>
            <Kicker color={C.brain.kicker}>Brain Changelog · Week of Aug 4–8</Kicker>
            <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 700, color: C.ink, margin: '0', letterSpacing: '-0.02em' }}>
              20 meetings auto-logged to the Brain this week
            </h2>
          </div>
          <p style={{ fontFamily: SERIF, fontSize: '14px', color: C.inkMid, margin: '0 0 16px', lineHeight: 1.65 }}>
            No human-submitted entries this week — all 20 Brain entries came in via the Kinship Workflows automation. That means all of these meetings were transcribed and captured, which is great signal hygiene. If any of these feel like they should have a more thoughtful human summary, brain-changelog is the place.
          </p>
          <div style={{ background: C.brain.bg, borderTop: `1px solid #d8b4fe`, padding: 'clamp(14px, 2vw, 20px)' }}>
            <Kicker color={C.brain.kicker}>Auto-logged via Kinship Workflows bot</Kicker>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {[
                'Nadim / Azim', 'In-platform training set-up', 'Discussion kinship & Stanstead',
                "Brittany / Maggie: check in on york and lcs launch calls", 'Baypoint / kinship pilot readiness call',
                'Onboarding Call: Paul & Azim', "Lindsey / Dave - quick huddle RE: Rashi", '30 min with Azim (Brenda Montgomery)',
                'Maggie / Dave - quick huddle', 'Azim / Lindsey - Connect on SOP', 'International Market Penetration Huddle',
                'Sales Daily', 'Dan / Lindsey Connect on Strategy', 'nadim x tyler', 'Baypoint / kinship - follow-up',
                'Omar / Dave Connect Call', 'RHA x kinship planning session', 'Prod Eng Daily Standup',
                'Weekly Pipeline Review', 'Slope School / kinship demo',
              ].map(entry => (
                <span key={entry} style={{
                  fontFamily: SANS, fontSize: '11px', color: C.brain.kicker,
                  background: C.paper, padding: '3px 8px',
                  border: `1px solid #d8b4fe`,
                }}>
                  {entry}
                </span>
              ))}
            </div>
          </div>
          <p style={{ fontFamily: SANS, fontSize: '12px', color: C.inkFaint, margin: '12px 0 0', fontStyle: 'italic' }}>
            Want to add a note to any of these sessions? Head to #brain-changelog and use the manual submission form.
          </p>
        </section>

        <hr style={ruleDouble} />

        {/* ══ FOOTER ════════════════════════════════════════════════════════ */}
        <footer id="footer" style={{ paddingTop: '24px', scrollMarginTop: '80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '24px', marginBottom: '20px' }}>
            <div>
              <Kicker color={C.inkFaint}>Hottest thread this week</Kicker>
              <p style={{ fontFamily: SERIF, fontSize: '14px', color: C.inkMid, margin: '0 0 8px', lineHeight: 1.55 }}>
                <strong>Support tool discussion</strong> in #team-pilot-success — 18 replies, 1 reaction. The thread that kicked off a Notion tracker, a CRM conversation, and a strategy question all at once.
              </p>
              <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0BCBAJFBPC/p1786048966940249" label="↗ Read thread" />
            </div>
            <div>
              <Kicker color={C.inkFaint}>Signal gap</Kicker>
              <p style={{ fontFamily: SANS, fontSize: '13px', color: C.inkDim, margin: '0', lineHeight: 1.6 }}>
                Several pilot school channels (edu-lcs, edu-mulgrave, edu-rosseau, edu-uts, edu-netivot, edu-branksome-hall, edu-stanstead-college, edu-bialek, edu-leo-baeck) had zero messages this week. The magazine only reflects schools with active Slack presence — signal gap exists for schools in discovery or early pipeline stages.
              </p>
            </div>
          </div>
          <hr style={rule} />
          <div style={{ paddingTop: '16px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '8px' }}>
            <span style={{ fontFamily: MONO, fontSize: '11px', color: C.inkFaint }}>
              Issue #7 · The Kinship RHA Issue · Aug 4–8, 2026
            </span>
            <span style={{ fontFamily: MONO, fontSize: '11px', color: C.inkFaint }}>
              42 channels swept · 143 messages · 10 signals extracted
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
