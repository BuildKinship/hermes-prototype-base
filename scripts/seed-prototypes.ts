#!/usr/bin/env tsx
// One-time migration: reads prototypes/*/manifest.json → Firestore
// Run: FIREBASE_SERVICE_ACCOUNT_JSON="$(cat ~/firebase-service-account.json)" npx tsx scripts/seed-prototypes.ts

import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const saJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!saJson) {
  console.error("Error: FIREBASE_SERVICE_ACCOUNT_JSON env var not set");
  process.exit(1);
}

initializeApp({ credential: cert(JSON.parse(saJson)) });
const db = getFirestore();

async function seed() {
  const dir = join(process.cwd(), "prototypes");
  if (!existsSync(dir)) {
    console.log("No prototypes/ directory found.");
    return;
  }

  const slugs = readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  console.log(`Found ${slugs.length} prototypes to seed.\n`);

  for (const slug of slugs) {
    const manifestPath = join(dir, slug, "manifest.json");
    if (!existsSync(manifestPath)) {
      console.log(`⏭  ${slug} — no manifest.json, skipping`);
      continue;
    }

    const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));

    // Check if already seeded (idempotent — safe to re-run)
    const existing = await db
      .collection("prototypes")
      .where("slug", "==", slug)
      .get();

    if (!existing.empty) {
      console.log(`⏭  ${slug} — already in Firestore (${existing.docs[0].id})`);
      console.log(
        `   Artifact URL: https://quick.buildkinship.dev/artifact/${existing.docs[0].id}`
      );
      continue;
    }

    const ref = await db.collection("prototypes").add({
      ...manifest,
      createdAt: manifest.created_at
        ? new Date(manifest.created_at)
        : new Date(),
    });

    console.log(`✅ ${slug}`);
    console.log(`   UUID:         ${ref.id}`);
    console.log(
      `   Artifact URL: https://quick.buildkinship.dev/artifact/${ref.id}`
    );
  }

  console.log("\nSeed complete.");
}

seed().catch(console.error).finally(() => process.exit(0));
