// Firebase Admin SDK — async lazy init via dynamic imports
// Static imports of firebase-admin crash in some Vercel serverless environments.
// All firebase-admin modules are loaded dynamically on first use.

import type { Firestore } from "firebase-admin/firestore";
import type { Auth } from "firebase-admin/auth";

let _db: Firestore | null = null;
let _auth: Auth | null = null;
let _initialized = false;

async function initAdmin() {
  if (_initialized) return;

  const { initializeApp, getApps, cert } = await import("firebase-admin/app");

  if (getApps().length === 0) {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON env var is not set");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initializeApp({ credential: cert(JSON.parse(raw) as any) });
  }

  _initialized = true;
}

export async function getAdminDb(): Promise<Firestore> {
  if (_db) return _db;
  await initAdmin();
  const { getFirestore } = await import("firebase-admin/firestore");
  const { getApps } = await import("firebase-admin/app");
  _db = getFirestore(getApps()[0]);
  return _db;
}

export async function getAdminAuth(): Promise<Auth> {
  if (_auth) return _auth;
  await initAdmin();
  const { getAuth } = await import("firebase-admin/auth");
  const { getApps } = await import("firebase-admin/app");
  _auth = getAuth(getApps()[0]);
  return _auth;
}

// Legacy sync aliases kept for type compatibility — they throw at runtime
// if called before async init. Use getAdminDb()/getAdminAuth() instead.
export const adminDb = getAdminDb;
export const adminAuth = getAdminAuth;
