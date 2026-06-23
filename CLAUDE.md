# Hermes Prototype Base — Coding Harness

> Read this file **in full** before writing a single line of code.
> Then read the dedicated guide for your prototype type in `docs/`.

---

## What This Repo Is

A Next.js 15 (App Router) prototype engine for Kinship. Hermes manages the full lifecycle:

1. Creates a Firestore doc → gets a UUID
2. Creates a branch (`prototype/<slug>-<YYYY-MM-DD>`)
3. Writes `docs/PROTOTYPE.md` on the branch with your exact brief
4. Delegates to you (the coding agent) on that branch
5. You build, register, push
6. Vercel auto-builds → Hermes shortens the URL → returns it to the requester

**You never touch `main`.** You build on your branch only.

---

## First Steps on Every Branch

```bash
# 1. Read your brief — this is the single source of truth for what to build
cat docs/PROTOTYPE.md

# 2. Read the guide for your prototype type (see below)
cat docs/surveys.md         # if type = survey
cat docs/slideshows.md      # if type = slide deck
cat docs/dashboards.md      # if type = dashboard / animation / 3D / other

# 3. Install deps if needed
pnpm install

# 4. Start dev server
pnpm dev
```

---

## Prototype Type Guides

| Type | Guide | What it covers |
|---|---|---|
| Survey | [`docs/surveys.md`](docs/surveys.md) | Question types, Firestore flow, admin view, auth |
| Slide deck | [`docs/slideshows.md`](docs/slideshows.md) | Slideshow component, layouts, dark/light themes |
| Dashboard / Animation / 3D / Other | [`docs/dashboards.md`](docs/dashboards.md) | Kinship UI components, mock data, Three.js, charts |

---

## Authentication — Two Tiers

The app enforces two access tiers via Next.js route groups. **Do not add auth logic anywhere else.**

| Zone | Gate | Who gets in |
|---|---|---|
| `app/(internal)/` — gallery, home, survey-admin | `GoogleAuthGate` | @buildkinship.com Google accounts only |
| `app/artifact/` — all artifact + survey pages | `AnonAuthGate` | Anyone — silently signed in anonymously |

### The auth race — read this, it has burned us before

**Always wait for Firebase auth before querying Firestore.** Failing to do this produces `Missing or insufficient permissions` — not an obvious auth error.

```tsx
// ✅ Always gate Firestore reads on auth state
const { user, loading: authLoading } = useAuth();
useEffect(() => {
  if (authLoading || !user) return;
  fetchData();
}, [user, authLoading]);

// ❌ Fires before onAuthStateChanged resolves → permission denied
useEffect(() => {
  fetchData();
}, []);
```

---

## Project Structure

```
app/
  (internal)/           GoogleAuthGate — home, gallery, survey-admin
  artifact/             AnonAuthGate — /artifact/[uuid], /artifact/[uuid]/survey/[slug]
  api/
    prototypes/         Prototype CRUD — PROTOTYPE_ADMIN_SECRET bearer token
    survey/[slug]/      submit (public) + responses (@buildkinship.com token)

components/
  auth/                 AuthProvider, GoogleAuthGate, AnonAuthGate — do not modify
  artifact/
    PrototypeRegistry.tsx   ← register your component here (non-survey prototypes)
  survey/               SurveyEngine, SurveyAdminView — do not modify
  slides/               Slideshow engine + brand logos — extend, don't rewrite
  kinship/              StatCard, AccuracyRing, StudentAvatar, badges — use these
  animations/           FadeUp, Stagger — use these for entrance animations

lib/
  firebase/
    client.ts           Client SDK — use in React components only
    admin.ts            Admin SDK — use in API routes only (getAdminDb, getAdminAuth)
    firestore.ts        Prototype CRUD helpers
    survey-store.ts     Survey response helpers (client SDK)
  utils.ts              cn(), deterministicColor(), slugify()

mock/                   ALL visual/display data — simple TS objects
  surveys.ts            Survey definitions — add new surveys here

docs/
  PROTOTYPE.md          Your brief — written by Hermes, read it first
  surveys.md            Full survey authoring guide
  slideshows.md         Full slideshow guide
  dashboards.md         Dashboard, animation, 3D guide
```

---

## The Prototype Registry

Every non-survey prototype **must** be registered in `components/artifact/PrototypeRegistry.tsx`:

```typescript
const registry: Record<string, ComponentType> = {
  "colour-palette": dynamic(() => import("@/app/colour-palette/page")),
  // ─── Add yours below ───────────────────────────────────────────────────
  "my-new-slug": dynamic(() => import("@/app/my-new-slug/page")),
};
```

Without this, `/artifact/[uuid]` shows "Component not registered for: {slug}".
Surveys are routed differently — see `docs/surveys.md`.

---

## Design System — Non-Negotiable Rules

### Colors — CSS variables only
```tsx
var(--kinship-ink)    #3D1A4E   deep purple   primary text, sidebar bg
var(--kinship-cream)  #F5F0E8   warm cream    page bg, cards
var(--kinship-mid)    #7A5590   mid purple    secondary text
var(--kinship-dim)    #B8A2C8   light purple  muted/disabled
```

```tsx
style={{ color: "var(--kinship-ink)" }}   // ✅
className="text-gray-900"                 // ❌ cold unbranded
style={{ color: "#123456" }}              // ❌ not a brand color
```

### Typography
```tsx
<h1 className="text-serif text-4xl">Headings use text-serif (Playfair Display)</h1>
<p className="section-label">SECTION LABELS — uppercase + tracked</p>
<p className="text-sm text-[var(--kinship-ink)]">Body — Inter, sentence case</p>
// No Title Case in UI copy. Sidebar items: lowercase. Labels: UPPERCASE.
```

### Cards — border only, never shadow or gradient
```tsx
// ✅
<div className="rounded-lg border border-[color-mix(in_oklch,var(--kinship-dim)_30%,transparent)] bg-white p-5">

// ❌
<div className="shadow-lg ...">
<div className="bg-gradient-to-br ...">
```

### Animations
```tsx
import { FadeUp, Stagger } from "@/components/animations/fade";
// FadeUp: entrance for sections
// Stagger: entrance for card grids
// Easing: [0.22, 1, 0.36, 1] (ease-out-expo) — NO bounce
```

---

## Package Rules

**Do not install new packages.** Everything you need is pre-installed.

| Need | Use |
|---|---|
| Charts | `recharts` |
| Complex SVG / data viz | `d3` |
| Animation | `framer-motion`, `gsap`, `react-spring` |
| 3D / WebGL | `@react-three/fiber` + `@react-three/drei` |
| Icons | `lucide-react` — exclusively, no other icon lib |
| Gestures | `@use-gesture/react` |
| Carousel | `embla-carousel-react` |
| Headless UI | `@radix-ui/*` (dialog, tooltip, tabs, etc.) |
| Forms | `react-hook-form` + `zod` |
| Class utilities | `cn()` from `@/lib/utils` |

**Zod v4 is installed** — API differs from v3: use `z.number({ error: '...' })` not `invalid_type_error`.

---

## Firebase Rules for API Routes

Any API route touching `firebase-admin` needs **both** of these, in this order:

```typescript
export const runtime = 'nodejs'; // ← MUST be first line, before imports
import { getAdminDb } from "@/lib/firebase/admin"; // ← use getter, not static import
```

- Missing `runtime = 'nodejs'` → Edge Runtime crash
- Static `import ... from 'firebase-admin'` → build-time crash
- `firebase-admin` must stay pinned to `^12` — v13+ uses `jose@6` (ESM-only) which breaks `verifyIdToken` on Vercel with `ERR_REQUIRE_ESM`

---

## Absolute Don'ts

- ❌ `fetch()` to real Kinship APIs — mock data only
- ❌ `shadow-*` on cards — borders only
- ❌ Peer comparison, leaderboards, XP, streaks, achievement badges
- ❌ Modifying `app/(internal)/gallery/`, `app/(internal)/page.tsx`, or auth components
- ❌ Creating `prototypes/*/manifest.json` — Firestore only
- ❌ `orderBy()` on Firestore without a deployed composite index — sort client-side instead
- ❌ Firestore reads before checking `user && !authLoading`
- ❌ `import ... from 'firebase-admin'` statically in any file
- ❌ `console.log()` left in committed code

---

## Checklist Before Committing

- [ ] Read `docs/PROTOTYPE.md` and the relevant type guide in `docs/`
- [ ] Prototype registered in `PrototypeRegistry.tsx` (skip for surveys)
- [ ] All visual data in `mock/` — no hardcoded data in components
- [ ] Colors from CSS vars — no arbitrary hex
- [ ] No `shadow-*`, no gradients on cards
- [ ] `'use client'` has explanatory comment on the line immediately after
- [ ] API routes have `export const runtime = 'nodejs'` as line 1
- [ ] Firestore reads gated on `user && !authLoading`
- [ ] `npx tsc --noEmit` passes
- [ ] No console errors on load
- [ ] Mobile layout checked at ~768px
