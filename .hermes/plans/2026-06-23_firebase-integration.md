# Firebase Integration — Prototype Base Implementation Plan

> **For Hermes:** This is a `main`-branch change requiring admin authorization (Azim confirmed). Implement directly on `main`. Work in `/home/kinship/hermes-prototype-base`.

**Goal:** Add Firebase Auth + Firestore to the prototype base. Gate all internal routes behind Google Auth (@buildkinship.com only). Gate all `/artifact/*` routes with silent anonymous auth. Replace file-system manifests with Firestore. Give Hermes an MCP tool to manage prototypes.

**Firebase project:** `kinship-prototyper`  
**Decisions confirmed (2026-06-23):**
- Survey artifact moves to `/artifact/[uuid]` (anon auth — external visitors fill out survey)
- Survey admin stays out of `/artifact/` — moves to internal `/survey-admin/[slug]` (Google auth, @buildkinship.com)
- 4-digit PIN gate is REMOVED from survey admin — replaced by Google Auth domain check
- Survey results stored in Firestore (not in-memory) so they survive cold starts
- Old short links updated to UUID-based artifact URLs
- Anonymous auth on artifact pages is fully invisible (no badge)

---

## Architecture

```
Route map:
  /                          → GoogleAuthGate → @buildkinship.com only
  /gallery                   → GoogleAuthGate → @buildkinship.com only
  /survey-admin/[slug]       → GoogleAuthGate → @buildkinship.com only (replaces PIN gate)
  /artifact/[uuid]           → AnonAuthGate  → public (anonymous firebase auth, silent)
  /artifact/[uuid]/...       → AnonAuthGate  → public (nested routes, e.g. survey pages)

Route group structure in Next.js:
  app/
    (internal)/              ← route group, layout applies GoogleAuthGate
      page.tsx               ← home
      gallery/
      survey-admin/[slug]/   ← NEW — replaces /survey/[slug]/admin/ with Google auth
    artifact/
      [uuid]/                ← dynamic route, layout applies AnonAuthGate
        page.tsx             ← fetches Firestore doc → renders component by slug
        survey/              ← survey artifact pages (anon visible)
          [slug]/
            page.tsx

Data:
  Firestore collection: prototypes/{uuid}
    All PrototypeManifest fields + createdAt (serverTimestamp)
    id field = UUID used in /artifact/[uuid] URL

  Firestore collection: survey_responses/{responseId}
    surveySlug, answers, submittedAt, sessionId (anon uid)

Auth:
  Google sign-in → verify email ends with @buildkinship.com → allow internal routes
  Anonymous sign-in → silent on /artifact/* → enables Firestore writes (survey submissions)
  Admin SDK (server-side) → used by API routes + Hermes MCP tool
```

---

## Pre-flight (Azim must do before implementation starts)

- [ ] Download Firebase service account JSON: Firebase Console → Project Settings → Service accounts → Generate new private key → save as `/home/kinship/firebase-service-account.json` (chmod 600)
- [ ] Update Firestore rules in Firebase Console to use `prototypes` and `survey_responses` collections (see Phase 7)
- [ ] Add `FIREBASE_SERVICE_ACCOUNT_JSON` (one-line JSON) to `/home/kinship/.env`

Hermes can do everything else.

---

## Phase 1 — Firebase SDK Setup

### Task 1.1: Install Firebase packages

```bash
cd /home/kinship/hermes-prototype-base
pnpm add firebase firebase-admin
```

Verify both appear in `package.json` dependencies.

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: install firebase + firebase-admin"
```

---

### Task 1.2: Create Firebase client config

**Create: `lib/firebase/client.ts`**

```typescript
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db   = getFirestore(app);
```

**Create: `lib/firebase/firestore.ts`** — typed helpers for the `prototypes` collection

```typescript
import {
  collection, doc, addDoc, getDoc, getDocs,
  updateDoc, query, orderBy, serverTimestamp,
  type DocumentReference,
} from "firebase/firestore";
import { db } from "./client";
import type { PrototypeManifest } from "@/types/manifest";

export type FirestorePrototype = PrototypeManifest & { createdAt?: unknown };

const COL = "prototypes";

export async function createPrototype(data: Omit<FirestorePrototype, "createdAt">): Promise<string> {
  const ref: DocumentReference = await addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getPrototype(uuid: string): Promise<FirestorePrototype | null> {
  const snap = await getDoc(doc(db, COL, uuid));
  if (!snap.exists()) return null;
  return snap.data() as FirestorePrototype;
}

export async function listPrototypes(): Promise<(FirestorePrototype & { id: string })[]> {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as FirestorePrototype) }));
}

export async function updatePrototype(uuid: string, data: Partial<FirestorePrototype>): Promise<void> {
  await updateDoc(doc(db, COL, uuid), data);
}
```

**Create: `lib/firebase/survey-store.ts`** — replaces in-memory `lib/survey-store.ts`

```typescript
// Firestore-backed survey response store
// Replaces the in-memory lib/survey-store.ts

import {
  collection, addDoc, getDocs, query,
  where, orderBy, serverTimestamp,
} from "firebase/firestore";
import { db } from "./client";
import type { SurveyResponse } from "@/lib/survey-store"; // re-use type

const COL = "survey_responses";

export async function addResponseFirestore(
  slug: string,
  answers: Record<string, string | string[] | number>,
  anonUid?: string
): Promise<SurveyResponse> {
  const response = {
    surveySlug: slug,
    answers,
    submittedAt: new Date().toISOString(),
    sessionId: anonUid ?? null,
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, COL), response);
  return { id: ref.id, surveySlug: slug, submittedAt: response.submittedAt, answers };
}

export async function getResponsesFirestore(slug: string): Promise<SurveyResponse[]> {
  const q = query(
    collection(db, COL),
    where("surveySlug", "==", slug),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    surveySlug: d.data().surveySlug,
    submittedAt: d.data().submittedAt,
    answers: d.data().answers,
  }));
}
```

```bash
git add lib/firebase/
git commit -m "feat(firebase): client SDK init + Firestore helpers for prototypes + survey responses"
```

---

### Task 1.3: Create Firebase Admin SDK (server-side)

**Create: `lib/firebase/admin.ts`**

```typescript
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON env var not set");
  return JSON.parse(raw);
}

const adminApp = getApps().length > 0
  ? getApps()[0]
  : initializeApp({ credential: cert(getServiceAccount()) });

export const adminDb   = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);
```

```bash
git add lib/firebase/admin.ts
git commit -m "feat(firebase): admin SDK init"
```

---

### Task 1.4: Environment variables

**Create: `.env.local`** (from Firebase config in screenshot + service account)

```bash
# Client SDK — safe to expose
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCr_KWYv9xtunE80j4dJpyd6tCnr2avlWg
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=kinship-prototyper.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=kinship-prototyper
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=kinship-prototyper.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=56591275001
NEXT_PUBLIC_FIREBASE_APP_ID=1:56591275001:web:9f8542fa94641df0ada328
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-SX8CC3MRKK

# Server-side only — never expose
FIREBASE_SERVICE_ACCOUNT_JSON=<paste one-line JSON from /home/kinship/firebase-service-account.json>
PROTOTYPE_ADMIN_SECRET=<openssl rand -hex 16>
```

**Create: `.env.local.example`** (committed, no values — template for future agents)

**Add all vars to Vercel:**
```bash
cd /home/kinship/hermes-prototype-base

# Public vars (production + preview + development)
for KEY in NEXT_PUBLIC_FIREBASE_API_KEY NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN \
           NEXT_PUBLIC_FIREBASE_PROJECT_ID NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET \
           NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID NEXT_PUBLIC_FIREBASE_APP_ID \
           NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID; do
  vercel env add $KEY production --scope buildkinship
done

# Secret vars (production only)
vercel env add FIREBASE_SERVICE_ACCOUNT_JSON production --scope buildkinship
vercel env add PROTOTYPE_ADMIN_SECRET production --scope buildkinship
```

```bash
git add .env.local.example
git commit -m "chore: add firebase env var template"
```

---

## Phase 2 — Authentication Provider + Guards

### Task 2.1: AuthProvider context

**Create: `components/auth/AuthProvider.tsx`**

```typescript
"use client";
// Manages Firebase Auth state for the whole app

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged, signInWithPopup, GoogleAuthProvider,
  signInAnonymously, signOut, type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isGoogleUser: boolean;
  isBuildkinshipUser: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAnon: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); }), []);

  const isGoogleUser = user?.providerData?.some((p) => p.providerId === "google.com") ?? false;
  const isBuildkinshipUser = isGoogleUser && (user?.email?.endsWith("@buildkinship.com") ?? false);

  return (
    <AuthContext.Provider value={{
      user, loading, isGoogleUser, isBuildkinshipUser,
      signInWithGoogle: async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ hd: "buildkinship.com" });
        await signInWithPopup(auth, provider);
      },
      signInAnon: async () => { await signInAnonymously(auth); },
      logout: async () => { await signOut(auth); },
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
```

```bash
git add components/auth/AuthProvider.tsx
git commit -m "feat(auth): AuthProvider with Google + anonymous sign-in"
```

---

### Task 2.2: Route guard components

**Create: `components/auth/GoogleAuthGate.tsx`**

```typescript
"use client";
// Guards internal pages — requires @buildkinship.com Google sign-in

import { useAuth } from "./AuthProvider";

export function GoogleAuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, isBuildkinshipUser, signInWithGoogle } = useAuth();

  if (loading) return <FullPageSpinner />;

  if (!isBuildkinshipUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[var(--kinship-ink)]">
        <div className="text-center">
          <h1 className="text-[var(--kinship-cream)] text-2xl font-semibold mb-2">Kinship Internal</h1>
          <p className="text-[var(--kinship-dim)] text-sm">This area is for @buildkinship.com team members only.</p>
        </div>
        <button
          onClick={signInWithGoogle}
          className="px-6 py-3 bg-white text-[var(--kinship-ink)] rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors flex items-center gap-2"
        >
          {/* Google G SVG */}
          Sign in with Google
        </button>
        {user && !isBuildkinshipUser && (
          <p className="text-red-400 text-xs">{user.email} is not a @buildkinship.com account.</p>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
```

**Create: `components/auth/AnonAuthGate.tsx`**

```typescript
"use client";
// Silently signs artifact visitors in anonymously — no UI shown to user

import { useEffect } from "react";
import { useAuth } from "./AuthProvider";

export function AnonAuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, signInAnon } = useAuth();

  useEffect(() => {
    if (!loading && !user) signInAnon().catch(console.error);
  }, [loading, user, signInAnon]);

  // Optimistic — show content immediately, auth fires in background
  if (loading) return <FullPageSpinner />;
  return <>{children}</>;
}
```

**Create: `components/auth/FullPageSpinner.tsx`** — shared spinner

```typescript
export function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--kinship-ink)]">
      <p className="text-[var(--kinship-dim)] text-sm">Loading…</p>
    </div>
  );
}
```

```bash
git add components/auth/
git commit -m "feat(auth): GoogleAuthGate, AnonAuthGate, FullPageSpinner"
```

---

### Task 2.3: Wire AuthProvider into root layout

**Modify: `app/layout.tsx`** — wrap with `<AuthProvider>`

```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";

// ... font setup unchanged ...

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

```bash
git add app/layout.tsx
git commit -m "feat(auth): wrap root layout in AuthProvider"
```

---

## Phase 3 — Route Structure Refactor

### Task 3.1: Create `app/(internal)/` route group

All non-artifact routes move here. The group layout applies `GoogleAuthGate`.

**Create: `app/(internal)/layout.tsx`**

```typescript
"use client";
// Applies Google auth gate to all internal routes

import { GoogleAuthGate } from "@/components/auth/GoogleAuthGate";
import type { ReactNode } from "react";

export default function InternalLayout({ children }: { children: ReactNode }) {
  return <GoogleAuthGate>{children}</GoogleAuthGate>;
}
```

**Move files (git mv):**
```bash
cd /home/kinship/hermes-prototype-base
mkdir -p app/\(internal\)/gallery
mkdir -p app/\(internal\)/survey-admin

git mv app/page.tsx app/\(internal\)/page.tsx
git mv app/gallery/page.tsx app/\(internal\)/gallery/page.tsx
git mv app/gallery/client.tsx app/\(internal\)/gallery/client.tsx  # if exists
```

Note: `app/home.tsx` stays at `app/home.tsx` — it's not a route, it's a component imported by `page.tsx`. No move needed.

```bash
git add -A
git commit -m "feat(routing): move internal pages to (internal) route group with GoogleAuthGate"
```

---

### Task 3.2: Create `/artifact/[uuid]` dynamic route

**Create: `app/artifact/layout.tsx`** — wraps ALL `/artifact/*` with AnonAuthGate

```typescript
"use client";
// Wraps all artifact routes — signs visitors in anonymously, silently

import { AnonAuthGate } from "@/components/auth/AnonAuthGate";
import type { ReactNode } from "react";

export default function ArtifactLayout({ children }: { children: ReactNode }) {
  return <AnonAuthGate>{children}</AnonAuthGate>;
}
```

**Create: `components/artifact/PrototypeRegistry.tsx`**

```typescript
// Registry maps slug → lazy-loaded component
// Add every new prototype slug here after building it

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// NOTE: These components are loaded only when needed — no bundle impact for unused slugs
const registry: Record<string, ComponentType> = {
  "colour-palette":          dynamic(() => import("@/app/colour-palette/page")),
  "type-scale":              dynamic(() => import("@/app/type-scale/page")),
  "pomodoro-timer":          dynamic(() => import("@/app/pomodoro-timer/page")),
  "kinship-brain-allhands":  dynamic(() => import("@/app/kinship-brain-allhands/page")),
  // Survey prototypes are served at /artifact/[uuid]/survey/[slug] — see Task 3.4
  // Add new prototypes below this line:
};

export function getPrototypeComponent(slug: string): ComponentType | null {
  return registry[slug] ?? null;
}
```

**Create: `app/artifact/[uuid]/page.tsx`**

```typescript
"use client";
// Fetches prototype from Firestore by UUID, renders the right component via registry

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPrototype, type FirestorePrototype } from "@/lib/firebase/firestore";
import { getPrototypeComponent } from "@/components/artifact/PrototypeRegistry";

export default function ArtifactPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const [proto, setProto] = useState<FirestorePrototype | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!uuid) return;
    getPrototype(uuid).then((p) => {
      if (!p) setNotFound(true);
      else setProto(p);
    });
  }, [uuid]);

  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--kinship-ink)]">
      <p className="text-[var(--kinship-dim)]">Prototype not found.</p>
    </div>
  );

  if (!proto) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--kinship-ink)]">
      <p className="text-[var(--kinship-dim)] text-sm">Loading…</p>
    </div>
  );

  const Component = getPrototypeComponent(proto.slug);
  if (!Component) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--kinship-ink)]">
      <p className="text-[var(--kinship-dim)] text-sm">
        No component registered for: {proto.slug}
      </p>
    </div>
  );

  return <Component />;
}
```

```bash
git add app/artifact/ components/artifact/
git commit -m "feat(routing): /artifact/[uuid] dynamic route + PrototypeRegistry"
```

---

### Task 3.3: Create `/survey-admin/[slug]` — Google-auth-gated survey results

This replaces the old `app/survey/[slug]/admin/` which was PIN-gated.

**Create: `app/(internal)/survey-admin/[slug]/page.tsx`**

```typescript
import { notFound } from "next/navigation";
import { getSurvey } from "@/mock/surveys";
import { SurveyAdminView } from "@/components/survey/survey-admin";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SurveyAdminPage({ params }: Props) {
  const { slug } = await params;
  const survey = getSurvey(slug);
  if (!survey) notFound();
  return <SurveyAdminView survey={survey} googleAuthGated />;
}
```

**Modify: `components/survey/survey-admin.tsx`**

Add `googleAuthGated?: boolean` prop. When true:
- Remove the `CodeGate` component entirely (no 4-digit PIN screen)
- Show results immediately (the `GoogleAuthGate` in the layout already enforced auth)
- Remove the `code` query param from the `/api/survey/[slug]/responses` fetch call

**Modify: `app/api/survey/[slug]/responses/route.ts`**

Replace the `?code=` PIN check with Firebase ID token verification:

```typescript
import { adminAuth } from "@/lib/firebase/admin";

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Verify Google auth via Bearer token
  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const email = decoded.email ?? "";
    if (!email.endsWith("@buildkinship.com")) {
      return NextResponse.json({ error: "Forbidden — buildkinship.com only" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const survey = getSurvey(slug);
  if (!survey) return NextResponse.json({ error: "Survey not found" }, { status: 404 });

  // Use Firestore instead of in-memory store
  const { getResponsesFirestore } = await import("@/lib/firebase/survey-store");
  const responses = await getResponsesFirestore(slug);
  return NextResponse.json({ responses, total: responses.length });
}
```

**Delete old PIN-gated admin route:**
```bash
git rm -r app/survey/[slug]/admin/
```

```bash
git add -A
git commit -m "feat(survey-admin): replace PIN gate with Google auth, move to (internal) route group"
```

---

### Task 3.4: Move survey artifact to `/artifact/[uuid]/survey/[slug]`

The survey form (what external users fill out) moves under `/artifact/`.

**Create: `app/artifact/[uuid]/survey/[slug]/page.tsx`**

```typescript
// Survey artifact page — served under /artifact/[uuid]/survey/[slug]
// [uuid] is the prototype's Firestore UUID; [slug] is the survey definition slug
// AnonAuthGate is applied by app/artifact/layout.tsx — anon user is signed in before this renders

import { notFound } from "next/navigation";
import { getSurvey } from "@/mock/surveys";
import { SurveyEngine } from "@/components/survey/survey-engine";

interface Props {
  params: Promise<{ uuid: string; slug: string }>;
}

export default async function SurveyArtifactPage({ params }: Props) {
  const { slug } = await params;
  const survey = getSurvey(slug);
  if (!survey) notFound();
  return <SurveyEngine survey={survey} />;
}
```

**Modify: `components/survey/survey-engine.tsx`**

Update the submit handler to use `addResponseFirestore` from `lib/firebase/survey-store.ts` instead of the old `/api/survey/[slug]/submit` POST (which used in-memory store). Pass the anon user's `uid` as `sessionId`.

**Modify: `app/api/survey/[slug]/submit/route.ts`**

Update to write to Firestore instead of in-memory store:
```typescript
import { addResponseFirestore } from "@/lib/firebase/survey-store";
// replace: addResponse(slug, answers)
// with:    await addResponseFirestore(slug, answers, /* anonUid from auth header if passed */)
```

**Update PrototypeRegistry.tsx:**

Survey prototypes are NOT in the main `[uuid]` registry (they use a nested route `/artifact/[uuid]/survey/[slug]`). The registry entry for a survey prototype should redirect there. Or simpler: survey prototypes get their own Firestore doc with `type: "survey"` and the `artifact/[uuid]/page.tsx` checks for this type and redirects to `/artifact/[uuid]/survey/[slug]`.

```typescript
// In app/artifact/[uuid]/page.tsx, after fetching proto:
if (proto.type === "survey" && proto.survey_slug) {
  redirect(`/artifact/${uuid}/survey/${proto.survey_slug}`);
}
```

Add `survey_slug?: string` to `types/manifest.ts`.

```bash
git add -A
git commit -m "feat(routing): move survey artifact to /artifact/[uuid]/survey/[slug], write responses to Firestore"
```

---

## Phase 4 — Firestore as Gallery Source of Truth

### Task 4.1: Update gallery to read from Firestore

**Modify: `app/(internal)/gallery/page.tsx`**

Currently: server component using `readFileSync` at build time.  
New: client component fetching from Firestore at runtime.

```typescript
"use client";
// Client component — fetches prototypes from Firestore at runtime

import { useEffect, useState } from "react";
import { listPrototypes } from "@/lib/firebase/firestore";
import type { FirestorePrototype } from "@/lib/firebase/firestore";
import { GalleryClient } from "./client";

export default function GalleryPage() {
  const [prototypes, setPrototypes] = useState<(FirestorePrototype & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listPrototypes().then((p) => { setPrototypes(p); setLoading(false); });
  }, []);

  if (loading) return <div className="p-8 text-[var(--kinship-dim)]">Loading gallery…</div>;

  // Remap: url in Firestore may still be old slug URL.
  // For the gallery, the card link should go to /artifact/[id] (the Firestore UUID)
  const manifests = prototypes.map((p) => ({
    ...p,
    url: `/artifact/${p.id}`,          // always UUID-based
    slug: p.slug,                       // keep slug for thumbnails etc.
  }));

  return <GalleryClient prototypes={manifests} />;
}
```

**Modify: `app/(internal)/gallery/client.tsx`**

Update `GalleryClient` to accept the remapped manifests. The `url` field is now `/artifact/[uuid]`. Update any hardcoded slug-based links.

```bash
git add app/\(internal\)/gallery/
git commit -m "feat(gallery): read from Firestore instead of manifest files"
```

---

### Task 4.2: Prototype CRUD API routes (for Hermes MCP tool)

**Create: `app/api/prototypes/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

function authorized(req: NextRequest) {
  return req.headers.get("authorization") === `Bearer ${process.env.PROTOTYPE_ADMIN_SECRET}`;
}

// POST /api/prototypes → { uuid }
export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const ref = await adminDb.collection("prototypes").add({
    ...body,
    createdAt: FieldValue.serverTimestamp(),
  });
  return NextResponse.json({ uuid: ref.id }, { status: 201 });
}

// GET /api/prototypes → { prototypes: [...] }
export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const snap = await adminDb.collection("prototypes").orderBy("createdAt", "desc").get();
  return NextResponse.json({ prototypes: snap.docs.map((d) => ({ id: d.id, ...d.data() })) });
}
```

**Create: `app/api/prototypes/[uuid]/route.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

function authorized(req: NextRequest) {
  return req.headers.get("authorization") === `Bearer ${process.env.PROTOTYPE_ADMIN_SECRET}`;
}

export async function GET(req: NextRequest, { params }: { params: { uuid: string } }) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const d = await adminDb.collection("prototypes").doc(params.uuid).get();
  if (!d.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ id: d.id, ...d.data() });
}

export async function PATCH(req: NextRequest, { params }: { params: { uuid: string } }) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  await adminDb.collection("prototypes").doc(params.uuid).update(body);
  return NextResponse.json({ success: true });
}
```

```bash
git add app/api/prototypes/
git commit -m "feat(api): prototype CRUD routes with admin bearer auth"
```

---

### Task 4.3: Seed existing prototypes into Firestore

**Create: `scripts/seed-prototypes.ts`**

```typescript
// One-time migration: reads prototypes/*/manifest.json → Firestore
// Run: FIREBASE_SERVICE_ACCOUNT_JSON="$(cat ~/firebase-service-account.json)" npx tsx scripts/seed-prototypes.ts

import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON!)) });
const db = getFirestore();

async function seed() {
  const dir = join(process.cwd(), "prototypes");
  const slugs = readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory()).map((d) => d.name);

  for (const slug of slugs) {
    const path = join(dir, slug, "manifest.json");
    if (!existsSync(path)) continue;
    const manifest = JSON.parse(readFileSync(path, "utf-8"));

    const existing = await db.collection("prototypes").where("slug", "==", slug).get();
    if (!existing.empty) {
      console.log(`⏭  ${slug} — already seeded → ${existing.docs[0].id}`);
      continue;
    }

    const ref = await db.collection("prototypes").add({
      ...manifest,
      createdAt: manifest.created_at ? new Date(manifest.created_at) : new Date(),
    });
    console.log(`✅ ${slug} → UUID: ${ref.id}`);
    console.log(`   Artifact URL: https://quick.buildkinship.dev/artifact/${ref.id}`);
  }
}

seed().catch(console.error).finally(() => process.exit(0));
```

**Run the migration:**
```bash
cd /home/kinship/hermes-prototype-base
FIREBASE_SERVICE_ACCOUNT_JSON="$(cat /home/kinship/firebase-service-account.json)" npx tsx scripts/seed-prototypes.ts
```

Capture the UUID output — needed to update short links:
```bash
# Update each short link from slug → UUID-based URL
PY=/home/kinship/.hermes/hermes-agent/venv/bin/python3

# Example for colour-palette (replace UUID with actual output from seed):
$PY /home/kinship/.hermes/scripts/shlink_shorten.py delete colour-palette
$PY /home/kinship/.hermes/scripts/shlink_shorten.py shorten \
  --url "https://quick.buildkinship.dev/artifact/<UUID>" \
  --slug "colour-palette" \
  --title "Kinship Colour Palette"
# Repeat for each prototype
```

```bash
git add scripts/seed-prototypes.ts
git commit -m "feat(migration): seed script for existing prototypes → Firestore"
```

---

## Phase 5 — Hermes MCP Tool (Firebase Admin)

### Task 5.1: Create MCP server

**Create: `~/firebase-admin-mcp/server.py`**

```python
#!/usr/bin/env python3
"""Firebase Admin MCP server — lets Hermes manage the kinship-prototyper Firestore."""
import json, os, asyncio
from datetime import datetime, timezone

import firebase_admin
from firebase_admin import credentials, firestore
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp import types

# ─── Init ────────────────────────────────────────────────────────────
sa_json = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON")
if not sa_json:
    raise RuntimeError("FIREBASE_SERVICE_ACCOUNT_JSON env var required")
firebase_admin.initialize_app(credentials.Certificate(json.loads(sa_json)))
db = firestore.client()
server = Server("firebase-admin")
BASE_URL = "https://quick.buildkinship.dev"

# ─── Tool definitions ─────────────────────────────────────────────────
@server.list_tools()
async def list_tools():
    return [
        types.Tool(
            name="create_prototype",
            description=(
                "Create a new prototype document in Firestore. "
                "Call this FIRST when starting a new prototype — before writing any code. "
                "Returns the UUID to use in the artifact URL: /artifact/{uuid}."
            ),
            inputSchema={
                "type": "object",
                "properties": {
                    "data": {
                        "type": "object",
                        "description": (
                            "Prototype manifest fields: slug (string), name (string), "
                            "description (string), prompt (string), type (slide|animation|3d|dashboard|survey|other), "
                            "tags (string[]), branch (string), created_by_name (string), "
                            "created_by_slack_id (string). Other fields can be patched later."
                        )
                    }
                },
                "required": ["data"]
            }
        ),
        types.Tool(
            name="get_prototype",
            description="Fetch a prototype document by its Firestore UUID.",
            inputSchema={
                "type": "object",
                "properties": {"uuid": {"type": "string"}},
                "required": ["uuid"]
            }
        ),
        types.Tool(
            name="list_prototypes",
            description="List all prototypes, newest first. Returns id, slug, name, url, created_at for each.",
            inputSchema={"type": "object", "properties": {}}
        ),
        types.Tool(
            name="update_prototype",
            description="Partially update a prototype document (e.g. add full manifest data after build).",
            inputSchema={
                "type": "object",
                "properties": {
                    "uuid": {"type": "string"},
                    "data": {"type": "object", "description": "Fields to update (merged, not replaced)"}
                },
                "required": ["uuid", "data"]
            }
        ),
        types.Tool(
            name="get_artifact_url",
            description="Get the public artifact URL for a prototype UUID.",
            inputSchema={
                "type": "object",
                "properties": {"uuid": {"type": "string"}},
                "required": ["uuid"]
            }
        ),
        types.Tool(
            name="list_survey_responses",
            description="List all Firestore survey responses for a given survey slug.",
            inputSchema={
                "type": "object",
                "properties": {
                    "slug": {"type": "string", "description": "Survey slug (from mock/surveys.ts)"}
                },
                "required": ["slug"]
            }
        ),
    ]

# ─── Tool handlers ────────────────────────────────────────────────────
@server.call_tool()
async def call_tool(name: str, arguments: dict):
    def text(obj) -> list[types.TextContent]:
        return [types.TextContent(type="text", text=json.dumps(obj, default=str))]

    if name == "create_prototype":
        data = {**arguments["data"], "createdAt": datetime.now(timezone.utc).isoformat()}
        ts, ref = db.collection("prototypes").add(data)
        uuid = ref.id
        return text({"uuid": uuid, "artifact_url": f"{BASE_URL}/artifact/{uuid}"})

    elif name == "get_prototype":
        doc = db.collection("prototypes").document(arguments["uuid"]).get()
        if not doc.exists:
            return text({"error": "not found"})
        return text({"id": doc.id, **doc.to_dict()})

    elif name == "list_prototypes":
        docs = db.collection("prototypes").order_by(
            "createdAt", direction=firestore.Query.DESCENDING
        ).get()
        return text([{"id": d.id, **{k: v for k, v in d.to_dict().items()
                                     if k in ("slug","name","url","created_at","type","tags")}}
                     for d in docs])

    elif name == "update_prototype":
        db.collection("prototypes").document(arguments["uuid"]).update(arguments["data"])
        return text({"success": True})

    elif name == "get_artifact_url":
        return text({"artifact_url": f"{BASE_URL}/artifact/{arguments['uuid']}"})

    elif name == "list_survey_responses":
        docs = (db.collection("survey_responses")
                .where("surveySlug", "==", arguments["slug"])
                .order_by("createdAt", direction=firestore.Query.DESCENDING)
                .get())
        return text([{"id": d.id, **d.to_dict()} for d in docs])

    return text({"error": f"unknown tool: {name}"})

async def main():
    async with stdio_server() as (read, write):
        await server.run(read, write, server.create_initialization_options())

if __name__ == "__main__":
    asyncio.run(main())
```

**Setup:**
```bash
mkdir -p ~/firebase-admin-mcp
cd ~/firebase-admin-mcp
python3 -m venv venv
./venv/bin/pip install firebase-admin mcp
```

---

### Task 5.2: Register in Hermes config

**Modify: `~/.hermes/config.yaml`** — add to `mcp_servers`:

```yaml
mcp_servers:
  firebase-admin:
    command: /home/kinship/firebase-admin-mcp/venv/bin/python
    args: [/home/kinship/firebase-admin-mcp/server.py]
    env:
      FIREBASE_SERVICE_ACCOUNT_JSON: "${FIREBASE_SERVICE_ACCOUNT_JSON}"
```

The `FIREBASE_SERVICE_ACCOUNT_JSON` var must be in `/home/kinship/.env` (Hermes sources this at startup).

---

## Phase 6 — Update Harness + Skill

### Task 6.1: Update `CLAUDE.md`

Key changes to make on `main`:
1. Project structure section → add `lib/firebase/`, `components/auth/`, `app/artifact/`
2. Remove "No auth systems" from Golden Rules
3. New rule: "All new prototype pages go under `app/<slug>/page.tsx` AND must be registered in `components/artifact/PrototypeRegistry.tsx`"
4. New workflow section: "New prototype data flow: create Firestore doc (get UUID) → build component → register in PrototypeRegistry → URL is `/artifact/[UUID]`"
5. Survey admin note: "Survey results are at `/survey-admin/[slug]` (Google auth). Survey form is at `/artifact/[uuid]/survey/[slug]` (anon auth)."

### Task 6.2: Update `vercel-prototype-workflow` skill

Key changes:
1. Step 0 (new, first step): "Call `create_prototype` MCP tool → get UUID → artifact URL is `https://quick.buildkinship.dev/artifact/{UUID}`"
2. Gallery manifest step: "Call `update_prototype` MCP tool with full manifest data" (not `write manifest.json to main`)
3. Short link target: `https://quick.buildkinship.dev/artifact/{UUID}` 
4. No more manifest commits to `main` — gallery reads from Firestore
5. After build: call `update_prototype` with `branch`, `url`, `short_url`, `thumbnail`, `full_prompt`, `design_decisions`, `tech_notes`, `slack_thread`

---

## Phase 7 — Firestore Rules

Update in Firebase Console → Firestore → Rules tab:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() {
      return request.auth != null;
    }

    function isGoogleUser() {
      return isSignedIn()
        && request.auth.token.firebase.sign_in_provider == 'google.com';
    }

    function isBuildkinshipUser() {
      return isGoogleUser()
        && request.auth.token.email.matches('.*@buildkinship\\.com');
    }

    // Prototype metadata — readable by anyone signed in (anon or google)
    // Only Hermes (via Admin SDK, which bypasses rules) writes these
    match /prototypes/{protoId} {
      allow read:           if isSignedIn();
      allow create, update: if isBuildkinshipUser();
      allow delete:         if isBuildkinshipUser();
    }

    // Survey responses — anonymous users can submit, only buildkinship can read
    match /survey_responses/{responseId} {
      allow create: if isSignedIn();        // anonymous OR google
      allow read:   if isBuildkinshipUser(); // internal only
      allow delete: if isBuildkinshipUser();
    }
  }
}
```

> Note: Admin SDK calls bypass these rules entirely (it uses service account credentials). The rules above govern client-side Firebase SDK calls only.

---

## Checklist — Implementation Order

- [ ] **Phase 1** — Firebase SDK: `pnpm add`, client/admin config, env vars, Vercel env vars
- [ ] **Phase 2** — Auth: AuthProvider, GoogleAuthGate, AnonAuthGate, wire into layout
- [ ] **Phase 3** — Routes: `(internal)/` group, `/artifact/[uuid]/`, `/survey-admin/`, survey artifact move
- [ ] **Phase 4** — Firestore gallery, prototype API routes, seed migration, update short links
- [ ] **Phase 5** — MCP server setup + Hermes config registration
- [ ] **Phase 6** — Update CLAUDE.md + vercel-prototype-workflow skill
- [ ] **Phase 7** — Update Firestore rules in Firebase Console

**Blocked until Azim provides:**
- Firebase service account JSON (→ `/home/kinship/firebase-service-account.json`)
- `FIREBASE_SERVICE_ACCOUNT_JSON` added to `/home/kinship/.env`
