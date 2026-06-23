"use client";
// Gallery page — reads prototype list from Firestore at runtime
// Replaces the old readFileSync approach (build-time manifest files)
// Protected by GoogleAuthGate in app/(internal)/layout.tsx

import { useEffect, useState } from "react";
import type { Metadata } from "next";
import type { PrototypeManifest } from "@/types/manifest";
import { listPrototypes } from "@/lib/firebase/firestore";
import { GalleryClient } from "./client";

export default function GalleryPage() {
  const [manifests, setManifests] = useState<PrototypeManifest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listPrototypes().then((prototypes) => {
      // Remap: artifact URL is always /artifact/[firestoreId]
      const remapped = prototypes.map((p) => ({
        ...p,
        url: `/artifact/${p.id}`,
        // Admin URL points to /survey-admin/[slug] for survey prototypes
        admin_url:
          p.type === "survey" && (p as PrototypeManifest & { survey_slug?: string }).survey_slug
            ? `/survey-admin/${(p as PrototypeManifest & { survey_slug?: string }).survey_slug}`
            : p.admin_url,
      })) as PrototypeManifest[];
      setManifests(remapped);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--kinship-cream)]">
        <p className="text-[var(--kinship-mid)] text-sm">Loading gallery…</p>
      </div>
    );
  }

  return <GalleryClient manifests={manifests} />;
}
