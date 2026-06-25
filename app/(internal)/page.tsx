"use client";
// Root internal page — shows the full artifact gallery with first-visit Help modal.
// Replaces the old home.tsx landing page.
// Protected by GoogleAuthGate in app/(internal)/layout.tsx

import { useEffect, useState } from "react";
import type { PrototypeManifest } from "@/types/manifest";
import { listPrototypes } from "@/lib/firebase/firestore";
import { useAuth } from "@/components/auth/AuthProvider";
import { GalleryClient } from "./gallery/client";

export default function Page() {
  const { user, loading: authLoading } = useAuth();
  const [manifests, setManifests] = useState<PrototypeManifest[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;

    setDataLoading(true);
    setError(null);

    listPrototypes()
      .then((prototypes) => {
        const remapped = prototypes.map((p) => ({
          ...p,
          url: `/artifact/${p.id}`,
          admin_url:
            p.type === "survey" && (p as PrototypeManifest & { survey_slug?: string }).survey_slug
              ? `/survey-admin/${(p as PrototypeManifest & { survey_slug?: string }).survey_slug}`
              : p.admin_url,
        })) as PrototypeManifest[];
        setManifests(remapped);
        setDataLoading(false);
      })
      .catch((err) => {
        console.error("Gallery Firestore error:", err);
        setError(err?.message ?? String(err));
        setDataLoading(false);
      });
  }, [user, authLoading]);

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--kinship-cream)]">
        <p className="text-[var(--kinship-mid)] text-sm">Loading gallery…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--kinship-cream)]">
        <div className="text-center space-y-2">
          <p className="text-red-500 text-sm font-medium">Failed to load gallery</p>
          <p className="text-[var(--kinship-mid)] text-xs max-w-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 text-sm bg-[var(--kinship-ink)] text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <GalleryClient manifests={manifests} />;
}
