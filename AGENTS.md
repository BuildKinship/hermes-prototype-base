<!-- BEGIN:nextjs-agent-rules -->
# Kinship Prototype Engine — Agent Rules

This is a prototype repo. The rules below apply to every agent working in this codebase.

## Before writing any code

1. `cat CLAUDE.md` — understand the repo, auth architecture, design system, absolute don'ts
2. `cat docs/PROTOTYPE.md` — your specific brief, UUID, scope, success criteria
3. `cat docs/surveys.md` | `cat docs/slideshows.md` | `cat docs/dashboards.md` — guide for your type

## Non-negotiable rules

- **All mock data goes in `mock/`** — never hardcode data in components
- **CSS variables for colors** — never arbitrary hex unless it's a brand palette value
- **`'use client'`** requires an explanation comment on the **immediately following line**
- **No external API calls, no real database connections** — mock data only
- **Register your component** in `components/artifact/PrototypeRegistry.tsx` (not for surveys)
- **API routes using firebase-admin** must have `export const runtime = 'nodejs'` as line 1
- **Firestore reads must wait** for `user && !authLoading` from `useAuth()` — always
- **`firebase-admin` stays pinned to `^12`** — do not upgrade (v13+ breaks on Vercel)
- **No `orderBy()` on Firestore** without a deployed composite index — sort client-side

## This is Next.js 15 App Router

APIs, conventions, and file structure differ from older versions.
Read relevant docs before assuming anything about routing or data fetching.
<!-- END:nextjs-agent-rules -->
