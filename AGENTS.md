<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Critical for this repo

- **This is a prototype repo.** Read `CLAUDE.md` in full before writing any code.
- All mock data goes in `mock/` — never hardcode data in components
- Use CSS variables from globals.css for colors — never arbitrary hex unless it matches the brand palette
- `'use client'` requires an explanation comment on the NEXT LINE (not the same line)
- No external API calls, no database connections, no Redis — mock data only
<!-- END:nextjs-agent-rules -->
