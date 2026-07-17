'use client';
// Required: interactive tab state, scroll effects, and dynamic rendering

import React, { useState, useEffect, type ReactNode } from 'react';
import {
  ISSUE,
  SIGNALS,
  SPOTLIGHT,
  HOT_THREADS,
  KNOWLEDGE_HIGHLIGHT,
  OPEN_QUESTIONS,
  QUIET_CHANNELS,
  COMMUNITY_CORNER,
  NEW_CHANNEL,
} from '@/mock/magazine-issue-3';

// ─── Color Palette (Issue #3: "The Launch Pad") ──────────────────────────────
const C = {
  bg:         '#0D0D12',          // deep near-black
  paper:      '#13131A',          // card background
  lift:       '#1A1A26',          // elevated card
  border:     '#2A2A3E',          // subtle border
  accent:     '#F97316',          // launch orange
  accentDim:  '#7C3215',          // dark orange for borders
  gold:       '#F59E0B',          // amber highlight
  text:       '#F0EDE8',          // warm white
  muted:      '#8C8A9E',          // secondary text
  product:    '#3B82F6',          // blue
  partnership:'#A855F7',          // purple
  support:    '#F59E0B',          // amber
  learningsci:'#10B981',          // emerald
  strategic:  '#EF4444',          // red
  spotlight:  '#0EA5E9',          // sky blue
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Pill({ color, children }: { color: string; children: ReactNode }) {
  return (
    <span style={{
      display: 'inline-block',
      background: color + '22',
      color,
      border: `1px solid ${color}55`,
      borderRadius: 4,
      fontSize: 'clamp(10px, 1.2vw, 12px)',
      fontFamily: 'monospace',
      fontWeight: 700,
      letterSpacing: '0.04em',
      padding: '2px 8px',
    }}>
      {children}
    </span>
  );
}

function SoWhat({ children }: { children: ReactNode }) {
  return (
    <div style={{
      background: C.accent + '0F',
      borderLeft: `3px solid ${C.accent}`,
      padding: '10px 14px',
      marginTop: 10,
      borderRadius: '0 6px 6px 0',
    }}>
      <span style={{ color: C.accent, fontWeight: 700, fontSize: 'clamp(10px, 1.2vw, 12px)', fontFamily: 'monospace', letterSpacing: '0.08em' }}>
        SO WHAT?{'  '}
      </span>
      <span style={{ color: C.text, fontSize: 'clamp(12px, 1.5vw, 14px)', lineHeight: 1.6, fontFamily: "'Georgia', 'Times New Roman', serif" }}>
        {children}
      </span>
    </div>
  );
}

function ChannelTag({ name }: { name: string }) {
  return (
    <span style={{
      background: C.border,
      color: C.muted,
      fontSize: 11,
      padding: '2px 7px',
      borderRadius: 4,
      fontFamily: 'monospace',
      marginLeft: 4,
    }}>
      {name}
    </span>
  );
}

function SectionHeader({ label, accent = C.accent }: { label: string; accent?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
      <div style={{ width: 4, height: 28, background: accent, borderRadius: 2, flexShrink: 0 }} />
      <h2 style={{
        margin: 0,
        fontFamily: "'Georgia', 'Times New Roman', serif",
        fontSize: 'clamp(18px, 2.5vw, 26px)',
        fontWeight: 700,
        color: C.text,
        letterSpacing: '-0.02em',
      }}>
        {label}
      </h2>
    </div>
  );
}

function Card({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: C.paper,
      border: `1px solid ${C.border}`,
      borderRadius: 10,
      padding: 20,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Category color map ───────────────────────────────────────────────────────
const CAT_COLOR: Record<string, string> = {
  'Product': C.product,
  'Partnership': C.partnership,
  'Support': C.support,
  'Learning Science': C.learningsci,
  'Strategic': C.strategic,
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function KinshipMagazineIssue3() {
  const [activeTab, setActiveTab] = useState<'signals' | 'threads' | 'questions'>('signals');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{
      minHeight: '100dvh',
      background: C.bg,
      color: C.text,
      fontFamily: "'Georgia', 'Times New Roman', serif",
    }}>
      {/* ── Sticky nav ── */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: scrolled ? C.paper : 'transparent',
        borderBottom: scrolled ? `1px solid ${C.border}` : 'none',
        transition: 'all 0.3s',
        padding: 'clamp(10px, 2vw, 16px) clamp(16px, 5vw, 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28,
            background: C.accent,
            borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 900, color: '#fff',
            fontFamily: 'system-ui, sans-serif',
          }}>K</div>
          <span style={{ fontSize: 'clamp(11px, 1.3vw, 13px)', color: C.muted, fontFamily: 'monospace', letterSpacing: '0.1em' }}>
            THE KINSHIP LAUNCH PAD · ISSUE #3
          </span>
        </div>
        <span style={{ fontSize: 'clamp(10px, 1.2vw, 12px)', color: C.muted, fontFamily: 'monospace' }}>
          {ISSUE.weekStart}–{ISSUE.weekEnd}
        </span>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(24px, 5vw, 48px) clamp(16px, 5vw, 40px)' }}>

        {/* ── COVER ── */}
        <section style={{ marginBottom: 64 }}>
          <div style={{
            background: `linear-gradient(135deg, #0D0D12 0%, #1A0F07 60%, #2D1400 100%)`,
            border: `1px solid ${C.accentDim}`,
            borderRadius: 16,
            padding: 'clamp(32px, 5vw, 60px)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* decorative rocket trail */}
            <div style={{
              position: 'absolute', top: -20, right: -20,
              width: 240, height: 240,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${C.accent}22 0%, transparent 70%)`,
              pointerEvents: 'none',
            }} />

            <div style={{
              fontSize: 'clamp(10px, 1.2vw, 12px)',
              fontFamily: 'monospace',
              color: C.accent,
              letterSpacing: '0.2em',
              marginBottom: 16,
            }}>
              THE KINSHIP INTELLIGENCE BRIEF
            </div>

            <h1 style={{
              margin: '0 0 8px',
              fontSize: 'clamp(36px, 7vw, 80px)',
              fontWeight: 900,
              color: C.text,
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
            }}>
              The Launch<br />
              <span style={{ color: C.accent }}>Pad</span>
            </h1>

            <div style={{ fontSize: 'clamp(11px, 1.4vw, 14px)', color: C.muted, fontFamily: 'monospace', marginTop: 8, marginBottom: 28 }}>
              Issue #3 · {ISSUE.weekStart}–{ISSUE.weekEnd}
            </div>

            <p style={{
              fontSize: 'clamp(16px, 2vw, 22px)',
              color: C.gold,
              fontStyle: 'italic',
              maxWidth: 560,
              margin: '0 0 32px',
              lineHeight: 1.5,
            }}>
              "{ISSUE.tagline}"
            </p>

            {/* Stats row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: 16,
              maxWidth: 600,
            }}>
              {[
                { label: 'Messages', value: ISSUE.totalMessages, sub: `+${ISSUE.totalMessages - ISSUE.lastWeekMessages} vs last week` },
                { label: 'Reactions', value: ISSUE.totalReactions },
                { label: 'Channels', value: ISSUE.channelsSwept },
                { label: 'Signals', value: ISSUE.signalsExtracted },
              ].map(stat => (
                <div key={stat.label} style={{
                  background: '#ffffff0A',
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: '12px 14px',
                }}>
                  <div style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 900, color: C.accent, lineHeight: 1 }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, fontFamily: 'monospace', marginTop: 3 }}>{stat.label}</div>
                  {stat.sub && <div style={{ fontSize: 10, color: C.accent + 'AA', fontFamily: 'monospace', marginTop: 2 }}>{stat.sub}</div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NEW CHANNEL ALERT ── */}
        <section style={{ marginBottom: 40 }}>
          <div style={{
            background: C.learningsci + '0F',
            border: `1px solid ${C.learningsci}33`,
            borderRadius: 8,
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
          }}>
            <span style={{ fontSize: 16 }}>🆕</span>
            <span style={{ fontFamily: 'monospace', color: C.learningsci, fontSize: 12, fontWeight: 700 }}>#topic-competitive-intel</span>
            <span style={{ fontSize: 'clamp(12px, 1.4vw, 14px)', color: C.muted }}>
              — {NEW_CHANNEL.announcement}
            </span>
          </div>
        </section>

        {/* ── SIGNAL SWEEP (with tabs) ── */}
        <section style={{ marginBottom: 64 }}>
          <SectionHeader label="Signal Sweep" accent={C.accent} />
          <p style={{ color: C.muted, fontSize: 'clamp(13px, 1.5vw, 15px)', marginBottom: 24, lineHeight: 1.6, maxWidth: 680 }}>
            {ISSUE.signalsExtracted} intelligence signals extracted from {ISSUE.totalMessages} messages across {ISSUE.channelsSwept} channels. These are the things that should drive decisions next week.
          </p>

          {/* Tab bar */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
            {(['signals', 'threads', 'questions'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: activeTab === tab ? C.accent : C.paper,
                  color: activeTab === tab ? '#fff' : C.muted,
                  border: `1px solid ${activeTab === tab ? C.accent : C.border}`,
                  borderRadius: 6,
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: 'clamp(11px, 1.3vw, 13px)',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  transition: 'all 0.15s',
                }}
              >
                {tab === 'signals' ? `📡 Signals (${SIGNALS.length})` :
                 tab === 'threads' ? `🔥 Hot Threads (${HOT_THREADS.length})` :
                 `❓ Open Questions (${OPEN_QUESTIONS.length})`}
              </button>
            ))}
          </div>

          {/* Signals tab */}
          {activeTab === 'signals' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {SIGNALS.map((sig, i) => (
                <Card key={i} style={{ borderLeft: `4px solid ${CAT_COLOR[sig.category] || C.accent}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                    <Pill color={CAT_COLOR[sig.category] || C.accent}>{sig.badge}</Pill>
                    <ChannelTag name={sig.channels} />
                    <span style={{ marginLeft: 'auto', fontSize: 11, fontFamily: 'monospace', color: C.muted }}>{sig.strength}</span>
                  </div>
                  <p style={{ margin: '0 0 0', fontSize: 'clamp(13px, 1.6vw, 16px)', color: C.text, lineHeight: 1.65 }}>
                    {sig.observation}
                  </p>
                  <SoWhat>{sig.soWhat}</SoWhat>
                  <div style={{ marginTop: 10 }}>
                    <a href={sig.link} target="_blank" rel="noreferrer"
                      style={{ fontSize: 11, color: C.accent, fontFamily: 'monospace', textDecoration: 'none' }}>
                      Open in Slack →
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Hot Threads tab */}
          {activeTab === 'threads' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 16,
            }}>
              {HOT_THREADS.map((t, i) => (
                <Card key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <Pill color={CAT_COLOR[t.category] || C.accent}>{t.category}</Pill>
                    <span style={{
                      fontSize: 'clamp(20px, 3vw, 28px)',
                      fontWeight: 900,
                      color: C.accent,
                      lineHeight: 1,
                    }}>{t.replies}</span>
                  </div>
                  <ChannelTag name={t.channel} />
                  <p style={{ fontSize: 'clamp(13px, 1.5vw, 15px)', color: C.text, lineHeight: 1.6, margin: '10px 0 12px' }}>
                    {t.topic}
                  </p>
                  <a href={t.link} target="_blank" rel="noreferrer"
                    style={{ fontSize: 11, color: C.accent, fontFamily: 'monospace', textDecoration: 'none' }}>
                    Open in Slack →
                  </a>
                </Card>
              ))}
            </div>
          )}

          {/* Open Questions tab */}
          {activeTab === 'questions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {OPEN_QUESTIONS.map((q, i) => (
                <Card key={i} style={{ borderLeft: `4px solid ${C.gold}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 'clamp(12px, 1.4vw, 14px)', fontWeight: 700, color: C.gold }}>{q.urgency}</span>
                    <ChannelTag name={q.channel} />
                  </div>
                  <p style={{ fontSize: 'clamp(14px, 1.7vw, 17px)', color: C.text, margin: '0 0 8px', lineHeight: 1.5, fontStyle: 'italic' }}>
                    "{q.question}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, color: C.muted, fontFamily: 'monospace' }}>Owner: <span style={{ color: C.text }}>{q.owner}</span></span>
                    <a href={q.link} target="_blank" rel="noreferrer"
                      style={{ fontSize: 11, color: C.accent, fontFamily: 'monospace', textDecoration: 'none' }}>
                      Thread →
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* ── TWO-COLUMN: Spotlight + Knowledge Highlight ── */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24,
          marginBottom: 64,
        }}>
          {/* Channel Spotlight */}
          <div>
            <SectionHeader label="Channel Spotlight" accent={C.spotlight} />
            <Card style={{ borderTop: `3px solid ${C.spotlight}`, height: '100%', boxSizing: 'border-box' }}>
              <div style={{ fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: 900, color: C.spotlight, fontFamily: 'monospace', marginBottom: 4 }}>
                {SPOTLIGHT.channel}
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 14, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: C.muted, fontFamily: 'monospace' }}>
                  {SPOTLIGHT.messageCount} msgs · {SPOTLIGHT.reactions} reactions · {SPOTLIGHT.uniqueUsers} contributors
                </span>
              </div>
              <p style={{ color: C.text, fontSize: 'clamp(13px, 1.5vw, 15px)', lineHeight: 1.65, margin: '0 0 16px' }}>
                {SPOTLIGHT.summary}
              </p>
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                <div style={{ fontSize: 11, color: C.muted, fontFamily: 'monospace', marginBottom: 4 }}>MOST REPLIED THREAD</div>
                <p style={{ margin: '0 0 6px', fontSize: 'clamp(13px, 1.5vw, 14px)', color: C.text }}>
                  {SPOTLIGHT.topThread.topic}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 900, color: C.accent }}>{SPOTLIGHT.topThread.replies}</span>
                  <span style={{ fontSize: 12, color: C.muted, fontFamily: 'monospace' }}>replies</span>
                  <a href={SPOTLIGHT.topThread.link} target="_blank" rel="noreferrer"
                    style={{ fontSize: 11, color: C.accent, fontFamily: 'monospace', textDecoration: 'none', marginLeft: 'auto' }}>
                    Open in Slack →
                  </a>
                </div>
              </div>
            </Card>
          </div>

          {/* Knowledge Highlight */}
          <div>
            <SectionHeader label="Knowledge Highlight" accent={C.learningsci} />
            <Card style={{ borderTop: `3px solid ${C.learningsci}`, height: '100%', boxSizing: 'border-box' }}>
              <Pill color={C.learningsci}>📚 Learning Science × Strategic</Pill>
              <div style={{ marginTop: 12, marginBottom: 12 }}>
                <ChannelTag name={KNOWLEDGE_HIGHLIGHT.channel} />
              </div>
              <p style={{ color: C.text, fontSize: 'clamp(13px, 1.5vw, 15px)', lineHeight: 1.65, margin: '0 0 20px' }}>
                {KNOWLEDGE_HIGHLIGHT.summary}
              </p>
              {/* Pull quote */}
              <blockquote style={{
                borderLeft: `4px solid ${C.learningsci}`,
                paddingLeft: 16,
                margin: '0 0 16px',
                fontStyle: 'italic',
                fontSize: 'clamp(14px, 1.7vw, 17px)',
                color: C.gold,
                lineHeight: 1.6,
              }}>
                "{KNOWLEDGE_HIGHLIGHT.pullQuote}"
              </blockquote>
              <a href={KNOWLEDGE_HIGHLIGHT.link} target="_blank" rel="noreferrer"
                style={{ fontSize: 11, color: C.accent, fontFamily: 'monospace', textDecoration: 'none' }}>
                Read the full thread in Slack →
              </a>
            </Card>
          </div>
        </section>

        {/* ── PARTNERSHIP WATCH ── */}
        <section style={{ marginBottom: 64 }}>
          <SectionHeader label="Partnership &amp; Pilot Watch" accent={C.partnership} />
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 16,
          }}>
            {[
              {
                school: 'Elite K12 — Shanghai',
                status: '🟠 Strategy Call',
                note: 'Flagged as a "potentially very exciting large chain partnership." Leadership convened a same-day strategy meeting before reaching out.',
                link: 'https://kinship-9xb4888.slack.com/archives/C0B6Z4MFA3X/p1784118990691579',
              },
              {
                school: 'Stanstead College — Quebec',
                status: '🟡 Discovery Done',
                note: 'Initial meeting with Head of School complete. Director of Academics joining next session. Head speaking "kinship language" on AI and precision learning.',
                link: 'https://kinship-9xb4888.slack.com/archives/C0B6Z4MFA3X/p1784061736947139',
              },
              {
                school: 'NJ Public District',
                status: '🟡 Interest Confirmed',
                note: 'September math pilot timeframe targeted. Curriki verbally committed $10k in grant funding — first public district with grant backing.',
                link: 'https://kinship-9xb4888.slack.com/archives/C0B6Z4MFA3X/p1784119265943279',
              },
              {
                school: 'Grupo Salta / Greenwood',
                status: '🟢 Relationship Advancing',
                note: 'Exec chairman\'s lieutenant confirmed internal positive Kinship signals from leadership. Call went well — math + literacy/ESL curriculum interest.',
                link: 'https://kinship-9xb4888.slack.com/archives/C0BH47VPSKZ/p1784163793752849',
              },
              {
                school: 'Netivot',
                status: '🟡 Post-Demo',
                note: 'Demo completed this week. Pricing question came up — unclear if answered. Becky connected with RHA contact Claire for peer reference.',
                link: 'https://kinship-9xb4888.slack.com/archives/C0BFGBV2CPL/p1784227917682459',
              },
              {
                school: 'Greater Dayton',
                status: '🟢 Onboarding Started',
                note: 'First official onboarding call completed with school head. Pilot launches 9/8. Claude used to populate the Dayton Launch Checklist from call notes.',
                link: 'https://kinship-9xb4888.slack.com/archives/C0BHZECFG05/p1784299199030389',
              },
            ].map((p, i) => (
              <Card key={i} style={{ borderTop: `2px solid ${C.partnership}` }}>
                <div style={{ fontWeight: 700, color: C.text, fontSize: 'clamp(13px, 1.5vw, 15px)', marginBottom: 6 }}>
                  {p.school}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontFamily: 'monospace', color: C.muted }}>{p.status}</span>
                </div>
                <p style={{ margin: '0 0 10px', fontSize: 'clamp(12px, 1.3vw, 13px)', color: C.muted, lineHeight: 1.55 }}>
                  {p.note}
                </p>
                <a href={p.link} target="_blank" rel="noreferrer"
                  style={{ fontSize: 11, color: C.accent, fontFamily: 'monospace', textDecoration: 'none' }}>
                  Thread →
                </a>
              </Card>
            ))}
          </div>
        </section>

        {/* ── QUIET CHANNELS ── */}
        <section style={{ marginBottom: 64 }}>
          <SectionHeader label="Quiet This Week" accent={C.muted} />
          <Card>
            <p style={{ fontSize: 'clamp(12px, 1.4vw, 14px)', color: C.muted, marginTop: 0, marginBottom: 14, lineHeight: 1.6 }}>
              {QUIET_CHANNELS.length} channels had zero messages this week. Worth noting: #topic-product-feedback is quiet while product issues are surfacing in edu channels and open-kinship. That might be a routing problem.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {QUIET_CHANNELS.map(ch => (
                <span key={ch} style={{
                  background: C.paper,
                  border: `1px solid ${C.border}`,
                  color: C.muted,
                  fontSize: 11,
                  padding: '3px 8px',
                  borderRadius: 4,
                  fontFamily: 'monospace',
                }}>
                  #{ch}
                </span>
              ))}
            </div>
          </Card>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{
          borderTop: `1px solid ${C.border}`,
          paddingTop: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}>
          <div style={{ fontSize: 11, fontFamily: 'monospace', color: C.muted }}>
            <span style={{ color: C.accent }}>◈</span>{' '}
            Most active thread this week: Google Meet transcript system in {COMMUNITY_CORNER.channel} — {COMMUNITY_CORNER.replies} replies{' '}
            <a href={COMMUNITY_CORNER.link} target="_blank" rel="noreferrer"
              style={{ color: C.accent, textDecoration: 'none' }}>→</a>
          </div>
          <div style={{ fontSize: 11, fontFamily: 'monospace', color: C.muted }}>
            <span style={{ color: C.accent }}>◈</span>{' '}
            Generated by Hermes · The Kinship Launch Pad · Issue #3 · {ISSUE.weekStart}–{ISSUE.weekEnd}
          </div>
          <div style={{ fontSize: 11, fontFamily: 'monospace', color: C.muted }}>
            <span style={{ color: C.accent }}>◈</span>{' '}
            33 channels swept · 143 messages · 121 reactions · 8 signals extracted
          </div>
        </footer>

      </div>
    </div>
  );
}
