import { NextRequest, NextResponse } from "next/server";
import { getSurvey } from "@/mock/surveys";
import { getAdminAuth } from "@/lib/firebase/admin";
import { getResponsesFirestore } from "@/lib/firebase/survey-store";

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
    const decoded = await getAdminAuth().verifyIdToken(token);
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

  const responses = await getResponsesFirestore(slug);
  return NextResponse.json({ responses, total: responses.length });
}
