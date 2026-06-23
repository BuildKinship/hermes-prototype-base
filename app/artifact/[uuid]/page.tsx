"use client";
// /artifact/[uuid] — looks up prototype UUID in Firestore, renders the right component
// AnonAuthGate is applied by app/artifact/layout.tsx before this renders

import React, { useEffect, useState } from "react";
import { useParams, redirect } from "next/navigation";
import {
  getPrototype,
  type FirestorePrototype,
} from "@/lib/firebase/firestore";
import { getPrototypeComponent } from "@/components/artifact/PrototypeRegistry";

export default function ArtifactPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const [proto, setProto] = useState<FirestorePrototype | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!uuid) return;
    getPrototype(uuid).then((p) => {
      if (!p) {
        setNotFound(true);
      } else {
        setProto(p);
      }
    });
  }, [uuid]);

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--kinship-ink)]">
        <div className="text-center">
          <p className="text-[var(--kinship-cream)] font-medium">
            Prototype not found
          </p>
          <p className="text-[var(--kinship-dim)] text-sm mt-1">
            The link may be invalid or the prototype has been removed.
          </p>
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
          <p className="text-[var(--kinship-cream)] font-medium">
            {proto.name ?? proto.slug}
          </p>
          <p className="text-[var(--kinship-dim)] text-sm mt-1">
            Component not yet registered for slug: {proto.slug}
          </p>
        </div>
      </div>
    );
  }

  return <Component />;
}
