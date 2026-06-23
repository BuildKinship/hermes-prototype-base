export const runtime = 'nodejs';
// Temporary debug endpoint — DELETE after diagnosing token issue
// GET /api/debug-token with Authorization: Bearer <token>

import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  try {
    const adminAuth = await getAdminAuth();
    const decoded = await adminAuth.verifyIdToken(token);
    return NextResponse.json({
      ok: true,
      uid: decoded.uid,
      email: decoded.email,
      provider: decoded.firebase?.sign_in_provider,
      emailVerified: decoded.email_verified,
      tokenLength: token.length,
      tokenPrefix: token.slice(0, 20),
    });
  } catch (err: unknown) {
    const e = err as { code?: string; message?: string };
    return NextResponse.json({
      ok: false,
      error: e?.message,
      code: e?.code,
      tokenLength: token.length,
      tokenPrefix: token.slice(0, 20),
    }, { status: 401 });
  }
}
