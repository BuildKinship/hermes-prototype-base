"use client";
// Required: magazine page uses useState for hover effects and interactive thread links

import React, { type ReactNode, useState } from "react";
import {
  ISSUE,
  HIGHLIGHTS,
  SPOTLIGHT,
  HOT_THREADS,
  QUIET_CHANNELS,
  COMPETITIVE_INTELLIGENCE,
  ACTIVE_CONTRIBUTORS,
} from "@/mock/magazine-issue-2";

// ─── Color Palette: Issue #2 — Midnight Blue / Deep Cut ─────────────────────
// A week of depth deserves deep blues. Ink-dark masthead, lapis accent, warm cream body.
const COLORS = {
  ink: "#0D1117",          // deep midnight — masthead, footers
  paper: "#F7F4EF",        // warm cream — body background
  lapis: "#1A56DB",        // lapis blue — primary accent
  gold: "#D4A843",         // aged gold — pull quotes
  steel: "#0F2040",        // deep navy — section blocks
  mist: "#EAE7E1",         // subtle bg — cards
  smoke: "#6B7280",        // secondary text
  wire: "#2A3547",         // dividers on dark
  paperWire: "#D5CFC6",    // dividers on cream
  teal: "#0EA5A0",         // competitive intel accent
  red: "#DC2626",          // quiet channel accent
};

// ─── Root font & layout ──────────────────────────────────────────────────────
const ROOT: React.CSSProperties = {
  fontFamily: "'Georgia', 'Times New Roman', serif",
  background: COLORS.paper,
  color: COLORS.ink,
  minHeight: "100dvh",
  lineHeight: 1.6,
};

// ─── Section wrapper ─────────────────────────────────────────────────────────
function Section({
  children,
  dark = false,
  style = {},
}: {
  children: ReactNode;
  dark?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <section
      style={{
        background: dark ? COLORS.steel : COLORS.paper,
        color: dark ? COLORS.paper : COLORS.ink,
        padding: "clamp(32px, 5vw, 80px) clamp(16px, 5vw, 80px)",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

// ─── Label ───────────────────────────────────────────────────────────────────
function Label({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <div
      style={{
        fontSize: "10px",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        fontFamily: "system-ui, sans-serif",
        color: light ? COLORS.lapis : COLORS.lapis,
        marginBottom: "12px",
        fontWeight: 700,
      }}
    >
      {children}
    </div>
  );
}

// ─── Channel pill ────────────────────────────────────────────────────────────
function ChannelPill({ name, dark = false }: { name: string; dark?: boolean }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: "11px",
        fontFamily: "system-ui, sans-serif",
        padding: "2px 8px",
        borderRadius: "3px",
        border: `1px solid ${dark ? COLORS.wire : COLORS.paperWire}`,
        color: dark ? COLORS.smoke : COLORS.smoke,
        letterSpacing: "0.05em",
      }}
    >
      #{name}
    </span>
  );
}

// ─── MASTHEAD ────────────────────────────────────────────────────────────────
function Masthead() {
  return (
    <header style={{ background: COLORS.ink, color: COLORS.paper }}>
      {/* Top rule — lapis accent */}
      <div style={{ background: COLORS.lapis, height: "4px", width: "100%" }} />

      {/* Dateline bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
          borderBottom: `1px solid ${COLORS.wire}`,
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            letterSpacing: "0.15em",
            color: COLORS.smoke,
            textTransform: "uppercase",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {ISSUE.weekRange}
        </span>
        <span
          style={{
            fontSize: "11px",
            letterSpacing: "0.15em",
            color: COLORS.smoke,
            textTransform: "uppercase",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Issue No. {ISSUE.number}
        </span>
      </div>

      {/* Giant masthead title */}
      <div style={{ textAlign: "center", padding: "56px 24px 40px" }}>
        <div
          style={{
            fontSize: "clamp(60px, 12vw, 140px)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 0.85,
            color: COLORS.paper,
          }}
        >
          THE{" "}
          <span style={{ color: COLORS.lapis }}>DEEP</span>{" "}
          CUT
        </div>
        <div
          style={{
            marginTop: "20px",
            fontSize: "clamp(11px, 1.8vw, 14px)",
            letterSpacing: "0.25em",
            color: COLORS.smoke,
            textTransform: "uppercase",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          The Kinship Weekly — Issue #2
        </div>
        <div
          style={{
            marginTop: "12px",
            fontSize: "clamp(15px, 2vw, 20px)",
            color: COLORS.paper,
            opacity: 0.65,
            fontStyle: "italic",
            maxWidth: "600px",
            margin: "12px auto 0",
          }}
        >
          {ISSUE.tagline}
        </div>
      </div>

      {/* Stats bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "clamp(20px, 4vw, 60px)",
          padding: "20px 24px",
          borderTop: `1px solid ${COLORS.wire}`,
          borderBottom: `1px solid ${COLORS.wire}`,
          background: "rgba(255,255,255,0.04)",
          flexWrap: "wrap",
        }}
      >
        {[
          { label: "Messages", value: ISSUE.totalMessages.toString(), sub: `vs ${ISSUE.comparedToLastWeek.messages} last week` },
          { label: "Active Channels", value: ISSUE.activeChannels.toString(), sub: `out of ${ISSUE.totalChannels}` },
          { label: "Biggest Thread", value: "22", sub: "replies in #team-eng" },
          { label: "Unique Voices", value: "14+", sub: "contributors" },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "clamp(28px, 5vw, 44px)",
                fontWeight: 900,
                color: COLORS.paper,
                lineHeight: 1,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: "10px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: COLORS.smoke,
                fontFamily: "system-ui, sans-serif",
                marginTop: "4px",
              }}
            >
              {stat.label}
            </div>
            <div style={{ fontSize: "11px", color: COLORS.smoke, fontStyle: "italic", marginTop: "2px" }}>
              {stat.sub}
            </div>
          </div>
        ))}
      </div>
    </header>
  );
}

// ─── THIS WEEK ───────────────────────────────────────────────────────────────
function ThisWeek() {
  return (
    <Section>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Label>This Week</Label>
        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 48px)",
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: "40px",
            maxWidth: "700px",
          }}
        >
          Five stories. One week. All depth.
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "32px",
          }}
        >
          {HIGHLIGHTS.map((h, i) => (
            <div
              key={h.id}
              style={{
                borderTop: `3px solid ${i === 0 ? COLORS.lapis : i === 1 ? COLORS.gold : i === 2 ? COLORS.teal : COLORS.paperWire}`,
                paddingTop: "20px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <span style={{ fontSize: "20px" }}>{h.emoji}</span>
                <span
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: COLORS.smoke,
                    fontFamily: "system-ui, sans-serif",
                    fontWeight: 700,
                  }}
                >
                  {h.area}
                </span>
              </div>
              <h3
                style={{
                  fontSize: "clamp(17px, 2.2vw, 22px)",
                  fontWeight: 700,
                  lineHeight: 1.25,
                  marginBottom: "12px",
                }}
              >
                {h.headline}
              </h3>
              <p style={{ fontSize: "clamp(13px, 1.5vw, 15px)", color: "#374151", lineHeight: 1.7, margin: 0 }}>
                {h.body}
              </p>
              <div style={{ marginTop: "12px" }}>
                <ChannelPill name={h.channel} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── CHANNEL SPOTLIGHT ───────────────────────────────────────────────────────
function ChannelSpotlight() {
  return (
    <Section dark>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Label light>Channel Spotlight</Label>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "48px",
            alignItems: "start",
          }}
        >
          {/* Left — Channel info */}
          <div>
            <div
              style={{
                fontSize: "clamp(36px, 6vw, 72px)",
                fontWeight: 900,
                color: COLORS.lapis,
                lineHeight: 1,
                marginBottom: "8px",
              }}
            >
              #{SPOTLIGHT.name}
            </div>
            <div style={{ fontSize: "clamp(14px, 2vw, 18px)", color: COLORS.paper, opacity: 0.8, marginBottom: "24px" }}>
              {SPOTLIGHT.description}
            </div>

            {/* Stats grid */}
            <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", marginBottom: "24px" }}>
              {[
                { label: "Messages", val: SPOTLIGHT.messages, sub: SPOTLIGHT.vsLastWeek.delta + " vs last week" },
                { label: "Contributors", val: SPOTLIGHT.uniqueUsers },
                { label: "Reactions", val: SPOTLIGHT.reactions },
              ].map((s) => (
                <div key={s.label}>
                  <div style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 900, color: COLORS.paper, lineHeight: 1 }}>
                    {s.val}
                  </div>
                  <div
                    style={{
                      fontSize: "10px",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: COLORS.smoke,
                      fontFamily: "system-ui, sans-serif",
                    }}
                  >
                    {s.label}
                  </div>
                  {s.sub && <div style={{ fontSize: "11px", color: COLORS.teal, marginTop: "2px" }}>{s.sub}</div>}
                </div>
              ))}
            </div>

            {/* Topic pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {SPOTLIGHT.topTopics.map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: "12px",
                    fontFamily: "system-ui, sans-serif",
                    padding: "4px 10px",
                    border: `1px solid ${COLORS.wire}`,
                    borderRadius: "3px",
                    color: COLORS.paper,
                    opacity: 0.75,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right — Pull quote */}
          <div
            style={{
              borderLeft: `4px solid ${COLORS.gold}`,
              paddingLeft: "24px",
              marginTop: "8px",
            }}
          >
            <div
              style={{
                fontSize: "clamp(18px, 2.5vw, 26px)",
                fontStyle: "italic",
                lineHeight: 1.45,
                color: COLORS.paper,
                marginBottom: "16px",
              }}
            >
              &ldquo;{SPOTLIGHT.quote}&rdquo;
            </div>
            <div
              style={{
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: COLORS.smoke,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              — {SPOTLIGHT.quoteContext}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─── HOT THREADS ────────────────────────────────────────────────────────────
function HotThreads() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <Section>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Label>Hot Threads</Label>
        <h2 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 900, lineHeight: 1.1, marginBottom: "40px" }}>
          The conversations that mattered
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {HOT_THREADS.map((thread, i) => (
            <a
              key={i}
              href={thread.slackLink}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr",
                gap: "24px",
                padding: "24px 0",
                borderBottom: `1px solid ${COLORS.paperWire}`,
                textDecoration: "none",
                color: "inherit",
                alignItems: "start",
                transition: "background 0.15s",
                background: hovered === i ? COLORS.mist : "transparent",
                borderRadius: hovered === i ? "4px" : "0",
                paddingLeft: hovered === i ? "12px" : "0",
                paddingRight: hovered === i ? "12px" : "0",
              }}
            >
              {/* Reply count block */}
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  background: i === 0 ? COLORS.lapis : i === 1 ? COLORS.steel : COLORS.ink,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  borderRadius: "2px",
                }}
              >
                <span style={{ fontSize: "22px", fontWeight: 900, color: COLORS.paper, lineHeight: 1 }}>
                  {thread.replies}
                </span>
                <span
                  style={{
                    fontSize: "8px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: COLORS.smoke,
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  replies
                </span>
              </div>

              {/* Thread content */}
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "6px",
                    flexWrap: "wrap",
                  }}
                >
                  <ChannelPill name={thread.channel} />
                  <span
                    style={{
                      fontSize: "11px",
                      color: COLORS.lapis,
                      fontFamily: "system-ui, sans-serif",
                    }}
                  >
                    Open in Slack →
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "clamp(15px, 2vw, 19px)",
                    fontWeight: 700,
                    lineHeight: 1.3,
                    marginBottom: "8px",
                  }}
                >
                  {thread.rootText}
                </div>
                <p style={{ fontSize: "clamp(13px, 1.5vw, 15px)", color: "#4B5563", lineHeight: 1.65, margin: 0 }}>
                  {thread.preview}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── COMPETITIVE INTELLIGENCE ────────────────────────────────────────────────
function MarketSignals() {
  return (
    <Section
      style={{
        background: COLORS.steel,
        color: COLORS.paper,
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Label light>Market Signals</Label>
        <h2 style={{ fontSize: "clamp(24px, 3.5vw, 40px)", fontWeight: 900, lineHeight: 1.1, marginBottom: "8px" }}>
          The field is moving. Kinship is watching.
        </h2>
        <p style={{ fontSize: "clamp(14px, 1.8vw, 17px)", opacity: 0.7, marginBottom: "40px", fontStyle: "italic" }}>
          Competitive intelligence surfaced from #topic-collective-intelligence this week
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {COMPETITIVE_INTELLIGENCE.map((intel) => (
            <a
              key={intel.source}
              href={intel.url}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "block",
                background: "rgba(255,255,255,0.06)",
                border: `1px solid ${COLORS.wire}`,
                borderTop: `3px solid ${COLORS.teal}`,
                padding: "24px",
                textDecoration: "none",
                color: COLORS.paper,
                borderRadius: "2px",
                transition: "background 0.15s",
              }}
            >
              <div style={{ fontSize: "24px", marginBottom: "10px" }}>{intel.emoji}</div>
              <div
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: COLORS.teal,
                  fontFamily: "system-ui, sans-serif",
                  marginBottom: "8px",
                  fontWeight: 700,
                }}
              >
                {intel.source}
              </div>
              <div style={{ fontSize: "clamp(14px, 1.8vw, 17px)", fontWeight: 700, lineHeight: 1.3, marginBottom: "10px" }}>
                {intel.headline}
              </div>
              <p style={{ fontSize: "13px", opacity: 0.75, lineHeight: 1.6, margin: 0 }}>{intel.detail}</p>
            </a>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── WHO'S IN THE MIX ────────────────────────────────────────────────────────
function WhosMixing() {
  return (
    <Section>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Label>In The Mix</Label>
        <h2 style={{ fontSize: "clamp(22px, 3.5vw, 36px)", fontWeight: 900, lineHeight: 1.1, marginBottom: "8px" }}>
          The voices behind the week
        </h2>
        <p style={{ fontSize: "clamp(13px, 1.5vw, 15px)", color: COLORS.smoke, marginBottom: "32px", fontStyle: "italic" }}>
          People who showed up in public channels — not a ranking, just a celebration of presence.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
          {ACTIVE_CONTRIBUTORS.map((person) => (
            <div
              key={person.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                background: COLORS.mist,
                border: `1px solid ${COLORS.paperWire}`,
                borderRadius: "4px",
                padding: "12px 16px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  background: COLORS.lapis,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "15px",
                  fontWeight: 700,
                  color: COLORS.paper,
                  flexShrink: 0,
                }}
              >
                {person.initial}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: "14px" }}>{person.name}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                  {person.channels.slice(0, 2).map((ch) => (
                    <span
                      key={ch}
                      style={{
                        fontSize: "10px",
                        color: COLORS.smoke,
                        fontFamily: "system-ui, sans-serif",
                      }}
                    >
                      #{ch}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── QUIET CHANNELS ──────────────────────────────────────────────────────────
function QuietChannels() {
  return (
    <Section
      style={{
        background: COLORS.mist,
        borderTop: `1px solid ${COLORS.paperWire}`,
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <Label>The Quiet Room</Label>
        <h2 style={{ fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 900, marginBottom: "8px" }}>
          Still waiting for their debut
        </h2>
        <p style={{ fontSize: "clamp(13px, 1.5vw, 15px)", color: COLORS.smoke, marginBottom: "28px", fontStyle: "italic" }}>
          16 channels this week. Zero messages. The silence is noted with warmth, not judgment.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {QUIET_CHANNELS.map((ch) => (
            <div
              key={ch.name}
              style={{
                padding: "8px 14px",
                border: `1px dashed ${COLORS.paperWire}`,
                borderRadius: "3px",
                fontSize: "13px",
                color: COLORS.smoke,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              #{ch.name}
              <span style={{ fontSize: "10px", marginLeft: "6px", color: COLORS.red, opacity: 0.6 }}>
                {ch.streak}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "32px",
            borderLeft: `4px solid ${COLORS.gold}`,
            paddingLeft: "20px",
            fontStyle: "italic",
            fontSize: "clamp(15px, 2vw, 20px)",
            color: COLORS.ink,
            maxWidth: "600px",
          }}
        >
          &ldquo;Commoditization of learning science-embedded curriculum may have arrived. The battle will be fought on UX.&rdquo;
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: COLORS.smoke,
              fontFamily: "system-ui, sans-serif",
              marginTop: "10px",
            }}
          >
            — #topic-learning-science, this week
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      style={{
        background: COLORS.ink,
        color: COLORS.smoke,
        padding: "40px 24px",
        textAlign: "center",
      }}
    >
      <div style={{ background: COLORS.lapis, height: "2px", width: "60px", margin: "0 auto 24px" }} />
      <div style={{ fontSize: "clamp(11px, 1.5vw, 13px)", fontFamily: "system-ui, sans-serif", lineHeight: 1.8 }}>
        <div style={{ color: COLORS.paper, fontWeight: 700, marginBottom: "8px" }}>
          The Kinship Deep Cut — Issue #2
        </div>
        <div>Compiled by Hermes · {ISSUE.weekRange} · {ISSUE.totalMessages} messages across {ISSUE.activeChannels} channels</div>
        <div style={{ marginTop: "8px" }}>
          Published every Friday at 5pm EST · Sources: Kinship public Slack channels
        </div>
      </div>
    </footer>
  );
}

// ─── PAGE ───────────────────────────────────────────────────────────────────
export default function KinshipMagazineIssue2() {
  return (
    <div style={ROOT}>
      <Masthead />
      <ThisWeek />
      <ChannelSpotlight />
      <HotThreads />
      <MarketSignals />
      <WhosMixing />
      <QuietChannels />
      <Footer />
    </div>
  );
}
