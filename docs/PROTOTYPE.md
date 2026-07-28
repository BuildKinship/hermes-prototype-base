# Prototype Brief — Claude for CAIS: HTML Artifacts & Teacher Skills

**Firestore UUID:** RSs9QdUEw8OzQBpSKW6B  
**Artifact URL:** https://quick.buildkinship.dev/artifact/RSs9QdUEw8OzQBpSKW6B  
**Branch:** prototype/brenda-claude-training-2026-07-28  
**Type:** other (scrollable guide)  
**Requester:** Azim (U0AQ7SJRQ93) — for Brenda Montgomery at CAIS

## Original Request (verbatim)
"Please create a prototype that I can share with Brenda from CAIS in order to teach her about HTML artifacts and share claude for teachers skills based on this markdown file."

## Scope
Build `app/brenda-claude-training/page.tsx` — a polished, mobile-first scrollable training guide for Brenda Montgomery, Director of Accreditation at CAIS.

The guide should:
1. Explain the core concept: Chat vs. HTML artifacts (when to use each)
2. Surface the Claude for Teachers GitHub skill repo info
3. Walk through 3 hands-on exercises with copyable prompts
4. Include the key takeaways at the end

## Design requirements
- Off-white background, warm minimal styling matching the markdown doc's aesthetic
- Mobile-first, thumb-scrollable on 380px
- Sticky top progress bar showing section position
- FadeUp entrance animations on sections as user scrolls (IntersectionObserver)
- Copyable prompt blocks with "Copy" button that shows ✓ on success
- Section anchor links in a sticky side nav on desktop (hidden on mobile)
- Numbered exercise cards with visual distinction

## Success criteria
- Page loads cleanly, no blank screens
- All "Copy" buttons work
- Looks polished enough to share externally with a CAIS director
- Mobile layout works on 380px
