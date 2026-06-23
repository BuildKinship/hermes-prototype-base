"use client";
// Silently signs in artifact visitors with anonymous Firebase auth
// No UI shown to the user — auth happens in the background
// This enables Firestore writes (survey submissions) from public artifact pages

import { useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { FullPageSpinner } from "./FullPageSpinner";

export function AnonAuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, signInAnon } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      signInAnon().catch(console.error);
    }
  }, [loading, user, signInAnon]);

  if (loading) return <FullPageSpinner />;

  // Render children immediately — anon auth fires in background
  return <>{children}</>;
}
