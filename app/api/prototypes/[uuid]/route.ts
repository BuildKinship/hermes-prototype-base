export const runtime = 'nodejs'

import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";

function authorized(req: NextRequest) {
  return (
    req.headers.get("authorization") ===
    `Bearer ${process.env.PROTOTYPE_ADMIN_SECRET}`
  );
}

interface RouteParams {
  params: Promise<{ uuid: string }>;
}

// GET /api/prototypes/[uuid]
export async function GET(req: NextRequest, { params }: RouteParams) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { uuid } = await params;
    const db = await getAdminDb();
    const d = await db.collection("prototypes").doc(uuid).get();
    if (!d.exists) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ id: d.id, ...d.data() });
  } catch (e) {
    const err = e as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH /api/prototypes/[uuid] — partial update
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { uuid } = await params;
    const body = await req.json();
    const db = await getAdminDb();
    await db.collection("prototypes").doc(uuid).update(body);
    return NextResponse.json({ success: true });
  } catch (e) {
    const err = e as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/prototypes/[uuid]
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { uuid } = await params;
    const db = await getAdminDb();
    await db.collection("prototypes").doc(uuid).delete();
    return NextResponse.json({ success: true });
  } catch (e) {
    const err = e as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
