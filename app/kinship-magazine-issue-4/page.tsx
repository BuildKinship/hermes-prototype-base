'use client';
// Magazine page — requires client for interactive scroll/nav behavior

import React from 'react';

const COLORS = {
  ink: '#1a1208',
  cream: '#faf7f2',
  accent: '#c2410c',       // burnt orange — new this issue
  accentLight: '#fff7ed',
  gold: '#b45309',
  goldLight: '#fef3c7',
  steel: '#334155',
  mist: '#f1f5f9',
  border: '#e2d9cc',
  sectionBg: {
    partners: '#f0fdf4',
    pilot: '#eff6ff',
    product: '#fdf4ff',
    topics: '#fff7ed',
    brain: '#faf5ff',
  },
  sectionAccent: {
    partners: '#16a34a',
    pilot: '#2563eb',
    product: '#7c3aed',
    topics: '#c2410c',
    brain: '#9333ea',
  },
};

const FONT = {
  serif: "'Georgia', 'Times New Roman', serif",
  sans: "'Inter', 'Helvetica Neue', sans-serif",
};

const ISSUE = {
  number: 4,
  name: 'The Extension Issue',
  fullName: 'The Kinship Extension Issue',
  week: 'July 21–25, 2026',
  channelsSweEPT: 34,
  messagesScanned: 104,
  signalsExtracted: 8,
};

// ─── DATA ─────────────────────────────────────────────────────────────

const PRODUCT_UPDATES = {
  new: [
    {
      title: 'Review Concierge — Teacher Triage for Student Work',
      description: 'Teachers now have a smart triage queue that flags student submissions needing attention. Plain-language labels tell you exactly what to do: waive it, give direction, or push it back. No more hunting through a pile of unreviewed cards.',
      scope: 'hearth',
      emoji: '🧑‍🏫',
    },
    {
      title: 'Ask Kinship Assistant',
      description: 'A new AI assistant drawer is live across Kinship. Click it on any page and ask questions about what you\'re looking at — it knows which page you\'re on and responds accordingly.',
      scope: 'hearth',
      emoji: '💬',
    },
    {
      title: 'Curriculum Tab & Navigation Overhaul',
      description: 'The authoring workspace is now called "Curriculum." Subject switching has moved into the top context bar, and the Subjects list shows on the main Curriculum page instead of burying you in a single subject. Much easier to navigate.',
      scope: 'hearth',
      emoji: '📚',
    },
    {
      title: 'Kinship Tally — Now on the Chrome Web Store',
      description: 'The Kinship Chrome extension (formerly self-hosted) is officially listed on the Chrome Web Store under the name "Kinship Tally." Schools can now install it through the standard CWS process. A production-only publish pipeline and kill-switch are in place.',
      scope: 'extension',
      emoji: '🔌',
    },
    {
      title: 'Weekly Goals Moved to Overview Tab',
      description: 'The weekly goals rollup has moved from the Home screen into a dedicated Overview Goals tab, giving it more room and reducing clutter on the Home page.',
      scope: 'hearth',
      emoji: '🗓️',
    },
    {
      title: 'Capability Grounding for Curriculum Factory',
      description: 'The curriculum factory now conforms to Kinship\'s precision learning principles at a deeper level — ensuring generated materials align with Kinship\'s pedagogical approach, not just surface-level formatting.',
      scope: 'hearth',
      emoji: '🎯',
    },
  ],
  improved: [
    {
      title: 'Cleaner Home Screen',
      description: 'Removed the enrolled-count line, scope badge, and stat row from Home. The screen is now focused on what matters — no enrollment noise.',
      scope: 'hearth',
      emoji: '🏠',
    },
    {
      title: 'Activity Board Decluttered',
      description: 'The top controls on the Activity board have been trimmed — fewer buttons visible by default, same functionality with less visual noise.',
      scope: 'hearth',
      emoji: '📋',
    },
  ],
  fixed: [
    {
      title: 'Digest Retry Now Shows Instantly',
      description: 'When a teacher retried a digest, the button didn\'t update immediately. Fixed — the "pending" state now flips right away so there\'s no confusion about whether the retry worked.',
      scope: 'hearth',
      emoji: '🔄',
    },
    {
      title: 'Tally Recognized on student.buildkinship.com',
      description: 'The Kinship Tally extension now correctly activates on the student subdomain, fixing an issue where it wouldn\'t recognize the new domain.',
      scope: 'tally',
      emoji: '✅',
    },
    {
      title: 'Horizon Loading Skeletons Fixed',
      description: 'Loading placeholder skeletons in the parent-facing Horizon app now match the actual width of the content they represent — no more oddly narrow placeholders.',
      scope: 'horizon',
      emoji: '⏳',
    },
    {
      title: 'Waive Blockers Without a Note Required',
      description: 'Teachers can now waive twin blocker items together with a single answer, and the fallback "proceed" path no longer forces a note entry.',
      scope: 'hearth',
      emoji: '🔓',
    },
  ],
};

const PARTNERS_SIGNALS = [
  {
    title: 'Tech Support Pathways Aligned for In-Flight Pilots',
    body: 'The partnerships and pilot success teams aligned on a formal tech support workflow for September pilots — with a Notion doc outlining escalation paths. Discussion is ongoing about whether to set up school-specific Slack channels (noted as not fully scalable, but valuable for early scar tissue).',
    soWhat: 'Partners should review the support doc before school kickoffs. Pre-launch communication workflow still needs a parallel plan.',
    link: 'https://kinship-9xb4888.slack.com/archives/C0B6Z4MFA3X/p1784732492105409',
  },
  {
    title: 'DistrictIQ Introduction — Board Packet Intelligence',
    body: 'A connection with the founder of DistrictIQ surfaced this week — they scrape board meeting packets for 90% of US school boards and can flag upcoming AI RFPs, renewals, and district discussions. Immediate use case: RFP alerts for AI-powered learning solutions.',
    soWhat: 'Worth exploring for automated partnership pipeline intelligence. Low lift to get an alert feed running.',
    link: 'https://kinship-9xb4888.slack.com/archives/C0B6Z4MFA3X/p1784559456360179',
  },
  {
    title: 'Direct Instruction vs Discovery Learning — Explainer Drafted',
    body: 'A 1-page explainer on direct instruction vs discovery learning was shared ahead of a partner call. Discussion noted the importance of connecting it to Kinship\'s precision learning POV and exploring how it aligns with RHA\'s advisor approach.',
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
    flag: '🟡',
    summary: 'September pilot scope locked in',
    detail: 'Platform selection finalized: Math Academy, MobyMax, Lexia Core 5, and Rosetta Stone. Tally extension install process confirmed — going through CWS now. RHA IT contact Carlos is provisioning a Kinship email account. Board meeting on 8/27 will need cost info for expansion planning. Accessibility needs (text-to-speech) being checked.',
    link: 'https://kinship-9xb4888.slack.com/archives/C0ANG4EMU3D/p1784817193972609',
  },
  {
    school: 'TDSB',
    flag: '🔴',
    summary: 'Grade 3 math pilot feasibility in question',
    detail: 'Scope discussion flagged a key risk: can Kinship effectively deliver a Grade 3 math pilot with TDSB? Custom off-roadmap features are in scope. The proposal includes continuum reporting and Horizon-based parent reporting. Honest conversation needed about delivery capability before committing.',
    link: 'https://kinship-9xb4888.slack.com/archives/C0BF55AMDJQ/p1784587142415879',
  },
  {
    school: 'UCC',
    flag: '🟢',
    summary: 'Camp log reviewed, MA feedback loop active',
    detail: 'Team reviewing the internal UCC camp log. Math Academy penalty screens are surfacing — flagged for teacher training framing. Engineering adding a teacher alert in Hearth when students hit a penalty screen, plus a tracker showing total instances per student.',
    link: 'https://kinship-9xb4888.slack.com/archives/C0BCBAJFBPC/p1784915841977629',
  },
];

const TOPIC_DEEP_DIVE = {
  title: 'Robot Teachers Hit New York Classrooms',
  subtitle: 'Realbotix\'s "Sally" is now in a real school district — and it matters for how Kinship frames its story.',
  source: 'topic-collective-intelligence (shared + discussed)',
  link: 'https://kinship-9xb4888.slack.com/archives/C0ATK34QS8K/p1784556023465419',
  what: 'Realbotix (formerly Tokens.com, which acquired RealDoll) is piloting a humanoid robot named Sally in Salamanca City Central school district in upstate New York. The district serves a Native American reservation — 79% of students are economically disadvantaged.',
  does: 'Sally provides 24/7 homework support, uses student IDs to pull personalized learning data, and responds with facial expressions and natural language. It\'s aimed at AI/Robotics courses within the Woz ED STEM Pathway program.',
  internet: 'Reaction on social media ranged from "terrifying" (team\'s own reaction) to cautious concern from equity researchers. Tech watchdogs flag that robot teachers in underserved districts risk being seen as "cheap replacements" for human educators. The Gizmodo headline linking the company to its adult product history went viral.',
  kinship: 'This is the cautionary tale Kinship\'s framing was built for. Kinship is explicitly NOT a teacher replacement — it\'s a precision support layer that lets teachers do more. As humanoid AI teachers attract headlines (and controversy) in resource-constrained schools, Kinship\'s "trust teachers, support students" narrative becomes a meaningful differentiator. Worth having ready.',
};

const ALSO_THIS_WEEK = [
  {
    channel: 'topic-learning-science',
    title: 'Renaissance Philanthropy Opens K-12 Assessment RFP',
    summary: 'Renaissance Philanthropy is running a call for ideas on reimagining K-12 assessments with advanced technologies. One team member noted prior IREX experience with a precursor program.',
    link: 'https://kinship-9xb4888.slack.com/archives/C0B1K5U230W/p1784638672264149',
  },
  {
    channel: 'topic-collective-intelligence',
    title: 'Whoop\'s Framework: Define Outcomes Before Building',
    summary: 'AI makes prototypes cheap and fast — but Whoop found this created impressive demos without improving decisions. Their fix: define user outcomes first. Team noted the parallel to school leaders: "establish trust and maintain vision" before building.',
    link: 'https://kinship-9xb4888.slack.com/archives/C0ATK34QS8K/p1784729704742419',
  },
  {
    channel: 'topic-collective-intelligence',
    title: 'Mastery Transcript Consortium — ETS Partnership Ended',
    summary: 'MTC has a new partner: Legend.org. Mastery transcript credentialing remains a thorny, unresolved issue in K-12 assessment. One team member attended a FOHE webinar on this.',
    link: 'https://kinship-9xb4888.slack.com/archives/C0ATK34QS8K/p1784897335066449',
  },
  {
    channel: 'open-kinship',
    title: 'Kinship on Global EdTech Prize Shortlist',
    summary: 'T4 Education + Owl Ventures + Digital Promise announced their Top 25 shortlists for the second annual Global EdTech Prize. Kinship was named in the Start-Up category — judged by educators, winners announced at World Schools Summit in London, January 2027.',
    link: 'https://kinship-9xb4888.slack.com/archives/C0ANS36DN3W/p1784663141846959',
    highlight: true,
  },
];

const AI_IN_EDUCATION = [
  'Anthropic launched claude.ai.gov — a dedicated government version of Claude. In context with K-12 security and compliance requirements, this signals Anthropic is taking institutional trust seriously, which matters for Kinship\'s Claude integration.',
  'Context Engineering for Claude 5-generation models (must-read shared in #team-eng): the new rules for agentic workflows have significant implications for how Kinship builds its AI-powered curriculum factory.',
  'OpenAI security incident: an unreleased GPT model found exploits in its own sandbox environment to solve a problem — a sign of rapidly increasing capability that education AI builders need to track.',
];

// ─── COMPONENTS ───────────────────────────────────────────────────────

function SectionHeader({ emoji, title, subtitle, color }: { emoji: string; title: string; subtitle: string; color: string }) {
  return (
    <div style={{
      borderLeft: `4px solid ${color}`,
      paddingLeft: '1.25rem',
      marginBottom: '2rem',
    }}>
      <div style={{ fontFamily: FONT.sans, fontSize: 'clamp(11px, 1.5vw, 13px)', fontWeight: 600, color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>
        {emoji} {title}
      </div>
      <div style={{ fontFamily: FONT.serif, fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 700, color: COLORS.ink, lineHeight: 1.2 }}>
        {subtitle}
      </div>
    </div>
  );
}

function SoWhat({ text }: { text: string }) {
  return (
    <div style={{
      background: COLORS.goldLight,
      borderLeft: `3px solid ${COLORS.gold}`,
      borderRadius: '0 6px 6px 0',
      padding: '0.75rem 1rem',
      marginTop: '0.75rem',
      fontFamily: FONT.sans,
      fontSize: 'clamp(12px, 1.6vw, 14px)',
      color: COLORS.steel,
    }}>
      <strong style={{ color: COLORS.gold }}>So what?</strong> {text}
    </div>
  );
}

function ProductCard({ item, type }: { item: typeof PRODUCT_UPDATES.new[0]; type: 'new' | 'improved' | 'fixed' }) {
  const colors = { new: '#7c3aed', improved: '#0369a1', fixed: '#059669' };
  const labels = { new: '✨ New', improved: '🛠️ Improved', fixed: '🐛 Fixed' };
  return (
    <div style={{
      border: `1px solid ${COLORS.border}`,
      borderRadius: '10px',
      padding: '1.25rem',
      background: '#fff',
      borderTop: `3px solid ${colors[type]}`,
    }}>
      <div style={{ fontFamily: FONT.sans, fontSize: 'clamp(10px, 1.4vw, 12px)', fontWeight: 700, color: colors[type], textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
        {labels[type]}
      </div>
      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{item.emoji}</div>
      <div style={{ fontFamily: FONT.serif, fontSize: 'clamp(15px, 2vw, 18px)', fontWeight: 700, color: COLORS.ink, marginBottom: '0.5rem' }}>{item.title}</div>
      <div style={{ fontFamily: FONT.sans, fontSize: 'clamp(12px, 1.6vw, 14px)', color: COLORS.steel, lineHeight: 1.6 }}>{item.description}</div>
    </div>
  );
}

function SchoolCard({ pilot }: { pilot: typeof PILOT_SIGNALS[0] }) {
  const flagColors: Record<string, string> = { '🟢': '#16a34a', '🟡': '#d97706', '🔴': '#dc2626' };
  const color = flagColors[pilot.flag] || COLORS.steel;
  return (
    <div style={{
      border: `1px solid ${COLORS.border}`,
      borderRadius: '10px',
      padding: '1.25rem',
      background: '#fff',
      borderLeft: `4px solid ${color}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '1.25rem' }}>{pilot.flag}</span>
        <span style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 'clamp(14px, 2vw, 17px)', color: COLORS.ink }}>{pilot.school}</span>
      </div>
      <div style={{ fontFamily: FONT.sans, fontWeight: 600, fontSize: 'clamp(12px, 1.6vw, 14px)', color, marginBottom: '0.5rem' }}>{pilot.summary}</div>
      <div style={{ fontFamily: FONT.sans, fontSize: 'clamp(12px, 1.6vw, 13px)', color: COLORS.steel, lineHeight: 1.6 }}>{pilot.detail}</div>
      <a href={pilot.link} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '0.5rem', fontFamily: FONT.sans, fontSize: '12px', color: COLORS.accent, textDecoration: 'none' }}>
        → View thread
      </a>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────

export default function KinshipMagazineIssue4() {
  return (
    <div style={{ background: COLORS.cream, minHeight: '100dvh', fontFamily: FONT.serif }}>

      {/* COVER */}
      <div style={{
        background: `linear-gradient(135deg, ${COLORS.ink} 0%, #2d1a0a 60%, #1e2a3a 100%)`,
        color: COLORS.cream,
        padding: 'clamp(2rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* decorative circles */}
        <div style={{ position: 'absolute', top: '-4rem', right: '-4rem', width: '18rem', height: '18rem', borderRadius: '50%', border: `1px solid rgba(194,65,12,0.3)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '-2rem', right: '-2rem', width: '12rem', height: '12rem', borderRadius: '50%', border: `1px solid rgba(194,65,12,0.15)`, pointerEvents: 'none' }} />

        <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
          <div style={{ fontFamily: FONT.sans, fontSize: 'clamp(10px, 1.5vw, 12px)', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: COLORS.accent, marginBottom: '0.75rem' }}>
            The Kinship Intelligence Brief &nbsp;·&nbsp; Issue #{ISSUE.number}
          </div>
          <h1 style={{ fontFamily: FONT.serif, fontSize: 'clamp(2rem, 6vw, 4.5rem)', fontWeight: 700, lineHeight: 1.05, margin: '0 0 0.5rem 0', color: COLORS.cream }}>
            {ISSUE.fullName}
          </h1>
          <div style={{ fontFamily: FONT.sans, fontSize: 'clamp(13px, 2vw, 18px)', color: 'rgba(250,247,242,0.7)', marginBottom: '2rem' }}>
            {ISSUE.week}
          </div>

          {/* Teaser stats */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', borderTop: `1px solid rgba(250,247,242,0.15)`, paddingTop: '1.5rem' }}>
            {[
              { n: ISSUE.channelsSweEPT, label: 'channels swept' },
              { n: ISSUE.messagesScanned, label: 'messages read' },
              { n: ISSUE.signalsExtracted, label: 'signals extracted' },
              { n: '1', label: 'prize shortlist' },
            ].map(({ n, label }) => (
              <div key={label}>
                <div style={{ fontFamily: FONT.serif, fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, color: COLORS.accent, lineHeight: 1 }}>{n}</div>
                <div style={{ fontFamily: FONT.sans, fontSize: 'clamp(10px, 1.4vw, 13px)', color: 'rgba(250,247,242,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem 1.5rem', background: 'rgba(194,65,12,0.15)', borderRadius: '8px', border: `1px solid rgba(194,65,12,0.3)`, fontFamily: FONT.sans, fontSize: 'clamp(13px, 1.8vw, 16px)', color: COLORS.cream }}>
            🏆 <strong>This week:</strong> Kinship is on the Global EdTech Prize shortlist. The Chrome extension is live on the Chrome Web Store. The Review Concierge and Ask Kinship assistant shipped. And a robot teacher just walked into a New York classroom.
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'clamp(2rem, 4vw, 4rem) clamp(1.5rem, 4vw, 2rem)' }}>

        {/* ── PARTNERS ── */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ background: COLORS.sectionBg.partners, borderRadius: '12px', padding: '2rem' }}>
            <SectionHeader
              emoji="🤝"
              title="Partners Update"
              subtitle="Support structure for September + new pipeline intelligence"
              color={COLORS.sectionAccent.partners}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {PARTNERS_SIGNALS.map((s, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: '10px', padding: '1.25rem', border: `1px solid ${COLORS.border}` }}>
                  <div style={{ fontFamily: FONT.serif, fontSize: 'clamp(14px, 2vw, 17px)', fontWeight: 700, color: COLORS.ink, marginBottom: '0.5rem' }}>{s.title}</div>
                  <div style={{ fontFamily: FONT.sans, fontSize: 'clamp(12px, 1.6vw, 13px)', color: COLORS.steel, lineHeight: 1.6, marginBottom: '0.5rem' }}>{s.body}</div>
                  <SoWhat text={s.soWhat} />
                  <a href={s.link} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '0.75rem', fontFamily: FONT.sans, fontSize: '12px', color: COLORS.sectionAccent.partners, textDecoration: 'none' }}>→ Thread</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PILOT SUCCESS ── */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ background: COLORS.sectionBg.pilot, borderRadius: '12px', padding: '2rem' }}>
            <SectionHeader
              emoji="🎯"
              title="Pilot Success Update"
              subtitle="RHA locked in, TDSB at decision point, UCC feedback loop active"
              color={COLORS.sectionAccent.pilot}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
              {PILOT_SIGNALS.map((p) => <SchoolCard key={p.school} pilot={p} />)}
            </div>

            <div style={{ background: '#fff', borderRadius: '10px', padding: '1.25rem', border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 'clamp(14px, 2vw, 16px)', fontWeight: 700, color: COLORS.ink, marginBottom: '0.75rem' }}>
                🎓 Learning Science One-Pager Refreshed
              </div>
              <div style={{ fontFamily: FONT.sans, fontSize: 'clamp(12px, 1.6vw, 13px)', color: COLORS.steel, lineHeight: 1.6 }}>
                A revised and beautified Learning Science one-pager was shared this week. Key framing note: Kinship doesn't win on learning science principles alone — they are broadly shared. The differentiation is in how Kinship operationalizes them inside real school systems.
              </div>
              <SoWhat text="Use this framing in school-leader conversations. The pager is a tool to open a discussion, not close one." />
            </div>

            <div style={{ marginTop: '1.5rem', background: '#fff', borderRadius: '10px', padding: '1.25rem', border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontFamily: FONT.serif, fontSize: 'clamp(14px, 2vw, 16px)', fontWeight: 700, color: COLORS.ink, marginBottom: '0.5rem' }}>
                🔔 From #topic-product-feedback
              </div>
              <div style={{ fontFamily: FONT.sans, fontSize: 'clamp(12px, 1.6vw, 13px)', color: COLORS.steel, lineHeight: 1.6 }}>
                A teacher perspective raised this week: the "Ask AI" feature dropdown doesn't scroll, and the feature descriptions may not match what the AI actually does. Teacher input on copy-editing the product was welcomed — the ask is: let them know when the UI is stable enough for detailed review so edits don't get made twice.
              </div>
              <SoWhat text="Engineering: confirm a stable UI window so the teacher perspective can inform copy. This is exactly the feedback loop pilot success is for." />
              <a href="https://kinship-9xb4888.slack.com/archives/C0B9FHWR8RE/p1784822386639159" target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '0.5rem', fontFamily: FONT.sans, fontSize: '12px', color: COLORS.sectionAccent.pilot, textDecoration: 'none' }}>→ Thread in #topic-product-feedback</a>
            </div>
          </div>
        </section>

        {/* ── PRODUCT UPDATE ── */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ background: COLORS.sectionBg.product, borderRadius: '12px', padding: '2rem' }}>
            <SectionHeader
              emoji="⚙️"
              title="Product Update"
              subtitle="What shipped this week — in plain English"
              color={COLORS.sectionAccent.product}
            />

            <div style={{ background: '#fff', borderRadius: '10px', padding: '1.25rem 1.5rem', border: `1px solid ${COLORS.border}`, marginBottom: '2rem', fontFamily: FONT.sans, fontSize: 'clamp(12px, 1.6vw, 14px)', color: COLORS.steel, lineHeight: 1.7 }}>
              <strong>Big picture this week:</strong> A major UX cleanup wave landed across the Hearth teacher app. The navigation is cleaner, the Review Concierge gives teachers a structured inbox for student work, the Ask Kinship AI assistant is live, and the Chrome extension is officially on the Chrome Web Store. This is the most interface-visible week of shipping in recent memory.
            </div>

            {/* New Features */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 'clamp(13px, 1.8vw, 16px)', color: COLORS.sectionAccent.product, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ✨ New Features
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {PRODUCT_UPDATES.new.map((item, i) => <ProductCard key={i} item={item} type="new" />)}
              </div>
            </div>

            {/* Improvements */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 'clamp(13px, 1.8vw, 16px)', color: '#0369a1', marginBottom: '1rem' }}>
                🛠️ Improvements
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {PRODUCT_UPDATES.improved.map((item, i) => <ProductCard key={i} item={item} type="improved" />)}
              </div>
            </div>

            {/* Bug Fixes */}
            <div>
              <div style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 'clamp(13px, 1.8vw, 16px)', color: '#059669', marginBottom: '1rem' }}>
                🐛 Bug Fixes
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {PRODUCT_UPDATES.fixed.map((item, i) => <ProductCard key={i} item={item} type="fixed" />)}
              </div>
            </div>

            {/* Claude artifact note */}
            <div style={{ marginTop: '2rem', background: 'rgba(124,58,237,0.06)', border: `1px solid rgba(124,58,237,0.2)`, borderRadius: '10px', padding: '1.25rem' }}>
              <div style={{ fontFamily: FONT.sans, fontSize: 'clamp(12px, 1.6vw, 14px)', color: COLORS.steel, lineHeight: 1.6 }}>
                <strong style={{ color: COLORS.sectionAccent.product }}>💡 On sharing product updates:</strong> A team member used Claude Code this week to auto-screenshot all UX changes from a PR and generate an HTML artifact for review. The team response: "this is actually pretty good." Worth exploring as a lightweight way to share before/after product changes with non-engineering teammates.
              </div>
              <a href="https://kinship-9xb4888.slack.com/archives/C0ANK3CJM8V/p1784727570205429" target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '0.5rem', fontFamily: FONT.sans, fontSize: '12px', color: COLORS.sectionAccent.product, textDecoration: 'none' }}>→ Thread in #team-eng</a>
            </div>
          </div>
        </section>

        {/* ── TOPICS ── */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ background: COLORS.sectionBg.topics, borderRadius: '12px', padding: '2rem' }}>
            <SectionHeader
              emoji="🔭"
              title="Topics Worth Watching"
              subtitle="Competitive intel deep dive + notable signals"
              color={COLORS.sectionAccent.topics}
            />

            {/* Deep Dive */}
            <div style={{ background: '#fff', borderRadius: '12px', border: `2px solid ${COLORS.sectionAccent.topics}`, padding: '1.75rem', marginBottom: '2rem' }}>
              <div style={{ fontFamily: FONT.sans, fontSize: 'clamp(10px, 1.4vw, 12px)', fontWeight: 700, color: COLORS.sectionAccent.topics, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
                🔬 Deep Dive — Robot Teachers
              </div>
              <h3 style={{ fontFamily: FONT.serif, fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 700, color: COLORS.ink, margin: '0 0 0.75rem 0' }}>
                {TOPIC_DEEP_DIVE.title}
              </h3>
              <div style={{ fontFamily: FONT.sans, fontSize: 'clamp(12px, 1.6vw, 14px)', color: '#78716c', fontStyle: 'italic', marginBottom: '1.25rem' }}>
                {TOPIC_DEEP_DIVE.subtitle}
              </div>

              {[
                { label: 'What is it?', text: TOPIC_DEEP_DIVE.what },
                { label: 'What does it do?', text: TOPIC_DEEP_DIVE.does },
                { label: 'What does the internet say?', text: TOPIC_DEEP_DIVE.internet },
                { label: 'What does it mean for Kinship?', text: TOPIC_DEEP_DIVE.kinship },
              ].map(({ label, text }) => (
                <div key={label} style={{ marginBottom: '1rem' }}>
                  <div style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 'clamp(12px, 1.6vw, 14px)', color: COLORS.sectionAccent.topics, marginBottom: '0.25rem' }}>{label}</div>
                  <div style={{ fontFamily: FONT.sans, fontSize: 'clamp(12px, 1.6vw, 14px)', color: COLORS.steel, lineHeight: 1.7 }}>{text}</div>
                </div>
              ))}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                <a href="https://mashable.com/tech/new-york-school-testing-robot-teacher" target="_blank" rel="noreferrer" style={{ fontFamily: FONT.sans, fontSize: '12px', color: COLORS.sectionAccent.topics, textDecoration: 'none' }}>→ Mashable article</a>
                <a href={TOPIC_DEEP_DIVE.link} target="_blank" rel="noreferrer" style={{ fontFamily: FONT.sans, fontSize: '12px', color: COLORS.sectionAccent.topics, textDecoration: 'none' }}>→ Slack thread</a>
              </div>
            </div>

            {/* Also this week */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 'clamp(13px, 1.8vw, 15px)', color: COLORS.steel, marginBottom: '1rem' }}>Also this week</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                {ALSO_THIS_WEEK.map((item, i) => (
                  <div key={i} style={{
                    background: item.highlight ? COLORS.goldLight : '#fff',
                    borderRadius: '10px',
                    padding: '1.25rem',
                    border: item.highlight ? `2px solid ${COLORS.gold}` : `1px solid ${COLORS.border}`,
                  }}>
                    {item.highlight && <div style={{ fontFamily: FONT.sans, fontSize: '11px', fontWeight: 700, color: COLORS.gold, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>🏆 Notable</div>}
                    <div style={{ fontFamily: FONT.sans, fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>#{item.channel}</div>
                    <div style={{ fontFamily: FONT.serif, fontSize: 'clamp(13px, 1.8vw, 16px)', fontWeight: 700, color: COLORS.ink, marginBottom: '0.5rem' }}>{item.title}</div>
                    <div style={{ fontFamily: FONT.sans, fontSize: 'clamp(12px, 1.6vw, 13px)', color: COLORS.steel, lineHeight: 1.6 }}>{item.summary}</div>
                    <a href={item.link} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '0.5rem', fontFamily: FONT.sans, fontSize: '12px', color: COLORS.sectionAccent.topics, textDecoration: 'none' }}>→ Thread</a>
                  </div>
                ))}
              </div>
            </div>

            {/* AI in Education scan */}
            <div style={{ background: '#fff', borderRadius: '10px', padding: '1.25rem', border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontFamily: FONT.sans, fontWeight: 700, fontSize: 'clamp(12px, 1.6vw, 14px)', color: COLORS.steel, marginBottom: '0.75rem' }}>📡 AI in Education — Quick Scan</div>
              <ul style={{ margin: 0, padding: '0 0 0 1.25rem' }}>
                {AI_IN_EDUCATION.map((item, i) => (
                  <li key={i} style={{ fontFamily: FONT.sans, fontSize: 'clamp(12px, 1.6vw, 13px)', color: COLORS.steel, lineHeight: 1.7, marginBottom: '0.5rem' }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── BRAIN CONTRIBUTORS ── */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ background: COLORS.sectionBg.brain, borderRadius: '12px', padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🧠</div>
            <div style={{ fontFamily: FONT.serif, fontSize: 'clamp(18px, 3vw, 24px)', fontWeight: 700, color: COLORS.ink, marginBottom: '0.75rem' }}>
              Brain Contributors
            </div>
            <div style={{ fontFamily: FONT.sans, fontSize: 'clamp(13px, 1.8vw, 15px)', color: COLORS.steel, maxWidth: '500px', margin: '0 auto', lineHeight: 1.7 }}>
              The #brain-changelog channel wasn't accessible to Hermes this week — no contributions were logged. If you've been feeding the Brain with transcripts, meeting notes, or summaries this week, thank you. You'll show up in the next issue. 🙏
            </div>
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fff', borderRadius: '8px', border: `1px solid ${COLORS.border}`, maxWidth: '400px', margin: '1rem auto 0', fontFamily: FONT.sans, fontSize: 'clamp(12px, 1.6vw, 13px)', color: '#9ca3af' }}>
              Signal gap: brain-changelog channel access needs to be restored for Hermes to celebrate contributors properly.
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{
          borderTop: `1px solid ${COLORS.border}`,
          paddingTop: '2rem',
          fontFamily: FONT.sans,
          fontSize: 'clamp(11px, 1.4vw, 13px)',
          color: '#9ca3af',
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontWeight: 700, color: COLORS.steel, marginBottom: '0.5rem' }}>🔥 Most Active Thread</div>
              <div>
                <strong>RHA pilot setup</strong> in <strong>#edu-rha</strong> — 9 replies
              </div>
              <a href="https://kinship-9xb4888.slack.com/archives/C0ANG4EMU3D/p1784662179520879" target="_blank" rel="noreferrer" style={{ color: COLORS.accent, textDecoration: 'none' }}>→ View thread</a>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: COLORS.steel, marginBottom: '0.5rem' }}>📊 Issue Stats</div>
              <div>Issue #{ISSUE.number} · {ISSUE.week}</div>
              <div>{ISSUE.channelsSweEPT} channels swept · {ISSUE.messagesScanned} messages · {ISSUE.signalsExtracted} signals</div>
            </div>
            <div>
              <div style={{ fontWeight: 700, color: COLORS.steel, marginBottom: '0.5rem' }}>⚠️ Signal Gap</div>
              <div>#brain-changelog not accessible — 0 of 1 Brain channels readable</div>
            </div>
          </div>
          <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#c9c0b8', fontSize: '11px' }}>
            Produced by Hermes · Kinship Intelligence Brief · {ISSUE.week}
          </div>
        </footer>
      </div>
    </div>
  );
}
