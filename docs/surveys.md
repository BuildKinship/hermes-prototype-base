# Survey Prototype Guide

> This guide is for coding agents building or modifying surveys.
> Read `CLAUDE.md` first, then come back here.

---

## How Surveys Work End-to-End

```
Hermes creates Firestore doc  →  sets survey_slug on the doc
  ↓
Branch created, PROTOTYPE.md written with UUID + slug
  ↓
You add survey config to mock/surveys.ts
  ↓
Push → Vercel deploys
  ↓
Guest visits /artifact/{UUID}
  → AnonAuthGate signs them in anonymously (invisible)
  → page.tsx fetches Firestore doc, sees type="survey" + survey_slug
  → redirects to /artifact/{UUID}/survey/{slug}
  → SurveyEngine renders the form
  ↓
Guest submits
  → POST /api/survey/{slug}/submit
  → Admin SDK writes to Firestore: collection "survey_responses"
  ↓
Team visits /survey-admin/{slug}
  → GoogleAuthGate (@buildkinship.com only)
  → SurveyAdminView fetches GET /api/survey/{slug}/responses
  → Verified Firebase ID token required
  → Table of responses, sortable, filterable, exportable to CSV
```

---

## Adding a New Survey

**You only need to do one thing: add a config object to `mock/surveys.ts`.**

No new routes. No new components. The engine, API routes, and admin view are generic.

```typescript
// mock/surveys.ts

export const SURVEYS: Record<string, SurveyConfig> = {
  // existing surveys...

  "my-survey-slug": {
    slug: "my-survey-slug",              // must match the key
    title: "Survey Display Title",        // shown in admin view header
    description: "1–2 sentences shown on the welcome screen before questions start.",
    adminCode: "",                        // LEGACY — leave empty string, not used
    thankYouTitle: "Thank you!",          // shown on the completion screen
    thankYouMessage: "Your responses help us improve Kinship.",
    questions: [
      // see question types below
    ],
  },
};
```

Hermes sets `survey_slug` on the Firestore prototype doc via MCP tool. You don't need to touch Firestore yourself.

---

## Question Types

All 7 types are handled by `SurveyEngine`. Pick the right one for each question.

### `single-choice` — auto-advances after selection
Best for: role selection, yes/no, single-answer categorical questions.
```typescript
{
  id: "role",
  type: "single-choice",
  title: "What best describes your role?",
  required: true,
  options: [
    { id: "teacher",   label: "Classroom teacher" },
    { id: "admin",     label: "School administrator" },
    { id: "coach",     label: "Instructional coach" },
    { id: "other",     label: "Other" },
  ],
}
```
- Auto-advances 250ms after click
- Keyboard: press letter key (A, B, C…) to select

### `multiple-choice` — requires Next button
Best for: multi-select, "select all that apply".
```typescript
{
  id: "subjects",
  type: "multiple-choice",
  title: "Which subjects do you teach? Select all that apply.",
  required: true,
  options: [
    { id: "math",     label: "Math" },
    { id: "reading",  label: "Reading / ELA" },
    { id: "science",  label: "Science" },
    { id: "social",   label: "Social studies" },
  ],
}
```

### `rating` — auto-advances after selection
Best for: satisfaction, likelihood, agreement on a numeric scale.
```typescript
{
  id: "satisfaction",
  type: "rating",
  title: "How satisfied are you with Kinship overall?",
  required: true,
  ratingMax: 5,                              // 5 or 10
  ratingLabels: { low: "Not satisfied", high: "Very satisfied" },
}
```
- Auto-advances 300ms after selection
- Keyboard: press number key (1–5 or 1–9/0)

### `short-text`
Best for: names, brief answers (1–2 sentences).
```typescript
{
  id: "name",
  type: "short-text",
  title: "What's your first name?",
  description: "Optional — only used to personalise your results.",
  required: false,
  maxLength: 100,
}
```
- Enter key advances
- Validation: `minLength`, `maxLength`

### `long-text`
Best for: open feedback, explanations, suggestions.
```typescript
{
  id: "open-feedback",
  type: "long-text",
  title: "What's one thing Kinship could do better?",
  required: false,
  minLength: 10,
  maxLength: 500,
}
```
- Ctrl+Enter or Next button advances
- Shows character counter when `maxLength` is set

### `email`
```typescript
{
  id: "email",
  type: "email",
  title: "What's your email address?",
  description: "We'll only use this to follow up on your feedback.",
  required: false,
}
```
- Validates email format on advance

### `number`
```typescript
{
  id: "class-size",
  type: "number",
  title: "How many students are in your class?",
  required: true,
  min: 1,
  max: 60,
}
```

---

## Survey UX — Already Implemented, Do Not Override

The survey engine handles all of this. Do not add custom question rendering or navigation logic.

- **One question = full screen.** Nothing else visible while a question is shown.
- **Auto-advance:** `single-choice` after 250ms, `rating` after 300ms.
- **Keyboard shortcuts:** A/B/C/D for choices, 1–5/0 for ratings, Enter for text fields, Ctrl+Enter for long text.
- **Progress bar** fixed at top of viewport.
- **Welcome screen** shown before question 1 — uses `title` + `description`.
- **Thank-you screen** shown after submit — uses `thankYouTitle` + `thankYouMessage`.
- **⚙️ Admin link** appears on welcome screen, question nav bar, and thank-you screen.
- **Error state** shown if submit fails — user can retry without losing answers.
- **`sessionId`** = anonymous Firebase UID — automatically attached to every submission.

---

## Survey Data in Firestore

### Collection: `survey_responses`

Each document written on submit:
```typescript
{
  surveySlug: string,     // e.g. "demo"
  answers: {
    [questionId: string]: string | string[] | number
  },
  submittedAt: Timestamp,
  sessionId: string,      // Firebase anonymous UID
  createdAt: Timestamp,
}
```

### Writing responses — use the API route, never write directly from the client

```typescript
// Happens automatically in SurveyEngine — you don't write this
POST /api/survey/[slug]/submit
Body: { answers: {...}, sessionId: "firebase-uid" }

// Uses Admin SDK — lib/firebase/admin.ts
// export const runtime = 'nodejs' — required
```

### Reading responses — @buildkinship.com token required

```typescript
GET /api/survey/[slug]/responses
Authorization: Bearer <firebase-id-token>

// Verifies: sign_in_provider !== "anonymous"
// Verifies: email.endsWith("@buildkinship.com")
// Returns: responses[] sorted by submittedAt desc
```

---

## Admin View — `/survey-admin/[slug]`

Protected by `GoogleAuthGate`. Rendered by `components/survey/survey-admin.tsx`.

Features already built:
- Responses table with submittedAt timestamp and sessionId
- Search / filter across all answer text
- Column sort (click any header)
- "0 of N responses" count updates as you filter
- Export CSV button — downloads all current (filtered) responses
- Refresh button — re-fetches from Firestore

**You do not need to build any of this.** It works for any survey slug automatically.

---

## Survey Checklist

- [ ] Config added to `mock/surveys.ts` with a unique `slug`
- [ ] `adminCode` set to `""` (empty string — it's a legacy field)
- [ ] Every question has a unique `id` (used as the Firestore key for that answer)
- [ ] Required questions have `required: true`
- [ ] `thankYouTitle` and `thankYouMessage` are set
- [ ] No new route files created (routes already exist)
- [ ] No new components created (engine + admin already exist)
- [ ] `docs/PROTOTYPE.md` has the `survey_slug` noted (Hermes fills this)

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| "Component not registered for: survey" | `survey_slug` not set on Firestore doc | Hermes needs to call `update_prototype(uuid, { survey_slug: "..." })` |
| "Missing or insufficient permissions" | Firestore read fired before anon auth resolved | Ensure read is gated on `user && !authLoading` |
| "Invalid token" on admin view | `firebase-admin` v13+ ESM crash | Confirm `firebase-admin` pinned to `^12` in package.json |
| Anonymous token reaching admin API | User was anon when they hit the admin route | `signInWithGoogle` signs out anon first — fixed in AuthProvider |
| 0 responses showing but responses exist | `orderBy()` on Firestore without composite index | Remove `orderBy` from query, sort client-side |
