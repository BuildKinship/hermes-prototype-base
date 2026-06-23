import { NextRequest, NextResponse } from "next/server";
import { getSurvey } from "@/mock/surveys";
import { addResponseFirestore } from "@/lib/firebase/survey-store";

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
    sessionId?: string;
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

  // Write to Firestore — persists across cold starts
  const response = await addResponseFirestore(
    slug,
    body.answers,
    body.sessionId // anon uid from the client, optional
  );
  return NextResponse.json({ success: true, id: response.id }, { status: 201 });
}
