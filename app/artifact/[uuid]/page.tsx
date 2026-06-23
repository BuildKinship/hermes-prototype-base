"use client";
// /artifact/[uuid] — looks up prototype UUID in Firestore, renders the right component
// AnonAuthGate (in artifact/layout.tsx) signs the visitor in anonymously before this renders

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPrototype, type FirestorePrototype } from "@/lib/firebase/firestore";
import { getPrototypeComponent } from "@/components/artifact/PrototypeRegistry";
import { useAuth } from "@/components/auth/AuthProvider";

export default function ArtifactPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const { user, loading: authLoading } = useAuth();
  const [proto, setProto] = useState<FirestorePrototype | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Wait until Firebase auth has resolved AND we have a user (anon or google)
    if (!uuid || authLoading || !user) return;

    getPrototype(uuid)
      .then((p) => {
        if (!p) setNotFound(true);
        else setProto(p);
      })
      .catch((err) => {
        console.error("Artifact Firestore error:", err);
        setError(err?.message ?? String(err));
      });
  }, [uuid, user, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--kinship-ink)]">
        <p className="text-[var(--kinship-dim)] text-sm">Loading…</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--kinship-ink)]">
        <div className="text-center">
          <p className="text-[var(--kinship-cream)] font-medium">Prototype not found</p>
          <p className="text-[var(--kinship-dim)] text-sm mt-1">
            The link may be invalid or the prototype has been removed.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--kinship-ink)]">
        <div className="text-center space-y-2">
          <p className="text-red-400 text-sm font-medium">Failed to load artifact</p>
          <p className="text-[var(--kinship-dim)] text-xs max-w-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 text-sm bg-[var(--kinship-cream)] text-[var(--kinship-ink)] rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!proto) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--kinship-ink)]">
        <p className="text-[var(--kinship-dim)] text-sm">Loading…</p>
      </div>
    );
  }

  // Survey prototypes redirect to their dedicated route
  if (proto.type === "survey" && (proto as FirestorePrototype & { survey_slug?: string }).survey_slug) {
    const surveySlug = (proto as FirestorePrototype & { survey_slug?: string }).survey_slug;
    if (typeof window !== "undefined") {
      window.location.href = `/artifact/${uuid}/survey/${surveySlug}`;
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--kinship-ink)]">
        <p className="text-[var(--kinship-dim)] text-sm">Redirecting…</p>
      </div>
    );
  }

  const Component = getPrototypeComponent(proto.slug);

  if (!Component) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--kinship-ink)]">
        <div className="text-center">
          <p className="text-[var(--kinship-cream)] font-medium">{proto.name ?? proto.slug}</p>
          <p className="text-[var(--kinship-dim)] text-sm mt-1">
            Component not yet registered for slug: {proto.slug}
          </p>
        </div>
      </div>
    );
  }

  return <Component />;
}
