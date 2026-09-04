'use client'
// Magazine Issue 12: The September Surge — weekly Kinship intelligence brief

import React, { useState, useEffect, useRef } from 'react'

const SANS = '"Inter", "Helvetica Neue", Arial, sans-serif'
const SERIF = '"Georgia", "Times New Roman", serif'
const MONO = '"IBM Plex Mono", "Courier New", monospace'

// Color system
const C = {
  paper: '#f7f3ed',
  paperDark: '#e8e1d7',
  ink: '#16120c',
  inkDim: '#3d3328',
  inkMid: '#6b5e50',
  inkFaint: '#a8998a',
  accent: '#b83a0c',  // burnt orange
  // Section colors (thin top border)
  partners: '#2d7e3a',   // green
  pilot: '#1e5a9c',      // blue
  product: '#c44a1f',    // burnt orange
  topics: '#8b5a1e',     // brown
}

type SectionId = 'partners' | 'pilot' | 'product' | 'topics'

interface Signal {
  title: string
  body: string
  team: string
  so_what: string
}

interface ProductCommit {
  sha: string
  subject: string
}

interface SectionLabel {
  id: SectionId
  emoji: string
  title: string
  color: string
}

const SECTIONS: SectionLabel[] = [
  { id: 'partners', emoji: '🤝', title: 'Partners Update', color: C.partners },
  { id: 'pilot', emoji: '🎯', title: 'Pilot Success', color: C.pilot },
  { id: 'product', emoji: '⚙️', title: 'Product Update', color: C.product },
  { id: 'topics', emoji: '🔭', title: 'Topics Worth Watching', color: C.topics },
]

// Mock data
const MAGAZINE_DATA = {
  issue: 12,
  theme: 'The September Surge',
  week: 'Aug 31 – Sep 4, 2026',
  channels_swept: 44,
  total_messages: 250,
  signals: 6,
  top_story: 'Parent Portal ships — 71 user-facing commits this week accelerate Horizon & Hearth.',
  
  signals: [
    {
      title: 'Parent Portal Shipped',
      body: 'The parent portal (#apps/parents) is live with weekly family email integration and unified parent dashboard.',
      team: 'Product',
      so_what: 'Parents now have a single entry point to student progress — reducing email friction and improving engagement tracking.',
    },
    {
      title: 'Horizon Demo Mode Cleansed',
      body: 'Removed all demo lanes, hero students, demo-data routes, and school switcher. Parent portal removed from Horizon proper.',
      team: 'Product',
      so_what: 'Cleaner Horizon. Teachers and students see only their own data — builds confidence in production systems.',
    },
    {
      title: 'Session Timer Feedback',
      body: '78-reply thread: teachers requesting default Hearth session timer change from 20 to 25 minutes.',
      team: 'Pilot Success',
      so_what: 'Students need longer focus sessions. Expect config flag or new default in next release.',
    },
    {
      title: 'NYC AI Limits (K-8)',
      body: 'NYC schools announced restrictions on student-facing AI in middle schools. Strong reactions in #topic-collective-intelligence.',
      team: 'Market',
      so_what: 'Validates embedded-in-flow AI strategy. Passive opt-in models (Khanmigo) failing; integrated AI wins.',
    },
    {
      title: 'Colegio Interamericano MoU',
      body: 'Latin America partnership live. Celebrated in #team-partnerships. September 2027 start target.',
      team: 'Partners',
      so_what: 'First confirmed Latin America pilot. Regional expansion pipeline advancing toward fall.',
    },
    {
      title: 'XP System Visibility',
      body: '18-reply thread: students report XP not visible in Hearth. Possible config/school-specific issue.',
      team: 'Product',
      so_what: 'Gamification visibility bug. Priority fix — affects student engagement and motivation.',
    },
  ],

  product_changes: {
    features: [
      'feat(parents): The Parent Portal — apps/parents, @kinship/family, weekly family email',
      'feat(horizon): Rebuild four student screens on one component set',
      'feat(horizon): Remove demo lane, hero students, school switcher',
      'feat(horizon): Remove family-notifications lane',
      'feat(horizon): Remove parent portal from Horizon',
      'feat(api): Send Horizon cron secret on internal hook calls',
    ],
    fixes: [
      'fix(api): Serve parent snapshot same-origin, uncached, at declared rate limit',
      'fix(hearth): Let WorkOS send password-reset email, not Hearth',
      'fix(horizon): Hide Activity affordance when school has no Activity page',
      'fix(horizon): Require cron secret on achievements hook',
      'fix(hearth): Remove participation card from class Summary tab',
      'fix(horizon): Show Math Academy mastery on lesson cards in demo mode',
    ],
  },

  hottest_thread: {
    channel: 'topic-product-feedback',
    topic: 'Session Timer Change Request',
    replies: 78,
    url: 'https://kinship-9xb4888.slack.com/archives/C0AOCJL4QPR/p1725396000',
  },
}

interface TOCItem {
  id: SectionId
  title: string
  emoji: string
}

const TOC_ITEMS: TOCItem[] = [
  { id: 'partners', title: 'Partners', emoji: '🤝' },
  { id: 'pilot', title: 'Pilots', emoji: '🎯' },
  { id: 'product', title: 'Product', emoji: '⚙️' },
  { id: 'topics', title: 'Topics', emoji: '🔭' },
]

// Table of Contents with intersection observer
function TableOfContents() {
  const [activeId, setActiveId] = useState<SectionId | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id as SectionId)
            break
          }
        }
      },
      { rootMargin: '-80px 0px -66% 0px' }
    )

    for (const item of TOC_ITEMS) {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <nav style={{
      display: 'flex',
      gap: 'clamp(12px, 3vw, 20px)',
      justifyContent: 'center',
      padding: 'clamp(16px, 3vw, 24px) 0',
      borderTop: `1px solid ${C.paperDark}`,
      borderBottom: `1px solid ${C.paperDark}`,
      fontSize: 'clamp(11px, 2.5vw, 13px)',
      fontFamily: MONO,
      flexWrap: 'wrap',
    }}>
      {TOC_ITEMS.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          style={{
            textDecoration: activeId === item.id ? 'underline' : 'none',
            color: activeId === item.id ? C.accent : C.inkMid,
            fontWeight: activeId === item.id ? 700 : 400,
            transition: 'color 0.2s',
          }}
        >
          {item.emoji} {item.title}
        </a>
      ))}
    </nav>
  )
}

// Section header component
interface SectionHeaderProps {
  id: SectionId
  emoji: string
  title: string
  color: string
}

function SectionHeader({ id, emoji, title, color }: SectionHeaderProps) {
  return (
    <div id={id} style={{ scrollMarginTop: '80px' }}>
      <div style={{
        borderTop: `3px solid ${color}`,
        paddingTop: 'clamp(8px, 2vw, 12px)',
        marginTop: 'clamp(24px, 5vw, 40px)',
        marginBottom: 'clamp(12px, 2.5vw, 18px)',
      }}>
        <h2 style={{
          fontFamily: SANS,
          fontSize: 'clamp(10px, 1.8vw, 12px)',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: color,
          margin: '0 0 6px 0',
        }}>
          {emoji} KICKER
        </h2>
        <h3 style={{
          fontFamily: SERIF,
          fontSize: 'clamp(22px, 5vw, 36px)',
          fontWeight: 400,
          margin: '0 0 12px 0',
          color: C.ink,
          lineHeight: 1.1,
        }}>
          {title}
        </h3>
      </div>
    </div>
  )
}

// Signal card
interface SignalCardProps {
  signal: Signal
}

function SignalCard({ signal }: SignalCardProps) {
  return (
    <div style={{
      borderTop: `1px solid ${C.paperDark}`,
      paddingTop: 'clamp(12px, 2.5vw, 18px)',
      paddingBottom: 'clamp(12px, 2.5vw, 18px)',
    }}>
      <h4 style={{
        fontFamily: SERIF,
        fontSize: 'clamp(16px, 3vw, 20px)',
        fontWeight: 600,
        margin: '0 0 8px 0',
        color: C.ink,
      }}>
        {signal.title}
      </h4>
      <p style={{
        fontFamily: SERIF,
        fontSize: 'clamp(13px, 2.2vw, 15px)',
        margin: '0 0 10px 0',
        color: C.inkDim,
        lineHeight: 1.5,
      }}>
        {signal.body}
      </p>
      <div style={{
        fontFamily: SANS,
        fontSize: 'clamp(11px, 1.8vw, 12px)',
        color: C.accent,
        fontWeight: 700,
        marginBottom: '6px',
      }}>
        So what?
      </div>
      <p style={{
        fontFamily: SANS,
        fontSize: 'clamp(11px, 2vw, 13px)',
        margin: '0',
        color: C.inkMid,
        lineHeight: 1.5,
        fontStyle: 'italic',
      }}>
        {signal.so_what}
      </p>
    </div>
  )
}

// Product change item
interface ProductItemProps {
  commit: string
}

function ProductItem({ commit }: ProductItemProps) {
  // Parse commit subject: "feat(scope): Title"
  const match = commit.match(/^(feat|fix)\(([^)]+)\):\s*(.+)/)
  const type = match?.[1] || 'feat'
  const scope = match?.[2] || ''
  const title = match?.[3] || commit

  return (
    <div style={{
      borderTop: `1px solid ${C.paperDark}`,
      paddingTop: 'clamp(12px, 2.5vw, 16px)',
      paddingBottom: 'clamp(12px, 2.5vw, 16px)',
    }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '6px' }}>
        <span style={{
          fontFamily: MONO,
          fontSize: 'clamp(10px, 1.5vw, 11px)',
          fontWeight: 700,
          color: C.accent,
          whiteSpace: 'nowrap',
        }}>
          {type === 'feat' ? '✨ NEW' : '🛠️ FIX'}
        </span>
        <span style={{
          fontFamily: MONO,
          fontSize: 'clamp(10px, 1.5vw, 11px)',
          color: C.inkFaint,
        }}>
          ({scope})
        </span>
      </div>
      <h5 style={{
        fontFamily: SERIF,
        fontSize: 'clamp(14px, 2.5vw, 17px)',
        fontWeight: 500,
        margin: '0 0 4px 0',
        color: C.ink,
      }}>
        {title}
      </h5>
    </div>
  )
}

// Main component
export default function MagazineIssue12() {
  return (
    <div style={{
      minHeight: '100dvh',
      backgroundColor: C.paper,
      color: C.ink,
      fontFamily: SERIF,
    }}>
      {/* Masthead */}
      <div style={{
        maxWidth: '960px',
        marginX: 'auto',
        padding: 'clamp(20px, 5vw, 40px)',
        textAlign: 'center',
        borderBottom: `2px double ${C.inkFaint}`,
        paddingBottom: 'clamp(20px, 4vw, 32px)',
      }}>
        <div style={{
          fontFamily: MONO,
          fontSize: 'clamp(10px, 1.5vw, 11px)',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: C.inkFaint,
          marginBottom: 'clamp(8px, 1.5vw, 12px)',
        }}>
          Issue {MAGAZINE_DATA.issue} · {MAGAZINE_DATA.week}
        </div>
        <h1 style={{
          fontFamily: SERIF,
          fontSize: 'clamp(34px, 7vw, 72px)',
          fontWeight: 400,
          margin: '0 0 clamp(8px, 2vw, 12px) 0',
          lineHeight: 1,
        }}>
          The Kinship <em style={{ fontStyle: 'italic' }}>{MAGAZINE_DATA.theme}</em>
        </h1>
        <div style={{
          fontFamily: MONO,
          fontSize: 'clamp(11px, 1.8vw, 13px)',
          color: C.inkMid,
        }}>
          A weekly intelligence brief from the Kinship team
        </div>
      </div>

      {/* Lede bar */}
      <div style={{
        backgroundColor: C.ink,
        color: C.paper,
        padding: 'clamp(16px, 3vw, 24px) clamp(16px, 5vw, 32px)',
        textAlign: 'center',
        marginBottom: 'clamp(20px, 4vw, 32px)',
      }}>
        <p style={{
          fontFamily: SERIF,
          fontSize: 'clamp(16px, 3.5vw, 24px)',
          margin: '0',
          lineHeight: 1.3,
          fontWeight: 500,
        }}>
          {MAGAZINE_DATA.top_story}
        </p>
      </div>

      {/* Stats bar */}
      <div style={{
        maxWidth: '960px',
        marginX: 'auto',
        padding: 'clamp(16px, 3vw, 24px) clamp(16px, 5vw, 32px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 'clamp(16px, 2vw, 20px)',
        marginBottom: 'clamp(24px, 4vw, 32px)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: SERIF,
            fontSize: 'clamp(22px, 4vw, 32px)',
            fontWeight: 700,
            color: C.accent,
          }}>
            {MAGAZINE_DATA.channels_swept}
          </div>
          <div style={{
            fontFamily: SANS,
            fontSize: 'clamp(10px, 1.8vw, 12px)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: C.inkMid,
          }}>
            Channels Swept
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: SERIF,
            fontSize: 'clamp(22px, 4vw, 32px)',
            fontWeight: 700,
            color: C.accent,
          }}>
            {MAGAZINE_DATA.total_messages}
          </div>
          <div style={{
            fontFamily: SANS,
            fontSize: 'clamp(10px, 1.8vw, 12px)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: C.inkMid,
          }}>
            Messages
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: SERIF,
            fontSize: 'clamp(22px, 4vw, 32px)',
            fontWeight: 700,
            color: C.accent,
          }}>
            {MAGAZINE_DATA.signals}
          </div>
          <div style={{
            fontFamily: SANS,
            fontSize: 'clamp(10px, 1.8vw, 12px)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: C.inkMid,
          }}>
            Signals
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div style={{ maxWidth: '960px', marginX: 'auto', paddingX: 'clamp(16px, 5vw, 32px)' }}>
        <TableOfContents />
      </div>

      {/* Content container */}
      <div style={{
        maxWidth: '960px',
        marginX: 'auto',
        paddingX: 'clamp(16px, 5vw, 32px)',
      }}>
        {/* Partners Section */}
        <SectionHeader
          id="partners"
          emoji="🤝"
          title="Partners Update"
          color={C.partners}
        />
        <div>
          <SignalCard signal={MAGAZINE_DATA.signals[4]} />
        </div>

        {/* Pilot Success Section */}
        <SectionHeader
          id="pilot"
          emoji="🎯"
          title="Pilot Success"
          color={C.pilot}
        />
        <div>
          <SignalCard signal={MAGAZINE_DATA.signals[2]} />
        </div>

        {/* Product Section */}
        <SectionHeader
          id="product"
          emoji="⚙️"
          title="Product Update"
          color={C.product}
        />
        <div style={{
          marginBottom: 'clamp(20px, 3vw, 28px)',
        }}>
          <div style={{
            fontFamily: SANS,
            fontSize: 'clamp(12px, 2vw, 14px)',
            fontWeight: 700,
            color: C.accent,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 'clamp(12px, 2vw, 16px)',
          }}>
            ✨ What Shipped
          </div>
          {MAGAZINE_DATA.product_changes.features.map((commit, i) => (
            <ProductItem key={i} commit={commit} />
          ))}
        </div>
        <div style={{
          marginTop: 'clamp(20px, 3vw, 28px)',
        }}>
          <div style={{
            fontFamily: SANS,
            fontSize: 'clamp(12px, 2vw, 14px)',
            fontWeight: 700,
            color: C.accent,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            marginBottom: 'clamp(12px, 2vw, 16px)',
          }}>
            🐛 Bug Fixes
          </div>
          {MAGAZINE_DATA.product_changes.fixes.map((commit, i) => (
            <ProductItem key={i} commit={commit} />
          ))}
        </div>

        {/* Topics Section */}
        <SectionHeader
          id="topics"
          emoji="🔭"
          title="Topics Worth Watching"
          color={C.topics}
        />
        <div>
          <SignalCard signal={MAGAZINE_DATA.signals[3]} />
          <SignalCard signal={MAGAZINE_DATA.signals[1]} />
          <SignalCard signal={MAGAZINE_DATA.signals[5]} />
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 'clamp(32px, 6vw, 48px)',
          paddingTop: 'clamp(20px, 3vw, 28px)',
          borderTop: `1px solid ${C.paperDark}`,
          fontFamily: MONO,
          fontSize: 'clamp(10px, 1.8vw, 12px)',
          color: C.inkFaint,
          lineHeight: 1.6,
        }}>
          <div style={{ marginBottom: '12px', fontWeight: 700 }}>
            Hottest thread
          </div>
          <p style={{ margin: '0 0 12px 0' }}>
            <strong>{MAGAZINE_DATA.hottest_thread.topic}</strong> in{' '}
            <span style={{ color: C.inkMid }}>#{MAGAZINE_DATA.hottest_thread.channel}</span>
            <br />
            {MAGAZINE_DATA.hottest_thread.replies} replies{' '}
            <a
              href={MAGAZINE_DATA.hottest_thread.url}
              target="_blank"
              rel="noreferrer"
              style={{ color: C.accent, textDecoration: 'none' }}
            >
              ↗ thread
            </a>
          </p>

          <div style={{
            marginTop: 'clamp(16px, 2vw, 20px)',
            paddingTop: 'clamp(12px, 2vw, 16px)',
            borderTop: `1px solid ${C.paperDark}`,
          }}>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Week of {MAGAZINE_DATA.week}</strong>
              <br />
              {MAGAZINE_DATA.channels_swept} channels · {MAGAZINE_DATA.total_messages} messages ·{' '}
              {MAGAZINE_DATA.signals} signals
            </p>
          </div>
        </div>

        {/* Bottom padding */}
        <div style={{ paddingBottom: 'clamp(32px, 5vw, 48px)' }} />
      </div>
    </div>
  )
}
