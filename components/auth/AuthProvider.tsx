"use client";
// Manages Firebase Auth state for the whole app
// Provides Google sign-in + silent anonymous sign-in to all children

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isGoogleUser: boolean;
  isBuildkinshipUser: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAnon: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const isGoogleUser =
    user?.providerData?.some((p) => p.providerId === "google.com") ?? false;

  const isBuildkinshipUser =
    isGoogleUser &&
    (user?.email?.endsWith("@buildkinship.com") ||
      user?.email?.endsWith("@buildkinship.ai") ||
      false);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    // Hint the account chooser to show @buildkinship.com / @buildkinship.ai accounts
    // Note: hd only allows one domain hint — use .com since it's the primary GSuite domain
    provider.setCustomParameters({ hd: "buildkinship.com" });
    // If currently signed in anonymously, sign out first so the Google
    // credential fully replaces the session (not a link attempt)
    if (user && user.isAnonymous) {
      await signOut(auth);
    }
    await signInWithPopup(auth, provider);
  };

  const signInAnon = async () => {
    await signInAnonymously(auth);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isGoogleUser,
        isBuildkinshipUser,
        signInWithGoogle,
        signInAnon,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
