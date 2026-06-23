import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

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

  const { uuid } = await params;
  const d = await adminDb.collection("prototypes").doc(uuid).get();

  if (!d.exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ id: d.id, ...d.data() });
}

// PATCH /api/prototypes/[uuid] — partial update
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { uuid } = await params;
  const body = await req.json();
  await adminDb.collection("prototypes").doc(uuid).update(body);

  return NextResponse.json({ success: true });
}

// DELETE /api/prototypes/[uuid]
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { uuid } = await params;
  await adminDb.collection("prototypes").doc(uuid).delete();

  return NextResponse.json({ success: true });
}
