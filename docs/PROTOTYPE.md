# Prototype Brief: The Signal — Post-Experience Survey

**Firestore UUID:** `DjvgBW8cfemBlMT1Ycic`  
**Artifact URL:** `https://quick.buildkinship.dev/artifact/DjvgBW8cfemBlMT1Ycic`  
**Survey slug:** `the-signal-survey`  
**Branch:** `prototype/the-signal-survey-2026-09-01`

## Original Request (verbatim)

> based on the html and jsx files I have shared with you in this message. Create a survey prototype that collects the answers for us and the content of the survey is in these files I have shared with you. Try to stay true to what has been built here and incorporate the components we use in prototype to achieve a polished look. Good luck

## Context

The shared files are:
- `the-signal-v2.html` — a compiled React bundle of The Signal v2, an adaptive alien-language learning experience
- `TheSignal-v2_1.jsx` — the full source of The Signal (React component, ~2510 lines)

The Signal is a demo experience built for **Math Academy** — it walks participants through an adaptive learning journey using a fictional alien language with 38 knowledge-graph nodes. The experience uses a Bayesian mastery engine, placement tests, retrieval spacing, inference detection, misconception-aware error handling, and a results screen showing each learner's unique knowledge path.

The survey should be a **post-experience feedback form** triggered after someone completes The Signal.

## Visual Identity

The Signal uses:
- Colors: `ink: #3D1A4E`, `mid: #7A5590`, `dim: #B8A2C8`, `cream: #F5F0E8`, `paper: #FBF8F3`
- Typography: Iowan Old Style / Palatino (serif for headings), Inter (sans), monospace for labels
- Design language: minimal, clean, no shadows — border-only cards, subtle cream background

Use Kinship's `var(--kinship-ink)`, `var(--kinship-cream)` etc. which map closely to The Signal's palette.

## Survey Questions

The survey should collect post-experience feedback thematically aligned with The Signal's content about adaptive learning:

1. **Name** (short-text) — "What's your name?" — First name is fine
2. **Role** (single-choice) — "What's your role?"
   - School or district leader
   - Curriculum coordinator
   - Math teacher
   - Other educator
   - Parent
3. **Moment** (single-choice) — "When the system adjusted after your answer, what did you notice?"
   - It felt surprising — I didn't expect it to change
   - It felt natural — like talking with a good tutor
   - I wasn't sure what changed
   - I didn't notice any adjustment
4. **Emotional response** (rating 1–5) — "How engaged did you feel during The Signal?"
   - Low label: "Detached" / High label: "Fully absorbed"
5. **What resonated** (multiple-choice) — "Which part of the experience stuck with you most?"
   - Seeing my knowledge graph at the end
   - Working out rules nobody taught me
   - Getting a different result from the person next to me
   - The signal finally making sense mid-session
   - The misconception reveal (when an error changed what came next)
6. **Adaptive learning belief** (rating 1–10) — "After The Signal, how convinced are you that students learn better when the system adapts to them individually?"
   - Low: "Not convinced" / High: "Completely convinced"
7. **Biggest question** (long-text) — "What's the biggest question you have about bringing something like this to your school or students?"
8. **Next step interest** (single-choice) — "What would you most like to do next?"
   - See how Math Academy maps mathematical knowledge the same way
   - Understand the data it would give me as a teacher
   - Discuss how it would work in my classroom
   - Nothing right now — still processing
9. **Email** (email) — "Where should we follow up with you?" — Optional

## Prototype Type

`survey`

## Success Criteria

- Survey renders at `/artifact/DjvgBW8cfemBlMT1Ycic` and routes to `/artifact/DjvgBW8cfemBlMT1Ycic/survey/the-signal-survey`
- Each question appears one at a time, Typeform-style
- Visual style echoes The Signal: cream background, serif type, ink-colored primary actions
- Responses persist to Firestore via `/api/survey/the-signal-survey/submit`
- Thank-you screen feels like a natural continuation of The Signal experience
- Admin view accessible at `/survey-admin/the-signal-survey`
