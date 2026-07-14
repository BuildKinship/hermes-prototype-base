"use client";
// Required: interactive state for progress, copy-to-clipboard, checklist

import React, { useState, useEffect, useRef, useCallback } from "react";

/* ─── Verified Anthropic help URLs ────────────────────────────────────── */
const LINKS = {
  projects: "https://support.claude.com/en/articles/9517075-what-are-projects",
  connectors: "https://support.claude.com/en/",
  helpHome: "https://support.claude.com",
  privacy: "https://www.anthropic.com/privacy",
  teamPlan: "https://www.anthropic.com/pricing",
  skillsDocs: "https://support.claude.com/en/articles/9517075-what-are-projects",
};

/* ─── Colour tokens (inline — no globals.css dependency needed) ────────── */
const C = {
  ink: "#3D1A4E",
  mid: "#7A5590",
  dim: "#B8A2C8",
  cream: "#F5F0E8",
  paper: "#EDE8DC",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  inactive: "#9CA3AF",
};

/* ─── Copy-to-clipboard hook ────────────────────────────────────────────── */
function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = useCallback((text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  }, []);
  return { copied, copy };
}

/* ─── Prompt block component ────────────────────────────────────────────── */
function PromptBlock({
  id,
  label,
  children,
  variant = "default",
}: {
  id: string;
  label?: string;
  children: string;
  variant?: "default" | "skill";
}) {
  const { copied, copy } = useCopy();
  const isSkill = variant === "skill";

  return (
    <div
      style={{
        border: `1px solid ${isSkill ? C.mid : C.dim}`,
        borderRadius: 10,
        background: isSkill ? "#2a1038" : C.cream,
        overflow: "hidden",
        marginTop: 12,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 14px",
          borderBottom: `1px solid ${isSkill ? "#4a2060" : C.dim}`,
          background: isSkill ? "#1e0828" : C.paper,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontFamily: "ui-monospace, monospace",
            color: isSkill ? C.dim : C.mid,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {label ?? (isSkill ? "SKILL.md" : "prompt")}
        </span>
        <button
          onClick={() => copy(children, id)}
          style={{
            background: "none",
            border: `1px solid ${copied === id ? C.success : isSkill ? "#4a2060" : C.dim}`,
            borderRadius: 5,
            padding: "3px 10px",
            cursor: "pointer",
            fontSize: 11,
            fontFamily: "system-ui, sans-serif",
            color: copied === id ? C.success : isSkill ? C.dim : C.mid,
            transition: "all 0.18s ease",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          {copied === id ? "✓ copied" : "copy"}
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: "14px 16px",
          fontSize: 13,
          lineHeight: 1.65,
          fontFamily: "ui-monospace, 'Cascadia Code', monospace",
          color: isSkill ? "#d4b8e8" : C.ink,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {children}
      </pre>
    </div>
  );
}

/* ─── Section wrapper with fade-up animation ────────────────────────────── */
function Section({
  children,
  id,
  delay = 0,
}: {
  children: React.ReactNode;
  id?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      id={id}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.28s cubic-bezier(0.22,1,0.36,1), transform 0.28s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {children}
    </div>
  );
}

/* ─── Card ──────────────────────────────────────────────────────────────── */
function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        border: `1px solid ${C.dim}`,
        borderRadius: 10,
        padding: "20px 22px",
        background: C.cream,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Move header ───────────────────────────────────────────────────────── */
function MoveHeader({
  number,
  title,
  why,
}: {
  number: string;
  title: string;
  why: string;
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <span
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: 11,
            color: C.mid,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            background: C.paper,
            border: `1px solid ${C.dim}`,
            borderRadius: 5,
            padding: "2px 8px",
          }}
        >
          {number}
        </span>
        <h2
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 22,
            fontWeight: 600,
            color: C.ink,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {title}
        </h2>
      </div>
      <p style={{ color: C.mid, fontSize: 13.5, margin: 0, paddingLeft: 2 }}>
        {why}
      </p>
    </div>
  );
}

/* ─── Step list ─────────────────────────────────────────────────────────── */
function Steps({ items }: { items: (string | React.ReactNode)[] }) {
  return (
    <ol style={{ margin: "12px 0 0 0", padding: 0, listStyle: "none" }}>
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 12,
            alignItems: "flex-start",
          }}
        >
          <span
            style={{
              minWidth: 24,
              height: 24,
              borderRadius: "50%",
              background: C.paper,
              border: `1px solid ${C.dim}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontFamily: "ui-monospace, monospace",
              color: C.mid,
              marginTop: 1,
              flexShrink: 0,
            }}
          >
            {i + 1}
          </span>
          <div
            style={{
              fontSize: 14,
              color: C.ink,
              lineHeight: 1.55,
              paddingTop: 3,
            }}
          >
            {item}
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ─── What-good-looks-like note ─────────────────────────────────────────── */
function WhatGood({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginTop: 14,
        padding: "10px 14px",
        border: `1px solid ${C.dim}`,
        borderRadius: 8,
        background: C.paper,
        fontSize: 13,
        color: C.mid,
        lineHeight: 1.5,
      }}
    >
      <span
        style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          display: "block",
          marginBottom: 3,
          color: C.dim,
        }}
      >
        what good looks like
      </span>
      {children}
    </div>
  );
}

/* ─── Compliance callout ─────────────────────────────────────────────────── */
function ComplianceNote({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        margin: "18px 0",
        padding: "12px 16px",
        border: `1px solid ${C.mid}`,
        borderRadius: 8,
        background: `${C.mid}11`,
        fontSize: 13.5,
        color: C.ink,
        lineHeight: 1.55,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Reference link ─────────────────────────────────────────────────────── */
function RefLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: C.mid,
        fontSize: 12,
        textDecoration: "none",
        borderBottom: `1px solid ${C.dim}`,
        paddingBottom: 1,
        transition: "color 0.15s ease",
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLAnchorElement).style.color = C.ink)
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLAnchorElement).style.color = C.mid)
      }
    >
      {children}
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.6 }}>
        <path
          d="M2 8L8 2M8 2H4M8 2V6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}

/* ─── Progress spine ─────────────────────────────────────────────────────── */
function ProgressSpine({ activeMove }: { activeMove: number }) {
  const moves = [1, 2, 3, 4, 5];
  return (
    <div
      style={{
        position: "fixed",
        left: 20,
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        zIndex: 50,
      }}
      className="progress-spine"
    >
      {moves.map((m) => (
        <div
          key={m}
          onClick={() => {
            document.getElementById(`move-${m}`)?.scrollIntoView({ behavior: "smooth" });
          }}
          style={{
            width: 6,
            height: m === activeMove ? 24 : 6,
            borderRadius: 3,
            background: m <= activeMove ? C.mid : C.dim,
            opacity: m <= activeMove ? 1 : 0.4,
            cursor: "pointer",
            transition: "all 0.28s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Checklist item ─────────────────────────────────────────────────────── */
function CheckItem({
  number,
  children,
  checked,
  onToggle,
}: {
  number: number;
  children: React.ReactNode;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
        padding: "12px 16px",
        border: `1px solid ${checked ? C.mid : C.dim}`,
        borderRadius: 8,
        marginBottom: 8,
        cursor: "pointer",
        background: checked ? `${C.mid}0a` : C.cream,
        transition: "all 0.18s ease",
        opacity: checked ? 0.75 : 1,
      }}
    >
      <div
        style={{
          minWidth: 22,
          height: 22,
          borderRadius: "50%",
          border: `1.5px solid ${checked ? C.success : C.dim}`,
          background: checked ? C.success : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 1,
          flexShrink: 0,
          transition: "all 0.18s ease",
        }}
      >
        {checked && (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path
              d="M1 4L4 7.5L10 1"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <div style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.5, paddingTop: 2 }}>
        <span
          style={{
            fontSize: 10,
            fontFamily: "ui-monospace, monospace",
            color: C.dim,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            display: "block",
            marginBottom: 2,
          }}
        >
          task {number}
        </span>
        {children}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/* ─── PROMPTS (exact content from spec) ──────────────────────────────────── */
const PROMPT_INVENTORY = `I'm connected to a school's Google Drive for a CAIS accreditation review.
The folder here contains the school's self-study reports (one per standard)
and their evidence documents.

Before we start: list every document you can see in this folder, group them
by which CAIS standard they appear to belong to, and flag any standard that
seems to be missing a self-study or has no evidence attached. Do not download
or copy anything — just read and inventory what's there.`;

const PROMPT_PROFILE = `I'm the Director of Accreditation at CAIS (Canadian Accredited Independent
Schools). I run peer-review accreditation of independent schools against the
CAIS National Standards Framework. My work centres on: self-study reports
(one per standard), evidence documents, and the Peer Review Report the team
writes (commendations and recommendations per standard).

Principles I always work by:
- We never take possession of a school's documents. Read only; never suggest
  downloading or storing them.
- Confidentiality is paramount.
- Keep me in the loop — propose, don't autopilot. I make the final calls.
- I like results summarized in tables, with clear status markers, and plain
  language over jargon.`;

const PROMPT_PROJECT_SETUP = `Create a project called "CAIS Accreditation." I'll add these to its
knowledge: the CAIS National Standards Framework (standards, indicators of
effective practice, guiding questions, recommended documentation), the Peer
Review Report template, and a sample completed Peer Review Report for tone.

Project instructions: Whenever I work in this project, assume I'm reviewing
one school at a time against the National Standards Framework. Use the
indicators of effective practice as the rubric. Write in the voice of the
sample Peer Review Report — commendations and recommendations, constructive,
specific. Never recommend downloading or storing a school's documents.`;

const PROMPT_CREATE_SKILL = `Help me create a Claude skill called "audit" that runs a CAIS accreditation
review. I'll invoke it as /audit.

Here's the process I follow as a human auditor — turn it into a clean,
reusable skill:

1. Confirm scope. Identify the school. List the self-study reports and
   evidence found in the connected Drive. Note which of the CAIS standards
   are in scope (remember Standard 8 – Boarding doesn't apply to every
   school). Ask me to confirm before continuing.
2. Go standard by standard. For each standard, read the self-study, then
   check it against the indicators of effective practice and guiding
   questions in the National Standards Framework. Confirm whether the
   recommended documentation / evidence is actually present and linked.
3. Judge the evidence. For each standard, decide whether the evidence is
   strong, partial, or missing, and say why in one or two sentences.
4. Draft findings. For each standard, write commendations (genuine strengths)
   and recommendations (specific, actionable gaps to address), in the voice
   of a CAIS Peer Review Report.
5. Summarize in a table (this is how I like to see it) with columns:
   Standard | Evidence completeness | Alignment to indicators |
   Commendations | Recommendations | Status. Use these status markers:
   ✅ strong  🟡 partial  🔴 gap  ⚪ not applicable.
6. Offer next step. Ask if I want the full findings written up in the CAIS
   Peer Review Report template.

Hard rules for the skill: never download, copy, or store the school's
documents — read only. Keep me in the loop: pause at step 1 for my
confirmation. Plain language, no jargon.

Write this as a SKILL.md I can upload, with a clear name and a description
that makes Claude use it whenever I'm doing an accreditation review.`;

const SKILL_FILE = `---
name: audit
description: Runs a CAIS accreditation review of one school against the
  National Standards Framework. Use whenever I'm reviewing a school's
  self-study and evidence documents and want findings organized by standard.
---

# CAIS accreditation audit

You are helping a CAIS accreditation director review ONE school against the
CAIS National Standards Framework. The school's self-study reports and
evidence are in the connected Google Drive.

## Rules that never change
- Read only. Never download, copy, or store the school's documents.
- Keep the director in the loop. Pause where indicated and wait.
- Use the indicators of effective practice as the rubric — not your own
  opinion of what a good school looks like.
- Plain, constructive language, in the voice of a Peer Review Report.

## Steps
1. **Confirm scope.** Name the school. List the self-study reports and
   evidence found in the Drive, grouped by standard. Note which standards are
   in scope (Standard 8 – Boarding may not apply). **Stop and ask the
   director to confirm before continuing.**
2. **Review each standard.** For every in-scope standard, read the self-study
   and check it against the indicators of effective practice and guiding
   questions. Confirm the recommended documentation is present and linked.
3. **Judge the evidence.** Mark each standard strong / partial / gap /
   not applicable, with a one-to-two sentence reason.
4. **Draft findings.** For each standard, write commendations (real
   strengths) and recommendations (specific, actionable).
5. **Summarize.** Output this table:

   | Standard | Evidence completeness | Alignment to indicators | Commendations | Recommendations | Status |
   |---|---|---|---|---|---|

   Status markers: ✅ strong · 🟡 partial · 🔴 gap · ⚪ not applicable.
6. **Offer next step.** Ask whether to write the full findings into the CAIS
   Peer Review Report template.`;

const PROMPT_UPDATE_SKILL = `Update my /audit skill. Two changes:

1. Add a step between "judge the evidence" and "draft findings": cross-check
   whether any evidence document is referenced in the self-study but not
   actually present in the Drive, and list those as "evidence cited but not
   found."
2. In the summary table, add a column "Evidence links checked" with ✅ / 🔴.

Show me the full updated SKILL.md so I can re-upload it.`;

const PROMPT_CHAIN = `Let's run a full pass on the school in the connected Drive.

/intake — first inventory everything and flag gaps.
Then /audit — do the full standard-by-standard review.
Then /report — draft the Peer Review Report from those findings.

Pause after /intake and after /audit so I can review before you continue.`;

/* ─── Main page ─────────────────────────────────────────────────────────── */
export default function ClaudeForAuditorsPage() {
  const [activeMove, setActiveMove] = useState(0);
  const [checklist, setChecklist] = useState<boolean[]>([false, false, false, false, false]);
  const [showSpine, setShowSpine] = useState(false);

  const toggleCheck = (i: number) => {
    setChecklist((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY;
      setShowSpine(scrollY > 300);

      // Detect which move is in view
      for (let m = 5; m >= 1; m--) {
        const el = document.getElementById(`move-${m}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.5) {
            setActiveMove(m);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const serif = "Georgia, 'Times New Roman', serif";
  const sans = "system-ui, -apple-system, 'Inter', sans-serif";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { 
          background: ${C.cream}; 
          margin: 0; 
          font-family: ${sans};
          color: ${C.ink};
          -webkit-font-smoothing: antialiased;
        }
        
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        .progress-spine {
          display: none;
        }
        
        @media (min-width: 900px) {
          .progress-spine {
            display: flex;
          }
        }
        
        a { color: ${C.mid}; }
        
        strong { color: ${C.ink}; font-weight: 600; }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.cream}; }
        ::-webkit-scrollbar-thumb { background: ${C.dim}; border-radius: 3px; }
      `}</style>

      {/* Progress spine */}
      {showSpine && <ProgressSpine activeMove={activeMove} />}

      <div
        style={{
          maxWidth: 860,
          margin: "0 auto",
          padding: "0 20px 80px",
        }}
      >
        {/* ─── HEADER ──────────────────────────────────────────────────── */}
        <header style={{ paddingTop: 48, paddingBottom: 36 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 32,
            }}
          >
            <span
              style={{
                fontFamily: sans,
                fontSize: 12,
                fontWeight: 600,
                color: C.mid,
                letterSpacing: "0.04em",
              }}
            >
              kinship
            </span>
            <span style={{ color: C.dim, fontSize: 12 }}>·</span>
            <span style={{ fontSize: 12, color: C.dim }}>
              in collaboration with CAIS
            </span>
          </div>

          <div
            style={{
              opacity: 1,
              animation: "fadeUp 0.38s cubic-bezier(0.22,1,0.36,1) both",
            }}
          >
            <style>{`
              @keyframes fadeUp {
                from { opacity: 0; transform: translateY(12px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
            <h1
              style={{
                fontFamily: serif,
                fontSize: "clamp(26px, 5vw, 40px)",
                fontWeight: 600,
                color: C.ink,
                margin: "0 0 12px",
                lineHeight: 1.15,
              }}
            >
              Getting the most out of Claude
            </h1>
            <p
              style={{
                fontSize: 16,
                color: C.mid,
                margin: "0 0 8px",
                lineHeight: 1.5,
                maxWidth: 580,
              }}
            >
              A hands-on guide to running accreditation audits with Claude —
              no custom tool required.
            </p>
            <p
              style={{
                fontSize: 13.5,
                color: C.dim,
                margin: 0,
              }}
            >
              Work through this at your own pace. Every box is copy-paste
              ready. Change the words to fit the school in front of you.
            </p>
          </div>
        </header>

        {/* ─── INTRO PANEL ─────────────────────────────────────────────── */}
        <Section delay={80}>
          <div
            style={{
              borderTop: `1px solid ${C.dim}`,
              paddingTop: 28,
              marginBottom: 36,
            }}
          >
            <p
              style={{
                fontSize: 15,
                color: C.ink,
                lineHeight: 1.65,
                maxWidth: 660,
                margin: "0 0 24px",
              }}
            >
              You don't need a custom tool to audit with AI. The fastest,
              most durable path is to let Claude do the audit directly —
              configured with your standards, connected to a school's documents,
              and taught your process once so you never re-explain it. You stay
              in the loop; Claude is the copilot.
            </p>

            {/* Three-item row — varied layout */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 12,
                marginBottom: 20,
              }}
            >
              {[
                {
                  label: "Connect",
                  body: "Point Claude at a school's Google Drive, safely, for one session.",
                  icon: "↗",
                },
                {
                  label: "Configure",
                  body: "Load your standards and templates once so they're always there.",
                  icon: "⌗",
                },
                {
                  label: "Command",
                  body: "Teach Claude your audit process as a /command you reuse forever.",
                  icon: "/",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    border: `1px solid ${C.dim}`,
                    borderRadius: 8,
                    padding: "16px 18px",
                    background: i === 2 ? C.ink : C.cream,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "ui-monospace, monospace",
                        fontSize: 14,
                        color: i === 2 ? C.dim : C.mid,
                        opacity: 0.7,
                      }}
                    >
                      {item.icon}
                    </span>
                    <strong
                      style={{
                        fontSize: 14,
                        color: i === 2 ? C.cream : C.ink,
                      }}
                    >
                      {item.label}
                    </strong>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 13,
                      color: i === 2 ? C.dim : C.mid,
                      lineHeight: 1.5,
                    }}
                  >
                    {item.body}
                  </p>
                </div>
              ))}
            </div>

            <ComplianceNote>
              <strong>Team plan privacy, plainly stated.</strong> On the Team
              plan, Claude does not train on your prompts, responses, or
              documents. You never download or store a school's files — Claude
              reads them from the school's own Drive for the session and
              disconnects after. This mirrors the MOU you already sign with
              each school.{" "}
              <RefLink href={LINKS.teamPlan}>
                Anthropic pricing & plans
              </RefLink>
            </ComplianceNote>
          </div>
        </Section>

        {/* ─── MOVE 1 ──────────────────────────────────────────────────── */}
        <Section id="move-1" delay={0}>
          <div
            style={{
              borderTop: `2px solid ${C.ink}`,
              paddingTop: 28,
              marginBottom: 32,
            }}
          >
            <MoveHeader
              number="move 01"
              title="Connect Claude to a school's documents"
              why="This replaces the custom uploader. Claude reads from the school's own Drive — keeps nothing."
            />

            <Steps
              items={[
                <>
                  In Claude, open{" "}
                  <strong>Settings → Connectors</strong> and add{" "}
                  <strong>Google Drive</strong>. (If "add connector" is greyed
                  out, your admin — Henry — needs to enable connectors for the
                  Team plan. Flag this to him.)
                </>,
                <>
                  Authenticate with the <strong>school's</strong> account when
                  you have one (e.g. <code style={{ fontFamily: "ui-monospace, monospace", fontSize: 12, background: C.paper, padding: "1px 5px", borderRadius: 3 }}>bmontgomery@ucc.on.ca</code>),
                  not your own. Claude then only sees that Drive.
                </>,
                <>
                  To move to a different school:{" "}
                  <strong>disconnect</strong> the current Drive and{" "}
                  <strong>reconnect</strong> with the next school's account.
                  When Claude first connects, the school's Google admin may get
                  a notification — that's covered by your existing MOU.
                </>,
              ]}
            />

            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: 13, color: C.mid, margin: "0 0 4px" }}>
                First task — paste this when you're connected:
              </p>
              <PromptBlock id="p-inventory" label="inventory prompt">
                {PROMPT_INVENTORY}
              </PromptBlock>
            </div>

            <WhatGood>
              Claude returns a grouped inventory and a short list of gaps.
              That inventory is the starting point for every audit.
            </WhatGood>

            <div style={{ marginTop: 12 }}>
              <RefLink href={LINKS.connectors}>
                Claude Connectors — Help Center
              </RefLink>
            </div>
          </div>
        </Section>

        {/* ─── MOVE 2 ──────────────────────────────────────────────────── */}
        <Section id="move-2" delay={0}>
          <div
            style={{
              borderTop: `1px solid ${C.dim}`,
              paddingTop: 28,
              marginBottom: 32,
            }}
          >
            <MoveHeader
              number="move 02"
              title="Set the foundation"
              why="Skills work far better when Claude already knows who you are. This is the step people skip — and wonder why the output is generic."
            />

            <div
              style={{
                display: "grid",
                gap: 16,
                gridTemplateColumns: "1fr",
              }}
            >
              {/* Part A */}
              <Card>
                <div style={{ marginBottom: 8 }}>
                  <span
                    style={{
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: C.dim,
                    }}
                  >
                    Part A
                  </span>
                  <h3
                    style={{
                      fontFamily: serif,
                      fontSize: 16,
                      margin: "2px 0 4px",
                      color: C.ink,
                      fontWeight: 600,
                    }}
                  >
                    Tell Claude who you are
                  </h3>
                  <p style={{ fontSize: 13, color: C.mid, margin: 0 }}>
                    In{" "}
                    <strong>Settings → Profile / personal preferences</strong>,
                    paste something like this. It shapes every conversation.
                  </p>
                </div>
                <PromptBlock id="p-profile" label="personal profile">
                  {PROMPT_PROFILE}
                </PromptBlock>
              </Card>

              {/* Part B */}
              <Card style={{ borderColor: C.dim, opacity: 0.92 }}>
                <div style={{ marginBottom: 8 }}>
                  <span
                    style={{
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: C.dim,
                    }}
                  >
                    Part B — optional, lighter touch
                  </span>
                  <h3
                    style={{
                      fontFamily: serif,
                      fontSize: 16,
                      margin: "2px 0 4px",
                      color: C.ink,
                      fontWeight: 600,
                    }}
                  >
                    Create a project
                  </h3>
                  <p style={{ fontSize: 13, color: C.mid, margin: 0 }}>
                    Projects are useful but most people drift back to plain
                    chat. Treat this as a convenience, not the main event.
                  </p>
                </div>
                <PromptBlock id="p-project" label="project setup">
                  {PROMPT_PROJECT_SETUP}
                </PromptBlock>
                <div style={{ marginTop: 10 }}>
                  <RefLink href={LINKS.projects}>
                    What are Projects? — Help Center
                  </RefLink>
                </div>
              </Card>
            </div>

            <WhatGood>
              Once the framework and template are in the project, you stop
              re-uploading them every session.
            </WhatGood>
          </div>
        </Section>

        {/* ─── MOVE 3 ──────────────────────────────────────────────────── */}
        <Section id="move-3" delay={0}>
          <div
            style={{
              borderTop: `2px solid ${C.ink}`,
              paddingTop: 28,
              marginBottom: 32,
            }}
          >
            <MoveHeader
              number="move 03"
              title="Build your first skill"
              why="A skill is your audit process, written down once, triggered with /audit. This is what makes Claude feel like a copilot."
            />

            {/* Anatomy */}
            <Card style={{ marginBottom: 20 }}>
              <p
                style={{
                  fontSize: 13,
                  color: C.mid,
                  margin: "0 0 10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontSize: 10,
                }}
              >
                Anatomy of a skill
              </p>
              {[
                {
                  label: "A name",
                  body: 'What you type after the slash — e.g. /audit',
                },
                {
                  label: "A description",
                  body: "One line telling Claude what it does and when to use it. This is what makes it fire reliably.",
                },
                {
                  label: "The steps",
                  body: "The exact procedure you'd follow as a human, numbered, ending with how you want the result formatted.",
                },
              ].map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "8px 0",
                    borderBottom:
                      i < 2 ? `1px solid ${C.dim}` : "none",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "ui-monospace, monospace",
                      fontSize: 12,
                      color: C.mid,
                      minWidth: 90,
                      paddingTop: 2,
                    }}
                  >
                    {row.label}
                  </span>
                  <span
                    style={{ fontSize: 13, color: C.ink, lineHeight: 1.45 }}
                  >
                    {row.body}
                  </span>
                </div>
              ))}
            </Card>

            {/* 3a */}
            <div style={{ marginBottom: 20 }}>
              <h3
                style={{
                  fontFamily: serif,
                  fontSize: 17,
                  margin: "0 0 6px",
                  color: C.ink,
                }}
              >
                3a — Create the skill
              </h3>
              <p style={{ fontSize: 13, color: C.mid, margin: "0 0 4px" }}>
                Paste this and Claude writes the skill file for you.
              </p>
              <PromptBlock id="p-create-skill" label="meta-prompt — paste to create skill">
                {PROMPT_CREATE_SKILL}
              </PromptBlock>
            </div>

            {/* 3b — Skill file */}
            <div style={{ marginBottom: 20 }}>
              <h3
                style={{
                  fontFamily: serif,
                  fontSize: 17,
                  margin: "0 0 6px",
                  color: C.ink,
                }}
              >
                3b — The finished skill
              </h3>
              <p style={{ fontSize: 13, color: C.mid, margin: "0 0 4px" }}>
                This is what you're aiming at. Copy and save it as{" "}
                <code
                  style={{
                    fontFamily: "ui-monospace, monospace",
                    fontSize: 12,
                    background: C.paper,
                    padding: "1px 5px",
                    borderRadius: 3,
                  }}
                >
                  SKILL.md
                </code>
                .
              </p>
              <PromptBlock id="p-skill-file" variant="skill">
                {SKILL_FILE}
              </PromptBlock>
            </div>

            {/* 3c */}
            <div style={{ marginBottom: 16 }}>
              <h3
                style={{
                  fontFamily: serif,
                  fontSize: 17,
                  margin: "0 0 6px",
                  color: C.ink,
                }}
              >
                3c — Update the skill
              </h3>
              <p style={{ fontSize: 13, color: C.mid, margin: "0 0 4px" }}>
                A skill is never finished. Edit it as your process evolves —
                re-upload and the improvement is immediate.
              </p>
              <PromptBlock id="p-update-skill" label="update prompt">
                {PROMPT_UPDATE_SKILL}
              </PromptBlock>
            </div>

            <Card style={{ background: C.paper, marginTop: 16 }}>
              <p style={{ margin: 0, fontSize: 13, color: C.mid, lineHeight: 1.55 }}>
                <strong style={{ color: C.ink }}>Uploading a skill:</strong>{" "}
                zip the skill folder and add it in Claude under{" "}
                <strong>Settings → Capabilities → Skills</strong>. Skills
                need code execution turned on (you're on the Team plan, so
                you're covered). Each person on your team uploads their own
                copy.
              </p>
            </Card>

            <WhatGood>
              Your audit process lives in Claude, not in your head. Every
              session, every school — same rigour.
            </WhatGood>
          </div>
        </Section>

        {/* ─── MOVE 4 ──────────────────────────────────────────────────── */}
        <Section id="move-4" delay={0}>
          <div
            style={{
              borderTop: `1px solid ${C.dim}`,
              paddingTop: 28,
              marginBottom: 32,
            }}
          >
            <MoveHeader
              number="move 04"
              title="Chain your commands together"
              why="Once you have a few skills, a whole audit becomes a short sequence of commands. This is the copilot moment."
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 10,
                marginBottom: 20,
              }}
            >
              {[
                { cmd: "/intake", desc: "Inventory a newly connected school's Drive and flag missing self-studies or evidence." },
                { cmd: "/audit", desc: "Run the full standard-by-standard review." },
                { cmd: "/report", desc: "Write the findings into the CAIS Peer Review Report template." },
                { cmd: "/discovery", desc: "Prep questions for a school before a peer-review visit, based on their self-study." },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    border: `1px solid ${C.dim}`,
                    borderRadius: 8,
                    padding: "14px 16px",
                    background: C.cream,
                  }}
                >
                  <code
                    style={{
                      fontFamily: "ui-monospace, monospace",
                      fontSize: 14,
                      color: C.mid,
                      fontWeight: 600,
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    {item.cmd}
                  </code>
                  <p style={{ margin: 0, fontSize: 12.5, color: C.mid, lineHeight: 1.5 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 13, color: C.mid, margin: "0 0 6px" }}>
              Chained example — one prompt, three commands, two check-ins:
            </p>
            <PromptBlock id="p-chain" label="chained audit prompt">
              {PROMPT_CHAIN}
            </PromptBlock>

            <WhatGood>
              Three commands, two check-in points, one finished draft report —
              and you reviewed every step.
            </WhatGood>
          </div>
        </Section>

        {/* ─── MOVE 5 — TAKE HOME ──────────────────────────────────────── */}
        <Section id="move-5" delay={0}>
          <div
            style={{
              borderTop: `2px solid ${C.ink}`,
              paddingTop: 28,
              marginBottom: 32,
            }}
          >
            <MoveHeader
              number="move 05"
              title="Your take-home assignment"
              why={"You won't get through all of this in one call - that's the point. Try these on your own and bring questions to the next session."}
            />

            <div>
              {[
                <>
                  <strong>Connect</strong> Claude to a test school's Google
                  Drive (or your own, with a couple of sample docs) and run
                  the Move 1 inventory prompt.
                </>,
                <>
                  <strong>Set your profile</strong> using the Move 2 text,
                  tweaked in your own words.
                </>,
                <>
                  <strong>Create the /audit skill</strong> using the Move 3a
                  prompt. Upload it. Run it on one standard.
                </>,
                <>
                  <strong>Change something</strong> — use the Move 3c update
                  prompt, or invent your own change. Re-upload. Notice how
                  the output shifts.
                </>,
                <>
                  <strong>Stretch:</strong> ask Claude to draft a second skill
                  from scratch — a <code style={{ fontFamily: "ui-monospace, monospace", fontSize: 12, background: C.paper, padding: "1px 4px", borderRadius: 3 }}>/discovery</code> skill that reads a
                  school's self-study and generates the questions you'd ask on
                  a site visit. See if you can write the create-prompt
                  yourself.
                </>,
              ].map((item, i) => (
                <CheckItem
                  key={i}
                  number={i + 1}
                  checked={checklist[i]}
                  onToggle={() => toggleCheck(i)}
                >
                  {item}
                </CheckItem>
              ))}
            </div>

            <p
              style={{
                marginTop: 20,
                fontSize: 14,
                color: C.mid,
                fontStyle: "italic",
                lineHeight: 1.6,
                maxWidth: 560,
              }}
            >
              You're already further along than most — you've built in Lovable
              and you know your standards cold. This just points that same
              instinct at Claude.
            </p>
          </div>
        </Section>

        {/* ─── REFERENCES ───────────────────────────────────────────────── */}
        <Section delay={0}>
          <div
            style={{
              borderTop: `1px solid ${C.dim}`,
              paddingTop: 24,
              marginBottom: 32,
            }}
          >
            <p
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: C.dim,
                margin: "0 0 12px",
              }}
            >
              references
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px" }}>
              {[
                { label: "Claude Help Center", url: LINKS.helpHome },
                { label: "What are Projects?", url: LINKS.projects },
                { label: "Connectors overview", url: LINKS.connectors },
                { label: "Anthropic privacy policy", url: LINKS.privacy },
                { label: "Team plan details", url: LINKS.teamPlan },
              ].map((ref, i) => (
                <RefLink key={i} href={ref.url}>
                  {ref.label}
                </RefLink>
              ))}
            </div>
          </div>
        </Section>

        {/* ─── FOOTER ──────────────────────────────────────────────────── */}
        <footer
          style={{
            borderTop: `1px solid ${C.dim}`,
            paddingTop: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <p style={{ margin: 0, fontSize: 13, color: C.dim }}>
            Questions between sessions? Note them and bring them to your next
            call.
          </p>
          <span style={{ fontSize: 12, color: C.dim }}>
            <span style={{ color: C.mid, fontWeight: 600 }}>kinship</span>
            {" "}· in collaboration with CAIS
          </span>
        </footer>
      </div>
    </>
  );
}
