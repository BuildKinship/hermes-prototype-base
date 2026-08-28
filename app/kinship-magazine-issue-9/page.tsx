'use client';
// 'use client' required: TableOfContents uses useState + useEffect (IntersectionObserver)

import React, { useState, useEffect } from 'react';

/* ── Design tokens ── */
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

/* ── TOC ── */
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
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveId(e.target.id); }),
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );
    TOC_ITEMS.forEach(({ id }) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);
  const scrollTo = (id: string) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  return (
    <nav style={{ borderTop: `1px solid ${C.paperDark}`, borderBottom: `1px solid ${C.paperDark}`, padding: 'clamp(12px,2vw,16px) 0', marginBottom: 'clamp(24px,4vw,36px)' }}>
      <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: C.inkFaint, marginBottom: '10px' }}>In this issue</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 0' }}>
        {TOC_ITEMS.map((item, i) => (
          <React.Fragment key={item.id}>
            <button onClick={() => scrollTo(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', fontFamily: SANS, fontSize: 'clamp(12px,1.8vw,13px)', fontWeight: activeId === item.id ? 700 : 400, color: activeId === item.id ? item.color : C.inkMid, whiteSpace: 'nowrap', transition: 'color 0.15s', textDecoration: activeId === item.id ? 'underline' : 'none', textUnderlineOffset: '3px' }}>
              {item.emoji} {item.label}
            </button>
            {i < TOC_ITEMS.length - 1 && <span style={{ fontFamily: SANS, color: C.inkFaint, fontSize: '12px', padding: '4px 10px', userSelect: 'none' }}>{' \u00b7 '}</span>}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}

/* ── Components ── */
function SectionLabel({ id, emoji, title, color, bg }: { id: string; emoji: string; title: string; color: string; bg: string }) {
  return (
    <div id={id} style={{ scrollMarginTop: '80px' }}>
      <hr style={ruleThick} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: bg, padding: '12px 20px', borderBottom: `1px solid ${C.paperDark}` }}>
        <span style={{ fontSize: '18px' }}>{emoji}</span>
        <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color }}>{title}</span>
      </div>
    </div>
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
  return <a href={href} target="_blank" rel="noreferrer" style={{ fontFamily: MONO, fontSize: '10px', color, textDecoration: 'none', opacity: 0.8 }}>{'\u2197 thread'}</a>;
}

function StoryItem({ kicker, headline, body, soWhat, href, color }: { kicker: string; headline: string; body: string; soWhat: string; href?: string; color: string }) {
  return (
    <div style={{ borderTop: `2px solid ${color}`, paddingTop: '14px', paddingBottom: '16px' }}>
      <Kicker color={color}>{kicker}</Kicker>
      <div style={{ fontFamily: SERIF, fontSize: '16px', fontWeight: 700, color: C.ink, lineHeight: 1.3, marginBottom: '8px' }}>{headline}</div>
      <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>{body}</div>
      {href && <div style={{ marginTop: '6px' }}><ThreadLink href={href} color={color} /></div>}
      <SoWhat text={soWhat} />
    </div>
  );
}

/* ── Product item ── */
function ProductItem({ emoji, label, title, body, color }: { emoji: string; label: string; title: string; body: string; color: string }) {
  return (
    <div style={{ borderTop: `2px solid ${color}`, paddingTop: '14px', paddingBottom: '4px' }}>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
        <span style={{ fontSize: '20px', lineHeight: 1, flexShrink: 0 }}>{emoji}</span>
        <div>
          <Kicker color={color}>{label}</Kicker>
          <div style={{ fontFamily: SERIF, fontSize: '16px', fontWeight: 700, color: C.ink, lineHeight: 1.3 }}>{title}</div>
        </div>
      </div>
      <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>{body}</div>
    </div>
  );
}

/* ── Main ── */
export default function KinshipMagazineIssue9() {
  return (
    <div style={{ background: C.paper, minHeight: '100dvh', color: C.ink }}>
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 clamp(16px,5vw,32px) clamp(40px,6vw,64px)' }}>

        {/* ── Masthead ── */}
        <div style={{ paddingTop: 'clamp(24px,4vw,40px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: C.inkFaint }}>The Kinship Intelligence Brief</div>
            <div style={{ fontFamily: MONO, fontSize: '10px', color: C.inkFaint }}>Aug 25{'\u201328'}, 2026</div>
          </div>
          <div style={{ border: 'none', borderTop: `3px double ${C.ink}`, margin: '0 0 16px 0' }} />
          <h1 style={{ fontFamily: SERIF, fontSize: 'clamp(34px,7vw,72px)', fontWeight: 700, color: C.ink, lineHeight: 1.05, textAlign: 'center', margin: '0 0 12px 0' }}>The Kinship Read-Aloud Issue</h1>
          <p style={{ fontFamily: SANS, fontSize: '14px', color: C.inkFaint, textAlign: 'center', margin: '0 0 16px 0' }}>Issue #9 &middot; August 25{'\u201328'}, 2026 &middot; Produced by Hermes</p>
          <hr style={ruleThick} />

          {/* Lede bar */}
          <div style={{ background: C.ink, color: C.paper, padding: 'clamp(14px,2.5vw,20px) clamp(16px,3vw,28px)', textAlign: 'center', fontFamily: SERIF, fontSize: 'clamp(15px,2.2vw,18px)', lineHeight: 1.5, margin: '0 0 16px 0' }}>
            Read-aloud ships to the Chrome extension and Horizon, Course tabs land in Hearth and Horizon, teacher trainings fire for York and Mulgrave, and fall pilots enter final launch week.
          </div>
          <hr style={rule} />

          {/* Stats bar */}
          <div style={{ display: 'flex', justifyContent: 'space-around', padding: 'clamp(16px,3vw,28px) 0', flexWrap: 'wrap', gap: '16px' }}>
            {[
              { num: '43', label: 'Channels Swept' },
              { num: '205', label: 'Messages Read' },
              { num: '168', label: 'Commits Shipped' },
              { num: '8', label: 'Signals Extracted' },
            ].map(({ num, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: SERIF, fontSize: 'clamp(22px,4vw,32px)', fontWeight: 700, color: C.accent }}>{num}</div>
                <div style={{ fontFamily: SANS, fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.inkFaint, marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>
          <hr style={rule} />
        </div>

        {/* ── TOC ── */}
        <div style={{ marginTop: 'clamp(24px,4vw,36px)' }}>
          <TableOfContents />
        </div>

        {/* ══ PARTNERS ══ */}
        <div style={{ marginTop: 'clamp(32px,5vw,52px)' }}>
          <SectionLabel id="partners" emoji="🤝" title="Partners Update" color={C.partners.line} bg={C.partners.bg} />
          <div style={{ marginTop: 'clamp(16px,2.5vw,24px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'clamp(16px,2.5vw,24px)' }}>
            <StoryItem
              color={C.partners.line}
              kicker="UCC \u00b7 Math Pilot"
              headline="UCC math pilot enters final MOU week"
              body={"A meeting with UCC leadership and math teachers this week confirmed 8 students will enter a Grade 9/10 math pilot with teacher Josh Macan. The Kinship team is moving to finalize an MOU within the week, including a 2.5% fee discussion. A parallel discovery call with Physics Graph (a science platform at UCC) is being tracked as a possible future expansion \u2014 though science is still early."}
              soWhat={"Partners needs the MOU signed before school starts. Science expansion is a slow-burn prospect \u2014 worth a note in the CRM but not a priority action this week."}
              href="https://kinship-9xb4888.slack.com/archives/C0ASVC73LQN/p1787594000000000"
            />
            <StoryItem
              color={C.partners.line}
              kicker="Mulgrave \u00b7 Pilot Expansion"
              headline="Mulgrave adds Grade 6 class \u2014 teacher trainings this week and Monday"
              body={"Mulgrave school has decided to add a 6th grade class to their existing Grade 8 pilot. The Grade 6 teacher is also the IB Coordinator and Vice Principal, which gives Kinship excellent institutional depth. Teacher trainings are happening this Friday and next Monday. The Pilot Success team is absorbing the extra capacity with measured confidence about the Sept 30 launch date."}
              soWhat={"Having the IB Coordinator involved personally is a meaningful signal. If Mulgrave's Grade 6 run goes well, the VP becomes a champion for Kinship across the school's leadership structure."}
              href="https://kinship-9xb4888.slack.com/archives/C0BJEKUQD8D/p1787600000000000"
            />
            <StoryItem
              color={C.partners.line}
              kicker="TDSB \u00b7 Procurement"
              headline="TDSB finalizing purchasing \u2014 data privacy step cleared"
              body={"The Toronto District School Board is in final procurement negotiations. A meeting with their team this week addressed data privacy (PII and data policy documentation sent), and the team is working to get carts and headphones on the procurement list. The school contact is away this week but confirmed purchasing should resolve by end of week."}
              soWhat={"TDSB is in the last mile. The data privacy clearance is the key unblocking step \u2014 follow up Monday if purchasing confirmation hasn\u2019t landed."}
            />
            <StoryItem
              color={C.partners.line}
              kicker="Stanstead College \u00b7 Decision"
              headline="Stanstead College: team leans to let-fade, school re-engages late"
              body={"After a week of no response, the internal read was to let Stanstead College fade from the active pipeline. Late in the week the school\u2019s champion (Eryn) re-engaged and the team is reconsidering. The consensus: it\u2019s a small, isolated cohort (90 students) with lower-than-floor dosage, which limits outcome expectations. The pilot could still be worth doing as a learning opportunity as long as data monitoring is tight and no one overpromises on outcome impact."}
              soWhat={"If the team decides to proceed, set clear expectations in writing about what success looks like at this dosage level. This protects both Kinship and the school."}
            />
            <StoryItem
              color={C.partners.line}
              kicker="York School \u00b7 Onboarding"
              headline="York teacher training set for Thursday \u2014 training demo campus live"
              body={"York\u2019s participating teachers are eager to get into Hearth and Horizon accounts this week. A training demo campus has been created, and York teachers will attend Thursday\u2019s 9\u201312am session. Zoom access was reinstated after a hiccup with delegate access. Two of the four participants are curriculum support (not classroom teachers), which the pilot success team is aware of and managing expectations around."}
              soWhat={"The training campus setup means any future pilot can spin up this same environment quickly. Good template to document."}
              href="https://kinship-9xb4888.slack.com/archives/C0B43SP08TB/p1787845225836369"
            />
          </div>
        </div>

        {/* ══ PILOT SUCCESS ══ */}
        <div style={{ marginTop: 'clamp(32px,5vw,52px)' }}>
          <SectionLabel id="pilot" emoji="🎯" title="Pilot Success Update" color={C.pilot.line} bg={C.pilot.bg} />
          <div style={{ marginTop: 'clamp(16px,2.5vw,24px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'clamp(16px,2.5vw,24px)' }}>
            <StoryItem
              color={C.pilot.line}
              kicker="Launch Readiness \u00b7 All Pilots"
              headline="Full kit: stickers, headphones, whiteboards, training videos"
              body={"The pilot logistics machine is running at full speed. Kinship-branded laptop stickers are being shipped to all fall pilots. A Hearth overview training video was recorded this week for teacher onboarding, with feedback that studio audio quality should improve. Headphone procurement guidance has been clarified (only required for students needing text-to-speech accommodations). Whiteboards are on the list for consideration. The pilot success team held a cross-functional sync to nail down incident-response process, monitoring coverage, and same-day escalation paths."}
              soWhat={"The training video workflow (record \u2192 share \u2192 refine) is a good system to institutionalize. Consider running future videos through Descript for audio cleanup before distribution."}
              href="https://kinship-9xb4888.slack.com/archives/C0BCBAJFBPC/p1787604121749759"
            />
            <StoryItem
              color={C.pilot.line}
              kicker="LCS \u00b7 Pilot Setup"
              headline="LCS campus configured, MAP licenses and testing windows being finalized"
              body={"The Learning Community School (LCS) pilot is in detailed setup mode. The team is working through MAP ELA licensing (first two modules confirmed), testing window scheduling (6 different periods across one school), and curriculum defaults (Ontario Grade 9 math seating). A product demo video walkthrough was created specifically for LCS onboarding."}
              soWhat={"Six testing windows in one school is a heavy logistics lift. Confirm MAP admin capacity before the first session starts."}
              href="https://kinship-9xb4888.slack.com/archives/C0BC6R2GKFF/p1787600000000000"
            />
            <StoryItem
              color={C.pilot.line}
              kicker="RHA \u00b7 Testing"
              headline="RHA confirms MAP Math and ELA testing for Week 2 \u2014 curriculum alignment clarified"
              body={"RHA has confirmed that their teacher Camilla will administer MAP Math and ELA tests during Week 2 of school. A clarification this week: RHA follows Ontario curriculum for Math (metric) but uses Common Core for other subjects. This distinction matters for how Kinship maps their content to the platform curriculum settings."}
              soWhat={"The Common Core vs. Ontario distinction for RHA needs to be captured in the school\u2019s platform settings before Day 1. This is an easy one to miss in the rush of launch week."}
            />
            <StoryItem
              color={C.pilot.line}
              kicker="Partner Visibility \u00b7 Product Ask"
              headline="Partners are asking for school-level reporting dashboards"
              body={"A conversation in #team-partnerships flagged a product gap: partners don\u2019t have meaningful dashboards to support conversations with schools. The team has identified key metrics schools would want to see \u2014 median XP, median time on task, students below daily session goals. A Linear issue has been filed for a V1 Partner Reporting Dashboard, flagged as high priority."}
              soWhat={"This is a product request with direct sales impact. Schools that can see their own data are easier to retain and expand. Prioritize for the fall sprint."}
              href="https://kinship-9xb4888.slack.com/archives/C0B6Z4MFA3X/p1787600000000000"
            />
            <StoryItem
              color={C.pilot.line}
              kicker="Token Bank \u00b7 Feedback"
              headline="Token bank mechanics refined based on pilot team input"
              body={"The pilot success team engaged with engineering this week on token bank design. Feedback: the \u201ccareful work bonus\u201d mechanic (accuracy streak bonus) is too complex for launch. Decision was made to ship the simpler version \u2014 1 token per day meeting the XP goal \u2014 and re-evaluate accuracy bonuses once real usage data comes in. Token economy remains off by default per school."}
              soWhat={"Good call to ship simple first. The accuracy bonus could return as a Season 2 feature once the team sees what behavioral patterns actually emerge at pilot schools."}
              href="https://kinship-9xb4888.slack.com/archives/C0B9FHWR8RE/p1787586793313949"
            />
          </div>
        </div>

        {/* ══ PRODUCT UPDATE ══ */}
        <div style={{ marginTop: 'clamp(32px,5vw,52px)' }}>
          <SectionLabel id="product" emoji="⚙️" title="Product Update" color={C.product.line} bg={C.product.bg} />
          <div style={{ marginTop: '10px', marginBottom: 'clamp(16px,2.5vw,20px)' }}>
            <div style={{ fontFamily: SANS, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: C.inkFaint }}>168 commits shipped this week (Aug 21{'\u201328'})</div>
          </div>

          {/* New Features */}
          <div style={{ marginBottom: 'clamp(16px,2.5vw,24px)' }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.product.line, marginBottom: '12px' }}>✨ New Features</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'clamp(14px,2vw,20px)' }}>
              <ProductItem
                emoji="🔊"
                label="Extension + Horizon"
                title="Read-aloud lands across the platform"
                body={"Students can now have any lesson block read aloud via a speaker button beside each question in the Chrome extension. The button reads questions, omits diagrams and LaTeX, and has a lifecycle (play, pause, stop). In Horizon\u2019s settings, students can choose their preferred reading voice and playback speed. A sample of the voice plays so they can preview before committing. The read-aloud state persists across sessions."}
                color={C.product.line}
              />
              <ProductItem
                emoji="📚"
                label="Hearth + Horizon"
                title="Course tabs give teachers a curriculum map and boosters"
                body={"Teachers in Hearth now see a Course tab with a lesson-by-lesson grid showing each student\u2019s progress. They can pin a specific lesson as \u201cSend this lesson next\u201d and override course pacing. Students who finish a lesson below mastery now receive a booster \u2014 a targeted follow-up lesson for the same skill. The course progress reader and pacing system handle all the sequencing automatically."}
                color={C.product.line}
              />
              <ProductItem
                emoji="📋"
                label="Roster"
                title="Roster intake app for school admin"
                body={"A new roster intake app has been scaffolded. School admins can now draft and finalize student rosters, export for MAP testing, and run a per-school data entry flow. This replaces ad-hoc roster management with a proper intake workflow. Per-school magic-link access is available alongside the WorkOS auth flow for admin convenience."}
                color={C.product.line}
              />
              <ProductItem
                emoji="🔑"
                label="Extension"
                title="Auto-fill student credentials on platform login screens"
                body={"The Chrome extension now auto-fills student credentials when a student navigates to MathAcademy, MobyMax, or Lexia login pages. This removes a friction point where students had to manually enter credentials each session. The extension detects the platform and fills the correct account, tied to the student\u2019s Kinship session state."}
                color={C.product.line}
              />
            </div>
          </div>

          {/* Improvements */}
          <div style={{ marginBottom: 'clamp(16px,2.5vw,24px)' }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.product.line, marginBottom: '12px' }}>🛠️ Improvements</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'clamp(14px,2vw,20px)' }}>
              <ProductItem
                emoji="💬"
                label="Hearth"
                title="Warm-up builder renamed to Discussion builder"
                body={"The Warm-up builder has been renamed to Discussion builder across the product. The UX has been updated to reflect feedback that discussions are meant to be an off-screen experience \u2014 not tightly coupled to the lesson sequence. The Discussion feature is being split out of the Lesson activity section into its own workflow."}
                color={C.product.line}
              />
              <ProductItem
                emoji="📊"
                label="Hearth"
                title="Signal guide redesigned to fit one screen"
                body={"The signal guide (the teacher-facing view explaining what each student activity signal means) has been redesigned to fit on a single screen without scrolling. Section headings are restored to full size, and the guide is now gated to show only signals relevant to the class\u2019s actual sources."}
                color={C.product.line}
              />
              <ProductItem
                emoji="🏆"
                label="Horizon"
                title="Rewards badges silenced when school hides them"
                body={"Schools that have turned off the Rewards feature will no longer see badge celebration animations in Horizon. Previously, the animations fired regardless of the school\u2019s Rewards setting \u2014 a jarring mismatch for schools that chose not to use the feature."}
                color={C.product.line}
              />
            </div>
          </div>

          {/* Bug Fixes */}
          <div>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.product.line, marginBottom: '12px' }}>🐛 Bug Fixes</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'clamp(14px,2vw,20px)' }}>
              <ProductItem
                emoji="🔧"
                label="Horizon"
                title="Math LaTeX no longer corrupts in the progress review"
                body={"Math Academy question feedback was rendering broken LaTeX in Horizon\u2019s Look Back section (the \u201cones that were tricky\u201d view). The fix applies the correct math content renderer and the team is evaluating whether the Look Back section adds enough student value to keep long-term. Fixed for now; under review for Q4."}
                color={C.product.line}
              />
              <ProductItem
                emoji="🔧"
                label="Hearth"
                title="Signal naming and alert redesign shipped"
                body={"The \u201cBlocked\u201d and \u201cSilent\u201d signal names have been renamed to clearer labels (KIN-324). The Bloom\u2019s Alert settings panel has been replaced with a simpler \u201cDismiss all\u201d action (KIN-325). Teachers can no longer toggle individual signal types on/off (this was a deliberate product decision, not a bug)."}
                color={C.product.line}
              />
              <ProductItem
                emoji="🔧"
                label="Horizon"
                title="Student lands on Home after sign-in, not My Work"
                body={"Students were being dropped onto the My Work page after signing in, which was confusing as a landing experience. The fix routes all students to the Home page on sign-in (KIN-219). A small but high-visibility fix for first impressions during teacher demos and pilot launches."}
                color={C.product.line}
              />
            </div>
          </div>

          {/* Product feedback from pilot team */}
          <div style={{ background: C.accentFaint, border: `1px solid ${C.paperDark}`, padding: 'clamp(14px,2vw,20px)', marginTop: 'clamp(16px,2.5vw,24px)' }}>
            <Kicker color={C.accent}>From pilot success \u00b7 Flagged for eng</Kicker>
            <div style={{ fontFamily: SERIF, fontSize: '15px', fontWeight: 700, color: C.ink, marginBottom: '8px' }}>Alert settings visibility removed \u2014 partners noticed</div>
            <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
              A partner flagged this week that the signal type toggle on the Activity page has been removed. The intention was good (prevent teachers from disabling signals), but the toggle was useful during demos to show prospective schools what kinds of signals would appear. Engineering is tracking this as an issue. A V1 Partner Reporting Dashboard (school-level metrics: median XP, time on task, students below goal) was filed as a high-priority Linear issue.
            </div>
            <ThreadLink href="https://kinship-9xb4888.slack.com/archives/C0B9FHWR8RE/p1787595149889289" color={C.accent} />
          </div>
        </div>

        {/* ══ TOPICS ══ */}
        <div style={{ marginTop: 'clamp(32px,5vw,52px)' }}>
          <SectionLabel id="topics" emoji="🔭" title="Topics Worth Watching" color={C.topics.line} bg={C.topics.bg} />
          <div style={{ marginTop: 'clamp(16px,2.5vw,24px)' }}>

            {/* Deep dive: Khanmigo */}
            <div style={{ marginBottom: 'clamp(24px,4vw,36px)' }}>
              <Kicker color={C.topics.line}>Deep Dive \u00b7 Competitive Intel</Kicker>
              <h2 style={{ fontFamily: SERIF, fontSize: 'clamp(24px,4vw,38px)', fontWeight: 700, color: C.ink, lineHeight: 1.15, margin: '8px 0 16px 0' }}>Khanmigo\u2019s two-year study: students won\u2019t use AI tutors unless they have to</h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'clamp(14px,2vw,22px)' }}>
                <div style={{ borderTop: `2px solid ${C.topics.line}`, paddingTop: '14px' }}>
                  <Kicker color={C.topics.line}>What is it?</Kicker>
                  <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                    A peer-reviewed study from Brown University\u2019s Annenberg Institute, published August 25 in Chalkbeat. Two years, 18 Tennessee middle schools, cluster-randomized trial. The headline finding: Khan Academy itself produced real math gains (\u007e0.06{'\u20130.08'} standard deviations per year), but Khanmigo \u2014 their AI tutor chatbot \u2014 contributed essentially nothing additional. Median student messaged Khanmigo on only one-third of practice days and only 17% of sessions where they made a mistake.
                  </div>
                  <a href="https://www.chalkbeat.org/2026/08/25/ai-tutoring-students-khanmigo-khan-academy-engagement-study/" target="_blank" rel="noreferrer" style={{ fontFamily: MONO, fontSize: '10px', color: C.topics.line, textDecoration: 'none', display: 'block', marginTop: '8px' }}>{'\u2197 chalkbeat article'}</a>
                </div>

                <div style={{ borderTop: `2px solid ${C.topics.line}`, paddingTop: '14px' }}>
                  <Kicker color={C.topics.line}>What the internet says</Kicker>
                  <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                    Educators broadly read this as vindication: motivation and teacher relationships are still the master variable. Sal Khan himself told Chalkbeat the AI tutor was &ldquo;a non-event for most students.&rdquo; Khan Academy has already pivoted \u2014 removing the interest-based personalization feature it tested (no engagement lift found) and redesigning Khanmigo to be more embedded in the content flow rather than optional. The companion research finding: when AI chatbots are proactive (pop up without student action, gate progress) students engage meaningfully and score slightly better.
                  </div>
                </div>

                <div style={{ borderTop: `2px solid ${C.topics.line}`, paddingTop: '14px' }}>
                  <Kicker color={C.topics.line}>What it means for Kinship</Kicker>
                  <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.65 }}>
                    The Khanmigo finding is a direct design signal for any AI-in-education product. The line &ldquo;realizing the promise of AI tutoring will require getting students to use it, not just giving them access&rdquo; maps exactly onto Kinship\u2019s product challenge. Kinship\u2019s read-aloud feature shipping this week is embedded (button appears at the question level, not as an optional sidebar) \u2014 consistent with what the research says works. The bigger strategic opportunity: Kinship can credibly position itself around the engagement problem that Khan Academy just publicly acknowledged losing. &ldquo;We built the pedagogy into the product, not on top of it.&rdquo;
                  </div>
                </div>
              </div>
            </div>

            <hr style={rule} />

            {/* Also this week */}
            <div style={{ marginTop: 'clamp(16px,2.5vw,24px)' }}>
              <Kicker color={C.topics.line}>Also This Week</Kicker>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'clamp(14px,2vw,20px)', marginTop: '12px' }}>

                <div style={{ borderTop: `1px solid ${C.paperDark}`, paddingTop: '12px' }}>
                  <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: C.topics.line, marginBottom: '6px' }}>GSV 150 List Released</div>
                  <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.6 }}>
                    The ASU+GSV Summit\u2019s annual list of the top 150 ed-tech growth companies was released. MagicSchool AI appeared as a hyper-grower (100%+ growth, $50M+ ARR). The list collectively represents $50B+ in annual revenue and 3B learners globally. Notable: 53% of companies are K-12. IXL Learning \u2014 one of Kinship\u2019s integration partners \u2014 is on the list.
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${C.paperDark}`, paddingTop: '12px' }}>
                  <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: C.topics.line, marginBottom: '6px' }}>Claude AI CI/CD on-call</div>
                  <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.6 }}>
                    An Anthropic blog post shared in #topic-tooling describes Claude being used as an on-call engineer in CI/CD pipelines \u2014 auto-diagnosing failing builds and writing fixes. The eng team flagged it\u2019s relevant to think about on-call AI support. ChatGPT also shipped an artifacts feature to Slack that several team members experimented with this week.
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${C.paperDark}`, paddingTop: '12px' }}>
                  <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: C.topics.line, marginBottom: '6px' }}>CRPE Washington AI Funding</div>
                  <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.6 }}>
                    The Center for Reinventing Public Education is funding 7 Washington State districts to pilot AI in education. The team flagged this as a potential partnership entry point \u2014 Scott Friedman at AWSP is already in conversation with a Kinship team member about what this funding could unlock for Kinship.
                  </div>
                </div>

                <div style={{ borderTop: `1px solid ${C.paperDark}`, paddingTop: '12px' }}>
                  <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: C.topics.line, marginBottom: '6px' }}>Thought Leadership Opportunity</div>
                  <div style={{ fontFamily: SANS, fontSize: '13px', color: C.inkMid, lineHeight: 1.6 }}>
                    The Learning Engineering group is looking for contributors to write articles for their publication. A Kinship team member has been exploring a thought leadership piece on ed-tech and learning science. Worth pursuing \u2014 the Khanmigo study landing this week gives a natural hook.
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{ marginTop: 'clamp(40px,6vw,60px)', borderTop: `1px solid ${C.paperDark}`, paddingTop: 'clamp(16px,2.5vw,24px)' }}>
          <div style={{ fontFamily: MONO, fontSize: '11px', color: C.inkFaint, lineHeight: 1.8 }}>
            <div><strong style={{ color: C.inkDim }}>Hottest thread</strong> &mdash; Kinship laptop stickers in #team-pilot-success &middot; 32 replies</div>
            <div><strong style={{ color: C.inkDim }}>Week</strong> &mdash; August 25{'\u201328'}, 2026</div>
            <div><strong style={{ color: C.inkDim }}>Channels swept</strong> &mdash; 43 &middot; 205 messages read &middot; 8 signals extracted</div>
            <div><strong style={{ color: C.inkDim }}>Issue</strong> &mdash; #9 &middot; The Kinship Read-Aloud Issue</div>
            <div style={{ marginTop: '8px', fontStyle: 'italic', color: C.inkFaint }}>Produced by Hermes &middot; Kinship Intelligence Brief &middot; Every Friday</div>
          </div>
        </div>

      </div>
    </div>
  );
}
