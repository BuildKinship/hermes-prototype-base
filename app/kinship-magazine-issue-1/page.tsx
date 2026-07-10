"use client";
// Required: this page renders magazine content with dynamic data and interactive link behavior

import React, { type ReactNode, useState } from "react";
import {
  ISSUE,
  HIGHLIGHTS,
  SPOTLIGHT,
  HOT_THREADS,
  QUIET_CHANNELS,
  COMPETITIVE_INTELLIGENCE,
} from "@/mock/magazine-issue-1";

// ─── Design Tokens ──────────────────────────────────────────────────────────
// Breaking from Kinship conservative defaults — this is a magazine.
const COLORS = {
  ink: "#0A0A0A",
  paper: "#F5F0E8",
  accent: "#D4380D",    // editorial red
  gold: "#C9A84C",      // pull quote gold
  steel: "#1A1A2E",     // deep section bg
  mist: "#E8E4DC",      // subtle bg
  smoke: "#6B6B6B",     // secondary text
  wire: "#2A2A2A",      // dividers
};

// ─── Typography helpers ──────────────────────────────────────────────────────
function Masthead() {
  return (
    <header style={{ background: COLORS.ink, color: COLORS.paper, padding: "0" }}>
      {/* Top rule */}
      <div style={{ background: COLORS.accent, height: "4px", width: "100%" }} />

      {/* Header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
          borderBottom: `1px solid ${COLORS.wire}`,
        }}
      >
        <span style={{ fontSize: "11px", letterSpacing: "0.15em", color: COLORS.smoke, textTransform: "uppercase" }}>
          {ISSUE.weekRange}
        </span>
        <span style={{ fontSize: "11px", letterSpacing: "0.15em", color: COLORS.smoke, textTransform: "uppercase" }}>
          Issue No. {ISSUE.number}
        </span>
      </div>

      {/* Masthead */}
      <div style={{ textAlign: "center", padding: "48px 24px 36px" }}>
        <div style={{ fontSize: "clamp(52px, 10vw, 112px)", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 0.9, color: COLORS.paper }}>
          {ISSUE.title.split(" ").map((word, i) => (
            <span key={i}>
              {i === 1 ? <span style={{ color: COLORS.accent }}>{word}</span> : word}
              {i < ISSUE.title.split(" ").length - 1 ? " " : ""}
            </span>
          ))}
        </div>
        <div style={{ marginTop: "16px", fontSize: "clamp(13px, 2vw, 16px)", letterSpacing: "0.2em", color: COLORS.smoke, textTransform: "uppercase" }}>
          {ISSUE.theme}
        </div>
        <div style={{ marginTop: "8px", fontSize: "clamp(14px, 2vw, 18px)", color: COLORS.paper, opacity: 0.7, fontStyle: "italic" }}>
          {ISSUE.tagline}
        </div>
      </div>

      {/* Stats bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "clamp(24px, 4vw, 64px)",
          padding: "20px 24px",
          borderTop: `1px solid ${COLORS.wire}`,
          borderBottom: `1px solid ${COLORS.wire}`,
          background: "#111",
          flexWrap: "wrap",
        }}
      >
        {[
          { n: ISSUE.totalMessages, label: "Messages" },
          { n: ISSUE.activeChannels, label: "Active Channels" },
          { n: ISSUE.totalChannels, label: "Channels Monitored" },
        ].map((s) => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800, color: COLORS.paper, lineHeight: 1 }}>
              {s.n}
            </div>
            <div style={{ fontSize: "11px", letterSpacing: "0.12em", color: COLORS.smoke, textTransform: "uppercase", marginTop: "4px" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </header>
  );
}

function SectionLabel({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <div
      style={{
        fontSize: "10px",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: light ? COLORS.smoke : COLORS.accent,
        fontWeight: 700,
        marginBottom: "16px",
        paddingBottom: "8px",
        borderBottom: `1px solid ${light ? COLORS.wire : COLORS.accent}`,
      }}
    >
      {children}
    </div>
  );
}

function Divider({ color = COLORS.wire }: { color?: string }) {
  return <div style={{ height: "1px", background: color, margin: "0 24px" }} />;
}

// ─── This Week section ───────────────────────────────────────────────────────
function ThisWeek() {
  return (
    <section style={{ background: COLORS.paper, padding: "clamp(32px, 5vw, 64px) clamp(20px, 5vw, 48px)" }}>
      <SectionLabel>This Week in Kinship</SectionLabel>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "32px",
        }}
      >
        {HIGHLIGHTS.map((h, i) => (
          <article key={i} style={{ borderTop: `3px solid ${COLORS.ink}`, paddingTop: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <span style={{ fontSize: "20px" }}>{h.emoji}</span>
              <span style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: COLORS.smoke, fontWeight: 700 }}>
                {h.label}
              </span>
            </div>
            <h3 style={{ fontSize: "clamp(18px, 2.5vw, 22px)", fontWeight: 800, lineHeight: 1.2, color: COLORS.ink, margin: "0 0 12px" }}>
              {h.headline}
            </h3>
            <p style={{ fontSize: "15px", lineHeight: 1.65, color: "#333", margin: "0 0 12px" }}>
              {h.summary}
            </p>
            {h.threadLink && (
              <a
                href={h.threadLink}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: COLORS.accent,
                  letterSpacing: "0.05em",
                  textDecoration: "none",
                  borderBottom: `1px solid ${COLORS.accent}`,
                }}
              >
                {h.threadLabel}
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

// ─── Channel Spotlight ───────────────────────────────────────────────────────
function ChannelSpotlight() {
  return (
    <section style={{ background: COLORS.steel, color: COLORS.paper, padding: "clamp(32px, 5vw, 64px) clamp(20px, 5vw, 48px)" }}>
      <SectionLabel light>Channel Spotlight</SectionLabel>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "clamp(24px, 4vw, 48px)",
          alignItems: "start",
        }}
      >
        <div>
          <div style={{ fontSize: "12px", color: COLORS.smoke, marginBottom: "8px" }}>
            Most Active Channel
          </div>
          <a
            href={SPOTLIGHT.slackLink}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "none" }}
          >
            <h2
              style={{
                fontSize: "clamp(32px, 6vw, 60px)",
                fontWeight: 900,
                color: COLORS.paper,
                lineHeight: 1,
                margin: "0 0 8px",
                letterSpacing: "-0.02em",
              }}
            >
              #{SPOTLIGHT.name}
            </h2>
          </a>
          <div style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 700, color: COLORS.accent, marginBottom: "20px" }}>
            {SPOTLIGHT.headline}
          </div>

          <div style={{ display: "flex", gap: "32px", marginBottom: "24px", flexWrap: "wrap" }}>
            {[
              { n: SPOTLIGHT.messages, label: "Messages" },
              { n: SPOTLIGHT.uniqueVoices, label: "Contributors" },
              { n: SPOTLIGHT.reactions, label: "Reactions" },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: "28px", fontWeight: 800, color: COLORS.paper }}>{s.n}</div>
                <div style={{ fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.smoke }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p style={{ fontSize: "clamp(14px, 2vw, 16px)", lineHeight: 1.7, color: "#B0B0C0", margin: "0 0 28px" }}>
            {SPOTLIGHT.description}
          </p>

          {/* Pull quote */}
          <blockquote
            style={{
              borderLeft: `4px solid ${COLORS.gold}`,
              margin: 0,
              paddingLeft: "20px",
            }}
          >
            <p style={{ fontSize: "clamp(16px, 2.5vw, 20px)", fontStyle: "italic", color: COLORS.gold, lineHeight: 1.5, margin: "0 0 8px" }}>
              "{SPOTLIGHT.pullQuote}"
            </p>
            <cite style={{ fontSize: "11px", letterSpacing: "0.1em", color: COLORS.smoke, textTransform: "uppercase" }}>
              — {SPOTLIGHT.pullQuoteSource}
            </cite>
          </blockquote>
        </div>
      </div>
    </section>
  );
}

// ─── Hot Threads ─────────────────────────────────────────────────────────────
function HotThreads() {
  return (
    <section style={{ background: COLORS.paper, padding: "clamp(32px, 5vw, 64px) clamp(20px, 5vw, 48px)" }}>
      <SectionLabel>🔥 Hot Threads — Honorable Mentions</SectionLabel>
      <p style={{ fontSize: "14px", color: COLORS.smoke, margin: "0 0 32px", letterSpacing: "0.02em" }}>
        The conversations worth reading in full.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {HOT_THREADS.map((t, i) => (
          <React.Fragment key={i}>
            <article
              style={{
                display: "grid",
                gridTemplateColumns: "auto 1fr",
                gap: "20px",
                padding: "24px 0",
                alignItems: "start",
              }}
            >
              {/* Reply count */}
              <div
                style={{
                  background: COLORS.ink,
                  color: COLORS.paper,
                  width: "56px",
                  height: "56px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: "20px", fontWeight: 900, lineHeight: 1 }}>{t.replies}</span>
                <span style={{ fontSize: "8px", letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.smoke }}>replies</span>
              </div>

              <div>
                <div style={{ fontSize: "11px", letterSpacing: "0.12em", color: COLORS.smoke, textTransform: "uppercase", marginBottom: "6px" }}>
                  #{t.channel}
                </div>
                <h4 style={{ fontSize: "clamp(15px, 2.5vw, 18px)", fontWeight: 700, color: COLORS.ink, margin: "0 0 8px", lineHeight: 1.3 }}>
                  "{t.preview}"
                </h4>
                <p style={{ fontSize: "14px", color: "#444", lineHeight: 1.6, margin: "0 0 10px" }}>
                  {t.context}
                </p>
                <a
                  href={t.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: COLORS.accent,
                    letterSpacing: "0.08em",
                    textDecoration: "none",
                    textTransform: "uppercase",
                  }}
                >
                  Open in Slack →
                </a>
              </div>
            </article>
            {i < HOT_THREADS.length - 1 && (
              <div style={{ height: "1px", background: COLORS.mist }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

// ─── Competitive Intel ───────────────────────────────────────────────────────
function CompetitiveIntel() {
  return (
    <section style={{ background: "#1A0A00", color: COLORS.paper, padding: "clamp(32px, 5vw, 64px) clamp(20px, 5vw, 48px)" }}>
      <SectionLabel light>Market Signals</SectionLabel>
      <p style={{ fontSize: "14px", color: COLORS.smoke, margin: "0 0 28px" }}>
        What the team is watching from the outside.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "24px",
        }}
      >
        {COMPETITIVE_INTELLIGENCE.map((item, i) => (
          <div
            key={i}
            style={{
              borderLeft: `3px solid ${COLORS.gold}`,
              paddingLeft: "16px",
            }}
          >
            <h4 style={{ fontSize: "clamp(14px, 2vw, 16px)", fontWeight: 700, color: COLORS.paper, margin: "0 0 8px", lineHeight: 1.3 }}>
              {item.headline}
            </h4>
            <p style={{ fontSize: "13px", color: "#9090A0", lineHeight: 1.6, margin: "0 0 10px" }}>
              {item.note}
            </p>
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: "11px", color: COLORS.gold, textDecoration: "none", letterSpacing: "0.05em" }}
            >
              See thread →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Quiet Channels ──────────────────────────────────────────────────────────
function QuietChannels() {
  return (
    <section style={{ background: COLORS.mist, padding: "clamp(32px, 5vw, 64px) clamp(20px, 5vw, 48px)" }}>
      <SectionLabel>📻 The Quiet Ones</SectionLabel>
      <p style={{ fontSize: "14px", color: COLORS.smoke, margin: "0 0 24px", fontStyle: "italic" }}>
        Channels that stayed silent this week. They know who they are.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
        {QUIET_CHANNELS.map((ch, i) => (
          <div
            key={i}
            style={{
              background: "white",
              border: `1px solid #DDD`,
              padding: "16px 20px",
            }}
          >
            <div style={{ fontSize: "12px", fontWeight: 700, color: COLORS.ink, marginBottom: "4px" }}>
              #{ch.name}
            </div>
            <div style={{ fontSize: "13px", color: COLORS.smoke, fontStyle: "italic" }}>
              {ch.nudge}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: COLORS.ink, color: COLORS.smoke, padding: "32px clamp(20px, 5vw, 48px)", textAlign: "center" }}>
      <div style={{ height: "1px", background: COLORS.wire, marginBottom: "24px" }} />
      <div style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 900, color: COLORS.paper, marginBottom: "8px" }}>
        The Kinship <span style={{ color: COLORS.accent }}>Signal</span>
      </div>
      <p style={{ fontSize: "13px", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto 16px" }}>
        A weekly publication by Hermes. Compiled from public Slack channels every Friday.
        The more you post, the better the magazine gets.
      </p>
      <p style={{ fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
        Issue No. {ISSUE.number} · {ISSUE.publishDate}
      </p>
    </footer>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function Page() {
  return (
    <div
      style={{
        fontFamily: "'Georgia', 'Times New Roman', serif",
        minHeight: "100dvh",
        background: COLORS.paper,
        overflowX: "hidden",
      }}
    >
      <Masthead />
      <ThisWeek />
      <Divider color={COLORS.wire} />
      <ChannelSpotlight />
      <HotThreads />
      <CompetitiveIntel />
      <QuietChannels />
      <Footer />
    </div>
  );
}
