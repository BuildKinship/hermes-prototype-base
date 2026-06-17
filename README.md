# Hermes Prototype Base

A Next.js 15 application used as the base for all Hermes-managed prototypes. Each prototype request creates a new branch from `main`, which triggers a Vercel preview deployment.

## Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Vercel** (hosting + preview deployments)

## How It Works

1. Hermes receives a prototype request from a Kinship team member
2. Hermes creates a new branch (e.g. `prototype/feature-name-2024-01-15`)
3. The branch is pushed to GitHub — Vercel auto-builds a preview URL
4. Hermes shortens the preview URL via Shlink and returns it to the requester

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_PROTOTYPE_NAME` | Display name shown on the page (set per-branch) |

## Branch Naming Convention

`prototype/<slug>-<YYYY-MM-DD>`

Example: `prototype/teacher-dashboard-2024-06-16`
