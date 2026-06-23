# Hermes Prototype Base — Coding Harness

> This file is your operating manual. Read it **fully** before touching any code.
> Every prototype is a **branch off `main`**. You build on top of this base — you never modify `main`.

---

## What This Repo Is

A Next.js 15 (App Router) prototype engine for Kinship. When Hermes receives a prototype request, it:
1. Creates a Firestore doc (via MCP tool) → gets UUID
2. Creates a branch (`prototype/<slug>-<YYYY-MM-DD>`)
3. Delegates work to a coding agent (you) on that branch
4. Registers the new prototype component in `PrototypeRegistry.tsx`
5. Pushes → Vercel auto-builds → deploys to production
6. Hermes shortens the UUID-based artifact URL and returns it to the requester

**This is primarily a frontend prototype system.** Visual/display data is mocked in `mock/` — simple TypeScript objects and arrays. Firebase Auth + Firestore are used for auth gating and persistence (survey responses, gallery data).

---

## Authentication Architecture

The app has **two access tiers** enforced by Next.js route groups. Do not add auth logic outside these components — everything is handled at the layout level.

### Internal routes — Google Auth, @buildkinship.com only
```
/                          → GoogleAuthGate
/gallery                   → GoogleAuthGate
/survey-admin/[slug]       → GoogleAuthGate
```
These live in `app/(internal)/`. The layout at `app/(internal)/layout.tsx` wraps all children in `<GoogleAuthGate>`. Non-@buildkinship.com accounts see a sign-in page. Anonymous users are blocked.

### Artifact routes — Anonymous Auth, public
```
/artifact/[uuid]               → AnonAuthGate (silent, no UI)
/artifact/[uuid]/survey/[slug] → AnonAuthGate (silent, no UI)
```
These live in `app/artifact/`. The layout at `app/artifact/layout.tsx` wraps all children in `<AnonAuthGate>`. Visitors are silently signed into Firebase anonymously — they see no auth UI at all.

### Auth components
- `components/auth/AuthProvider.tsx` — React context, exports `useAuth()` hook
- `components/auth/GoogleAuthGate.tsx` — blocks and shows sign-in for internal routes
- `components/auth/AnonAuthGate.tsx` — silently signs in visitors anonymously (3s fallback timeout)
- `components/auth/FullPageSpinner.tsx` — loading state

### The auth race — CRITICAL
**Always wait for Firebase auth to resolve before querying Firestore.** This is the #1 cause of `Missing or insufficient permissions` errors.

```tsx
// ✅ Correct — gate Firestore reads on auth state
const { user, loading: authLoading } = useAuth();

useEffect(() => {
  if (authLoading || !user) return; // wait for Firebase auth to settle
  fetchMyData();
}, [user, authLoading]);

// ❌ Wrong — fires before onAuthStateChanged resolves
useEffect(() => {
  fetchMyData(); // will fail with permission-denied if auth hasn't resolved yet
}, []);
```

This applies to **both** Google users (internal) and anonymous users (artifacts). Even though `AnonAuthGate` wraps the artifact layout, there's a brief window between the gate rendering and the anonymous sign-in completing — always gate on `user && !authLoading`.

---

## Project Structure

```
app/
  (internal)/           Route group — GoogleAuthGate applied to all routes here
    layout.tsx          Applies GoogleAuthGate
    page.tsx            Homepage
    gallery/            Gallery — reads from Firestore (client component)
    survey-admin/[slug] Survey results (Google auth, no PIN)
      page.tsx          Renders <SurveyAdminView survey={...} />

  artifact/             Artifact routes — AnonAuthGate applied to all routes here
    layout.tsx          Applies AnonAuthGate
    [uuid]/             Looks up Firestore doc by UUID → renders component by slug
      page.tsx          Uses useAuth() to wait for anon auth, then getDocs
      survey/[slug]/    Survey artifact (public, anon auth)
        page.tsx        Server component — renders <SurveyEngine survey={...} />

  api/
    prototypes/         Prototype CRUD (PROTOTYPE_ADMIN_SECRET bearer token)
    survey/[slug]/
      submit/route.ts   POST — public, writes to Firestore via Admin SDK
      responses/route.ts GET — @buildkinship.com Firebase ID token required

components/
  auth/                 Auth gates and context (do not modify)
  artifact/
    PrototypeRegistry.tsx   ← EVERY new prototype MUST be registered here
  survey/
    survey-engine.tsx   Full survey UI — question types, transitions, thank-you
    survey-admin.tsx    Admin table — sort, filter, CSV export
  kinship/              Kinship-branded UI components
    stat-card.tsx       StatCard, StatGrid
    student.tsx         StudentAvatar, StudentStatusIndicator
    accuracy-ring.tsx   AccuracyRing (SVG progress circle)
    badges.tsx          SubjectBadge, PlatformBadge, SubjectDot
  slides/
    slideshow.tsx       Full slideshow engine (keyboard nav, touch, localStorage)
    brand-logos.tsx     ClaudeLogo, NotionLogo, SlackLogo, ZoomLogo, etc.
  animations/
    fade.tsx            FadeUp, Stagger (Framer Motion wrappers)

lib/
  firebase/
    client.ts           Firebase client app init — exports auth + db (client-side only)
    admin.ts            Firebase Admin SDK — exports getAdminDb(), getAdminAuth()
                        ⚠️  Use in API routes only — NOT in React components
    firestore.ts        Typed Firestore helpers: createPrototype, getPrototype, etc.
    survey-store.ts     addResponseFirestore, getResponsesFirestore (client SDK)
  utils.ts              cn(), deterministicColor(), accuracyColor(), slugify()

mock/                   ALL visual/display mock data lives here
  surveys.ts            Survey definitions — SurveyConfig objects + getSurvey(slug)

docs/
  PROTOTYPE.md          Written by Hermes before you run — read this first
```

---

## The Prototype Registry — MANDATORY

Every new prototype component **must** be registered in `components/artifact/PrototypeRegistry.tsx`:

```typescript
import dynamic from "next/dynamic";
import type { ComponentType } from "react";

const registry: Record<string, ComponentType> = {
  "colour-palette": dynamic(() => import("@/app/colour-palette/page")),
  "pomodoro-timer": dynamic(() => import("@/app/pomodoro-timer/page")),
  // ─── Add new prototypes below this line ────────────────────────────────
  "my-new-slug": dynamic(() => import("@/app/my-new-slug/page")),
};
```

**Without this entry, `/artifact/[uuid]` shows "No component registered for: {slug}" even if the page file exists.**

Surveys are **not** registered here — they use a dedicated route. See the Survey section below.

---

## Building a Survey Prototype

Surveys are the most complex prototype type. Follow this exactly.

### How survey routing works

```
/artifact/[uuid]
  → AnonAuthGate (silent anon sign-in)
  → Fetches Firestore doc by UUID
  → If proto.type === "survey" AND proto.survey_slug is set:
      → Redirects to /artifact/[uuid]/survey/[slug]
  → SurveyEngine renders the form

/survey-admin/[slug]
  → GoogleAuthGate (@buildkinship.com only)
  → SurveyAdminView fetches responses via /api/survey/[slug]/responses
  → Bearer token = user.getIdToken(true) from useAuth()
```

**The redirect only works if `survey_slug` is set in the Firestore prototype doc.**
Hermes sets this via the MCP tool (`update_prototype(uuid, { survey_slug: "your-slug" })`).
You do not need to do this — but if the artifact page shows "Component not registered", check this field.

### Adding a new survey

**Step 1 — Add the survey config to `mock/surveys.ts`:**

```typescript
export const SURVEYS: Record<string, SurveyConfig> = {
  "my-survey": {
    slug: "my-survey",
    title: "Survey Title",
    description: "1–2 sentences shown on the welcome screen.",
    adminCode: "", // legacy field — no longer used, leave empty string
    thankYouTitle: "Thank you!",
    thankYouMessage: "Your responses help us improve Kinship.",
    questions: [
      // see question types below
    ],
  },
};
```

**Step 2 — That's it.** No new routes, no new components. The survey engine, API routes, and admin view are all generic — they work with any slug defined in `SURVEYS`.

Hermes handles creating the Firestore doc with `survey_slug: "my-survey"` set.

### Question types

```typescript
// Single choice — auto-advances 250ms after selection
{
  id: "role",
  type: "single-choice",
  title: "What best describes your role?",
  required: true,
  options: [
    { id: "teacher", label: "Classroom teacher" },
    { id: "admin", label: "School administrator" },
    { id: "other", label: "Other" },
  ],
}

// Multiple choice — requires explicit Next button
{
  id: "subjects",
  type: "multiple-choice",
  title: "Which subjects do you teach?",
  required: true,
  options: [
    { id: "math", label: "Math" },
    { id: "reading", label: "Reading" },
    { id: "science", label: "Science" },
  ],
}

// Rating — auto-advances after selection
{
  id: "satisfaction",
  type: "rating",
  title: "How satisfied are you with Kinship?",
  required: true,
  ratingMax: 5,            // 5 or 10
  ratingLabels: { low: "Not at all", high: "Extremely" },
}

// Short text — Enter key or Next button advances
{
  id: "name",
  type: "short-text",
  title: "What's your name?",
  description: "First name is fine.",
  required: true,
  maxLength: 100,
}

// Long text — Ctrl+Enter or Next button
{
  id: "feedback",
  type: "long-text",
  title: "Any additional feedback?",
  required: false,
  minLength: 10,
  maxLength: 500,
}

// Email
{
  id: "email",
  type: "email",
  title: "What's your email address?",
  required: false,
}

// Number
{
  id: "class-size",
  type: "number",
  title: "How many students are in your class?",
  required: true,
  min: 1,
  max: 60,
}
```

### Survey UX rules (already implemented — do not override)

- One question fills the full screen — nothing else visible
- `single-choice` and `rating` auto-advance after selection (250ms / 300ms delay)
- Keyboard shortcuts: A/B/C for choices, 1–5 for ratings, Enter for text
- Progress bar fixed at the top
- ⚙️ Admin link visible on welcome screen, question nav bar, and thank-you screen
- Thank-you screen shows after successful submit — do not add a separate "done" page

### Survey data flow

```
Guest fills form
  → SurveyEngine collects answers
  → POST /api/survey/[slug]/submit
      { answers: {...}, sessionId: user.uid }   ← anon Firebase uid
  → API route (Admin SDK) writes to Firestore:
      collection: "survey_responses"
      { surveySlug, answers, submittedAt, sessionId, createdAt }

@buildkinship.com user views results
  → /survey-admin/[slug]  (Google auth gate)
  → SurveyAdminView calls GET /api/survey/[slug]/responses
      Authorization: Bearer <firebase-id-token>
  → API route verifies token with Admin SDK
  → Returns responses sorted by submittedAt desc
```

### API routes for surveys — Admin SDK only

Both survey API routes use `firebase-admin`, not the client SDK:

```typescript
// app/api/survey/[slug]/submit/route.ts
export const runtime = 'nodejs'; // REQUIRED — first line of file
import { getAdminDb } from "@/lib/firebase/admin";
// ...
const db = await getAdminDb();
await db.collection("survey_responses").add({ ... });

// app/api/survey/[slug]/responses/route.ts
export const runtime = 'nodejs'; // REQUIRED — first line of file
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
// ...
const decoded = await adminAuth.verifyIdToken(token);
// check decoded.firebase?.sign_in_provider !== "anonymous"
// check decoded.email?.endsWith("@buildkinship.com")
```

**Never import from `lib/firebase/client.ts` inside API routes.** The client SDK has no auth context on the server.

---

## Building a Slide Deck

```tsx
// app/my-deck/page.tsx
import {
  Slideshow, SlideTitle, SectionLabel,
  SlideCard, SlideCardGrid, SlideDarkCard,
  ResponsiveSVG, AskBubble,
} from "@/components/slides/slideshow";
import type { Slide } from "@/components/slides/slideshow";

const slides: Slide[] = [
  {
    id: "cover",
    dark: true,            // dark bg, cream text
    label: "Cover",
    content: (
      <div className="flex flex-col items-center gap-8 w-full">
        <SlideTitle title="The Title" subtitle="The subtitle" dark />
      </div>
    ),
  },
  {
    id: "point-1",
    dark: false,
    label: "1 · Key point",
    content: (
      <div className="flex flex-col items-center gap-6 w-full">
        <SectionLabel>1 · Key point</SectionLabel>
        <SlideTitle title="One clear idea per slide." size="sm" />
        <SlideCardGrid>
          <SlideCard>Point A</SlideCard>
          <SlideCard>Point B</SlideCard>
          <SlideCard>Point C</SlideCard>
        </SlideCardGrid>
      </div>
    ),
  },
];

export default function Page() {
  return <Slideshow slides={slides} storageKey="my-deck-slide" />;
}
```

### Already handled by the Slideshow component — do NOT re-implement

- ← → Space / Home / End keyboard navigation
- Touch swipe (40px threshold)
- `localStorage` position persistence
- Progress dots (collapses to text on >12 slides)
- Per-slide dark/light theming via `slide.dark`
- `100dvh` height — safe on iOS Safari (no chrome clipping)
- Always-visible nav on touch devices

### Slide deck rules

- Dark and light slides should alternate for visual rhythm
- Keep SVG animations in `<ResponsiveSVG maxWidth={N}>` — prevents mobile overflow
- Use `SlideCardGrid` instead of `grid-cols-N` — handles 1→2→3 breakpoints automatically
- Framer Motion `ease` arrays must be cast: `[0.22, 1, 0.36, 1] as unknown as Transition["ease"]`
- Brand logos: import from `@/components/slides/brand-logos.tsx` (Claude, Notion, Slack, Zoom, Google, Hermes)

---

## Building a Dashboard Page

```
Layout pattern:
  Ink sidebar (240px fixed) + Cream content area (flex-1)
  Content: FadeUp sections, StatGrid at top, data tables or card grids below
  Data: All from mock/ — realistic names, numbers, subjects, platforms
```

- **Never show peer comparison between students**
- **Never show leaderboards**
- **Never show XP, streaks, or achievement badges**
- Use `StatCard` / `StatGrid` from `@/components/kinship/stat-card` for metrics
- Use `AccuracyRing` from `@/components/kinship/accuracy-ring` for circular progress
- Use `SubjectBadge` from `@/components/kinship/badges` for subject labels

---

## The Golden Rules

### 1. Mock data for visuals; Firestore only for persistence
```ts
// ✅ Visual data in mock/
import { students } from "@/mock/students";

// ✅ Survey responses go to Firestore via API routes (already wired)
// You don't write Firestore logic for surveys — it's handled

// ❌ Never fetch from real APIs
fetch("https://api.kinship.io/...")

// ❌ Never write Firestore in React components directly
// (unless you're building a new persistence feature — ask Hermes first)
```

### 2. Kinship design system

**Colors — always use CSS vars:**
```tsx
style={{ color: "var(--kinship-ink)" }}    // ✅ deep purple — text
style={{ color: "var(--kinship-cream)" }}  // ✅ warm cream — backgrounds
style={{ color: "var(--kinship-mid)" }}    // ✅ mid purple — secondary
style={{ color: "var(--kinship-dim)" }}    // ✅ light purple — muted/disabled
style={{ color: "#123456" }}               // ❌ not a brand color
className="text-gray-900"                  // ❌ cold unbranded gray
```

**Typography:**
```tsx
<h1 className="text-serif text-4xl">Headings use text-serif</h1>
<p className="section-label">SECTION LABELS — uppercase, tracked</p>
<p className="text-sm text-[var(--kinship-ink)]">Body — Inter, sentence case</p>
```

**Cards — border only, no shadows, no gradients:**
```tsx
// ✅
<div className="rounded-lg border border-[color-mix(in_oklch,var(--kinship-dim)_30%,transparent)] bg-white p-5">

// ❌
<div className="shadow-lg rounded-lg">
<div className="bg-gradient-to-br from-purple-500 to-blue-500">
```

### 3. Server vs Client components
```tsx
// Default: Server Component (no directive needed)
export default function MyPage() { ... }

// Client component: directive + comment explaining WHY
"use client";
// needed for useState to track active question index
```

### 4. Import paths — always use @/ aliases
```tsx
import { cn } from "@/lib/utils";                           // ✅
import { FadeUp } from "@/components/animations/fade";      // ✅
import { cn } from "../../lib/utils";                       // ❌
```

### 5. API routes — Admin SDK rules
Any API route that touches `firebase-admin` **must** have these two things:
```typescript
export const runtime = 'nodejs'; // ← FIRST line, before any imports
// ...
import { getAdminDb } from "@/lib/firebase/admin"; // ← dynamic getter, not direct import
```
Both are required. Missing `runtime = 'nodejs'` causes Edge Runtime crashes. Static imports of `firebase-admin/*` cause build-time crashes.

---

## Available Libraries (pre-installed — do NOT install new packages)

| Library | Use for |
|---|---|
| `framer-motion` | Page transitions, entrance animations, layout |
| `@react-three/fiber` + `@react-three/drei` | 3D scenes, WebGL |
| `three` | Low-level Three.js |
| `recharts` | Bar, line, area, pie charts |
| `d3` | Custom SVG data viz |
| `lucide-react` | Icons — use this exclusively, no other icon lib |
| `gsap` | Timeline animations, scroll triggers |
| `react-spring` | Spring physics |
| `@use-gesture/react` | Drag, pinch, hover gestures |
| `lottie-react` | Lottie JSON animations |
| `embla-carousel-react` | Carousels |
| `react-hook-form` | Form state (used in SurveyEngine — use for any form) |
| `zod` + `@hookform/resolvers/zod` | Schema validation (Zod v4 is installed — see note) |
| `class-variance-authority` | Variant-based component styles |
| `clsx` + `tailwind-merge` | Class utilities — use `cn()` from `@/lib/utils` |
| `@radix-ui/*` | Accessible headless: dialog, tooltip, tabs, progress |
| `firebase` | Client SDK — anon auth, Firestore reads in components |

**Zod v4 note:** The API changed from v3. Use `z.number({ error: '...' })` not `invalid_type_error`. Use `err.issues[0].message` not `err.errors[0].message`.

---

## Mock Data Pattern

```ts
// mock/students.ts
export interface Student {
  id: string;
  name: string;
  grade: number;
  accuracy: number | null;
  status: "active" | "struggling" | "needs-attention";
  subjects: string[];
}

export const students: Student[] = [
  { id: "s1", name: "Lena Abramov", grade: 3, accuracy: 87, status: "active", subjects: ["math", "reading"] },
  { id: "s2", name: "Noah Chen", grade: 3, accuracy: 54, status: "struggling", subjects: ["math"] },
  // ...
];
```

Rules:
- Realistic names (diverse, no "John Doe")
- Realistic numbers (accuracy 45–98%, not round numbers like 80%)
- Enough data to tell a story (min 8–10 items for a classroom view)
- No real school, student, or teacher names from actual Kinship customers

---

## Anti-Patterns (Will Get Your PR Rejected)

| ❌ Don't | ✅ Do instead |
|---|---|
| `shadow-lg` on cards | `border` only |
| `bg-gradient-to-br` | Flat `bg-[var(--kinship-cream)]` |
| `text-gray-900` | `text-[var(--kinship-ink)]` |
| `bg-white` for page bg | `bg-[var(--kinship-cream)]` |
| Peer comparison / leaderboard | Class-aggregate trends only |
| XP / streaks / achievement badges | Concept milestones only |
| `bounce` easing | `[0.22, 1, 0.36, 1]` |
| `fetch()` to real Kinship APIs | Mock data in `mock/` |
| `import ... from 'firebase-admin'` in component | Client SDK only in components |
| Static `import ... from 'firebase-admin'` in API route | `await import(...)` or `getAdminDb()` getter |
| API route without `export const runtime = 'nodejs'` | Always first line for admin routes |
| Firestore query without waiting for `user` | Gate on `user && !authLoading` |
| `orderBy(...)` on Firestore query without a deployed index | Sort client-side instead |
| `prototypes/*/manifest.json` files | Use Firestore + MCP tool |
| Auth logic outside auth components | Use `useAuth()` hook or layout gates |
| Survey PIN gate | GoogleAuthGate at route level |
| `adminCode` field in surveys (old PIN) | Leave empty string `""` |

---

## Checklist Before Committing

- [ ] Prototype component registered in `components/artifact/PrototypeRegistry.tsx` (not needed for surveys)
- [ ] Visual data comes from `mock/` — no external API calls
- [ ] Colors match the Kinship palette — no arbitrary hex
- [ ] No `shadow-*` on cards — borders only
- [ ] No peer comparison, leaderboards, or XP shown
- [ ] `'use client'` has an explanatory comment on the next line
- [ ] API routes that use firebase-admin have `export const runtime = 'nodejs'` as first line
- [ ] Firestore reads in components are gated on `user && !authLoading` from `useAuth()`
- [ ] TypeScript compiles: `npx tsc --noEmit`
- [ ] Page loads without console errors
- [ ] Mobile layout tested at ~768px width
- [ ] No `prototypes/*/manifest.json` files created

---

## What's in `docs/PROTOTYPE.md`

Hermes writes this on every branch before delegating to you. It contains:
- The original user request (verbatim)
- Prototype type (survey / slide deck / dashboard / animation / other)
- Scope and constraints
- The Firestore UUID and artifact URL (`https://quick.buildkinship.dev/artifact/{uuid}`)
- For surveys: the survey slug to use in `mock/surveys.ts`

**Read it first. It is the single source of truth for what to build.**

---

## The Gallery System — Rules for Coding Agents

The **Prototype Gallery** at `/gallery` reads from Firestore at runtime. There are no manifest files.

### What you must NOT do

- Do **not** modify `app/(internal)/gallery/` or `app/(internal)/page.tsx`
- Do **not** create or edit files in `prototypes/` — that folder is legacy
- Do **not** write `manifest.json` files — Hermes uses the `update_prototype` MCP tool

### What you MUST do

Register your prototype in `components/artifact/PrototypeRegistry.tsx`. Hermes handles Firestore doc creation, gallery metadata, and URL shortening.

### Artifact URL pattern

```
https://quick.buildkinship.dev/artifact/{FIRESTORE_UUID}
```

The UUID is in `docs/PROTOTYPE.md`. Do not use slug-based URLs — those are short-link aliases only.
