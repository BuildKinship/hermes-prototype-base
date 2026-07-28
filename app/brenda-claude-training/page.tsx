"use client";
// Interactive scrollable training guide — no server state, no API calls

import React, { useState, useEffect, useRef, type ReactNode } from "react";

// ─── Copy button ────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        background: copied ? "var(--cft-green)" : "var(--cft-ink)",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        padding: "5px 12px",
        fontSize: "12px",
        fontFamily: "inherit",
        cursor: "pointer",
        transition: "background 0.2s",
        whiteSpace: "nowrap",
      }}
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

// ─── Prompt block ───────────────────────────────────────────────────────────
function PromptBlock({ children, label }: { children: string; label?: string }) {
  return (
    <div style={{ marginTop: "16px", marginBottom: "8px" }}>
      {label && (
        <div
          style={{
            fontSize: "11px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--cft-mid)",
            marginBottom: "6px",
          }}
        >
          {label}
        </div>
      )}
      <div style={{ position: "relative" }}>
        <pre
          style={{
            background: "var(--cft-prompt-bg)",
            border: "1px solid var(--cft-border)",
            borderRadius: "8px",
            padding: "16px 56px 16px 16px",
            fontSize: "13px",
            lineHeight: 1.6,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
            color: "var(--cft-ink)",
            margin: 0,
            overflowX: "auto",
          }}
        >
          {children}
        </pre>
        <CopyButton text={children} />
      </div>
    </div>
  );
}

// ─── FadeUp section wrapper ─────────────────────────────────────────────────
function FadeSection({ children, id }: { children: ReactNode; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      id={id}
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      {children}
    </div>
  );
}

// ─── Section heading ────────────────────────────────────────────────────────
function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: "clamp(20px, 4vw, 26px)",
        fontWeight: 700,
        color: "var(--cft-ink)",
        marginBottom: "16px",
        marginTop: 0,
        lineHeight: 1.25,
      }}
    >
      {children}
    </h2>
  );
}

// ─── Callout box ─────────────────────────────────────────────────────────────
function Callout({ children, accent = false }: { children: ReactNode; accent?: boolean }) {
  return (
    <div
      style={{
        background: accent ? "var(--cft-accent-bg)" : "var(--cft-well)",
        border: `1px solid ${accent ? "var(--cft-accent-border)" : "var(--cft-border)"}`,
        borderLeft: accent ? "4px solid var(--cft-accent)" : "4px solid var(--cft-border)",
        borderRadius: "8px",
        padding: "16px 20px",
        marginBottom: "20px",
        fontSize: "14px",
        lineHeight: 1.65,
        color: "var(--cft-ink)",
      }}
    >
      {children}
    </div>
  );
}

// ─── Exercise card ───────────────────────────────────────────────────────────
function ExerciseLabel({ n, title }: { n: number; title: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: "var(--cft-ink)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia, serif",
          fontSize: "18px",
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {n}
      </div>
      <div
        style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontSize: "clamp(18px, 3.5vw, 22px)",
          fontWeight: 700,
          color: "var(--cft-ink)",
          lineHeight: 1.25,
        }}
      >
        {title}
      </div>
    </div>
  );
}

// ─── Step list ──────────────────────────────────────────────────────────────
function Steps({ items }: { items: ReactNode[] }) {
  return (
    <ol style={{ paddingLeft: "0", margin: "0 0 20px", listStyle: "none" }}>
      {items.map((item, i) => (
        <li
          key={i}
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "10px",
            alignItems: "flex-start",
            fontSize: "14px",
            lineHeight: 1.65,
            color: "var(--cft-ink)",
          }}
        >
          <span
            style={{
              minWidth: "22px",
              height: "22px",
              borderRadius: "50%",
              background: "var(--cft-border)",
              color: "var(--cft-mid)",
              fontSize: "11px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "2px",
              flexShrink: 0,
            }}
          >
            {i + 1}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}

// ─── Takeaway card ──────────────────────────────────────────────────────────
function TakeawayCard({ icon, heading, body }: { icon: string; heading: string; body: string }) {
  return (
    <div
      style={{
        background: "var(--cft-well)",
        border: "1px solid var(--cft-border)",
        borderRadius: "10px",
        padding: "18px 20px",
        marginBottom: "12px",
        display: "flex",
        gap: "14px",
        alignItems: "flex-start",
      }}
    >
      <span style={{ fontSize: "22px", flexShrink: 0, marginTop: "1px" }}>{icon}</span>
      <div>
        <div
          style={{
            fontSize: "14px",
            fontWeight: 700,
            color: "var(--cft-ink)",
            marginBottom: "4px",
          }}
        >
          {heading}
        </div>
        <div style={{ fontSize: "13px", lineHeight: 1.6, color: "var(--cft-mid)" }}>
          {body}
        </div>
      </div>
    </div>
  );
}

// ─── Divider ────────────────────────────────────────────────────────────────
function Divider() {
  return (
    <hr
      style={{
        border: "none",
        borderTop: "1px solid var(--cft-border)",
        margin: "40px 0",
      }}
    />
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function BrendaClaudeTraining() {
  const [activeSection, setActiveSection] = useState("intro");

  // Section anchors for desktop side nav
  const sections = [
    { id: "intro", label: "Overview" },
    { id: "chat-vs-html", label: "Chat vs. HTML" },
    { id: "teacher-skills", label: "Claude for Teachers" },
    { id: "exercise-1", label: "Exercise 1 — Research" },
    { id: "exercise-2", label: "Exercise 2 — Build a form" },
    { id: "exercise-3", label: "Exercise 3 — Presentation" },
    { id: "takeaways", label: "Key takeaways" },
  ];

  // Track active section via scroll
  useEffect(() => {
    const handleScroll = () => {
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i].id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i].id);
          return;
        }
      }
      setActiveSection("intro");
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <style>{`
        :root {
          --cft-ink: #1a1a1a;
          --cft-mid: #666;
          --cft-dim: #999;
          --cft-cream: #f8f6f1;
          --cft-border: #ddd;
          --cft-well: #f4f2ed;
          --cft-prompt-bg: #f9f8f5;
          --cft-accent: #b35c00;
          --cft-accent-bg: #fff8f0;
          --cft-accent-border: #e8c090;
          --cft-green: #2a7a3b;
        }
        * { box-sizing: border-box; }
        body { margin: 0; background: var(--cft-cream); }
        .cft-layout {
          display: flex;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .cft-sidenav {
          width: 200px;
          flex-shrink: 0;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          padding: 40px 20px 40px 0;
          display: none;
        }
        @media (min-width: 900px) {
          .cft-sidenav { display: block; }
        }
        .cft-sidenav-item {
          display: block;
          padding: 7px 12px;
          border-left: 2px solid transparent;
          font-size: 13px;
          color: var(--cft-mid);
          text-decoration: none;
          cursor: pointer;
          transition: color 0.15s, border-color 0.15s;
          line-height: 1.4;
          background: none;
          border-right: none;
          border-top: none;
          border-bottom: none;
          text-align: left;
          width: 100%;
          font-family: inherit;
        }
        .cft-sidenav-item.active {
          color: var(--cft-ink);
          border-left-color: var(--cft-ink);
          font-weight: 600;
        }
        .cft-sidenav-item:hover {
          color: var(--cft-ink);
        }
        .cft-main {
          flex: 1;
          max-width: 680px;
          padding: 48px 24px 80px;
          margin: 0 auto;
        }
        @media (min-width: 900px) {
          .cft-main { margin: 0 0 0 0; padding: 48px 40px 80px 32px; }
        }
        p { margin: 0 0 16px; font-size: 15px; line-height: 1.7; color: var(--cft-ink); }
        strong { font-weight: 700; }
        a { color: var(--cft-accent); text-decoration: underline; }
        code {
          background: var(--cft-well);
          border: 1px solid var(--cft-border);
          border-radius: 4px;
          padding: 1px 5px;
          font-size: 12.5px;
          font-family: 'SF Mono', 'Fira Code', monospace;
        }
      `}</style>

      <div className="cft-layout">
        {/* Side nav — desktop only */}
        <nav className="cft-sidenav">
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--cft-dim)",
              marginBottom: "16px",
              paddingLeft: "12px",
            }}
          >
            Contents
          </div>
          {sections.map((s) => (
            <button
              key={s.id}
              className={`cft-sidenav-item ${activeSection === s.id ? "active" : ""}`}
              onClick={() => scrollTo(s.id)}
            >
              {s.label}
            </button>
          ))}
        </nav>

        {/* Main content */}
        <main className="cft-main">

          {/* Header */}
          <FadeSection id="intro">
            <div
              style={{
                borderBottom: "1px solid var(--cft-border)",
                paddingBottom: "32px",
                marginBottom: "40px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "var(--cft-dim)",
                  marginBottom: "12px",
                }}
              >
                Claude Practice Guide · From Azim · July 28, 2026
              </div>
              <h1
                style={{
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontSize: "clamp(26px, 6vw, 38px)",
                  fontWeight: 700,
                  color: "var(--cft-ink)",
                  margin: "0 0 16px",
                  lineHeight: 1.15,
                }}
              >
                Claude + HTML Artifacts
              </h1>
              <p
                style={{
                  fontSize: "17px",
                  color: "var(--cft-mid)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                For Brenda Montgomery, CAIS — a short practice plan with three exercises.
                By the end, you'll understand exactly when to ask Claude for an HTML page
                instead of a chat answer, and why it matters for your accreditation work.
              </p>
            </div>
          </FadeSection>

          {/* Chat vs HTML */}
          <FadeSection id="chat-vs-html">
            <SectionHeading>Chat vs. HTML — the short version</SectionHeading>
            <p>
              Claude can respond in two fundamentally different ways. Knowing which one to
              ask for is the single most useful thing you can take from today.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
                marginBottom: "24px",
              }}
            >
              {/* Chat */}
              <div
                style={{
                  background: "var(--cft-well)",
                  border: "1px solid var(--cft-border)",
                  borderRadius: "10px",
                  padding: "18px",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--cft-mid)",
                    marginBottom: "10px",
                  }}
                >
                  💬 Chat answer
                </div>
                <ul
                  style={{
                    paddingLeft: "18px",
                    margin: 0,
                    fontSize: "13px",
                    lineHeight: 1.65,
                    color: "var(--cft-ink)",
                  }}
                >
                  <li>Good for thinking, drafting, explaining</li>
                  <li>You get text back</li>
                  <li style={{ marginTop: "6px", color: "var(--cft-mid)" }}>
                    Ask: <em>"Summarize this document"</em>
                  </li>
                </ul>
              </div>
              {/* HTML */}
              <div
                style={{
                  background: "var(--cft-accent-bg)",
                  border: "1px solid var(--cft-accent-border)",
                  borderRadius: "10px",
                  padding: "18px",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--cft-accent)",
                    marginBottom: "10px",
                  }}
                >
                  🌐 HTML artifact
                </div>
                <ul
                  style={{
                    paddingLeft: "18px",
                    margin: 0,
                    fontSize: "13px",
                    lineHeight: 1.65,
                    color: "var(--cft-ink)",
                  }}
                >
                  <li>Good when the answer has <em>structure</em></li>
                  <li>You get a real web page to click around in</li>
                  <li style={{ marginTop: "6px", color: "var(--cft-mid)" }}>
                    Ask: <em>"Build me an HTML page"</em>
                  </li>
                </ul>
              </div>
            </div>

            <Callout accent>
              <strong>The magic phrase:</strong> <code>"Build me an HTML page as an artifact"</code>{" "}
              (or <code>"...as a single HTML file"</code>). Claude won&apos;t reach for
              HTML on its own for something like a form — you have to ask directly.
            </Callout>

            <p>
              <strong>When HTML wins:</strong> a form to fill in, a checklist to click
              through, a report to read on your phone, something you want to send to someone
              else. It&apos;s a real web page Claude builds inside the chat window — it can
              have checkboxes, inputs, buttons, and it can hand you back text to copy.
            </p>
          </FadeSection>

          <Divider />

          {/* Claude for Teachers */}
          <FadeSection id="teacher-skills">
            <SectionHeading>Claude for Teachers — what&apos;s actually in it</SectionHeading>
            <p>
              You asked where the Claude for Teachers skills live and what&apos;s in them.
              Here it is, yours to keep and share.
            </p>

            <div
              style={{
                background: "var(--cft-well)",
                border: "1px solid var(--cft-border)",
                borderRadius: "10px",
                padding: "20px 24px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--cft-mid)",
                  marginBottom: "14px",
                }}
              >
                Links
              </div>
              <div style={{ marginBottom: "10px" }}>
                <a
                  href="https://github.com/anthropics/k12-teacher-skills"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "14px", fontWeight: 600 }}
                >
                  github.com/anthropics/k12-teacher-skills
                </a>
                <div style={{ fontSize: "13px", color: "var(--cft-mid)", marginTop: "2px" }}>
                  The actual skill files — Apache-2.0 licensed, free to copy and adapt
                </div>
              </div>
              <div>
                <a
                  href="https://claude.com/solutions/teachers"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "14px", fontWeight: 600 }}
                >
                  claude.com/solutions/teachers
                </a>
                <div style={{ fontSize: "13px", color: "var(--cft-mid)", marginTop: "2px" }}>
                  Product page — overview and sign-up
                </div>
              </div>
            </div>

            <p>
              <strong>Two skills, not twenty.</strong> Worth knowing before the hype runs
              away with the picture:
            </p>

            <div
              style={{
                borderLeft: "3px solid var(--cft-border)",
                paddingLeft: "20px",
                marginBottom: "20px",
              }}
            >
              <div style={{ marginBottom: "16px" }}>
                <div
                  style={{ fontSize: "15px", fontWeight: 700, color: "var(--cft-ink)", marginBottom: "4px" }}
                >
                  k12-lesson-planning
                </div>
                <div style={{ fontSize: "14px", color: "var(--cft-mid)", lineHeight: 1.6 }}>
                  Builds classroom-ready, standards-aligned lesson plans. Optionally aligned
                  to a teacher&apos;s own curriculum. Works with or without the Learning
                  Commons Knowledge Graph connector.
                </div>
              </div>
              <div>
                <div
                  style={{ fontSize: "15px", fontWeight: 700, color: "var(--cft-ink)", marginBottom: "4px" }}
                >
                  k12-lesson-differentiation
                </div>
                <div style={{ fontSize: "14px", color: "var(--cft-mid)", lineHeight: 1.6 }}>
                  Takes an existing lesson and produces tiered versions (below / at / above
                  proficiency) while keeping the core content consistent.
                </div>
              </div>
            </div>

            <Callout>
              <strong>The part most relevant to you:</strong> the repo includes an{" "}
              <strong>evals folder</strong> — Anthropic&apos;s framework for testing whether
              a skill actually works. This is the same problem as your audit: how do you know
              the output is any good? Worth a read even if you never use the lesson skills.
            </Callout>

            <p>
              The skills were co-developed with Learning Commons and are written to lean on a
              Learning Commons Knowledge Graph connector that ships with Claude for Teachers
              (US standards). They still work without it — you&apos;d just adapt them.
            </p>

            <p>
              <strong>If you want to write your own skill:</strong> read the two{" "}
              <code>SKILL.md</code> files in the <code>plugin/</code> folder of the repo.
              That&apos;s the best free lesson in skill-writing available right now.
            </p>
          </FadeSection>

          <Divider />

          {/* Exercise 1 */}
          <FadeSection id="exercise-1">
            <ExerciseLabel n={1} title="Run a real Research task" />
            <p>
              <strong>Goal:</strong> see what deep Research actually does, and get a genuinely
              useful artifact out of it for the CAIS framework.
            </p>

            <Steps
              items={[
                "Start a new chat.",
                <>Click the <strong>+</strong> button in the message box and turn on <strong>Research</strong>. Without it, Claude does a few quick searches. With it, Claude goes off and reads hundreds of sources.</>,
                "Paste the prompt below and send it.",
                "Claude will ask a couple of clarifying questions first. Answer briefly — you don't need to write an essay.",
                <><strong>Walk away.</strong> This takes 20–40 minutes. That's normal, not broken. Come back later.</>,
              ]}
            />

            <Callout>
              <strong>Heads up:</strong> Research burns through usage quickly. If you hit
              your limit mid-way, that&apos;s the premium-seat conversation we had — not
              you doing something wrong.
            </Callout>

            <PromptBlock label="Full prompt">{`I'm the Director of Accreditation at CAIS (Canadian Accredited Independent Schools).
I want to understand how independent and private schools actually think and feel about
accreditation and external auditing — the view from inside the schools, not what
accrediting bodies say about themselves.

Research and report on:

1. What school leaders (heads of school, board chairs, self-study leads) say is genuinely
   valuable about going through accreditation.
2. What they complain about — time burden, cost, duplication of effort, "checkbox"
   fatigue, evidence-gathering pain, reviewer inconsistency.
3. The common questions and objections schools raise before starting a self-study or
   hosting a visiting team.
4. How accreditation is evolving — especially anything about evidence quality vs. evidence
   existence, continuous improvement models, and the use of AI in self-study or review.
5. Where the published thinking is thin, contested, or purely anecdotal.

Focus on Canada first. Then use US, UK, and international systems (CIS, IB, regional US
accreditors) for comparison and contrast. Prefer school associations, accrediting bodies,
education research, and documents schools have published themselves (self-studies,
strategic plans, board materials).

Cite your sources throughout.

End with a one-page plain-language summary called "What this means for a Canadian
accreditation program" — written for someone who has to act on it, not someone who
enjoys reading research.`}</PromptBlock>

            <p style={{ color: "var(--cft-mid)", fontSize: "14px" }}>
              If that feels like too much, here&apos;s a shorter version that shows you the
              same thing:
            </p>

            <PromptBlock label="Shorter version">{`Research what Canadian independent school leaders actually think about accreditation and
external audits — what they find valuable, what they find burdensome, and what they'd
change. Cover Canada first, then compare to US and international systems. Cite sources,
and finish with a short plain-language takeaway for someone running an accreditation
program.`}</PromptBlock>

            <Callout>
              <strong>What you&apos;ll get:</strong> a long read-only report. You are not
              expected to read all of it — that&apos;s the point of Exercise 3, where we
              turn it into something you&apos;d actually want to look at.
            </Callout>
          </FadeSection>

          <Divider />

          {/* Exercise 2 */}
          <FadeSection id="exercise-2">
            <ExerciseLabel n={2} title="While you wait: build an interactive HTML page" />
            <p>
              This is the exercise that answers &ldquo;I still don&apos;t understand HTML
              versus chat.&rdquo;
            </p>
            <p>
              <strong>Goal:</strong> get Claude to build a clickable page that collects your
              input and hands you back a prompt. You copy that prompt into chat, and Claude
              picks up exactly where the page left off.{" "}
              <strong>Page → prompt → chat → page.</strong> That loop is the whole trick.
            </p>

            <Steps
              items={[
                <><strong>Open a second, separate chat.</strong> Leave the Research one running. Don&apos;t touch it.</>,
                "Research off for this one — you don't need it.",
                "Paste the prompt below.",
                "Claude will build a page on the right side of your screen. Click around in it. Check things, change dropdowns, type notes.",
                "Watch the box at the bottom of the page change as you click.",
                <><strong>Hit Copy prompt</strong>, paste it into the chat, and send it.</>,
                "Read what comes back. Then try the follow-up prompt below.",
              ]}
            />

            <PromptBlock label="Main prompt">{`Build me a single interactive HTML page as an artifact. It's a pre-audit readiness check
for accreditation evidence documents.

The page should have:

- Text fields for school name and reviewer name
- A checklist of evidence document types, each with a checkbox: governance bylaws,
  strategic plan, child protection policy, whistleblower policy, parent permission and
  consent forms, off-site outing risk reviews, staff handbook, board minutes
- Next to each item, a dropdown with these options: "opens and reads fine", "link is
  broken", "no access / permission denied", "not provided at all"
- A 1-to-4 selector for my overall confidence that this school's evidence is ready to audit
- One free-text box for notes

At the bottom of the page, a box that updates live as I click, assembling everything I've
selected into a plain-English prompt I can paste back to you in chat. Give it a
"Copy prompt" button.

The generated prompt should tell you: which documents are readable, which are blocked and
why, my confidence rating, and my notes — and then ask you to tell me whether this audit
is ready to run, what specifically I need to chase down first, and who I'd need to chase
it from.

Keep the design plain and readable — off-white background, thin borders, no gradients.
Just build it, no long explanation needed.`}</PromptBlock>

            <PromptBlock label="Follow-up prompt (paste this after the generated prompt)">{`Now update the HTML page to show your verdict at the top — a clear ready / not ready
banner, the blockers listed out, and a short "who to chase" list. Keep the form below it
so I can still change my answers.`}</PromptBlock>

            <Callout accent>
              <strong>Why this matters for CAIS:</strong> notice what happened — you never
              wrote a single instruction by hand after the first prompt. You clicked, and the
              page wrote the prompt for you — precisely, in the exact structure Claude needs,
              with nothing forgotten.
              <br />
              <br />
              That&apos;s the pattern for your diagnostic skill. The page is the intake. The
              prompt it generates is the handoff. Claude does the reasoning. And because the
              intake is a page instead of a conversation, it&apos;s{" "}
              <strong>repeatable</strong> — same eight documents, same four options, every
              school, every reviewer. Exactly the consistency problem you described.
            </Callout>

            <p style={{ fontSize: "14px", color: "var(--cft-mid)" }}>
              <strong>What the page should end up containing:</strong> header with school +
              reviewer fields; 8-row evidence checklist (checkbox + document name + status
              dropdown); 1–4 confidence selector with labelled levels; one notes box; a live
              prompt at the bottom with a copy button. Nothing else — no login, no saving,
              no animation.
            </p>
          </FadeSection>

          <Divider />

          {/* Exercise 3 */}
          <FadeSection id="exercise-3">
            <ExerciseLabel n={3} title="Turn the research into a presentation" />
            <p>
              Once the Research task from Exercise 1 has finished, go back to that chat and
              continue in it. Claude still has the whole report in context there.
            </p>
            <p>
              <strong>Goal:</strong> take 40 pages you&apos;d never read and get a
              mobile-friendly page you&apos;d actually send to Anna or Patrick.
            </p>

            <PromptBlock label="Prompt">{`Take the research report above and turn it into a single self-contained HTML presentation
as an artifact.

Audience: me, as the stakeholder who has to decide whether to act on this. Present it as
if you're building my buy-in — which means the deck has to stand entirely on its own,
with nobody there to narrate it.

Requirements:

- One HTML file, all styling and scripts inline, opens in any browser with no dependencies.
- Mobile-first. It should read as a single thumb-scrollable column on a phone at about
  380px wide, and use the extra room sensibly on a laptop.
- Detailed and end-to-end: context → the problem → what the research found → what it means
  for us specifically → the recommendation → what happens next. Assume I have no prior
  context and nobody to ask. Do not do one-word slides.
- Where a section needs a visual to make sense — a process, a comparison, a before-and-after,
  a flow — draw a simple SVG diagram instead of writing more text.
- Link out for depth. Next to each significant claim, add a small labelled link to the real
  source, and finish with a "Further reading" section collecting the important ones. Only use
  URLs that actually appeared in your research. Do not invent, guess, or reconstruct a link —
  a dead link is worse than no link.
- Design: plain and warm. Off-white background, thin borders instead of drop shadows, flat
  colours, no gradients, no neon. It should look like a well-organized report, not a startup
  pitch deck.

Before you build anything, show me the section outline as one short list and wait for me
to say go.`}</PromptBlock>

            <Callout accent>
              <strong>That last line matters:</strong> &ldquo;Before you build anything, show
              me the section outline as one short list and wait for me to say go.&rdquo;
              <br />
              <br />
              Make this a habit. It&apos;s cheaper to fix an outline than a finished deck,
              and it costs you far less usage.
            </Callout>
          </FadeSection>

          <Divider />

          {/* Takeaways */}
          <FadeSection id="takeaways">
            <SectionHeading>Key things to carry forward</SectionHeading>

            <TakeawayCard
              icon="🌐"
              heading={'"Build me an HTML page/artifact" is the magic phrase'}
              body="Claude won't reach for it on its own for something like a form. Ask directly, and you get a real interactive page."
            />
            <TakeawayCard
              icon="📋"
              heading="Ask for the outline first on anything long"
              body="Saves rework and usage. One line at the end of your prompt: 'Show me the section outline and wait for me to say go.'"
            />
            <TakeawayCard
              icon="🔁"
              heading="A page can hand you a prompt"
              body="That's the loop from Exercise 2 — and it's the answer to almost any 'how do I give Claude consistent, structured input' problem."
            />
            <TakeawayCard
              icon="🔍"
              heading="Research off by default"
              body="It's slow and expensive. Turn it on when you actually want 200 sources read. Off for everything else."
            />
            <TakeawayCard
              icon="💬"
              heading="Separate chats for separate jobs"
              body="Don't run a diagnostic build inside the research chat. Context gets muddy and you burn usage re-reading things."
            />
            <TakeawayCard
              icon="🔗"
              heading="Real links only — always"
              body="Always tell Claude not to invent URLs. It will otherwise produce plausible dead ones. Add: 'Do not invent, guess, or reconstruct a link.'"
            />

            <div
              style={{
                marginTop: "40px",
                padding: "28px",
                background: "var(--cft-ink)",
                borderRadius: "12px",
                color: "#fff",
              }}
            >
              <div
                style={{
                  fontFamily: "Georgia, serif",
                  fontSize: "17px",
                  fontWeight: 700,
                  marginBottom: "10px",
                }}
              >
                Questions? Barge in.
              </div>
              <div style={{ fontSize: "14px", lineHeight: 1.7, color: "#ccc" }}>
                Anything sticks or breaks, that&apos;s what it&apos;s for. — Azim
              </div>
            </div>
          </FadeSection>

        </main>
      </div>
    </>
  );
}
