export const runtime = 'nodejs'

import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

function authorized(req: NextRequest) {
  return (
    req.headers.get("authorization") ===
    `Bearer ${process.env.PROTOTYPE_ADMIN_SECRET}`
  );
}

// POST /api/prototypes — create a new prototype document
// Returns: { uuid: string }
export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const db = getAdminDb();
    const ref = await db.collection("prototypes").add({
      ...body,
      createdAt: FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ uuid: ref.id }, { status: 201 });
  } catch (e) {
    const err = e as Error;
    return NextResponse.json(
      { error: err.message, stack: err.stack?.split("\n").slice(0, 4).join(" | ") },
      { status: 500 }
    );
  }
}

// GET /api/prototypes — list all prototypes (newest first)
export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getAdminDb();
    const snap = await db
      .collection("prototypes")
      .orderBy("createdAt", "desc")
      .get();
    const prototypes = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ prototypes });
  } catch (e) {
    const err = e as Error;
    return NextResponse.json(
      { error: err.message, stack: err.stack?.split("\n").slice(0, 4).join(" | ") },
      { status: 500 }
    );
  }
}
