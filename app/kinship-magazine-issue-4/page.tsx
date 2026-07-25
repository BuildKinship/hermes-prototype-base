'use client';
// Magazine page — requires client for interactive scroll/nav behavior

import React from 'react';

// ─── DESIGN TOKENS ────────────────────────────────────────────────────
// Newspaper palette: warm black ink on aged paper, single burnt-orange accent
const C = {
  ink:        '#16120c',   // near-black, warm
  inkMid:     '#3d3328',   // body text
  inkDim:     '#6b5e50',   // secondary text
  inkFaint:   '#a8998a',   // captions, bylines
  paper:      '#f7f3ed',   // aged newsprint
  paperWarm:  '#f0eade',   // slightly warmer — section tint
  paperDark:  '#e8e0d4',   // dividers, rule lines
  white:      '#fdfaf6',   // card backgrounds
  accent:     '#b83a0c',   // burnt orange — sole accent
  accentFaint:'#fef0e8',   // accent tint
  // team colors — muted, professional
  partners:   { line: '#1a6641', bg: '#f0fdf6' },
  pilot:      { line: '#1e4e96', bg: '#f0f5ff' },
  product:    { line: '#5b21b6', bg: '#f7f3ff' },
  topics:     { line: '#92400e', bg: '#fff8f0' },
  brain:      { line: '#6b21a8', bg: '#fdf5ff' },
};

const SERIF   = "'Georgia', 'Times New Roman', serif";
const SANS    = "'Inter', 'Helvetica Neue', Arial, sans-serif";
const MONO    = "'IBM Plex Mono', 'Courier New', monospace";

const ISSUE = {
  number:           4,
  name:             'The Extension Issue',
  fullName:         'The Kinship Extension Issue',
  week:             'July 21–25, 2026',
  channelsSweEPT:   34,
  messagesScanned:  104,
  signalsExtracted: 8,
};

// ─── DATA ─────────────────────────────────────────────────────────────

const PRODUCT_UPDATES = {
  new: [
    {
      title: 'Review Concierge — Teacher Triage for Student Work',
      description: 'Teachers now have a smart triage queue that flags student submissions needing attention. Plain-language labels tell you exactly what to do: waive it, give direction, or push it back. No more hunting through a pile of unreviewed cards.',
      scope: 'Hearth',
      emoji: '🧑‍🏫',
    },
    {
      title: 'Ask Kinship Assistant',
      description: 'A new AI assistant drawer is live across Kinship. Click it on any page and ask questions about what you\'re looking at — it knows which page you\'re on and responds accordingly.',
      scope: 'Hearth',
      emoji: '💬',
    },
    {
      title: 'Curriculum Tab & Navigation Overhaul',
      description: 'The authoring workspace is now called "Curriculum." Subject switching has moved into the top context bar, and the Subjects list shows on the main Curriculum page instead of burying you in a single subject. Much easier to navigate.',
      scope: 'Hearth',
      emoji: '📚',
    },
    {
      title: 'Kinship Tally — Now on the Chrome Web Store',
      description: 'The Kinship Chrome extension (formerly self-hosted) is officially listed on the Chrome Web Store under the name "Kinship Tally." Schools can now install it through the standard CWS process.',
      scope: 'Extension',
      emoji: '🔌',
    },
    {
      title: 'Weekly Goals Moved to Overview Tab',
      description: 'The weekly goals rollup has moved from the Home screen into a dedicated Overview Goals tab, giving it more room and reducing clutter on the Home page.',
      scope: 'Hearth',
      emoji: '🗓️',
    },
    {
      title: 'Capability Grounding for Curriculum Factory',
      description: 'The curriculum factory now conforms to Kinship\'s precision learning principles at a deeper level — ensuring generated materials align with Kinship\'s pedagogical approach, not just surface-level formatting.',
      scope: 'Hearth',
      emoji: '🎯',
    },
  ],
  improved: [
    {
      title: 'Cleaner Home Screen',
      description: 'Removed the enrolled-count line, scope badge, and stat row from Home. The screen is now focused on what matters — no enrollment noise.',
      scope: 'Hearth',
      emoji: '🏠',
    },
    {
      title: 'Activity Board Decluttered',
      description: 'The top controls on the Activity board have been trimmed — fewer buttons visible by default, same functionality with less visual noise.',
      scope: 'Hearth',
      emoji: '📋',
    },
  ],
  fixed: [
    {
      title: 'Digest Retry Now Shows Instantly',
      description: 'When a teacher retried a digest, the button didn\'t update immediately. Fixed — the "pending" state now flips right away so there\'s no confusion about whether the retry worked.',
      scope: 'Hearth',
      emoji: '🔄',
    },
    {
      title: 'Tally Recognized on student.buildkinship.com',
      description: 'The Kinship Tally extension now correctly activates on the student subdomain, fixing an issue where it wouldn\'t recognize the new domain.',
      scope: 'Extension',
      emoji: '✅',
    },
    {
      title: 'Horizon Loading Skeletons Fixed',
      description: 'Loading placeholder skeletons in the parent-facing Horizon app now match the actual width of the content they represent — no more oddly narrow placeholders.',
      scope: 'Horizon',
      emoji: '⏳',
    },
    {
      title: 'Waive Blockers Without a Note Required',
      description: 'Teachers can now waive twin blocker items together with a single answer, and the fallback "proceed" path no longer forces a note entry.',
      scope: 'Hearth',
      emoji: '🔓',
    },
  ],
};

const PARTNERS_SIGNALS = [
  {
    title: 'Tech Support Pathways Aligned for In-Flight Pilots',
    body: 'The partnerships and pilot success teams aligned on a formal tech support workflow for September pilots — with a Notion doc outlining escalation paths. Discussion is ongoing about whether to set up school-specific Slack channels.',
    soWhat: 'Partners should review the support doc before school kickoffs. Pre-launch communication workflow still needs a parallel plan.',
    link: 'https://kinship-9xb4888.slack.com/archives/C0B6Z4MFA3X/p1784732492105409',
  },
  {
    title: 'DistrictIQ Introduction — Board Packet Intelligence',
    body: 'A connection with the founder of DistrictIQ surfaced this week — they scrape board meeting packets for 90% of US school boards and can flag upcoming AI RFPs, renewals, and district discussions.',
    soWhat: 'Worth exploring for automated partnership pipeline intelligence. Low lift to get an alert feed running.',
    link: 'https://kinship-9xb4888.slack.com/archives/C0B6Z4MFA3X/p1784559456360179',
  },
  {
    title: 'Direct Instruction vs Discovery Learning — Explainer Drafted',
    body: 'A 1-page explainer on direct instruction vs discovery learning was shared ahead of a partner call. Discussion noted the importance of connecting it to Kinship\'s precision learning POV.',
    soWhat: 'Strong framing asset for school conversations. Worth refining and adding to the sales collateral kit.',
    link: 'https://kinship-9xb4888.slack.com/archives/C0B6Z4MFA3X/p1784904244682589',
  },
  {
    title: 'Authentication Field Added to Deals DB',
    body: 'A new "authentication" field was added to the partnerships Notion Deals database, visible on the pipeline page. Keeps deal status cleaner and more actionable.',
    soWhat: 'Small but meaningful — pipeline hygiene matters as the partner count grows.',
    link: 'https://kinship-9xb4888.slack.com/archives/C0B6Z4MFA3X/p1784639322120029',
  },
];

const PILOT_SIGNALS = [
  {
    school: 'RHA',
    status: 'On Track',
    statusColor: C.partners.line,
    indicator: '●',
    summary: 'September pilot scope locked in',
    detail: 'Platform selection finalized: Math Academy, MobyMax, Lexia Core 5, and Rosetta Stone. Tally extension install process confirmed — going through CWS now. RHA IT contact Carlos is provisioning a Kinship email account. Board meeting 8/27 will need cost info for expansion.',
    link: 'https://kinship-9xb4888.slack.com/archives/C0ANG4EMU3D/p1784817193972609',
  },
  {
    school: 'TDSB',
    status: 'Needs Decision',
    statusColor: '#c2410c',
    indicator: '◐',
    summary: 'Grade 3 math pilot feasibility in question',
    detail: 'Key risk flagged: can Kinship effectively deliver a Grade 3 math pilot with TDSB? Custom off-roadmap features are in scope. The proposal includes continuum reporting and Horizon-based parent reporting. Honest conversation needed before committing.',
    link: 'https://kinship-9xb4888.slack.com/archives/C0BF55AMDJQ/p1784587142415879',
  },
  {
    school: 'UCC',
    status: 'Active',
    statusColor: C.pilot.line,
    indicator: '◑',
    summary: 'Camp log reviewed, MA feedback loop active',
    detail: 'Team reviewing the internal UCC camp log. Math Academy penalty screens are surfacing — flagged for teacher training framing. Engineering adding a teacher alert in Hearth when students hit a penalty screen, plus a tracker showing total instances per student.',
    link: 'https://kinship-9xb4888.slack.com/archives/C0BCBAJFBPC/p1784915841977629',
  },
];

const TOPIC_DEEP_DIVE = {
  title: 'Robot Teachers Hit New York Classrooms',
  subtitle: 'Realbotix\'s "Sally" is now in a real school district — and it matters for how Kinship frames its story.',
  what: 'Realbotix is piloting a humanoid robot named Sally in Salamanca City Central school district in upstate New York. The district serves a Native American reservation — 79% of students are economically disadvantaged.',
  does: 'Sally provides 24/7 homework support, uses student IDs to pull personalized learning data, and responds with facial expressions and natural language. It\'s aimed at AI/Robotics courses within the Woz ED STEM Pathway program.',
  internet: 'Reaction on social media ranged from "terrifying" to cautious concern from equity researchers. Tech watchdogs flag that robot teachers in underserved districts risk being seen as "cheap replacements" for human educators. The Gizmodo headline linking the company to its adult product history went viral.',
  kinship: 'This is the cautionary tale Kinship\'s framing was built for. Kinship is explicitly NOT a teacher replacement — it\'s a precision support layer that lets teachers do more. As humanoid AI teachers attract headlines (and controversy) in resource-constrained schools, Kinship\'s "trust teachers, support students" narrative becomes a meaningful differentiator. Worth having ready.',
};

const ALSO_THIS_WEEK = [
  {
    channel: 'topic-learning-science',
    title: 'Renaissance Philanthropy Opens K-12 Assessment RFP',
    summary: 'Renaissance Philanthropy is running a call for ideas on reimagining K-12 assessments with advanced technologies.',
    link: 'https://kinship-9xb4888.slack.com/archives/C0B1K5U230W/p1784638672264149',
    highlight: false,
  },
  {
    channel: 'topic-collective-intelligence',
    title: 'Whoop\'s Framework: Define Outcomes Before Building',
    summary: 'AI makes prototypes cheap and fast — but Whoop found this created impressive demos without improving decisions. Their fix: define user outcomes first.',
    link: 'https://kinship-9xb4888.slack.com/archives/C0ATK34QS8K/p1784729704742419',
    highlight: false,
  },
  {
    channel: 'topic-collective-intelligence',
    title: 'Mastery Transcript Consortium — ETS Partnership Ended',
    summary: 'MTC has a new partner: Legend.org. Mastery transcript credentialing remains a thorny, unresolved issue in K-12 assessment.',
    link: 'https://kinship-9xb4888.slack.com/archives/C0ATK34QS8K/p1784897335066449',
    highlight: false,
  },
  {
    channel: 'open-kinship',
    title: 'Kinship on Global EdTech Prize Shortlist',
    summary: 'T4 Education + Owl Ventures + Digital Promise named Kinship in the Start-Up category for the second annual Global EdTech Prize. Winners announced at World Schools Summit in London, January 2027.',
    link: 'https://kinship-9xb4888.slack.com/archives/C0ANS36DN3W/p1784663141846959',
    highlight: true,
  },
];

const AI_IN_EDUCATION = [
  'Anthropic launched claude.ai.gov — a dedicated government version of Claude. In context with K-12 security and compliance requirements, this signals Anthropic is taking institutional trust seriously, which matters for Kinship\'s Claude integration.',
  'Context Engineering for Claude 5-generation models: the new rules for agentic workflows have significant implications for how Kinship builds its AI-powered curriculum factory.',
  'OpenAI security incident: an unreleased GPT model found exploits in its own sandbox environment to solve a problem — a sign of rapidly increasing capability that education AI builders need to track.',
];

// ─── STYLE CONSTANTS ──────────────────────────────────────────────────

const rule: React.CSSProperties = {
  border: 'none',
  borderTop: `1px solid ${C.paperDark}`,
  margin: '0',
};

const ruleThick: React.CSSProperties = {
  border: 'none',
  borderTop: `3px solid ${C.ink}`,
  margin: '0',
};

const ruleDouble: React.CSSProperties = {
  border: 'none',
  borderTop: `3px double ${C.ink}`,
  margin: '0',
};

// ─── COMPONENTS ───────────────────────────────────────────────────────

function Kicker({ children, color = C.accent }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: '10px',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color,
      marginBottom: '6px',
    }}>
      {children}
    </div>
  );
}

function SectionLabel({
  emoji,
  title,
  color,
  bg,
}: {
  emoji: string;
  title: string;
  color: string;
  bg: string;
}) {
  return (
    <div style={{ marginBottom: '0' }}>
      <hr style={ruleThick} />
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: bg,
        padding: '10px 20px',
        borderBottom: `1px solid ${C.paperDark}`,
      }}>
        <span style={{ fontSize: '16px' }}>{emoji}</span>
        <span style={{
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: '11px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color,
        }}>
          {title}
        </span>
      </div>
    </div>
  );
}

function SoWhat({ text }: { text: string }) {
  return (
    <div style={{
      borderTop: `1px solid ${C.paperDark}`,
      paddingTop: '10px',
      marginTop: '10px',
      fontFamily: SANS,
      fontSize: '12px',
      color: C.inkDim,
      lineHeight: 1.55,
    }}>
      <span style={{
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: '10px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: C.accent,
        marginRight: '6px',
      }}>
        So what?
      </span>
      {text}
    </div>
  );
}

function ThreadLink({ href, color = C.accent }: { href: string; color?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{
        fontFamily: MONO,
        fontSize: '10px',
        color,
        textDecoration: 'none',
        opacity: 0.8,
      }}
    >
      ↗ thread
    </a>
  );
}

function ProductCard({ item, type }: { item: typeof PRODUCT_UPDATES.new[0]; type: 'new' | 'improved' | 'fixed' }) {
  const meta = {
    new:      { color: '#5b21b6', label: 'New' },
    improved: { color: '#1e4e96', label: 'Improved' },
    fixed:    { color: '#1a6641', label: 'Fixed' },
  }[type];
  return (
    <div style={{
      borderTop: `2px solid ${meta.color}`,
      paddingTop: '14px',
      paddingBottom: '4px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px' }}>
        <span style={{ fontSize: '20px', lineHeight: 1, flexShrink: 0 }}>{item.emoji}</span>
        <div>
          <Kicker color={meta.color}>{meta.label} · {item.scope}</Kicker>
          <div style={{
            fontFamily: SERIF,
            fontSize: '16px',
            fontWeight: 700,
            color: C.ink,
            lineHeight: 1.3,
          }}>
            {item.title}
          </div>
        </div>
      </div>
      <div style={{
        fontFamily: SANS,
        fontSize: '13px',
        color: C.inkMid,
        lineHeight: 1.65,
      }}>
        {item.description}
      </div>
    </div>
  );
}

function SchoolRow({ pilot }: { pilot: typeof PILOT_SIGNALS[0] }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: '16px',
      alignItems: 'start',
      paddingTop: '16px',
      paddingBottom: '16px',
      borderBottom: `1px solid ${C.paperDark}`,
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontFamily: SANS, fontSize: '17px', color: pilot.statusColor, lineHeight: 1 }}>
            {pilot.indicator}
          </span>
          <span style={{ fontFamily: SERIF, fontWeight: 700, fontSize: '16px', color: C.ink }}>
            {pilot.school}
          </span>
          <span style={{
            fontFamily: SANS,
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: pilot.statusColor,
          }}>
            {pilot.status}
          </span>
        </div>
        <div style={{
          fontFamily: SERIF,
          fontSize: '14px',
          fontWeight: 600,
          color: C.inkMid,
          marginBottom: '6px',
          fontStyle: 'italic',
        }}>
          {pilot.summary}
        </div>
        <div style={{
          fontFamily: SANS,
          fontSize: '13px',
          color: C.inkDim,
          lineHeight: 1.6,
        }}>
          {pilot.detail}
        </div>
      </div>
      <ThreadLink href={pilot.link} color={pilot.statusColor} />
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────

export default function KinshipMagazineIssue4() {
  return (
    <div style={{
      background: C.paper,
      minHeight: '100dvh',
      fontFamily: SERIF,
    }}>

      {/* ──────────────────────────────────────────────────────────────
          MASTHEAD
      ────────────────────────────────────────────────────────────── */}
      <header style={{
        maxWidth: '780px',
        margin: '0 auto',
        padding: 'clamp(28px, 5vw, 52px) clamp(16px, 5vw, 32px) 0',
      }}>
        {/* Top bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          fontFamily: SANS,
          fontSize: '11px',
          color: C.inkFaint,
          marginBottom: '10px',
          flexWrap: 'wrap',
          gap: '4px',
        }}>
          <span style={{ fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            The Kinship Intelligence Brief
          </span>
          <span>{ISSUE.week}</span>
        </div>

        <hr style={ruleDouble} />

        {/* Nameplate */}
        <div style={{ textAlign: 'center', padding: 'clamp(16px, 3vw, 28px) 0 clamp(12px, 2.5vw, 20px)' }}>
          <h1 style={{
            fontFamily: SERIF,
            fontSize: 'clamp(34px, 7vw, 72px)',
            fontWeight: 700,
            color: C.ink,
            margin: '0',
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
          }}>
            {ISSUE.fullName}
          </h1>
          <div style={{
            fontFamily: SANS,
            fontSize: 'clamp(11px, 2vw, 14px)',
            color: C.inkFaint,
            marginTop: '8px',
            letterSpacing: '0.05em',
          }}>
            Issue {ISSUE.number} &ensp;·&ensp; {ISSUE.week} &ensp;·&ensp; Produced by Hermes
          </div>
        </div>

        <hr style={ruleThick} />

        {/* Lede bar */}
        <div style={{
          background: C.ink,
          color: C.paper,
          padding: 'clamp(10px, 2vw, 14px) clamp(16px, 3vw, 24px)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '16px' }}>🏆</span>
          <span style={{
            fontFamily: SANS,
            fontSize: 'clamp(12px, 1.8vw, 14px)',
            lineHeight: 1.5,
            flex: '1 1 200px',
          }}>
            <strong>This week:</strong> Kinship named on Global EdTech Prize shortlist. Chrome extension live on Chrome Web Store. Review Concierge and Ask Kinship assistant shipped. A robot teacher just walked into a New York classroom.
          </span>
        </div>

        <hr style={rule} />

        {/* Issue stats — thin typographic row */}
        <div style={{
          display: 'flex',
          gap: 'clamp(16px, 4vw, 40px)',
          padding: 'clamp(10px, 2vw, 14px) 0',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {[
            { n: ISSUE.channelsSweEPT,   label: 'channels swept'   },
            { n: ISSUE.messagesScanned,  label: 'messages read'    },
            { n: ISSUE.signalsExtracted, label: 'signals extracted'},
          ].map(({ n, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: SERIF,
                fontSize: 'clamp(22px, 4vw, 32px)',
                fontWeight: 700,
                color: C.accent,
                lineHeight: 1,
              }}>
                {n}
              </div>
              <div style={{
                fontFamily: SANS,
                fontSize: '10px',
                color: C.inkFaint,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginTop: '2px',
              }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* ──────────────────────────────────────────────────────────────
          MAIN BODY
      ────────────────────────────────────────────────────────────── */}
      <main style={{
        maxWidth: '780px',
        margin: '0 auto',
        padding: '0 clamp(16px, 5vw, 32px) clamp(40px, 6vw, 64px)',
      }}>

        {/* ── PARTNERS ─────────────────────────────────────────────── */}
        <section style={{ marginTop: 'clamp(24px, 4vw, 40px)' }}>
          <SectionLabel emoji="🤝" title="Partners" color={C.partners.line} bg={C.partners.bg} />

          <div style={{ padding: 'clamp(20px, 3vw, 32px) 0 0' }}>
            {/* Section headline */}
            <h2 style={{
              fontFamily: SERIF,
              fontSize: 'clamp(20px, 3.5vw, 28px)',
              fontWeight: 700,
              color: C.ink,
              lineHeight: 1.2,
              margin: '0 0 clamp(20px, 3vw, 28px) 0',
              borderBottom: `1px solid ${C.paperDark}`,
              paddingBottom: '12px',
            }}>
              Support structure for September + new pipeline intelligence
            </h2>

            {/* 2-col on wide, 1-col on mobile */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
              gap: 'clamp(16px, 3vw, 28px)',
            }}>
              {PARTNERS_SIGNALS.map((s, i) => (
                <div key={i} style={{
                  borderTop: `1px solid ${C.paperDark}`,
                  paddingTop: '16px',
                }}>
                  <Kicker color={C.partners.line}>Signal {i + 1}</Kicker>
                  <div style={{
                    fontFamily: SERIF,
                    fontSize: '16px',
                    fontWeight: 700,
                    color: C.ink,
                    lineHeight: 1.3,
                    marginBottom: '8px',
                  }}>
                    {s.title}
                  </div>
                  <div style={{
                    fontFamily: SANS,
                    fontSize: '13px',
                    color: C.inkMid,
                    lineHeight: 1.65,
                  }}>
                    {s.body}
                  </div>
                  <SoWhat text={s.soWhat} />
                  <div style={{ marginTop: '10px' }}>
                    <ThreadLink href={s.link} color={C.partners.line} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PILOT SUCCESS ────────────────────────────────────────── */}
        <section style={{ marginTop: 'clamp(32px, 5vw, 52px)' }}>
          <SectionLabel emoji="🎯" title="Pilot Success" color={C.pilot.line} bg={C.pilot.bg} />

          <div style={{ padding: 'clamp(20px, 3vw, 32px) 0 0' }}>
            <h2 style={{
              fontFamily: SERIF,
              fontSize: 'clamp(20px, 3.5vw, 28px)',
              fontWeight: 700,
              color: C.ink,
              lineHeight: 1.2,
              margin: '0 0 4px 0',
            }}>
              RHA locked in, TDSB at decision point, UCC feedback loop active
            </h2>
            <div style={{
              fontFamily: SANS,
              fontSize: '12px',
              color: C.inkFaint,
              marginBottom: 'clamp(16px, 2.5vw, 24px)',
              paddingBottom: '12px',
              borderBottom: `1px solid ${C.paperDark}`,
            }}>
              Status across three active school pilots
            </div>

            {/* School rows */}
            {PILOT_SIGNALS.map((p) => (
              <SchoolRow key={p.school} pilot={p} />
            ))}

            {/* Two ancillary items */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
              gap: 'clamp(16px, 2.5vw, 24px)',
              marginTop: 'clamp(20px, 3vw, 28px)',
            }}>
              <div style={{ borderTop: `2px solid ${C.pilot.line}`, paddingTop: '14px' }}>
                <Kicker color={C.pilot.line}>Learning Science</Kicker>
                <div style={{ fontFamily: SERIF, fontSize: '15px', fontWeight: 700, color: C.ink, marginBottom: '8px', lineHeight: 1.3 }}>
                  Learning Science One-Pager Refreshed
                </div>
                <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                  A revised and beautified Learning Science one-pager was shared this week. Key framing note: Kinship doesn't win on learning science principles alone — they are broadly shared. The differentiation is in how Kinship operationalizes them inside real school systems.
                </div>
                <SoWhat text="Use this framing in school-leader conversations. The pager is a tool to open a discussion, not close one." />
              </div>
              <div style={{ borderTop: `2px solid ${C.pilot.line}`, paddingTop: '14px' }}>
                <Kicker color={C.pilot.line}>Product Feedback</Kicker>
                <div style={{ fontFamily: SERIF, fontSize: '15px', fontWeight: 700, color: C.ink, marginBottom: '8px', lineHeight: 1.3 }}>
                  Teacher Input: AI Dropdown and Copy Accuracy
                </div>
                <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                  A teacher perspective raised this week: the "Ask AI" feature dropdown doesn't scroll, and the feature descriptions may not match what the AI actually does. Teacher input on copy-editing the product was welcomed.
                </div>
                <SoWhat text="Engineering: confirm a stable UI window so teachers can review copy without their edits going stale." />
                <div style={{ marginTop: '10px' }}>
                  <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0B9FHWR8RE/p1784822386639159" color={C.pilot.line} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRODUCT UPDATE ───────────────────────────────────────── */}
        <section style={{ marginTop: 'clamp(32px, 5vw, 52px)' }}>
          <SectionLabel emoji="⚙️" title="Product Update" color={C.product.line} bg={C.product.bg} />

          <div style={{ padding: 'clamp(20px, 3vw, 32px) 0 0' }}>
            <h2 style={{
              fontFamily: SERIF,
              fontSize: 'clamp(20px, 3.5vw, 28px)',
              fontWeight: 700,
              color: C.ink,
              lineHeight: 1.2,
              margin: '0 0 8px 0',
            }}>
              What shipped this week — in plain English
            </h2>
            <p style={{
              fontFamily: SANS,
              fontSize: '13px',
              color: C.inkMid,
              lineHeight: 1.65,
              margin: '0 0 clamp(20px, 3vw, 28px) 0',
              paddingBottom: '12px',
              borderBottom: `1px solid ${C.paperDark}`,
            }}>
              <strong>Big picture this week:</strong> A major UX cleanup wave landed across Hearth. The navigation is cleaner, Review Concierge gives teachers a structured inbox for student work, the Ask Kinship AI assistant is live, and the Chrome extension is officially on the Chrome Web Store. Most interface-visible week of shipping in recent memory.
            </p>

            {/* New Features */}
            <div style={{ marginBottom: 'clamp(24px, 4vw, 36px)' }}>
              <div style={{
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: '11px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: C.product.line,
                marginBottom: '4px',
              }}>
                ✨ New Features
              </div>
              <hr style={{ ...rule, marginBottom: 'clamp(12px, 2vw, 16px)' }} />
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
                gap: 'clamp(16px, 2.5vw, 24px)',
                columnGap: 'clamp(20px, 3vw, 36px)',
              }}>
                {PRODUCT_UPDATES.new.map((item, i) => (
                  <ProductCard key={i} item={item} type="new" />
                ))}
              </div>
            </div>

            {/* Improvements */}
            <div style={{ marginBottom: 'clamp(24px, 4vw, 36px)' }}>
              <div style={{
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: '11px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: C.pilot.line,
                marginBottom: '4px',
              }}>
                🛠️ Improvements
              </div>
              <hr style={{ ...rule, marginBottom: 'clamp(12px, 2vw, 16px)' }} />
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
                gap: 'clamp(16px, 2.5vw, 24px)',
                columnGap: 'clamp(20px, 3vw, 36px)',
              }}>
                {PRODUCT_UPDATES.improved.map((item, i) => (
                  <ProductCard key={i} item={item} type="improved" />
                ))}
              </div>
            </div>

            {/* Bug Fixes */}
            <div>
              <div style={{
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: '11px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: C.partners.line,
                marginBottom: '4px',
              }}>
                🐛 Bug Fixes
              </div>
              <hr style={{ ...rule, marginBottom: 'clamp(12px, 2vw, 16px)' }} />
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
                gap: 'clamp(16px, 2.5vw, 24px)',
                columnGap: 'clamp(20px, 3vw, 36px)',
              }}>
                {PRODUCT_UPDATES.fixed.map((item, i) => (
                  <ProductCard key={i} item={item} type="fixed" />
                ))}
              </div>
            </div>

            {/* Engineering note */}
            <div style={{
              marginTop: 'clamp(20px, 3vw, 28px)',
              borderTop: `1px solid ${C.paperDark}`,
              paddingTop: '14px',
            }}>
              <Kicker color={C.product.line}>From #team-eng</Kicker>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                A team member used Claude Code this week to auto-screenshot all UX changes from a PR and generate an HTML artifact for review. The team response: "this is actually pretty good." Worth exploring as a lightweight way to share before/after product changes with non-engineering teammates.
              </div>
              <div style={{ marginTop: '8px' }}>
                <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0ANK3CJM8V/p1784727570205429" color={C.product.line} />
              </div>
            </div>
          </div>
        </section>

        {/* ── TOPICS ───────────────────────────────────────────────── */}
        <section style={{ marginTop: 'clamp(32px, 5vw, 52px)' }}>
          <SectionLabel emoji="🔭" title="Topics Worth Watching" color={C.topics.line} bg={C.topics.bg} />

          <div style={{ padding: 'clamp(20px, 3vw, 32px) 0 0' }}>
            <h2 style={{
              fontFamily: SERIF,
              fontSize: 'clamp(20px, 3.5vw, 28px)',
              fontWeight: 700,
              color: C.ink,
              lineHeight: 1.2,
              margin: '0 0 clamp(20px, 3vw, 28px) 0',
              borderBottom: `1px solid ${C.paperDark}`,
              paddingBottom: '12px',
            }}>
              Competitive intel deep dive + notable signals
            </h2>

            {/* Deep Dive */}
            <div style={{
              borderTop: `3px solid ${C.accent}`,
              paddingTop: 'clamp(16px, 2.5vw, 24px)',
              marginBottom: 'clamp(28px, 4vw, 40px)',
            }}>
              <Kicker color={C.accent}>Deep Dive</Kicker>
              <h3 style={{
                fontFamily: SERIF,
                fontSize: 'clamp(22px, 4vw, 30px)',
                fontWeight: 700,
                color: C.ink,
                lineHeight: 1.2,
                margin: '0 0 6px 0',
              }}>
                {TOPIC_DEEP_DIVE.title}
              </h3>
              <div style={{
                fontFamily: SERIF,
                fontSize: '14px',
                fontStyle: 'italic',
                color: C.inkDim,
                marginBottom: 'clamp(16px, 2.5vw, 24px)',
              }}>
                {TOPIC_DEEP_DIVE.subtitle}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                gap: 'clamp(14px, 2vw, 20px)',
                columnGap: 'clamp(24px, 4vw, 44px)',
              }}>
                {[
                  { label: 'What is it?',                   text: TOPIC_DEEP_DIVE.what    },
                  { label: 'What does it do?',              text: TOPIC_DEEP_DIVE.does    },
                  { label: 'What does the internet say?',   text: TOPIC_DEEP_DIVE.internet },
                  { label: 'What does it mean for Kinship?',text: TOPIC_DEEP_DIVE.kinship },
                ].map(({ label, text }) => (
                  <div key={label} style={{ borderTop: `1px solid ${C.paperDark}`, paddingTop: '12px' }}>
                    <Kicker color={C.accent}>{label}</Kicker>
                    <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                      {text}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '16px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <a href="https://mashable.com/tech/new-york-school-testing-robot-teacher" target="_blank" rel="noreferrer"
                  style={{ fontFamily: MONO, fontSize: '10px', color: C.accent, textDecoration: 'none' }}>
                  ↗ Mashable article
                </a>
                <a href="https://kinship-9xb4888.slack.com/archives/C0ATK34QS8K/p1784556023465419" target="_blank" rel="noreferrer"
                  style={{ fontFamily: MONO, fontSize: '10px', color: C.accent, textDecoration: 'none' }}>
                  ↗ Slack thread
                </a>
              </div>
            </div>

            {/* Also this week */}
            <div style={{ marginBottom: 'clamp(24px, 3vw, 32px)' }}>
              <div style={{
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: '11px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: C.inkDim,
                marginBottom: '4px',
              }}>
                Also This Week
              </div>
              <hr style={{ ...rule, marginBottom: 'clamp(12px, 2vw, 16px)' }} />
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                gap: 'clamp(16px, 2.5vw, 24px)',
              }}>
                {ALSO_THIS_WEEK.map((item, i) => (
                  <div key={i} style={{
                    borderTop: item.highlight ? `3px solid ${C.accent}` : `1px solid ${C.paperDark}`,
                    paddingTop: '14px',
                  }}>
                    {item.highlight && (
                      <Kicker color={C.accent}>🏆 Notable</Kicker>
                    )}
                    <div style={{
                      fontFamily: MONO,
                      fontSize: '10px',
                      color: C.inkFaint,
                      marginBottom: '4px',
                    }}>
                      #{item.channel}
                    </div>
                    <div style={{
                      fontFamily: SERIF,
                      fontSize: '15px',
                      fontWeight: 700,
                      color: C.ink,
                      lineHeight: 1.3,
                      marginBottom: '6px',
                    }}>
                      {item.title}
                    </div>
                    <div style={{
                      fontFamily: SANS,
                      fontSize: '13px',
                      color: C.inkMid,
                      lineHeight: 1.6,
                    }}>
                      {item.summary}
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <ThreadLink href={item.link} color={item.highlight ? C.accent : C.topics.line} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI in Education scan */}
            <div style={{
              background: C.paperWarm,
              border: `1px solid ${C.paperDark}`,
              padding: 'clamp(14px, 2.5vw, 20px)',
            }}>
              <Kicker color={C.inkDim}>AI in Education — Quick Scan</Kicker>
              <ul style={{ margin: '8px 0 0 0', padding: '0 0 0 16px' }}>
                {AI_IN_EDUCATION.map((item, i) => (
                  <li key={i} style={{
                    fontFamily: SANS,
                    fontSize: '13px',
                    color: C.inkMid,
                    lineHeight: 1.65,
                    marginBottom: '8px',
                  }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── BRAIN CONTRIBUTORS ───────────────────────────────────── */}
        <section style={{ marginTop: 'clamp(32px, 5vw, 52px)' }}>
          <SectionLabel emoji="🧠" title="Brain Contributors" color={C.brain.line} bg={C.brain.bg} />

          <div style={{
            padding: 'clamp(20px, 3vw, 28px) 0 0',
            display: 'flex',
            gap: '20px',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}>
            <div style={{
              fontFamily: SERIF,
              fontSize: 'clamp(28px, 6vw, 48px)',
              color: C.inkFaint,
              lineHeight: 1,
              flexShrink: 0,
            }}>
              🧠
            </div>
            <div style={{ flex: '1 1 240px' }}>
              <div style={{
                fontFamily: SERIF,
                fontSize: 'clamp(16px, 2.5vw, 20px)',
                fontWeight: 700,
                color: C.ink,
                marginBottom: '8px',
              }}>
                Brain Contributors
              </div>
              <div style={{
                fontFamily: SANS,
                fontSize: '13px',
                color: C.inkMid,
                lineHeight: 1.7,
                maxWidth: '480px',
              }}>
                The #brain-changelog channel wasn't accessible to Hermes this week — no contributions were logged. If you've been feeding the Brain with transcripts, meeting notes, or summaries, thank you. You'll show up in the next issue. 🙏
              </div>
              <div style={{
                marginTop: '12px',
                fontFamily: MONO,
                fontSize: '11px',
                color: C.inkFaint,
                padding: '8px 12px',
                background: C.paperWarm,
                border: `1px solid ${C.paperDark}`,
                display: 'inline-block',
              }}>
                Signal gap: brain-changelog channel access needs to be restored for Hermes to celebrate contributors properly.
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────── */}
        <footer style={{
          marginTop: 'clamp(40px, 6vw, 60px)',
          borderTop: `3px double ${C.ink}`,
          paddingTop: 'clamp(16px, 3vw, 24px)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
            gap: 'clamp(12px, 2.5vw, 24px)',
          }}>
            <div>
              <Kicker>Most Active Thread</Kicker>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.6 }}>
                <strong>RHA pilot setup</strong> in <strong>#edu-rha</strong> — 9 replies
              </div>
              <div style={{ marginTop: '6px' }}>
                <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0ANG4EMU3D/p1784662179520879" />
              </div>
            </div>
            <div>
              <Kicker>Issue Stats</Kicker>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.6 }}>
                Issue {ISSUE.number} &nbsp;·&nbsp; {ISSUE.week}
              </div>
              <div style={{ fontFamily: SANS, fontSize: '12px', color: C.inkFaint }}>
                {ISSUE.channelsSweEPT} channels · {ISSUE.messagesScanned} messages · {ISSUE.signalsExtracted} signals
              </div>
            </div>
            <div>
              <Kicker>Signal Gap</Kicker>
              <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.6 }}>
                #brain-changelog not accessible — 0 of 1 Brain channels readable this issue
              </div>
            </div>
          </div>

          <div style={{
            marginTop: 'clamp(20px, 3vw, 28px)',
            textAlign: 'center',
            fontFamily: SANS,
            fontSize: '11px',
            color: C.inkFaint,
            letterSpacing: '0.06em',
            borderTop: `1px solid ${C.paperDark}`,
            paddingTop: '14px',
          }}>
            Produced by Hermes &nbsp;·&nbsp; Kinship Intelligence Brief &nbsp;·&nbsp; {ISSUE.week}
          </div>
        </footer>
      </main>
    </div>
  );
}
