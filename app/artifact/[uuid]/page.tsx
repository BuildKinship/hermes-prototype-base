"use client";
// /artifact/[uuid] — looks up prototype UUID in Firestore, renders the right component
// AnonAuthGate (in artifact/layout.tsx) signs the visitor in anonymously before this renders

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getPrototype, type FirestorePrototype } from "@/lib/firebase/firestore";
import { getPrototypeComponent } from "@/components/artifact/PrototypeRegistry";
import { useAuth } from "@/components/auth/AuthProvider";

/** Sign-in gate shown for internal prototypes when the visitor is not a Kinship user */
function InternalAccessGate({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[var(--kinship-ink)] px-4">
      <div className="text-center max-w-sm">
        {/* Kinship wordmark / lock icon */}
        <div className="text-4xl mb-4">🔒</div>
        <h1 className="text-[var(--kinship-cream)] text-xl font-semibold mb-2">
          Internal Content
        </h1>
        <p className="text-[var(--kinship-mid)] text-sm leading-relaxed mb-6">
          This prototype is for Kinship team members only. Sign in with your
          @buildkinship.com or @buildkinship.ai account to continue.
        </p>
        <button
          onClick={onSignIn}
          className="flex items-center gap-3 mx-auto px-5 py-3 bg-white text-gray-800 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors shadow-sm"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path
              d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
              fill="#4285F4"
            />
            <path
              d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
              fill="#34A853"
            />
            <path
              d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
              fill="#FBBC05"
            />
            <path
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default function ArtifactPage() {
  const { uuid } = useParams<{ uuid: string }>();
  const { user, loading: authLoading, isBuildkinshipUser, signInWithGoogle } = useAuth();
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

  // ── Internal access gate ─────────────────────────────────────────────────────
  // If the prototype is marked internal, require a @buildkinship.com / .ai Google account.
  // The AnonAuthGate in layout.tsx already signed the user in anonymously — but anon users
  // are NOT Kinship users, so they'll see the gate and be prompted to sign in with Google.
  if (proto.internal && !isBuildkinshipUser) {
    return <InternalAccessGate onSignIn={signInWithGoogle} />;
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
