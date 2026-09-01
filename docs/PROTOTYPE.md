# The Signal — Interactive Prototype

## Identity
- **UUID:** 4vDzn0wx9KsWcFzYLVnK
- **Artifact URL:** https://quick.buildkinship.dev/artifact/4vDzn0wx9KsWcFzYLVnK
- **Slug:** the-signal
- **Branch:** prototype/the-signal-interactive-2026-09-01
- **Type:** other (interactive demo)
- **Requested by:** Azim

## What It Is
A full-fidelity port of "The Signal" adaptive alien-language learning demo into the Kinship prototype engine.

The Signal is a 38-node knowledge graph adaptive learning experience built by the Kinship team for Math Academy. Participants decode an unknown visual language — their path through the material adapts in real time based on what they demonstrate they know.

## What's Inside

### The Engine
- **38-node knowledge graph** with prerequisite edges (required + soft anyOf)
- **Adaptive routing**: retrieval scheduling, error-triggered remediation, shelving, near/structural/combinatorial transfer
- **Placement**: 3 opening questions establish a prior hypothesis, then everything tests whether that hypothesis holds
- **Mastery model**: distinct gain/loss rates per evidence type (recognition, discrimination, application, retrieval, transfer, generation, inference)

### The Activity Types
- `teach` — direct instruction with Continue
- `recognition` / `selection` — identify a symbol or choose the matching glyph
- `contrast` / `discrimination` — distinguish near-similar forms
- `inference` — work out a rule from examples
- `decode` — translate a glyph sequence to English
- `transfer` — apply a rule to a novel form
- `generation` — tap symbols to build a sequence
- `freebuild` — compose any valid message from your learned symbols (validated against a grammar)
- `remediation` — targeted repair after repeated errors

### The Results Screen
- Full knowledge graph visualisation (path/mastery/frontier modes)
- Node-by-node story: when each idea was met, whether it was inferred, shelved, retrieved, repaired
- 7 progressive reveals explaining adaptive learning concepts
- Facilitator mode: overlay 5 sample learner paths
- Personal message display: the sentence the user composed at the end

## Technical
- Ported from `TheSignal-v2_1.jsx` (source) and `the-signal-v2.html` (compiled bundle)
- Single `app/the-signal/page.tsx` — all engine, UI, data inline (~2500 lines)
- Uses `'use client'` — fully browser-side, no server state
- CSS via inline styles using the Signal palette (ink/mid/dim/cream/paper)
- Registered in `PrototypeRegistry.tsx` as `"the-signal"`

## Design Notes
- The Signal palette (ink `#3D1A4E`, cream `#F5F0E8`) is native to the demo, not Kinship brand
- `Shell` component caps width at 620px (standard) or 1000px (wide — results screen)
- `Wordmark` component renders "THE SIGNAL" logotype + right-aligned session label
- Knowledge graph SVG is viewBox 930×720, responsive with compact/full modes
- All animations via CSS classes (sig-arrive, sig-fade, sig-rise, sig-pulse, sig-frontier, sig-trace)
- Seeded PRNG (mulberry32) ensures reproducibility per session seed
