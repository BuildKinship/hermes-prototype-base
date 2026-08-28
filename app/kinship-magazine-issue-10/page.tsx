'use client';
// 'use client' — TableOfContents uses useState + useEffect (IntersectionObserver)

import React, { useState, useEffect, type ReactNode } from 'react';

// ── Design tokens (Newspaper system, approved Jul 2026) ──────────────────────
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
  brain:    { line: '#6b21a8', bg: '#fdf5ff' },
};
const SERIF = "'Georgia', 'Times New Roman', serif";
const SANS  = "'Inter', 'Helvetica Neue', Arial, sans-serif";
const MONO  = "'IBM Plex Mono', 'Courier New', monospace";

const rule:      React.CSSProperties = { border:'none', borderTop:`1px solid ${C.paperDark}`, margin:'0' };
const ruleThick: React.CSSProperties = { border:'none', borderTop:`3px solid ${C.ink}`, margin:'0' };
const ruleDouble:React.CSSProperties = { border:'none', borderTop:`3px double ${C.ink}`, margin:'0' };

// ── Utility components ───────────────────────────────────────────────────────
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

function ThreadLink({ href, color = C.accent }: { href: string; color?: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer"
      style={{ fontFamily:MONO, fontSize:'10px', color, textDecoration:'none', opacity:0.8 }}>
      {'↗ thread'}
    </a>
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
  soWhat?: string; link?: string; tags?: string[];
}
function StoryItem({ kicker, kickerColor, headline, body, soWhat, link, tags }: StoryItemProps) {
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
      {link && (
        <div style={{ marginTop:'8px' }}>
          <ThreadLink href={link} color={kickerColor} />
        </div>
      )}
    </div>
  );
}

// ── Table of Contents ────────────────────────────────────────────────────────
const TOC_ITEMS = [
  { id:'partners',  emoji:'🤝', label:'Partners',        color: C.partners.line },
  { id:'pilot',     emoji:'🎯', label:'Pilot Success',   color: C.pilot.line    },
  { id:'product',   emoji:'⚙️',  label:'Product Update',  color: C.product.line  },
  { id:'topics',    emoji:'🔭', label:'Topics',           color: C.topics.line   },
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
      <div style={{ display:'flex', flexWrap:'wrap', overflowX:'auto',
        WebkitOverflowScrolling:'touch', gap:'6px 0' }}>
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
                padding:'4px 10px', userSelect:'none' }}> · </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
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
            Issue 10 · August 24{'\u2013'}28, 2026 · Produced by Hermes
          </div>
          <hr style={ruleThick} />

          {/* LEDE BAR */}
          <div style={{ background:C.ink, color:C.paper, padding:'clamp(12px,2vw,18px) 20px',
            textAlign:'center', fontFamily:SERIF, fontSize:'clamp(15px,2.5vw,18px)',
            fontStyle:'italic', lineHeight:1.5, marginBottom:'4px' }}>
            Demo video drops. Feature flags ship. York onboards Thursday.
            The Khanmigo study says embedded AI works {'\u2014'} exactly what Kinship is.
          </div>
          <hr style={rule} />

          {/* STATS BAR */}
          <div style={{ display:'flex', justifyContent:'center', gap:'clamp(20px,5vw,52px)',
            padding:'clamp(12px,2vw,20px) 0', textAlign:'center' }}>
            {[
              { n:'43', label:'channels swept' },
              { n:'215', label:'messages read' },
              { n:'8', label:'signals extracted' },
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
          <SectionLabel id="partners" emoji="🤝" title="Partners Update" color={C.partners.line} bg={C.partners.bg} />
          <div style={{ padding:'clamp(16px,2.5vw,24px) 0',
            display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap:'clamp(16px,2.5vw,24px)' }}>

            <StoryItem
              kicker="York Region · Onboarding"
              kickerColor={C.partners.line}
              headline={"York District Onboards Thursday \u2014 Three Teachers Live"}
              body={"York Region teachers are eager to log in to both Hearth and Horizon accounts this week ahead of their fall launch. The team confirmed a Zoom link, sent welcome emails, and set up the York training campus. A third staff member hit an invite issue that was resolved same-day. This is a direct go-live, not a discovery call."}
              soWhat={"York is in the hands-on phase. The product must hold up under real teacher exploration \u2014 any UX friction this week becomes a pilot signal."}
              link={"https://kinship-9xb4888.slack.com/archives/edu-york"}
            />

            <StoryItem
              kicker="UCC · MOU Urgency"
              kickerColor={C.partners.line}
              headline={"UCC Fall Math Pilot Needs an MOU This Week"}
              body={"A meeting with a Gr\u00a09/10 math teacher at UCC surfaced strong product fit: he\u2019s implementing Kinship in his classes. The team now needs an MOU for a fall math pilot signed within the week. Discussion on scope is advancing \u2014 8 math students, with potential expansion to science down the line. A proposal goes to the principal Sam, with Brendan, Julia, Mike, and Alan huddle next week."}
              soWhat={"The MOU clock is ticking. UCC has a teacher who believes in the product \u2014 now it\u2019s a contracts sprint. Partnerships team owns this week."}
            />

            <StoryItem
              kicker="Stanstead College · Pilot Scope"
              kickerColor={C.partners.line}
              headline={"Stanstead: Low-Stakes Test Case for Out-of-Flow AI"}
              body={"Stanstead is exploring a cohort of ~90 students in a non-core-instructional setting \u2014 flagged explicitly as \u201clow stakes and isolated.\u201d The team is aligned on calling it an interesting test, though caution was raised about dosage effects versus a full in-stream class. Stanstead\u2019s Head of Academics is interested in having Suzy speak to UCC about the pilot experience. Alan is triaging the ask."}
              soWhat={"This is a useful low-risk design experiment: can Kinship generate signal in out-of-stream settings? Results here will inform how Kinship pitches supplementary vs. embedded use cases."}
            />

            <StoryItem
              kicker="Mulgrave · Teacher Training Confirmed"
              kickerColor={C.partners.line}
              headline={"Mulgrave Teacher Training Next Week, Sept 30 Launch"}
              body={"Mulgrave is launching September 30 with teacher training happening next week. The team confirmed dates and email addresses this week. One concern raised: capacity for regular check-ins given Mulgrave\u2019s expansion to Grade 6 \u2014 the team is scoping support capacity before the launch. Pilot success offered help."}
              soWhat={"With a tight launch window, the team needs a realistic check-in cadence plan for Mulgrave before Sep 30."}
            />

            <StoryItem
              kicker="LCS · Live Demo Week"
              kickerColor={C.partners.line}
              headline={"LCS Gets Full Demo Week \u2014 Product Video Shared"}
              body={"The LCS team ran a full demo this week, sharing the new product video. Pre-LCS prep included a meeting at 1:30pm, though one team member was on a discovery call with Mount Vernon Ventures (a new lead). A separate note: MAP ELA licensing and benchmark testing logistics for LCS are being sorted \u2014 6 different testing groups, within a one-month window."}
              soWhat={"LCS is in active demo mode. Mount Vernon Ventures is a new inbound lead surfacing at the same time \u2014 worth tracking."}
            />

          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            🎯 PILOT SUCCESS UPDATE
        ════════════════════════════════════════════════════════════════ */}
        <div style={{ marginTop:'clamp(32px,5vw,52px)' }}>
          <SectionLabel id="pilot" emoji="🎯" title="Pilot Success Update" color={C.pilot.line} bg={C.pilot.bg} />
          <div style={{ padding:'clamp(16px,2.5vw,24px) 0',
            display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            gap:'clamp(16px,2.5vw,24px)' }}>

            <StoryItem
              kicker="Teacher Readiness · Training Video"
              kickerColor={C.pilot.line}
              headline={"Hearth Overview Video Recorded for Teacher Training"}
              body={"A member of the pilot success team recorded a Hearth overview video for teacher training. One piece of constructive feedback from the team: cleaner studio audio would strengthen it. A suggestion was made to recreate in Descript to smooth out the voice. The video is live and being shared with incoming schools."}
              soWhat={"As more schools onboard simultaneously, training assets become a multiplier. A small audio polish could meaningfully improve teacher first impressions."}
              link={"https://kinship-9xb4888.slack.com/archives/team-pilot-success"}
            />

            <StoryItem
              kicker="Pilot Readiness · Fall Stickers"
              kickerColor={C.pilot.line}
              headline={"Kinship Laptop Stickers: Fall Pilots Get Branded Kits"}
              body={"The team is coordinating Kinship-branded laptop stickers for all fall pilots. UCC label template is already done. The decision: all fall pilot schools will receive small Kinship-branded sticker packs. The thread generated by far the most engagement this week (32 replies) \u2014 clearly something the team cares about."}
              soWhat={"A small physical touchpoint with real team energy behind it. Stickers signal that schools are part of something, not just running software."}
            />

            <StoryItem
              kicker="Pilot Tracking · Student Numbers"
              kickerColor={C.pilot.line}
              headline={"Fall Student Numbers Verification Underway for 4 Schools"}
              body={"The team is verifying final fall student numbers for York, RSL, Lakefield, and Mulgrave. Training dates for UCC, Stanstead, and LCS are also being finalized. A Pilot Success View in Notion is being used to track this. New columns for on-site launch support and MAP testing were added to the view this week."}
              soWhat={"Coordinating 6+ simultaneous school launches is operationally heavy. The team needs centralized launch tracking \u2014 the Notion Pilot Success View is the right place."}
            />

            <StoryItem
              kicker="RHA · Scheduling & Curriculum Setup"
              kickerColor={C.pilot.line}
              headline={"RHA Scheduling Re-Enabled; Ontario vs. Common Core Confirmed"}
              body={"Scheduling was re-enabled for RHA on staging this week (KIN-148). The team confirmed curriculum standards for RHA: Ontario (metric) for math, Common Core otherwise. A separate question surfaced: is Claire explicitly aligned on Common Core for Math Academy? The team followed up to confirm. MAP and ELA testing licenses are also being sorted for an August 12 test."}
              soWhat={"RHA is one of the most operationally complex pilots given multi-platform requirements (MA, MobyMax, Lexia, Rosetta Stone). Every configuration decision matters for the September go-live."}
            />

            <StoryItem
              kicker="Incident Response · Process Formalized"
              kickerColor={C.pilot.line}
              headline={"Pilot Incident Escalation Process Formalized for Fall"}
              body={"The pilot success team drafted and shared a formal pilot incident escalation process this week. Reevo\u2019s approach to customer support inside Slack channels was cited as an example of good practice. The process is live in the channel for all fall pilot team members."}
              soWhat={"With 6+ schools going live in September, having a shared incident playbook is non-negotiable. Good timing."}
            />

          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            ⚙️ PRODUCT UPDATE
        ════════════════════════════════════════════════════════════════ */}
        <div style={{ marginTop:'clamp(32px,5vw,52px)' }}>
          <SectionLabel id="product" emoji="⚙️" title="Product Update" color={C.product.line} bg={C.product.bg} />
          <div style={{ padding:'clamp(12px,2vw,20px) 0 0' }}>
            <div style={{ fontFamily:SANS, fontSize:'11px', letterSpacing:'0.1em', textTransform:'uppercase',
              color:C.inkFaint, marginBottom:'16px' }}>What shipped this week</div>

            {/* NEW FEATURES */}
            <div style={{ marginBottom:'8px' }}>
              <div style={{ fontFamily:SANS, fontWeight:700, fontSize:'12px', letterSpacing:'0.1em',
                textTransform:'uppercase', color:C.product.line, marginBottom:'12px' }}>
                {'✨ New Features'}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                gap:'clamp(12px,2vw,20px)' }}>

                <div style={{ borderTop:`2px solid ${C.product.line}`, paddingTop:'14px' }}>
                  <div style={{ display:'flex', gap:'10px', marginBottom:'8px' }}>
                    <span style={{ fontSize:'18px', lineHeight:1, flexShrink:0 }}>🚩</span>
                    <div>
                      <Kicker color={C.product.line}>Hearth · Feature Flags</Kicker>
                      <div style={{ fontFamily:SERIF, fontSize:'16px', fontWeight:700, color:C.ink, lineHeight:1.3 }}>
                        Feature-Flag Assignment Dashboard
                      </div>
                    </div>
                  </div>
                  <div style={{ fontFamily:SANS, fontSize:'13px', color:C.inkMid, lineHeight:1.65 }}>
                    A new internal dashboard that is now the single place where feature flags are assigned to schools. Teachers and students see only the features their school has enabled {'\u2014'} the system manages the complexity behind the scenes. Every flag now has a human-readable description shown on the dashboard (KIN-406, KIN-437).
                  </div>
                </div>

                <div style={{ borderTop:`2px solid ${C.product.line}`, paddingTop:'14px' }}>
                  <div style={{ display:'flex', gap:'10px', marginBottom:'8px' }}>
                    <span style={{ fontSize:'18px', lineHeight:1, flexShrink:0 }}>✍️</span>
                    <div>
                      <Kicker color={C.product.line}>Hearth · Editor</Kicker>
                      <div style={{ fontFamily:SERIF, fontSize:'16px', fontWeight:700, color:C.ink, lineHeight:1.3 }}>
                        Live Markdown Styling in Editor Fields
                      </div>
                    </div>
                  </div>
                  <div style={{ fontFamily:SANS, fontSize:'13px', color:C.inkMid, lineHeight:1.65 }}>
                    Text fields in the app now render markdown formatting live as teachers type {'\u2014'} bold, italics, headers, lists. Media fields now commit on blur rather than requiring an explicit save. Makes lesson content creation significantly more fluid (#603).
                  </div>
                </div>

                <div style={{ borderTop:`2px solid ${C.product.line}`, paddingTop:'14px' }}>
                  <div style={{ display:'flex', gap:'10px', marginBottom:'8px' }}>
                    <span style={{ fontSize:'18px', lineHeight:1, flexShrink:0 }}>🏫</span>
                    <div>
                      <Kicker color={C.product.line}>Hearth · Internal</Kicker>
                      <div style={{ fontFamily:SERIF, fontSize:'16px', fontWeight:700, color:C.ink, lineHeight:1.3 }}>
                        All-Feature Academy: Internal Test Tenant
                      </div>
                    </div>
                  </div>
                  <div style={{ fontFamily:SANS, fontSize:'13px', color:C.inkMid, lineHeight:1.65 }}>
                    Kinship now has an internal test tenant that resolves every feature flag at once {'\u2014'} giving the team a way to demo and test any combination of features without needing a real school's configuration. Critical for demo prep and QA (KIN-331).
                  </div>
                </div>

              </div>
            </div>

            {/* FIXES */}
            <div style={{ marginTop:'clamp(20px,3vw,32px)' }}>
              <div style={{ fontFamily:SANS, fontWeight:700, fontSize:'12px', letterSpacing:'0.1em',
                textTransform:'uppercase', color:C.product.line, marginBottom:'12px' }}>
                {'🐛 Bug Fixes & Improvements'}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                gap:'clamp(12px,2vw,20px)' }}>

                {[
                  { emoji:'🔧', scope:'Hearth', title:'Skill Map Containment Fixed', body:'Skills and their sub-items no longer spill outside the Skill Map container on certain screen sizes. The visual stays clean and contained (#599).' },
                  { emoji:'🔄', scope:'Hearth', title:'Course Reorder Collisions Fixed', body:'Reordering courses now uses a park-then-renumber approach so two swaps can\u2019t collide with each other. Course lists are now reliably ordered after any drag-and-drop (#602).' },
                  { emoji:'👁️', scope:'Hearth', title:'Background Tab Inference Fixed', body:'When a teacher has Kinship open in a background tab, AI inference jobs now continue heartbeating instead of pausing entirely. No more \u201cstuck\u201d analysis jobs (#601).' },
                  { emoji:'📊', scope:'Horizon', title:'Demo-Prep Surface Fixes', body:'Multiple teacher and student surfaces were polished for demo readiness: course map navigation links carry preview declarations correctly, the preview frame fences its navigation, and mixed-practice candidates are capped per lane for cleaner pacing (#609).' },
                  { emoji:'🧪', scope:'Horizon', title:'Progress Dashboard Rendering', body:'A Horizon Progress dashboard section ("A look back at the ones that were tricky") was rendering oddly when Math Academy feedback contained visual or math symbols. Flagged by the pilot team this week and being investigated.' },
                ].map((item, i) => (
                  <div key={i} style={{ borderTop:`1px solid ${C.paperDark}`, paddingTop:'12px' }}>
                    <div style={{ display:'flex', gap:'8px', marginBottom:'6px' }}>
                      <span style={{ fontSize:'16px', lineHeight:1, flexShrink:0 }}>{item.emoji}</span>
                      <div>
                        <Kicker color={C.inkDim}>{item.scope}</Kicker>
                        <div style={{ fontFamily:SERIF, fontSize:'15px', fontWeight:700, color:C.ink, lineHeight:1.3 }}>
                          {item.title}
                        </div>
                      </div>
                    </div>
                    <div style={{ fontFamily:SANS, fontSize:'13px', color:C.inkMid, lineHeight:1.6 }}>
                      {item.body}
                    </div>
                  </div>
                ))}

              </div>
            </div>

            {/* Product demo video */}
            <div style={{ marginTop:'clamp(20px,3vw,32px)', background:C.accentFaint,
              border:`1px solid ${C.paperDark}`, padding:'16px 20px' }}>
              <Kicker color={C.accent}>Open Kinship · Announcement</Kicker>
              <div style={{ fontFamily:SERIF, fontSize:'16px', fontWeight:700, color:C.ink, marginBottom:'8px' }}>
                Product Demo Video: Latest Cut Posted This Week
              </div>
              <div style={{ fontFamily:SANS, fontSize:'13px', color:C.inkMid, lineHeight:1.65 }}>
                The latest cut of the Kinship product demo video was shared to #open-kinship this week to strong reactions. The team flagged the direction as exactly right. LCS received the video as part of their demo week. As training assets scale across pilots, video quality and reusability will matter more.
              </div>
            </div>

            {/* Signal from product-feedback */}
            <div style={{ marginTop:'clamp(16px,2vw,24px)', borderTop:`1px solid ${C.paperDark}`, paddingTop:'16px' }}>
              <Kicker color={C.product.line}>Product Feedback · Alert Settings</Kicker>
              <div style={{ fontFamily:SERIF, fontSize:'15px', fontWeight:700, color:C.ink, lineHeight:1.3, marginBottom:'6px' }}>
                Teachers Looking for Alert Settings That Moved
              </div>
              <div style={{ fontFamily:SANS, fontSize:'13px', color:C.inkMid, lineHeight:1.65 }}>
                A teacher asked this week where the alert/signal toggle settings moved to on the Activity page in Hearth {'\u2014'} a feature she specifically valued for demos. The response from the team suggests the feature may have been temporarily disabled. 14 replies and 2 reactions flagged this as high-signal feedback: teachers are noticing feature removals and they affect demo confidence.
              </div>
              <SoWhat text={"When a feature that teachers specifically use for demos gets quietly disabled, it erodes trust. Engineering and pilot success need a shared protocol for feature-flag rollback communication."} />
            </div>

          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            🔭 TOPICS WORTH WATCHING
        ════════════════════════════════════════════════════════════════ */}
        <div style={{ marginTop:'clamp(32px,5vw,52px)' }}>
          <SectionLabel id="topics" emoji="🔭" title="Topics Worth Watching" color={C.topics.line} bg={C.topics.bg} />
          <div style={{ padding:'clamp(16px,2.5vw,24px) 0' }}>

            {/* DEEP DIVE 1: Khanmigo */}
            <div style={{ borderTop:`2px solid ${C.topics.line}`, paddingTop:'14px', marginBottom:'clamp(24px,4vw,36px)' }}>
              <div style={{ fontFamily:SANS, fontWeight:700, fontSize:'10px', letterSpacing:'0.14em',
                textTransform:'uppercase', color:C.topics.line, marginBottom:'6px' }}>
                Deep Dive · Khanmigo Study
              </div>
              <h3 style={{ fontFamily:SERIF, fontSize:'clamp(22px,4vw,30px)', fontWeight:700,
                color:C.ink, lineHeight:1.2, margin:'0 0 12px' }}>
                Passive Opt-In AI Fails. Embedded AI Works.
              </h3>
              <div style={{ fontFamily:SANS, fontSize:'12px', color:C.inkFaint, marginBottom:'16px' }}>
                Chalkbeat · Brown University EdWorking Paper No. 26-1551 · Philip Oreopoulos, U of Toronto · Published Aug 25, 2026
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                gap:'clamp(16px,2.5vw,24px)' }}>

                <div>
                  <div style={{ fontFamily:SANS, fontWeight:700, fontSize:'11px', letterSpacing:'0.1em',
                    textTransform:'uppercase', color:C.inkDim, marginBottom:'8px' }}>What is it?</div>
                  <div style={{ fontFamily:SANS, fontSize:'13px', color:C.inkMid, lineHeight:1.65 }}>
                    A two-year randomized controlled trial across 18 middle schools in Tennessee. Khanmigo {'\u2014'} Khan Academy's AI tutoring chatbot {'\u2014'} was made available to nearly every student. It used Socratic reasoning, refused to give direct answers, and required students to opt in to use it.
                  </div>
                </div>

                <div>
                  <div style={{ fontFamily:SANS, fontWeight:700, fontSize:'11px', letterSpacing:'0.1em',
                    textTransform:'uppercase', color:C.inkDim, marginBottom:'8px' }}>What did they find?</div>
                  <div style={{ fontFamily:SANS, fontSize:'13px', color:C.inkMid, lineHeight:1.65 }}>
                    Students used Khanmigo on only <strong>~⅓ of days</strong> they were on Khan Academy. Many sent off-topic messages or tried to trick it into giving answers. The math gains Khan students made came from the <em>content platform</em>, not the AI. In a companion study where AI appeared <em>automatically</em> when students were stuck, students were more accurate and retained more a week later.
                  </div>
                </div>

              </div>

              {/* Pull quote */}
              <div style={{ margin:'clamp(16px,2.5vw,24px) 0', padding:'16px 20px',
                borderLeft:'none', borderTop:`3px solid ${C.topics.line}`,
                background:C.paperWarm }}>
                <div style={{ fontFamily:SERIF, fontSize:'clamp(16px,2.5vw,20px)', fontStyle:'italic',
                  color:C.ink, lineHeight:1.4, marginBottom:'8px' }}>
                  {'"The AI could not just sit next to the content. It had to be woven into it. We had to make productive struggle harder to sidestep."'}
                </div>
                <div style={{ fontFamily:SANS, fontSize:'11px', color:C.inkFaint, letterSpacing:'0.06em' }}>
                  {'\u2014'} Sal Khan, on Khan Academy's post-study redesign
                </div>
              </div>

              <div style={{ marginBottom:'16px' }}>
                <div style={{ fontFamily:SANS, fontWeight:700, fontSize:'11px', letterSpacing:'0.1em',
                  textTransform:'uppercase', color:C.inkDim, marginBottom:'8px' }}>What it means for Kinship</div>
                <div style={{ fontFamily:SANS, fontSize:'13px', color:C.inkMid, lineHeight:1.65 }}>
                  This is peer-reviewed validation of Kinship's core design philosophy. Passive AI {'\u2014'} "one click away" {'\u2014'} doesn't move the needle for unmotivated students. Embedded AI that intercepts students at moments of struggle, woven into the instructional flow, produced measurably better accuracy and retention. Kinship's approach of embedding adaptive intelligence into the student's natural learning path {'\u2014'} not as an optional chatbot sidebar {'\u2014'} is exactly what the data now supports. This study is citation-worthy in partnership conversations.
                </div>
              </div>

              <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
                <a href="https://www.chalkbeat.org/2026/08/25/ai-tutoring-students-khanmigo-khan-academy-engagement-study/" target="_blank" rel="noreferrer"
                  style={{ fontFamily:MONO, fontSize:'10px', color:C.topics.line, textDecoration:'none', opacity:0.8 }}>
                  {'↗ Chalkbeat article'}
                </a>
                <a href="https://kinship-9xb4888.slack.com/archives/topic-learning-science" target="_blank" rel="noreferrer"
                  style={{ fontFamily:MONO, fontSize:'10px', color:C.topics.line, textDecoration:'none', opacity:0.8 }}>
                  {'↗ #topic-learning-science'}
                </a>
              </div>
            </div>

            {/* DEEP DIVE 2: Tooling - Claude on-call + OpenSession */}
            <div style={{ borderTop:`2px solid ${C.topics.line}`, paddingTop:'14px', marginBottom:'clamp(24px,4vw,36px)' }}>
              <div style={{ fontFamily:SANS, fontWeight:700, fontSize:'10px', letterSpacing:'0.14em',
                textTransform:'uppercase', color:C.topics.line, marginBottom:'6px' }}>
                Deep Dive · Engineering Tooling
              </div>
              <h3 style={{ fontFamily:SERIF, fontSize:'clamp(20px,3.5vw,26px)', fontWeight:700,
                color:C.ink, lineHeight:1.2, margin:'0 0 16px' }}>
                The AI On-Call Rotation Is Already Here
              </h3>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
                gap:'clamp(16px,2.5vw,24px)', marginBottom:'16px' }}>

                <div>
                  <Kicker color={C.topics.line}>Anthropic · Claude CI/CD On-Call</Kicker>
                  <div style={{ fontFamily:SANS, fontSize:'13px', color:C.inkMid, lineHeight:1.65 }}>
                    Anthropic published their internal playbook: Claude now acts as first responder for CI/CD failures. It posts a root-cause hypothesis within 14 minutes median, runs parallel subagents against Grafana, PagerDuty, GitHub, and Kubernetes, proposes fix PRs, and writes post-mortems to a self-improving {'\u201clessons.md\u201d'} file. 80%+ of CI alert routing happens without waking a human. They open-sourced the setup kit. Spotted in #topic-tooling this week.
                  </div>
                  <div style={{ marginTop:'8px' }}>
                    <a href="https://claude.com/blog/ai-ci-cd-on-call" target="_blank" rel="noreferrer"
                      style={{ fontFamily:MONO, fontSize:'10px', color:C.topics.line, textDecoration:'none', opacity:0.8 }}>
                      {'↗ claude.com/blog/ai-ci-cd-on-call'}
                    </a>
                  </div>
                </div>

                <div>
                  <Kicker color={C.topics.line}>OpenSession · Team Agent Orchestration</Kicker>
                  <div style={{ fontFamily:SANS, fontSize:'13px', color:C.inkMid, lineHeight:1.65 }}>
                    Open Session is an open-source, self-hosted team control room for AI coding agents {'\u2014'} built by Tella, who now ship 80% of their code through it. Every agent session gets its own isolated Git worktree, supports multiplayer co-viewing, ends in a PR review, and runs automations. Spotted in #topic-tooling. Relevant if Kinship wants to scale agentic engineering workflows without vendor lock-in.
                  </div>
                  <div style={{ marginTop:'8px' }}>
                    <a href="https://www.opensession.com/" target="_blank" rel="noreferrer"
                      style={{ fontFamily:MONO, fontSize:'10px', color:C.topics.line, textDecoration:'none', opacity:0.8 }}>
                      {'↗ opensession.com'}
                    </a>
                  </div>
                </div>

              </div>
              <SoWhat text={"Both tools signal that AI-in-the-dev-loop is no longer experimental \u2014 it\u2019s becoming standard infrastructure. For Kinship\u2019s growing engineering team, now shipping 90+ commits a week, evaluating these patterns proactively keeps the team ahead of the tooling curve."} />
            </div>

            {/* AI in Education news roundup */}
            <div style={{ borderTop:`1px solid ${C.paperDark}`, paddingTop:'16px' }}>
              <div style={{ fontFamily:SANS, fontWeight:700, fontSize:'11px', letterSpacing:'0.1em',
                textTransform:'uppercase', color:C.inkDim, marginBottom:'12px' }}>
                Also This Week in EdTech
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                gap:'clamp(12px,2vw,20px)' }}>
                {[
                  { emoji:'📊', headline:'86% of Students, 85% of Teachers Used AI This Year', body:'A new Instructure/EdSource survey finds AI is now a standard part of the school routine. The debate has shifted from whether to how.' },
                  { emoji:'🧑‍🎓', headline:'Students Draft a National AI Policy Framework', body:'98 high schoolers from all 50 states produced \u201cThe STUDENTS FIRST Act\u201d \u2014 a student-authored AI policy framework emphasizing human relationships and students\u2019 right to refuse AI.' },
                  { emoji:'🇳🇴', headline:'Norway Bans AI for Elementary Students', body:'Norway blocked generative AI for grades 1\u20137 starting this month. One of the clearest national-level restrictions to date, framed as a child safety and cognitive development measure.' },
                  { emoji:'🇦🇪', headline:'UAE Mandates AI Training in All Schools', body:'UAE\u2019s 2026\u20132027 school year opens with AI training mandated across 1.277M students. Directionally opposite to Norway.' },
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
                textTransform:'uppercase', color:C.inkFaint, marginBottom:'4px' }}>Hottest thread</div>
              <div style={{ fontFamily:SERIF, fontSize:'13px', color:C.inkMid }}>
                <strong>Kinship laptop stickers</strong> in #team-pilot-success {'\u2014'} 32 replies
              </div>
            </div>

            <div>
              <div style={{ fontFamily:SANS, fontWeight:700, fontSize:'10px', letterSpacing:'0.1em',
                textTransform:'uppercase', color:C.inkFaint, marginBottom:'4px' }}>This issue</div>
              <div style={{ fontFamily:MONO, fontSize:'12px', color:C.inkMid }}>
                Aug 24{'\u2013'}28, 2026 {'\u00b7'} 43 channels swept {'\u00b7'} 215 messages {'\u00b7'} Issue #10
              </div>
            </div>

          </div>
          <hr style={rule} />
          <div style={{ textAlign:'center', padding:'16px 0',
            fontFamily:SANS, fontSize:'11px', color:C.inkFaint, lineHeight:1.6 }}>
            Produced by Hermes {'\u00b7'} Kinship Intelligence Brief {'\u00b7'} Internal use only<br />
            <span style={{ fontFamily:MONO, fontSize:'10px' }}>#open-kinship · kinship-9xb4888.slack.com</span>
          </div>
        </div>

      </div>
    </div>
  );
}
