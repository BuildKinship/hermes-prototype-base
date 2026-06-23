# Hermes Prototype Base — Coding Harness

> This file is your operating manual. Read it fully before touching any code.
> Every prototype is a **branch off `main`**. You build on top of this base — you never modify `main`.

---

## What This Repo Is

A Next.js 15 (App Router) prototype engine for Kinship. When Hermes receives a prototype request, it:
1. Creates a Firestore doc (via MCP tool) → gets UUID
2. Creates a branch (`prototype/<slug>-<YYYY-MM-DD>`)
3. Delegates work to a coding agent (you) on that branch
4. Registers the new prototype component in `PrototypeRegistry.tsx`
5. Pushes → Vercel auto-builds → deploys to production
6. Hermes shortens the UUID-based URL and returns it to the requester

**This is primarily a frontend prototype system.** Data is mocked in `mock/` — simple TypeScript objects and arrays.
**Firebase Auth + Firestore are available for auth and persistence** (survey responses, gallery data).

---

## Authentication Architecture

The app has two access tiers enforced by Next.js route groups:

### Internal routes (Google Auth, @buildkinship.com only)
```
/                          → GoogleAuthGate
/gallery                   → GoogleAuthGate
/survey-admin/[slug]       → GoogleAuthGate
```
These live in `app/(internal)/` route group. `app/(internal)/layout.tsx` wraps all of them in `<GoogleAuthGate>`.
Non-@buildkinship.com accounts see a "sign in with Google" page. Anonymous users are blocked.

### Artifact routes (Anonymous Auth, public)
```
/artifact/[uuid]               → AnonAuthGate (silent, invisible)
/artifact/[uuid]/survey/[slug] → AnonAuthGate (silent, invisible)
```
These live in `app/artifact/`. `app/artifact/layout.tsx` wraps all of them in `<AnonAuthGate>`.
Visitors are silently signed in anonymously — they see no auth UI.

### Auth components
- `components/auth/AuthProvider.tsx` — React context, exports `useAuth()` hook
- `components/auth/GoogleAuthGate.tsx` — blocks and shows sign-in for internal routes
- `components/auth/AnonAuthGate.tsx` — silently signs in visitors anonymously
- `components/auth/FullPageSpinner.tsx` — loading state

**DO NOT** add auth logic outside these components. The gates are applied at the layout level — all child routes inherit them automatically.

---

## Project Structure

```
app/
  (internal)/           Route group — GoogleAuthGate applied to all routes here
    layout.tsx          Applies GoogleAuthGate
    page.tsx            Homepage
    gallery/            Gallery — reads from Firestore
    survey-admin/[slug] Survey results (Google auth, no PIN)

  artifact/             Artifact routes — AnonAuthGate applied to all routes here
    layout.tsx          Applies AnonAuthGate
    [uuid]/             Artifact page — fetches Firestore doc, renders by slug
      page.tsx
      survey/[slug]/    Survey artifact route

  api/
    prototypes/         Prototype CRUD (protected by PROTOTYPE_ADMIN_SECRET bearer token)
    survey/[slug]/      Survey submit + results (submit: any auth, results: @buildkinship.com)

components/
  auth/                 Auth gates and context (see above)
  artifact/
    PrototypeRegistry.tsx   ← EVERY new prototype must be registered here
  kinship/              Kinship-branded UI components
    stat-card.tsx       StatCard, StatGrid
    student.tsx         StudentAvatar, StudentStatusIndicator
    accuracy-ring.tsx   AccuracyRing (SVG progress circle)
    badges.tsx          SubjectBadge, PlatformBadge, SubjectDot
  slides/               Presentation primitives
    slideshow.tsx       Slideshow engine, SlideTitleLayout, SlideContentLayout
  animations/           Motion primitives
    fade.tsx            FadeUp, Stagger (Framer Motion wrappers)
  three/                3D scene helpers

lib/
  firebase/
    client.ts           Firebase client app init, exports auth + db
    admin.ts            Firebase Admin SDK, exports adminDb + adminAuth
    firestore.ts        Typed Firestore helpers: createPrototype, getPrototype, listPrototypes, updatePrototype
    survey-store.ts     addResponseFirestore, getResponsesFirestore
  utils.ts              cn(), deterministicColor(), accuracyColor(), slugify()

mock/                   ALL mock data lives here (non-Firebase data)
docs/
  PROTOTYPE.md          Prototype-specific context (set by Hermes before agent runs)
```

---

## The Prototype Registry — MANDATORY

Every new prototype component **must** be registered in `components/artifact/PrototypeRegistry.tsx`:

```typescript
const registry: Record<string, ComponentType> = {
  "colour-palette": dynamic(() => import("@/app/colour-palette/page")),
  "pomodoro-timer": dynamic(() => import("@/app/pomodoro-timer/page")),
  // ─── Add new prototypes below this line ────
  "my-new-slug": dynamic(() => import("@/app/my-new-slug/page")),
};
```

**Without this entry, `/artifact/[uuid]` shows "No component registered for: {slug}" even if the page file exists.**

This replaces the old `prototypes/*/manifest.json` commit step. Same importance, different mechanism.

---

## The Golden Rules

### 1. Mock data for visual content; Firestore for persistence
```ts
// ✅ Correct — visual/display data in mock/
import { students } from "@/mock/students";

// ✅ Correct — survey responses go to Firestore (handled by API routes)
// API routes at app/api/survey/[slug]/submit/route.ts write to Firestore

// ❌ Wrong — never fetch from real Kinship APIs
fetch("https://api.kinship.io/...")
// ❌ Wrong — never connect to Kinship's main DB
import { db } from "@/packages/db"
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
| `firebase` | Client SDK — auth (anon + Google), Firestore reads |

**Do NOT install additional packages.** Use what's here. If something genuinely isn't possible without a new package, note it in a code comment.

---

## Prototype Types & Patterns

### Slide Deck
```tsx
// app/artifact/page.tsx (or app/slides/page.tsx on the branch)
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

### Survey
- Survey form: `app/artifact/[uuid]/survey/[slug]/page.tsx` — anon auth, uses survey engine
- Survey admin: `app/(internal)/survey-admin/[slug]/page.tsx` — Google auth
- Responses persist to Firestore `survey_responses` collection via `/api/survey/[slug]/submit`
- No PIN gate — survey admin is protected by `GoogleAuthGate` route group

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
| Any `fetch()` to real Kinship APIs | Mock data only |
| Auth logic outside auth components | Use `useAuth()` hook or rely on layout gates |
| Writing to `prototypes/*/manifest.json` | Use `update_prototype` MCP tool |

---

## Checklist Before Committing

- [ ] Prototype component registered in `components/artifact/PrototypeRegistry.tsx`
- [ ] Visual data comes from `mock/` — no external API calls
- [ ] Colors match the Kinship palette — no arbitrary hex values
- [ ] No `shadow-*` on cards — borders only
- [ ] No peer comparison or leaderboard data shown
- [ ] `'use client'` has a comment on the immediately following line explaining why
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] Page loads without console errors
- [ ] Animations respect `prefers-reduced-motion` (FadeUp/Stagger handle this automatically)
- [ ] Mobile layout tested (Chromebook baseline: 1366×768, also check ~768px)
- [ ] No `prototypes/*/manifest.json` files created — use Firestore instead

---

## What's in `docs/PROTOTYPE.md`

Hermes writes a `docs/PROTOTYPE.md` on each branch with:
- The original user request
- Specific scope and constraints
- Which prototype type this is (slide deck / animation / dashboard page / other)
- Research notes relevant to the content
- The Firestore UUID and artifact URL (`https://quick.buildkinship.dev/artifact/{uuid}`)

Read it before starting.

---

## The Gallery System — Rules for Coding Agents

Every prototype is listed in the **Prototype Gallery** at `/gallery`. The gallery reads
from **Firestore** (`prototypes` collection) at runtime — there are no manifest files.

### What you must NOT do

- Do **not** modify `app/(internal)/gallery/page.tsx` or related gallery files
- Do **not** modify `app/(internal)/page.tsx` or `app/home.tsx`
- Do **not** create or edit any file in `prototypes/` — that folder is legacy, ignore it
- Do **not** write `manifest.json` files — Hermes uses the `update_prototype` MCP tool instead

### What you MUST do

When you build a new prototype, register its component in `components/artifact/PrototypeRegistry.tsx`:

```typescript
// Add your slug → component mapping:
"my-new-slug": dynamic(() => import("@/app/my-new-slug/page")),
```

Hermes handles everything else (Firestore doc creation, gallery metadata, URL shortening).

### Artifact URL pattern

Prototypes are served at: `https://quick.buildkinship.dev/artifact/{FIRESTORE_UUID}`

The UUID comes from the Firestore document created by Hermes before your branch was created.
It's in `docs/PROTOTYPE.md` on your branch. **Do not use slug-based URLs** — those are old
and only exist as short-link aliases.

### The `prototypes/` folder

The `prototypes/` directory contains legacy `manifest.json` files from before Firebase.
They have been migrated to Firestore and are no longer read by the gallery. Leave them alone —
do not add new ones.
