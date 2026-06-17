import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import type { Metadata } from "next";
import type { PrototypeManifest } from "@/types/manifest";
import { GalleryClient } from "./client";

export const metadata: Metadata = {
  title: "Prototype Gallery — Kinship",
  description: "Every prototype built by the Kinship team, in one place.",
};

function loadManifests(): PrototypeManifest[] {
  const prototypesDir = join(process.cwd(), "prototypes");
  if (!existsSync(prototypesDir)) return [];

  const slugs = readdirSync(prototypesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const manifests: PrototypeManifest[] = [];

  for (const slug of slugs) {
    const manifestPath = join(prototypesDir, slug, "manifest.json");
    if (!existsSync(manifestPath)) continue;
    try {
      const raw = readFileSync(manifestPath, "utf-8");
      manifests.push(JSON.parse(raw) as PrototypeManifest);
    } catch {
      // skip malformed manifests silently
    }
  }

  // newest first by default
  return manifests.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export default function GalleryPage() {
  const manifests = loadManifests();
  return <GalleryClient manifests={manifests} />;
}
