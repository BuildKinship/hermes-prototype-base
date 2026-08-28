'use client';
// 'use client' — TableOfContents uses useState + useEffect (IntersectionObserver)

import React, { useState, useEffect, type ReactNode } from 'react';

// ── Design tokens (Newspaper system) ────────────────────────────────────────
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
  partners: { line: '#1a6641', bg: '#f0fdf6' },
  pilot:    { line: '#1e4e96', bg: '#f0f5ff' },
  product:  { line: '#5b21b6', bg: '#f7f3ff' },
  topics:   { line: '#92400e', bg: '#fff8f0' },
};
const SERIF = "'Georgia', 'Times New Roman', serif";
const SANS  = "'Inter', 'Helvetica Neue', Arial, sans-serif";
const MONO  = "'IBM Plex Mono', 'Courier New', monospace";

const rule:       React.CSSProperties = { border:'none', borderTop:`1px solid ${C.paperDark}`, margin:'0' };
const ruleThick:  React.CSSProperties = { border:'none', borderTop:`3px solid ${C.ink}`, margin:'0' };
const ruleDouble: React.CSSProperties = { border:'none', borderTop:`3px double ${C.ink}`, margin:'0' };

function Kicker({ children, color = C.accent }: { children: ReactNode; color?: string }) {
  return (
    <div style={{ fontFamily:SANS, fontWeight:700, fontSize:'10px',
      letterSpacing:'0.14em', textTransform:'uppercase', color, marginBottom:'6px' }}>
      {children}
    </div>
  );
}

function SoWhat({ text }: { text: string }) {
  return (
    <div style={{ borderTop:`1px solid ${C.paperDark}`, paddingTop:'10px', marginTop:'10px',
      fontFamily:SANS, fontSize:'12px', color:C.inkDim, lineHeight:1.55 }}>
      <span style={{ fontFamily:SANS, fontWeight:700, fontSize:'10px', letterSpacing:'0.1em',
        textTransform:'uppercase', color:C.accent, marginRight:'6px' }}>So what?</span>
      {text}
    </div>
  );
}

interface SectionLabelProps { id: string; emoji: string; title: string; color: string; bg: string; }
function SectionLabel({ id, emoji, title, color, bg }: SectionLabelProps) {
  return (
    <div id={id} style={{ marginBottom:'0', scrollMarginTop:'80px' }}>
      <hr style={ruleThick} />
      <div style={{ display:'flex', alignItems:'center', gap:'10px',
        background:bg, padding:'12px 20px', borderBottom:`1px solid ${C.paperDark}` }}>
        <span style={{ fontSize:'18px' }}>{emoji}</span>
        <span style={{ fontFamily:SANS, fontWeight:800, fontSize:'12px',
          letterSpacing:'0.12em', textTransform:'uppercase', color }}>
          {title}
        </span>
      </div>
    </div>
  );
}

interface StoryItemProps {
  kicker: string; kickerColor: string; headline: string; body: string;
  soWhat?: string; tags?: string[];
}
function StoryItem({ kicker, kickerColor, headline, body, soWhat, tags }: StoryItemProps) {
  return (
    <div style={{ borderTop:`2px solid ${kickerColor}`, paddingTop:'14px', paddingBottom:'16px' }}>
      <Kicker color={kickerColor}>{kicker}</Kicker>
      <div style={{ fontFamily:SERIF, fontSize:'17px', fontWeight:700, color:C.ink, lineHeight:1.3, marginBottom:'8px' }}>
        {headline}
      </div>
      <div style={{ fontFamily:SANS, fontSize:'13px', color:C.inkMid, lineHeight:1.65 }}>{body}</div>
      {tags && tags.length > 0 && (
        <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginTop:'8px' }}>
          {tags.map(t => (
            <span key={t} style={{ fontFamily:MONO, fontSize:'10px', color:C.inkDim,
              background:C.paperWarm, padding:'2px 6px', borderRadius:'2px' }}>{t}</span>
          ))}
        </div>
      )}
      {soWhat && <SoWhat text={soWhat} />}
    </div>
  );
}

// ── Pull Quote ───────────────────────────────────────────────────────────────
function PullQuote({ quote, attribution, color }: { quote: string; attribution: string; color: string }) {
  return (
    <div style={{ margin:'clamp(16px,2.5vw,24px) 0', padding:'16px 20px',
      borderTop:`3px solid ${color}`, background:C.paperWarm }}>
      <div style={{ fontFamily:SERIF, fontSize:'clamp(15px,2.2vw,19px)', fontStyle:'italic',
        color:C.ink, lineHeight:1.4, marginBottom:'8px' }}>
        {'\u201c'}{quote}{'\u201d'}
      </div>
      <div style={{ fontFamily:SANS, fontSize:'11px', color:C.inkFaint, letterSpacing:'0.06em' }}>
        {'\u2014'} {attribution}
      </div>
    </div>
  );
}

// ── Alert Box ────────────────────────────────────────────────────────────────
function AlertBox({ label, headline, body, color }: { label: string; headline: string; body: string; color: string }) {
  return (
    <div style={{ background:C.accentFaint, border:`1px solid ${C.paperDark}`,
      borderLeft:`3px solid ${color}`, padding:'14px 18px', marginTop:'clamp(12px,2vw,20px)' }}>
      <Kicker color={color}>{label}</Kicker>
      <div style={{ fontFamily:SERIF, fontSize:'15px', fontWeight:700, color:C.ink, marginBottom:'6px' }}>
        {headline}
      </div>
      <div style={{ fontFamily:SANS, fontSize:'12px', color:C.inkMid, lineHeight:1.6 }}>{body}</div>
    </div>
  );
}

// ── Table of Contents ────────────────────────────────────────────────────────
const TOC_ITEMS = [
  { id:'partners',  emoji:'\uD83E\uDD1D', label:'Partners',        color: C.partners.line },
  { id:'pilot',     emoji:'\uD83C\uDFAF', label:'Pilot Success',   color: C.pilot.line    },
  { id:'product',   emoji:'\u2699\uFE0F',  label:'Product',         color: C.product.line  },
  { id:'topics',    emoji:'\uD83D\uDD2D', label:'Topics',           color: C.topics.line   },
];

function TableOfContents() {
  const [activeId, setActiveId] = useState('');
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) setActiveId(e.target.id); }); },
      { rootMargin:'-20% 0px -60% 0px', threshold:0 }
    );
    TOC_ITEMS.forEach(({ id }) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior:'smooth', block:'start' });
  };
  return (
    <nav style={{ borderTop:`1px solid ${C.paperDark}`, borderBottom:`1px solid ${C.paperDark}`,
      padding:'clamp(12px,2vw,16px) 0', marginBottom:'clamp(24px,4vw,36px)' }}>
      <div style={{ fontFamily:SANS, fontWeight:700, fontSize:'10px', letterSpacing:'0.14em',
        textTransform:'uppercase', color:C.inkFaint, marginBottom:'10px' }}>In this issue</div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'6px 0' }}>
        {TOC_ITEMS.map((item, i) => (
          <React.Fragment key={item.id}>
            <button onClick={() => scrollTo(item.id)} style={{
              background:'none', border:'none', cursor:'pointer', padding:'4px 0',
              fontFamily:SANS, fontSize:'clamp(12px,1.8vw,13px)',
              fontWeight: activeId === item.id ? 700 : 400,
              color: activeId === item.id ? item.color : C.inkMid,
              whiteSpace:'nowrap', transition:'color 0.15s',
              textDecoration: activeId === item.id ? 'underline' : 'none',
              textUnderlineOffset:'3px',
            }}>{item.emoji} {item.label}</button>
            {i < TOC_ITEMS.length - 1 && (
              <span style={{ fontFamily:SANS, color:C.inkFaint, fontSize:'12px',
                padding:'4px 10px', userSelect:'none' }}> {'\u00b7'} </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═════════════════════════════════════════════════════════════════════════════
export default function KinshipMagazineIssue10() {
  return (
    <div style={{ background:C.paper, minHeight:'100dvh', fontFamily:SANS }}>
      <div style={{ maxWidth:'780px', margin:'0 auto',
        padding:'0 clamp(16px,5vw,32px) clamp(40px,6vw,64px)' }}>

        {/* ── MASTHEAD ── */}
        <div style={{ paddingTop:'clamp(20px,4vw,36px)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
            fontFamily:SANS, fontSize:'10px', letterSpacing:'0.14em', textTransform:'uppercase',
            color:C.inkFaint, marginBottom:'10px' }}>
            <span>The Kinship Intelligence Brief</span>
            <span>Aug 24{'\u2013'}28, 2026</span>
          </div>
          <hr style={ruleDouble} />
          <h1 style={{ fontFamily:SERIF, fontSize:'clamp(34px,7vw,72px)', fontWeight:700,
            color:C.ink, textAlign:'center', margin:'clamp(12px,2vw,20px) 0 clamp(4px,1vw,8px)',
            lineHeight:1.08 }}>
            The Kinship<br />Show-Ready Issue
          </h1>
          <div style={{ textAlign:'center', fontFamily:SANS, fontSize:'13px', color:C.inkFaint,
            marginBottom:'clamp(12px,2vw,20px)' }}>
            Issue 10 {'\u00b7'} August 24{'\u2013'}28, 2026 {'\u00b7'} Produced by Hermes
          </div>
          <hr style={ruleThick} />

          {/* LEDE BAR */}
          <div style={{ background:C.ink, color:C.paper, padding:'clamp(12px,2vw,18px) 20px',
            textAlign:'center', fontFamily:SERIF, fontSize:'clamp(15px,2.5vw,18px)',
            fontStyle:'italic', lineHeight:1.5, marginBottom:'4px' }}>
            Six schools go live in two weeks. An RCT just confirmed embedded AI beats opt-in AI.
            The groupings feature needs a product conversation before it becomes a promise problem.
          </div>
          <hr style={rule} />

          {/* STATS BAR */}
          <div style={{ display:'flex', justifyContent:'center', gap:'clamp(20px,5vw,52px)',
            padding:'clamp(12px,2vw,20px) 0', textAlign:'center' }}>
            {[
              { n:'9', label:'call transcripts read' },
              { n:'49', label:'brain entries this week' },
              { n:'6', label:'schools launching Sept' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily:SERIF, fontSize:'clamp(22px,4vw,32px)', fontWeight:700,
                  color:C.accent, lineHeight:1 }}>{s.n}</div>
                <div style={{ fontFamily:SANS, fontSize:'10px', letterSpacing:'0.12em',
                  textTransform:'uppercase', color:C.inkFaint, marginTop:'4px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <TableOfContents />

        {/* ═══════════════════════════════════════════════════════════════
            🤝 PARTNERS UPDATE
        ════════════════════════════════════════════════════════════════ */}
        <div style={{ marginTop:'clamp(32px,5vw,52px)' }}>
          <SectionLabel id="partners" emoji="\uD83E\uDD1D" title="Partners Update" color={C.partners.line} bg={C.partners.bg} />
          <div style={{ padding:'clamp(16px,2.5vw,24px) 0',
            display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap:'clamp(16px,2.5vw,24px)' }}>

            <StoryItem
              kicker="Pipeline Operations"
              kickerColor={C.partners.line}
              headline={"Pipeline Sheet Alignment: Notion Is Now the Single Source of Truth"}
              body={"Monday's pipeline alignment meeting revealed real discrepancies across all reps \u2014 one partner reported 12 schools, Notion showed 10; another reported 16, reconciled to 15. The root cause: stage definitions kept shifting and weren't reflected consistently. The team formally agreed on a new mutual-exclusion framework (Engaged \u2192 Discovery \u2192 Stakeholder / Pilot Design \u2192 Verbal Commit \u2192 MOU \u2192 Signed) and named Notion as the authoritative record going forward. A full CRM is coming in 1\u20132 weeks that will automate this permanently."}
              soWhat={"Allan pushed for pipeline clarity last week. This meeting was the direct response. With six pilots starting in September, clean pipeline data isn't cosmetic \u2014 it determines staffing and launch coverage."}
              tags={["pipeline", "ops", "crm"]}
            />

            <StoryItem
              kicker="New School Prospect"
              kickerColor={C.partners.line}
              headline={"Strong Private School Inbound: Full Transformation Pitch, Board Supportive"}
              body={"A new private school prospect came up on Thursday's partner sync \u2014 interested in full school transformation, technology and estate together. The board chair is supportive. Not a formal commit yet, but assessed as likely to close within the year. A small VC/angel investor was also surfaced in the same week; leadership guidance is to stay focused on revenue pathway rather than actively fundraise for now."}
              soWhat={"The 'full transformation' framing is the highest-value deal type Kinship pitches. If the board chair is already onside, this is worth tracking at the top of the pipeline."}
              tags={["new prospect", "partnerships"]}
            />

            <StoryItem
              kicker="LFG Academy"
              kickerColor={C.partners.line}
              headline={"LFG: Great Call with Leadership, MOU Is the Next Step"}
              body={"A call with LFG Academy's Ignacio, Alan Gertner, and Thomas this week went well. LFG is building a new 3,000 sq ft facility and wants Kinship as the orchestration layer over their existing AI instructional tools. Next step is a formal MOU. The pilot was previously pushed to January; that remains the target start. Dave Pettine is managing the relationship and Thomas is now looped in on the tech-lead side."}
              soWhat={"LFG is a strong strategic fit \u2014 a school that already believes in AI-native instruction. January gives time to get the MOU clean and set up the right pilot design."}
              tags={["lfg", "mou", "january"]}
            />

            <StoryItem
              kicker="Rashi School"
              kickerColor={C.partners.line}
              headline={"Rashi: October 5 Go-Live Confirmed, Teacher Philosophy Concern to Address"}
              body={"Rashi's kickoff call this week confirmed a Grade 4 pilot go-live of October 5. Teacher training is scheduled for September 22 and 24. One substantive concern surfaced: the Grade 4 teacher compared Math Academy's self-paced model against Illustrative Math's dialogue-based approach and asked how Kinship reconciles them. The team offered to bridge both frameworks. Roster request sent; teacher onboarding communication pending from the school."}
              soWhat={"The Illustrative Math vs. Math Academy tension is a recurring objection for math-specialist teachers. Having a crisp answer to this is a product marketing task, not just a sales one."}
              tags={["rashi", "oct 5", "math academy"]}
            />

            <StoryItem
              kicker="Partner Ops · Role Clarity"
              kickerColor={C.partners.line}
              headline={"Dave's Role Redefined: Hunting Only, No Implementations"}
              body={"A firm internal decision was made this week: Dave Pettine is not to run implementations. His KPIs are to focus on hunting and relationship management only; implementations will be handled by Lindsay or other team members. This came after concerns that implementations handled by the wrong person creates risk. Lindsay is also being asked to cover Middle Eastern accounts (Tom Keen, GEMS) in addition to her current load. The question of whether Dave should even be present at Greater Dayton's September launch was discussed."}
              soWhat={"This is a significant role-clarity call. Pilot success coverage for three simultaneous September launches \u2014 RHA, Greater Dayton, UCCC \u2014 needs to be explicitly assigned now."}
              tags={["team ops", "implementations"]}
            />

            <StoryItem
              kicker="Revenue Tracking"
              kickerColor={C.partners.line}
              headline={"Pilot Fee Gap Surfaced: Several Lighthouse Schools Are Currently Unpaid"}
              body={"It emerged this week that some schools currently in pilots were never charged pilot fees. Guidance from leadership: prefer to charge when possible, but waive for high-priority lighthouse schools. Several prominent schools are in the lighthouse category and carry no fee. Lydia is tracking the full picture. The broader staffing discussion about sustainable pilot coverage was deferred to mid-September while key team members are out."}
              soWhat={"Knowing which schools are lighthouse vs. revenue-generating matters for burn rate projections. Lydia's tracking list should feed into the finance view."}
              tags={["revenue", "pilots", "finance"]}
            />

          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            🎯 PILOT SUCCESS UPDATE
        ════════════════════════════════════════════════════════════════ */}
        <div style={{ marginTop:'clamp(32px,5vw,52px)' }}>
          <SectionLabel id="pilot" emoji="\uD83C\uDFAF" title="Pilot Success Update" color={C.pilot.line} bg={C.pilot.bg} />

          {/* Launch status table */}
          <div style={{ padding:'clamp(16px,2.5vw,24px) 0 0' }}>
            <div style={{ fontFamily:SANS, fontWeight:700, fontSize:'10px', letterSpacing:'0.12em',
              textTransform:'uppercase', color:C.inkFaint, marginBottom:'12px' }}>
              September Launch Status
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
              gap:'10px', marginBottom:'clamp(20px,3vw,32px)' }}>
              {[
                { school:'RHA', date:'Sept 8', status:'On Track', detail:'Dan on-site Sept 9\u201310. Teachers have prior Kinship exposure. MAP testing done. Launch is mostly monitoring.', color:'#1a6641' },
                { school:'Greater Dayton', date:'Sept 8\u201310', status:'On Track', detail:'Math Academy API keys issued. Rostering via MA API is first test run. Lindsay covering implementation.', color:'#1a6641' },
                { school:'UCCC', date:'Sept 8 (TBD)', status:'Ambitious', detail:'Verbal agreement confirmed Aug 25. Campus needs to be created immediately. Sept 8 is tight \u2014 Oct 1 backup plan in place.', color:'#b83a0c' },
                { school:'York', date:'Sept (3 wks)', status:'Training Thu', detail:'3 teachers logging into Hearth and Horizon this week. Teachers haven\u2019t fully embraced the model yet \u2014 flagged.', color:'#92400e' },
                { school:'Mulgrave', date:'Sept 30', status:'On Track', detail:'Teacher training next week. BYOD school. Nadim to sync with Maggie on launch-day support needs.', color:'#1a6641' },
                { school:'Rashi', date:'Oct 5', status:'Confirmed', detail:'Grade 4 pilot. Teacher training Sept 22 & 24. Roster request sent.', color:'#1a6641' },
              ].map(s => (
                <div key={s.school} style={{ borderTop:`2px solid ${s.color}`,
                  paddingTop:'10px', paddingBottom:'12px' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'4px' }}>
                    <span style={{ fontFamily:SERIF, fontSize:'15px', fontWeight:700, color:C.ink }}>{s.school}</span>
                    <span style={{ fontFamily:MONO, fontSize:'10px', color:s.color }}>{s.status}</span>
                  </div>
                  <div style={{ fontFamily:SANS, fontSize:'11px', color:C.inkDim, marginBottom:'5px',
                    fontWeight:600, letterSpacing:'0.04em' }}>{s.date}</div>
                  <div style={{ fontFamily:SANS, fontSize:'12px', color:C.inkMid, lineHeight:1.5 }}>{s.detail}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap:'clamp(16px,2.5vw,24px)' }}>

            <StoryItem
              kicker="Cross-Functional Alert \u00b7 Product Gap"
              kickerColor={C.pilot.line}
              headline={"Groupings Feature Has No Backend \u2014 Partner Expectations Need Realigning"}
              body={"Thursday's cross-functional meeting surfaced a significant mismatch: the groupings feature, which at least one partner has been actively selling to schools, currently has no backend functionality. There is no way to assign a group to a different lesson or remedial track because the lesson builder doesn't exist yet. The team aligned that all partners need to be coached on how to message groupings carefully, and the partner in question needs to document what she's told schools so it can be addressed directly."}
              soWhat={"When a feature that appears in demos doesn't actually work, it creates trust debt with schools before the pilot even starts. Engineering and pilot success need a shared 'what's real vs. what's roadmap' communication protocol."}
              tags={["product gap", "groupings", "urgent"]}
            />

            <StoryItem
              kicker="Cross-Functional \u00b7 Campus Setup"
              kickerColor={C.pilot.line}
              headline={"Campus Setup Is a Blocker: Hearth Campuses Must Exist Before Rosters Can Be Sent"}
              body={"Brittany flagged in Thursday's cross-functional call that campuses must be created in Hearth before roster pages and roster links can go to schools. RHA and Greater Dayton start September 8. The team confirmed that existing UCCC and RHA instances need to be wiped and recreated. William confirmed Brittany can create new campuses herself. This needs to happen this week."}
              soWhat={"One week of lead time is the minimum for school onboarding to feel smooth. Every day this sits unresolved narrows that window."}
              tags={["blocker", "campus setup", "urgent"]}
            />

            <StoryItem
              kicker="Math Academy \u00b7 Risk"
              kickerColor={C.pilot.line}
              headline={"Teacher Resistance to Math Academy Is Higher Than Expected Across All Schools"}
              body={"Both the cross-functional meeting and the Nadim/Dan weekly independently surfaced the same signal: teachers at pilot schools are more resistant to Math Academy than the team anticipated. At UCCC, teachers are complying only because of their relationship with leadership, not because they believe in the product. One 'physics graph pitch' that seemed well-received was later revealed to have had no real buy-in from teachers who said they lacked resources to evaluate it. Surface enthusiasm does not equal adoption."}
              soWhat={"This is a core pilot risk. Dan raised the question of diversifying away from Math Academy as the central bet \u2014 learning support, course builders, other subjects were all floated. That strategic conversation needs to happen before September launches."}
              tags={["math academy", "teacher buy-in", "risk"]}
            />

            <StoryItem
              kicker="Math Academy \u00b7 Billing"
              kickerColor={C.pilot.line}
              headline={"Existing MA Accounts at Three Schools Create Unresolved Billing Complexity"}
              body={"UCCC, York, and Greater Dayton all have existing Math Academy accounts. This creates unresolved billing and contractual complexity that needs to be addressed within 7 days. Math Academy created API keys for all schools; rostering for Greater Dayton will be the first test run. Separately, a concern was raised that schools are being told grading functionality (midterms/finals) will be available via Math Academy, but MA has not confirmed this. Tyler is following up directly with Math Academy contacts today."}
              soWhat={"Billing ambiguity + unconfirmed grading features = a credibility risk with schools at launch. Both need resolution before September 8."}
              tags={["math academy", "billing", "api"]}
            />

            <StoryItem
              kicker="RHA \u00b7 Launch Readiness"
              kickerColor={C.pilot.line}
              headline={"RHA Board Meeting: Precision Learning Deck Ready, MOA to Be Signed"}
              body={"The RHA board meeting on August 27 included a Precision Learning presentation prepared with Kinship. The framing positions Kinship as a co-creator with RHA leadership \u2014 not an external vendor \u2014 around AI-driven, real-time teacher interventions. The MOA is to be signed following the presentation. MAP science testing will happen during the second week of the testing window to work around limited computers in the specialized class."}
              soWhat={"A signed MOA from RHA is a foundation document for the September pilot. If it was signed at the board meeting, that's a milestone worth celebrating internally."}
              tags={["rha", "board", "moa"]}
            />

            <StoryItem
              kicker="Motivational Model \u00b7 Approach"
              kickerColor={C.pilot.line}
              headline={"Motivational Conversations Move Post-Launch: No Pressure to Finalize Before Training"}
              body={"A deliberate decision was made in the Nadim/Brittany/Dan weekly: rather than asking partner schools to lead motivation framework conversations pre-launch (too stressful), Brittany will own facilitated motivational conversations post-training. The motivation framework (autonomy, relatedness, competence) will be previewed in training sessions, with a structured follow-up offered by Brittany in the first weeks. No time pressure to finalize the model before launch."}
              soWhat={"This is a good design decision \u2014 pre-launch motivation conversations would create unnecessary anxiety. Post-launch, schools have real data to anchor the conversation."}
              tags={["motivational model", "training"]}
            />

          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            ⚙️ PRODUCT UPDATE
        ════════════════════════════════════════════════════════════════ */}
        <div style={{ marginTop:'clamp(32px,5vw,52px)' }}>
          <SectionLabel id="product" emoji="\u2699\uFE0F" title="Product Update" color={C.product.line} bg={C.product.bg} />
          <div style={{ padding:'clamp(12px,2vw,20px) 0 0' }}>
            <div style={{ fontFamily:SANS, fontSize:'11px', letterSpacing:'0.1em', textTransform:'uppercase',
              color:C.inkFaint, marginBottom:'16px' }}>What shipped this week</div>

            {/* NEW FEATURES */}
            <div style={{ marginBottom:'clamp(20px,3vw,28px)' }}>
              <div style={{ fontFamily:SANS, fontWeight:700, fontSize:'12px', letterSpacing:'0.1em',
                textTransform:'uppercase', color:C.product.line, marginBottom:'12px' }}>
                {'✨ New Features'}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                gap:'clamp(12px,2vw,20px)' }}>

                {[
                  { emoji:'🚩', scope:'Hearth · Internal', title:'Feature-Flag Assignment Dashboard',
                    body:'A new internal dashboard that is now the single place where feature flags are assigned to schools. Teachers and students see only the features their school has enabled. Every flag now has a human-readable description. Directly addresses the sprint of school-by-school configuration needed for September launches (KIN-406, KIN-437).' },
                  { emoji:'✍️', scope:'Hearth · Editor', title:'Live Markdown Styling in Content Fields',
                    body:'Text fields in Hearth now render markdown formatting live as teachers type \u2014 bold, italics, headers, lists. Media fields commit on blur rather than requiring an explicit save. Makes lesson content creation substantially more fluid (#603).' },
                  { emoji:'🏫', scope:'Hearth · Internal', title:'All-Feature Academy: Internal Demo Tenant',
                    body:'Kinship now has an internal test tenant that resolves every feature flag at once \u2014 giving the team a single place to demo any combination of features without needing a real school\'s configuration. Critical for the current demo cycle with LCS (KIN-331).' },
                ].map((item) => (
                  <div key={item.title} style={{ borderTop:`2px solid ${C.product.line}`, paddingTop:'14px' }}>
                    <div style={{ display:'flex', gap:'10px', marginBottom:'8px' }}>
                      <span style={{ fontSize:'18px', lineHeight:1, flexShrink:0 }}>{item.emoji}</span>
                      <div>
                        <Kicker color={C.product.line}>{item.scope}</Kicker>
                        <div style={{ fontFamily:SERIF, fontSize:'15px', fontWeight:700, color:C.ink, lineHeight:1.3 }}>
                          {item.title}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontFamily:SANS, fontSize:'12px', color:C.inkMid, lineHeight:1.65 }}>{item.body}</div>
                  </div>
                ))}

              </div>
            </div>

            {/* FIXES */}
            <div style={{ marginBottom:'clamp(20px,3vw,28px)' }}>
              <div style={{ fontFamily:SANS, fontWeight:700, fontSize:'12px', letterSpacing:'0.1em',
                textTransform:'uppercase', color:C.product.line, marginBottom:'12px' }}>
                {'🐛 Bug Fixes'}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                gap:'clamp(12px,2vw,20px)' }}>
                {[
                  { emoji:'🔧', title:'Skill Map Containment', body:'Skills no longer spill outside the Skill Map container on certain screen sizes (#599).' },
                  { emoji:'🔄', title:'Course Reorder Collisions', body:'Reordering courses uses a park-then-renumber approach so two swaps can\'t collide. Course lists are reliably ordered after any drag (#602).' },
                  { emoji:'👁️', title:'Background Tab Inference', body:'AI inference jobs now continue heartbeating when Kinship is in a background tab rather than pausing entirely (#601).' },
                  { emoji:'📊', title:'Horizon Demo Surface Polish', body:'Course map navigation, preview frame fencing, and mixed-practice candidate capping all polished for the LCS demo this week (#609).' },
                ].map((item) => (
                  <div key={item.title} style={{ borderTop:`1px solid ${C.paperDark}`, paddingTop:'12px' }}>
                    <div style={{ display:'flex', gap:'8px', marginBottom:'5px' }}>
                      <span style={{ fontSize:'15px', lineHeight:1, flexShrink:0 }}>{item.emoji}</span>
                      <div style={{ fontFamily:SERIF, fontSize:'14px', fontWeight:700, color:C.ink, lineHeight:1.3 }}>
                        {item.title}
                      </div>
                    </div>
                    <div style={{ fontFamily:SANS, fontSize:'12px', color:C.inkMid, lineHeight:1.6 }}>{item.body}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Signal from product-feedback */}
            <AlertBox
              label="Product Feedback \u00b7 Alert"
              headline="Time-on-Task Requirements Still Undefined \u2014 Schools Are Asking"
              body={"The time-on-task feature is on the roadmap but requirements are not specified well enough to build. Key open questions: what counts as active time (tab blur vs. lesson engagement), how to handle bathroom breaks, tab switching. Brittany committed to writing a one-pager defining requirements by end of week. Separately, a teacher asked this week where the alert/signal toggle settings moved to on the Activity page \u2014 this feature may have been temporarily disabled, and 14 replies flagged it as high-value for demos."}
              color={C.product.line}
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            🔭 TOPICS WORTH WATCHING
        ════════════════════════════════════════════════════════════════ */}
        <div style={{ marginTop:'clamp(32px,5vw,52px)' }}>
          <SectionLabel id="topics" emoji="\uD83D\uDD2D" title="Topics Worth Watching" color={C.topics.line} bg={C.topics.bg} />
          <div style={{ padding:'clamp(16px,2.5vw,24px) 0' }}>

            {/* DEEP DIVE: Khanmigo study */}
            <div style={{ borderTop:`2px solid ${C.topics.line}`, paddingTop:'14px', marginBottom:'clamp(24px,4vw,36px)' }}>
              <Kicker color={C.topics.line}>Deep Dive {'\u00b7'} Competitive Research</Kicker>
              <h3 style={{ fontFamily:SERIF, fontSize:'clamp(22px,4vw,30px)', fontWeight:700,
                color:C.ink, lineHeight:1.2, margin:'0 0 12px' }}>
                Passive Opt-In AI Fails. Embedded AI Works.
              </h3>
              <div style={{ fontFamily:SANS, fontSize:'11px', color:C.inkFaint, marginBottom:'16px' }}>
                Chalkbeat {'\u00b7'} Brown University EdWorking Paper No. 26-1551 {'\u00b7'} Philip Oreopoulos, U of Toronto {'\u00b7'} Aug 25, 2026
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                gap:'clamp(16px,2.5vw,24px)', marginBottom:'16px' }}>
                <div>
                  <div style={{ fontFamily:SANS, fontWeight:700, fontSize:'11px', letterSpacing:'0.1em',
                    textTransform:'uppercase', color:C.inkDim, marginBottom:'8px' }}>The study</div>
                  <div style={{ fontFamily:SANS, fontSize:'13px', color:C.inkMid, lineHeight:1.65 }}>
                    A two-year randomized controlled trial across 18 middle schools in Tennessee. Khanmigo {'\u2014'} Khan Academy's AI tutoring chatbot {'\u2014'} was made available to nearly every student. It used Socratic reasoning, refused to give direct answers, and required students to <em>opt in</em> to use it. Students used it on only <strong>~{'\u215B'} of days</strong> they were on Khan Academy. Math gains came from the platform, not the AI. In a companion study where AI appeared <em>automatically</em> when students were stuck, students were more accurate and retained more a week later.
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily:SANS, fontWeight:700, fontSize:'11px', letterSpacing:'0.1em',
                    textTransform:'uppercase', color:C.inkDim, marginBottom:'8px' }}>What it means for Kinship</div>
                  <div style={{ fontFamily:SANS, fontSize:'13px', color:C.inkMid, lineHeight:1.65 }}>
                    This is peer-reviewed validation of Kinship's design. Passive AI {'\u2014'} "one click away" {'\u2014'} doesn't move the needle. Embedded AI that intercepts students at moments of struggle, woven into the instructional flow, produced measurably better outcomes. Kinship's AI is woven into the student's natural learning path, not an optional chatbot sidebar. This study is citation-worthy in every partnership conversation.
                  </div>
                </div>
              </div>

              <PullQuote
                quote={"The AI could not just sit next to the content. It had to be woven into it. We had to make productive struggle harder to sidestep."}
                attribution={"Sal Khan, on Khan Academy's post-study redesign"}
                color={C.topics.line}
              />

              <div style={{ fontFamily:SANS, fontSize:'11px', color:C.inkFaint }}>
                <a href="https://www.chalkbeat.org/2026/08/25/ai-tutoring-students-khanmigo-khan-academy-engagement-study/"
                  target="_blank" rel="noreferrer"
                  style={{ color:C.topics.line, textDecoration:'none', fontFamily:MONO }}>
                  {'↗ Chalkbeat article'}
                </a>
                <span style={{ margin:'0 10px', color:C.paperDark }}>/</span>
                <a href="https://kinship-9xb4888.slack.com/archives/C0BJ3SYHSC3"
                  target="_blank" rel="noreferrer"
                  style={{ color:C.topics.line, textDecoration:'none', fontFamily:MONO }}>
                  {'↗ #topic-learning-science'}
                </a>
              </div>
            </div>

            {/* DEEP DIVE 2: The Reevo Signal */}
            <div style={{ borderTop:`2px solid ${C.topics.line}`, paddingTop:'14px', marginBottom:'clamp(24px,4vw,36px)' }}>
              <Kicker color={C.topics.line}>Deep Dive {'\u00b7'} Competitive Intel</Kicker>
              <h3 style={{ fontFamily:SERIF, fontSize:'clamp(20px,3.5vw,26px)', fontWeight:700,
                color:C.ink, lineHeight:1.2, margin:'0 0 12px' }}>
                Reevo: The Partner That Shows What Best-in-Class Customer Support Looks Like
              </h3>
              <div style={{ fontFamily:SANS, fontSize:'13px', color:C.inkMid, lineHeight:1.65, marginBottom:'16px' }}>
                The pilot incident escalation process discussion this week cited Reevo's approach to customer support as a model worth studying. Reevo operates customer support directly inside Slack channels {'\u2014'} the partner's team and Reevo's team share a channel, and issues get resolved in a conversational, visible way rather than through a ticket system. The Kinship team is adopting a similar pattern for pilot school escalations, with a dedicated Slack channel and a consistent naming convention (school + date).
              </div>
              <div style={{ fontFamily:SANS, fontSize:'13px', color:C.inkMid, lineHeight:1.65 }}>
                Separately, Kinship held an internal pre-call before meeting with Reevo as a partner this week {'\u2014'} specifically to align on what product features would and wouldn't be available at pilot start, and how to frame pricing without locking into unfavorable terms early. The pre-call pattern itself is worth institutionalizing: having internal alignment before every partner meeting catches product/expectation gaps before they become partner problems.
              </div>
              <SoWhat text={"The internal pre-call practice is a low-cost habit with high upside. Formalizing it \u2014 even as a 15-min async doc before major partner calls \u2014 could prevent the groupings-feature type of mismatch from recurring."} />
            </div>

            {/* EdTech news roundup */}
            <div style={{ borderTop:`1px solid ${C.paperDark}`, paddingTop:'16px' }}>
              <div style={{ fontFamily:SANS, fontWeight:700, fontSize:'11px', letterSpacing:'0.1em',
                textTransform:'uppercase', color:C.inkDim, marginBottom:'12px' }}>
                Also This Week in EdTech
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                gap:'clamp(12px,2vw,20px)' }}>
                {[
                  { emoji:'📊', headline:'86% of Students Used AI in Class This Year', body:'A new Instructure/EdSource survey finds AI is now a standard part of the school routine. The debate has shifted from whether to how. Kinship is on the right side of this curve.' },
                  { emoji:'🇳🇴', headline:'Norway Bans AI for Grades 1\u20137', body:'Norway blocked generative AI for elementary students starting this month. One of the clearest national-level restrictions to date, framed around cognitive development and child safety.' },
                  { emoji:'🇦🇪', headline:'UAE Mandates AI Training for 1.27M Students', body:'UAE\u2019s 2026\u20132027 school year opens with AI training mandated across all schools. Directionally opposite to Norway \u2014 the global regulatory picture is fragmenting fast.' },
                  { emoji:'🧑\u200d🎓', headline:'Students Draft a National AI Policy Framework', body:'98 high schoolers from all 50 US states produced "The STUDENTS FIRST Act" \u2014 a student-authored policy framework emphasizing human relationships and students\u2019 right to refuse AI.' },
                ].map((item, i) => (
                  <div key={i} style={{ borderTop:`1px solid ${C.paperDark}`, paddingTop:'12px' }}>
                    <div style={{ fontSize:'18px', marginBottom:'6px' }}>{item.emoji}</div>
                    <div style={{ fontFamily:SERIF, fontSize:'14px', fontWeight:700, color:C.ink,
                      lineHeight:1.3, marginBottom:'6px' }}>{item.headline}</div>
                    <div style={{ fontFamily:SANS, fontSize:'12px', color:C.inkMid, lineHeight:1.6 }}>{item.body}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── FOOTER ── */}
        <div style={{ marginTop:'clamp(32px,5vw,52px)' }}>
          <hr style={ruleDouble} />
          <div style={{ padding:'clamp(16px,2.5vw,24px) 0',
            display:'flex', flexWrap:'wrap', gap:'clamp(12px,2vw,20px)',
            justifyContent:'space-between' }}>
            <div>
              <div style={{ fontFamily:SANS, fontWeight:700, fontSize:'10px', letterSpacing:'0.1em',
                textTransform:'uppercase', color:C.inkFaint, marginBottom:'4px' }}>Top signal this week</div>
              <div style={{ fontFamily:SERIF, fontSize:'13px', color:C.inkMid }}>
                <strong>Teacher resistance to Math Academy</strong> flagged independently in 3 calls
              </div>
            </div>
            <div>
              <div style={{ fontFamily:SANS, fontWeight:700, fontSize:'10px', letterSpacing:'0.1em',
                textTransform:'uppercase', color:C.inkFaint, marginBottom:'4px' }}>Sources</div>
              <div style={{ fontFamily:MONO, fontSize:'11px', color:C.inkMid, lineHeight:1.6 }}>
                9 call transcripts {'\u00b7'} 49 brain entries {'\u00b7'} Slack sweep<br />
                Aug 24{'\u2013'}28, 2026 {'\u00b7'} Issue #10
              </div>
            </div>
          </div>
          <hr style={rule} />
          <div style={{ textAlign:'center', padding:'16px 0',
            fontFamily:SANS, fontSize:'11px', color:C.inkFaint, lineHeight:1.6 }}>
            Produced by Hermes {'\u00b7'} Kinship Intelligence Brief {'\u00b7'} Internal use only<br />
            <span style={{ fontFamily:MONO, fontSize:'10px' }}>#open-kinship {'\u00b7'} kinship-9xb4888.slack.com</span>
          </div>
        </div>

      </div>
    </div>
  );
}
