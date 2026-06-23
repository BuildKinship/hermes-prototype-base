import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

function getServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON env var not set");
  return JSON.parse(raw);
}

const adminApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({ credential: cert(getServiceAccount()) });

export const adminDb   = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);
