import { NextResponse } from "next/server";

export async function GET() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    return NextResponse.json({ error: "FIREBASE_SERVICE_ACCOUNT_JSON not set" }, { status: 500 });
  }

  try {
    // Test 1: JSON parse
    const sa = JSON.parse(raw);
    
    // Test 2: Firebase Admin init
    const { initializeApp, getApps, cert } = await import("firebase-admin/app");
    const app = getApps().length > 0 ? getApps()[0] : initializeApp({ credential: cert(sa) });
    
    // Test 3: Firestore
    const { getFirestore } = await import("firebase-admin/firestore");
    const db = getFirestore(app);
    
    // Test 4: Simple collection access
    const snap = await db.collection("prototypes").limit(2).get();
    
    return NextResponse.json({
      status: "ok",
      project_id: sa.project_id,
      apps: getApps().length,
      prototypeCount: snap.size,
      docs: snap.docs.map(d => ({ id: d.id, name: (d.data() as {name?: string}).name })),
    });
  } catch (e) {
    return NextResponse.json({
      status: "error",
      error: (e as Error).message,
      stack: (e as Error).stack?.split('\n').slice(0, 5).join('\n'),
    }, { status: 500 });
  }
}
