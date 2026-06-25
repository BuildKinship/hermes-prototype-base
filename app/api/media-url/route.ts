export const runtime = "nodejs";
// API route — generates a fresh presigned S3 URL for a gallery media asset.
// Called client-side whenever an image or video artifact card/drawer needs a src.
// Never stores presigned URLs — always generated on-demand so they're always valid.

import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const ENDPOINT  = process.env.RAILWAY_BUCKET_ENDPOINT  ?? "https://t3.storageapi.dev";
const REGION    = process.env.RAILWAY_BUCKET_REGION    ?? "auto";
const BUCKET    = process.env.RAILWAY_BUCKET_NAME      ?? "pow-assets-cxazxeo8pkpti";
const ACCESS    = process.env.RAILWAY_BUCKET_ACCESS_KEY;
const SECRET    = process.env.RAILWAY_BUCKET_SECRET_KEY;

// Singleton S3 client (reused across invocations in the same Edge worker)
let s3: S3Client | null = null;
function getS3() {
  if (!s3) {
    s3 = new S3Client({
      endpoint: ENDPOINT,
      region: REGION,
      credentials: {
        accessKeyId:     ACCESS ?? "",
        secretAccessKey: SECRET ?? "",
      },
      forcePathStyle: true,
    });
  }
  return s3;
}

export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "Missing ?key= parameter" }, { status: 400 });
  }

  if (!ACCESS || !SECRET) {
    return NextResponse.json(
      { error: "S3 credentials not configured on this deployment" },
      { status: 500 }
    );
  }

  // Sanitise key — no leading slashes, no path traversal
  const safeKey = key.replace(/^\/+/, "").replace(/\.\.\//g, "");

  try {
    const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: safeKey });
    // 1-hour expiry is plenty — the browser will cache it and reload the page long before it expires
    const url = await getSignedUrl(getS3(), cmd, { expiresIn: 3600 });
    return NextResponse.json({ url }, {
      headers: {
        // Cache this response for 50 minutes (safely within the 1h expiry)
        "Cache-Control": "public, max-age=3000, stale-while-revalidate=600",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
