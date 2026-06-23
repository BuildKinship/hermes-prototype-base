export const runtime = 'nodejs';
// GET /api/survey/[slug]/responses
// Protected — requires Firebase ID token from a @buildkinship.com Google user
// Uses Admin SDK to read from Firestore (server-side)

import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { getSurvey } from "@/mock/surveys";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Verify Firebase ID token — must be a @buildkinship.com Google user
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const adminAuth = await getAdminAuth();
    const decoded = await adminAuth.verifyIdToken(token);
    const email = decoded.email ?? "";
    if (!email.endsWith("@buildkinship.com")) {
      return NextResponse.json(
        { error: "Forbidden — @buildkinship.com only" },
        { status: 403 }
      );
    }
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const survey = getSurvey(slug);
  if (!survey) {
    return NextResponse.json({ error: "Survey not found" }, { status: 404 });
  }

  try {
    const db = await getAdminDb();
    const snap = await db
      .collection("survey_responses")
      .where("surveySlug", "==", slug)
      .get();

    const responses = snap.docs
      .map((d) => ({
        id: d.id,
        surveySlug: d.data().surveySlug as string,
        submittedAt: d.data().submittedAt as string,
        answers: d.data().answers as Record<string, string | string[] | number>,
        sessionId: d.data().sessionId as string | null,
      }))
      // Sort newest first — no composite index needed with admin SDK
      .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));

    return NextResponse.json({ responses, total: responses.length });
  } catch (err) {
    console.error("Responses fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch responses" },
      { status: 500 }
    );
  }
}
