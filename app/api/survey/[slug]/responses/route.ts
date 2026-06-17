import { NextRequest, NextResponse } from "next/server";
import { getSurvey } from "@/mock/surveys";
import { getResponses } from "@/lib/survey-store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const survey = getSurvey(slug);

  if (!survey) {
    return NextResponse.json({ error: "Survey not found" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (code !== survey.adminCode) {
    return NextResponse.json({ error: "Invalid admin code" }, { status: 403 });
  }

  const responses = getResponses(slug);
  return NextResponse.json({ responses, total: responses.length });
}
