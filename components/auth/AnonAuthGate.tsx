"use client";
// Silently signs in artifact visitors with anonymous Firebase auth
// No UI shown to the user — auth happens in the background
// This enables Firestore writes (survey submissions) from public artifact pages

import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { FullPageSpinner } from "./FullPageSpinner";

export function AnonAuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading, signInAnon } = useAuth();
  // Fallback: if Firebase auth hangs (e.g. Anonymous auth not yet enabled in console),
  // render children after 3 seconds regardless — artifacts must be publicly viewable.
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      signInAnon().catch(console.error);
    }
  }, [loading, user, signInAnon]);

  // Show spinner only while loading AND haven't timed out
  if (loading && !timedOut) return <FullPageSpinner />;

  return <>{children}</>;
}
