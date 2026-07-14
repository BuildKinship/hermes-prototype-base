# Prototype: Claude for Auditors

**Firestore UUID:** y9n8o4onv13Dox9ZkVLL
**Artifact URL:** https://quick.buildkinship.dev/artifact/y9n8o4onv13Dox9ZkVLL
**Branch:** prototype/claude-for-auditors-2026-07-14
**Type:** other (guided training artefact)

## Original request
Create a prototype that is a unique web artefact — not really a slideshow but sort of like one. Training a client on Claude and how to use it for accreditation audits. The spec doc has thorough content. Should be organized, mobile-friendly, with subtle animations, and include reference links to Anthropic docs. This is a specific guide to Claude for auditors — not generic.

## Scope
- Single-page scrollable guide, 5 "moves" (Connect → Configure → Command → Chain → Take home)
- Kinship design system: Ink/Mid/Dim/Cream palette, no shadows, no gradients
- Animated entrance: FadeUp on section scroll-in, respects prefers-reduced-motion
- Copy-to-clipboard on every prompt block (the core interaction)
- Progress spine (left margin dots, desktop only)
- Interactive checklist for take-home assignment
- Verified Anthropic help links

## Success criteria
- All 5 moves load with correct content from spec
- Copy buttons work on all prompt blocks
- SKILL.md displays in dark "code" style
- Checklist items are toggleable
- Mobile-friendly (max-width layout, no fixed widths)
- Kinship palette only, no pure black/white

## Design decisions
- Dark card for the "Command" intro item (ink background) to vary density
- Skill file uses dark (#2a1038) code panel style to visually distinguish from prompts
- Progress spine hides on mobile (< 900px) — too cramped
- `why` line under each move header in Mid colour for hierarchy
- Compliance note uses bordered `${C.mid}11` tint — informational, not alarming
