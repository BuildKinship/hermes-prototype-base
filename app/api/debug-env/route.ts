import { NextResponse } from "next/server";

export async function GET() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    return NextResponse.json({ error: "FIREBASE_SERVICE_ACCOUNT_JSON not set" }, { status: 500 });
  }

  const len = raw.length;
  const firstChar = raw[0];
  const lastChar = raw[raw.length - 1];
  
  try {
    const parsed = JSON.parse(raw);
    return NextResponse.json({
      status: "ok",
      len,
      firstChar,
      lastChar,
      type: parsed.type,
      project_id: parsed.project_id,
    });
  } catch (e) {
    return NextResponse.json({
      status: "json_error",
      error: (e as Error).message,
      len,
      firstChar: JSON.stringify(firstChar),
      lastChar: JSON.stringify(lastChar),
      preview: raw.substring(0, 50),
    }, { status: 500 });
  }
}
