# Slideshow Prototype Guide

> This guide is for coding agents building slide deck prototypes.
> Read `CLAUDE.md` first, then come back here.

---

## How Slide Decks Work

Slide decks are standard prototypes — registered in `PrototypeRegistry.tsx`, served at `/artifact/{UUID}`.

```
Hermes creates Firestore doc → branch created → you build the deck
  ↓
app/my-deck/page.tsx  (your page, on your branch)
  → registered in PrototypeRegistry.tsx as "my-deck"
  → served at /artifact/{UUID}
  → AnonAuthGate (silent anon auth for visitors)
```

---

## Quickstart

```tsx
// app/my-deck/page.tsx
"use client";
// needed for Slideshow (uses useState + localStorage)

import {
  Slideshow,
  SlideTitle,
  SectionLabel,
  SlideCardGrid,
  SlideCard,
  SlideDarkCard,
  ResponsiveSVG,
  AskBubble,
  type Slide,
} from "@/components/slides/slideshow";

const slides: Slide[] = [
  {
    id: "cover",
    dark: true,                        // ink bg, cream text
    label: "Cover",                    // shown top-left during presentation
    content: (
      <div className="flex flex-col items-center gap-8 w-full">
        <SlideTitle title="Deck Title" subtitle="Kinship · June 2026" dark />
      </div>
    ),
  },
  {
    id: "section-1",
    dark: false,                       // cream bg, ink text
    label: "1 · Key insight",
    content: (
      <div className="flex flex-col items-center gap-6 w-full">
        <SectionLabel>1 · Key insight</SectionLabel>
        <SlideTitle title="One clear idea per slide." size="sm" />
        <SlideCardGrid>
          <SlideCard>Supporting point A</SlideCard>
          <SlideCard>Supporting point B</SlideCard>
          <SlideCard>Supporting point C</SlideCard>
        </SlideCardGrid>
      </div>
    ),
  },
];

export default function Page() {
  return <Slideshow slides={slides} storageKey="my-deck-slide" />;
}
```

Then register it:
```typescript
// components/artifact/PrototypeRegistry.tsx
"my-deck": dynamic(() => import("@/app/my-deck/page")),
```

---

## The `Slide` Interface

```typescript
interface Slide {
  id: string;       // unique, used as React key
  content: ReactNode;
  dark?: boolean;   // true → ink bg + cream text; false/omit → cream bg + ink text
  label?: string;   // shown top-left — use format "N · Short title"
  notes?: string;   // presenter notes (not shown to audience — future feature)
}
```

---

## Built-in Slideshow Features — Do Not Re-Implement

The `Slideshow` component handles all of this automatically:

| Feature | Detail |
|---|---|
| **Keyboard nav** | ← → Space Home End |
| **Touch swipe** | 40px threshold, horizontal dominance |
| **Progress dots** | Collapses to "N / total" text on decks >12 slides |
| **Slide label** | Top-left corner (hidden on small phones) |
| **Dark/light per slide** | `slide.dark = true` → ink bg + cream text |
| **localStorage persistence** | Remembers position on reload — set unique `storageKey` |
| **Full-bleed height** | `100dvh` with `svh`/`vh` fallback — safe on iOS Safari |
| **Scrollable body on mobile** | Content never clips under nav bar |
| **Always-visible nav on touch** | Touch devices get persistent nav buttons |

---

## Layout Components

### `SlideTitle` — main heading for a slide
```tsx
<SlideTitle
  title="The main heading"
  subtitle="Optional subtitle or context"
  size="lg"       // "lg" (default, ~3–4rem) | "sm" (smaller, for content slides)
  dark={false}    // true if slide.dark = true — sets correct text color
/>
```

### `SectionLabel` — small uppercase label above a title
```tsx
<SectionLabel dark={false}>1 · Why this matters</SectionLabel>
// Renders as small tracked uppercase text
// Pass dark={true} on dark slides
```

### `SlideCardGrid` — responsive card grid (handles 1→2→3 columns)
```tsx
<SlideCardGrid cols={3}>         {/* cols: 2 | 3 (default 3) */}
  <SlideCard>Point A</SlideCard>
  <SlideCard>Point B</SlideCard>
  <SlideCard>Point C</SlideCard>
</SlideCardGrid>
// Use this instead of manual grid-cols-N — handles breakpoints automatically
```

### `SlideCard` — light card (for cream/light slides)
```tsx
<SlideCard className="optional-extra-class">
  <h3 className="font-semibold mb-2">Card heading</h3>
  <p className="text-sm text-[var(--kinship-mid)]">Card body text</p>
</SlideCard>
```

### `SlideDarkCard` — dark card (for dark slides)
```tsx
<SlideDarkCard>
  Content on a dark background
</SlideDarkCard>
```

### `ResponsiveSVG` — wraps SVG/animation to prevent mobile overflow
```tsx
<ResponsiveSVG maxWidth={480}>
  <svg ...>...</svg>
  {/* or a Framer Motion animation */}
</ResponsiveSVG>
// maxWidth clamps width on small screens
// Use for any visual that could overflow at 768px
```

### `AskBubble` — callout / pull quote / question prompt
```tsx
<AskBubble>
  What if every student had a personalised learning path?
</AskBubble>
// Renders as a styled speech-bubble callout
```

---

## Brand Logos

Pre-built SVG logos for common slides. Use these instead of images.

```tsx
import {
  ClaudeLogo,
  HermesLogo,
  NotionLogo,
  SlackLogo,
  ZoomLogo,
  GoogleLogo,
  GoogleDriveLogo,
} from "@/components/slides/brand-logos";

// All accept optional r (radius), cx, cy props
<ClaudeLogo r={28} />
<NotionLogo />
<SlackLogo r={20} />
```

---

## Animation on Slides

For per-slide entrance animations, use Framer Motion directly inside `content`:

```tsx
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as unknown as import("framer-motion").Transition["ease"];

content: (
  <div className="flex flex-col gap-6">
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <SlideTitle title="Animated heading" />
    </motion.div>
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
    >
      <SlideCardGrid>...</SlideCardGrid>
    </motion.div>
  </div>
)
```

**Rules:**
- Always cast ease arrays: `[0.22, 1, 0.36, 1] as unknown as Transition["ease"]`
- No `bounce` easing
- Stagger delays: `0.1s` per element is enough — don't over-animate
- Wrap SVG animations in `<ResponsiveSVG>` to prevent mobile overflow

---

## Deck Structure Patterns

### Classic narrative arc (most decks)
```
1. Cover (dark)              — title, subtitle, date
2. Agenda / overview (light) — what we'll cover
3–N. Content slides (alternate dark/light for rhythm)
N+1. Summary (dark)          — key takeaways
N+2. Next steps / CTA (light)
```

### Product demo / feature showcase
```
1. Cover (dark)
2. Problem statement (light)  — "Teachers spend X hours on..."
3. Solution overview (dark)   — product positioning
4–N. Feature slides (light)   — one feature per slide, screenshot or mockup
N+1. Results / proof (dark)   — data, testimonials
N+2. What's next (light)
```

### Data / research presentation
```
1. Cover (dark)
2. Key finding (dark)         — the one number that matters
3–N. Supporting data (light)  — one chart/stat per slide, Recharts or D3
N+1. Implications (dark)
N+2. Recommendations (light)
```

---

## Slide Content Rules

- **One idea per slide.** If you're adding a second point, make a second slide.
- **Dark and light slides should alternate** for visual rhythm — don't do 4 dark in a row.
- **Use `label` prop** on every slide — format: `"N · Short title"`. Helps navigation.
- **No lorem ipsum** — write actual content that tells the prototype's story.
- **No shadows on cards** — `SlideCard` already handles the correct border styling.
- **Images:** Use `<img>` with `object-fit: contain` inside `<ResponsiveSVG>`, or inline SVG. No external image URLs.

---

## Slideshow Checklist

- [ ] Registered in `PrototypeRegistry.tsx`
- [ ] `storageKey` is unique to this deck (prevents position collision with other decks)
- [ ] Every slide has a unique `id`
- [ ] Dark and light slides alternate for visual rhythm
- [ ] All SVG/animation content wrapped in `<ResponsiveSVG>` if it could overflow on mobile
- [ ] `'use client'` directive on the page file with explanatory comment
- [ ] Ease arrays cast: `as unknown as Transition["ease"]`
- [ ] No console errors on load
- [ ] Keyboard navigation tested (← →)
- [ ] Mobile layout tested at ~768px
