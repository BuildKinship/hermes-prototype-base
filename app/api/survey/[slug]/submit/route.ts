export const runtime = 'nodejs';
// POST /api/survey/[slug]/submit
// Public — no auth required (anonymous users submit surveys)
// Writes directly to Firestore via Admin SDK (server-side, no client SDK on server)

import { NextRequest, NextResponse } from "next/server";
import { getSurvey } from "@/mock/surveys";
import { getAdminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const survey = getSurvey(slug);

  if (!survey) {
    return NextResponse.json({ error: "Survey not found" }, { status: 404 });
  }

  let body: {
    answers: Record<string, string | string[] | number>;
    sessionId?: string | null;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.answers || typeof body.answers !== "object") {
    return NextResponse.json(
      { error: "answers field required" },
      { status: 400 }
    );
  }

  // Server-side validation of required fields
  for (const question of survey.questions) {
    if (!question.required) continue;
    const answer = body.answers[question.id];
    if (answer === undefined || answer === null || answer === "") {
      return NextResponse.json(
        { error: `Question "${question.id}" is required` },
        { status: 422 }
      );
    }
    if (Array.isArray(answer) && answer.length === 0) {
      return NextResponse.json(
        { error: `Question "${question.id}" requires at least one selection` },
        { status: 422 }
      );
    }
  }

  try {
    const db = await getAdminDb();
    const submittedAt = new Date().toISOString();
    const ref = await db.collection("survey_responses").add({
      surveySlug: slug,
      answers: body.answers,
      submittedAt,
      sessionId: body.sessionId ?? null,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, id: ref.id }, { status: 201 });
  } catch (err) {
    console.error("Survey submit error:", err);
    return NextResponse.json(
      { error: "Failed to save response" },
      { status: 500 }
    );
  }
}
