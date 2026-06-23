import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

// Use a lazy singleton pattern — defer initialization until first call.
// This prevents Next.js build-time "collecting page data" from crashing
// when FIREBASE_SERVICE_ACCOUNT_JSON is not yet available in the build env.

let _initialized = false;

function ensureInit() {
  if (_initialized) return;

  if (getApps().length > 0) {
    _initialized = true;
    return;
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_JSON env var is not set. " +
        "Add it to Vercel environment variables or .env.local."
    );
  }

  let serviceAccount: object;
  try {
    serviceAccount = JSON.parse(raw);
  } catch (e) {
    throw new Error(
      `FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON: ${(e as Error).message}`
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initializeApp({ credential: cert(serviceAccount as any) });
  _initialized = true;
}

// These call ensureInit() on first property access via Proxy,
// so importing this module doesn't trigger initialization.
export const adminDb = new Proxy(
  {},
  {
    get(_target, prop) {
      ensureInit();
      const db = getFirestore(getApps()[0]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (db as any)[prop];
    },
  }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
) as ReturnType<typeof getFirestore>;

export const adminAuth = new Proxy(
  {},
  {
    get(_target, prop) {
      ensureInit();
      const auth = getAuth(getApps()[0]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (auth as any)[prop];
    },
  }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
) as ReturnType<typeof getAuth>;
