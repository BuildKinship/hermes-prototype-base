import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

// Module-level initialization deferred to first use.
// Next.js "collecting page data" imports this module but does NOT call any
// Firestore/Auth methods — so this is safe to import without env vars.

let _db: Firestore | null = null;
let _auth: Auth | null = null;

function getApp() {
  if (getApps().length > 0) return getApps()[0];

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON env var is not set");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return initializeApp({ credential: cert(JSON.parse(raw) as any) });
}

export function getAdminDb(): Firestore {
  if (!_db) _db = getFirestore(getApp());
  return _db;
}

export function getAdminAuth(): Auth {
  if (!_auth) _auth = getAuth(getApp());
  return _auth;
}

// Convenience aliases — these look like the old module-level exports
// but are actually function calls. Callers must be updated to use
// getAdminDb().collection(...) or adminDb().collection(...).
// We export both names for compatibility.
export const adminDb   = getAdminDb;
export const adminAuth = getAdminAuth;
