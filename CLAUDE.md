# Hermes Prototype Base — Coding Harness

> This file is your operating manual. Read it fully before touching any code.
> Every prototype is a **branch off `main`**. You build on top of this base — you never modify `main`.

---

## What This Repo Is

A Next.js 15 (App Router) prototype engine for Kinship. When Hermes receives a prototype request, it:
1. Creates a branch (`prototype/<slug>-<YYYY-MM-DD>`)
2. Delegates work to a coding agent (you) on that branch
3. Pushes → Vercel auto-builds a preview URL
4. Hermes shortens the URL and returns it to the requester

**This is a frontend-only prototype system.** No databases. No external APIs. No Redis. No auth systems.
All data is mocked in `mock/` — simple TypeScript objects and arrays.

---

## Project Structure

```
app/                  Next.js App Router pages
  page.tsx            Homepage (DO NOT MODIFY on feature branches)
  globals.css         Kinship design tokens + base styles (DO NOT MODIFY)
  layout.tsx          Root layout

components/
  kinship/            Kinship-branded UI components
    stat-card.tsx     StatCard, StatGrid
    student.tsx       StudentAvatar, StudentStatusIndicator
    accuracy-ring.tsx AccuracyRing (SVG progress circle)
    badges.tsx        SubjectBadge, PlatformBadge, SubjectDot

  slides/             Presentation primitives
    slideshow.tsx     Slideshow engine, SlideTitleLayout, SlideContentLayout

  animations/         Motion primitives
    fade.tsx          FadeUp, Stagger (Framer Motion wrappers)

  three/              3D scene helpers (add your own here)

lib/
  utils.ts            cn(), deterministicColor(), accuracyColor(), slugify()

mock/                 ALL mock data lives here
  (add your data files here — e.g. mock/students.ts)

docs/
  PROTOTYPE.md        Prototype-specific context (set by Hermes before agent runs)
```

---

## The Golden Rules

### 1. Mock data ONLY
```ts
// ✅ Correct — data in mock/
import { students } from "@/mock/students";

// ❌ Wrong — never fetch from real APIs
fetch("https://api.kinship.io/...")
// ❌ Wrong — never connect to DB
import { db } from "@/packages/db"
// ❌ Wrong — never use env vars for external services
process.env.DATABASE_URL
```

### 2. Follow the Kinship design system

**Colors:**
```ts
// Use CSS vars — never hardcoded hex unless it's from the palette
style={{ color: "var(--kinship-ink)" }}           // ✅
style={{ color: "#3D1A4E" }}                       // ✅ (same thing, palette color)
style={{ color: "#123456" }}                       // ❌ not a brand color
className="text-gray-900"                          // ❌ cold unbranded gray
```

**The four brand colors:**
- `--kinship-ink`   `#3D1A4E` — deep purple — primary text, Hearth sidebar
- `--kinship-cream` `#F5F0E8` — warm cream — page background, cards
- `--kinship-mid`   `#7A5590` — mid purple — secondary text, Horizon sidebar
- `--kinship-dim`   `#B8A2C8` — light purple — muted text, disabled

**Typography:**
```tsx
// Page titles — use text-serif class
<h1 className="text-serif text-4xl">My heading</h1>

// Section labels — always uppercase, small, tracked
<p className="section-label">students</p>

// Body — Inter (auto from font-sans)
<p className="text-sm text-[var(--kinship-ink)]">Body text</p>
```

**Cards:** Always `rounded-lg border` — no shadows, no gradients
```tsx
// ✅ Correct card
<div className="rounded-lg border border-[color-mix(in_oklch,var(--kinship-dim)_30%,transparent)] bg-white p-5">

// ❌ Wrong — no box shadows
<div className="shadow-lg rounded-lg">

// ❌ Wrong — no gradients
<div className="bg-gradient-to-br from-purple-500 to-blue-500">
```

**Text case:**
- Sidebar nav items → `lowercase`
- Section dividers → `UPPERCASE` (use `section-label` class)
- Everything else → Sentence case
- No Title Case in UI copy

### 3. Animations — use the provided primitives
```tsx
import { FadeUp, Stagger } from "@/components/animations/fade";

// Page sections entrance
<FadeUp><MySection /></FadeUp>

// Card grid entrance
<Stagger className="grid grid-cols-3 gap-4">
  {items.map(item => <MyCard key={item.id} {...item} />)}
</Stagger>
```

For 3D/physics animations, use `@react-three/fiber` + `@react-three/drei` (Three.js).
For complex motion paths, use `framer-motion` directly.
For spring physics, use `react-spring`.
GSAP is available for timeline-heavy sequences.

**NO bounce easing.** Use `[0.22, 1, 0.36, 1]` (ease-out-expo) for most animations.

### 4. Server vs Client components
```tsx
// Default: Server Component (no directive)
export default function MyPage() { ... }

// Client: add directive + IMMEDIATELY comment why
"use client";
// needed for useState to manage active slide
```

### 5. Import paths
```tsx
import { cn } from "@/lib/utils";                           // ✅
import { FadeUp } from "@/components/animations/fade";      // ✅
import { StatCard } from "@/components/kinship/stat-card";  // ✅
import { cn } from "../../lib/utils";                       // ❌ no relative cross-dir
```

---

## Available Libraries (pre-installed)

| Library | Use for |
|---|---|
| `framer-motion` | Page transitions, entrance animations, gestures |
| `@react-three/fiber` + `@react-three/drei` | 3D objects, scenes, shaders |
| `three` | Low-level Three.js when needed |
| `recharts` | Charts — bars, lines, areas, pie |
| `d3` | Complex data viz, custom SVG charts |
| `lucide-react` | Icons (consistent icon set — use this exclusively) |
| `gsap` | Timeline animations, scroll triggers |
| `react-spring` | Spring physics animations |
| `@use-gesture/react` | Drag, pinch, hover gestures |
| `lottie-react` | Lottie JSON animations |
| `embla-carousel-react` | Carousels |
| `reveal.js` | Full-featured presentation (alternative to Slideshow component) |
| `class-variance-authority` | Variant-based component styles |
| `clsx` + `tailwind-merge` | Class utilities (use `cn()` from `@/lib/utils`) |
| `@radix-ui/*` | Accessible headless components (dialog, tooltip, tabs, progress) |

**Do NOT install additional packages.** Use what's here. If something genuinely isn't possible without a new package, note it in a code comment.

---

## Prototype Types & Patterns

### Slide Deck
```tsx
// app/page.tsx (or app/slides/page.tsx on the branch)
import { Slideshow, SlideTitleLayout, SlideContentLayout } from "@/components/slides/slideshow";

const slides = [
  { id: "title", content: <SlideTitleLayout title="My Deck" subtitle="Kinship 2026" /> },
  { id: "content", content: <SlideContentLayout title="Key Points">...</SlideContentLayout> },
];

export default function Page() {
  return <Slideshow slides={slides} theme="kinship" />;
}
```
- Arrow keys + click navigation built-in
- Three themes: `"kinship"` (cream bg), `"dark"` (ink bg), `"light"` (white bg)
- Add custom slide layouts inline — no need to abstract unless reused

### Dashboard Page (Hearth/Horizon)
```
Layout: Ink sidebar (240px) + Cream content area
Content: FadeUp sections, StatGrid at top, data tables or card grids below
Data: All from mock/ folder — realistic names, numbers, subjects, platforms
```
Follow the Hearth/Horizon patterns from DESIGN.md exactly.
Never show peer comparison. Never show leaderboards. Never use XP/streaks.

### Animation / Visual
```tsx
// For 3D — use React Three Fiber
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

// For 2D motion — use Framer Motion
import { motion } from "framer-motion";

// For data-driven visuals — use D3 or Recharts
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
```

---

## Mock Data Pattern

```ts
// mock/students.ts
export interface Student {
  id: string;
  name: string;
  grade: number;
  accuracy: number | null;
  status: "active" | "struggling" | "needs-attention" | "inactive" | "offline";
  subjects: string[];
}

export const students: Student[] = [
  { id: "s1", name: "Lena Abramov", grade: 3, accuracy: 87, status: "active", subjects: ["math", "reading"] },
  { id: "s2", name: "Noah Chen", grade: 3, accuracy: 54, status: "struggling", subjects: ["math"] },
  // ...
];
```

Rules for mock data:
- Realistic names (diverse, no placeholder "John Doe")
- Realistic numbers (accuracy between 45–98%, not round numbers)
- Sufficient data to tell a story (minimum 8–10 students for a classroom view)
- No real school, student, or teacher names from actual Kinship customers

---

## Anti-Patterns (Will Get Your PR Rejected)

| ❌ Pattern | ✅ Instead |
|---|---|
| `shadow-lg` on cards | `border` only |
| `bg-gradient-to-br` | Flat `bg-[var(--kinship-cream)]` |
| `text-gray-900` | `text-[var(--kinship-ink)]` |
| `bg-white` for page bg | `bg-[var(--kinship-cream)]` |
| Peer comparison / leaderboard | Class-aggregate trends only |
| XP / streaks / badges | Concept milestones only |
| `bounce` easing | `[0.22, 1, 0.36, 1]` |
| Nested cards | Flat sections or list rows |
| Modals as first response | Inline panels, sheets |
| `console.log(...)` left in | Remove before committing |
| Importing from `app/` in components | Keep component deps clean |
| Any `fetch()` or `axios` call | Mock data only |
| Any env var for external services | Not applicable |

---

## Checklist Before Committing

- [ ] All data comes from `mock/` — no external calls
- [ ] Colors match the Kinship palette — no arbitrary hex values
- [ ] No `shadow-*` on cards — borders only
- [ ] No peer comparison or leaderboard data shown
- [ ] `'use client'` has a comment on the immediately following line explaining why
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] Page loads without console errors
- [ ] Animations respect `prefers-reduced-motion` (FadeUp/Stagger handle this automatically)
- [ ] Mobile layout tested (Chromebook baseline: 1366×768, also check ~768px)

---

## What's in `docs/PROTOTYPE.md`

Hermes writes a `docs/PROTOTYPE.md` on each branch with:
- The original user request
- Specific scope and constraints
- Which prototype type this is (slide deck / animation / dashboard page / other)
- Any research notes relevant to the content

Read it before starting.

---

## The Gallery System — Rules for Coding Agents

Every prototype is automatically listed in the **Prototype Gallery** at `/gallery`. The gallery
is powered by a manifest file — not by code you write. **You do not touch the gallery page.**

### What you must NOT do

- Do **not** modify `app/gallery/page.tsx` or `app/gallery/client.tsx`
- Do **not** modify `app/page.tsx` or `app/home.tsx`
- Do **not** create or edit any file in `prototypes/` — Hermes manages that
- Do **not** modify `types/manifest.ts`

### What the manifest system is (for context only)

When Hermes deploys your prototype, it automatically:
1. Takes a screenshot of your finished page
2. Creates `prototypes/<slug>/manifest.json` — metadata the gallery reads
3. Commits that to `main`, then redeploys so the gallery shows your prototype

The gallery discovers all manifests at build time with `fs.readdirSync`. No database, no
central file that causes merge conflicts. Each prototype slug gets its own folder that only
Hermes writes to.

### Your job

Build the prototype page(s) at `app/<slug>/page.tsx`. That's it. Follow all the rules above
(design tokens, mock data, no shadows, etc.). Hermes handles the gallery.

### The `prototypes/` folder

If you see a `prototypes/` directory at the repo root, leave it alone. It contains
`manifest.json` files that drive the gallery. Do not read, write, or delete anything there.
